import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAnalytics } from './entities/admin-analytics.entity';
import { SystemConfig } from './entities/system-config.entity';
import { AdminAuditLog, AuditAction, AuditEntityType } from './entities/admin-audit-log.entity';
import { ColorTheme } from './entities/color-theme.entity';
import { User } from '../users/entities/user.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Buyer } from '../buyers/entities/buyer.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(AdminAnalytics)
    private analyticsRepository: Repository<AdminAnalytics>,
    @InjectRepository(SystemConfig)
    private configRepository: Repository<SystemConfig>,
    @InjectRepository(AdminAuditLog)
    private auditLogRepository: Repository<AdminAuditLog>,
    @InjectRepository(ColorTheme)
    private colorThemeRepository: Repository<ColorTheme>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Get global dashboard statistics
   */
  async getGlobalDashboardStats() {
    const [
      totalUsers,
      totalSuppliers,
      totalBuyers,
      totalProducts,
      activeUsers,
      recentOrders
    ] = await Promise.all([
      this.userRepository.count(),
      this.supplierRepository.count(),
      this.buyerRepository.count(),
      this.productRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.getRecentOrdersCount()
    ]);

    return {
      total_users: totalUsers,
      total_suppliers: totalSuppliers,
      total_buyers: totalBuyers,
      total_products: totalProducts,
      active_users: activeUsers,
      recent_orders: recentOrders,
      system_health: await this.getSystemHealth(),
      revenue_stats: await this.getRevenueStats()
    };
  }

  /**
   * Get global analytics data (similar to Buyer Insights but for all users)
   */
  async getGlobalAnalytics(filters: {
    dateFrom?: Date;
    dateTo?: Date;
    entityType?: string;
    metricCategory?: string;
  }) {
    const query = this.analyticsRepository.createQueryBuilder('analytics');

    if (filters.dateFrom) {
      query.andWhere('analytics.metric_date >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters.dateTo) {
      query.andWhere('analytics.metric_date <= :dateTo', { dateTo: filters.dateTo });
    }

    if (filters.entityType) {
      query.andWhere('analytics.entity_type = :entityType', { entityType: filters.entityType });
    }

    if (filters.metricCategory) {
      query.andWhere('analytics.metric_category = :metricCategory', { metricCategory: filters.metricCategory });
    }

    const analytics = await query
      .orderBy('analytics.metric_date', 'DESC')
      .getMany();

    return {
      analytics,
      summary: await this.getAnalyticsSummary(analytics),
      trends: await this.getAnalyticsTrends(analytics)
    };
  }

  /**
   * Get all users with admin controls
   */
  async getAllUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }) {
    const query = this.userRepository.createQueryBuilder('user');

    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.status) {
      const isActive = filters.status === 'active';
      query.andWhere('user.is_active = :isActive', { isActive });
    }

    if (filters?.search) {
      query.andWhere('(user.email ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search)', {
        search: `%${filters.search}%`
      });
    }

    return query
      .orderBy('user.created_at', 'DESC')
      .getMany();
  }

  /**
   * Create or update user (admin only)
   */
  async createOrUpdateUser(userData: any, adminUserId: string) {
    const isUpdate = !!userData.id;
    
    try {
      let user: User;
      
      if (isUpdate) {
        const existingUser = await this.userRepository.findOne({ where: { id: userData.id } });
        if (!existingUser) {
          throw new Error('User not found');
        }
        user = existingUser;
        Object.assign(user, userData);
        const savedUser = await this.userRepository.save(user);
        
        // Log the action
        await this.logAuditAction(
          adminUserId,
          AuditAction.UPDATE,
          AuditEntityType.USER,
          savedUser.id,
          userData,
          null
        );
        
        return savedUser;
      } else {
        const newUser = this.userRepository.create(userData as any);
        const savedUser = await this.userRepository.save(newUser) as any;
        
        // Log the action
        await this.logAuditAction(
          adminUserId,
          AuditAction.CREATE,
          AuditEntityType.USER,
          savedUser.id,
          null,
          userData
        );
        
        return savedUser;
      }
    } catch (error) {
      this.logger.error(`Error ${isUpdate ? 'updating' : 'creating'} user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string, adminUserId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.remove(user);

    // Log the action
    await this.logAuditAction(
      adminUserId,
      AuditAction.DELETE,
      AuditEntityType.USER,
      userId,
      user,
      null
    );

    return { message: 'User deleted successfully' };
  }

  /**
   * Get system configuration
   */
  async getSystemConfig(category?: string) {
    const query = this.configRepository.createQueryBuilder('config')
      .where('config.is_active = :isActive', { isActive: true });

    if (category) {
      query.andWhere('config.category = :category', { category });
    }

    return query.orderBy('config.category', 'ASC').getMany();
  }

  /**
   * Update system configuration
   */
  async updateSystemConfig(configKey: string, configValue: string, adminUserId: string) {
    const config = await this.configRepository.findOne({ where: { config_key: configKey } });
    
    if (!config) {
      throw new Error('Configuration not found');
    }

    const oldValue = config.config_value;
    config.config_value = configValue;
    config.updated_by = adminUserId;

    const savedConfig = await this.configRepository.save(config);

    // Log the action
    await this.logAuditAction(
      adminUserId,
      AuditAction.CONFIG_CHANGE,
      AuditEntityType.SYSTEM_CONFIG,
      configKey,
      { config_value: oldValue },
      { config_value: configValue }
    );

    return savedConfig;
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(filters?: {
    action?: AuditAction;
    entityType?: AuditEntityType;
    adminUserId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const query = this.auditLogRepository.createQueryBuilder('log');

    if (filters?.action) {
      query.andWhere('log.action = :action', { action: filters.action });
    }

    if (filters?.entityType) {
      query.andWhere('log.entity_type = :entityType', { entityType: filters.entityType });
    }

    if (filters?.adminUserId) {
      query.andWhere('log.admin_user_id = :adminUserId', { adminUserId: filters.adminUserId });
    }

    if (filters?.dateFrom) {
      query.andWhere('log.created_at >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters?.dateTo) {
      query.andWhere('log.created_at <= :dateTo', { dateTo: filters.dateTo });
    }

    return query
      .orderBy('log.created_at', 'DESC')
      .getMany();
  }

  /**
   * Get global supplier analytics
   */
  async getGlobalSupplierAnalytics() {
    // This would aggregate all supplier data globally
    const suppliers = await this.supplierRepository.find({
      relations: ['user']
    });

    return {
      total_suppliers: suppliers.length,
      active_suppliers: suppliers.filter(s => s.isActive).length,
      suppliers_by_category: this.groupSuppliersByCategory(suppliers),
      top_performing_suppliers: await this.getTopPerformingSuppliers(),
      supplier_registration_trends: await this.getSupplierRegistrationTrends()
    };
  }

  /**
   * Get global buyer analytics
   */
  async getGlobalBuyerAnalytics() {
    const buyers = await this.buyerRepository.find({
      relations: ['user']
    });

    return {
      total_buyers: buyers.length,
      active_buyers: buyers.filter(b => b.isActive).length,
      buyers_by_industry: this.groupBuyersByIndustry(buyers),
      top_buyers_by_volume: await this.getTopBuyersByVolume(),
      buyer_activity_trends: await this.getBuyerActivityTrends()
    };
  }

  private async getRecentOrdersCount(): Promise<number> {
    // Mock implementation - in real app would query orders table
    return 156;
  }

  private async getSystemHealth() {
    return {
      database_status: 'healthy',
      api_status: 'healthy',
      ai_services_status: 'healthy',
      uptime: '99.9%'
    };
  }

  private async getRevenueStats() {
    return {
      total_revenue: 2500000,
      monthly_revenue: 208333,
      revenue_growth: 12.5
    };
  }

  private async getAnalyticsSummary(analytics: AdminAnalytics[]) {
    return {
      total_metrics: analytics.length,
      date_range: {
        from: analytics.length > 0 ? analytics[analytics.length - 1].metric_date : null,
        to: analytics.length > 0 ? analytics[0].metric_date : null
      }
    };
  }

  private async getAnalyticsTrends(analytics: AdminAnalytics[]) {
    // Mock implementation for trends analysis
    return {
      sales_trend: 'increasing',
      user_growth: 'stable',
      revenue_trend: 'increasing'
    };
  }

  private groupSuppliersByCategory(suppliers: Supplier[]) {
    // Mock implementation
    return {
      'food_beverage': 45,
      'agriculture': 23,
      'manufacturing': 18
    };
  }

  private groupBuyersByIndustry(buyers: Buyer[]) {
    // Mock implementation
    return {
      'restaurants': 67,
      'retail': 45,
      'wholesale': 32
    };
  }

  private async getTopPerformingSuppliers() {
    // Mock implementation
    return [
      { supplier_id: '1', name: 'Premium Foods', revenue: 250000 },
      { supplier_id: '2', name: 'Fresh Produce Co', revenue: 180000 },
      { supplier_id: '3', name: 'Quality Meats', revenue: 150000 }
    ];
  }

  private async getSupplierRegistrationTrends() {
    // Mock implementation
    return {
      '2024-01': 12,
      '2024-02': 15,
      '2024-03': 18,
      '2024-04': 22
    };
  }

  private async getTopBuyersByVolume() {
    // Mock implementation
    return [
      { buyer_id: '1', name: 'Restaurant Chain A', order_volume: 45000 },
      { buyer_id: '2', name: 'Grocery Store B', order_volume: 38000 },
      { buyer_id: '3', name: 'Cafe Network C', order_volume: 32000 }
    ];
  }

  private async getBuyerActivityTrends() {
    // Mock implementation
    return {
      '2024-01': 234,
      '2024-02': 267,
      '2024-03': 289,
      '2024-04': 312
    };
  }

  /**
   * Get all color themes
   */
  async getColorThemes(): Promise<ColorTheme[]> {
    return this.colorThemeRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  /**
   * Get active color theme
   */
  async getActiveColorTheme(): Promise<ColorTheme | null> {
    return this.colorThemeRepository.findOne({
      where: { is_active: true }
    });
  }

  /**
   * Get color theme by ID
   */
  async getColorThemeById(themeId: string): Promise<ColorTheme | null> {
    return this.colorThemeRepository.findOne({
      where: { id: themeId }
    });
  }

  /**
   * Create new color theme
   */
  async createColorTheme(themeData: Partial<ColorTheme>, adminUserId: string): Promise<ColorTheme> {
    try {
      const theme = this.colorThemeRepository.create({
        ...themeData,
        created_by: adminUserId,
        updated_by: adminUserId
      } as ColorTheme);

      const savedTheme = await this.colorThemeRepository.save(theme);

      // Log the action
      await this.logAuditAction(
        adminUserId,
        AuditAction.CREATE,
        AuditEntityType.COLOR_THEME,
        savedTheme.id,
        null,
        themeData
      );

      return savedTheme;
    } catch (error) {
      this.logger.error(`Error creating color theme: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update color theme
   */
  async updateColorTheme(themeId: string, themeData: Partial<ColorTheme>, adminUserId: string): Promise<ColorTheme> {
    const theme = await this.colorThemeRepository.findOne({ where: { id: themeId } });
    
    if (!theme) {
      throw new Error('Color theme not found');
    }

    const oldValues = { ...theme };
    Object.assign(theme, themeData);
    theme.updated_by = adminUserId;

    const savedTheme = await this.colorThemeRepository.save(theme);

    // Log the action
    await this.logAuditAction(
      adminUserId,
      AuditAction.UPDATE,
      AuditEntityType.COLOR_THEME,
      savedTheme.id,
      oldValues,
      themeData
    );

    return savedTheme;
  }

  /**
   * Set active color theme
   */
  async setActiveColorTheme(themeId: string, adminUserId: string): Promise<ColorTheme> {
    const theme = await this.colorThemeRepository.findOne({ where: { id: themeId } });
    
    if (!theme) {
      throw new Error('Color theme not found');
    }

    // Deactivate all other themes
    await this.colorThemeRepository.update(
      { is_active: true },
      { is_active: false, updated_by: adminUserId }
    );

    // Activate the selected theme
    theme.is_active = true;
    theme.updated_by = adminUserId;

    const savedTheme = await this.colorThemeRepository.save(theme);

    // Log the action
    await this.logAuditAction(
      adminUserId,
      AuditAction.UPDATE,
      AuditEntityType.COLOR_THEME,
      savedTheme.id,
      { is_active: false },
      { is_active: true }
    );

    return savedTheme;
  }

  /**
   * Delete color theme
   */
  async deleteColorTheme(themeId: string, adminUserId: string): Promise<void> {
    const theme = await this.colorThemeRepository.findOne({ where: { id: themeId } });
    
    if (!theme) {
      throw new Error('Color theme not found');
    }

    if (theme.is_default) {
      throw new Error('Cannot delete default theme');
    }

    await this.colorThemeRepository.remove(theme);

    // Log the action
    await this.logAuditAction(
      adminUserId,
      AuditAction.DELETE,
      AuditEntityType.COLOR_THEME,
      themeId,
      theme,
      null
    );
  }

  /**
   * Create default Cesto theme
   */
  async createDefaultCestoTheme(adminUserId: string): Promise<ColorTheme> {
    const defaultTheme = {
      theme_name: 'Cesto Default',
      description: 'Default Cesto theme with teal and gray colors',
      is_active: true,
      is_default: true,
      color_config: {
        primary: {
          main: '#008080',
          light: '#20B2AA',
          dark: '#006666',
          contrast: '#FFFFFF'
        },
        secondary: {
          main: '#E0E0E0',
          light: '#EDEDED',
          dark: '#BDBDBD',
          contrast: '#333333'
        },
        accent: {
          main: '#ADD8E6',
          light: '#B8DCE8',
          dark: '#8BC4D6',
          contrast: '#333333'
        },
        background: {
          primary: '#F5F5F5',
          secondary: '#FFFFFF',
          tertiary: '#FAFAFA'
        },
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8F8F8',
          elevated: '#FFFFFF'
        },
        text: {
          primary: '#333333',
          secondary: '#666666',
          disabled: '#999999',
          hint: '#CCCCCC'
        },
        border: {
          primary: '#E0E0E0',
          secondary: '#F0F0F0',
          focus: '#008080'
        },
        status: {
          success: '#008080',
          warning: '#FF6347',
          error: '#FF0000',
          info: '#ADD8E6'
        }
      },
      created_by: adminUserId,
      updated_by: adminUserId
    };

    return this.createColorTheme(defaultTheme, adminUserId);
  }

  async logAuditAction(
    adminUserId: string,
    action: AuditAction,
    entityType: AuditEntityType,
    entityId: string,
    oldValues: any,
    newValues: any
  ) {
    const auditLog = this.auditLogRepository.create({
      admin_user_id: adminUserId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      is_successful: true
    });

    await this.auditLogRepository.save(auditLog);
  }
}
