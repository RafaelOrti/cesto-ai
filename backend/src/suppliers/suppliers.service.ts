import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { ProductSupplier } from './entities/product-supplier.entity';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);

  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(ProductSupplier)
    private productSupplierRepository: Repository<ProductSupplier>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  /**
   * Get product count for supplier
   */
  async getProductCount(supplierId: string): Promise<number> {
    return this.productSupplierRepository.count({
      where: { supplier_id: supplierId }
    });
  }

  /**
   * Get products by supplier
   */
  async getProducts(supplierId: string, filters?: { category?: string; search?: string }) {
    const query = this.productSupplierRepository.createQueryBuilder('ps')
      .leftJoinAndSelect('ps.product', 'product')
      .where('ps.supplier_id = :supplierId', { supplierId });

    if (filters?.category) {
      query.andWhere('product.category = :category', { category: filters.category });
    }

    if (filters?.search) {
      query.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${filters.search}%`
      });
    }

    return query.getMany();
  }

  /**
   * Add new product to supplier catalog
   */
  async addProduct(supplierId: string, productData: any): Promise<ProductSupplier> {
    this.logger.log(`Adding product to supplier ${supplierId}`);

    const productSupplier = this.productSupplierRepository.create({
      supplier_id: supplierId,
      product_id: productData.product_id,
      price: productData.price,
      stock_quantity: productData.stock_quantity || 0,
      min_order_quantity: productData.min_order_quantity,
      max_order_quantity: productData.max_order_quantity,
      lead_time_days: productData.lead_time_days,
      ean_code: productData.ean_code,
      is_available: productData.is_available !== false,
      supplier_notes: productData.supplier_notes,
      product_specifications: productData.product_specifications
    });

    return this.productSupplierRepository.save(productSupplier);
  }

  /**
   * Update product
   */
  async updateProduct(supplierId: string, productId: string, productData: any): Promise<ProductSupplier> {
    const productSupplier = await this.productSupplierRepository.findOne({
      where: { supplier_id: supplierId, product_id: productId }
    });

    if (!productSupplier) {
      throw new Error('Product not found');
    }

    Object.assign(productSupplier, productData);
    return this.productSupplierRepository.save(productSupplier);
  }

  /**
   * Get inventory with optional low stock filter
   */
  async getInventory(supplierId: string, lowStock?: boolean) {
    const query = this.productSupplierRepository.createQueryBuilder('ps')
      .leftJoinAndSelect('ps.product', 'product')
      .where('ps.supplier_id = :supplierId', { supplierId });

    if (lowStock) {
      query.andWhere('ps.stock_quantity <= :threshold', { threshold: 10 });
    }

    return query.getMany();
  }

  /**
   * Update stock quantity
   */
  async updateStock(supplierId: string, productId: string, quantity: number): Promise<ProductSupplier> {
    const productSupplier = await this.productSupplierRepository.findOne({
      where: { supplier_id: supplierId, product_id: productId }
    });

    if (!productSupplier) {
      throw new Error('Product not found');
    }

    productSupplier.stock_quantity = quantity;
    productSupplier.is_available = quantity > 0;
    productSupplier.last_updated_stock = new Date();

    return this.productSupplierRepository.save(productSupplier);
  }

  /**
   * Get invoices by supplier
   */
  async getInvoices(supplierId: string, filters?: { status?: string; billingType?: string }) {
    const query = this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.buyer', 'buyer')
      .where('invoice.supplier_id = :supplierId', { supplierId });

    if (filters?.status) {
      query.andWhere('invoice.status = :status', { status: filters.status });
    }

    if (filters?.billingType) {
      query.andWhere('invoice.billing_type = :billingType', { billingType: filters.billingType });
    }

    return query.orderBy('invoice.created_at', 'DESC').getMany();
  }

  /**
   * Create invoice
   */
  async createInvoice(supplierId: string, invoiceData: any): Promise<Invoice> {
    this.logger.log(`Creating invoice for supplier ${supplierId}`);

    const invoice = this.invoiceRepository.create({
      invoice_number: this.generateInvoiceNumber(),
      supplier_id: supplierId,
      buyer_id: invoiceData.buyer_id,
      billing_type: invoiceData.billing_type,
      subtotal: invoiceData.subtotal,
      tax_amount: invoiceData.tax_amount || 0,
      discount_amount: invoiceData.discount_amount || 0,
      total_amount: invoiceData.total_amount,
      issue_date: new Date(),
      due_date: this.calculateDueDate(invoiceData.payment_terms_days || 30),
      payment_terms_days: invoiceData.payment_terms_days || 30,
      notes: invoiceData.notes,
      line_items: invoiceData.line_items,
      requires_edi: invoiceData.requires_edi || false
    });

    return this.invoiceRepository.save(invoice);
  }

  /**
   * Get order history
   */
  async getOrderHistory(supplierId: string, filters?: { status?: string; dateFrom?: string; dateTo?: string }) {
    // This would typically query an orders table
    // For now, return mock data
    return {
      supplier_id: supplierId,
      orders: [],
      filters: filters,
      message: 'Order history functionality will be implemented with orders module'
    };
  }

  private generateInvoiceNumber(): string {
    return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  private calculateDueDate(paymentTermsDays: number): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + paymentTermsDays);
    return dueDate;
  }
}


