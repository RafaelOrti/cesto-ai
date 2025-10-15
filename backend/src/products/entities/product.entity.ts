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

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  unit: string;

  @Column({ unique: true, nullable: true })
  sku: string;

  @Column({ nullable: true })
  eanCode: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 1 })
  minOrderQuantity: number;

  @Column({ default: 7 })
  leadTimeDays: number;

  @Column({ default: true })
  isActive: boolean;

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
