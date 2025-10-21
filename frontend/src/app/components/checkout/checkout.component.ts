import { Component, OnInit } from '@angular/core';

export interface CheckoutItem {
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

export interface DeliveryAddress {
  id: string;
  type: 'billing' | 'shipping';
  companyName: string;
  contactPerson: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'invoice';
  name: string;
  details: string;
  isDefault: boolean;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  
  // Checkout data
  checkoutItems: CheckoutItem[] = [];
  billingAddress: DeliveryAddress | null = null;
  shippingAddress: DeliveryAddress | null = null;
  paymentMethod: PaymentMethod | null = null;
  orderSummary: OrderSummary = {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    currency: 'SEK'
  };

  // Form data
  useSameAddress = true;
  deliveryNotes = '';
  specialInstructions = '';
  promoCode = '';
  termsAccepted = false;
  marketingConsent = false;

  // Available options
  availableAddresses: DeliveryAddress[] = [];
  availablePaymentMethods: PaymentMethod[] = [];
  deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', cost: 0, days: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', cost: 150, days: '1-2 business days' },
    { id: 'overnight', name: 'Overnight Delivery', cost: 300, days: 'Next business day' }
  ];
  selectedDeliveryOption = 'standard';

  // Loading states
  loading = false;
  processing = false;

  constructor() { }

  ngOnInit(): void {
    this.loadCheckoutData();
    this.calculateOrderSummary();
  }

  private loadCheckoutData(): void {
    // Mock data - replace with actual service
    this.checkoutItems = [
      {
        id: 'checkout-1',
        productId: 'prod-1',
        productName: 'Fever Tree Premium Indian Tonic Water',
        quantity: 2,
        unitPrice: 28.8,
        totalPrice: 57.6,
        supplierId: 'supplier-1',
        supplierName: 'Fever Tree Beverages',
        productImage: '/assets/images/products/tonic-water.jpg',
        moq: 1,
        unit: 'PC'
      },
      {
        id: 'checkout-2',
        productId: 'prod-2',
        productName: 'Organic Milk 330ml',
        quantity: 1,
        unitPrice: 6.0,
        totalPrice: 6.0,
        supplierId: 'supplier-2',
        supplierName: 'Luntgårdena Mejeri',
        productImage: '/assets/images/products/milk.jpg',
        moq: 1,
        unit: 'PC'
      }
    ];

    this.availableAddresses = [
      {
        id: 'addr-1',
        type: 'billing',
        companyName: 'My Company AB',
        contactPerson: 'John Doe',
        address: 'Storgatan 123',
        city: 'Stockholm',
        postalCode: '111 22',
        country: 'Sweden',
        phone: '+46 70 123 4567',
        email: 'john@mycompany.se',
        isDefault: true
      },
      {
        id: 'addr-2',
        type: 'shipping',
        companyName: 'My Company AB',
        contactPerson: 'Jane Smith',
        address: 'Vasagatan 45',
        city: 'Stockholm',
        postalCode: '111 23',
        country: 'Sweden',
        phone: '+46 70 987 6543',
        email: 'jane@mycompany.se',
        isDefault: false
      }
    ];

    this.availablePaymentMethods = [
      {
        id: 'pm-1',
        type: 'invoice',
        name: 'Invoice (30 days)',
        details: 'Net 30 payment terms',
        isDefault: true
      },
      {
        id: 'pm-2',
        type: 'bank_transfer',
        name: 'Bank Transfer',
        details: 'SEB Bank Account',
        isDefault: false
      },
      {
        id: 'pm-3',
        type: 'card',
        name: 'Credit Card',
        details: 'Visa/Mastercard',
        isDefault: false
      }
    ];

    // Set default addresses
    this.billingAddress = this.availableAddresses.find(addr => addr.isDefault) || this.availableAddresses[0];
    this.shippingAddress = this.useSameAddress ? this.billingAddress : this.availableAddresses[1];
    this.paymentMethod = this.availablePaymentMethods.find(pm => pm.isDefault) || this.availablePaymentMethods[0];
  }

  private calculateOrderSummary(): void {
    this.orderSummary.subtotal = this.checkoutItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    const selectedDelivery = this.deliveryOptions.find(opt => opt.id === this.selectedDeliveryOption);
    this.orderSummary.shipping = selectedDelivery ? selectedDelivery.cost : 0;
    
    this.orderSummary.tax = this.orderSummary.subtotal * 0.25; // 25% VAT
    this.orderSummary.discount = 0; // Will be calculated if promo code is applied
    this.orderSummary.total = this.orderSummary.subtotal + this.orderSummary.shipping + this.orderSummary.tax - this.orderSummary.discount;
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  // Address management
  onBillingAddressChange(addressId: string): void {
    this.billingAddress = this.availableAddresses.find(addr => addr.id === addressId) || null;
    if (this.useSameAddress) {
      this.shippingAddress = this.billingAddress;
    }
  }

  onShippingAddressChange(addressId: string): void {
    this.shippingAddress = this.availableAddresses.find(addr => addr.id === addressId) || null;
  }

  onUseSameAddressChange(): void {
    if (this.useSameAddress) {
      this.shippingAddress = this.billingAddress;
    }
  }

  // Payment method
  onPaymentMethodChange(paymentId: string): void {
    this.paymentMethod = this.availablePaymentMethods.find(pm => pm.id === paymentId) || null;
  }

  // Delivery options
  onDeliveryOptionChange(optionId: string): void {
    this.selectedDeliveryOption = optionId;
    this.calculateOrderSummary();
  }

  // Promo code
  applyPromoCode(): void {
    if (this.promoCode) {
      // Mock promo code logic
      if (this.promoCode.toLowerCase() === 'welcome10') {
        this.orderSummary.discount = this.orderSummary.subtotal * 0.1; // 10% discount
        this.calculateOrderSummary();
        console.log('Promo code applied successfully');
      } else {
        console.log('Invalid promo code');
      }
    }
  }

  // Item management
  updateItemQuantity(itemId: string, quantity: number): void {
    const item = this.checkoutItems.find(i => i.id === itemId);
    if (item && quantity >= item.moq) {
      item.quantity = quantity;
      item.totalPrice = item.quantity * item.unitPrice;
      this.calculateOrderSummary();
    }
  }

  removeItem(itemId: string): void {
    this.checkoutItems = this.checkoutItems.filter(item => item.id !== itemId);
    this.calculateOrderSummary();
  }

  // Checkout process
  placeOrder(): void {
    if (!this.validateCheckout()) {
      return;
    }

    this.processing = true;
    
    // Mock order placement
    setTimeout(() => {
      console.log('Order placed successfully');
      this.processing = false;
      // Navigate to order confirmation
    }, 2000);
  }

  private validateCheckout(): boolean {
    if (!this.billingAddress) {
      alert('Please select a billing address');
      return false;
    }
    
    if (!this.shippingAddress) {
      alert('Please select a shipping address');
      return false;
    }
    
    if (!this.paymentMethod) {
      alert('Please select a payment method');
      return false;
    }
    
    if (!this.termsAccepted) {
      alert('Please accept the terms and conditions');
      return false;
    }
    
    return true;
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getStepTitle(step: number): string {
    const titles = [
      'Review Items',
      'Delivery Address',
      'Payment Method',
      'Order Confirmation'
    ];
    return titles[step - 1] || '';
  }

  getStepDescription(step: number): string {
    const descriptions = [
      'Review your selected items and quantities',
      'Choose billing and shipping addresses',
      'Select your preferred payment method',
      'Confirm your order details and place order'
    ];
    return descriptions[step - 1] || '';
  }

  isStepCompleted(step: number): boolean {
    switch (step) {
      case 1:
        return this.checkoutItems.length > 0;
      case 2:
        return this.billingAddress !== null && this.shippingAddress !== null;
      case 3:
        return this.paymentMethod !== null;
      case 4:
        return this.termsAccepted;
      default:
        return false;
    }
  }

  canProceedToNextStep(): boolean {
    return this.isStepCompleted(this.currentStep);
  }

  getSelectedDeliveryOptionName(): string {
    const option = this.deliveryOptions.find(opt => opt.id === this.selectedDeliveryOption);
    return option ? option.name : '';
  }
}
