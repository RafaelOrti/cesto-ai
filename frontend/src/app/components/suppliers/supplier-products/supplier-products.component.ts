import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit: string;
  moq: number; // Minimum Order Quantity
  imageUrl?: string;
  category: string;
  isNew: boolean;
  isOnSale: boolean;
  isAvailable: boolean;
  lastOrderDate?: string;
  campaign?: string;
  supplierId: string;
  supplierName: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplierId: string;
  supplierName: string;
}

@Component({
  selector: 'app-supplier-products',
  template: `
    <div class="supplier-products-container">
      <!-- Supplier Header -->
      <div class="supplier-header">
        <div class="supplier-info">
          <div class="supplier-logo">
            <img *ngIf="supplierLogo" [src]="supplierLogo" [alt]="supplierName">
            <div *ngIf="!supplierLogo" class="logo-placeholder">
              {{supplierName.charAt(0)}}
            </div>
          </div>
          <div class="supplier-details">
            <h2>{{supplierName}}</h2>
            <p>{{supplierDescription}}</p>
            <div class="supplier-categories">
              <span *ngFor="let category of supplierCategories" class="category-tag">
                {{category}}
              </span>
            </div>
          </div>
        </div>
        <div class="supplier-actions">
          <button class="btn btn-outline" (click)="contactSupplier()">
            <i class="fas fa-envelope"></i>
            Contact Information
          </button>
          <button class="btn btn-outline" (click)="viewDeliveryTerms()">
            <i class="fas fa-truck"></i>
            Delivery Terms
          </button>
        </div>
      </div>

      <!-- Order Info -->
      <div class="order-info" *ngIf="orderInfo">
        <div class="order-details">
          <div class="order-field">
            <label>Pre-delivery:</label>
            <input type="date" [(ngModel)]="orderInfo.preDeliveryDate" class="form-control">
          </div>
          <div class="order-field">
            <label>Order within:</label>
            <span class="order-deadline">{{orderInfo.orderDeadline}} days</span>
          </div>
          <div class="order-field">
            <label>Free shipping:</label>
            <span class="shipping-info">{{orderInfo.itemsLeftForFreeShipping}} items left for free shipping</span>
          </div>
          <div class="order-field">
            <label>Shipping fee:</label>
            <span class="shipping-fee">{{orderInfo.shippingFee}} kr</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs">
          <button class="tab" [class.active]="activeTab === 'products'" (click)="setActiveTab('products')">
            <i class="fas fa-box"></i>
            Products
          </button>
          <button class="tab" [class.active]="activeTab === 'delivery'" (click)="setActiveTab('delivery')">
            <i class="fas fa-truck"></i>
            Delivery Terms
          </button>
          <button class="tab" [class.active]="activeTab === 'history'" (click)="setActiveTab('history')">
            <i class="fas fa-history"></i>
            Order History
          </button>
          <button class="tab" [class.active]="activeTab === 'about'" (click)="setActiveTab('about')">
            <i class="fas fa-info-circle"></i>
            About Us
          </button>
        </div>
      </div>

      <!-- Products Tab Content -->
      <div *ngIf="activeTab === 'products'" class="tab-content">
        <!-- Filters -->
        <div class="filters-section">
          <div class="search-bar">
            <input type="text" [(ngModel)]="searchTerm" (input)="filterProducts()" 
                   placeholder="Search products..." class="form-control">
            <i class="fas fa-search search-icon"></i>
          </div>
          <div class="filter-options">
            <select [(ngModel)]="selectedCategory" (change)="filterProducts()" class="form-control">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category">
                {{category}}
              </option>
            </select>
            <div class="filter-checkboxes">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showOnlyNew" (change)="filterProducts()">
                <span>New Products</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showOnlyOnSale" (change)="filterProducts()">
                <span>On Sale</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
          <div *ngFor="let product of filteredProducts" class="product-card">
            <div class="product-image">
              <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name">
              <div *ngIf="!product.imageUrl" class="image-placeholder">
                <i class="fas fa-image"></i>
              </div>
              <div class="product-badges">
                <span *ngIf="product.isNew" class="badge new">New</span>
                <span *ngIf="product.isOnSale" class="badge sale">Sale</span>
              </div>
            </div>

            <div class="product-info">
              <h3 class="product-name">{{product.name}}</h3>
              <p class="product-description">{{product.description}}</p>
              
              <div class="product-details">
                <div class="detail-row">
                  <span class="label">MOQ:</span>
                  <span class="value">{{product.moq}} {{product.unit}}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Price:</span>
                  <div class="price-info">
                    <span class="current-price">€{{product.price}}/{{product.unit}}</span>
                    <span *ngIf="product.originalPrice" class="original-price">€{{product.originalPrice}}</span>
                  </div>
                </div>
                <div class="detail-row" *ngIf="product.lastOrderDate">
                  <span class="label">Last ordered:</span>
                  <span class="last-order" (click)="showOrderHistory(product.id)">
                    {{formatDate(product.lastOrderDate)}}
                  </span>
                </div>
                <div class="detail-row" *ngIf="product.campaign">
                  <span class="campaign-text">{{product.campaign}}</span>
                </div>
              </div>

              <div class="product-actions">
                <div class="quantity-selector">
                  <button class="qty-btn" (click)="decreaseQuantity(product.id)" [disabled]="getProductQuantity(product.id) <= product.moq">
                    <i class="fas fa-minus"></i>
                  </button>
                  <input type="number" [(ngModel)]="productQuantities[product.id]" 
                         [min]="product.moq" [step]="1" class="qty-input"
                         (change)="onQuantityChange(product.id, $event)">
                  <button class="qty-btn" (click)="increaseQuantity(product.id)">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <button class="btn btn-primary add-to-cart" 
                        (click)="addToCart(product)"
                        [disabled]="!product.isAvailable">
                  <i class="fas fa-shopping-cart"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Products Message -->
        <div *ngIf="filteredProducts.length === 0" class="no-products">
          <i class="fas fa-box-open"></i>
          <h3>No products found</h3>
          <p>No products match your current filters.</p>
          <button class="btn btn-primary" (click)="clearFilters()">Clear Filters</button>
        </div>
      </div>

      <!-- Delivery Terms Tab Content -->
      <div *ngIf="activeTab === 'delivery'" class="tab-content">
        <div class="delivery-terms">
          <h3>Delivery Terms</h3>
          <div class="terms-grid">
            <div class="term-item">
              <label>Minimum Order:</label>
              <span>{{deliveryTerms.minimumOrder || 'No minimum'}}</span>
            </div>
            <div class="term-item">
              <label>Shipping Costs:</label>
              <div class="shipping-costs">
                <div *ngFor="let cost of deliveryTerms.shippingCosts" class="cost-item">
                  <span>{{cost.range}}:</span>
                  <span>{{cost.cost}}</span>
                </div>
              </div>
            </div>
            <div class="term-item">
              <label>Delivery Schedule:</label>
              <div class="delivery-schedule">
                <table class="schedule-table">
                  <thead>
                    <tr>
                      <th>Order by</th>
                      <th>Time</th>
                      <th>Delivery on</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let schedule of deliveryTerms.deliverySchedule">
                      <td>{{schedule.orderBy}}</td>
                      <td>{{schedule.time}}</td>
                      <td>{{schedule.deliveryOn}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order History Tab Content -->
      <div *ngIf="activeTab === 'history'" class="tab-content">
        <app-order-history
          [isVisible]="true"
          [supplierId]="supplierId"
          [supplierName]="supplierName"
          [orders]="orderHistory"
          (closeEvent)="setActiveTab('products')"
          (reorderEvent)="onReorder($event)"
          (viewDetailsEvent)="onViewOrderDetails($event)"
          (downloadInvoiceEvent)="onDownloadInvoice($event)">
        </app-order-history>
      </div>

      <!-- About Us Tab Content -->
      <div *ngIf="activeTab === 'about'" class="tab-content">
        <div class="about-content">
          <h3>About {{supplierName}}</h3>
          <p>{{supplierDescription}}</p>
          <div class="supplier-stats">
            <div class="stat-item">
              <span class="stat-label">Joined:</span>
              <span class="stat-value">{{supplierJoinDate}}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total Orders:</span>
              <span class="stat-value">{{totalOrders}}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Rating:</span>
              <span class="stat-value">{{supplierRating}}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./supplier-products.component.scss']
})
export class SupplierProductsComponent implements OnInit {
  @Input() supplierId: string = '';
  @Input() supplierName: string = '';
  @Input() supplierDescription: string = '';
  @Input() supplierLogo?: string;
  @Input() supplierCategories: string[] = [];
  @Input() supplierJoinDate: string = '';
  @Input() supplierRating: number = 0;
  @Input() totalOrders: number = 0;

  @Output() addToCartEvent = new EventEmitter<CartItem>();
  @Output() contactSupplierEvent = new EventEmitter<string>();
  @Output() viewDeliveryTermsEvent = new EventEmitter<string>();

  // Component state
  activeTab: string = 'products';
  searchTerm: string = '';
  selectedCategory: string = '';
  showOnlyNew: boolean = false;
  showOnlyOnSale: boolean = false;
  
  // Data
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  productQuantities: { [productId: string]: number } = {};
  
  // Order info
  orderInfo = {
    preDeliveryDate: '2024-06-03',
    orderDeadline: 4,
    itemsLeftForFreeShipping: 2,
    shippingFee: 100
  };

  // Delivery terms
  deliveryTerms = {
    minimumOrder: 'No minimum order',
    shippingCosts: [
      { range: '0-2 items', cost: '100 kr' },
      { range: 'More than 2 items', cost: 'Free shipping' }
    ],
    deliverySchedule: [
      { orderBy: 'Friday', time: '17:00', deliveryOn: 'Monday' },
      { orderBy: 'Monday', time: '17:00', deliveryOn: 'Tuesday' },
      { orderBy: 'Wednesday', time: '17:00', deliveryOn: 'Thursday' },
      { orderBy: 'Thursday', time: '17:00', deliveryOn: 'Friday' }
    ]
  };

  // Order history
  orderHistory: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadOrderHistory();
  }

  private loadProducts(): void {
    // Mock data - replace with actual API call
    this.products = [
      {
        id: 'prod-1',
        name: 'Minimjölk 0,1%',
        description: 'Fresh milk from Swedish cows',
        price: 10,
        unit: 'PC',
        moq: 1,
        imageUrl: '/assets/images/products/minimjolk.jpg',
        category: 'Dairy',
        isNew: true,
        isOnSale: true,
        isAvailable: true,
        lastOrderDate: '2024-05-24',
        campaign: 'Beställ 10 pack och få 10% per dygn!',
        supplierId: this.supplierId,
        supplierName: this.supplierName
      },
      {
        id: 'prod-2',
        name: 'Getmjölk 1 L',
        description: 'Goat milk from local farms',
        price: 600,
        unit: 'PC',
        moq: 1,
        imageUrl: '/assets/images/products/getmjolk.jpg',
        category: 'Dairy',
        isNew: false,
        isOnSale: false,
        isAvailable: true,
        lastOrderDate: '2024-03-01',
        supplierId: this.supplierId,
        supplierName: this.supplierName
      },
      {
        id: 'prod-3',
        name: 'Lättmjölk 1L HV 80 st',
        description: 'Light milk in bulk packaging',
        price: 25,
        originalPrice: 30,
        unit: 'PC',
        moq: 20,
        imageUrl: '/assets/images/products/lattmjolk.jpg',
        category: 'Dairy',
        isNew: false,
        isOnSale: true,
        isAvailable: true,
        supplierId: this.supplierId,
        supplierName: this.supplierName
      }
    ];

    this.filteredProducts = [...this.products];
    this.initializeProductQuantities();
  }

  private loadCategories(): void {
    this.categories = ['Dairy', 'Meat', 'Vegetables', 'Bakery', 'Beverages'];
  }

  private loadOrderHistory(): void {
    // Mock order history - replace with actual API call
    this.orderHistory = [
      {
        id: 'order-1',
        orderNumber: 'ORD-2024-001',
        orderDate: '2024-05-24',
        totalAmount: 1250,
        status: 'delivered'
      }
    ];
  }

  private initializeProductQuantities(): void {
    this.products.forEach(product => {
      this.productQuantities[product.id] = product.moq;
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesNew = !this.showOnlyNew || product.isNew;
      const matchesSale = !this.showOnlyOnSale || product.isOnSale;

      return matchesSearch && matchesCategory && matchesNew && matchesSale;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.showOnlyNew = false;
    this.showOnlyOnSale = false;
    this.filterProducts();
  }

  increaseQuantity(productId: string): void {
    const currentQty = this.productQuantities[productId] || 0;
    this.productQuantities[productId] = currentQty + 1;
  }

  decreaseQuantity(productId: string): void {
    const currentQty = this.productQuantities[productId] || 0;
    const product = this.products.find(p => p.id === productId);
    if (product && currentQty > product.moq) {
      this.productQuantities[productId] = currentQty - 1;
    }
  }

  updateQuantity(productId: string, value: string): void {
    const quantity = parseInt(value) || 0;
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.productQuantities[productId] = Math.max(quantity, product.moq);
    }
  }

  onQuantityChange(productId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateQuantity(productId, target.value);
  }

  getProductQuantity(productId: string): number {
    return this.productQuantities[productId] || 0;
  }

  addToCart(product: Product): void {
    const quantity = this.productQuantities[product.id];
    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      supplierId: product.supplierId,
      supplierName: product.supplierName
    };

    this.addToCartEvent.emit(cartItem);
    
    // Show success message or update UI
    console.log('Added to cart:', cartItem);
  }

  showOrderHistory(productId: string): void {
    // Show order history for this specific product
    console.log('Show order history for product:', productId);
  }

  contactSupplier(): void {
    this.contactSupplierEvent.emit(this.supplierId);
  }

  viewDeliveryTerms(): void {
    this.viewDeliveryTermsEvent.emit(this.supplierId);
  }

  onReorder(orderId: string): void {
    console.log('Reorder:', orderId);
  }

  onViewOrderDetails(orderId: string): void {
    console.log('View order details:', orderId);
  }

  onDownloadInvoice(orderId: string): void {
    console.log('Download invoice:', orderId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
}
