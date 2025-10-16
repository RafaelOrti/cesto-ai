import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // 'credit_card', 'bank_transfer', 'paypal', etc.

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  processingFeePercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  processingFeeFixed: number;

  @Column({ type: 'jsonb', nullable: true })
  configuration: any;

  @CreateDateColumn()
  createdAt: Date;
}
