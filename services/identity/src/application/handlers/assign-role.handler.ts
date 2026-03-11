import { Inject, Injectable } from '@nestjs/common';
import { ForbiddenError, NotFoundError } from '@tradeforge/common';
import { UserRole } from '@tradeforge/common';
import { v4 as uuidv4 } from 'uuid';
import { AssignRoleCommand } from '../commands/assign-role.command';
import { UserResponseDto } from '../dtos/user-response.dto';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { UserEventProducer } from '../../infrastructure/messaging/user-event.producer';
import { UserDomainEntity } from '../../domain/entities/user.entity';

@Injectable()
export class AssignRoleHandler {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly userEventProducer: UserEventProducer,
  ) {}

  async execute(command: AssignRoleCommand): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(command.userId);
    if (user === null) {
      throw new NotFoundError('User', command.userId);
    }

    if (user.tenantId.value !== command.tenantId) {
      throw new ForbiddenError('Access denied to this user');
    }

    const newRole = command.role as UserRole;
    user.role = newRole;
    const updated = await this.userRepository.update(user.id, { role: newRole });

    await this.userEventProducer.publishRoleAssigned({
      eventId: uuidv4(),
      tenantId: updated.tenantId.value,
      userId: updated.id,
      role: updated.role,
      assignedBy: command.assignedBy,
      timestamp: new Date().toISOString(),
    });

    return this.toResponseDto(updated);
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
