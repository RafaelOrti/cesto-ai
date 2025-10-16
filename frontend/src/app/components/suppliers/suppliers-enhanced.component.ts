import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

export interface SupplierCategory {
  id: string;
  name: string;
  nameSwedish: string;
  nameSpanish: string;
  icon: string;
  active: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  description: string;
  category: string;
  onSale: boolean;
  freeDelivery: boolean;
  coDelivery: boolean;
  recentlyAdded: boolean;
  popular: boolean;
  inquirySent: boolean;
  rating: number;
  imageUrl?: string;
  lastDelivery?: string;
  futureDelivery?: string;
  hasCampaign: boolean;
  hasNewProducts: boolean;
  isFavorite: boolean;
  orderHistory: OrderHistoryItem[];
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
  selector: 'app-suppliers-enhanced',
  template: `
    <div class="suppliers-dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">SUPPLIERS</h1>
        <div class="header-notes">
          <div class="note-left">
            <p><strong>Note:</strong> This view is for discovering and managing suppliers. You can search, filter, and order products directly from suppliers.</p>
          </div>
          <div class="note-right">
            <p><strong>Info:</strong> When you purchase from a supplier, they will be added to your "My Suppliers" list automatically.</p>
          </div>
        </div>
      </div>

      <!-- Explore Suppliers Section -->
      <div class="explore-suppliers-section">
        <h2 class="section-title">Utforska leverantörer</h2>
        
        <!-- Main Search -->
        <div class="main-search-container">
          <mat-form-field class="main-search-field" appearance="outline">
            <mat-label>Sök på leverantör</mat-label>
            <input matInput [(ngModel)]="mainSearchTerm" (input)="onMainSearch()" placeholder="Search for suppliers...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
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
                <mat-icon>{{rec.icon}}</mat-icon>
                <span>{{getRecommendationName(rec)}}</span>
              </button>
            </div>
          </div>
          <div class="add-supplier-section">
            <mat-icon class="cart-icon">shopping_cart</mat-icon>
            <button class="add-supplier-btn" (click)="onAddSupplier()">
              <mat-icon>add</mat-icon>
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
              <mat-icon>more_horiz</mat-icon>
            </button>
          </div>
        </div>

        <!-- Secondary Search -->
        <div class="secondary-search-container">
          <mat-form-field class="secondary-search-field" appearance="outline">
            <mat-label>SEARCHBAR</mat-label>
            <input matInput [(ngModel)]="secondarySearchTerm" (input)="onSecondarySearch()" placeholder="Search...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
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
      </div>

      <!-- Suppliers Listing -->
      <div class="suppliers-listing">
        <div class="suppliers-grid">
          <div *ngFor="let supplier of filteredSuppliers" 
               class="supplier-card" 
               [class.inquiry-sent]="supplier.inquirySent">
            
            <!-- Supplier Image -->
            <div class="supplier-image">
              <img *ngIf="supplier.imageUrl" [src]="supplier.imageUrl" [alt]="supplier.name">
              <div *ngIf="!supplier.imageUrl" class="supplier-placeholder">
                <mat-icon>store</mat-icon>
              </div>
            </div>

            <!-- Supplier Info -->
            <div class="supplier-info">
              <h3 class="supplier-name">{{supplier.name}}</h3>
              <p class="supplier-description">{{supplier.description}}</p>
              
              <!-- Supplier Features -->
              <div class="supplier-features">
                <span *ngIf="supplier.freeDelivery" class="feature-tag free-delivery">
                  <mat-icon>local_shipping</mat-icon>
                  Free Delivery
                </span>
                <span *ngIf="supplier.onSale" class="feature-tag on-sale">
                  <mat-icon>local_offer</mat-icon>
                  On Sale
                </span>
                <span *ngIf="supplier.coDelivery" class="feature-tag co-delivery">
                  <mat-icon>group_work</mat-icon>
                  Co-Delivery
                </span>
                <span *ngIf="supplier.recentlyAdded" class="feature-tag recently-added">
                  <mat-icon>new_releases</mat-icon>
                  New
                </span>
                <span *ngIf="supplier.popular" class="feature-tag popular">
                  <mat-icon>star</mat-icon>
                  Popular
                </span>
              </div>

              <!-- Order History Info -->
              <div class="order-history-info" *ngIf="supplier.orderHistory.length > 0">
                <div *ngFor="let order of supplier.orderHistory.slice(0, 1)" 
                     class="last-order-info"
                     (click)="showOrderHistory(supplier.id)">
                  <span class="order-text">Last ordered: {{formatDate(order.date)}}</span>
                  <span class="order-amount">€{{order.total}}</span>
                </div>
              </div>

              <!-- Rating -->
              <div class="supplier-rating">
                <mat-icon *ngFor="let star of getStars(supplier.rating)" 
                          class="star-icon">{{star}}</mat-icon>
                <span class="rating-text">({{supplier.rating}}/5)</span>
              </div>
            </div>

            <!-- Supplier Actions -->
            <div class="supplier-actions">
              <button *ngIf="!supplier.inquirySent" 
                      class="btn btn-primary" 
                      (click)="onSendInquiry(supplier)">
                <mat-icon>send</mat-icon>
                Skicka förfrågan
              </button>
              <button *ngIf="supplier.inquirySent" 
                      class="btn btn-success" 
                      disabled>
                <mat-icon>check</mat-icon>
                Förfrågan skickad
              </button>
              <button class="btn btn-secondary" 
                      (click)="viewSupplierProducts(supplier)">
                <mat-icon>shopping_cart</mat-icon>
                View Products
              </button>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredSuppliers.length === 0" class="no-results">
          <mat-icon>search_off</mat-icon>
          <h3>No suppliers found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button class="btn btn-primary" (click)="clearAllFilters()">
            Clear Filters
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-state">
          <mat-spinner></mat-spinner>
          <p>Loading suppliers...</p>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <div class="comment-box yellow-box">
          <h4>Development Comments</h4>
          <ul>
            <li>This view allows buyers to discover and contact suppliers</li>
            <li>Buyers can order products directly from this view</li>
            <li>Purchases automatically add suppliers to "My Suppliers"</li>
            <li>Providers receive orders and can manage them via CRUD interface</li>
            <li>Final step is the shopping cart view</li>
          </ul>
        </div>
        <div class="translation-table">
          <h4>Translation Table</h4>
          <table>
            <thead>
              <tr>
                <th>Swedish</th>
                <th>Spanish</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Utforska leverantörer</td>
                <td>Explorar proveedores</td>
                <td>Explore suppliers</td>
              </tr>
              <tr>
                <td>Sök på leverantör</td>
                <td>Buscar proveedor</td>
                <td>Search for supplier</td>
              </tr>
              <tr>
                <td>Skicka förfrågan</td>
                <td>Enviar consulta</td>
                <td>Send inquiry</td>
              </tr>
              <tr>
                <td>Förfrågan skickad</td>
                <td>Consulta enviada</td>
                <td>Inquiry sent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Order History Modal -->
    <app-order-history
      [isVisible]="showOrderHistoryModal"
      [supplierId]="selectedSupplierId"
      [supplierName]="selectedSupplierName"
      [orders]="selectedSupplierOrders"
      (closeEvent)="closeOrderHistory()"
      (reorderEvent)="onReorder($event)"
      (viewDetailsEvent)="onViewOrderDetails($event)"
      (downloadInvoiceEvent)="onDownloadInvoice($event)">
    </app-order-history>

    <!-- Supplier Products Modal -->
    <app-supplier-products
      *ngIf="showSupplierProductsModal"
      [supplierId]="selectedSupplierId"
      [supplierName]="selectedSupplierName"
      [supplierDescription]="selectedSupplierDescription"
      [supplierLogo]="selectedSupplierLogo"
      [supplierCategories]="selectedSupplierCategories"
      (addToCartEvent)="onAddToCart($event)"
      (contactSupplierEvent)="onContactSupplier($event)"
      (viewDeliveryTermsEvent)="onViewDeliveryTerms($event)">
    </app-supplier-products>
  `,
  styleUrls: ['./suppliers-enhanced.component.scss']
})
export class SuppliersEnhancedComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Search controls
  mainSearchTerm: string = '';
  secondarySearchTerm: string = '';

  // Data
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  loading = false;

  // Filters
  currentFilter = {
    recommendation: null,
    category: null,
    onSale: false,
    freeDelivery: false,
    coDelivery: false,
    search: ''
  };

  // Categories
  categories: SupplierCategory[] = [
    { id: 'dairy', name: 'Dairy', nameSwedish: 'Mejeri', nameSpanish: 'Lácteos', icon: '🥛', active: false },
    { id: 'fruits-vegetables', name: 'Fruits & Vegetables', nameSwedish: 'Frukt & Grönt', nameSpanish: 'Frutas y Verduras', icon: '🥬', active: false },
    { id: 'deli', name: 'Deli', nameSwedish: 'Chark', nameSpanish: 'Charcutería', icon: '🥩', active: false },
    { id: 'health-beauty', name: 'Health & Beauty', nameSwedish: 'Hälsa & Skönhet', nameSpanish: 'Salud y Belleza', icon: '💄', active: false },
    { id: 'frozen', name: 'Frozen', nameSwedish: 'Djupfryst', nameSpanish: 'Congelados', icon: '🧊', active: false },
    { id: 'fresh-meat', name: 'Fresh Meat', nameSwedish: 'Färskvaror, Ko', nameSpanish: 'Carne Fresca', icon: '🥩', active: false },
    { id: 'packaged', name: 'Packaged', nameSwedish: 'Packade', nameSpanish: 'Empaquetados', icon: '📦', active: false }
  ];

  // Recommendations
  recommendations = [
    { id: 'recently_added', name: 'Recently Added', nameSwedish: 'Nyligen Tillagd', icon: '🔔', active: false },
    { id: 'popular', name: 'Popular', nameSwedish: 'Popular', icon: '⭐', active: false },
    { id: 'all', name: 'All Suppliers', nameSwedish: 'Alla Leverantörer', icon: '📋', active: true }
  ];

  // Special filters
  specialFilters = [
    { id: 'free-delivery', label: 'FREE DELIVERY', active: false },
    { id: 'co-delivery', label: 'CO-DELIVERY', active: false },
    { id: 'on-sale', label: 'ON SALE', active: false },
    { id: 'suppliers-etc', label: 'SUPPLIERS ETC', active: false }
  ];

  // Modal states
  showOrderHistoryModal = false;
  showSupplierProductsModal = false;
  selectedSupplierId = '';
  selectedSupplierName = '';
  selectedSupplierDescription = '';
  selectedSupplierLogo = '';
  selectedSupplierCategories: string[] = [];
  selectedSupplierOrders: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSuppliers(): void {
    this.loading = true;
    // Mock data - replace with actual API call
    this.suppliers = [
      {
        id: '1',
        name: "Engelman's",
        description: "Vi har allt för den perfekta delibrickan. Välkommen att upptäcka fantastiska smaker tillsammans med oss!",
        category: 'deli',
        onSale: true,
        freeDelivery: true,
        coDelivery: false,
        recentlyAdded: false,
        popular: true,
        inquirySent: false,
        rating: 4.5,
        imageUrl: '/assets/images/suppliers/engelman.jpg',
        lastDelivery: '2024-05-22',
        futureDelivery: '2024-05-27',
        hasCampaign: true,
        hasNewProducts: false,
        isFavorite: true,
        orderHistory: [
          {
            id: 'order-1',
            date: '2024-05-22',
            products: ['Delibricka Premium', 'Ost Mix'],
            total: 1250,
            status: 'delivered'
          }
        ]
      },
      {
        id: '2',
        name: "Gastro Import",
        description: "Vi har drygt 25 års erfarenhet av att importera gourmetspecialiteter från Medelhavsområdet vilka vi säljer till restauranger, delikatessbutiker och detaljhandelsbutiker. Företaget grundades 1988 och ä...",
        category: 'packaged',
        onSale: false,
        freeDelivery: false,
        coDelivery: true,
        recentlyAdded: false,
        popular: false,
        inquirySent: true,
        rating: 4.2,
        imageUrl: '/assets/images/suppliers/gastro-import.jpg',
        lastDelivery: '2024-05-10',
        futureDelivery: '2024-05-28',
        hasCampaign: false,
        hasNewProducts: true,
        isFavorite: false,
        orderHistory: [
          {
            id: 'order-2',
            date: '2024-05-10',
            products: ['Olive Oil Premium', 'Pasta Selection'],
            total: 450,
            status: 'delivered'
          }
        ]
      },
      {
        id: '3',
        name: "Luntgårdens Mejeri",
        description: "Mjölk från Sverige! Läs mer",
        category: 'dairy',
        onSale: true,
        freeDelivery: true,
        coDelivery: false,
        recentlyAdded: true,
        popular: false,
        inquirySent: false,
        rating: 4.8,
        imageUrl: '/assets/images/suppliers/luntgardens.jpg',
        lastDelivery: null,
        futureDelivery: null,
        hasCampaign: true,
        hasNewProducts: true,
        isFavorite: false,
        orderHistory: [],
        products: [
          {
            id: 'prod-1',
            name: 'Minimjölk 0,1%',
            description: 'Fresh milk from Swedish cows',
            price: 10,
            unit: 'PC',
            moq: 1,
            imageUrl: '/assets/images/products/minimjolk.jpg',
            lastOrderDate: '2024-05-24',
            campaign: 'Beställ 10 pack och få 10% per dygn!'
          },
          {
            id: 'prod-2',
            name: 'Getmjölk 1 L',
            description: 'Goat milk from local farms',
            price: 600,
            unit: 'PC',
            moq: 1,
            imageUrl: '/assets/images/products/getmjolk.jpg',
            lastOrderDate: '2024-03-01'
          }
        ]
      }
    ];

    this.filteredSuppliers = [...this.suppliers];
    this.loading = false;
  }

  onMainSearch(): void {
    this.currentFilter.search = this.mainSearchTerm;
    this.applyFilters();
  }

  onSecondarySearch(): void {
    this.currentFilter.search = this.secondarySearchTerm;
    this.applyFilters();
  }

  onRecommendationSelect(recommendation: any): void {
    this.recommendations.forEach(rec => rec.active = false);
    recommendation.active = true;
    this.currentFilter.recommendation = recommendation.id;
    this.applyFilters();
  }

  onCategorySelect(category: SupplierCategory): void {
    category.active = !category.active;
    this.currentFilter.category = category.active ? category.id : null;
    this.applyFilters();
  }

  onSpecialFilterToggle(filter: any): void {
    filter.active = !filter.active;
    
    switch (filter.id) {
      case 'free-delivery':
        this.currentFilter.freeDelivery = filter.active;
        break;
      case 'co-delivery':
        this.currentFilter.coDelivery = filter.active;
        break;
      case 'on-sale':
        this.currentFilter.onSale = filter.active;
        break;
    }
    
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.suppliers];

    // Apply search filter
    if (this.currentFilter.search) {
      const searchTerm = this.currentFilter.search.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (this.currentFilter.category) {
      filtered = filtered.filter(supplier => supplier.category === this.currentFilter.category);
    }

    // Apply recommendation filter
    if (this.currentFilter.recommendation) {
      switch (this.currentFilter.recommendation) {
        case 'recently_added':
          filtered = filtered.filter(supplier => supplier.recentlyAdded);
          break;
        case 'popular':
          filtered = filtered.filter(supplier => supplier.popular);
          break;
        case 'all':
          // No additional filtering needed
          break;
      }
    }

    // Apply special filters
    if (this.currentFilter.onSale) {
      filtered = filtered.filter(supplier => supplier.onSale);
    }

    if (this.currentFilter.freeDelivery) {
      filtered = filtered.filter(supplier => supplier.freeDelivery);
    }

    if (this.currentFilter.coDelivery) {
      filtered = filtered.filter(supplier => supplier.coDelivery);
    }

    this.filteredSuppliers = filtered;
  }

  onSendInquiry(supplier: Supplier): void {
    if (supplier.inquirySent) {
      return;
    }

    // Send inquiry logic
    supplier.inquirySent = true;
    console.log('Inquiry sent to:', supplier.name);
  }

  onAddSupplier(): void {
    console.log('Add supplier functionality');
  }

  showMoreCategories(): void {
    console.log('Show more categories');
  }

  clearAllFilters(): void {
    this.currentFilter = {
      recommendation: null,
      category: null,
      onSale: false,
      freeDelivery: false,
      coDelivery: false,
      search: ''
    };

    this.recommendations.forEach(rec => rec.active = rec.id === 'all');
    this.categories.forEach(cat => cat.active = false);
    this.specialFilters.forEach(filter => filter.active = false);
    this.mainSearchTerm = '';
    this.secondarySearchTerm = '';

    this.applyFilters();
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.currentFilter.category) count++;
    if (this.currentFilter.onSale) count++;
    if (this.currentFilter.freeDelivery) count++;
    if (this.currentFilter.coDelivery) count++;
    if (this.currentFilter.search) count++;
    return count;
  }

  showOrderHistory(supplierId: string): void {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    if (supplier) {
      this.selectedSupplierId = supplierId;
      this.selectedSupplierName = supplier.name;
      this.selectedSupplierOrders = supplier.orderHistory;
      this.showOrderHistoryModal = true;
    }
  }

  closeOrderHistory(): void {
    this.showOrderHistoryModal = false;
  }

  viewSupplierProducts(supplier: Supplier): void {
    this.selectedSupplierId = supplier.id;
    this.selectedSupplierName = supplier.name;
    this.selectedSupplierDescription = supplier.description;
    this.selectedSupplierLogo = supplier.imageUrl || '';
    this.selectedSupplierCategories = [supplier.category];
    this.showSupplierProductsModal = true;
  }

  onAddToCart(cartItem: CartItem): void {
    console.log('Added to cart:', cartItem);
    // Add to cart logic
  }

  onContactSupplier(supplierId: string): void {
    console.log('Contact supplier:', supplierId);
  }

  onViewDeliveryTerms(supplierId: string): void {
    console.log('View delivery terms:', supplierId);
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

  getCategoryName(category: SupplierCategory): string {
    return category.nameSwedish;
  }

  getRecommendationName(recommendation: any): string {
    return recommendation.nameSwedish;
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    if (hasHalfStar) {
      stars.push('star_half');
    }
    while (stars.length < 5) {
      stars.push('star_border');
    }
    return stars;
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
