import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { InvoiceStatus } from '@tradeforge/common';

@Entity('invoices')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', name: 'invoice_number', unique: true })
  invoiceNumber!: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId!: string;

  @Column({ type: 'decimal', precision: 20, scale: 4 })
  amount!: number;

  @Column({ type: 'varchar', length: 3 })
  currency!: string;

  @Column({ type: 'timestamp with time zone', name: 'due_date' })
  dueDate!: Date;

  @Index()
  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  @IsEnum(InvoiceStatus)
  status!: InvoiceStatus;

  @Column({ type: 'varchar', name: 'pdf_url', nullable: true })
  pdfUrl!: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne('OrderEntity', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'order_id' })
  order!: unknown;
}
