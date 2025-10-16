import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { Product } from '../../products/entities/product.entity';

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
}


