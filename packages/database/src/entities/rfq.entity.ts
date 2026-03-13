import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsEnum, Length } from 'class-validator';
import { IRfqItem, RfqStatus } from '@tradeforge/common';
import { UserEntity } from './user.entity';

@Entity('rfqs')
export class RfqEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @Column({ type: 'uuid', name: 'buyer_id' })
  buyerId!: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 3 })
  @Length(3, 3)
  currency!: string;

  @Column({ type: 'timestamp with time zone' })
  deadline!: Date;

  @Index()
  @Column({ type: 'enum', enum: RfqStatus, default: RfqStatus.DRAFT })
  @IsEnum(RfqStatus)
  status!: RfqStatus;

  @Column({ type: 'jsonb' })
  items!: IRfqItem[];

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'buyer_id' })
  buyer!: UserEntity;
}
