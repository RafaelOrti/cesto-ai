import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService, CreateOrderDto, UpdateOrderStatusDto, UpdateOrderItemDto } from './orders.service';
import { OrderStatus } from './enums/order-status.enum';
import { ApprovalStatus } from '../suppliers/entities/supplier-approval.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Create a new order
   * POST /api/v1/orders
   */
  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const buyerId = req.user.id;
    return this.ordersService.createOrder(buyerId, createOrderDto);
  }

  /**
   * Get buyer orders
   * GET /api/v1/orders/buyer
   */
  @Get('buyer')
  async getBuyerOrders(
    @Request() req,
    @Query('status') status?: OrderStatus,
  ) {
    const buyerId = req.user.id;
    return this.ordersService.getBuyerOrders(buyerId, status);
  }

  /**
   * Buyer analytics (trends and suppliers summary)
   * GET /api/v1/orders/buyer/analytics
   */
  @Get('buyer/analytics')
  async getBuyerAnalytics(
    @Request() req,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const buyerId = req.user.id;
    return this.ordersService.getBuyerAnalytics(buyerId, dateFrom, dateTo);
  }

  /**
   * Get supplier orders
   * GET /api/v1/orders/supplier
   */
  @Get('supplier')
  async getSupplierOrders(
    @Request() req,
    @Query('status') status?: OrderStatus,
  ) {
    const supplierId = req.user.id;
    return this.ordersService.getSupplierOrders(supplierId, status);
  }

  /**
   * Get order by ID
   * GET /api/v1/orders/:id
   */
  @Get(':id')
  async getOrderById(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.ordersService.getOrderById(id, userId);
  }

  /**
   * Update order status (supplier action)
   * PUT /api/v1/orders/:id/status
   */
  @Put(':id/status')
  async updateOrderStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    const supplierId = req.user.id;
    return this.ordersService.updateOrderStatus(id, supplierId, updateDto);
  }

  /**
   * Update order item (supplier action)
   * PATCH /api/v1/orders/:id/items/:itemId
   */
  @Patch(':id/items/:itemId')
  async updateOrderItem(
    @Request() req,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateOrderItemDto,
  ) {
    const supplierId = req.user.id;
    return this.ordersService.updateOrderItem(id, itemId, supplierId, updateDto);
  }

  /**
   * Get approved suppliers for buyer
   * GET /api/v1/orders/approved-suppliers
   */
  @Get('approved-suppliers')
  async getApprovedSuppliers(@Request() req) {
    const buyerId = req.user.id;
    return this.ordersService.getApprovedSuppliers(buyerId);
  }

  /**
   * Request supplier approval
   * POST /api/v1/orders/request-approval
   */
  @Post('request-approval')
  async requestSupplierApproval(
    @Request() req,
    @Body() body: { supplierId: string },
  ) {
    const buyerId = req.user.id;
    return this.ordersService.requestSupplierApproval(buyerId, body.supplierId);
  }

  /**
   * Update supplier approval status
   * PUT /api/v1/orders/approval/:approvalId
   */
  @Put('approval/:approvalId')
  async updateSupplierApproval(
    @Request() req,
    @Param('approvalId') approvalId: string,
    @Body() body: {
      status: ApprovalStatus;
      notes?: string;
      rejectionReason?: string;
    },
  ) {
    const supplierId = req.user.id;
    return this.ordersService.updateSupplierApproval(
      approvalId,
      supplierId,
      body.status,
      body.notes,
      body.rejectionReason,
    );
  }
}
