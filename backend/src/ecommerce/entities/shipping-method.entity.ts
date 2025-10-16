import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Entity('shipping_methods')
export class ShippingMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  supplierId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  freeShippingThreshold: number;

  @Column({ nullable: true })
  estimatedDaysMin: number;

  @Column({ nullable: true })
  estimatedDaysMax: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier, (supplier) => supplier.id)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;
}
