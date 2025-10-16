import { Component, OnInit } from '@angular/core';

interface SupplierCategory {
  id: string;
  name: string;
  nameSwedish: string;
  nameSpanish: string;
  nameEnglish: string;
  active: boolean;
}

interface SupplierCampaign {
  id: string;
  name: string;
  discount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

interface SupplierProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isNew: boolean;
  isOnSale: boolean;
  category: string;
}

interface MySupplier {
  id: string;
  companyName: string;
  supplierName: string;
  logo?: string;
  categories: SupplierCategory[];
  activeCampaigns: SupplierCampaign[];
  newProducts: SupplierProduct[];
  deliveryInfo: {
    combinedDelivery: boolean;
    freeShipping: boolean;
  };
  status: 'active' | 'stopped' | 'potential';
  lastOrderDate?: string;
  totalOrders: number;
  rating: number;
}

@Component({
  selector: 'app-suppliers',
  template: `
    <div class="my-suppliers-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>My Suppliers</h1>
          <p>Manage and view information about your current suppliers</p>
        </div>
      </div>

      <!-- Filters and Actions -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Filter by Status:</label>
          <select [(ngModel)]="selectedStatus" (change)="applyFilters()">
            <option value="">All Suppliers</option>
            <option value="potential">Suppliers I may need to buy from</option>
            <option value="active">Current Suppliers</option>
            <option value="stopped">Suppliers I have stopped buying from</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Filter by Category:</label>
          <select [(ngModel)]="selectedCategory" (change)="applyFilters()">
            <option value="">All Categories</option>
            <option *ngFor="let category of availableCategories" [value]="category.id">
              {{category.nameSpanish}}
            </option>
          </select>
        </div>

        <div class="actions-group">
          <button class="btn btn-primary" routerLink="/suppliers/search">
            <i class="fas fa-search"></i>
            Search New Suppliers
          </button>
        </div>
      </div>

      <!-- Suppliers Table -->
      <div class="suppliers-table-container">
        <div class="table-header">
          <h3>My Suppliers ({{filteredSuppliers.length}})</h3>
          <div class="view-options">
            <button class="view-btn" [class.active]="viewMode === 'table'" (click)="setViewMode('table')">
              <i class="fas fa-table"></i>
            </button>
            <button class="view-btn" [class.active]="viewMode === 'cards'" (click)="setViewMode('cards')">
              <i class="fas fa-th-large"></i>
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div *ngIf="viewMode === 'table'" class="table-view">
          <table class="suppliers-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Active Categories</th>
                <th>Delivery Options</th>
                <th>Active Campaigns</th>
                <th>New Products</th>
                <th>Status</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let supplier of filteredSuppliers; trackBy: trackBySupplierId" class="supplier-row" [attr.data-supplier-id]="supplier.id">
                <!-- Supplier Info -->
                <td class="supplier-cell">
                  <div class="supplier-info">
                    <div class="supplier-logo">
                      <img *ngIf="supplier.logo" [src]="supplier.logo" [alt]="supplier.supplierName">
                      <div *ngIf="!supplier.logo" class="logo-placeholder">
                        {{supplier.supplierName.charAt(0)}}
                      </div>
                    </div>
                    <div class="supplier-details">
                      <h4>{{supplier.supplierName}}</h4>
                      <p>{{supplier.companyName}}</p>
                      <div class="rating">
                        <span class="stars">{{getStars(supplier.rating)}}</span>
                        <span class="rating-text">({{supplier.rating}}/5)</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Active Categories -->
                <td class="categories-cell">
                  <div class="categories-list">
                    <span *ngFor="let category of supplier.categories; let last = last" 
                          class="category-badge" 
                          [title]="getCategoryFullName(category)">
                      {{category.nameSpanish}}
                    </span>
                    <span *ngIf="supplier.categories.length === 0" class="no-categories">
                      No active categories
                    </span>
                  </div>
                </td>

                <!-- Delivery Options -->
                <td class="delivery-cell">
                  <div class="delivery-options">
                    <div class="delivery-option" *ngIf="supplier.deliveryInfo.combinedDelivery">
                      <i class="fas fa-truck"></i>
                      <span>Combined delivery</span>
                    </div>
                    <div class="delivery-option" *ngIf="supplier.deliveryInfo.freeShipping">
                      <i class="fas fa-shipping-fast"></i>
                      <span>Free shipping</span>
                    </div>
                    <span *ngIf="!supplier.deliveryInfo.combinedDelivery && !supplier.deliveryInfo.freeShipping" 
                          class="no-delivery-options">
                      Standard delivery
                    </span>
                  </div>
                </td>

                <!-- Active Campaigns -->
                <td class="campaigns-cell">
                  <div class="campaigns-list">
                    <div *ngFor="let campaign of supplier.activeCampaigns" class="campaign-item">
                      <div class="campaign-badge">
                        <span class="campaign-name">{{campaign.name}}</span>
                        <span class="campaign-discount">-{{campaign.discount}}%</span>
                      </div>
                      <div class="campaign-dates">
                        {{formatDate(campaign.startDate)}} - {{formatDate(campaign.endDate)}}
                      </div>
                    </div>
                    <span *ngIf="supplier.activeCampaigns.length === 0" class="no-campaigns">
                      No active campaigns
                    </span>
                  </div>
                </td>

                <!-- New Products -->
                <td class="products-cell">
                  <div class="products-list">
                    <div *ngFor="let product of supplier.newProducts.slice(0, 2)" class="product-item">
                      <div class="product-info">
                        <span class="product-name">{{product.name}}</span>
                        <div class="product-price">
                          <span *ngIf="product.isOnSale && product.originalPrice" class="original-price">
                            €{{product.originalPrice}}
                          </span>
                          <span class="current-price">€{{product.price}}</span>
                        </div>
                      </div>
                      <div class="product-badges">
                        <span *ngIf="product.isNew" class="badge new">New</span>
                        <span *ngIf="product.isOnSale" class="badge sale">Sale</span>
                      </div>
                    </div>
                    <div *ngIf="supplier.newProducts.length > 2" class="more-products">
                      +{{supplier.newProducts.length - 2}} more products
                    </div>
                    <span *ngIf="supplier.newProducts.length === 0" class="no-products">
                      No new products
                    </span>
                  </div>
                </td>

                <!-- Status -->
                <td class="status-cell">
                  <div class="status-badge" [ngClass]="'status-' + supplier.status">
                    {{getStatusText(supplier.status)}}
                  </div>
                </td>

                <!-- Last Order -->
                <td class="last-order-cell">
                  <div *ngIf="supplier.lastOrderDate" class="last-order-info">
                    <span class="order-date">{{formatDate(supplier.lastOrderDate)}}</span>
                    <span class="total-orders">{{supplier.totalOrders}} orders</span>
                  </div>
                  <span *ngIf="!supplier.lastOrderDate" class="no-orders">
                    No orders yet
                  </span>
                </td>

                <!-- Actions -->
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" 
                            (click)="viewSupplier(supplier.id)"
                            title="View Supplier">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary order-btn" 
                            (click)="placeOrder(supplier.id)"
                            title="Place Order">
                      <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" 
                            (click)="contactSupplier(supplier.id)"
                            title="Contact Supplier">
                      <i class="fas fa-envelope"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards View -->
        <div *ngIf="viewMode === 'cards'" class="cards-view">
          <div class="suppliers-grid">
            <div *ngFor="let supplier of filteredSuppliers; trackBy: trackBySupplierId" 
                 class="supplier-card"
                 [attr.data-supplier-id]="supplier.id">
              <div class="card-header">
                <div class="supplier-logo">
                  <img *ngIf="supplier.logo" [src]="supplier.logo" [alt]="supplier.supplierName">
                  <div *ngIf="!supplier.logo" class="logo-placeholder">
                    {{supplier.supplierName.charAt(0)}}
                  </div>
                </div>
                <div class="status-badge" [ngClass]="'status-' + supplier.status">
                  {{getStatusText(supplier.status)}}
                </div>
              </div>

              <div class="card-content">
                <h4>{{supplier.supplierName}}</h4>
                <p>{{supplier.companyName}}</p>
                
                <div class="rating">
                  <span class="stars">{{getStars(supplier.rating)}}</span>
                  <span class="rating-text">({{supplier.rating}}/5)</span>
                </div>

                <div class="categories-section">
                  <h5>Active Categories:</h5>
                  <div class="categories-list">
                    <span *ngFor="let category of supplier.categories" 
                          class="category-badge">
                      {{category.nameSpanish}}
                    </span>
                  </div>
                </div>

                <div class="campaigns-section" *ngIf="supplier.activeCampaigns.length > 0">
                  <h5>Active Campaigns:</h5>
                  <div class="campaigns-list">
                    <div *ngFor="let campaign of supplier.activeCampaigns" class="campaign-item">
                      <span class="campaign-name">{{campaign.name}}</span>
                      <span class="campaign-discount">-{{campaign.discount}}%</span>
                    </div>
                  </div>
                </div>

                <div class="delivery-section">
                  <div class="delivery-options">
                    <span *ngIf="supplier.deliveryInfo.combinedDelivery" class="delivery-option">
                      <i class="fas fa-truck"></i> Combined delivery
                    </span>
                    <span *ngIf="supplier.deliveryInfo.freeShipping" class="delivery-option">
                      <i class="fas fa-shipping-fast"></i> Free shipping
                    </span>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <div class="action-buttons">
                  <button class="btn btn-sm btn-primary" (click)="viewSupplier(supplier.id)">
                    View Details
                  </button>
                  <button class="btn btn-sm btn-secondary order-btn" (click)="placeOrder(supplier.id)">
                    Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredSuppliers.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-users"></i>
          </div>
          <h3>No suppliers found</h3>
          <p>No suppliers match your current filters. Try adjusting your search criteria.</p>
          <button class="btn btn-primary" (click)="clearFilters()">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  // Data properties
  suppliers: MySupplier[] = [];
  filteredSuppliers: MySupplier[] = [];
  availableCategories: SupplierCategory[] = [];
  
  // Filter properties
  selectedStatus: string = '';
  selectedCategory: string = '';
  
  // View properties
  viewMode: 'table' | 'cards' = 'table';

  constructor() { }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadCategories();
  }

  private loadSuppliers(): void {
    // Mock data - replace with actual API call
    this.suppliers = [
      {
        id: '1',
        companyName: 'ICA Sverige AB',
        supplierName: 'ICA',
        logo: '/assets/images/suppliers/ica-logo.png',
        categories: [
          { id: '1', name: 'Groceries', nameSwedish: 'Livsmedel', nameSpanish: 'Comestibles', nameEnglish: 'Groceries', active: true },
          { id: '2', name: 'Dairy', nameSwedish: 'Mejeri', nameSpanish: 'Lácteos', nameEnglish: 'Dairy', active: true }
        ],
        activeCampaigns: [
          { id: '1', name: 'Summer Sale', discount: 15, startDate: '2024-06-01', endDate: '2024-08-31', active: true }
        ],
        newProducts: [
          { id: '1', name: 'Organic Milk 1L', price: 12.50, originalPrice: 15.00, isNew: true, isOnSale: true, category: 'Dairy' },
          { id: '2', name: 'Fresh Bread', price: 25.00, isNew: true, isOnSale: false, category: 'Bakery' }
        ],
        deliveryInfo: {
          combinedDelivery: true,
          freeShipping: false
        },
        status: 'active',
        lastOrderDate: '2024-01-15',
        totalOrders: 45,
        rating: 4.5
      },
      {
        id: '2',
        companyName: 'Coop Sverige',
        supplierName: 'Coop',
        categories: [
          { id: '3', name: 'Meat', nameSwedish: 'Kött', nameSpanish: 'Carnes', nameEnglish: 'Meat', active: true },
          { id: '4', name: 'Vegetables', nameSwedish: 'Grönsaker', nameSpanish: 'Verduras', nameEnglish: 'Vegetables', active: true }
        ],
        activeCampaigns: [],
        newProducts: [
          { id: '3', name: 'Organic Chicken', price: 85.00, isNew: true, isOnSale: false, category: 'Meat' }
        ],
        deliveryInfo: {
          combinedDelivery: true,
          freeShipping: true
        },
        status: 'potential',
        totalOrders: 0,
        rating: 4.2
      },
      {
        id: '3',
        companyName: 'Axfood AB',
        supplierName: 'Willys',
        categories: [
          { id: '1', name: 'Groceries', nameSwedish: 'Livsmedel', nameSpanish: 'Comestibles', nameEnglish: 'Groceries', active: true }
        ],
        activeCampaigns: [
          { id: '2', name: 'Weekly Special', discount: 20, startDate: '2024-01-01', endDate: '2024-01-31', active: true }
        ],
        newProducts: [],
        deliveryInfo: {
          combinedDelivery: false,
          freeShipping: false
        },
        status: 'stopped',
        lastOrderDate: '2023-11-20',
        totalOrders: 12,
        rating: 3.8
      }
    ];

    this.filteredSuppliers = [...this.suppliers];
  }

  private loadCategories(): void {
    // Mock categories - replace with actual API call
    this.availableCategories = [
      { id: '1', name: 'Groceries', nameSwedish: 'Livsmedel', nameSpanish: 'Comestibles', nameEnglish: 'Groceries', active: true },
      { id: '2', name: 'Dairy', nameSwedish: 'Mejeri', nameSpanish: 'Lácteos', nameEnglish: 'Dairy', active: true },
      { id: '3', name: 'Meat', nameSwedish: 'Kött', nameSpanish: 'Carnes', nameEnglish: 'Meat', active: true },
      { id: '4', name: 'Vegetables', nameSwedish: 'Grönsaker', nameSpanish: 'Verduras', nameEnglish: 'Vegetables', active: true },
      { id: '5', name: 'Bakery', nameSwedish: 'Bageri', nameSpanish: 'Panadería', nameEnglish: 'Bakery', active: true }
    ];
  }

  applyFilters(): void {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      const statusMatch = !this.selectedStatus || supplier.status === this.selectedStatus;
      const categoryMatch = !this.selectedCategory || 
        supplier.categories.some(cat => cat.id === this.selectedCategory);
      
      return statusMatch && categoryMatch;
    });
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.filteredSuppliers = [...this.suppliers];
  }

  setViewMode(mode: 'table' | 'cards'): void {
    this.viewMode = mode;
  }

  trackBySupplierId(index: number, supplier: MySupplier): string {
    return supplier.id;
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }

  getCategoryFullName(category: SupplierCategory): string {
    return `${category.nameSpanish} / ${category.nameSwedish} / ${category.nameEnglish}`;
  }

  getStatusText(status: string): string {
    const statusMap = {
      'potential': 'May need to buy from',
      'active': 'Current supplier',
      'stopped': 'Stopped buying from'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  viewSupplier(supplierId: string): void {
    console.log('Viewing supplier details:', supplierId);
    
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) {
      this.showNotification('Supplier not found', 'error');
      return;
    }

    // Create supplier details modal
    this.showSupplierDetailsModal(supplier);
  }

  placeOrder(supplierId: string): void {
    console.log('Placing order for supplier:', supplierId);
    
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) {
      this.showNotification('Supplier not found', 'error');
      return;
    }

    // Show loading state
    const orderButton = document.querySelector(`[data-supplier-id="${supplierId}"] .order-btn`) as HTMLButtonElement;
    if (orderButton) {
      orderButton.disabled = true;
      orderButton.innerHTML = '<i class="icon-loading"></i> Processing...';
    }

    // Simulate order placement
    setTimeout(() => {
      // Reset button state
      if (orderButton) {
        orderButton.disabled = false;
        orderButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Order';
      }
      
      // Create order modal
      this.showOrderModal(supplier);
      
      this.showNotification(`Order initiated for ${supplier.supplierName}`, 'success');
    }, 1500);
  }

  contactSupplier(supplierId: string): void {
    console.log('Contacting supplier:', supplierId);
    
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) {
      this.showNotification('Supplier not found', 'error');
      return;
    }

    // Create contact modal
    this.showContactModal(supplier);
  }

  private showSupplierDetailsModal(supplier: MySupplier): void {
    const modal = document.createElement('div');
    modal.className = 'supplier-modal-overlay';
    modal.innerHTML = `
      <div class="supplier-modal">
        <div class="modal-header">
          <h2>${supplier.supplierName}</h2>
          <button class="close-btn" onclick="this.closest('.supplier-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="supplier-info">
            <div class="supplier-logo">
              <img src="${supplier.logo}" alt="${supplier.supplierName}" onerror="this.style.display='none'">
            </div>
            <div class="supplier-details">
              <h3>${supplier.companyName}</h3>
              <div class="rating">
                <span class="stars">${this.getStars(supplier.rating)}</span>
                <span class="rating-text">(${supplier.rating}/5)</span>
              </div>
              <div class="status-info">
                <span class="status-badge status-${supplier.status}">${this.getStatusText(supplier.status)}</span>
              </div>
            </div>
          </div>
          
          <div class="supplier-sections">
            <div class="section">
              <h4>Active Categories</h4>
              <div class="categories-list">
                ${supplier.categories.map(cat => `<span class="category-badge">${cat.nameSpanish}</span>`).join('')}
              </div>
            </div>
            
            <div class="section" *ngIf="supplier.activeCampaigns.length > 0">
              <h4>Active Campaigns</h4>
              <div class="campaigns-list">
                ${supplier.activeCampaigns.map(campaign => `
                  <div class="campaign-item">
                    <span class="campaign-name">${campaign.name}</span>
                    <span class="campaign-discount">-${campaign.discount}%</span>
                    <div class="campaign-dates">${this.formatDate(campaign.startDate)} - ${this.formatDate(campaign.endDate)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="section">
              <h4>Delivery Options</h4>
              <div class="delivery-options">
                ${supplier.deliveryInfo.combinedDelivery ? '<div class="delivery-option"><i class="fas fa-truck"></i> Combined delivery</div>' : ''}
                ${supplier.deliveryInfo.freeShipping ? '<div class="delivery-option"><i class="fas fa-shipping-fast"></i> Free shipping</div>' : ''}
                ${!supplier.deliveryInfo.combinedDelivery && !supplier.deliveryInfo.freeShipping ? '<span>Standard delivery</span>' : ''}
              </div>
            </div>
            
            <div class="section" *ngIf="supplier.lastOrderDate">
              <h4>Order History</h4>
              <div class="order-info">
                <p>Last order: ${this.formatDate(supplier.lastOrderDate)}</p>
                <p>Total orders: ${supplier.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-primary" onclick="window.placeOrderFromModal('${supplier.id}')">
              <i class="fas fa-shopping-cart"></i> Place Order
            </button>
            <button class="btn btn-secondary" onclick="window.contactSupplierFromModal('${supplier.id}')">
              <i class="fas fa-envelope"></i> Contact Supplier
            </button>
            <button class="btn btn-outline" onclick="window.viewSupplierProducts('${supplier.id}')">
              <i class="fas fa-box"></i> View Products
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add global functions for modal actions
    (window as any).placeOrderFromModal = (supplierId: string) => {
      modal.remove();
      this.placeOrder(supplierId);
    };

    (window as any).contactSupplierFromModal = (supplierId: string) => {
      modal.remove();
      this.contactSupplier(supplierId);
    };

    (window as any).viewSupplierProducts = (supplierId: string) => {
      modal.remove();
      this.viewSupplierProducts(supplierId);
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private showOrderModal(supplier: MySupplier): void {
    const modal = document.createElement('div');
    modal.className = 'order-modal-overlay';
    modal.innerHTML = `
      <div class="order-modal">
        <div class="modal-header">
          <h2>Place Order - ${supplier.supplierName}</h2>
          <button class="close-btn" onclick="this.closest('.order-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="order-summary">
            <h3>Order Summary</h3>
            <div class="order-items">
              ${supplier.newProducts.slice(0, 3).map(product => `
                <div class="order-item">
                  <div class="product-info">
                    <span class="product-name">${product.name}</span>
                    <span class="product-price">€${product.price}</span>
                  </div>
                  <div class="quantity-controls">
                    <button onclick="window.decreaseQuantity('${product.id}')">-</button>
                    <span id="qty-${product.id}">1</span>
                    <button onclick="window.increaseQuantity('${product.id}')">+</button>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="order-total">
              <div class="total-line">
                <span>Subtotal:</span>
                <span id="subtotal">€${supplier.newProducts.slice(0, 3).reduce((sum, p) => sum + p.price, 0)}</span>
              </div>
              <div class="total-line">
                <span>Delivery:</span>
                <span id="delivery-cost">${supplier.deliveryInfo.freeShipping ? 'Free' : '€15'}</span>
              </div>
              <div class="total-line total">
                <span>Total:</span>
                <span id="total-amount">€${supplier.deliveryInfo.freeShipping ? supplier.newProducts.slice(0, 3).reduce((sum, p) => sum + p.price, 0) : supplier.newProducts.slice(0, 3).reduce((sum, p) => sum + p.price, 0) + 15}</span>
              </div>
            </div>
          </div>
          
          <div class="delivery-info">
            <h3>Delivery Information</h3>
            <div class="delivery-options">
              ${supplier.deliveryInfo.combinedDelivery ? '<p><i class="fas fa-check"></i> Combined delivery available</p>' : ''}
              ${supplier.deliveryInfo.freeShipping ? '<p><i class="fas fa-check"></i> Free shipping on this order</p>' : ''}
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-primary" onclick="window.confirmOrder('${supplier.id}')">
              <i class="fas fa-check"></i> Confirm Order
            </button>
            <button class="btn btn-secondary" onclick="window.addToCartFromModal('${supplier.id}')">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button class="btn btn-outline" onclick="this.closest('.order-modal-overlay').remove()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add global functions for order modal
    (window as any).decreaseQuantity = (productId: string) => {
      const qtyElement = document.getElementById(`qty-${productId}`);
      const currentQty = parseInt(qtyElement!.textContent || '1');
      if (currentQty > 1) {
        qtyElement!.textContent = (currentQty - 1).toString();
        this.updateOrderTotal();
      }
    };

    (window as any).increaseQuantity = (productId: string) => {
      const qtyElement = document.getElementById(`qty-${productId}`);
      const currentQty = parseInt(qtyElement!.textContent || '1');
      qtyElement!.textContent = (currentQty + 1).toString();
      this.updateOrderTotal();
    };

    (window as any).confirmOrder = (supplierId: string) => {
      modal.remove();
      this.confirmOrder(supplierId);
    };

    (window as any).addToCartFromModal = (supplierId: string) => {
      modal.remove();
      this.addToCart(supplierId);
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private showContactModal(supplier: MySupplier): void {
    const modal = document.createElement('div');
    modal.className = 'contact-modal-overlay';
    modal.innerHTML = `
      <div class="contact-modal">
        <div class="modal-header">
          <h2>Contact ${supplier.supplierName}</h2>
          <button class="close-btn" onclick="this.closest('.contact-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="contact-options">
            <div class="contact-option" onclick="window.sendEmail('${supplier.id}')">
              <i class="fas fa-envelope"></i>
              <div class="contact-info">
                <h4>Send Email</h4>
                <p>Send a direct email to the supplier</p>
              </div>
            </div>
            
            <div class="contact-option" onclick="window.callSupplier('${supplier.id}')">
              <i class="fas fa-phone"></i>
              <div class="contact-info">
                <h4>Call Supplier</h4>
                <p>Call the supplier directly</p>
              </div>
            </div>
            
            <div class="contact-option" onclick="window.sendInquiry('${supplier.id}')">
              <i class="fas fa-comment"></i>
              <div class="contact-info">
                <h4>Send Inquiry</h4>
                <p>Send a business inquiry</p>
              </div>
            </div>
            
            <div class="contact-option" onclick="window.requestQuote('${supplier.id}')">
              <i class="fas fa-file-invoice"></i>
              <div class="contact-info">
                <h4>Request Quote</h4>
                <p>Request a price quote for products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add global functions for contact modal
    (window as any).sendEmail = (supplierId: string) => {
      modal.remove();
      this.sendEmail(supplierId);
    };

    (window as any).callSupplier = (supplierId: string) => {
      modal.remove();
      this.callSupplier(supplierId);
    };

    (window as any).sendInquiry = (supplierId: string) => {
      modal.remove();
      this.sendInquiry(supplierId);
    };

    (window as any).requestQuote = (supplierId: string) => {
      modal.remove();
      this.requestQuote(supplierId);
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private updateOrderTotal(): void {
    // This would calculate the total based on quantities
    // For now, we'll just show a simple update
    console.log('Updating order total...');
  }

  private confirmOrder(supplierId: string): void {
    console.log('Confirming order for supplier:', supplierId);
    
    // Show loading state
    this.showNotification('Processing order...', 'info');
    
    // Simulate order processing
    setTimeout(() => {
      this.showNotification('Order confirmed successfully!', 'success');
    }, 2000);
  }

  private addToCart(supplierId: string): void {
    console.log('Adding items to cart for supplier:', supplierId);
    this.showNotification('Items added to cart successfully!', 'success');
  }

  private viewSupplierProducts(supplierId: string): void {
    console.log('Viewing products for supplier:', supplierId);
    this.showNotification('Opening supplier products...', 'info');
  }

  private sendEmail(supplierId: string): void {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    const emailSubject = encodeURIComponent(`Business Inquiry - ${supplier.supplierName}`);
    const emailBody = encodeURIComponent(`
Hello,

I am interested in establishing a business relationship with your company.

Company Details:
- Name: [Your Company Name]
- Industry: [Your Industry]
- Location: [Your Location]

Please contact me to discuss potential collaboration opportunities.

Best regards,
[Your Name]
    `);
    
    window.open(`mailto:contact@${supplier.supplierName.toLowerCase().replace(/\s+/g, '')}.com?subject=${emailSubject}&body=${emailBody}`);
    this.showNotification('Email client opened', 'info');
  }

  private callSupplier(supplierId: string): void {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    // Mock phone number
    const phoneNumber = '+46 123 456 789';
    window.open(`tel:${phoneNumber}`);
    this.showNotification(`Calling ${supplier.supplierName}...`, 'info');
  }

  private sendInquiry(supplierId: string): void {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    // Show inquiry form modal
    this.showInquiryFormModal(supplier);
  }

  private requestQuote(supplierId: string): void {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    // Show quote request form modal
    this.showQuoteRequestModal(supplier);
  }

  private showInquiryFormModal(supplier: MySupplier): void {
    const modal = document.createElement('div');
    modal.className = 'inquiry-modal-overlay';
    modal.innerHTML = `
      <div class="inquiry-modal">
        <div class="modal-header">
          <h2>Send Inquiry - ${supplier.supplierName}</h2>
          <button class="close-btn" onclick="this.closest('.inquiry-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form class="inquiry-form">
            <div class="form-group">
              <label>Subject</label>
              <input type="text" id="inquiry-subject" placeholder="Enter inquiry subject" required>
            </div>
            
            <div class="form-group">
              <label>Message</label>
              <textarea id="inquiry-message" rows="5" placeholder="Enter your inquiry message" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Contact Information</label>
              <input type="email" id="inquiry-email" placeholder="Your email" required>
              <input type="tel" id="inquiry-phone" placeholder="Your phone number">
            </div>
            
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" onclick="window.submitInquiry('${supplier.id}')">
                <i class="fas fa-paper-plane"></i> Send Inquiry
              </button>
              <button type="button" class="btn btn-outline" onclick="this.closest('.inquiry-modal-overlay').remove()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    (window as any).submitInquiry = (supplierId: string) => {
      const subject = (document.getElementById('inquiry-subject') as HTMLInputElement)?.value;
      const message = (document.getElementById('inquiry-message') as HTMLTextAreaElement)?.value;
      const email = (document.getElementById('inquiry-email') as HTMLInputElement)?.value;
      const phone = (document.getElementById('inquiry-phone') as HTMLInputElement)?.value;

      if (!subject || !message || !email) {
        this.showNotification('Please fill in all required fields', 'error');
        return;
      }

      modal.remove();
      this.showNotification('Inquiry sent successfully!', 'success');
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private showQuoteRequestModal(supplier: MySupplier): void {
    const modal = document.createElement('div');
    modal.className = 'quote-modal-overlay';
    modal.innerHTML = `
      <div class="quote-modal">
        <div class="modal-header">
          <h2>Request Quote - ${supplier.supplierName}</h2>
          <button class="close-btn" onclick="this.closest('.quote-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form class="quote-form">
            <div class="form-group">
              <label>Products of Interest</label>
              <select id="quote-products" multiple>
                ${supplier.newProducts.map(product => `<option value="${product.id}">${product.name} - €${product.price}</option>`).join('')}
              </select>
            </div>
            
            <div class="form-group">
              <label>Quantity</label>
              <input type="number" id="quote-quantity" placeholder="Enter quantity" min="1" required>
            </div>
            
            <div class="form-group">
              <label>Delivery Requirements</label>
              <textarea id="quote-delivery" rows="3" placeholder="Specify delivery requirements"></textarea>
            </div>
            
            <div class="form-group">
              <label>Additional Notes</label>
              <textarea id="quote-notes" rows="3" placeholder="Any additional requirements or notes"></textarea>
            </div>
            
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" onclick="window.submitQuoteRequest('${supplier.id}')">
                <i class="fas fa-file-invoice"></i> Request Quote
              </button>
              <button type="button" class="btn btn-outline" onclick="this.closest('.quote-modal-overlay').remove()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    (window as any).submitQuoteRequest = (supplierId: string) => {
      const products = Array.from((document.getElementById('quote-products') as HTMLSelectElement)?.selectedOptions || [])
        .map(option => option.value);
      const quantity = (document.getElementById('quote-quantity') as HTMLInputElement)?.value;
      const delivery = (document.getElementById('quote-delivery') as HTMLTextAreaElement)?.value;
      const notes = (document.getElementById('quote-notes') as HTMLTextAreaElement)?.value;

      if (!products.length || !quantity) {
        this.showNotification('Please select products and quantity', 'error');
        return;
      }

      modal.remove();
      this.showNotification('Quote request sent successfully!', 'success');
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="icon-${type === 'success' ? 'check' : type === 'error' ? 'error' : 'info'}"></i>
        <span>${message}</span>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }
}