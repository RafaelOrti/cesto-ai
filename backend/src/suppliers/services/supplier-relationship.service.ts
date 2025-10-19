import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierApproval, ApprovalStatus } from '../entities/supplier-approval.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { OrderStatus } from '../../orders/enums/order-status.enum';
// import { NotificationService } from '../../shared/services/notification.service';

export interface SupplierRelationshipRequest {
  buyerId: string;
  supplierId: string;
  requestType: 'inquiry' | 'order' | 'direct';
  message?: string;
  orderId?: string;
}

export interface SupplierRelationshipResponse {
  success: boolean;
  relationshipId?: string;
  status: ApprovalStatus;
  message: string;
  requiresApproval: boolean;
}

@Injectable()
export class SupplierRelationshipService {
  private readonly logger = new Logger(SupplierRelationshipService.name);

  constructor(
    @InjectRepository(SupplierApproval)
    private supplierApprovalRepository: Repository<SupplierApproval>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    // private notificationService: NotificationService,
  ) {}

  /**
   * Request supplier relationship
   */
  async requestSupplierRelationship(
    request: SupplierRelationshipRequest
  ): Promise<SupplierRelationshipResponse> {
    try {
      // Check if relationship already exists
      const existingRelationship = await this.supplierApprovalRepository.findOne({
        where: {
          buyerId: request.buyerId,
          supplierId: request.supplierId,
        },
      });

      if (existingRelationship) {
        return {
          success: false,
          relationshipId: existingRelationship.id,
          status: existingRelationship.status,
          message: this.getStatusMessage(existingRelationship.status),
          requiresApproval: existingRelationship.status === ApprovalStatus.PENDING,
        };
      }

      // Check if this is an order-based relationship
      if (request.requestType === 'order' && request.orderId) {
        return await this.handleOrderBasedRelationship(request);
      }

      // Create new relationship request
      const relationship = this.supplierApprovalRepository.create({
        buyerId: request.buyerId,
        supplierId: request.supplierId,
        status: ApprovalStatus.PENDING,
        notes: request.message,
      });

      const savedRelationship = await this.supplierApprovalRepository.save(relationship);

      // Send notification to supplier
      await this.notifySupplierOfRequest(savedRelationship);

      return {
        success: true,
        relationshipId: savedRelationship.id,
        status: ApprovalStatus.PENDING,
        message: 'Relationship request sent to supplier',
        requiresApproval: true,
      };
    } catch (error) {
      this.logger.error('Error requesting supplier relationship:', error);
      throw error;
    }
  }

