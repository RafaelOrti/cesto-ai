import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { EdiModule } from './edi/edi.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module';
import { InventoryModule } from './inventory/inventory.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AnalysisModule } from './analysis/analysis.module';
import { TeamModule } from './team/team.module';
import { TransactionsModule } from './transactions/transactions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SharedModule } from './shared/shared.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
// import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
      inject: [],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    SharedModule,
    AuthModule,
    EdiModule,
    SuppliersModule,
    AdminModule,
    UsersModule,
    EcommerceModule,
    ProductsModule,
    OrdersModule,
    ShoppingListsModule,
    InventoryModule,
    DashboardModule,
    AnalysisModule,
    TeamModule,
    TransactionsModule,
    NotificationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}