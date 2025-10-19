import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Inventory, InventoryStatus, AlertType } from '../entities/inventory.entity';
import { InventoryAlert, AlertStatus, AlertPriority } from '../entities/inventory-alert.entity';
import { InventoryMovement, MovementType, MovementReason } from '../entities/inventory-movement.entity';
import { Buyer } from '../../buyers/entities/buyer.entity';
import { Product } from '../../products/entities/product.entity';
// import { AiService } from '../../ai/ai.service';

export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  expiringSoon: number;
  averageStockTurnover: number;
  topCategories: Array<{ category: string; value: number; count: number }>;
  costAnalysis: {
    totalCarryingCost: number;
    totalOrderingCost: number;
    averageUnitCost: number;
    costVariance: number;
  };
  aiInsights: {
    recommendedRestocks: Array<{ productId: string; productName: string; recommendedQuantity: number; urgency: string }>;
    seasonalTrends: Array<{ category: string; trend: string; confidence: number }>;
    priceOptimization: Array<{ productId: string; currentPrice: number; suggestedPrice: number; potentialSavings: number }>;
  };
}

export interface AlertSettings {
  lowStockThreshold: number;
  overstockThreshold: number;
  priceChangeThreshold: number;
  expiryWarningDays: number;
  enableEmailAlerts: boolean;
  enableSmsAlerts: boolean;
  enablePushAlerts: boolean;
  alertFrequency: 'immediate' | 'daily' | 'weekly';
  departmentAlerts: string[];
  categoryAlerts: string[];
  flavorAlerts: string[];
  offerAlerts: boolean;
  campaignAlerts: boolean;
}

