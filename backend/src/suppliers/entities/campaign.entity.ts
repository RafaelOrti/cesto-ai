import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Supplier } from './supplier.entity';

export enum CampaignType {
  DISCOUNT = 'discount',
  PACK = 'pack',
  PERSONALIZED_OFFER = 'personalized_offer',
  SEASONAL = 'seasonal'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired'
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CampaignType,
    default: CampaignType.DISCOUNT
  })
  type: CampaignType;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT
  })
  status: CampaignStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount: number;

  @Column({ type: 'int', nullable: true })
  min_order_quantity: number;

  @Column({ type: 'int', nullable: true })
  max_order_quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  conditions: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  supplier_id: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


