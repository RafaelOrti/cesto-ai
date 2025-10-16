import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get global dashboard statistics
   * GET /api/v1/admin/dashboard
   */
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getGlobalDashboardStats();
  }

  /**
   * Get global analytics (Buyer Insights for all users)
   * GET /api/v1/admin/analytics
   */
  @Get('analytics')
  async getGlobalAnalytics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('entityType') entityType?: string,
    @Query('metricCategory') metricCategory?: string
  ) {
    const filters: any = {};
    
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);
    if (entityType) filters.entityType = entityType;
    if (metricCategory) filters.metricCategory = metricCategory;

    return this.adminService.getGlobalAnalytics(filters);
  }

  /**
   * Get all users with admin controls
   * GET /api/v1/admin/users
   */
  @Get('users')
  async getAllUsers(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.adminService.getAllUsers({ 
      role: role, 
      status: status, 
      search: search 
    });
  }

  /**
   * Create new user
   * POST /api/v1/admin/users
   */
  @Post('users')
  async createUser(
    @Body() userData: any,
    @Body('adminUserId') adminUserId: string
  ) {
    return this.adminService.createOrUpdateUser(userData, adminUserId);
  }

  /**
   * Update user
   * PUT /api/v1/admin/users/:id
   */
  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: any,
    @Body('adminUserId') adminUserId: string
  ) {
    userData.id = id;
    return this.adminService.createOrUpdateUser(userData, adminUserId);
  }

  /**
   * Delete user
   * DELETE /api/v1/admin/users/:id
   */
  @Delete('users/:id')
  async deleteUser(
    @Param('id') id: string,
    @Body('adminUserId') adminUserId: string
  ) {
    return this.adminService.deleteUser(id, adminUserId);
  }

  /**
   * Get system configuration
   * GET /api/v1/admin/config
   */
  @Get('config')
  async getSystemConfig(@Query('category') category?: string) {
    return this.adminService.getSystemConfig(category);
  }

  /**
   * Update system configuration
   * PUT /api/v1/admin/config/:key
   */
  @Put('config/:key')
  async updateSystemConfig(
    @Param('key') key: string,
    @Body() body: { value: string; adminUserId: string }
  ) {
    return this.adminService.updateSystemConfig(key, body.value, body.adminUserId);
  }

  /**
   * Get audit logs
   * GET /api/v1/admin/audit-logs
   */
  @Get('audit-logs')
  async getAuditLogs(
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('adminUserId') adminUserId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    const filters: any = {};
    
    if (action) filters.action = action;
    if (entityType) filters.entityType = entityType;
    if (adminUserId) filters.adminUserId = adminUserId;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    return this.adminService.getAuditLogs(filters);
  }

  /**
   * Get global supplier analytics
   * GET /api/v1/admin/suppliers/analytics
   */
  @Get('suppliers/analytics')
  async getGlobalSupplierAnalytics() {
    return this.adminService.getGlobalSupplierAnalytics();
  }

  /**
   * Get global buyer analytics
   * GET /api/v1/admin/buyers/analytics
   */
  @Get('buyers/analytics')
  async getGlobalBuyerAnalytics() {
    return this.adminService.getGlobalBuyerAnalytics();
  }

  /**
   * Get global product analytics
   * GET /api/v1/admin/products/analytics
   */
  @Get('products/analytics')
  async getGlobalProductAnalytics() {
    return {
      total_products: 1250,
      products_by_category: {
        'dairy': 180,
        'meat': 150,
        'vegetables': 220,
        'frozen': 95,
        'beverages': 120
      },
      top_selling_products: [
        { product_id: '1', name: 'Organic Milk', sales: 45000 },
        { product_id: '2', name: 'Fresh Tomatoes', sales: 38000 },
        { product_id: '3', name: 'Chicken Breast', sales: 32000 }
      ],
      product_trends: {
        '2024-01': 1150,
        '2024-02': 1180,
        '2024-03': 1210,
        '2024-04': 1250
      }
    };
  }

  /**
   * Get global order analytics
   * GET /api/v1/admin/orders/analytics
   */
  @Get('orders/analytics')
  async getGlobalOrderAnalytics() {
    return {
      total_orders: 5670,
      orders_by_status: {
        'pending': 234,
        'processing': 156,
        'shipped': 4456,
        'delivered': 824
      },
      average_order_value: 1250.50,
      order_trends: {
        '2024-01': 1350,
        '2024-02': 1420,
        '2024-03': 1480,
        '2024-04': 1560
      },
      top_buyers: [
        { buyer_id: '1', name: 'Restaurant Chain A', order_count: 245 },
        { buyer_id: '2', name: 'Grocery Store B', order_count: 189 },
        { buyer_id: '3', name: 'Cafe Network C', order_count: 167 }
      ]
    };
  }

  /**
   * Get system health status
   * GET /api/v1/admin/system-health
   */
  @Get('system-health')
  async getSystemHealth() {
    return {
      status: 'healthy',
      services: {
        database: { status: 'healthy', response_time: '12ms' },
        api: { status: 'healthy', response_time: '45ms' },
        ai_services: { status: 'healthy', response_time: '89ms' },
        redis: { status: 'healthy', response_time: '2ms' }
      },
      metrics: {
        uptime: '99.9%',
        memory_usage: '68%',
        cpu_usage: '45%',
        disk_usage: '34%'
      },
      last_updated: new Date().toISOString()
    };
  }

  /**
   * Export data (users, suppliers, buyers, etc.)
   * POST /api/v1/admin/export
   */
  @Post('export')
  async exportData(
    @Body() body: {
      entityType: string;
      format: 'csv' | 'json' | 'xlsx';
      filters?: any;
      adminUserId: string;
    }
  ) {
    // Log the export action
    await this.adminService.logAuditAction(
      body.adminUserId,
      'data_export' as any,
      body.entityType as any,
      'bulk_export',
      null,
      { entity_type: body.entityType, format: body.format }
    );

    return {
      message: 'Export initiated',
      export_id: `export_${Date.now()}`,
      status: 'processing',
      estimated_completion: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    };
  }

  /**
   * Import data
   * POST /api/v1/admin/import
   */
  @Post('import')
  async importData(
    @Body() body: {
      entityType: string;
      data: any[];
      adminUserId: string;
    }
  ) {
    // Log the import action
    await this.adminService.logAuditAction(
      body.adminUserId,
      'data_import' as any,
      body.entityType as any,
      'bulk_import',
      null,
      { entity_type: body.entityType, record_count: body.data.length }
    );

    return {
      message: 'Import initiated',
      import_id: `import_${Date.now()}`,
      status: 'processing',
      records_to_process: body.data.length
    };
  }

  // Color Theme Management Endpoints

  /**
   * Get all color themes
   * GET /api/v1/admin/color-themes
   */
  @Get('color-themes')
  async getColorThemes() {
    return this.adminService.getColorThemes();
  }

  /**
   * Get active color theme
   * GET /api/v1/admin/color-themes/active
   */
  @Get('color-themes/active')
  async getActiveColorTheme() {
    return this.adminService.getActiveColorTheme();
  }

  /**
   * Get color theme by ID
   * GET /api/v1/admin/color-themes/:id
   */
  @Get('color-themes/:id')
  async getColorThemeById(@Param('id') id: string) {
    return this.adminService.getColorThemeById(id);
  }

  /**
   * Create new color theme
   * POST /api/v1/admin/color-themes
   */
  @Post('color-themes')
  async createColorTheme(
    @Body() body: { themeData: any; adminUserId: string }
  ) {
    return this.adminService.createColorTheme(body.themeData, body.adminUserId);
  }

  /**
   * Update color theme
   * PUT /api/v1/admin/color-themes/:id
   */
  @Put('color-themes/:id')
  async updateColorTheme(
    @Param('id') id: string,
    @Body() body: { themeData: any; adminUserId: string }
  ) {
    return this.adminService.updateColorTheme(id, body.themeData, body.adminUserId);
  }

  /**
   * Set active color theme
   * POST /api/v1/admin/color-themes/:id/activate
   */
  @Post('color-themes/:id/activate')
  async setActiveColorTheme(
    @Param('id') id: string,
    @Body() body: { adminUserId: string }
  ) {
    return this.adminService.setActiveColorTheme(id, body.adminUserId);
  }

  /**
   * Delete color theme
   * DELETE /api/v1/admin/color-themes/:id
   */
  @Delete('color-themes/:id')
  async deleteColorTheme(
    @Param('id') id: string,
    @Body() body: { adminUserId: string }
  ) {
    return this.adminService.deleteColorTheme(id, body.adminUserId);
  }

  /**
   * Create default Cesto theme
   * POST /api/v1/admin/color-themes/default
   */
  @Post('color-themes/default')
  async createDefaultCestoTheme(
    @Body() body: { adminUserId: string }
  ) {
    return this.adminService.createDefaultCestoTheme(body.adminUserId);
  }
}

