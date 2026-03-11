import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsEnum, Min } from 'class-validator';
import { II18nText, IProductPrice, ProductStatus } from '@tradeforge/common';
import { CategoryEntity } from './category.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  sku!: string;

  @Column({ type: 'jsonb' })
  @IsNotEmpty()
  name!: II18nText;

  @Column({ type: 'jsonb' })
  description!: II18nText;

  @Column({ type: 'uuid', name: 'category_id' })
  categoryId!: string;

  @Column({ type: 'jsonb' })
  prices!: IProductPrice[];

  @Column({ type: 'varchar', length: 20, name: 'hs_code' })
  hsCode!: string;

  @Column({ type: 'int' })
  @Min(1)
  moq!: number;

  @Column({ type: 'int', name: 'lead_time_days' })
  @Min(0)
  leadTimeDays!: number;

  @Index()
  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  @IsEnum(ProductStatus)
  status!: ProductStatus;

  @Column({ type: 'jsonb', default: '{}' })
  metadata!: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => CategoryEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity;
}
