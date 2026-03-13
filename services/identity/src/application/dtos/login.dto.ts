import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'SecurePass1!' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Tenant ID (UUID)' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;
}
