import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('product_suppliers')
export class ProductSupplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  supplier_id: string;

  @Column()
  product_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock_quantity: number;

  @Column({ type: 'int', nullable: true })
  min_order_quantity: number;

  @Column({ type: 'int', nullable: true })
  max_order_quantity: number;

  @Column({ type: 'int', nullable: true })
  lead_time_days: number;

  @Column({ nullable: true })
  ean_code: string;

  @Column({ type: 'boolean', default: true })
  is_available: boolean;

  @Column({ type: 'text', nullable: true })
  supplier_notes: string;

  @Column({ type: 'jsonb', nullable: true })
  product_specifications: any;

  @Column({ type: 'timestamp', nullable: true })
  last_updated_stock: Date;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


