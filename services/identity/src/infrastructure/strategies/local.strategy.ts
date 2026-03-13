import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { AuthDomainService } from '../../domain/services/auth.domain-service';
import { UserDomainEntity } from '../../domain/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly authDomainService: AuthDomainService,
  ) {
    super({ usernameField: 'email', passReqToCallback: false });
  }

  async validate(email: string, password: string): Promise<UserDomainEntity> {
    // Local strategy does not have tenantId context; use JWT-based login instead.
    // This is kept for Passport compatibility; actual login goes through LoginHandler.
    const users = await this.userRepository.findByTenant('', 1, 1);
    const user = users[0]?.[0] ?? null;

    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.authDomainService.validateCredentials(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
