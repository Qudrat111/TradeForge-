export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_VERIFICATION = 'pending_verification',
  VERIFIED = 'verified',
  SUSPENDED = 'suspended',
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export class CompanyDomainEntity {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: IAddress;
  industry: string;
  employeeCount: number;
  annualRevenue: number;
  taxId: string;
  countryCode: string;
  status: CompanyStatus;
  verifiedAt: Date | null;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;

  isVerified(): boolean {
    return this.status === CompanyStatus.VERIFIED && this.verifiedAt !== null;
  }

  canTrade(): boolean {
    return this.status === CompanyStatus.ACTIVE || this.status === CompanyStatus.VERIFIED;
  }

  verify(verifiedAt: Date): void {
    this.status = CompanyStatus.VERIFIED;
    this.verifiedAt = verifiedAt;
    this.updatedAt = new Date();
  }

  suspend(): void {
    this.status = CompanyStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.status = CompanyStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  updateInfo(data: Partial<CompanyDomainEntity>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }
}
