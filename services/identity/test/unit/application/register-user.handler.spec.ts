import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserHandler } from '../../../src/application/handlers/register-user.handler';
import { RegisterUserCommand } from '../../../src/application/commands/register-user.command';
import { USER_REPOSITORY_TOKEN } from '../../../src/domain/repositories/user.repository.interface';
import { PasswordHashingService } from '../../../src/domain/services/password-hashing.service';
import { UserEventProducer } from '../../../src/infrastructure/messaging/user-event.producer';
import { UserDomainEntity } from '../../../src/domain/entities/user.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';
import { TenantId } from '../../../src/domain/value-objects/tenant-id.vo';
import { UserRole, UserStatus, ConflictError } from '@tradeforge/common';

const TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';

const makeSavedUser = (): UserDomainEntity =>
  new UserDomainEntity({
    id: '550e8400-e29b-41d4-a716-446655440001',
    tenantId: new TenantId(TENANT_ID),
    email: new Email('new@example.com'),
    passwordHash: '$2b$12$hashedpassword',
    fullName: 'New User',
    role: UserRole.BUYER,
    status: UserStatus.ACTIVE,
    mfaEnabled: false,
    mfaSecret: null,
    lastLoginAt: null,
    createdAt: new Date(),
  });

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  const mockUserRepo = {
    findByEmail: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByTenant: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    existsByEmail: jest.fn(),
  };
  const mockEventProducer = {
    publishUserRegistered: jest.fn(),
    publishUserLoggedIn: jest.fn(),
    publishRoleAssigned: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserHandler,
        PasswordHashingService,
        { provide: USER_REPOSITORY_TOKEN, useValue: mockUserRepo },
        { provide: UserEventProducer, useValue: mockEventProducer },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();
    handler = module.get<RegisterUserHandler>(RegisterUserHandler);
  });

  it('should register a new user successfully', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.save.mockResolvedValue(makeSavedUser());
    mockEventProducer.publishUserRegistered.mockResolvedValue(undefined);

    const command = new RegisterUserCommand(
      TENANT_ID,
      'new@example.com',
      'SecurePass1!',
      'New User',
      UserRole.BUYER,
    );

    const result = await handler.execute(command);

    expect(result.email).toBe('new@example.com');
    expect(result.fullName).toBe('New User');
    expect(result.role).toBe(UserRole.BUYER);
    expect(mockUserRepo.save).toHaveBeenCalledTimes(1);
    expect(mockEventProducer.publishUserRegistered).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictError when email already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(makeSavedUser());

    const command = new RegisterUserCommand(
      TENANT_ID,
      'new@example.com',
      'SecurePass1!',
      'New User',
      UserRole.BUYER,
    );

    await expect(handler.execute(command)).rejects.toThrow(ConflictError);
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should throw when password is invalid', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    const command = new RegisterUserCommand(
      TENANT_ID,
      'new@example.com',
      'weak',
      'New User',
      UserRole.BUYER,
    );

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
