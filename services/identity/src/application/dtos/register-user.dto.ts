import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '@tradeforge/common';

export class RegisterUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'SecurePass1!', description: 'Password (min 8 chars, uppercase, lowercase, number, special)' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.BUYER, description: 'User role' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Tenant ID (UUID)' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;
}
