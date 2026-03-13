export enum TenantPlan {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface ITenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  countryCode: string;
  settings: Record<string, unknown>;
  status: TenantStatus;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
