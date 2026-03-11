import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { UserDomainEntity } from '../entities/user.entity';
import { PasswordHashingService } from './password-hashing.service';

export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class AuthDomainService {
  constructor(private readonly passwordHashingService: PasswordHashingService) {}

  async validateCredentials(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.passwordHashingService.comparePassword(plainPassword, passwordHash);
  }

  generateTokenPayload(user: UserDomainEntity): Omit<JwtPayload, 'type'> {
    return {
      sub: user.id,
      tenantId: user.tenantId.value,
      email: user.email.value,
      role: user.role,
    };
  }

  validateMfaToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }
}
