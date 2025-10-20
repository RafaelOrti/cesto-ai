import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from './enums/order-status.enum';
import { Product } from '../products/entities/product.entity';
import { SupplierApproval, ApprovalStatus } from '../suppliers/entities/supplier-approval.entity';
import { User } from '../users/entities/user.entity';

export interface CreateOrderDto {
  supplierId: string;
  items: {
    productId: string;
    quantity: number;
    notes?: string;
  }[];
  notes?: string;
  requestedDeliveryDate?: Date;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  notes?: string;
  confirmedDeliveryDate?: Date;
}

export interface UpdateOrderItemDto {
  acceptedQuantity?: number;
  rejectedQuantity?: number;
  notes?: string;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(SupplierApproval)
    private supplierApprovalRepository: Repository<SupplierApproval>,
  ) {}

  /**
   * Create a new order
   */
  async createOrder(buyerId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // Check if supplier is approved for this buyer
    const approval = await this.supplierApprovalRepository.findOne({
      where: {
        buyerId,
        supplierId: createOrderDto.supplierId,
        status: ApprovalStatus.APPROVED,
      },
    });

    // If no approval exists, create a pending relationship request
    if (!approval) {
      const relationshipRequest = this.supplierApprovalRepository.create({
        buyerId,
        supplierId: createOrderDto.supplierId,
        status: ApprovalStatus.PENDING,
        notes: 'Relationship request from order placement',
      });
      
      await this.supplierApprovalRepository.save(relationshipRequest);
      
      // For now, we'll allow the order to proceed with a warning
      // In a production system, you might want to require approval first
      this.logger.warn(`Order placed with unapproved supplier ${createOrderDto.supplierId} by buyer ${buyerId}`);
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Calculate total amount
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const unitPrice = product.price;
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      const orderItem = this.orderItemRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        notes: item.notes,
      });

      orderItems.push(orderItem);
    }

    // Create order
    const order = this.orderRepository.create({
      orderNumber,
      buyerId,
      supplierId: createOrderDto.supplierId,
      totalAmount,
      notes: createOrderDto.notes,
      requestedDeliveryDate: createOrderDto.requestedDeliveryDate,
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);
    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['buyer', 'supplier', 'items', 'items.product'],
    });
  }

  /**
   * Get orders for a buyer
   */
  async getBuyerOrders(buyerId: string, status?: OrderStatus): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.supplier', 'supplier')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.buyerId = :buyerId', { buyerId });

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    return query.orderBy('order.createdAt', 'DESC').getMany();
  }

  /**
   * Get orders for a supplier
   */
  async getSupplierOrders(supplierId: string, status?: OrderStatus): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.supplier', 'supplier')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.supplierId = :supplierId', { supplierId });

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    return query.orderBy('order.createdAt', 'DESC').getMany();
  }

  /**
   * Aggregate buyer analytics between optional dates
   */
  async getBuyerAnalytics(buyerId: string, dateFrom?: string, dateTo?: string): Promise<any> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'items')
      .where('order.buyerId = :buyerId', { buyerId });

    if (dateFrom) {
      query.andWhere('order.createdAt >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query.andWhere('order.createdAt <= :dateTo', { dateTo });
    }

    // Fetch raw orders needed for aggregation
    const orders = await query.select(['order.id', 'order.createdAt', 'order.totalAmount', 'order.supplierId']).getMany();

    // Trends by month (YYYY-MM)
    const formatMonth = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const orderTrends: Record<string, { orders: number; sales: number }> = {};
    for (const o of orders) {
      const key = formatMonth(new Date(o.createdAt));
      if (!orderTrends[key]) orderTrends[key] = { orders: 0, sales: 0 };
      orderTrends[key].orders += 1;
      orderTrends[key].sales += Number(o.totalAmount || 0);
    }

    // Top suppliers table summary
    const suppliersSummary: Record<string, { orders: number; sales: number; avgOrder: number }> = {};
    for (const o of orders) {
      const s = o.supplierId;
      if (!suppliersSummary[s]) suppliersSummary[s] = { orders: 0, sales: 0, avgOrder: 0 };
      suppliersSummary[s].orders += 1;
      suppliersSummary[s].sales += Number(o.totalAmount || 0);
    }
    for (const s of Object.keys(suppliersSummary)) {
      const data = suppliersSummary[s];
      data.avgOrder = data.orders > 0 ? data.sales / data.orders : 0;
    }

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return {
      totalOrders,
      totalSales,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      trends: orderTrends,
      suppliers: Object.entries(suppliersSummary).map(([supplierId, v]) => ({ supplierId, ...v }))
    };
  }

  /**
   * Update order status (supplier action)
   */
  async updateOrderStatus(
    orderId: string,
    supplierId: string,
    updateDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, supplierId },
      relations: ['items'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.status = updateDto.status;
    order.supplierNotes = updateDto.notes;
    order.confirmedDeliveryDate = updateDto.confirmedDeliveryDate;

    return this.orderRepository.save(order);
  }

  /**
   * Update order item (supplier action)
   */
  async updateOrderItem(
    orderId: string,
    itemId: string,
    supplierId: string,
    updateDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, supplierId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const item = await this.orderItemRepository.findOne({
      where: { id: itemId, orderId },
    });

    if (!item) {
      throw new Error('Order item not found');
    }

    if (updateDto.acceptedQuantity !== undefined) {
      item.acceptedQuantity = updateDto.acceptedQuantity;
    }

    if (updateDto.rejectedQuantity !== undefined) {
      item.rejectedQuantity = updateDto.rejectedQuantity;
    }

    if (updateDto.notes) {
      item.notes = updateDto.notes;
    }

    return this.orderItemRepository.save(item);
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: [
        { id: orderId, buyerId: userId },
        { id: orderId, supplierId: userId },
      ],
      relations: ['buyer', 'supplier', 'items', 'items.product'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  /**
   * Get approved suppliers for a buyer
   */
  async getApprovedSuppliers(buyerId: string): Promise<User[]> {
    const approvals = await this.supplierApprovalRepository.find({
      where: {
        buyerId,
        status: ApprovalStatus.APPROVED,
      },
      relations: ['supplier'],
    });

    return approvals.map(approval => approval.supplier);
  }

  /**
   * Request supplier approval
   */
  async requestSupplierApproval(buyerId: string, supplierId: string): Promise<SupplierApproval> {
    const existingApproval = await this.supplierApprovalRepository.findOne({
      where: { buyerId, supplierId },
    });

    if (existingApproval) {
      throw new Error('Approval request already exists');
    }

    const approval = this.supplierApprovalRepository.create({
      buyerId,
      supplierId,
      status: ApprovalStatus.PENDING,
    });

    return this.supplierApprovalRepository.save(approval);
  }

  /**
   * Update supplier approval status
   */
  async updateSupplierApproval(
    approvalId: string,
    supplierId: string,
    status: ApprovalStatus,
    notes?: string,
    rejectionReason?: string,
  ): Promise<SupplierApproval> {
    const approval = await this.supplierApprovalRepository.findOne({
      where: { id: approvalId, supplierId },
    });

    if (!approval) {
      throw new Error('Approval not found');
    }

    approval.status = status;
    approval.notes = notes;
    approval.rejectionReason = rejectionReason;

    if (status === ApprovalStatus.APPROVED) {
      approval.approvedAt = new Date();
    } else if (status === ApprovalStatus.REJECTED) {
      approval.rejectedAt = new Date();
    } else if (status === ApprovalStatus.SUSPENDED) {
      approval.suspendedAt = new Date();
    }

    return this.supplierApprovalRepository.save(approval);
  }

  private async generateOrderNumber(): Promise<string> {
    const count = await this.orderRepository.count();
    const timestamp = Date.now().toString().slice(-6);
    return `ORD-${timestamp}-${(count + 1).toString().padStart(4, '0')}`;
  }
}
