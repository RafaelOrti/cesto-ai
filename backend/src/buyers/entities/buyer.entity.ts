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
    enum: ProductCategory,
    array: true,
    default: [],
  })
  categories: ProductCategory[];

  @Column({ type: 'uuid', array: true, default: [] })
  preferredSuppliers: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.buyer)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];

  @OneToMany(() => Inventory, (inventory) => inventory.buyer)
  inventory: Inventory[];

  @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.buyer)
  shoppingLists: ShoppingList[];
}
