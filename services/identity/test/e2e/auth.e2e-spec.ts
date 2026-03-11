import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserRole, UserStatus } from '@tradeforge/common';
import { IdentityModule } from '../../src/identity.module';
import { USER_REPOSITORY_TOKEN } from '../../src/domain/repositories/user.repository.interface';
import { UserDomainEntity } from '../../src/domain/entities/user.entity';
import { Email } from '../../src/domain/value-objects/email.vo';
import { TenantId } from '../../src/domain/value-objects/tenant-id.vo';
import * as bcrypt from 'bcrypt';

const TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';
const USER_ID = '550e8400-e29b-41d4-a716-446655440001';

describe('Auth E2E', () => {
  let app: INestApplication;
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
    publishUserRegistered: jest.fn().mockResolvedValue(undefined),
    publishUserLoggedIn: jest.fn().mockResolvedValue(undefined),
    publishRoleAssigned: jest.fn().mockResolvedValue(undefined),
    publishMfaEnabled: jest.fn().mockResolvedValue(undefined),
    onModuleInit: jest.fn().mockResolvedValue(undefined),
    onModuleDestroy: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    passwordHash = await bcrypt.hash('SecurePass1!', 10);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IdentityModule],
    })
      .overrideProvider(USER_REPOSITORY_TOKEN)
      .useValue(mockUserRepo)
      .overrideProvider('UserEventProducer')
      .useValue(mockEventProducer)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeUser = (): UserDomainEntity =>
    new UserDomainEntity({
      id: USER_ID,
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

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.save.mockResolvedValue(makeUser());

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          tenantId: TENANT_ID,
          email: 'user@example.com',
          password: 'SecurePass1!',
          fullName: 'Test User',
          role: UserRole.BUYER,
        })
        .expect(201);

      expect(res.body.data.email).toBe('user@example.com');
    });

    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          tenantId: TENANT_ID,
          email: 'not-an-email',
          password: 'SecurePass1!',
          fullName: 'Test User',
          role: UserRole.BUYER,
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should return tokens on valid login', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(makeUser());
      mockUserRepo.update.mockResolvedValue(makeUser());

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'SecurePass1!',
          tenantId: TENANT_ID,
        })
        .expect(200);

      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.tokenType).toBe('Bearer');
    });

    it('should return 401 for invalid credentials', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'ghost@example.com',
          password: 'SecurePass1!',
          tenantId: TENANT_ID,
        })
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user info with valid token', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(makeUser());
      mockUserRepo.update.mockResolvedValue(makeUser());
      mockUserRepo.findById.mockResolvedValue(makeUser());

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'SecurePass1!',
          tenantId: TENANT_ID,
        });

      const token: string = (loginRes.body as { data: { accessToken: string } }).data.accessToken;

      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data.email).toBe('user@example.com');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return new access token with valid refresh token', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(makeUser());
      mockUserRepo.update.mockResolvedValue(makeUser());
      mockUserRepo.findById.mockResolvedValue(makeUser());

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'SecurePass1!',
          tenantId: TENANT_ID,
        });

      const refreshToken: string = (loginRes.body as { data: { refreshToken: string } }).data.refreshToken;

      const res = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 401 with invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid.token.here' })
        .expect(401);
    });
  });
});
