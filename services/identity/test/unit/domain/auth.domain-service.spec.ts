import { Test, TestingModule } from '@nestjs/testing';
import { AuthDomainService } from '../../../src/domain/services/auth.domain-service';
import { PasswordHashingService } from '../../../src/domain/services/password-hashing.service';
import { UserDomainEntity } from '../../../src/domain/entities/user.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';
import { TenantId } from '../../../src/domain/value-objects/tenant-id.vo';
import { UserRole, UserStatus } from '@tradeforge/common';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

describe('AuthDomainService', () => {
  let service: AuthDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthDomainService, PasswordHashingService],
    }).compile();
    service = module.get<AuthDomainService>(AuthDomainService);
  });

  const makeUser = (): UserDomainEntity =>
    new UserDomainEntity({
      id: '550e8400-e29b-41d4-a716-446655440001',
      tenantId: new TenantId('550e8400-e29b-41d4-a716-446655440000'),
      email: new Email('user@example.com'),
      passwordHash: '',
      fullName: 'Test User',
      role: UserRole.BUYER,
      status: UserStatus.ACTIVE,
      mfaEnabled: false,
      mfaSecret: null,
      lastLoginAt: null,
      createdAt: new Date(),
    });

  describe('validateCredentials', () => {
    it('should return true for correct password', async () => {
      const hash = await bcrypt.hash('SecurePass1!', 10);
      const result = await service.validateCredentials('SecurePass1!', hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hash = await bcrypt.hash('SecurePass1!', 10);
      const result = await service.validateCredentials('WrongPass!', hash);
      expect(result).toBe(false);
    });
  });

  describe('generateTokenPayload', () => {
    it('should generate correct payload', () => {
      const user = makeUser();
      const payload = service.generateTokenPayload(user);
      expect(payload.sub).toBe(user.id);
      expect(payload.email).toBe(user.email.value);
      expect(payload.tenantId).toBe(user.tenantId.value);
      expect(payload.role).toBe(UserRole.BUYER);
    });
  });

  describe('validateMfaToken', () => {
    it('should return true for valid TOTP token', () => {
      const secretObj = speakeasy.generateSecret({ length: 20 });
      const token = speakeasy.totp({ secret: secretObj.base32, encoding: 'base32' });
      const result = service.validateMfaToken(secretObj.base32, token);
      expect(result).toBe(true);
    });

    it('should return false for invalid token', () => {
      const secretObj = speakeasy.generateSecret({ length: 20 });
      const result = service.validateMfaToken(secretObj.base32, '000000');
      expect(result).toBe(false);
    });
  });
});
