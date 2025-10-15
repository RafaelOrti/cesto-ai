import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Buyer } from '../buyers/entities/buyer.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { ShoppingList } from '../shopping-lists/entities/shopping-list.entity';
import { ShoppingListItem } from '../shopping-lists/entities/shopping-list-item.entity';
import { Message } from '../messages/entities/message.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { CampaignProduct } from '../campaigns/entities/campaign-product.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'cesto_user'),
      password: this.configService.get('DB_PASSWORD', 'cesto_password'),
      database: this.configService.get('DB_NAME', 'cesto_ai'),
      entities: [
        User,
        Supplier,
        Buyer,
        Product,
        Order,
        OrderItem,
        Inventory,
        ShoppingList,
        ShoppingListItem,
        Message,
        Notification,
        Campaign,
        CampaignProduct,
        Invoice,
      ],
      synchronize: this.configService.get('NODE_ENV') === 'development',
      logging: this.configService.get('NODE_ENV') === 'development',
      ssl: this.configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
    };
  }
}
