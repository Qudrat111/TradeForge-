import { Inject, Injectable } from '@nestjs/common';
import { paginate, IPaginatedResult } from '@tradeforge/common';
import { ListUsersQuery } from '../queries/list-users.query';
import { UserResponseDto, PaginatedUsersResponseDto } from '../dtos/user-response.dto';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { UserDomainEntity } from '../../domain/entities/user.entity';

@Injectable()
export class ListUsersHandler {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: ListUsersQuery): Promise<PaginatedUsersResponseDto> {
    const [users, total] = await this.userRepository.findByTenant(
      query.tenantId,
      query.page,
      query.limit,
    );

    const dtos = users.map((user) => this.toResponseDto(user));
    const paginated: IPaginatedResult<UserResponseDto> = paginate(
      dtos,
      total,
      query.page,
      query.limit,
    );
    return PaginatedUsersResponseDto.from(paginated);
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
