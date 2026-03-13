import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
@Index(['resource', 'action'], { unique: true })
export class PermissionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  resource!: string;

  @Column({ type: 'varchar', length: 100 })
  action!: string;

  @Column({ type: 'text', default: '' })
  description!: string;
}
