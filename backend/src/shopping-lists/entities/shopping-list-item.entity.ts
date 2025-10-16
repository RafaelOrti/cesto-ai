import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ShoppingList } from './shopping-list.entity';
import { Product } from '../../products/entities/product.entity';

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

  @Column({ default: false })
  isPurchased: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


