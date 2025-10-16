import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { ShoppingListItem } from '../../shopping-lists/entities/shopping-list-item.entity';
import { CampaignProduct } from '../../campaigns/entities/campaign-product.entity';
import { ProductCategory } from '../enums/product-category.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  supplierId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({ nullable: true })
  subcategory: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column()
  unit: string;

  @Column({ unique: true, nullable: true })
  sku: string;

  @Column({ nullable: true })
  eanCode: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'text', array: true, default: '{}' })
  imageUrls: string[];

  @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  weight: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ default: 1 })
  minOrderQuantity: number;

  @Column({ nullable: true })
  maxOrderQuantity: number;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: 7 })
  leadTimeDays: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isOnSale: boolean;

  @Column({ nullable: true })
  saleStartDate: Date;

  @Column({ nullable: true })
  saleEndDate: Date;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  specifications: any;

  @Column({ type: 'jsonb', nullable: true })
  nutritionalInfo: any;

  @Column({ type: 'text', array: true, default: '{}' })
  allergens: string[];

  @Column({ nullable: true })
  originCountry: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  warrantyPeriod: number; // in months

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.00 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  salesCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventory: Inventory[];

  @OneToMany(() => ShoppingListItem, (shoppingListItem) => shoppingListItem.product)
  shoppingListItems: ShoppingListItem[];

  @OneToMany(() => CampaignProduct, (campaignProduct) => campaignProduct.product)
  campaignProducts: CampaignProduct[];
}
