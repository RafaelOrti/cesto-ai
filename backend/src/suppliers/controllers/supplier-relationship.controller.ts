import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SupplierRelationshipService, SupplierRelationshipRequest, SupplierRelationshipResponse } from '../services/supplier-relationship.service';
import { ApprovalStatus } from '../entities/supplier-approval.entity';

@ApiTags('supplier-relationships')
@Controller('supplier-relationships')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SupplierRelationshipController {
  constructor(
    private readonly supplierRelationshipService: SupplierRelationshipService,
  ) {}

  @Post('request')
  @ApiOperation({ summary: 'Request supplier relationship' })
  @ApiResponse({ status: 201, description: 'Relationship request created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async requestRelationship(
    @Body() request: SupplierRelationshipRequest,
    @Request() req: any,
  ): Promise<SupplierRelationshipResponse> {
    // Ensure the buyer is the authenticated user
    request.buyerId = req.user.id;
    return this.supplierRelationshipService.requestSupplierRelationship(request);
  }

  @Put(':relationshipId/approve')
  @ApiOperation({ summary: 'Approve supplier relationship' })
  @ApiResponse({ status: 200, description: 'Relationship approved successfully' })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async approveRelationship(
    @Param('relationshipId') relationshipId: string,
    @Body() body: { notes?: string },
    @Request() req: any,
  ): Promise<SupplierRelationshipResponse> {
    return this.supplierRelationshipService.approveSupplierRelationship(
      relationshipId,
      req.user.id,
      body.notes,
    );
  }

  @Put(':relationshipId/reject')
  @ApiOperation({ summary: 'Reject supplier relationship' })
  @ApiResponse({ status: 200, description: 'Relationship rejected successfully' })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async rejectRelationship(
    @Param('relationshipId') relationshipId: string,
    @Body() body: { rejectionReason: string },
    @Request() req: any,
  ): Promise<SupplierRelationshipResponse> {
    return this.supplierRelationshipService.rejectSupplierRelationship(
      relationshipId,
      req.user.id,
      body.rejectionReason,
    );
  }

  @Put(':relationshipId/suspend')
  @ApiOperation({ summary: 'Suspend supplier relationship' })
  @ApiResponse({ status: 200, description: 'Relationship suspended successfully' })
  @ApiResponse({ status: 404, description: 'Relationship not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async suspendRelationship(
    @Param('relationshipId') relationshipId: string,
    @Body() body: { reason: string },
    @Request() req: any,
  ): Promise<SupplierRelationshipResponse> {
    return this.supplierRelationshipService.suspendSupplierRelationship(
      relationshipId,
      req.user.id,
      body.reason,
    );
  }

  @Get('approved-suppliers')
  @ApiOperation({ summary: 'Get approved suppliers for buyer' })
  @ApiResponse({ status: 200, description: 'Approved suppliers retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getApprovedSuppliers(@Request() req: any) {
    return this.supplierRelationshipService.getApprovedSuppliers(req.user.id);
  }

  @Get('approved-buyers')
  @ApiOperation({ summary: 'Get approved buyers for supplier' })
  @ApiResponse({ status: 200, description: 'Approved buyers retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getApprovedBuyers(@Request() req: any) {
    return this.supplierRelationshipService.getApprovedBuyers(req.user.id);
  }

  @Get('pending-requests')
  @ApiOperation({ summary: 'Get pending relationship requests for supplier' })
  @ApiResponse({ status: 200, description: 'Pending requests retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPendingRequests(@Request() req: any) {
    return this.supplierRelationshipService.getPendingRequests(req.user.id);
  }

  @Get('status/:supplierId')
  @ApiOperation({ summary: 'Get relationship status with specific supplier' })
  @ApiResponse({ status: 200, description: 'Relationship status retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRelationshipStatus(
    @Param('supplierId') supplierId: string,
    @Request() req: any,
  ) {
    return this.supplierRelationshipService.getRelationshipStatus(req.user.id, supplierId);
  }
}

