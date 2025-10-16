import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { EcommerceService } from './ecommerce.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ProductReviewService } from './services/product-review.service';
import { WishlistService } from './services/wishlist.service';

@Controller('api/v1/ecommerce')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EcommerceController {
  constructor(
    private readonly ecommerceService: EcommerceService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly productReviewService: ProductReviewService,
    private readonly wishlistService: WishlistService,
  ) {}

  // Shopping Cart Endpoints
  @Get('cart')
  @Roles(UserRole.BUYER)
  async getCart(@Request() req) {
    return this.shoppingCartService.getCart(req.user.id);
  }

  @Post('cart/add')
  @Roles(UserRole.BUYER)
  async addToCart(@Request() req, @Body() addToCartDto: any) {
    return this.shoppingCartService.addToCart(req.user.id, addToCartDto);
  }

  @Put('cart/update/:productId')
  @Roles(UserRole.BUYER)
  async updateCartItem(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateCartDto: any,
  ) {
    return this.shoppingCartService.updateCartItem(
      req.user.id,
      productId,
      updateCartDto,
    );
  }

  @Delete('cart/remove/:productId')
  @Roles(UserRole.BUYER)
  async removeFromCart(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return this.shoppingCartService.removeFromCart(req.user.id, productId);
  }

  @Delete('cart/clear')
  @Roles(UserRole.BUYER)
  async clearCart(@Request() req) {
    return this.shoppingCartService.clearCart(req.user.id);
  }

  // Product Reviews Endpoints
  @Get('products/:productId/reviews')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productReviewService.getProductReviews(productId, page, limit);
  }

  @Post('products/:productId/reviews')
  @Roles(UserRole.BUYER)
  async createReview(
    @Request() req,
    @Param('productId') productId: string,
    @Body() reviewDto: any,
  ) {
    return this.productReviewService.createReview(
      req.user.id,
      productId,
      reviewDto,
    );
  }

  @Put('reviews/:reviewId')
  @Roles(UserRole.BUYER)
  async updateReview(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @Body() reviewDto: any,
  ) {
    return this.productReviewService.updateReview(
      req.user.id,
      reviewId,
      reviewDto,
    );
  }

  @Delete('reviews/:reviewId')
  @Roles(UserRole.BUYER)
  async deleteReview(
    @Request() req,
    @Param('reviewId') reviewId: string,
  ) {
    return this.productReviewService.deleteReview(req.user.id, reviewId);
  }

  // Wishlist Endpoints
  @Get('wishlist')
  @Roles(UserRole.BUYER)
  async getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Post('wishlist/add/:productId')
  @Roles(UserRole.BUYER)
  async addToWishlist(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addToWishlist(req.user.id, productId);
  }

  @Delete('wishlist/remove/:productId')
  @Roles(UserRole.BUYER)
  async removeFromWishlist(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(req.user.id, productId);
  }

  // Product Catalog Endpoints
  @Get('products')
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('isOnSale') isOnSale?: boolean,
    @Query('isFeatured') isFeatured?: boolean,
  ) {
    return this.ecommerceService.getProducts({
      page,
      limit,
      category,
      search,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      isOnSale,
      isFeatured,
    });
  }

  @Get('products/:productId')
  async getProduct(@Param('productId') productId: string) {
    return this.ecommerceService.getProduct(productId);
  }

  @Get('categories')
  async getCategories() {
    return this.ecommerceService.getCategories();
  }

  @Get('featured-products')
  async getFeaturedProducts(@Query('limit') limit: number = 10) {
    return this.ecommerceService.getFeaturedProducts(limit);
  }

  @Get('on-sale-products')
  async getOnSaleProducts(@Query('limit') limit: number = 10) {
    return this.ecommerceService.getOnSaleProducts(limit);
  }

  // Checkout Endpoints
  @Post('checkout')
  @Roles(UserRole.BUYER)
  async checkout(@Request() req, @Body() checkoutDto: any) {
    return this.ecommerceService.checkout(req.user.id, checkoutDto);
  }

  @Get('payment-methods')
  async getPaymentMethods() {
    return this.ecommerceService.getPaymentMethods();
  }

  @Get('shipping-methods/:supplierId')
  async getShippingMethods(@Param('supplierId') supplierId: string) {
    return this.ecommerceService.getShippingMethods(supplierId);
  }

  @Post('coupons/validate')
  async validateCoupon(@Body() validateCouponDto: any) {
    return this.ecommerceService.validateCoupon(validateCouponDto);
  }
}
