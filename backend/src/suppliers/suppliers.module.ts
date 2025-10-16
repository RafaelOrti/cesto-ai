import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersController } from './suppliers.controller';
import { SuppliersPublicController } from './suppliers-public.controller';
import { SuppliersService } from './suppliers.service';
import { EanService } from './services/ean.service';
import { CampaignService } from './services/campaign.service';
import { Supplier } from './entities/supplier.entity';
import { Campaign } from './entities/campaign.entity';
import { ProductSupplier } from './entities/product-supplier.entity';
import { Invoice } from './entities/invoice.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supplier,
      Campaign,
      ProductSupplier,
      Invoice,
      Product,
      User
    ])
  ],
  controllers: [SuppliersController, SuppliersPublicController],
  providers: [
    SuppliersService,
    EanService,
    CampaignService
  ],
  exports: [SuppliersService, EanService, CampaignService]
})
export class SuppliersModule {}

