import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedError } from '@tradeforge/common';
import { LoginCommand } from '../commands/login.command';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { AuthDomainService, JwtPayload } from '../../domain/services/auth.domain-service';
import { UserEventProducer } from '../../infrastructure/messaging/user-event.producer';

@Injectable()
export class LoginHandler {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly authDomainService: AuthDomainService,
    private readonly userEventProducer: UserEventProducer,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: LoginCommand): Promise<TokenResponseDto> {
    const user = await this.userRepository.findByEmail(command.email, command.tenantId);
    if (user === null) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.canLogin()) {
      throw new UnauthorizedError('Account is not active');
    }

    const isValid = await this.authDomainService.validateCredentials(
      command.password,
      user.passwordHash,
    );
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    user.updateLastLogin();
    await this.userRepository.update(user.id, { lastLoginAt: user.lastLoginAt });

    const basePayload = this.authDomainService.generateTokenPayload(user);

    const accessPayload: JwtPayload = { ...basePayload, type: 'access' };
    const refreshPayload: JwtPayload = { ...basePayload, type: 'refresh' };

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN_SECONDS', 900);
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    const accessToken = this.jwtService.sign(accessPayload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    await this.userEventProducer.publishUserLoggedIn({
      eventId: uuidv4(),
      tenantId: user.tenantId.value,
      userId: user.id,
      ipAddress: command.ipAddress,
      timestamp: new Date().toISOString(),
    });

    const dto = new TokenResponseDto();
    dto.accessToken = accessToken;
    dto.refreshToken = refreshToken;
    dto.expiresIn = expiresIn;
    dto.tokenType = 'Bearer';
    return dto;
  }
}
