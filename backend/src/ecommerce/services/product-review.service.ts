import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReview } from '../entities/product-review.entity';
import { Product } from '../../products/entities/product.entity';
import { Buyer } from '../../buyers/entities/buyer.entity';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private productReviewRepository: Repository<ProductReview>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
  ) {}

  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await this.productReviewRepository.findAndCount({
      where: { productId, isApproved: true },
      relations: ['buyer', 'buyer.user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createReview(buyerId: string, productId: string, reviewDto: any) {
    const { rating, title, comment } = reviewDto;

    // Verify buyer exists
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await this.productReviewRepository.findOne({
      where: { buyerId: buyer.id, productId },
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // Create review
    const review = this.productReviewRepository.create({
      buyerId: buyer.id,
      productId,
      rating,
      title,
      comment,
      isVerifiedPurchase: false, // This would be determined by order history
      isApproved: false, // Reviews need approval
    });

    const savedReview = await this.productReviewRepository.save(review);

    // Update product rating (this would be done asynchronously)
    await this.updateProductRating(productId);

    return savedReview;
  }

  async updateReview(buyerId: string, reviewId: string, reviewDto: any) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    const review = await this.productReviewRepository.findOne({
      where: { id: reviewId, buyerId: buyer.id },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    const updatedReview = await this.productReviewRepository.update(
      { id: reviewId },
      {
        ...reviewDto,
        isApproved: false, // Reset approval status after update
      },
    );

    // Update product rating
    await this.updateProductRating(review.productId);

    return updatedReview;
  }

  async deleteReview(buyerId: string, reviewId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    const review = await this.productReviewRepository.findOne({
      where: { id: reviewId, buyerId: buyer.id },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    const result = await this.productReviewRepository.delete({ id: reviewId });

    // Update product rating
    await this.updateProductRating(review.productId);

    return result;
  }

  async approveReview(reviewId: string) {
    const review = await this.productReviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    const updatedReview = await this.productReviewRepository.update(
      { id: reviewId },
      { isApproved: true },
    );

    // Update product rating
    await this.updateProductRating(review.productId);

    return updatedReview;
  }

  private async updateProductRating(productId: string) {
    // Get all approved reviews for the product
    const reviews = await this.productReviewRepository.find({
      where: { productId, isApproved: true },
    });

    if (reviews.length === 0) {
      return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update product rating and review count
    await this.productRepository.update(productId, {
      rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      reviewCount: reviews.length,
    });
  }

  async getReviewStats(productId: string) {
    const reviews = await this.productReviewRepository.find({
      where: { productId, isApproved: true },
    });

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    reviews.forEach((review) => {
      ratingDistribution[review.rating]++;
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution,
    };
  }
}
