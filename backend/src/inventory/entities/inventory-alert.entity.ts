import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from './inventory.entity';
import { User } from '../../users/entities/user.entity';

export enum AlertType {
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  OVERSTOCK = 'overstock',
  PRICE_CHANGE = 'price_change',
  EXPIRY_WARNING = 'expiry_warning',
  SEASONAL_DEMAND = 'seasonal_demand',
  SUPPLIER_ISSUE = 'supplier_issue'
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed'
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

@Entity('inventory_alerts')
export class InventoryAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Inventory, inventory => inventory.alerts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @Column()
  inventoryId: string;

  @Column({
    type: 'enum',
    enum: AlertType,
    enumName: 'alert_type_enum'
  })
  type: AlertType;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    enumName: 'alert_status_enum',
    default: AlertStatus.ACTIVE
  })
  status: AlertStatus;

  @Column({
    type: 'enum',
    enum: AlertPriority,
    enumName: 'alert_priority_enum',
    default: AlertPriority.MEDIUM
  })
  priority: AlertPriority;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    thresholdValue?: number;
    currentValue?: number;
    previousValue?: number;
    percentageChange?: number;
    daysUntilExpiry?: number;
    supplierName?: string;
    productName?: string;
    category?: string;
    department?: string;
    flavor?: string;
    offerDetails?: any;
    campaignDetails?: any;
  };

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'acknowledgedBy' })
  acknowledgedBy: User;

  @Column({ nullable: true })
  acknowledgedByUserId: string;

  @Column({ type: 'text', nullable: true })
  acknowledgmentNotes: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'resolvedBy' })
  resolvedBy: User;

  @Column({ nullable: true })
  resolvedByUserId: string;

  @Column({ type: 'text', nullable: true })
  resolutionNotes: string;

  @Column({ type: 'timestamp', nullable: true })
  scheduledFor: Date;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ type: 'text', nullable: true })
  recurringPattern: string; // e.g., 'daily', 'weekly', 'monthly'

  @Column({ type: 'jsonb', nullable: true })
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
    webhook: boolean;
    webhookUrl?: string;
    recipients: string[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