  /**
   * Handle order-based relationship (automatic approval for first order)
   */
  private async handleOrderBasedRelationship(
    request: SupplierRelationshipRequest
  ): Promise<SupplierRelationshipResponse> {
    const order = await this.orderRepository.findOne({
      where: { id: request.orderId },
      relations: ['buyer', 'supplier'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Check if this is the first order from this buyer to this supplier
    const previousOrders = await this.orderRepository.count({
      where: {
        buyerId: request.buyerId,
        supplierId: request.supplierId,
        status: OrderStatus.DELIVERED,
      },
    });

    // If first order, auto-approve the relationship
    if (previousOrders === 0) {
      const relationship = this.supplierApprovalRepository.create({
        buyerId: request.buyerId,
        supplierId: request.supplierId,
        status: ApprovalStatus.APPROVED,
        notes: 'Auto-approved based on first order',
        approvedAt: new Date(),
      });

      const savedRelationship = await this.supplierApprovalRepository.save(relationship);

      // Notify both parties
      await this.notifyRelationshipEstablished(savedRelationship);

      return {
        success: true,
        relationshipId: savedRelationship.id,
        status: ApprovalStatus.APPROVED,
        message: 'Relationship automatically established based on order',
        requiresApproval: false,
      };
    }

    // For subsequent orders, check if relationship exists
    const existingRelationship = await this.supplierApprovalRepository.findOne({
      where: {
        buyerId: request.buyerId,
        supplierId: request.supplierId,
      },
    });

    if (existingRelationship) {
      return {
        success: true,
        relationshipId: existingRelationship.id,
        status: existingRelationship.status,
        message: this.getStatusMessage(existingRelationship.status),
        requiresApproval: existingRelationship.status === ApprovalStatus.PENDING,
      };
    }

    // Create pending relationship for subsequent orders
    const relationship = this.supplierApprovalRepository.create({
      buyerId: request.buyerId,
      supplierId: request.supplierId,
      status: ApprovalStatus.PENDING,
      notes: 'Relationship request from order',
    });

    const savedRelationship = await this.supplierApprovalRepository.save(relationship);
    await this.notifySupplierOfRequest(savedRelationship);

    return {
      success: true,
      relationshipId: savedRelationship.id,
      status: ApprovalStatus.PENDING,
      message: 'Relationship request sent to supplier',
      requiresApproval: true,
    };
  }

  /**
   * Approve supplier relationship
   */
  async approveSupplierRelationship(
    relationshipId: string,
    supplierId: string,
    notes?: string
  ): Promise<SupplierRelationshipResponse> {
    try {
      const relationship = await this.supplierApprovalRepository.findOne({
        where: { id: relationshipId, supplierId },
        relations: ['buyer', 'supplier'],
      });

      if (!relationship) {
        throw new Error('Relationship not found');
      }

      if (relationship.status !== ApprovalStatus.PENDING) {
        throw new Error('Relationship is not pending approval');
      }

      relationship.status = ApprovalStatus.APPROVED;
      relationship.approvedAt = new Date();
      relationship.notes = notes || relationship.notes;

      const updatedRelationship = await this.supplierApprovalRepository.save(relationship);

      // Notify buyer of approval
      await this.notifyBuyerOfApproval(updatedRelationship);

      return {
        success: true,
        relationshipId: updatedRelationship.id,
        status: ApprovalStatus.APPROVED,
        message: 'Relationship approved successfully',
        requiresApproval: false,
      };
    } catch (error) {
      this.logger.error('Error approving supplier relationship:', error);
      throw error;
    }
  }

  /**
   * Reject supplier relationship
   */
  async rejectSupplierRelationship(
    relationshipId: string,
    supplierId: string,
    rejectionReason: string
  ): Promise<SupplierRelationshipResponse> {
    try {
      const relationship = await this.supplierApprovalRepository.findOne({
        where: { id: relationshipId, supplierId },
        relations: ['buyer', 'supplier'],
      });

      if (!relationship) {
        throw new Error('Relationship not found');
      }

      if (relationship.status !== ApprovalStatus.PENDING) {
        throw new Error('Relationship is not pending approval');
      }

      relationship.status = ApprovalStatus.REJECTED;
      relationship.rejectedAt = new Date();
      relationship.rejectionReason = rejectionReason;

      const updatedRelationship = await this.supplierApprovalRepository.save(relationship);

      // Notify buyer of rejection
      await this.notifyBuyerOfRejection(updatedRelationship);

      return {
        success: true,
        relationshipId: updatedRelationship.id,
        status: ApprovalStatus.REJECTED,
        message: 'Relationship rejected',
        requiresApproval: false,
      };
    } catch (error) {
      this.logger.error('Error rejecting supplier relationship:', error);
      throw error;
    }
  }

  /**
   * Get buyer's approved suppliers
   */
  async getApprovedSuppliers(buyerId: string): Promise<User[]> {
    const approvals = await this.supplierApprovalRepository.find({
      where: { buyerId, status: ApprovalStatus.APPROVED },
      relations: ['supplier'],
    });

    return approvals.map(approval => approval.supplier);
  }

  /**
   * Get supplier's approved buyers
   */
  async getApprovedBuyers(supplierId: string): Promise<User[]> {
    const approvals = await this.supplierApprovalRepository.find({
      where: { supplierId, status: ApprovalStatus.APPROVED },
      relations: ['buyer'],
    });

    return approvals.map(approval => approval.buyer);
  }

  /**
   * Get pending relationship requests for supplier
   */
  async getPendingRequests(supplierId: string): Promise<SupplierApproval[]> {
    return this.supplierApprovalRepository.find({
      where: { supplierId, status: ApprovalStatus.PENDING },
      relations: ['buyer'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get relationship status between buyer and supplier
   */
  async getRelationshipStatus(buyerId: string, supplierId: string): Promise<{
    exists: boolean;
    status?: ApprovalStatus;
    relationshipId?: string;
  }> {
    const relationship = await this.supplierApprovalRepository.findOne({
      where: { buyerId, supplierId },
    });

    return {
      exists: !!relationship,
      status: relationship?.status,
      relationshipId: relationship?.id,
    };
  }

  /**
   * Suspend supplier relationship
   */
  async suspendSupplierRelationship(
    relationshipId: string,
    supplierId: string,
    reason: string
  ): Promise<SupplierRelationshipResponse> {
    try {
      const relationship = await this.supplierApprovalRepository.findOne({
        where: { id: relationshipId, supplierId },
        relations: ['buyer', 'supplier'],
      });

      if (!relationship) {
        throw new Error('Relationship not found');
      }

      relationship.status = ApprovalStatus.SUSPENDED;
      relationship.suspendedAt = new Date();
      relationship.notes = reason;

      const updatedRelationship = await this.supplierApprovalRepository.save(relationship);

      // Notify buyer of suspension
      await this.notifyBuyerOfSuspension(updatedRelationship);

      return {
        success: true,
        relationshipId: updatedRelationship.id,
        status: ApprovalStatus.SUSPENDED,
        message: 'Relationship suspended',
        requiresApproval: false,
      };
    } catch (error) {
      this.logger.error('Error suspending supplier relationship:', error);
      throw error;
    }
  }

  // Private helper methods
  private getStatusMessage(status: ApprovalStatus): string {
    switch (status) {
      case ApprovalStatus.PENDING:
        return 'Relationship request is pending approval';
      case ApprovalStatus.APPROVED:
        return 'Relationship is approved and active';
      case ApprovalStatus.REJECTED:
        return 'Relationship request was rejected';
      case ApprovalStatus.SUSPENDED:
        return 'Relationship is suspended';
      default:
        return 'Unknown status';
    }
  }

  private async notifySupplierOfRequest(relationship: SupplierApproval): Promise<void> {
    // Implementation would send notification to supplier
    this.logger.log(`Notifying supplier ${relationship.supplierId} of relationship request from buyer ${relationship.buyerId}`);
  }

  private async notifyBuyerOfApproval(relationship: SupplierApproval): Promise<void> {
    // Implementation would send notification to buyer
    this.logger.log(`Notifying buyer ${relationship.buyerId} of relationship approval by supplier ${relationship.supplierId}`);
  }

  private async notifyBuyerOfRejection(relationship: SupplierApproval): Promise<void> {
    // Implementation would send notification to buyer
    this.logger.log(`Notifying buyer ${relationship.buyerId} of relationship rejection by supplier ${relationship.supplierId}`);
  }

  private async notifyBuyerOfSuspension(relationship: SupplierApproval): Promise<void> {
    // Implementation would send notification to buyer
    this.logger.log(`Notifying buyer ${relationship.buyerId} of relationship suspension by supplier ${relationship.supplierId}`);
  }

  private async notifyRelationshipEstablished(relationship: SupplierApproval): Promise<void> {
    // Implementation would send notification to both parties
    this.logger.log(`Notifying both parties of established relationship between buyer ${relationship.buyerId} and supplier ${relationship.supplierId}`);
  }
}
