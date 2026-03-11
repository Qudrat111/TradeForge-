import { UserDomainEntity } from '../entities/user.entity';

export const USER_REPOSITORY_TOKEN = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findById(id: string): Promise<UserDomainEntity | null>;
  findByEmail(email: string, tenantId: string): Promise<UserDomainEntity | null>;
  findByTenant(
    tenantId: string,
    page: number,
    limit: number,
  ): Promise<[UserDomainEntity[], number]>;
  save(user: UserDomainEntity): Promise<UserDomainEntity>;
  update(id: string, data: Partial<UserDomainEntity>): Promise<UserDomainEntity>;
  delete(id: string): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}
