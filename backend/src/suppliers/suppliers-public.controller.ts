import { 
  Controller, 
  Get, 
  Post, 
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
import { SupplierQueryDto } from './dto/supplier-query.dto';
import { SupplierInquiryDto, SupplierInquiryResponseDto } from './dto/supplier-inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ResponseUtil } from '../shared/utils/response.util';
import { ApiResponseDecorator, ApiPaginatedResponse, ApiErrorResponse } from '../shared/decorators/api-response.decorator';
import { Supplier } from './entities/supplier.entity';

@ApiTags('Suppliers - Public')
@Controller('suppliers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SuppliersPublicController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all suppliers with filtering and pagination' })
  @ApiPaginatedResponse(Supplier)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'onSale', required: false, type: Boolean })
  @ApiQuery({ name: 'freeDelivery', required: false, type: Boolean })
  @ApiQuery({ name: 'coDelivery', required: false, type: Boolean })
  @ApiQuery({ name: 'recentlyAdded', required: false, type: Boolean })
  @ApiQuery({ name: 'popular', required: false, type: Boolean })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  async findAll(@Query() query: SupplierQueryDto) {
    const result = await this.suppliersService.findAll(query);
    return ResponseUtil.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Search suppliers' })
  @ApiPaginatedResponse(Supplier)
  async searchSuppliers(@Query() query: SupplierQueryDto) {
    const result = await this.suppliersService.searchSuppliers(query);
    return ResponseUtil.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all supplier categories' })
  @ApiResponseDecorator(String, { isArray: true })
  async getCategories() {
    const categories = await this.suppliersService.getCategories();
    return ResponseUtil.success(categories);
  }

  @Get('recommended/:type')
  @ApiOperation({ summary: 'Get recommended suppliers by type' })
  @ApiPaginatedResponse(Supplier)
  async getRecommendedSuppliers(
    @Param('type') type: 'recently_added' | 'popular' | 'trending',
    @Query() query: SupplierQueryDto
  ) {
    const result = await this.suppliersService.getRecommendedSuppliers(type, query);
    return ResponseUtil.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get suppliers by category' })
  @ApiPaginatedResponse(Supplier)
  async getSuppliersByCategory(
    @Param('category') category: string,
    @Query() query: SupplierQueryDto
  ) {
    const result = await this.suppliersService.getSuppliersByCategory(category, query);
    return ResponseUtil.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get user favorite suppliers' })
  @ApiPaginatedResponse(Supplier)
  async getFavoriteSuppliers(
    @CurrentUser() user: User,
    @Query() query: SupplierQueryDto
  ) {
    const result = await this.suppliersService.getFavoriteSuppliers(user.id, query);
    return ResponseUtil.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  }

  @Get('my-suppliers')
  @ApiOperation({ summary: 'Get user\'s suppliers (my suppliers)' })
  @ApiPaginatedResponse(Supplier)
  async getMySuppliers(
    @CurrentUser() user: User,
    @Query() query: SupplierQueryDto
  ) {
    const result = await this.suppliersService.getMySuppliers(user.id, query);
    return ResponseUtil.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get supplier statistics' })
  @ApiResponseDecorator(Object)
  async getStats() {
    const stats = await this.suppliersService.getStats();
    return ResponseUtil.success(stats);
  }

  @Get('profile')
  @UseGuards(RolesGuard)
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

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiResponseDecorator(Supplier)
  @ApiErrorResponse(404, 'Supplier not found')
  async findOne(@Param('id') id: string) {
    const supplier = await this.suppliersService.findOne(id);
    return ResponseUtil.success(supplier);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get supplier products' })
  @ApiPaginatedResponse(Object)
  async getSupplierProducts(
    @Param('id') id: string,
    @Query() query: SupplierQueryDto
  ) {
    const result = await this.suppliersService.getSupplierProductsById(id, query);
    return ResponseUtil.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  }

  @Get(':id/campaigns')
  @ApiOperation({ summary: 'Get supplier campaigns' })
  @ApiResponseDecorator(Object, { isArray: true })
  async getSupplierCampaigns(@Param('id') id: string) {
    const campaigns = await this.suppliersService.getSupplierCampaigns(id);
    return ResponseUtil.success(campaigns);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get supplier reviews' })
  @ApiPaginatedResponse(Object)
  async getSupplierReviews(
    @Param('id') id: string,
    @Query() query: SupplierQueryDto
  ) {
    const result = await this.suppliersService.getSupplierReviews(id, query);
    return ResponseUtil.paginated(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total
    );
  }

  @Get(':id/delivery-options')
  @ApiOperation({ summary: 'Get supplier delivery options' })
  @ApiResponseDecorator(Object)
  async getDeliveryOptions(@Param('id') id: string) {
    const options = await this.suppliersService.getDeliveryOptions(id);
    return ResponseUtil.success(options);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Check supplier availability' })
  @ApiResponseDecorator(Object)
  async checkAvailability(@Param('id') id: string) {
    const availability = await this.suppliersService.checkAvailability(id);
    return ResponseUtil.success(availability);
  }

  @Get(':id/contact')
  @ApiOperation({ summary: 'Get supplier contact information' })
  @ApiResponseDecorator(Object)
  async getContact(@Param('id') id: string) {
    const contact = await this.suppliersService.getContact(id);
    return ResponseUtil.success(contact);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get supplier analytics' })
  @ApiResponseDecorator(Object)
  async getAnalytics(@Param('id') id: string) {
    const analytics = await this.suppliersService.getAnalytics(id);
    return ResponseUtil.success(analytics);
  }

  @Post(':id/inquiry')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send inquiry to supplier' })
  @ApiResponseDecorator(SupplierInquiryResponseDto)
  @ApiErrorResponse(400, 'Invalid inquiry data')
  @ApiErrorResponse(404, 'Supplier not found')
  async sendInquiry(
    @Param('id') id: string,
    @Body() inquiryDto: SupplierInquiryDto,
    @CurrentUser() user: User
  ) {
    const result = await this.suppliersService.sendInquiry(id, inquiryDto, user);
    return ResponseUtil.success(result, 'Inquiry sent successfully');
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Add supplier to favorites' })
  @ApiResponseDecorator(Object)
  async addToFavorites(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    const result = await this.suppliersService.addToFavorites(id, user.id);
    return ResponseUtil.success(result, 'Supplier added to favorites');
  }

  @Delete(':id/favorite')
  @ApiOperation({ summary: 'Remove supplier from favorites' })
  @ApiResponseDecorator(Object)
  async removeFromFavorites(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    const result = await this.suppliersService.removeFromFavorites(id, user.id);
    return ResponseUtil.success(result, 'Supplier removed from favorites');
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate supplier' })
  @ApiResponseDecorator(Object)
  async rateSupplier(
    @Param('id') id: string,
    @Body() ratingDto: { rating: number; review?: string },
    @CurrentUser() user: User
  ) {
    const result = await this.suppliersService.rateSupplier(id, ratingDto, user);
    return ResponseUtil.success(result, 'Supplier rated successfully');
  }

  @Post(':id/report')
  @ApiOperation({ summary: 'Report supplier' })
  @ApiResponseDecorator(Object)
  async reportSupplier(
    @Param('id') id: string,
    @Body() reportDto: { reason: string; description?: string },
    @CurrentUser() user: User
  ) {
    const result = await this.suppliersService.reportSupplier(id, reportDto, user);
    return ResponseUtil.success(result, 'Supplier report submitted');
  }

  @Post(':id/request-info')
  @ApiOperation({ summary: 'Request supplier information' })
  @ApiResponseDecorator(Object)
  async requestInfo(
    @Param('id') id: string,
    @Body() requestDto: { infoType: string },
    @CurrentUser() user: User
  ) {
    const result = await this.suppliersService.requestInfo(id, requestDto, user);
    return ResponseUtil.success(result, 'Information request sent');
  }
}


