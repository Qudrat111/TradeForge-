import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { UserEntity } from './user.entity';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  type!: string;

  @Column({ type: 'varchar', length: 2048 })
  @IsNotEmpty()
  url!: string;

  @Column({ type: 'bigint', name: 'size_bytes' })
  sizeBytes!: number;

  @Column({ type: 'uuid', name: 'uploaded_by', nullable: true })
  uploadedBy!: string | null;

  @Index()
  @Column({ type: 'varchar', length: 100, name: 'entity_type' })
  entityType!: string;

  @Index()
  @Column({ type: 'varchar', name: 'entity_id' })
  entityId!: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploader!: UserEntity | null;
}
