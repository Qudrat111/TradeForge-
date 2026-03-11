import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from '@tradeforge/common';
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { RoleDomainEntity } from '../../domain/entities/role.entity';
import { RoleOrmEntity } from './entities/role-orm.entity';

@Injectable()
export class TypeOrmRoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly repo: Repository<RoleOrmEntity>,
  ) {}

  async findById(id: string): Promise<RoleDomainEntity | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByName(name: string, tenantId: string): Promise<RoleDomainEntity | null> {
    const entity = await this.repo.findOne({ where: { name, tenantId } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByTenant(tenantId: string): Promise<RoleDomainEntity[]> {
    const entities = await this.repo.find({ where: { tenantId } });
    return entities.map((e) => this.toDomain(e));
  }

  async save(role: RoleDomainEntity): Promise<RoleDomainEntity> {
    const orm = this.toOrm(role);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async update(id: string, data: Partial<RoleDomainEntity>): Promise<RoleDomainEntity> {
    const updatePayload: Partial<RoleOrmEntity> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.permissions !== undefined) updatePayload.permissions = data.permissions;

    await this.repo.update(id, updatePayload);

    const updated = await this.findById(id);
    if (updated === null) {
      throw new NotFoundError('Role', id);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: RoleOrmEntity): RoleDomainEntity {
    return new RoleDomainEntity({
      id: entity.id,
      name: entity.name,
      tenantId: entity.tenantId,
      permissions: entity.permissions.filter((p) => p.length > 0),
    });
  }

  private toOrm(domain: RoleDomainEntity): RoleOrmEntity {
    const entity = new RoleOrmEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.tenantId = domain.tenantId;
    entity.permissions = domain.permissions;
    return entity;
  }
}
