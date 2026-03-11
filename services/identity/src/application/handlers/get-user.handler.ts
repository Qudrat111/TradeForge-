import { Inject, Injectable } from '@nestjs/common';
import { ForbiddenError, NotFoundError } from '@tradeforge/common';
import { GetUserQuery } from '../queries/get-user.query';
import { UserResponseDto } from '../dtos/user-response.dto';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { UserDomainEntity } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserHandler {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(query.userId);
    if (user === null) {
      throw new NotFoundError('User', query.userId);
    }

    if (user.tenantId.value !== query.tenantId) {
      throw new ForbiddenError('Access denied to this user');
    }

    return this.toResponseDto(user);
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
