import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsEnum, Min, Length } from 'class-validator';
import { RfqResponseStatus } from '@tradeforge/common';
import { RfqEntity } from './rfq.entity';

@Entity('rfq_responses')
export class RfqResponseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'rfq_id' })
  rfqId!: string;

  @Column({ type: 'varchar', name: 'supplier_tenant_id' })
  supplierTenantId!: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'unit_price' })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'total_price' })
  totalPrice!: number;

  @Column({ type: 'varchar', length: 3 })
  @Length(3, 3)
  currency!: string;

  @Column({ type: 'int', name: 'lead_time_days' })
  @Min(0)
  leadTimeDays!: number;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Index()
  @Column({
    type: 'enum',
    enum: RfqResponseStatus,
    default: RfqResponseStatus.PENDING,
  })
  @IsEnum(RfqResponseStatus)
  status!: RfqResponseStatus;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => RfqEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rfq_id' })
  rfq!: RfqEntity;
}
