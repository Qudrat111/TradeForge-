import { DataSource } from 'typeorm';
import * as crypto from 'crypto';
import { UserEntity } from '../entities/user.entity';
import { TenantEntity } from '../entities/tenant.entity';
import { UserRole, UserStatus } from '@tradeforge/common';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export async function seedUsers(
  dataSource: DataSource,
  tenants: TenantEntity[],
): Promise<UserEntity[]> {
  const repo = dataSource.getRepository(UserEntity);

  const buyerTenant = tenants.find((t) => t.slug === 'acme-buyers');
  const supplierTenant = tenants.find((t) => t.slug === 'global-supplies');

  if (!buyerTenant || !supplierTenant) {
    throw new Error('Required tenants not found. Run tenant seed first.');
  }

  const usersData: Partial<UserEntity>[] = [
    {
      tenantId: buyerTenant.id,
      email: 'admin@acme-buyers.com',
      passwordHash: hashPassword('Admin@12345!'),
      fullName: 'Alice Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      mfaEnabled: false,
    },
    {
      tenantId: buyerTenant.id,
      email: 'buyer@acme-buyers.com',
      passwordHash: hashPassword('Buyer@12345!'),
      fullName: 'Bob Buyer',
      role: UserRole.BUYER,
      status: UserStatus.ACTIVE,
      mfaEnabled: false,
    },
    {
      tenantId: supplierTenant.id,
      email: 'admin@global-supplies.com',
      passwordHash: hashPassword('Admin@12345!'),
      fullName: 'Clara Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      mfaEnabled: true,
    },
    {
      tenantId: supplierTenant.id,
      email: 'supplier@global-supplies.com',
      passwordHash: hashPassword('Supplier@12345!'),
      fullName: 'Derek Supplier',
      role: UserRole.SUPPLIER,
      status: UserStatus.ACTIVE,
      mfaEnabled: false,
    },
    {
      tenantId: supplierTenant.id,
      email: 'manager@global-supplies.com',
      passwordHash: hashPassword('Manager@12345!'),
      fullName: 'Eve Manager',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      mfaEnabled: false,
    },
  ];

  const saved: UserEntity[] = [];
  for (const data of usersData) {
    const existing = await repo.findOne({ where: { email: data.email as string } });
    if (!existing) {
      const entity = repo.create(data);
      saved.push(await repo.save(entity));
    } else {
      saved.push(existing);
    }
  }

  console.log(`Seeded ${saved.length} users`);
  return saved;
}
