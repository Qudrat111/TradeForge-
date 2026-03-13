import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsEnum, Length } from 'class-validator';
import { IShippingAddress, OrderStatus, PaymentStatus } from '@tradeforge/common';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', name: 'order_number', unique: true })
  @IsNotEmpty()
  orderNumber!: string;

  @Column({ type: 'uuid', name: 'buyer_tenant_id' })
  buyerTenantId!: string;

  @Column({ type: 'uuid', name: 'seller_tenant_id' })
  sellerTenantId!: string;

  @Column({ type: 'uuid', name: 'rfq_id', nullable: true })
  rfqId!: string | null;

  @Column({ type: 'varchar', length: 3 })
  @Length(3, 3)
  currency!: string;

  @Column({ type: 'decimal', precision: 20, scale: 4 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 20, scale: 4 })
  tax!: number;

  @Column({ type: 'decimal', precision: 20, scale: 4 })
  total!: number;

  @Index()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.DRAFT })
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    name: 'payment_status',
    default: PaymentStatus.UNPAID,
  })
  @IsEnum(PaymentStatus)
  paymentStatus!: PaymentStatus;

  @Column({ type: 'varchar', length: 3 })
  @Length(3, 3)
  incoterm!: string;

  @Column({ type: 'jsonb', name: 'shipping_address' })
  shippingAddress!: IShippingAddress;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items!: OrderItemEntity[];
}
