export interface RoleDomainProps {
  id: string;
  name: string;
  permissions: string[];
  tenantId: string;
}

export class RoleDomainEntity {
  readonly id: string;
  name: string;
  permissions: string[];
  readonly tenantId: string;

  constructor(props: RoleDomainProps) {
    this.id = props.id;
    this.name = props.name;
    this.permissions = [...props.permissions];
    this.tenantId = props.tenantId;
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  addPermission(permission: string): void {
    if (!this.hasPermission(permission)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission: string): void {
    this.permissions = this.permissions.filter((p) => p !== permission);
  }
}
