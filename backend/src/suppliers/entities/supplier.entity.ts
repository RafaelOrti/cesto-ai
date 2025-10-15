import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { Campaign } from '../../campaigns/entities/campaign.entity';
import { ProductCategory } from '../../products/enums/product-category.enum';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
    array: true,
    default: [],
  })
  categories: ProductCategory[];

  @Column({ type: 'text', nullable: true })
  deliveryTerms: string;

  @Column({ type: 'text', nullable: true })
  paymentTerms: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumOrderAmount: number;

  @Column({ type: 'text', array: true, default: [] })
  deliveryAreas: string[];

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.supplier)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];

  @OneToMany(() => Order, (order) => order.supplier)
  orders: Order[];

  @OneToMany(() => Campaign, (campaign) => campaign.supplier)
  campaigns: Campaign[];
}
