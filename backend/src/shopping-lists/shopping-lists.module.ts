import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnhancedShoppingListController } from './controllers/enhanced-shopping-list.controller';
import { EnhancedShoppingListService } from './services/enhanced-shopping-list.service';
import { ShoppingList } from './entities/shopping-list.entity';
import { ShoppingListItem } from './entities/shopping-list-item.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingList, ShoppingListItem, Product, Order, OrderItem]),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [EnhancedShoppingListController],
  providers: [EnhancedShoppingListService],
  exports: [EnhancedShoppingListService],
})
export class ShoppingListsModule {}

