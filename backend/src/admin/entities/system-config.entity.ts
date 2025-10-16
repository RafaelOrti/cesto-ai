import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ConfigCategory {
  SYSTEM = 'system',
  PAYMENT = 'payment',
  NOTIFICATION = 'notification',
  INTEGRATION = 'integration',
  SECURITY = 'security',
  FEATURE_FLAGS = 'feature_flags'
}

@Entity('system_config')
export class SystemConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  config_key: string;

  @Column()
  config_value: string;

  @Column({
    type: 'enum',
    enum: ConfigCategory,
    default: ConfigCategory.SYSTEM
  })
  category: ConfigCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_sensitive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  validation_rules: any;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


