import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('wishlist')
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerId: string;

  @Column()
  productId: string;

  @CreateDateColumn()
  addedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Buyer, (buyer) => buyer.id)
  @JoinColumn({ name: 'buyerId' })
  buyer: Buyer;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
