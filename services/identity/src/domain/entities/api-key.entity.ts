export interface ApiKeyDomainProps {
  id: string;
  tenantId: string;
  userId: string;
  keyHash: string;
  name: string;
  permissions: string[];
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
}

export class ApiKeyDomainEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly userId: string;
  readonly keyHash: string;
  readonly name: string;
  permissions: string[];
  lastUsedAt: Date | null;
  readonly expiresAt: Date | null;
  isActive: boolean;

  constructor(props: ApiKeyDomainProps) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.userId = props.userId;
    this.keyHash = props.keyHash;
    this.name = props.name;
    this.permissions = [...props.permissions];
    this.lastUsedAt = props.lastUsedAt;
    this.expiresAt = props.expiresAt;
    this.isActive = props.isActive;
  }

  isExpired(): boolean {
    if (this.expiresAt === null) return false;
    return this.expiresAt < new Date();
  }

  use(): void {
    this.lastUsedAt = new Date();
  }
}
