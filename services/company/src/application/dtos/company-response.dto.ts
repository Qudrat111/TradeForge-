import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyStatus } from '../../domain/entities/company.entity';

export class CompanyResponseDto {
  @ApiProperty()
  id: string = '';

  @ApiProperty()
  tenantId: string = '';

  @ApiProperty()
  name: string = '';

  @ApiProperty()
  slug: string = '';

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiProperty()
  phone: string = '';

  @ApiProperty()
  email: string = '';

  @ApiProperty()
  industry: string = '';

  @ApiPropertyOptional()
  employeeCount?: number;

  @ApiPropertyOptional()
  annualRevenue?: number;

  @ApiProperty()
  taxId: string = '';

  @ApiProperty()
  countryCode: string = '';

  @ApiProperty({ enum: CompanyStatus })
  status: CompanyStatus = CompanyStatus.PENDING_VERIFICATION;

  @ApiPropertyOptional()
  verifiedAt?: Date | null;

  @ApiProperty()
  createdAt: Date = new Date();

  @ApiProperty()
  updatedAt: Date = new Date();
}
