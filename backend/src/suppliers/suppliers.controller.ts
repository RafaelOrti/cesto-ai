import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { EanService } from './services/ean.service';
import { CampaignService } from './services/campaign.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(
    private readonly suppliersService: SuppliersService,
    private readonly eanService: EanService,
    private readonly campaignService: CampaignService,
  ) {}

  /**
   * Get supplier dashboard data
   * GET /api/v1/suppliers/:id/dashboard
   */
  @Get(':id/dashboard')
  async getDashboard(@Param('id') id: string) {
    return {
      supplier_id: id,
      stats: {
        total_products: await this.suppliersService.getProductCount(id),
        active_campaigns: await this.campaignService.getActiveCampaignsCount(id),
        pending_orders: 0,
        total_revenue: 0
      },
      recent_activities: [],
      notifications: []
    };
  }

  /**
   * Get supplier products
   * GET /api/v1/suppliers/:id/products
   */
  @Get(':id/products')
  async getProducts(
    @Param('id') id: string,
    @Query('category') category?: string,
    @Query('search') search?: string
  ) {
    return this.suppliersService.getProducts(id, { category, search });
  }

  /**
   * Add new product
   * POST /api/v1/suppliers/:id/products
   */
  @Post(':id/products')
  async addProduct(
    @Param('id') id: string,
    @Body() productData: any
  ) {
    return this.suppliersService.addProduct(id, productData);
  }

  /**
   * Update product
   * PUT /api/v1/suppliers/:id/products/:productId
   */
  @Put(':id/products/:productId')
  async updateProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Body() productData: any
  ) {
    return this.suppliersService.updateProduct(id, productId, productData);
  }

  /**
   * Digitize EAN code
   * POST /api/v1/suppliers/:id/ean/digitize
   */
  @Post(':id/ean/digitize')
  async digitizeEan(
    @Param('id') id: string,
    @Body() eanData: {
      ean_code: string;
      exact_quantity: number;
      moq: number;
      delivery_time_days: number;
      price: number;
      product_name?: string;
      description?: string;
    }
  ) {
    return this.eanService.digitizeEanCode(eanData.ean_code, id, eanData);
  }

  /**
   * Scan EAN code
   * POST /api/v1/suppliers/:id/ean/scan
   */
  @Post(':id/ean/scan')
  async scanEan(
    @Param('id') id: string,
    @Body() body: { ean_code: string }
  ) {
    return this.eanService.scanEanCode(body.ean_code, id);
  }

  /**
   * Get inventory
   * GET /api/v1/suppliers/:id/inventory
   */
  @Get(':id/inventory')
  async getInventory(
    @Param('id') id: string,
    @Query('low_stock') lowStock?: boolean
  ) {
    return this.suppliersService.getInventory(id, lowStock);
  }

  /**
   * Update stock quantity
   * PUT /api/v1/suppliers/:id/inventory/:productId/stock
   */
  @Put(':id/inventory/:productId/stock')
  async updateStock(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Body() body: { quantity: number }
  ) {
    return this.suppliersService.updateStock(id, productId, body.quantity);
  }

  /**
   * Get invoices
   * GET /api/v1/suppliers/:id/invoices
   */
  @Get(':id/invoices')
  async getInvoices(
    @Param('id') id: string,
    @Query('status') status?: string,
    @Query('billing_type') billingType?: string
  ) {
    return this.suppliersService.getInvoices(id, { status, billingType });
  }

  /**
   * Create invoice
   * POST /api/v1/suppliers/:id/invoices
   */
  @Post(':id/invoices')
  async createInvoice(
    @Param('id') id: string,
    @Body() invoiceData: {
      buyer_id: string;
      billing_type: string;
      line_items: any[];
      notes?: string;
    }
  ) {
    return this.suppliersService.createInvoice(id, invoiceData);
  }

  /**
   * Get campaigns
   * GET /api/v1/suppliers/:id/campaigns
   */
  @Get(':id/campaigns')
  async getCampaigns(@Param('id') id: string) {
    return this.campaignService.getCampaignsBySupplier(id);
  }

  /**
   * Create campaign (personalized offers, packs, discounts)
   * POST /api/v1/suppliers/:id/campaigns
   */
  @Post(':id/campaigns')
  async createCampaign(
    @Param('id') id: string,
    @Body() campaignData: {
      name: string;
      type: string;
      discount_percentage?: number;
      discount_amount?: number;
      min_order_quantity?: number;
      start_date?: Date;
      end_date?: Date;
      conditions?: any;
    }
  ) {
    return this.campaignService.createCampaign(id, campaignData);
  }

  /**
   * Get order history
   * GET /api/v1/suppliers/:id/orders
   */
  @Get(':id/orders')
  async getOrderHistory(
    @Param('id') id: string,
    @Query('status') status?: string,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string
  ) {
    return this.suppliersService.getOrderHistory(id, { status, dateFrom, dateTo });
  }
}


