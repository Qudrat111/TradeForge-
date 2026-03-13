import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { UserRole, UserStatus } from '@tradeforge/common';
import { TenantEntity } from './tenant.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email!: string;

  @Column({ type: 'varchar', name: 'password_hash', select: false })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255, name: 'full_name' })
  @IsNotEmpty()
  fullName!: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  status!: UserStatus;

  @Column({ type: 'boolean', name: 'mfa_enabled', default: false })
  mfaEnabled!: boolean;

  @Column({ type: 'varchar', name: 'mfa_secret', nullable: true, select: false })
  mfaSecret!: string | null;

  @Column({ type: 'timestamp with time zone', name: 'last_login_at', nullable: true })
  lastLoginAt!: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => TenantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: TenantEntity;
}
