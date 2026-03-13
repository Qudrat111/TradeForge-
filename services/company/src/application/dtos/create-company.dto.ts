import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  street: string = '';

  @ApiProperty({ example: 'Dubai' })
  @IsString()
  @IsNotEmpty()
  city: string = '';

  @ApiProperty({ example: 'Dubai' })
  @IsString()
  @IsNotEmpty()
  state: string = '';

  @ApiProperty({ example: '00000' })
  @IsString()
  @IsNotEmpty()
  postalCode: string = '';

  @ApiProperty({ example: 'AE' })
  @IsString()
  @Length(2, 2)
  countryCode: string = '';
}

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Trading LLC' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  name: string = '';

  @ApiPropertyOptional({ example: 'Leading B2B trade company' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://acme.com' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: '+971501234567' })
  @IsString()
  @IsNotEmpty()
  phone: string = '';

  @ApiProperty({ example: 'contact@acme.com' })
  @IsEmail()
  email: string = '';

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto = new AddressDto();

  @ApiPropertyOptional({ example: 'Manufacturing' })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  employeeCount?: number;

  @ApiPropertyOptional({ example: 1000000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  annualRevenue?: number;

  @ApiProperty({ example: 'AE123456789' })
  @IsString()
  @IsNotEmpty()
  taxId: string = '';

  @ApiProperty({ example: 'AE' })
  @IsString()
  @Length(2, 2)
  countryCode: string = '';
}
