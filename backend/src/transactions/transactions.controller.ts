import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  async getAll(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsService.getAll(req.user.userId, {
      page,
      limit,
      type,
      status,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  async getById(@Request() req, @Param('id') id: string) {
    return this.transactionsService.getById(req.user.userId, id);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  async getInvoices(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.transactionsService.getInvoices(req.user.userId, {
      page,
      limit,
      status,
    });
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  async getInvoiceById(@Request() req, @Param('id') id: string) {
    return this.transactionsService.getInvoiceById(req.user.userId, id);
  }

  @Post('invoices/:id/pay')
  @ApiOperation({ summary: 'Pay invoice' })
  async payInvoice(
    @Request() req,
    @Param('id') id: string,
    @Body() paymentData: any,
  ) {
    return this.transactionsService.payInvoice(req.user.userId, id, paymentData);
  }

  @Get('invoices/:id/download')
  @ApiOperation({ summary: 'Download invoice PDF' })
  async downloadInvoice(@Request() req, @Param('id') id: string) {
    return this.transactionsService.downloadInvoice(req.user.userId, id);
  }

  @Post('invoices/:id/send-reminder')
  @ApiOperation({ summary: 'Send payment reminder' })
  async sendInvoiceReminder(@Request() req, @Param('id') id: string) {
    return this.transactionsService.sendInvoiceReminder(req.user.userId, id);
  }

  @Get('purchase-orders')
  @ApiOperation({ summary: 'Get all purchase orders' })
  async getPurchaseOrders(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.transactionsService.getPurchaseOrders(req.user.userId, {
      page,
      limit,
      status,
    });
  }

  @Get('purchase-orders/:id')
  @ApiOperation({ summary: 'Get purchase order by ID' })
  async getPurchaseOrderById(@Request() req, @Param('id') id: string) {
    return this.transactionsService.getPurchaseOrderById(req.user.userId, id);
  }

  @Post('purchase-orders')
  @ApiOperation({ summary: 'Create purchase order' })
  async createPurchaseOrder(@Request() req, @Body() poData: any) {
    return this.transactionsService.createPurchaseOrder(req.user.userId, poData);
  }

  @Put('purchase-orders/:id')
  @ApiOperation({ summary: 'Update purchase order' })
  async updatePurchaseOrder(
    @Request() req,
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.transactionsService.updatePurchaseOrder(req.user.userId, id, updateData);
  }

  @Post('purchase-orders/:id/approve')
  @ApiOperation({ summary: 'Approve purchase order' })
  async approvePurchaseOrder(@Request() req, @Param('id') id: string) {
    return this.transactionsService.approvePurchaseOrder(req.user.userId, id);
  }

  @Post('purchase-orders/:id/send')
  @ApiOperation({ summary: 'Send purchase order to supplier' })
  async sendPurchaseOrder(@Request() req, @Param('id') id: string) {
    return this.transactionsService.sendPurchaseOrder(req.user.userId, id);
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get payment methods' })
  async getPaymentMethods(@Request() req) {
    return this.transactionsService.getPaymentMethods(req.user.userId);
  }

  @Post('payment-methods')
  @ApiOperation({ summary: 'Add payment method' })
  async addPaymentMethod(@Request() req, @Body() methodData: any) {
    return this.transactionsService.addPaymentMethod(req.user.userId, methodData);
  }

  @Put('payment-methods/:id')
  @ApiOperation({ summary: 'Update payment method' })
  async updatePaymentMethod(
    @Request() req,
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.transactionsService.updatePaymentMethod(req.user.userId, id, updateData);
  }

  @Delete('payment-methods/:id')
  @ApiOperation({ summary: 'Remove payment method' })
  async removePaymentMethod(@Request() req, @Param('id') id: string) {
    return this.transactionsService.removePaymentMethod(req.user.userId, id);
  }

  @Post('payment-methods/:id/set-default')
  @ApiOperation({ summary: 'Set default payment method' })
  async setDefaultPaymentMethod(@Request() req, @Param('id') id: string) {
    return this.transactionsService.setDefaultPaymentMethod(req.user.userId, id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get financial summary' })
  async getSummary(@Request() req, @Query('period') period?: string) {
    return this.transactionsService.getSummary(req.user.userId, period);
  }

  @Post('export')
  @ApiOperation({ summary: 'Export transactions' })
  async exportTransactions(@Request() req, @Body() exportData: any) {
    return this.transactionsService.exportTransactions(req.user.userId, exportData);
  }
}






