export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum MemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CompanyMemberDomainEntity {
  id: string;
  companyId: string;
  userId: string;
  tenantId: string;
  role: MemberRole;
  invitedAt: Date;
  joinedAt: Date | null;
  status: MemberStatus;

  accept(): void {
    this.status = MemberStatus.ACTIVE;
    this.joinedAt = new Date();
  }

  deactivate(): void {
    this.status = MemberStatus.INACTIVE;
  }

  isActive(): boolean {
    return this.status === MemberStatus.ACTIVE;
  }
}