@Injectable()
export class AdvancedInventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryAlert)
    private alertRepository: Repository<InventoryAlert>,
    @InjectRepository(InventoryMovement)
    private movementRepository: Repository<InventoryMovement>,
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    // private aiService: AiService,
  ) {}

  async getInventoryAnalytics(buyerId: string): Promise<InventoryAnalytics> {
    const inventories = await this.inventoryRepository.find({
      where: { buyerId },
      relations: ['product', 'alerts', 'movements']
    });

    const totalValue = inventories.reduce((sum, inv) => sum + (inv.quantity * (inv.unitCost || 0)), 0);
    const totalItems = inventories.length;
    const lowStockItems = inventories.filter(inv => inv.status === InventoryStatus.LOW_STOCK).length;
    const outOfStockItems = inventories.filter(inv => inv.status === InventoryStatus.OUT_OF_STOCK).length;
    const overstockItems = inventories.filter(inv => inv.status === InventoryStatus.OVERSTOCK).length;
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringSoon = inventories.filter(inv => 
      inv.expiryDate && inv.expiryDate <= thirtyDaysFromNow
    ).length;

    // Calculate average stock turnover
    const averageStockTurnover = await this.calculateAverageStockTurnover(buyerId);

    // Group by categories
    const categoryMap = new Map<string, { value: number; count: number }>();
    inventories.forEach(inv => {
      const category = inv.product?.category || 'Unknown';
      const value = inv.quantity * (inv.unitCost || 0);
      const existing = categoryMap.get(category) || { value: 0, count: 0 };
      categoryMap.set(category, {
        value: existing.value + value,
        count: existing.count + 1
      });
    });

    const topCategories = Array.from(categoryMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Cost analysis
    const costAnalysis = this.calculateCostAnalysis(inventories);

    // AI insights
    const aiInsights = await this.generateAiInsights(buyerId, inventories);

    return {
      totalValue,
      totalItems,
      lowStockItems,
      outOfStockItems,
      overstockItems,
      expiringSoon,
      averageStockTurnover,
      topCategories,
      costAnalysis,
      aiInsights
    };
  }

  async updateAlertSettings(buyerId: string, productId: string, settings: Partial<AlertSettings>): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { buyerId, productId }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    inventory.alertSettings = {
      ...inventory.alertSettings,
      ...settings
    };

    return this.inventoryRepository.save(inventory);
  }

  async createAlert(
    inventoryId: string,
    type: AlertType,
    message: string,
    priority: AlertPriority = AlertPriority.MEDIUM,
    metadata?: any
  ): Promise<InventoryAlert> {
    const alert = this.alertRepository.create({
      inventoryId,
      type,
      message,
      priority,
      metadata,
      status: AlertStatus.ACTIVE
    });

    return this.alertRepository.save(alert);
  }

  async acknowledgeAlert(alertId: string, userId: string, notes?: string): Promise<InventoryAlert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId }
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedAt = new Date();
    alert.acknowledgedByUserId = userId;
    alert.acknowledgmentNotes = notes;

    return this.alertRepository.save(alert);
  }

  async resolveAlert(alertId: string, userId: string, notes?: string): Promise<InventoryAlert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId }
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();
    alert.resolvedByUserId = userId;
    alert.resolutionNotes = notes;

    return this.alertRepository.save(alert);
  }

  async getActiveAlerts(buyerId: string, type?: AlertType): Promise<InventoryAlert[]> {
    const query = this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.inventory', 'inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('inventory.buyerId = :buyerId', { buyerId })
      .andWhere('alert.status = :status', { status: AlertStatus.ACTIVE });

    if (type) {
      query.andWhere('alert.type = :type', { type });
    }

    return query.getMany();
  }

  async recordMovement(
    inventoryId: string,
    type: MovementType,
    reason: MovementReason,
    quantity: number,
    performedBy: string,
    metadata?: any
  ): Promise<InventoryMovement> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id: inventoryId }
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    const quantityBefore = inventory.quantity;
    const quantityAfter = type === MovementType.INBOUND || type === MovementType.ADJUSTMENT 
      ? quantityBefore + quantity 
      : quantityBefore - quantity;

    if (quantityAfter < 0) {
      throw new BadRequestException('Insufficient stock for this movement');
    }

    // Update inventory quantity
    inventory.quantity = quantityAfter;
    inventory.lastUpdated = new Date();
    
    // Update status based on new quantity
    inventory.status = this.calculateInventoryStatus(inventory);
    
    await this.inventoryRepository.save(inventory);

    // Create movement record
    const movement = this.movementRepository.create({
      inventoryId,
      type,
      reason,
      quantity,
      quantityBefore,
      quantityAfter,
      unitCost: inventory.unitCost,
      totalCost: quantity * (inventory.unitCost || 0),
      performedByUserId: performedBy,
      metadata
    });

    return this.movementRepository.save(movement);
  }

  async getMovementHistory(
    inventoryId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<InventoryMovement[]> {
    const query = this.movementRepository
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.performedBy', 'user')
      .where('movement.inventoryId = :inventoryId', { inventoryId })
      .orderBy('movement.createdAt', 'DESC');

    if (startDate && endDate) {
      query.andWhere('movement.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    }

    return query.getMany();
  }

  async generateRestockRecommendations(buyerId: string): Promise<any[]> {
    const inventories = await this.inventoryRepository.find({
      where: { buyerId },
      relations: ['product', 'movements']
    });

    const recommendations = [];

    for (const inventory of inventories) {
      if (inventory.status === InventoryStatus.LOW_STOCK || inventory.status === InventoryStatus.OUT_OF_STOCK) {
        const recommendedQuantity = await this.calculateRecommendedRestockQuantity(inventory);
        const urgency = this.calculateRestockUrgency(inventory);

        recommendations.push({
          inventoryId: inventory.id,
          productId: inventory.productId,
          productName: inventory.product?.name || 'Unknown Product',
          currentQuantity: inventory.quantity,
          recommendedQuantity,
          urgency,
          estimatedCost: recommendedQuantity * (inventory.unitCost || 0),
          lastRestocked: inventory.lastRestocked,
          nextRestockDate: inventory.nextRestockDate
        });
      }
    }

    return recommendations.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
  }

  async updateAiInsights(buyerId: string): Promise<void> {
    const inventories = await this.inventoryRepository.find({
      where: { buyerId },
      relations: ['product', 'movements']
    });

    for (const inventory of inventories) {
      const insights = await this.generateProductInsights(inventory);
      inventory.aiInsights = insights;
      await this.inventoryRepository.save(inventory);
    }
  }

  private calculateInventoryStatus(inventory: Inventory): InventoryStatus {
    if (inventory.quantity === 0) {
      return InventoryStatus.OUT_OF_STOCK;
    } else if (inventory.quantity <= inventory.minimumStock) {
      return InventoryStatus.LOW_STOCK;
    } else if (inventory.quantity >= inventory.maximumStock) {
      return InventoryStatus.OVERSTOCK;
    } else {
      return InventoryStatus.IN_STOCK;
    }
  }

  private async calculateAverageStockTurnover(buyerId: string): Promise<number> {
    // This is a simplified calculation - in practice, you'd want more sophisticated turnover analysis
    const movements = await this.movementRepository
      .createQueryBuilder('movement')
      .leftJoin('movement.inventory', 'inventory')
      .where('inventory.buyerId = :buyerId', { buyerId })
      .andWhere('movement.type = :type', { type: MovementType.OUTBOUND })
      .getMany();

    const totalOutbound = movements.reduce((sum, movement) => sum + movement.quantity, 0);
    const inventories = await this.inventoryRepository.find({ where: { buyerId } });
    const averageStock = inventories.reduce((sum, inv) => sum + inv.quantity, 0) / inventories.length;

    return averageStock > 0 ? totalOutbound / averageStock : 0;
  }

  private calculateCostAnalysis(inventories: Inventory[]): any {
    const totalCarryingCost = inventories.reduce((sum, inv) => {
      const carryingCost = inv.costAnalysis?.carryingCost || 0;
      return sum + carryingCost;
    }, 0);

    const totalOrderingCost = inventories.reduce((sum, inv) => {
      const orderingCost = inv.costAnalysis?.orderingCost || 0;
      return sum + orderingCost;
    }, 0);

    const totalValue = inventories.reduce((sum, inv) => 
      sum + (inv.quantity * (inv.unitCost || 0)), 0
    );

    const averageUnitCost = inventories.length > 0 
      ? inventories.reduce((sum, inv) => sum + (inv.unitCost || 0), 0) / inventories.length 
      : 0;

    return {
      totalCarryingCost,
      totalOrderingCost,
      averageUnitCost,
      costVariance: 0 // This would be calculated based on historical data
    };
  }

  private async generateAiInsights(buyerId: string, inventories: Inventory[]): Promise<any> {
    // This would integrate with your AI service to generate insights
    // For now, returning mock data
    return {
      recommendedRestocks: [],
      seasonalTrends: [],
      priceOptimization: []
    };
  }

  private async calculateRecommendedRestockQuantity(inventory: Inventory): Promise<number> {
    // Simple calculation - in practice, this would use AI/ML models
    const safetyStock = inventory.minimumStock * 1.5;
    const leadTimeDemand = inventory.reorderQuantity || inventory.minimumStock;
    return Math.max(safetyStock, leadTimeDemand);
  }

  private calculateRestockUrgency(inventory: Inventory): 'low' | 'medium' | 'high' {
    if (inventory.status === InventoryStatus.OUT_OF_STOCK) {
      return 'high';
    } else if (inventory.quantity <= inventory.minimumStock * 0.5) {
      return 'high';
    } else if (inventory.quantity <= inventory.minimumStock) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private async generateProductInsights(inventory: Inventory): Promise<any> {
    // This would integrate with AI service for product-specific insights
    return {
      predictedDemand: inventory.quantity * 0.1, // Mock calculation
      confidence: 0.8,
      seasonalFactors: [],
      priceTrends: null,
      recommendedStock: inventory.minimumStock * 2,
      restockUrgency: this.calculateRestockUrgency(inventory),
      alternativeProducts: []
    };
  }
}
