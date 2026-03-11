import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { TokenResponseDto } from '../../application/dtos/token-response.dto';
import { MfaSetupResponseDto } from '../../application/dtos/mfa-setup-response.dto';
import { RegisterUserHandler } from '../../application/handlers/register-user.handler';
import { LoginHandler } from '../../application/handlers/login.handler';
import { RefreshTokenHandler } from '../../application/handlers/refresh-token.handler';
import { EnableMfaHandler } from '../../application/handlers/enable-mfa.handler';
import { VerifyMfaHandler } from '../../application/handlers/verify-mfa.handler';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { LoginCommand } from '../../application/commands/login.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token.command';
import { EnableMfaCommand } from '../../application/commands/enable-mfa.command';
import { VerifyMfaCommand } from '../../application/commands/verify-mfa.command';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { JwtPayload } from '../../domain/services/auth.domain-service';

class RefreshTokenDto {
  @ApiProperty({ description: 'JWT refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

class VerifyMfaDto {
  @ApiProperty({ description: 'TOTP token from authenticator app' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserHandler: RegisterUserHandler,
    private readonly loginHandler: LoginHandler,
    private readonly refreshTokenHandler: RefreshTokenHandler,
    private readonly enableMfaHandler: EnableMfaHandler,
    private readonly verifyMfaHandler: VerifyMfaHandler,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() dto: RegisterUserDto): Promise<UserResponseDto> {
    const command = new RegisterUserCommand(
      dto.tenantId,
      dto.email,
      dto.password,
      dto.fullName,
      dto.role,
    );
    return this.registerUserHandler.execute(command);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Ip() ip: string): Promise<TokenResponseDto> {
    const command = new LoginCommand(dto.email, dto.password, dto.tenantId, ip);
    return this.loginHandler.execute(command);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponseDto> {
    const command = new RefreshTokenCommand(dto.refreshToken);
    return this.refreshTokenHandler.execute(command);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (client should discard tokens)' })
  @ApiResponse({ status: 204, description: 'Logged out successfully' })
  logout(): void {
    // Stateless JWT: client discards the token.
    // For token revocation, a token blacklist (Redis) should be added.
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Current user', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() user: JwtPayload): Promise<{ id: string; email: string; tenantId: string; role: string }> {
    return {
      id: user.sub,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate MFA setup — returns QR code and secret' })
  @ApiResponse({ status: 200, description: 'MFA setup data', type: MfaSetupResponseDto })
  async setupMfa(@CurrentUser() user: JwtPayload): Promise<MfaSetupResponseDto> {
    const command = new EnableMfaCommand(user.sub, user.tenantId);
    return this.enableMfaHandler.execute(command);
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify MFA token and enable MFA on the account' })
  @ApiResponse({ status: 200, description: 'MFA enabled', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid MFA token' })
  async verifyMfa(
    @CurrentUser() user: JwtPayload,
    @Body() dto: VerifyMfaDto,
  ): Promise<UserResponseDto> {
    const command = new VerifyMfaCommand(user.sub, user.tenantId, dto.token);
    return this.verifyMfaHandler.execute(command);
  }
}
