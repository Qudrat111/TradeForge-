import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsEnum, Length } from 'class-validator';
import { TenantPlan, TenantStatus } from '@tradeforge/common';

// RLS enabled: ALTER TABLE tenants ENABLE ROW LEVEL SECURITY
// Policy: id = current_setting('app.current_tenant', true)::UUID

@Entity('tenants')
export class TenantEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  @IsNotEmpty()
  @Length(2, 100)
  slug!: string;

  @Column({
    type: 'enum',
    enum: TenantPlan,
  })
  @IsEnum(TenantPlan)
  plan!: TenantPlan;

  @Column({ type: 'varchar', length: 2, name: 'country_code' })
  @Length(2, 2)
  countryCode!: string;

  @Column({ type: 'jsonb', default: '{}' })
  settings!: Record<string, unknown>;

  @Index()
  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.PENDING,
  })
  @IsEnum(TenantStatus)
  status!: TenantStatus;

  @Column({ type: 'timestamp with time zone', name: 'verified_at', nullable: true })
  verifiedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;
}
