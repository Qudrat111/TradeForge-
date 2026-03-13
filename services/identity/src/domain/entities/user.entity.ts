import { UserRole, UserStatus } from '@tradeforge/common';
import { Email } from '../value-objects/email.vo';
import { TenantId } from '../value-objects/tenant-id.vo';

export interface UserDomainProps {
  id: string;
  tenantId: TenantId;
  email: Email;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export class UserDomainEntity {
  readonly id: string;
  readonly tenantId: TenantId;
  readonly email: Email;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  lastLoginAt: Date | null;
  readonly createdAt: Date;

  constructor(props: UserDomainProps) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.fullName = props.fullName;
    this.role = props.role;
    this.status = props.status;
    this.mfaEnabled = props.mfaEnabled;
    this.mfaSecret = props.mfaSecret;
    this.lastLoginAt = props.lastLoginAt;
    this.createdAt = props.createdAt;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  canLogin(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  updateLastLogin(): void {
    this.lastLoginAt = new Date();
  }

  enableMfa(secret: string): void {
    this.mfaSecret = secret;
    this.mfaEnabled = true;
  }

  disableMfa(): void {
    this.mfaSecret = null;
    this.mfaEnabled = false;
  }
}
