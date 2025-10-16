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

    if (!approval) {
      throw new Error('Supplier not approved for this buyer');
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
