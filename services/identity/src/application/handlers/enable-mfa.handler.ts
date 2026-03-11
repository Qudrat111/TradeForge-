import { Inject, Injectable } from '@nestjs/common';
import { ForbiddenError, NotFoundError } from '@tradeforge/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { EnableMfaCommand } from '../commands/enable-mfa.command';
import { MfaSetupResponseDto } from '../dtos/mfa-setup-response.dto';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.interface';

const ISSUER_NAME = 'TradeForge';

@Injectable()
export class EnableMfaHandler {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: EnableMfaCommand): Promise<MfaSetupResponseDto> {
    const user = await this.userRepository.findById(command.userId);
    if (user === null) {
      throw new NotFoundError('User', command.userId);
    }

    if (user.tenantId.value !== command.tenantId) {
      throw new ForbiddenError('Access denied');
    }

    const secretObj = speakeasy.generateSecret({
      name: `${ISSUER_NAME} (${user.email.value})`,
      length: 20,
    });

    await this.userRepository.update(user.id, { mfaSecret: secretObj.base32 });

    const otpauthUrl = secretObj.otpauth_url ?? `otpauth://totp/${ISSUER_NAME}:${user.email.value}?secret=${secretObj.base32}&issuer=${ISSUER_NAME}`;
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    const dto = new MfaSetupResponseDto();
    dto.secret = secretObj.base32;
    dto.otpauthUrl = otpauthUrl;
    dto.qrCodeUrl = qrCodeUrl;
    return dto;
  }
}
