import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from './inventory.entity';
import { User } from '../../users/entities/user.entity';

export enum MovementType {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  RETURN = 'return',
  DAMAGE = 'damage',
  EXPIRED = 'expired',
  THEFT = 'theft',
  CYCLE_COUNT = 'cycle_count'
}

export enum MovementReason {
  PURCHASE = 'purchase',
  SALE = 'sale',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  RETURN = 'return',
  DAMAGE = 'damage',
  EXPIRY = 'expiry',
  THEFT = 'theft',
  CYCLE_COUNT = 'cycle_count',
  CORRECTION = 'correction',
  INITIAL_STOCK = 'initial_stock'
}

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Inventory, inventory => inventory.movements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @Column()
  inventoryId: string;

  @Column({
    type: 'enum',
    enum: MovementType
  })
  type: MovementType;

  @Column({
    type: 'enum',
    enum: MovementReason
  })
  reason: MovementReason;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  quantityBefore: number;

  @Column({ type: 'int' })
  quantityAfter: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCost: number;

  @Column({ type: 'text', nullable: true })
  reference: string; // Order number, transfer reference, etc.

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  batchNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'performedBy' })
  performedBy: User;

  @Column({ nullable: true })
  performedByUserId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    supplierId?: string;
    supplierName?: string;
    orderId?: string;
    transferId?: string;
    damageDescription?: string;
    damagePhotos?: string[];
    cycleCountId?: string;
    temperature?: number;
    humidity?: number;
    qualityCheck?: boolean;
    qualityNotes?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

