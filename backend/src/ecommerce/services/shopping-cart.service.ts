import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCart } from '../entities/shopping-cart.entity';
import { Product } from '../../products/entities/product.entity';
import { Buyer } from '../../buyers/entities/buyer.entity';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Buyer)
    private buyerRepository: Repository<Buyer>,
  ) {}

  async getCart(buyerId: string) {
    return this.shoppingCartRepository.find({
      where: { buyerId },
      relations: ['product', 'product.supplier'],
      order: { addedAt: 'DESC' },
    });
  }

  async addToCart(buyerId: string, addToCartDto: any) {
    const { productId, quantity = 1 } = addToCartDto;

    // Verify buyer exists
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

    // Check stock availability
    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }

    // Check if item already exists in cart
    const existingCartItem = await this.shoppingCartRepository.findOne({
      where: { buyerId: buyer.id, productId },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.stockQuantity < newQuantity) {
        throw new Error('Insufficient stock for requested quantity');
      }

      return this.shoppingCartRepository.update(
        { buyerId: buyer.id, productId },
        { quantity: newQuantity },
      );
    } else {
      // Add new item to cart
      const cartItem = this.shoppingCartRepository.create({
        buyerId: buyer.id,
        productId,
        quantity,
      });

      return this.shoppingCartRepository.save(cartItem);
    }
  }

  async updateCartItem(buyerId: string, productId: string, updateCartDto: any) {
    const { quantity } = updateCartDto;

    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    if (quantity <= 0) {
      return this.removeFromCart(buyerId, productId);
    }

    // Check stock availability
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      throw new Error('Product not found or inactive');
    }

    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }

    const cartItem = await this.shoppingCartRepository.findOne({
      where: { buyerId: buyer.id, productId },
    });

    if (!cartItem) {
      throw new Error('Item not found in cart');
    }

    return this.shoppingCartRepository.update(
      { buyerId: buyer.id, productId },
      { quantity },
    );
  }

  async removeFromCart(buyerId: string, productId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    return this.shoppingCartRepository.delete({
      buyerId: buyer.id,
      productId,
    });
  }

  async clearCart(buyerId: string) {
    const buyer = await this.buyerRepository.findOne({
      where: { userId: buyerId },
    });

    if (!buyer) {
      throw new Error('Buyer not found');
    }

    return this.shoppingCartRepository.delete({ buyerId: buyer.id });
  }

  async getCartTotal(buyerId: string) {
    const cartItems = await this.getCart(buyerId);
    
    const subtotal = cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0,
    );

    const itemCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return {
      subtotal,
      itemCount,
      items: cartItems,
    };
  }
}

