import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalysisService } from './analysis.service';

@ApiTags('analysis')
@Controller('analysis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('sales-performance')
  @ApiOperation({ summary: 'Get sales performance analysis' })
  async getSalesPerformance(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('groupBy') groupBy?: string,
  ) {
    return this.analysisService.getSalesPerformance(req.user.userId, {
      startDate,
      endDate,
      groupBy,
    });
  }

  @Get('purchases-performance')
  @ApiOperation({ summary: 'Get purchases performance analysis' })
  async getPurchasesPerformance(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('groupBy') groupBy?: string,
  ) {
    return this.analysisService.getPurchasesPerformance(req.user.userId, {
      startDate,
      endDate,
      groupBy,
    });
  }

  @Get('sales-vs-purchases')
  @ApiOperation({ summary: 'Get sales vs purchases comparison' })
  async getSalesVsPurchases(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analysisService.getSalesVsPurchases(req.user.userId, {
      startDate,
      endDate,
    });
  }

  @Get('product-performance')
  @ApiOperation({ summary: 'Get product performance analysis' })
  async getProductPerformance(
    @Request() req,
    @Query('productId') productId?: string,
    @Query('period') period?: string,
    @Query('limit') limit?: number,
  ) {
    return this.analysisService.getProductPerformance(req.user.userId, {
      productId,
      period,
      limit,
    });
  }

  @Get('supplier-performance')
  @ApiOperation({ summary: 'Get supplier performance analysis' })
  async getSupplierPerformance(
    @Request() req,
    @Query('supplierId') supplierId?: string,
    @Query('period') period?: string,
    @Query('limit') limit?: number,
  ) {
    return this.analysisService.getSupplierPerformance(req.user.userId, {
      supplierId,
      period,
      limit,
    });
  }

  @Get('category-performance')
  @ApiOperation({ summary: 'Get category performance' })
  async getCategoryPerformance(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analysisService.getCategoryPerformance(req.user.userId, {
      startDate,
      endDate,
    });
  }

  @Get('seasonal-trends')
  @ApiOperation({ summary: 'Get seasonal trends' })
  async getSeasonalTrends(
    @Request() req,
    @Query('year') year?: number,
    @Query('category') category?: string,
  ) {
    return this.analysisService.getSeasonalTrends(req.user.userId, {
      year,
      category,
    });
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get sales forecast' })
  async getForecast(
    @Request() req,
    @Query('months') months?: number,
    @Query('confidence') confidence?: number,
  ) {
    return this.analysisService.getForecast(req.user.userId, {
      months,
      confidence,
    });
  }

  @Get('kpis')
  @ApiOperation({ summary: 'Get Key Performance Indicators' })
  async getKPIs(@Request() req, @Query('period') period?: string) {
    return this.analysisService.getKPIs(req.user.userId, period);
  }

  @Get('competitor-comparison')
  @ApiOperation({ summary: 'Get competitor comparison' })
  async getCompetitorComparison(
    @Request() req,
    @Query('productIds') productIds: string,
  ) {
    return this.analysisService.getCompetitorComparison(
      req.user.userId,
      productIds.split(','),
    );
  }

  @Post('custom-report')
  @ApiOperation({ summary: 'Generate custom report' })
  async generateCustomReport(@Request() req, @Body() reportData: any) {
    return this.analysisService.generateCustomReport(
      req.user.userId,
      reportData,
    );
  }

  @Get('export')
  @ApiOperation({ summary: 'Export analysis data' })
  async exportAnalysis(
    @Request() req,
    @Query('format') format: string,
    @Query('type') type: string,
    @Query('period') period?: string,
  ) {
    return this.analysisService.exportAnalysis(req.user.userId, {
      format,
      type,
      period,
    });
  }
}






