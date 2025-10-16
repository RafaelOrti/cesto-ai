import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PERMISSION_CHANGE = 'permission_change',
  CONFIG_CHANGE = 'config_change',
  DATA_EXPORT = 'data_export',
  DATA_IMPORT = 'data_import'
}

export enum AuditEntityType {
  USER = 'user',
  SUPPLIER = 'supplier',
  CLIENT = 'client',
  PRODUCT = 'product',
  ORDER = 'order',
  INVOICE = 'invoice',
  SYSTEM_CONFIG = 'system_config',
  CUSTOMER = 'customer',
  COLOR_THEME = 'color_theme'
}

@Entity('admin_audit_log')
export class AdminAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  admin_user_id: string;

  @Column({
    type: 'enum',
    enum: AuditAction
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditEntityType
  })
  entity_type: AuditEntityType;

  @Column({ type: 'uuid', nullable: true })
  entity_id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  old_values: any;

  @Column({ type: 'jsonb', nullable: true })
  new_values: any;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'boolean', default: false })
  is_successful: boolean;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

