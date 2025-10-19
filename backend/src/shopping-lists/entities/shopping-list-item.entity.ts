import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ShoppingList } from './shopping-list.entity';
import { Product } from '../../products/entities/product.entity';

export enum ItemPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ItemStatus {
  PENDING = 'pending',
  IN_CART = 'in_cart',
  PURCHASED = 'purchased',
  CANCELLED = 'cancelled',
  OUT_OF_STOCK = 'out_of_stock'
}

@Entity('shopping_list_items')
export class ShoppingListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShoppingList, shoppingList => shoppingList.items)
  @JoinColumn({ name: 'shoppingListId' })
  shoppingList: ShoppingList;

  @Column()
  shoppingListId: string;

  @ManyToOne(() => Product, product => product.shoppingListItems)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: ItemPriority,
    default: ItemPriority.MEDIUM
  })
  priority: ItemPriority;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.PENDING
  })
  status: ItemStatus;

  @Column({ default: false })
  isPurchased: boolean;

  @Column({ type: 'timestamp', nullable: true })
  purchasedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  reminderDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  expectedPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualPrice: number;

  @Column({ type: 'jsonb', nullable: true })
  aiInsights: {
    predictedRestockDate?: Date;
    confidence?: number;
    pricePrediction?: number;
    seasonalDemand?: 'low' | 'medium' | 'high';
    alternativeProducts?: string[];
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


