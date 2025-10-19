import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { AdvancedInventoryService, AlertSettings } from '../services/advanced-inventory.service';
import { AlertType, AlertPriority } from '../entities/inventory-alert.entity';
import { MovementType, MovementReason } from '../entities/inventory-movement.entity';
import { Request } from 'express';

export class UpdateAlertSettingsDto {
  lowStockThreshold?: number;
  overstockThreshold?: number;
  priceChangeThreshold?: number;
  expiryWarningDays?: number;
  enableEmailAlerts?: boolean;
  enableSmsAlerts?: boolean;
  enablePushAlerts?: boolean;
  alertFrequency?: 'immediate' | 'daily' | 'weekly';
  departmentAlerts?: string[];
  categoryAlerts?: string[];
  flavorAlerts?: string[];
  offerAlerts?: boolean;
  campaignAlerts?: boolean;
}

export class CreateAlertDto {
  inventoryId: string;
  type: AlertType;
  message: string;
  priority?: AlertPriority;
  metadata?: any;
}

export class AcknowledgeAlertDto {
  notes?: string;
}

export class ResolveAlertDto {
  notes?: string;
}

export class RecordMovementDto {
  inventoryId: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  metadata?: any;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CLIENT)
@Controller('inventory/advanced')
export class AdvancedInventoryController {
  constructor(private readonly advancedInventoryService: AdvancedInventoryService) {}

  @Get('analytics')
  async getInventoryAnalytics(@Req() req: Request) {
    const buyerId = (req.user as any).id;
    return this.advancedInventoryService.getInventoryAnalytics(buyerId);
  }

  @Put('alert-settings/:productId')
  async updateAlertSettings(
    @Req() req: Request,
    @Param('productId') productId: string,
    @Body() settings: UpdateAlertSettingsDto
  ) {
    const buyerId = (req.user as any).id;
    return this.advancedInventoryService.updateAlertSettings(buyerId, productId, settings);
  }

  @Post('alerts')
  async createAlert(@Req() req: Request, @Body() createAlertDto: CreateAlertDto) {
    return this.advancedInventoryService.createAlert(
      createAlertDto.inventoryId,
      createAlertDto.type,
      createAlertDto.message,
      createAlertDto.priority,
      createAlertDto.metadata
    );
  }

  @Put('alerts/:alertId/acknowledge')
  async acknowledgeAlert(
    @Req() req: Request,
    @Param('alertId') alertId: string,
    @Body() acknowledgeDto: AcknowledgeAlertDto
  ) {
    const userId = (req.user as any).id;
    return this.advancedInventoryService.acknowledgeAlert(alertId, userId, acknowledgeDto.notes);
  }

  @Put('alerts/:alertId/resolve')
  async resolveAlert(
    @Req() req: Request,
    @Param('alertId') alertId: string,
    @Body() resolveDto: ResolveAlertDto
  ) {
    const userId = (req.user as any).id;
    return this.advancedInventoryService.resolveAlert(alertId, userId, resolveDto.notes);
  }

  @Get('alerts')
  async getActiveAlerts(
    @Req() req: Request,
    @Query('type') type?: AlertType
  ) {
    const buyerId = (req.user as any).id;
    return this.advancedInventoryService.getActiveAlerts(buyerId, type);
  }

  @Post('movements')
  async recordMovement(@Req() req: Request, @Body() movementDto: RecordMovementDto) {
    const userId = (req.user as any).id;
    return this.advancedInventoryService.recordMovement(
      movementDto.inventoryId,
      movementDto.type,
      movementDto.reason,
      movementDto.quantity,
      userId,
      movementDto.metadata
    );
  }

  @Get('movements/:inventoryId')
  async getMovementHistory(
    @Req() req: Request,
    @Param('inventoryId') inventoryId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.advancedInventoryService.getMovementHistory(inventoryId, start, end);
  }

  @Get('restock-recommendations')
  async getRestockRecommendations(@Req() req: Request) {
    const buyerId = (req.user as any).id;
    return this.advancedInventoryService.generateRestockRecommendations(buyerId);
  }

  @Post('update-ai-insights')
  async updateAiInsights(@Req() req: Request) {
    const buyerId = (req.user as any).id;
    await this.advancedInventoryService.updateAiInsights(buyerId);
    return { message: 'AI insights updated successfully' };
  }
}
