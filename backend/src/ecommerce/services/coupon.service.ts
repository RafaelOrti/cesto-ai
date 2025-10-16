import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Coupon } from '../entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async getAllCoupons() {
    return this.couponRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getCouponByCode(code: string) {
    return this.couponRepository.findOne({
      where: { code, isActive: true },
    });
  }

  async getActiveCoupons() {
    const now = new Date();
    return this.couponRepository.find({
      where: {
        isActive: true,
        startDate: Between(new Date(0), now),
        endDate: Between(now, new Date('2099-12-31')),
      },
      order: { endDate: 'ASC' },
    });
  }

  async validateCoupon(code: string, orderAmount: number, productIds?: string[]) {
    const coupon = await this.getCouponByCode(code);

    if (!coupon) {
      return {
        valid: false,
        message: 'Invalid coupon code',
      };
    }

    const now = new Date();

    // Check if coupon is within date range
    if (now < coupon.startDate || now > coupon.endDate) {
      return {
        valid: false,
        message: 'Coupon has expired',
      };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return {
        valid: false,
        message: 'Coupon usage limit reached',
      };
    }

    // Check minimum order amount
    if (coupon.minimumOrderAmount && orderAmount < coupon.minimumOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount of ${coupon.minimumOrderAmount} required`,
      };
    }

    // Check applicable products
    if (coupon.applicableProducts.length > 0 && productIds) {
      const hasApplicableProduct = productIds.some(productId =>
        coupon.applicableProducts.includes(productId),
      );
      
      if (!hasApplicableProduct) {
        return {
          valid: false,
          message: 'Coupon is not applicable to any products in your order',
        };
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    
    if (coupon.type === 'percentage') {
      discountAmount = (orderAmount * coupon.value) / 100;
      
      // Apply maximum discount limit
      if (coupon.maximumDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
      }
    } else if (coupon.type === 'fixed_amount') {
      discountAmount = Math.min(coupon.value, orderAmount);
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: 'Coupon applied successfully',
    };
  }

  async applyCoupon(code: string) {
    const coupon = await this.getCouponByCode(code);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    // Increment usage count
    await this.couponRepository.update(
      { id: coupon.id },
      { usageCount: coupon.usageCount + 1 },
    );

    return coupon;
  }

  async createCoupon(couponData: any) {
    const coupon = this.couponRepository.create(couponData);
    return this.couponRepository.save(coupon);
  }

  async updateCoupon(id: string, couponData: any) {
    return this.couponRepository.update(id, couponData);
  }

  async deleteCoupon(id: string) {
    return this.couponRepository.update(id, { isActive: false });
  }

  async getCouponStats() {
    const totalCoupons = await this.couponRepository.count();
    const activeCoupons = await this.getActiveCoupons();
    
    const totalUsage = await this.couponRepository
      .createQueryBuilder('coupon')
      .select('SUM(coupon.usageCount)', 'total')
      .getRawOne();

    return {
      totalCoupons,
      activeCoupons: activeCoupons.length,
      totalUsage: parseInt(totalUsage.total) || 0,
    };
  }
}
