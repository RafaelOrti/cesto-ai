import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { ShippingMethod } from './entities/shipping-method.entity';
import { Coupon } from './entities/coupon.entity';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ProductReviewService } from './services/product-review.service';

@Injectable()
export class EcommerceService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(ShippingMethod)
    private shippingMethodRepository: Repository<ShippingMethod>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    private shoppingCartService: ShoppingCartService,
    private productReviewService: ProductReviewService,
  ) {}

  async getProducts(filters: any) {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      minPrice,
      maxPrice,
      isOnSale,
      isFeatured,
    } = filters;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product.isActive = :isActive', { isActive: true });

    // Apply filters
    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.tags @> :tags)',
        { search: `%${search}%`, tags: [search] },
      );
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (isOnSale !== undefined) {
      queryBuilder.andWhere('product.isOnSale = :isOnSale', { isOnSale });
    }

    if (isFeatured !== undefined) {
      queryBuilder.andWhere('product.isFeatured = :isFeatured', {
        isFeatured,
      });
    }

    // Apply sorting
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProduct(productId: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product.id = :productId', { productId })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getOne();

    if (!product) {
      throw new Error('Product not found');
    }

    // Increment view count
    await this.productRepository.update(productId, {
      viewCount: product.viewCount + 1,
    });

    // Get product reviews
    const reviews = await this.productReviewService.getProductReviews(
      productId,
      1,
      5,
    );

    return {
      ...product,
      reviews,
    };
  }

  async getCategories() {
    return this.productCategoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async getFeaturedProducts(limit: number = 10) {
    return this.productRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['supplier'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getOnSaleProducts(limit: number = 10) {
    const now = new Date();
    return this.productRepository.find({
      where: {
        isOnSale: true,
        isActive: true,
        saleStartDate: Between(new Date(0), now),
        saleEndDate: Between(now, new Date('2099-12-31')),
      },
      relations: ['supplier'],
      order: { saleStartDate: 'DESC' },
      take: limit,
    });
  }

  async checkout(buyerId: string, checkoutDto: any) {
    // Get cart items
    const cartItems = await this.shoppingCartService.getCart(buyerId);

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    // Apply coupon if provided
    let discount = 0;
    if (checkoutDto.couponCode) {
      const coupon = await this.validateCoupon({
        code: checkoutDto.couponCode,
        amount: subtotal,
      });
      if (coupon.valid) {
        discount = coupon.discountAmount;
      }
    }

    // Calculate shipping
    const shippingCost = this.calculateShippingCost(
      checkoutDto.shippingMethodId,
      subtotal,
    );

    const total = subtotal - discount + shippingCost;

    // Create order (this would integrate with your existing order system)
    const orderData = {
      buyerId,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
      })),
      subtotal,
      discount,
      shippingCost,
      total,
      shippingMethod: checkoutDto.shippingMethodId,
      paymentMethod: checkoutDto.paymentMethodId,
      shippingAddress: checkoutDto.shippingAddress,
    };

    // Clear cart after successful checkout
    await this.shoppingCartService.clearCart(buyerId);

    return {
      success: true,
      orderData,
      message: 'Order created successfully',
    };
  }

  async getPaymentMethods() {
    return this.paymentMethodRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getShippingMethods(supplierId: string) {
    return this.shippingMethodRepository.find({
      where: { supplierId, isActive: true },
      order: { cost: 'ASC' },
    });
  }

  async validateCoupon(validateCouponDto: any) {
    const { code, amount } = validateCouponDto;

    const coupon = await this.couponRepository.findOne({
      where: { code, isActive: true },
    });

    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code' };
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return { valid: false, message: 'Coupon has expired' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    if (coupon.minimumOrderAmount && amount < coupon.minimumOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount of ${coupon.minimumOrderAmount} required`,
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (amount * coupon.value) / 100;
      if (coupon.maximumDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
      }
    } else if (coupon.type === 'fixed_amount') {
      discountAmount = coupon.value;
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: 'Coupon applied successfully',
    };
  }

  private calculateShippingCost(shippingMethodId: string, subtotal: number) {
    // This would fetch the shipping method and calculate cost
    // For now, return a simple calculation
    return subtotal > 200 ? 0 : 15; // Free shipping over 200, otherwise 15
  }
}
