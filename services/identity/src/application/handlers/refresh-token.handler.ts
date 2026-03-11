import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { UnauthorizedError } from '@tradeforge/common';
import { RefreshTokenCommand } from '../commands/refresh-token.command';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { AuthDomainService, JwtPayload } from '../../domain/services/auth.domain-service';

@Injectable()
export class RefreshTokenHandler {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly authDomainService: AuthDomainService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<TokenResponseDto> {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret');

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(command.refreshToken, {
        secret: refreshSecret,
      });
    } catch (_err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedError('Token is not a refresh token');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (user === null || !user.canLogin()) {
      throw new UnauthorizedError('User not found or account is not active');
    }

    const basePayload = this.authDomainService.generateTokenPayload(user);
    const accessPayload: JwtPayload = { ...basePayload, type: 'access' };
    const refreshPayload: JwtPayload = { ...basePayload, type: 'refresh' };

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN_SECONDS', 900);
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    const accessToken = this.jwtService.sign(accessPayload);
    const newRefreshToken = this.jwtService.sign(refreshPayload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    const dto = new TokenResponseDto();
    dto.accessToken = accessToken;
    dto.refreshToken = newRefreshToken;
    dto.expiresIn = expiresIn;
    dto.tokenType = 'Bearer';
    return dto;
  }
}
