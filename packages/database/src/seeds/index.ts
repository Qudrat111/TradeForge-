import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { seedTenants } from './tenant.seed';
import { seedUsers } from './user.seed';
import { seedProducts } from './product.seed';
import {
  TenantEntity,
  UserEntity,
  CategoryEntity,
  ProductEntity,
  RfqEntity,
  RfqResponseEntity,
  OrderEntity,
  OrderItemEntity,
  InvoiceEntity,
  DocumentEntity,
  AuditLogEntity,
  NotificationEntity,
} from '../entities';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT'] ?? 5432),
  username: process.env['DB_USER'] ?? 'postgres',
  password: process.env['DB_PASSWORD'] ?? 'postgres',
  database: process.env['DB_NAME'] ?? 'tradeforge',
  entities: [
    TenantEntity,
    UserEntity,
    CategoryEntity,
    ProductEntity,
    RfqEntity,
    RfqResponseEntity,
    OrderEntity,
    OrderItemEntity,
    InvoiceEntity,
    DocumentEntity,
    AuditLogEntity,
    NotificationEntity,
  ],
  synchronize: false,
  logging: false,
});

async function runSeeds(): Promise<void> {
  await dataSource.initialize();
  console.log('Database connected. Running seeds...');

  try {
    const tenants = await seedTenants(dataSource);
    await seedUsers(dataSource, tenants);
    await seedProducts(dataSource, tenants);

    console.log('All seeds completed successfully.');
  } finally {
    await dataSource.destroy();
  }
}

runSeeds().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
