import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSupplier } from '../entities/product-supplier.entity';

@Injectable()
export class EanService {
  private readonly logger = new Logger(EanService.name);

  constructor(
    @InjectRepository(ProductSupplier)
    private productSupplierRepository: Repository<ProductSupplier>,
  ) {}

  /**
   * Digitize product EAN code with exact quantity, MOQ, delivery time
   * Based on comments: "Digitize product EAN codes to display exact quantity, MOQ, delivery time, etc."
   */
  async digitizeEanCode(
    eanCode: string,
    supplierId: string,
    productData: {
      exact_quantity: number;
      moq: number; // Minimum Order Quantity
      delivery_time_days: number;
      price: number;
      product_name?: string;
      description?: string;
    }
  ): Promise<ProductSupplier> {
    this.logger.log(`Digitizing EAN code ${eanCode} for supplier ${supplierId}`);

    // Validate EAN code format
    if (!this.validateEanCode(eanCode)) {
      throw new Error(`Invalid EAN code format: ${eanCode}`);
    }

    // Check if EAN code already exists
    const existingProduct = await this.productSupplierRepository.findOne({
      where: { ean_code: eanCode, supplier_id: supplierId }
    });

    if (existingProduct) {
      // Update existing product
      existingProduct.stock_quantity = productData.exact_quantity;
      existingProduct.min_order_quantity = productData.moq;
      existingProduct.lead_time_days = productData.delivery_time_days;
      existingProduct.price = productData.price;
      existingProduct.last_updated_stock = new Date();
      
      return this.productSupplierRepository.save(existingProduct);
    } else {
      // Create new product
      const newProduct = this.productSupplierRepository.create({
        supplier_id: supplierId,
        ean_code: eanCode,
        stock_quantity: productData.exact_quantity,
        min_order_quantity: productData.moq,
        lead_time_days: productData.delivery_time_days,
        price: productData.price,
        is_available: true,
        last_updated_stock: new Date(),
        product_specifications: {
          name: productData.product_name,
          description: productData.description,
          digitized_at: new Date()
        }
      });

      return this.productSupplierRepository.save(newProduct);
    }
  }

  /**
   * Scan EAN code and return product information
   */
  async scanEanCode(eanCode: string, supplierId: string): Promise<ProductSupplier | null> {
    this.logger.log(`Scanning EAN code ${eanCode} for supplier ${supplierId}`);

    const product = await this.productSupplierRepository.findOne({
      where: { ean_code: eanCode, supplier_id: supplierId }
    });

    if (product) {
      // Update last scan time
      product.last_updated_stock = new Date();
      await this.productSupplierRepository.save(product);
    }

    return product;
  }

  /**
   * Get all products by supplier with EAN codes
   */
  async getProductsBySupplier(supplierId: string): Promise<ProductSupplier[]> {
    return this.productSupplierRepository.find({
      where: { supplier_id: supplierId },
      order: { created_at: 'DESC' }
    });
  }

  /**
   * Update product stock via EAN code
   */
  async updateStockByEan(
    eanCode: string,
    supplierId: string,
    newQuantity: number
  ): Promise<ProductSupplier> {
    this.logger.log(`Updating stock for EAN ${eanCode} to ${newQuantity}`);

    const product = await this.productSupplierRepository.findOne({
      where: { ean_code: eanCode, supplier_id: supplierId }
    });

    if (!product) {
      throw new Error(`Product with EAN code ${eanCode} not found`);
    }

    product.stock_quantity = newQuantity;
    product.last_updated_stock = new Date();
    product.is_available = newQuantity > 0;

    return this.productSupplierRepository.save(product);
  }

  /**
   * Validate EAN code format
   */
  private validateEanCode(eanCode: string): boolean {
    // Basic EAN-13 validation
    if (!/^\d{13}$/.test(eanCode)) {
      return false;
    }

    // Check digit validation
    const digits = eanCode.split('').map(Number);
    const checkDigit = digits.pop();
    
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    
    const calculatedCheckDigit = (10 - (sum % 10)) % 10;
    return calculatedCheckDigit === checkDigit;
  }

  /**
   * Generate EAN code for new product
   */
  generateEanCode(supplierPrefix: string): string {
    // Generate a valid EAN-13 code with supplier prefix
    const baseCode = supplierPrefix.padEnd(12, '0');
    const digits = baseCode.split('').map(Number);
    
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return baseCode + checkDigit;
  }
}


