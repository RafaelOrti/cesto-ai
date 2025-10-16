import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAnalytics } from './entities/admin-analytics.entity';
import { SystemConfig } from './entities/system-config.entity';
import { AdminAuditLog } from './entities/admin-audit-log.entity';
import { ColorTheme } from './entities/color-theme.entity';
import { User } from '../users/entities/user.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Buyer } from '../buyers/entities/buyer.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminAnalytics,
      SystemConfig,
      AdminAuditLog,
      ColorTheme,
      User,
      Supplier,
      Buyer,
      Product
    ])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}


