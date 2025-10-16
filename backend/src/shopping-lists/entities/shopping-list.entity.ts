import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { ShoppingListItem } from './shopping-list-item.entity';

@Entity('shopping_lists')
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Buyer, buyer => buyer.shoppingLists)
  @JoinColumn({ name: 'buyerId' })
  buyer: Buyer;

  @Column()
  buyerId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => ShoppingListItem, item => item.shoppingList)
  items: ShoppingListItem[];
}


