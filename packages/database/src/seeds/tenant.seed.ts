import { DataSource } from 'typeorm';
import { TenantEntity } from '../entities/tenant.entity';
import { TenantPlan, TenantStatus } from '@tradeforge/common';

export async function seedTenants(dataSource: DataSource): Promise<TenantEntity[]> {
  const repo = dataSource.getRepository(TenantEntity);

  const tenants: Partial<TenantEntity>[] = [
    {
      name: 'Acme Buyers Co.',
      slug: 'acme-buyers',
      plan: TenantPlan.PROFESSIONAL,
      countryCode: 'US',
      settings: { timezone: 'America/New_York', currency: 'USD' },
      status: TenantStatus.ACTIVE,
      verifiedAt: new Date('2024-01-15T00:00:00Z'),
    },
    {
      name: 'Global Supplies Ltd.',
      slug: 'global-supplies',
      plan: TenantPlan.ENTERPRISE,
      countryCode: 'DE',
      settings: { timezone: 'Europe/Berlin', currency: 'EUR' },
      status: TenantStatus.ACTIVE,
      verifiedAt: new Date('2024-02-01T00:00:00Z'),
    },
  ];

  const saved: TenantEntity[] = [];
  for (const data of tenants) {
    const existing = await repo.findOne({ where: { slug: data.slug as string } });
    if (!existing) {
      const entity = repo.create(data);
      saved.push(await repo.save(entity));
    } else {
      saved.push(existing);
    }
  }

  console.log(`Seeded ${saved.length} tenants`);
  return saved;
}
