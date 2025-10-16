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
              <tr *ngFor="let supplier of filteredSuppliers; trackBy: trackBySupplierId" class="supplier-row">
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
                    <button class="btn btn-sm btn-secondary" 
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
                 class="supplier-card">
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
                  <button class="btn btn-sm btn-secondary" (click)="placeOrder(supplier.id)">
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
    // Navigate to supplier details
    console.log('View supplier:', supplierId);
  }

  placeOrder(supplierId: string): void {
    // Navigate to order page
    console.log('Place order for supplier:', supplierId);
  }

  contactSupplier(supplierId: string): void {
    // Open contact modal or navigate to contact page
    console.log('Contact supplier:', supplierId);
  }
}