import { Inject, Injectable } from '@nestjs/common';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@tradeforge/common';
import { VerifyMfaCommand } from '../commands/verify-mfa.command';
import { UserResponseDto } from '../dtos/user-response.dto';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';
import { AuthDomainService } from '../../domain/services/auth.domain-service';
import { UserDomainEntity } from '../../domain/entities/user.entity';

@Injectable()
export class VerifyMfaHandler {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly authDomainService: AuthDomainService,
  ) {}

  async execute(command: VerifyMfaCommand): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(command.userId);
    if (user === null) {
      throw new NotFoundError('User', command.userId);
    }

    if (user.tenantId.value !== command.tenantId) {
      throw new ForbiddenError('Access denied');
    }

    if (user.mfaSecret === null) {
      throw new UnauthorizedError('MFA setup not initiated. Call /auth/mfa/setup first');
    }

    const isValid = this.authDomainService.validateMfaToken(user.mfaSecret, command.token);
    if (!isValid) {
      throw new UnauthorizedError('Invalid MFA token');
    }

    user.enableMfa(user.mfaSecret);
    await this.userRepository.update(user.id, {
      mfaEnabled: true,
      mfaSecret: user.mfaSecret,
    });

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
