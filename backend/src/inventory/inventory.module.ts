import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryAlert } from './entities/inventory-alert.entity';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { Buyer } from '../buyers/entities/buyer.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { AdvancedInventoryService } from './services/advanced-inventory.service';
import { AdvancedInventoryController } from './controllers/advanced-inventory.controller';
// import { AiService } from '../ai/ai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      InventoryAlert,
      InventoryMovement,
      Buyer,
      Product,
      User
    ])
  ],
  providers: [AdvancedInventoryService],
  controllers: [AdvancedInventoryController],
  exports: [AdvancedInventoryService]
})
export class InventoryModule {}
