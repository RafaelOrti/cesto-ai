import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdiController } from './edi.controller';
import { EdiService } from './edi.service';
import { EdiDocument } from './entities/edi-document.entity';
import { ProductSupplier } from '../suppliers/entities/product-supplier.entity';
import { Invoice } from '../suppliers/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EdiDocument,
      ProductSupplier,
      Invoice
    ])
  ],
  controllers: [EdiController],
  providers: [EdiService],
  exports: [EdiService]
})
export class EdiModule {}


