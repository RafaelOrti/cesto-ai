import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ResponseUtil } from '../shared/utils/response.util';
import { ApiResponseDecorator, ApiErrorResponse } from '../shared/decorators/api-response.decorator';
import { Supplier } from './entities/supplier.entity';

@ApiTags('Suppliers - Authenticated')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SuppliersAuthController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get('profile')
  @Roles('supplier')
  @ApiOperation({ summary: 'Get supplier profile (supplier only)' })
  @ApiResponseDecorator(Supplier)
  @ApiErrorResponse(403, 'Forbidden - Only suppliers can access this endpoint')
  @ApiErrorResponse(404, 'Supplier profile not found')
  async getProfile(@CurrentUser() user: User) {
    const supplier = await this.suppliersService.findByUserId(user.id);
    if (!supplier) {
      return ResponseUtil.error('Supplier profile not found', '404');
    }
    return ResponseUtil.success(supplier, 'Supplier profile retrieved successfully');
  }

  @Put('profile')
  @Roles('supplier')
  @ApiOperation({ summary: 'Update supplier profile (supplier only)' })
  @ApiResponseDecorator(Supplier)
  @ApiErrorResponse(403, 'Forbidden - Only suppliers can access this endpoint')
  @ApiErrorResponse(404, 'Supplier profile not found')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateData: Partial<Supplier>
  ) {
    const supplier = await this.suppliersService.updateByUserId(user.id, updateData);
    if (!supplier) {
      return ResponseUtil.error('Supplier profile not found', '404');
    }
    return ResponseUtil.success(supplier, 'Supplier profile updated successfully');
  }

  @Get('products')
  @Roles('supplier')
  @ApiOperation({ summary: 'Get supplier products (supplier only)' })
  @ApiResponseDecorator(Array)
  @ApiErrorResponse(403, 'Forbidden - Only suppliers can access this endpoint')
  async getMyProducts(@CurrentUser() user: User) {
    const supplier = await this.suppliersService.findByUserId(user.id);
    if (!supplier) {
      return ResponseUtil.error('Supplier profile not found', '404');
    }
    const products = await this.suppliersService.getSupplierProducts(supplier.id);
    return ResponseUtil.success(products, 'Supplier products retrieved successfully');
  }

  @Get('orders')
  @Roles('supplier')
  @ApiOperation({ summary: 'Get supplier orders (supplier only)' })
  @ApiResponseDecorator(Array)
  @ApiErrorResponse(403, 'Forbidden - Only suppliers can access this endpoint')
  async getMyOrders(@CurrentUser() user: User) {
    const supplier = await this.suppliersService.findByUserId(user.id);
    if (!supplier) {
      return ResponseUtil.error('Supplier profile not found', '404');
    }
    const orders = await this.suppliersService.getSupplierOrders(supplier.id);
    return ResponseUtil.success(orders, 'Supplier orders retrieved successfully');
  }

  @Get('dashboard')
  @Roles('supplier')
  @ApiOperation({ summary: 'Get supplier dashboard data (supplier only)' })
  @ApiResponseDecorator(Object)
  @ApiErrorResponse(403, 'Forbidden - Only suppliers can access this endpoint')
  async getDashboard(@CurrentUser() user: User) {
    const supplier = await this.suppliersService.findByUserId(user.id);
    if (!supplier) {
      return ResponseUtil.error('Supplier profile not found', '404');
    }
    const dashboard = await this.suppliersService.getDashboard(supplier.id);
    return ResponseUtil.success(dashboard, 'Supplier dashboard data retrieved successfully');
  }
}
