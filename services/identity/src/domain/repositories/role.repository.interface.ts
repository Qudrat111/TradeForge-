import { RoleDomainEntity } from '../entities/role.entity';

export const ROLE_REPOSITORY_TOKEN = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  findById(id: string): Promise<RoleDomainEntity | null>;
  findByName(name: string, tenantId: string): Promise<RoleDomainEntity | null>;
  findByTenant(tenantId: string): Promise<RoleDomainEntity[]>;
  save(role: RoleDomainEntity): Promise<RoleDomainEntity>;
  update(id: string, data: Partial<RoleDomainEntity>): Promise<RoleDomainEntity>;
  delete(id: string): Promise<void>;
}
