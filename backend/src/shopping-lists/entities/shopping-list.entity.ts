import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { ShoppingListItem } from './shopping-list-item.entity';

export enum ShoppingListType {
  REGULAR = 'regular',
  SAVED_FOR_LATER = 'saved_for_later',
  WISHLIST = 'wishlist',
  RECURRING = 'recurring',
  SHARED = 'shared',
  AI_RECOMMENDED = 'ai_recommended'
}

export enum ShoppingListStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('shopping_lists')
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Buyer, buyer => buyer.shoppingLists)
  @JoinColumn({ name: 'buyerId' })
  buyer: Buyer;

  @Column()
  buyerId: string;

  @Column({
    type: 'enum',
    enum: ShoppingListType,
    default: ShoppingListType.REGULAR
  })
  type: ShoppingListType;

  @Column({
    type: 'enum',
    enum: ShoppingListStatus,
    default: ShoppingListStatus.ACTIVE
  })
  status: ShoppingListStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isShared: boolean;

  @Column({ type: 'text', array: true, default: [] })
  sharedWith: string[]; // User IDs who have access

  @Column({ type: 'timestamp', nullable: true })
  reminderDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedDate: Date;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'jsonb', nullable: true })
  aiInsights: {
    predictedRestockDate?: Date;
    confidence?: number;
    recommendations?: string[];
    seasonalFactors?: string[];
    priceTrends?: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    autoReorder: boolean;
    notificationFrequency: 'daily' | 'weekly' | 'monthly';
    priceAlerts: boolean;
    stockAlerts: boolean;
    seasonalReminders: boolean;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ShoppingListItem, item => item.shoppingList, { cascade: true })
  items: ShoppingListItem[];
}


