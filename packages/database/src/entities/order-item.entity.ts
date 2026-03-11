import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Min } from 'class-validator';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'order_id' })
  orderId!: string;

  @Column({ type: 'uuid', name: 'product_id' })
  productId!: string;

  @Column({ type: 'int' })
  @Min(1)
  quantity!: number;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'unit_price' })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'total_price' })
  totalPrice!: number;

  @Column({ type: 'varchar', length: 3 })
  currency!: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;
}
