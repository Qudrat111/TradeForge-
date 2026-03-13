import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ConflictError } from '@tradeforge/common';
import { UserRole, UserStatus } from '@tradeforge/common';
import { RegisterUserCommand } from '../commands/register-user.command';
import { UserResponseDto } from '../dtos/user-response.dto';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { UserDomainEntity } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { TenantId } from '../../domain/value-objects/tenant-id.vo';
import { PasswordHashingService } from '../../domain/services/password-hashing.service';
import { UserEventProducer } from '../../infrastructure/messaging/user-event.producer';

@Injectable()
export class RegisterUserHandler {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly userEventProducer: UserEventProducer,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<UserResponseDto> {
    const email = new Email(command.email);
    const tenantId = new TenantId(command.tenantId);

    const exists = await this.userRepository.findByEmail(email.value, tenantId.value);
    if (exists !== null) {
      throw new ConflictError(`A user with email ${email.value} already exists in this tenant`);
    }

    const password = Password.create(command.password);
    const passwordHash = await password.hash(12);

    const role = command.role as UserRole;

    const user = new UserDomainEntity({
      id: uuidv4(),
      tenantId,
      email,
      passwordHash,
      fullName: command.fullName,
      role,
      status: UserStatus.ACTIVE,
      mfaEnabled: false,
      mfaSecret: null,
      lastLoginAt: null,
      createdAt: new Date(),
    });

    const saved = await this.userRepository.save(user);

    await this.userEventProducer.publishUserRegistered({
      eventId: uuidv4(),
      tenantId: saved.tenantId.value,
      userId: saved.id,
      email: saved.email.value,
      role: saved.role,
      timestamp: new Date().toISOString(),
    });

    return this.toResponseDto(saved);
  }

  private toResponseDto(user: UserDomainEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.tenantId = user.tenantId.value;
    dto.email = user.email.value;
    dto.fullName = user.fullName;
    dto.role = user.role;
    dto.status = user.status;
    dto.mfaEnabled = user.mfaEnabled;
    dto.lastLoginAt = user.lastLoginAt;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
