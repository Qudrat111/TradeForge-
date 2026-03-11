import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginHandler } from '../../../src/application/handlers/login.handler';
import { LoginCommand } from '../../../src/application/commands/login.command';
import { USER_REPOSITORY_TOKEN } from '../../../src/domain/repositories/user.repository.interface';
import { AuthDomainService } from '../../../src/domain/services/auth.domain-service';
import { PasswordHashingService } from '../../../src/domain/services/password-hashing.service';
import { UserEventProducer } from '../../../src/infrastructure/messaging/user-event.producer';
import { UserDomainEntity } from '../../../src/domain/entities/user.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';
import { TenantId } from '../../../src/domain/value-objects/tenant-id.vo';
import { UserRole, UserStatus, UnauthorizedError } from '@tradeforge/common';
import * as bcrypt from 'bcrypt';

const TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let passwordHash: string;

  const mockUserRepo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    findByTenant: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    existsByEmail: jest.fn(),
  };
  const mockEventProducer = {
    publishUserLoggedIn: jest.fn(),
    publishUserRegistered: jest.fn(),
    publishRoleAssigned: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };
  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string, defaultVal: unknown) => {
      const config: Record<string, unknown> = {
        JWT_EXPIRES_IN_SECONDS: 900,
        JWT_REFRESH_SECRET: 'refresh-secret',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key] ?? defaultVal;
    }),
  };

  beforeAll(async () => {
    passwordHash = await bcrypt.hash('SecurePass1!', 10);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginHandler,
        AuthDomainService,
        PasswordHashingService,
        { provide: USER_REPOSITORY_TOKEN, useValue: mockUserRepo },
        { provide: UserEventProducer, useValue: mockEventProducer },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    handler = module.get<LoginHandler>(LoginHandler);
  });

  const makeUser = (): UserDomainEntity =>
    new UserDomainEntity({
      id: '550e8400-e29b-41d4-a716-446655440001',
      tenantId: new TenantId(TENANT_ID),
      email: new Email('user@example.com'),
      passwordHash,
      fullName: 'Test User',
      role: UserRole.BUYER,
      status: UserStatus.ACTIVE,
      mfaEnabled: false,
      mfaSecret: null,
      lastLoginAt: null,
      createdAt: new Date(),
    });

  it('should return tokens on successful login', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(makeUser());
    mockUserRepo.update.mockResolvedValue(makeUser());
    mockEventProducer.publishUserLoggedIn.mockResolvedValue(undefined);

    const command = new LoginCommand('user@example.com', 'SecurePass1!', TENANT_ID, '127.0.0.1');
    const result = await handler.execute(command);

    expect(result.accessToken).toBe('mock.jwt.token');
    expect(result.tokenType).toBe('Bearer');
    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    expect(mockEventProducer.publishUserLoggedIn).toHaveBeenCalledTimes(1);
  });

  it('should throw UnauthorizedError for non-existent user', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    const command = new LoginCommand('ghost@example.com', 'SecurePass1!', TENANT_ID, '127.0.0.1');
    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError for wrong password', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(makeUser());
    const command = new LoginCommand('user@example.com', 'WrongPass1!', TENANT_ID, '127.0.0.1');
    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError for inactive user', async () => {
    const inactiveUser = new UserDomainEntity({
      id: '550e8400-e29b-41d4-a716-446655440001',
      tenantId: new TenantId(TENANT_ID),
      email: new Email('user@example.com'),
      passwordHash,
      fullName: 'Test User',
      role: UserRole.BUYER,
      status: UserStatus.INACTIVE,
      mfaEnabled: false,
      mfaSecret: null,
      lastLoginAt: null,
      createdAt: new Date(),
    });
    mockUserRepo.findByEmail.mockResolvedValue(inactiveUser);
    const command = new LoginCommand('user@example.com', 'SecurePass1!', TENANT_ID, '127.0.0.1');
    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedError);
  });
});
