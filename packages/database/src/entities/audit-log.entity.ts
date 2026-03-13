import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @Index()
  @Column({ type: 'varchar', length: 100, name: 'entity_type' })
  @IsNotEmpty()
  entityType!: string;

  @Index()
  @Column({ type: 'varchar', name: 'entity_id' })
  @IsNotEmpty()
  entityId!: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  action!: string;

  @Column({ type: 'varchar', name: 'actor_id' })
  @IsNotEmpty()
  actorId!: string;

  @Column({ type: 'jsonb', nullable: true })
  changes!: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 45, name: 'ip_address', nullable: true })
  ipAddress!: string | null;

  @Index()
  @Column({ type: 'timestamp with time zone' })
  timestamp!: Date;
}
