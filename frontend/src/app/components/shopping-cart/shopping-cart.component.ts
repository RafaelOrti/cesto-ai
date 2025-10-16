import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplierId: string;
  supplierName: string;
  productImage?: string;
  moq: number;
  unit: string;
}

export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  shippingCost: number;
  freeShippingThreshold: number;
  itemsLeftForFreeShipping: number;
  finalTotal: number;
}

@Component({
  selector: 'app-shopping-cart',
  template: `
    <div class="shopping-cart-container">
      <!-- Header -->
      <div class="cart-header">
        <h1>
          <i class="fas fa-shopping-cart"></i>
          Shopping Cart
          <span class="item-count" *ngIf="cartSummary.totalItems > 0">
            ({{cartSummary.totalItems}} {{cartSummary.totalItems === 1 ? 'item' : 'items'}})
          </span>
        </h1>
        <button class="btn btn-outline" (click)="clearCart()" *ngIf="cartItems.length > 0">
          <i class="fas fa-trash"></i>
          Clear Cart
        </button>
      </div>

      <!-- Cart Content -->
      <div class="cart-content" *ngIf="cartItems.length > 0; else emptyCart">
        <!-- Cart Items -->
        <div class="cart-items">
          <div *ngFor="let item of cartItems; trackBy: trackByItemId" class="cart-item">
            <div class="item-image">
              <img *ngIf="item.productImage" [src]="item.productImage" [alt]="item.productName">
              <div *ngIf="!item.productImage" class="image-placeholder">
                <i class="fas fa-image"></i>
              </div>
            </div>

            <div class="item-details">
              <h3 class="item-name">{{item.productName}}</h3>
              <p class="supplier-name">{{item.supplierName}}</p>
              <div class="item-specs">
                <span class="unit-price">€{{item.unitPrice}}/{{item.unit}}</span>
                <span class="moq">MOQ: {{item.moq}} {{item.unit}}</span>
              </div>
            </div>

            <div class="item-quantity">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button class="qty-btn" (click)="decreaseQuantity(item.id)" 
                        [disabled]="item.quantity <= item.moq">
                  <i class="fas fa-minus"></i>
                </button>
                <input type="number" [(ngModel)]="item.quantity" 
                       [min]="item.moq" [step]="1" 
                       (change)="onQuantityChange(item.id, $event)"
                       class="qty-input">
                <button class="qty-btn" (click)="increaseQuantity(item.id)">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <div class="item-total">
              <span class="total-price">€{{item.totalPrice}}</span>
              <button class="remove-btn" (click)="removeItem(item.id)" title="Remove item">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>
            
            <div class="summary-row">
              <span>Subtotal ({{cartSummary.totalItems}} items):</span>
              <span>€{{cartSummary.totalAmount}}</span>
            </div>

            <div class="summary-row shipping-info" *ngIf="cartSummary.shippingCost > 0">
              <span>Shipping:</span>
              <span>€{{cartSummary.shippingCost}}</span>
            </div>

            <div class="summary-row free-shipping" *ngIf="cartSummary.shippingCost === 0">
              <span>Shipping:</span>
              <span class="free-text">Free Shipping</span>
            </div>

            <div class="summary-row" *ngIf="cartSummary.itemsLeftForFreeShipping > 0">
              <span class="free-shipping-info">
                Add {{cartSummary.itemsLeftForFreeShipping}} more items for free shipping
              </span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total-row">
              <span>Total:</span>
              <span class="total-amount">€{{cartSummary.finalTotal}}</span>
            </div>

            <div class="checkout-actions">
              <button class="btn btn-primary btn-large" (click)="proceedToCheckout()">
                <i class="fas fa-credit-card"></i>
                Proceed to Checkout
              </button>
              <button class="btn btn-secondary" (click)="continueShopping()">
                <i class="fas fa-arrow-left"></i>
                Continue Shopping
              </button>
            </div>
          </div>

          <!-- Delivery Information -->
          <div class="delivery-info">
            <h4>Delivery Information</h4>
            <div class="delivery-details">
              <div class="delivery-item">
                <i class="fas fa-calendar"></i>
                <span>Estimated delivery: 3-5 business days</span>
              </div>
              <div class="delivery-item">
                <i class="fas fa-truck"></i>
                <span>Free delivery on orders over €100</span>
              </div>
              <div class="delivery-item">
                <i class="fas fa-shield-alt"></i>
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Cart State -->
      <ng-template #emptyCart>
        <div class="empty-cart">
          <div class="empty-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started with your order.</p>
          <button class="btn btn-primary" (click)="continueShopping()">
            <i class="fas fa-shopping-bag"></i>
            Start Shopping
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Cart data
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    totalItems: 0,
    totalAmount: 0,
    shippingCost: 0,
    freeShippingThreshold: 100,
    itemsLeftForFreeShipping: 0,
    finalTotal: 0
  };

  constructor() { }

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateSummary();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartItems(): void {
    // Mock data - replace with actual service
    this.cartItems = [
      {
        id: 'cart-1',
        productId: 'prod-1',
        productName: 'Minimjölk 0,1%',
        quantity: 2,
        unitPrice: 10,
        totalPrice: 20,
        supplierId: 'supplier-1',
        supplierName: 'Luntgårdens Mejeri',
        productImage: '/assets/images/products/minimjolk.jpg',
        moq: 1,
        unit: 'PC'
      },
      {
        id: 'cart-2',
        productId: 'prod-2',
        productName: 'Getmjölk 1 L',
        quantity: 1,
        unitPrice: 600,
        totalPrice: 600,
        supplierId: 'supplier-1',
        supplierName: 'Luntgårdens Mejeri',
        productImage: '/assets/images/products/getmjolk.jpg',
        moq: 1,
        unit: 'PC'
      }
    ];
  }

  private calculateSummary(): void {
    this.cartSummary.totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.cartSummary.totalAmount = this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Calculate shipping
    if (this.cartSummary.totalAmount >= this.cartSummary.freeShippingThreshold) {
      this.cartSummary.shippingCost = 0;
      this.cartSummary.itemsLeftForFreeShipping = 0;
    } else {
      this.cartSummary.shippingCost = 100; // Fixed shipping cost
      this.cartSummary.itemsLeftForFreeShipping = Math.ceil(
        (this.cartSummary.freeShippingThreshold - this.cartSummary.totalAmount) / 50
      );
    }
    
    this.cartSummary.finalTotal = this.cartSummary.totalAmount + this.cartSummary.shippingCost;
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  increaseQuantity(itemId: string): void {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity += 1;
      item.totalPrice = item.quantity * item.unitPrice;
      this.calculateSummary();
    }
  }

  decreaseQuantity(itemId: string): void {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item && item.quantity > item.moq) {
      item.quantity -= 1;
      item.totalPrice = item.quantity * item.unitPrice;
      this.calculateSummary();
    }
  }

  updateQuantity(itemId: string, value: string): void {
    const quantity = parseInt(value) || 0;
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(quantity, item.moq);
      item.quantity = newQuantity;
      item.totalPrice = item.quantity * item.unitPrice;
      this.calculateSummary();
    }
  }

  onQuantityChange(itemId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateQuantity(itemId, target.value);
  }

  removeItem(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.calculateSummary();
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartItems = [];
      this.calculateSummary();
    }
  }

  proceedToCheckout(): void {
    // Navigate to checkout or open checkout modal
    console.log('Proceeding to checkout with items:', this.cartItems);
    // Implement checkout logic
  }

  continueShopping(): void {
    // Navigate back to suppliers or products
    console.log('Continue shopping');
    // Implement navigation logic
  }
}
