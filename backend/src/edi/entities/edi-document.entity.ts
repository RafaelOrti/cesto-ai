import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Buyer } from '../../buyers/entities/buyer.entity';

export enum EdiDocumentType {
  PURCHASE_ORDER = 'purchase_order',
  INVOICE = 'invoice',
  PRODUCT_CATALOG = 'product_catalog',
  PRICE_CATALOG = 'price_catalog',
  INVENTORY_UPDATE = 'inventory_update',
  SHIPPING_NOTICE = 'shipping_notice',
  ACKNOWLEDGMENT = 'acknowledgment'
}

export enum EdiDocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  ERROR = 'error',
  REJECTED = 'rejected'
}

export enum EdiFormat {
  EDIFACT = 'edifact',
  X12 = 'x12',
  XML = 'xml',
  JSON = 'json',
  CSV = 'csv'
}

@Entity('edi_documents')
export class EdiDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  document_number: string;

  @Column({
    type: 'enum',
    enum: EdiDocumentType
  })
  document_type: EdiDocumentType;

  @Column({
    type: 'enum',
    enum: EdiFormat
  })
  format: EdiFormat;

  @Column({
    type: 'enum',
    enum: EdiDocumentStatus,
    default: EdiDocumentStatus.PENDING
  })
  status: EdiDocumentStatus;

  @Column({ nullable: true })
  sender_id: string;

  @Column({ nullable: true })
  receiver_id: string;

  @Column({ type: 'text' })
  raw_content: string;

  @Column({ type: 'jsonb', nullable: true })
  parsed_content: any;

  @Column({ type: 'jsonb', nullable: true })
  validation_errors: any;

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  received_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  processed_at: Date;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'boolean', default: false })
  is_automated: boolean;

  @Column({ type: 'boolean', default: false })
  requires_manual_review: boolean;

  @Column({ nullable: true })
  original_filename: string;

  @Column({ nullable: true })
  file_path: string;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: 'sender_id' })
  sender_supplier: Supplier;

  @ManyToOne(() => Buyer, { nullable: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver_buyer: Buyer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


