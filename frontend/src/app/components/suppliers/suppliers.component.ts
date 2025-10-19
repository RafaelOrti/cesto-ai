import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

export interface SupplierCategory {
  id: string;
  name: string;
  nameSwedish: string;
  nameSpanish: string;
  nameEnglish: string;
  icon: string;
  active: boolean;
}

export interface SupplierCampaign {
  id: string;
  name: string;
  discount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface SupplierProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isNew: boolean;
  isOnSale: boolean;
  category: string;
}

export interface MySupplier {
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
  // Enhanced features
  description?: string;
  onSale?: boolean;
  freeDelivery?: boolean;
  coDelivery?: boolean;
  recentlyAdded?: boolean;
  popular?: boolean;
  inquirySent?: boolean;
  imageUrl?: string;
  lastDelivery?: string;
  futureDelivery?: string;
  hasCampaign?: boolean;
  hasNewProducts?: boolean;
  isFavorite?: boolean;
  orderHistory?: OrderHistoryItem[];
  products?: Product[];
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  products: string[];
  total: number;
  status: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  moq: number;
  imageUrl?: string;
  lastOrderDate?: string;
  campaign?: string;
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
  selector: 'app-suppliers',
  template: `
    <div class="suppliers-dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">My Suppliers</h1>
          <p>Manage and view information about your current suppliers</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" routerLink="/suppliers/search">
            <i class="fas fa-search"></i>
            Search New Suppliers
          </button>
        </div>
      </div>

      <!-- Explore Suppliers Section -->
      <div class="explore-suppliers-section">
        <h2 class="section-title">Explore Suppliers</h2>
        
        <!-- Main Search -->
        <div class="main-search-container">
          <div class="main-search-field">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              [(ngModel)]="mainSearchTerm" 
              (input)="onMainSearch()" 
              placeholder="Search for suppliers..."
              class="search-input">
          </div>
        </div>

        <!-- Recommendation Bar -->
        <div class="recommendation-bar">
          <div class="recommendation-filters">
            <span class="filter-label">Recommendations:</span>
            <div class="recommendation-buttons">
              <button *ngFor="let rec of recommendations" 
                      class="recommendation-btn" 
                      [class.active]="rec.active"
                      (click)="onRecommendationSelect(rec)">
                <i [class]="rec.icon"></i>
                <span>{{getRecommendationName(rec)}}</span>
              </button>
            </div>
          </div>
          <div class="add-supplier-section">
            <i class="fas fa-shopping-cart cart-icon"></i>
            <button class="add-supplier-btn" (click)="onAddSupplier()">
              <i class="fas fa-plus"></i>
              <span>Add Supplier</span>
            </button>
          </div>
        </div>

        <!-- Category Filters -->
        <div class="category-filters">
          <h3 class="filter-title">Categories</h3>
          <div class="categories-container">
            <button *ngFor="let category of categories" 
                    class="category-btn" 
                    [class.active]="category.active"
                    (click)="onCategorySelect(category)">
              <span class="category-icon">{{category.icon}}</span>
              <span class="category-name">{{getCategoryName(category)}}</span>
            </button>
            <button class="more-categories-btn" (click)="showMoreCategories()">
              <i class="fas fa-ellipsis-h"></i>
            </button>
          </div>
        </div>

        <!-- Secondary Search -->
        <div class="secondary-search-container">
          <div class="secondary-search-field">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              [(ngModel)]="secondarySearchTerm" 
              (input)="onSecondarySearch()" 
              placeholder="Search..."
              class="search-input">
          </div>
        </div>

        <!-- Special Filters -->
        <div class="special-filters">
          <div class="special-filter-buttons">
            <button *ngFor="let filter of specialFilters" 
                    class="special-filter-btn" 
                    [class.active]="filter.active"
                    (click)="onSpecialFilterToggle(filter)">
              {{filter.label}}
            </button>
          </div>
          <div class="filter-actions">
            <span class="active-filters-count" *ngIf="getActiveFiltersCount() > 0">
              {{getActiveFiltersCount()}} filters active
            </span>
            <button class="clear-filters-btn" (click)="clearAllFilters()">
              Clear All
            </button>
          </div>
        </div>

        <!-- Status and Category Filters -->
        <div class="filters-section">
          <div class="filter-group">
            <label>Filter by Status:</label>
            <select [(ngModel)]="selectedStatus" (change)="applyFilters()" class="filter-select">
              <option value="">All Suppliers</option>
              <option value="potential">Suppliers I may need to buy from</option>
              <option value="active">Current Suppliers</option>
              <option value="stopped">Suppliers I have stopped buying from</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Filter by Category:</label>
            <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="filter-select">
              <option value="">All Categories</option>
              <option *ngFor="let category of availableCategories" [value]="category.id">
                {{category.nameSpanish}}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Suppliers Listing -->
      <div class="suppliers-listing">
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
                        <img *ngIf="supplier.logo || supplier.imageUrl" [src]="supplier.logo || supplier.imageUrl" [alt]="supplier.supplierName">
                        <div *ngIf="!supplier.logo && !supplier.imageUrl" class="logo-placeholder">
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
                      <div class="delivery-option" *ngIf="supplier.deliveryInfo.combinedDelivery || supplier.coDelivery">
                        <i class="fas fa-truck"></i>
                        <span>Combined delivery</span>
                      </div>
                      <div class="delivery-option" *ngIf="supplier.deliveryInfo.freeShipping || supplier.freeDelivery">
                        <i class="fas fa-shipping-fast"></i>
                        <span>Free shipping</span>
                      </div>
                      <span *ngIf="!supplier.deliveryInfo.combinedDelivery && !supplier.deliveryInfo.freeShipping && !supplier.coDelivery && !supplier.freeDelivery" 
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
                   [class.inquiry-sent]="supplier.inquirySent"
                   [attr.data-supplier-id]="supplier.id">
                
                <!-- Supplier Image -->
                <div class="supplier-image">
                  <img *ngIf="supplier.imageUrl || supplier.logo" [src]="supplier.imageUrl || supplier.logo" [alt]="supplier.supplierName">
                  <div *ngIf="!supplier.imageUrl && !supplier.logo" class="supplier-placeholder">
                    <i class="fas fa-store"></i>
                  </div>
                </div>

                <!-- Supplier Info -->
                <div class="supplier-info">
                  <h3 class="supplier-name">{{supplier.supplierName}}</h3>
                  <p class="supplier-description">{{supplier.description || supplier.companyName}}</p>
                  
                  <!-- Supplier Features -->
                  <div class="supplier-features">
                    <span *ngIf="supplier.freeDelivery || supplier.deliveryInfo.freeShipping" class="feature-tag free-delivery">
                      <i class="fas fa-shipping-fast"></i>
                      Free Delivery
                    </span>
                    <span *ngIf="supplier.onSale" class="feature-tag on-sale">
                      <i class="fas fa-tag"></i>
                      On Sale
                    </span>
                    <span *ngIf="supplier.coDelivery || supplier.deliveryInfo.combinedDelivery" class="feature-tag co-delivery">
                      <i class="fas fa-truck"></i>
                      Co-Delivery
                    </span>
                    <span *ngIf="supplier.recentlyAdded" class="feature-tag recently-added">
                      <i class="fas fa-star"></i>
                      New
                    </span>
                    <span *ngIf="supplier.popular" class="feature-tag popular">
                      <i class="fas fa-fire"></i>
                      Popular
                    </span>
                  </div>

                  <!-- Order History Info -->
                  <div class="order-history-info" *ngIf="supplier.orderHistory && supplier.orderHistory.length > 0">
                    <div *ngFor="let order of supplier.orderHistory.slice(0, 1)" 
                         class="last-order-info"
                         (click)="showOrderHistory(supplier.id)">
                      <span class="order-text">Last ordered: {{formatDate(order.date)}}</span>
                      <span class="order-amount">€{{order.total}}</span>
                    </div>
                  </div>

                  <!-- Rating -->
                  <div class="supplier-rating">
                    <span class="stars">{{getStars(supplier.rating)}}</span>
                    <span class="rating-text">({{supplier.rating}}/5)</span>
                  </div>
                </div>

                <!-- Supplier Actions -->
                <div class="supplier-actions">
                  <button *ngIf="!supplier.inquirySent" 
                          class="btn btn-primary inquiry-btn" 
                          (click)="onSendInquiry(supplier)">
                    <i class="fas fa-paper-plane"></i>
                    Send Inquiry
                  </button>
                  <button *ngIf="supplier.inquirySent" 
                          class="btn btn-success" 
                          disabled>
                    <i class="fas fa-check"></i>
                    Inquiry Sent
                  </button>
                  <button class="btn btn-secondary" 
                          (click)="viewSupplierProducts(supplier)">
                    <i class="fas fa-shopping-cart"></i>
                    View Products
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div *ngIf="filteredSuppliers.length === 0" class="no-results">
            <i class="fas fa-search"></i>
            <h3>No suppliers found</h3>
            <p>Try adjusting your search criteria or filters</p>
            <button class="btn btn-primary" (click)="clearAllFilters()">
              Clear Filters
            </button>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="loading-state">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading suppliers...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  suppliers: MySupplier[] = [];
  filteredSuppliers: MySupplier[] = [];
  loading = false;

  // Search and filters
  mainSearchTerm = '';
  secondarySearchTerm = '';
  selectedStatus = '';
  selectedCategory = '';
  viewMode: 'table' | 'cards' = 'table';

  // Current filter state
  currentFilter = {
    search: '',
    categories: [] as string[],
    specialFilters: [] as string[]
  };

  // Categories
  categories: SupplierCategory[] = [
    { id: 'dairy', name: 'Dairy', nameSwedish: 'Mejeri', nameSpanish: 'Lácteos', nameEnglish: 'Dairy', icon: '🥛', active: false },
    { id: 'fruits', name: 'Fruits', nameSwedish: 'Frukter', nameSpanish: 'Frutas', nameEnglish: 'Fruits', icon: '🍎', active: false },
    { id: 'vegetables', name: 'Vegetables', nameSwedish: 'Grönsaker', nameSpanish: 'Verduras', nameEnglish: 'Vegetables', icon: '🥕', active: false },
    { id: 'meat', name: 'Meat', nameSwedish: 'Kött', nameSpanish: 'Carne', nameEnglish: 'Meat', icon: '🥩', active: false },
    { id: 'beverages', name: 'Beverages', nameSwedish: 'Drycker', nameSpanish: 'Bebidas', nameEnglish: 'Beverages', icon: '🥤', active: false },
    { id: 'bakery', name: 'Bakery', nameSwedish: 'Bageri', nameSpanish: 'Panadería', nameEnglish: 'Bakery', icon: '🥖', active: false }
  ];

  availableCategories: SupplierCategory[] = [];

  // Recommendations
  recommendations = [
    { id: 'popular', name: 'Popular', icon: 'fas fa-fire', active: false },
    { id: 'new', name: 'New', icon: 'fas fa-star', active: false },
    { id: 'sale', name: 'On Sale', icon: 'fas fa-tag', active: false },
    { id: 'free-delivery', name: 'Free Delivery', icon: 'fas fa-shipping-fast', active: false }
  ];

  // Special filters
  specialFilters = [
    { id: 'favorites', label: 'Favorites', active: false },
    { id: 'recent', label: 'Recently Added', active: false },
    { id: 'campaigns', label: 'Active Campaigns', active: false },
    { id: 'new-products', label: 'New Products', active: false }
  ];

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSuppliers(): void {
    this.loading = true;
    // Mock data - replace with actual service
    setTimeout(() => {
      this.suppliers = this.getMockSuppliers();
      this.filteredSuppliers = [...this.suppliers];
      this.loading = false;
    }, 1000);
  }

  private loadCategories(): void {
    this.availableCategories = this.categories;
  }

  onMainSearch(): void {
    this.currentFilter.search = this.mainSearchTerm;
    this.applyFilters();
  }

  onSecondarySearch(): void {
    this.currentFilter.search = this.secondarySearchTerm;
    this.applyFilters();
  }

  onRecommendationSelect(rec: any): void {
    rec.active = !rec.active;
    this.applyFilters();
  }

  onCategorySelect(category: SupplierCategory): void {
    category.active = !category.active;
    this.applyFilters();
  }

  onSpecialFilterToggle(filter: any): void {
    filter.active = !filter.active;
    this.applyFilters();
  }

  onAddSupplier(): void {
    console.log('Add supplier clicked');
  }

  showMoreCategories(): void {
    console.log('Show more categories');
  }

  clearAllFilters(): void {
    this.mainSearchTerm = '';
    this.secondarySearchTerm = '';
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.currentFilter = { search: '', categories: [], specialFilters: [] };
    
    this.categories.forEach(cat => cat.active = false);
    this.recommendations.forEach(rec => rec.active = false);
    this.specialFilters.forEach(filter => filter.active = false);
    
    this.applyFilters();
  }

  getActiveFiltersCount(): number {
    let count = 0;
    count += this.categories.filter(cat => cat.active).length;
    count += this.recommendations.filter(rec => rec.active).length;
    count += this.specialFilters.filter(filter => filter.active).length;
    return count;
  }

  applyFilters(): void {
    let filtered = [...this.suppliers];

    // Search filter
    if (this.currentFilter.search) {
      const searchTerm = this.currentFilter.search.toLowerCase();
      filtered = filtered.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(searchTerm) ||
        supplier.companyName.toLowerCase().includes(searchTerm) ||
        (supplier.description && supplier.description.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(supplier => supplier.status === this.selectedStatus);
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(supplier =>
        supplier.categories.some(cat => cat.id === this.selectedCategory)
      );
    }

    // Active category filters
    const activeCategories = this.categories.filter(cat => cat.active).map(cat => cat.id);
    if (activeCategories.length > 0) {
      filtered = filtered.filter(supplier =>
        supplier.categories.some(cat => activeCategories.includes(cat.id))
      );
    }

    // Recommendation filters
    if (this.recommendations.find(r => r.id === 'popular')?.active) {
      filtered = filtered.filter(supplier => supplier.popular);
    }
    if (this.recommendations.find(r => r.id === 'new')?.active) {
      filtered = filtered.filter(supplier => supplier.recentlyAdded);
    }
    if (this.recommendations.find(r => r.id === 'sale')?.active) {
      filtered = filtered.filter(supplier => supplier.onSale);
    }
    if (this.recommendations.find(r => r.id === 'free-delivery')?.active) {
      filtered = filtered.filter(supplier => supplier.freeDelivery || supplier.deliveryInfo.freeShipping);
    }

    // Special filters
    if (this.specialFilters.find(f => f.id === 'favorites')?.active) {
      filtered = filtered.filter(supplier => supplier.isFavorite);
    }
    if (this.specialFilters.find(f => f.id === 'recent')?.active) {
      filtered = filtered.filter(supplier => supplier.recentlyAdded);
    }
    if (this.specialFilters.find(f => f.id === 'campaigns')?.active) {
      filtered = filtered.filter(supplier => supplier.hasCampaign || supplier.activeCampaigns.length > 0);
    }
    if (this.specialFilters.find(f => f.id === 'new-products')?.active) {
      filtered = filtered.filter(supplier => supplier.hasNewProducts || supplier.newProducts.length > 0);
    }

    this.filteredSuppliers = filtered;
  }

  setViewMode(mode: 'table' | 'cards'): void {
    this.viewMode = mode;
  }

  trackBySupplierId(index: number, supplier: MySupplier): string {
    return supplier.id;
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) {
      stars += '☆';
    }
    return stars;
  }

  getCategoryName(category: SupplierCategory): string {
    return category.nameSpanish;
  }

  getCategoryFullName(category: SupplierCategory): string {
    return `${category.nameSpanish} (${category.nameEnglish})`;
  }

  getRecommendationName(rec: any): string {
    return rec.name;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'stopped': 'Stopped',
      'potential': 'Potential'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  viewSupplier(supplierId: string): void {
    console.log('View supplier:', supplierId);
  }

  placeOrder(supplierId: string): void {
    console.log('Place order for supplier:', supplierId);
  }

  contactSupplier(supplierId: string): void {
    console.log('Contact supplier:', supplierId);
  }

  onSendInquiry(supplier: MySupplier): void {
    supplier.inquirySent = true;
    console.log('Send inquiry to:', supplier.supplierName);
  }

  viewSupplierProducts(supplier: MySupplier): void {
    console.log('View products for:', supplier.supplierName);
  }

  showOrderHistory(supplierId: string): void {
    console.log('Show order history for:', supplierId);
  }

  // Mock data methods
  private getMockSuppliers(): MySupplier[] {
    return [
      {
        id: '1',
        companyName: 'Fever Tree Beverages Ltd',
        supplierName: 'Fever Tree',
        description: 'Premium tonic water and mixer specialist',
        logo: '/assets/images/suppliers/fever-tree.png',
        imageUrl: '/assets/images/suppliers/fever-tree.png',
        categories: [
          { id: 'beverages', name: 'Beverages', nameSwedish: 'Drycker', nameSpanish: 'Bebidas', nameEnglish: 'Beverages', icon: '🥤', active: false }
        ],
        activeCampaigns: [
          {
            id: '1',
            name: 'Summer Mixers',
            discount: 15,
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            active: true
          }
        ],
        newProducts: [
          {
            id: '1',
            name: 'Premium Indian Tonic Water',
            price: 28.8,
            originalPrice: 32.0,
            isNew: true,
            isOnSale: true,
            category: 'beverages'
          }
        ],
        deliveryInfo: {
          combinedDelivery: true,
          freeShipping: false
        },
        status: 'active',
        lastOrderDate: '2024-01-15',
        totalOrders: 12,
        rating: 4.8,
        onSale: true,
        freeDelivery: false,
        coDelivery: true,
        recentlyAdded: false,
        popular: true,
        inquirySent: false,
        hasCampaign: true,
        hasNewProducts: true,
        isFavorite: true,
        orderHistory: [
          {
            id: '1',
            date: '2024-01-15',
            products: ['Premium Indian Tonic Water', 'Mediterranean Tonic Water'],
            total: 230.40,
            status: 'delivered'
          }
        ]
      },
      {
        id: '2',
        companyName: 'Luntgårdens Mejeri AB',
        supplierName: 'Luntgårdens Mejeri',
        description: 'Swedish dairy products from local farms',
        logo: '/assets/images/suppliers/luntgardens.jpg',
        imageUrl: '/assets/images/suppliers/luntgardens.jpg',
        categories: [
          { id: 'dairy', name: 'Dairy', nameSwedish: 'Mejeri', nameSpanish: 'Lácteos', nameEnglish: 'Dairy', icon: '🥛', active: false }
        ],
        activeCampaigns: [],
        newProducts: [
          {
            id: '2',
            name: 'Organic Milk 1L',
            price: 15.50,
            isNew: true,
            isOnSale: false,
            category: 'dairy'
          }
        ],
        deliveryInfo: {
          combinedDelivery: false,
          freeShipping: true
        },
        status: 'active',
        lastOrderDate: '2024-01-12',
        totalOrders: 8,
        rating: 4.6,
        onSale: false,
        freeDelivery: true,
        coDelivery: false,
        recentlyAdded: true,
        popular: false,
        inquirySent: false,
        hasCampaign: false,
        hasNewProducts: true,
        isFavorite: false,
        orderHistory: []
      }
    ];
  }
}