import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '@tradeforge/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserDomainEntity } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { TenantId } from '../../domain/value-objects/tenant-id.vo';
import { UserOrmEntity } from './entities/user-orm.entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<UserDomainEntity | null> {
    const entity = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .addSelect('user.mfaSecret')
      .where('user.id = :id', { id })
      .getOne();
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string, tenantId: string): Promise<UserDomainEntity | null> {
    const entity = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .addSelect('user.mfaSecret')
      .where('user.email = :email AND user.tenantId = :tenantId', { email, tenantId })
      .getOne();
    return entity ? this.toDomain(entity) : null;
  }

  async findByTenant(
    tenantId: string,
    page: number,
    limit: number,
  ): Promise<[UserDomainEntity[], number]> {
    const [entities, count] = await this.repo.findAndCount({
      where: { tenantId },
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });
    return [entities.map((e) => this.toDomain(e)), count];
  }

  async save(user: UserDomainEntity): Promise<UserDomainEntity> {
    const orm = this.toOrm(user);
    const saved = await this.repo.save(orm);
    saved.passwordHash = user.passwordHash;
    saved.mfaSecret = user.mfaSecret;
    return this.toDomain(saved);
  }

  async update(id: string, data: Partial<UserDomainEntity>): Promise<UserDomainEntity> {
    const updatePayload: Partial<UserOrmEntity> = {};

    if (data.fullName !== undefined) updatePayload.fullName = data.fullName;
    if (data.role !== undefined) updatePayload.role = data.role;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.mfaEnabled !== undefined) updatePayload.mfaEnabled = data.mfaEnabled;
    if (data.mfaSecret !== undefined) updatePayload.mfaSecret = data.mfaSecret;
    if (data.lastLoginAt !== undefined) updatePayload.lastLoginAt = data.lastLoginAt;
    if (data.passwordHash !== undefined) updatePayload.passwordHash = data.passwordHash;

    await this.repo.update(id, updatePayload);

    const updated = await this.findById(id);
    if (updated === null) {
      throw new NotFoundError('User', id);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repo.count({ where: { email } });
    return count > 0;
  }

  private toDomain(entity: UserOrmEntity): UserDomainEntity {
    return new UserDomainEntity({
      id: entity.id,
      tenantId: new TenantId(entity.tenantId),
      email: new Email(entity.email),
      passwordHash: entity.passwordHash ?? '',
      fullName: entity.fullName,
      role: entity.role,
      status: entity.status,
      mfaEnabled: entity.mfaEnabled,
      mfaSecret: entity.mfaSecret,
      lastLoginAt: entity.lastLoginAt,
      createdAt: entity.createdAt,
    });
  }

  private toOrm(domain: UserDomainEntity): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = domain.id;
    entity.tenantId = domain.tenantId.value;
    entity.email = domain.email.value;
    entity.passwordHash = domain.passwordHash;
    entity.fullName = domain.fullName;
    entity.role = domain.role;
    entity.status = domain.status;
    entity.mfaEnabled = domain.mfaEnabled;
    entity.mfaSecret = domain.mfaSecret;
    entity.lastLoginAt = domain.lastLoginAt;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
