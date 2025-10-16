import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderNumber: string;

  @ManyToOne(() => Buyer, buyer => buyer.orders)
  @JoinColumn({ name: 'buyerId' })
  buyer: Buyer;

  @Column()
  buyerId: string;

  @ManyToOne(() => Supplier, supplier => supplier.orders)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column()
  supplierId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];
}


