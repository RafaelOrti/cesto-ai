import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats(@Request() req) {
    return this.dashboardService.getStats(req.user.userId);
  }

  @Get('charts/revenue')
  @ApiOperation({ summary: 'Get revenue chart data' })
  async getRevenueChart(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('groupBy') groupBy?: string,
  ) {
    return this.dashboardService.getRevenueChart(req.user.userId, {
      startDate,
      endDate,
      groupBy,
    });
  }

  @Get('charts/orders')
  @ApiOperation({ summary: 'Get orders chart data' })
  async getOrdersChart(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getOrdersChart(req.user.userId, {
      startDate,
      endDate,
    });
  }

  @Get('charts/suppliers')
  @ApiOperation({ summary: 'Get suppliers performance chart' })
  async getSuppliersChart(
    @Request() req,
    @Query('period') period: string = '30d',
  ) {
    return this.dashboardService.getSuppliersChart(req.user.userId, period);
  }

  @Get('recent-orders')
  @ApiOperation({ summary: 'Get recent orders' })
  async getRecentOrders(
    @Request() req,
    @Query('limit') limit: number = 10,
  ) {
    return this.dashboardService.getRecentOrders(req.user.userId, limit);
  }

  @Get('top-suppliers')
  @ApiOperation({ summary: 'Get top suppliers' })
  async getTopSuppliers(
    @Request() req,
    @Query('limit') limit: number = 5,
    @Query('sortBy') sortBy: string = 'totalValue',
  ) {
    return this.dashboardService.getTopSuppliers(req.user.userId, {
      limit,
      sortBy,
    });
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get dashboard notifications' })
  async getNotifications(
    @Request() req,
    @Query('unreadOnly') unreadOnly: boolean = false,
    @Query('limit') limit: number = 10,
  ) {
    return this.dashboardService.getNotifications(req.user.userId, {
      unreadOnly,
      limit,
    });
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get buyer insights data' })
  async getInsights(
    @Request() req,
    @Query('metric') metric: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getInsights(req.user.userId, {
      metric,
      startDate,
      endDate,
    });
  }
}






