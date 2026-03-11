import { ApiProperty } from '@nestjs/swagger';

export class MfaSetupResponseDto {
  @ApiProperty({ description: 'Base32-encoded TOTP secret' })
  secret!: string;

  @ApiProperty({ description: 'OTPAuth URL for QR code generation' })
  otpauthUrl!: string;

  @ApiProperty({ description: 'QR code as data URL (base64 PNG)' })
  qrCodeUrl!: string;
}
