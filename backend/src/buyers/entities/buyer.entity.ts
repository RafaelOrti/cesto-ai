import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { ShoppingList } from '../../shopping-lists/entities/shopping-list.entity';
import { ProductCategory } from '../../products/enums/product-category.enum';

export enum BuyerCategory {
  MEAT = 'meat',
  DAIRY = 'dairy',
  PRODUCE = 'produce',
  FROZEN = 'frozen',
  READY_MEALS = 'ready_meals',
  FRUIT_VEGETABLES = 'fruit_vegetables',
  ICE_CREAM = 'ice_cream',
  SWEETS = 'sweets',
  CUPBOARD = 'cupboard',
  ALCOHOL = 'alcohol',
  TOBACCO = 'tobacco',
  BEVERAGES = 'beverages',
  BAKERY = 'bakery',
  SEAFOOD = 'seafood',
}

@Entity('buyers')
export class Buyer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  businessName: string;

  @Column({ nullable: true })
  businessType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: BuyerCategory,
    array: true,
    default: [],
  })
  categories: BuyerCategory[];

  @Column({ type: 'uuid', array: true, default: [] })
  preferredSuppliers: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.client)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];

  @OneToMany(() => Inventory, (inventory) => inventory.buyer)
  inventory: Inventory[];

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.buyer)
  shoppingLists: ShoppingList[];
}