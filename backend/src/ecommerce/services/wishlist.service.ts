import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../../products/entities/product.entity';
import { Buyer } from '../../buyers/entities/buyer.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
  ) {}

  async getWishlist(buyerId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    return this.wishlistRepository.find({
      where: { buyerId: buyer.id },
      relations: ['product', 'product.supplier'],
      order: { addedAt: 'DESC' },
    });
  }

  async addToWishlist(buyerId: string, productId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    // Verify product exists and is active
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      throw new Error('Product not found or inactive');
    }

    // Check if already in wishlist
    const existingWishlistItem = await this.wishlistRepository.findOne({
      where: { buyerId: buyer.id, productId },
    });

    if (existingWishlistItem) {
      throw new Error('Product is already in your wishlist');
    }

    // Add to wishlist
    const wishlistItem = this.wishlistRepository.create({
      buyerId: buyer.id,
      productId,
    });

    return this.wishlistRepository.save(wishlistItem);
  }

  async removeFromWishlist(buyerId: string, productId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    const result = await this.wishlistRepository.delete({
      buyerId: buyer.id,
      productId,
    });

    if (result.affected === 0) {
      throw new Error('Product not found in wishlist');
    }

    return result;
  }

  async isInWishlist(buyerId: string, productId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      return false;
    }

    const wishlistItem = await this.wishlistRepository.findOne({
      where: { buyerId: buyer.id, productId },
    });

    return !!wishlistItem;
  }

  async clearWishlist(buyerId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    return this.wishlistRepository.delete({ buyerId: buyer.id });
  }

  async getWishlistCount(buyerId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      return 0;
    }

    return this.wishlistRepository.count({
      where: { buyerId: buyer.id },
    });
  }

  async moveToCart(buyerId: string, productId: string) {
    // Remove from wishlist
    await this.removeFromWishlist(buyerId, productId);

    // Add to cart (this would integrate with ShoppingCartService)
    // For now, just return success
    return {
      success: true,
      message: 'Product moved to cart',
    };
  }
}
