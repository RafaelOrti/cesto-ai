import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Campaign } from './campaign.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('campaign_products')
export class CampaignProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Campaign, campaign => campaign.products)
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column()
  campaignId: string;

  @ManyToOne(() => Product, product => product.campaignProducts)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountedPrice: number;

  @Column({ default: 0 })
  discountPercentage: number;
}


