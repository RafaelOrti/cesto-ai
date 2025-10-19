import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { Product } from '../../products/entities/product.entity';
import { InventoryAlert, AlertType } from './inventory-alert.entity';
import { InventoryMovement } from './inventory-movement.entity';

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  OVERSTOCK = 'overstock',
  DISCONTINUED = 'discontinued'
}

export { AlertType };

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Buyer, buyer => buyer.inventory)
  @JoinColumn({ name: 'buyerId' })
  buyer: Buyer;

  @Column()
  buyerId: string;

  @ManyToOne(() => Product, product => product.inventory)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitCost: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  @Column({ default: 0 })
  minimumStock: number;

  @Column({ default: 0 })
  maximumStock: number;

  @Column({ default: 0 })
  reorderPoint: number;

  @Column({ default: 0 })
  reorderQuantity: number;

  @Column({
    type: 'enum',
    enum: InventoryStatus,
    default: InventoryStatus.IN_STOCK
  })
  status: InventoryStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastRestocked: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextRestockDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  supplier: string;

  @Column({ type: 'text', nullable: true })
  batchNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  aiInsights: {
    predictedDemand?: number;
    confidence?: number;
    seasonalFactors?: string[];
    priceTrends?: any;
    recommendedStock?: number;
    restockUrgency?: 'low' | 'medium' | 'high';
    alternativeProducts?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  alertSettings: {
    lowStockThreshold: number;
    overstockThreshold: number;
    priceChangeThreshold: number;
    expiryWarningDays: number;
    enableEmailAlerts: boolean;
    enableSmsAlerts: boolean;
    enablePushAlerts: boolean;
    alertFrequency: 'immediate' | 'daily' | 'weekly';
    departmentAlerts: string[];
    categoryAlerts: string[];
    flavorAlerts: string[];
    offerAlerts: boolean;
    campaignAlerts: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  costAnalysis: {
    averageCost: number;
    lastPurchaseCost: number;
    costVariance: number;
    totalValue: number;
    carryingCost: number;
    orderingCost: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => InventoryAlert, alert => alert.inventory, { cascade: true })
  alerts: InventoryAlert[];

  @OneToMany(() => InventoryMovement, movement => movement.inventory, { cascade: true })
  movements: InventoryMovement[];
}


