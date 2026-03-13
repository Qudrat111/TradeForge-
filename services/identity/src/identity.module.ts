import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { Kafka } from 'kafkajs';

import { jwtConfig } from './infrastructure/config/jwt.config';
import { authConfig } from './infrastructure/config/auth.config';

import { UserOrmEntity } from './infrastructure/persistence/entities/user-orm.entity';
import { RoleOrmEntity } from './infrastructure/persistence/entities/role-orm.entity';
import { PermissionOrmEntity } from './infrastructure/persistence/entities/permission-orm.entity';
import { ApiKeyOrmEntity } from './infrastructure/persistence/entities/api-key-orm.entity';

import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm-role.repository';
import { UserEventProducer, KAFKA_CLIENT_TOKEN } from './infrastructure/messaging/user-event.producer';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { TenantGuard } from './infrastructure/guards/tenant.guard';
import { ApiKeyGuard } from './infrastructure/guards/api-key.guard';

import { USER_REPOSITORY_TOKEN } from './domain/repositories/user.repository.interface';
import { ROLE_REPOSITORY_TOKEN } from './domain/repositories/role.repository.interface';
import { AuthDomainService } from './domain/services/auth.domain-service';
import { PasswordHashingService } from './domain/services/password-hashing.service';

import { RegisterUserHandler } from './application/handlers/register-user.handler';
import { LoginHandler } from './application/handlers/login.handler';
import { RefreshTokenHandler } from './application/handlers/refresh-token.handler';
import { GetUserHandler } from './application/handlers/get-user.handler';
import { ListUsersHandler } from './application/handlers/list-users.handler';
import { EnableMfaHandler } from './application/handlers/enable-mfa.handler';
import { VerifyMfaHandler } from './application/handlers/verify-mfa.handler';
import { AssignRoleHandler } from './application/handlers/assign-role.handler';

import { AuthController } from './presentation/controllers/auth.controller';
import { UserController } from './presentation/controllers/user.controller';
import { RoleController } from './presentation/controllers/role.controller';

const ormEntities = [UserOrmEntity, RoleOrmEntity, PermissionOrmEntity, ApiKeyOrmEntity];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, authConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'tradeforge_identity'),
        entities: ormEntities,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
        ssl: config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(ormEntities),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'default-jwt-secret-change-in-production'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m'),
          issuer: 'tradeforge-identity',
          audience: 'tradeforge',
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('RATE_LIMIT_WINDOW_MS', 60000),
            limit: config.get<number>('RATE_LIMIT_MAX', 60),
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UserController, RoleController],
  providers: [
    {
      provide: KAFKA_CLIENT_TOKEN,
      useFactory: (config: ConfigService) =>
        new Kafka({
          clientId: config.get<string>('KAFKA_CLIENT_ID', 'identity-service'),
          brokers: config.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
        }),
      inject: [ConfigService],
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: TypeOrmRoleRepository,
    },
    AuthDomainService,
    PasswordHashingService,
    UserEventProducer,
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
    RolesGuard,
    TenantGuard,
    ApiKeyGuard,
    RegisterUserHandler,
    LoginHandler,
    RefreshTokenHandler,
    GetUserHandler,
    ListUsersHandler,
    EnableMfaHandler,
    VerifyMfaHandler,
    AssignRoleHandler,
  ],
})
export class IdentityModule {}
