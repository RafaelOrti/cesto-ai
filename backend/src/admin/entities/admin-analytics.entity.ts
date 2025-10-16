import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin_analytics')
export class AdminAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  metric_name: string;

  @Column({ type: 'varchar', length: 100 })
  metric_category: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  metric_value: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  metric_unit: string;

  @Column({ type: 'jsonb', nullable: true })
  breakdown_data: any;

  @Column({ type: 'date' })
  metric_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  entity_type: string; // 'buyer', 'supplier', 'product', 'order', etc.

  @Column({ type: 'uuid', nullable: true })
  entity_id: string;

  @Column({ type: 'jsonb', nullable: true })
  additional_metadata: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


