import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcommerceController } from './ecommerce.controller';
import { EcommerceService } from './ecommerce.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ProductReviewService } from './services/product-review.service';
import { WishlistService } from './services/wishlist.service';
import { ProductCategoryService } from './services/product-category.service';
import { PaymentMethodService } from './services/payment-method.service';
import { ShippingMethodService } from './services/shipping-method.service';
import { CouponService } from './services/coupon.service';

// Entities
import { ShoppingCart } from './entities/shopping-cart.entity';
import { ProductReview } from './entities/product-review.entity';
import { Wishlist } from './entities/wishlist.entity';
import { ProductCategory } from './entities/product-category.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { ShippingMethod } from './entities/shipping-method.entity';
import { Coupon } from './entities/coupon.entity';
import { Product } from '../products/entities/product.entity';
import { Buyer } from '../buyers/entities/buyer.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShoppingCart,
      ProductReview,
      Wishlist,
      ProductCategory,
      PaymentMethod,
      ShippingMethod,
      Coupon,
      Product,
      Buyer,
      Supplier,
    ]),
  ],
  controllers: [EcommerceController],
  providers: [
    EcommerceService,
    ShoppingCartService,
    ProductReviewService,
    WishlistService,
    ProductCategoryService,
    PaymentMethodService,
    ShippingMethodService,
    CouponService,
  ],
  exports: [
    EcommerceService,
    ShoppingCartService,
    ProductReviewService,
    WishlistService,
    ProductCategoryService,
    PaymentMethodService,
    ShippingMethodService,
    CouponService,
  ],
})
export class EcommerceModule {}
