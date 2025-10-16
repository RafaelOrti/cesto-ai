import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Buyer } from '../../buyers/entities/buyer.entity';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum BillingType {
  RESELLER = 'reseller',
  WHOLESALER = 'wholesaler',
  DISTRIBUTOR = 'distributor',
  RETAILER = 'retailer'
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoice_number: string;

  @Column()
  supplier_id: string;

  @Column()
  buyer_id: string;

  @Column({
    type: 'enum',
    enum: BillingType,
    default: BillingType.RETAILER
  })
  billing_type: BillingType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT
  })
  status: InvoiceStatus;

  @Column({ type: 'timestamp' })
  issue_date: Date;

  @Column({ type: 'timestamp' })
  due_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  paid_date: Date;

  @Column({ type: 'int', default: 30 })
  payment_terms_days: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  terms_conditions: string;

  @Column({ type: 'jsonb', nullable: true })
  line_items: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'boolean', default: false })
  requires_edi: boolean;

  @Column({ nullable: true })
  edi_document_id: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Buyer)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


