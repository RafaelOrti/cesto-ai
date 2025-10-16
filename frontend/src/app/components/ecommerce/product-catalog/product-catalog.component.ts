import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Product, ProductCategory } from '../../../../shared/types/common.types';



interface FilterOptions {
  categories: ProductCategory[];
  priceRange: { min: number; max: number };
  brands: string[];
  suppliers: string[];
}

@Component({
  selector: 'app-product-catalog',
  template: `
    <div class="product-catalog-container">
      <!-- Header -->
      <div class="catalog-header">
        <div class="header-content">
          <h1>Product Catalog</h1>
          <p>Discover and purchase products from verified suppliers</p>
        </div>
        
        <!-- Search Bar -->
        <div class="search-section">
          <form [formGroup]="searchForm" class="search-form">
            <div class="search-input-group">
              <input
                type="text"
                formControlName="search"
                placeholder="Search products, brands, suppliers..."
                class="search-input"
              />
              <button type="button" class="search-btn" (click)="onSearch()">
                <i class="fas fa-search"></i>
              </button>
            </div>
            
            <!-- Quick Filters -->
            <div class="quick-filters">
              <button 
                *ngFor="let filter of quickFilters" 
                class="quick-filter-btn"
                [class.active]="filter.active"
                (click)="toggleQuickFilter(filter)">
                {{ filter.label }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Main Content -->
      <div class="catalog-main">
        <!-- Sidebar Filters -->
        <div class="filters-sidebar" [class.collapsed]="sidebarCollapsed">
          <div class="sidebar-header">
            <h3>Filters</h3>
            <button class="collapse-btn" (click)="toggleSidebar()">
              <i class="fas" [class.fa-chevron-left]="!sidebarCollapsed" [class.fa-chevron-right]="sidebarCollapsed"></i>
            </button>
          </div>

          <div class="filters-content" *ngIf="!sidebarCollapsed">
            <!-- Category Filter -->
            <div class="filter-group">
              <h4>Category</h4>
              <div class="filter-options">
                <label *ngFor="let category of filterOptions.categories" class="filter-option">
                  <input
                    type="checkbox"
                    [value]="category.id"
                    (change)="onCategoryChange(category.id, $event)"
                    [checked]="selectedCategories.includes(category.id)"
                  />
                  <span class="option-label">{{ category.nameSpanish }}</span>
                </label>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-group">
              <h4>Price Range</h4>
              <div class="price-range">
                <input
                  type="range"
                  min="{{ filterOptions.priceRange.min }}"
                  max="{{ filterOptions.priceRange.max }}"
                  [(ngModel)]="priceRange.max"
                  (input)="onPriceRangeChange()"
                  class="price-slider"
                />
                <div class="price-labels">
                  <span>€{{ priceRange.min }}</span>
                  <span>€{{ priceRange.max }}</span>
                </div>
              </div>
            </div>

            <!-- Brand Filter -->
            <div class="filter-group" *ngIf="filterOptions.brands.length > 0">
              <h4>Brand</h4>
              <div class="filter-options">
                <label *ngFor="let brand of filterOptions.brands" class="filter-option">
                  <input
                    type="checkbox"
                    [value]="brand"
                    (change)="onBrandChange(brand, $event)"
                    [checked]="selectedBrands.includes(brand)"
                  />
                  <span class="option-label">{{ brand }}</span>
                </label>
              </div>
            </div>

            <!-- Supplier Filter -->
            <div class="filter-group" *ngIf="filterOptions.suppliers.length > 0">
              <h4>Supplier</h4>
              <div class="filter-options">
                <label *ngFor="let supplier of filterOptions.suppliers" class="filter-option">
                  <input
                    type="checkbox"
                    [value]="supplier"
                    (change)="onSupplierChange(supplier, $event)"
                    [checked]="selectedSuppliers.includes(supplier)"
                  />
                  <span class="option-label">{{ supplier }}</span>
                </label>
              </div>
            </div>

            <!-- Stock Filter -->
            <div class="filter-group">
              <h4>Availability</h4>
              <div class="filter-options">
                <label class="filter-option">
                  <input
                    type="checkbox"
                    [(ngModel)]="inStockOnly"
                    (change)="applyFilters()"
                  />
                  <span class="option-label">In Stock Only</span>
                </label>
              </div>
            </div>

            <!-- Clear Filters -->
            <div class="filter-actions">
              <button class="clear-filters-btn" (click)="clearAllFilters()">
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-section">
          <!-- Results Header -->
          <div class="results-header">
            <div class="results-info">
              <h3>{{ filteredProducts.length }} Products Found</h3>
              <p *ngIf="activeFiltersCount > 0">{{ activeFiltersCount }} filters applied</p>
            </div>
            
            <!-- Sort and View Options -->
            <div class="view-controls">
              <select [(ngModel)]="sortBy" (change)="applyFilters()" class="sort-select">
                <option value="createdAt">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="salesCount">Best Selling</option>
                <option value="name">Name A-Z</option>
              </select>
              
              <div class="view-toggle">
                <button 
                  class="view-btn" 
                  [class.active]="viewMode === 'grid'"
                  (click)="setViewMode('grid')">
                  <i class="fas fa-th"></i>
                </button>
                <button 
                  class="view-btn" 
                  [class.active]="viewMode === 'list'"
                  (click)="setViewMode('list')">
                  <i class="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="products-grid" [class.list-view]="viewMode === 'list'">
            <div 
              *ngFor="let product of paginatedProducts; trackBy: trackByProductId"
              class="product-card"
              [class.list-item]="viewMode === 'list'">
              
              <!-- Product Image -->
              <div class="product-image">
                <img [src]="product.imageUrl" [alt]="product.name" />
                <div class="product-badges">
                  <span *ngIf="product.isFeatured" class="badge featured">Featured</span>
                  <span *ngIf="product.isOnSale" class="badge sale">Sale</span>
                  <span *ngIf="product.stockQuantity <= 10" class="badge low-stock">Low Stock</span>
                </div>
                <div class="product-actions">
                  <button class="action-btn wishlist" (click)="toggleWishlist(product.id)">
                    <i class="fas" [class.fa-heart]="!isInWishlist(product.id)" [class.fa-heart-broken]="isInWishlist(product.id)"></i>
                  </button>
                  <button class="action-btn quick-view" (click)="quickView(product)">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </div>

              <!-- Product Info -->
              <div class="product-info">
                <div class="supplier-info">
                  <span class="supplier-name">{{ product.supplierName }}</span>
                </div>
                
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.shortDescription || product.description }}</p>
                
                <div class="product-rating" *ngIf="product.rating > 0">
                  <div class="stars">
                    <i *ngFor="let star of [1,2,3,4,5]" class="fas fa-star" [class.filled]="star <= product.rating"></i>
                  </div>
                  <span class="rating-text">({{ product.reviewCount }})</span>
                </div>

                <div class="product-price">
                  <span class="current-price">€{{ product.price }}</span>
                  <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="original-price">€{{ product.originalPrice }}</span>
                  <span class="unit">/ {{ product.unit }}</span>
                </div>

                <div class="product-meta">
                  <span class="stock-status" [class.in-stock]="product.stockQuantity > 0" [class.out-of-stock]="product.stockQuantity === 0">
                    {{ product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock' }}
                  </span>
                  <span class="lead-time">{{ product.leadTimeDays }} days</span>
                </div>

                <div class="product-actions-main">
                  <div class="quantity-selector">
                    <button class="qty-btn" (click)="decreaseQuantity(product.id)" [disabled]="getQuantity(product.id) <= 1">-</button>
                    <input type="number" [value]="getQuantity(product.id)" (change)="updateQuantity(product.id, $event)" min="1" [max]="product.stockQuantity">
                    <button class="qty-btn" (click)="increaseQuantity(product.id)" [disabled]="getQuantity(product.id) >= product.stockQuantity">+</button>
                  </div>
                  
                  <button 
                    class="add-to-cart-btn"
                    [disabled]="product.stockQuantity === 0"
                    (click)="addToCart(product)">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination" *ngIf="totalPages > 1">
            <button 
              class="page-btn" 
              [disabled]="currentPage === 1"
              (click)="goToPage(currentPage - 1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <button 
              *ngFor="let page of getPageNumbers()" 
              class="page-btn"
              [class.active]="page === currentPage"
              (click)="goToPage(page)">
              {{ page }}
            </button>
            
            <button 
              class="page-btn" 
              [disabled]="currentPage === totalPages"
              (click)="goToPage(currentPage + 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="filteredProducts.length === 0 && !loading">
            <div class="empty-icon">
              <i class="fas fa-search"></i>
            </div>
            <h3>No products found</h3>
            <p>Try adjusting your search criteria or filters</p>
            <button class="btn btn-primary" (click)="clearAllFilters()">
              Clear Filters
            </button>
          </div>

          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Data
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: ProductCategory[] = [];
  filterOptions: FilterOptions = {
    categories: [],
    priceRange: { min: 0, max: 1000 },
    brands: [],
    suppliers: []
  };
  
  // Search and Filters
  searchForm: FormGroup;
  searchControl = new FormControl('');
  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedSuppliers: string[] = [];
  priceRange = { min: 0, max: 1000 };
  inStockOnly = false;
  
  // Quick Filters
  quickFilters = [
    { key: 'featured', label: 'Featured', active: false },
    { key: 'onSale', label: 'On Sale', active: false },
    { key: 'inStock', label: 'In Stock', active: false },
    { key: 'new', label: 'New Products', active: false }
  ];
  
  // View Settings
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'createdAt';
  sidebarCollapsed = false;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;
  
  // State
  loading = false;
  wishlistItems: string[] = [];
  cartQuantities: { [productId: string]: number } = {};

  constructor() {
    this.searchForm = new FormGroup({
      search: this.searchControl
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private loadProducts(): void {
    this.loading = true;
    // Mock data - replace with actual API call
    this.products = [
      {
        id: '1',
        name: 'Organic Whole Milk',
        description: 'Fresh organic whole milk from grass-fed cows',
        shortDescription: 'Premium organic milk',
        category: 'dairy',
        subcategory: 'milk',
        price: 4.99,
        originalPrice: 5.99,
        imageUrl: '/assets/images/products/milk.jpg',
        imageUrls: ['/assets/images/products/milk.jpg'],
        stockQuantity: 150,
        isFeatured: true,
        isOnSale: true,
        tags: ['organic', 'dairy', 'milk'],
        allergens: ['lactose'],
        rating: 4.5,
        reviewCount: 23,
        viewCount: 156,
        salesCount: 89,
        isAvailable: true,
        supplierId: '1',
        supplierName: 'Fresh Dairy Co',
        minOrderQuantity: 1,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Premium Ground Beef',
        description: '80/20 ground beef from grass-fed cattle',
        shortDescription: 'High-quality ground beef',
        category: 'meat',
        subcategory: 'beef',
        price: 8.99,
        imageUrl: '/assets/images/products/beef.jpg',
        imageUrls: ['/assets/images/products/beef.jpg'],
        stockQuantity: 75,
        isFeatured: false,
        isOnSale: false,
        tags: ['meat', 'beef', 'premium'],
        allergens: [],
        rating: 4.2,
        reviewCount: 15,
        viewCount: 98,
        salesCount: 45,
        isAvailable: true,
        supplierId: '2',
        supplierName: 'Premium Meats Ltd',
        minOrderQuantity: 1,
        createdAt: '2024-01-20T14:15:00Z',
        updatedAt: '2024-01-20T14:15:00Z'
      }
    ];

    this.filteredProducts = [...this.products];
    this.updatePagination();
    this.updateFilterOptions();
    this.loading = false;
  }

  private loadCategories(): void {
    // Mock data - replace with actual API call
    this.categories = [
      {
        id: '1',
        name: 'Dairy & Eggs',
        nameSwedish: 'Mejeri & Ägg',
        nameSpanish: 'Lácteos y Huevos',
        nameEnglish: 'Dairy & Eggs',
        description: 'Milk, cheese, yogurt, and eggs',
        icon: 'local_drink',
        isActive: true,
        sortOrder: 1
      },
      {
        id: '2',
        name: 'Meat & Poultry',
        nameSwedish: 'Kött & Fjäderfä',
        nameSpanish: 'Carnes y Aves',
        nameEnglish: 'Meat & Poultry',
        description: 'Fresh meat and poultry products',
        icon: 'restaurant',
        isActive: true,
        sortOrder: 2
      }
    ];

    this.filterOptions.categories = this.categories;
  }

  private updateFilterOptions(): void {
    const brands = [...new Set(this.products.map(p => p.brand).filter(Boolean))];
    const suppliers = [...new Set(this.products.map(p => p.supplierName))];
    const prices = this.products.map(p => p.price);
    
    this.filterOptions = {
      ...this.filterOptions,
      brands,
      suppliers,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    };
  }

  onSearch(): void {
    this.applyFilters();
  }

  toggleQuickFilter(filter: any): void {
    filter.active = !filter.active;
    this.applyFilters();
  }

  onCategoryChange(categoryId: string, event: any): void {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.applyFilters();
  }

  onBrandChange(brand: string, event: any): void {
    if (event.target.checked) {
      this.selectedBrands.push(brand);
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    }
    this.applyFilters();
  }

  onSupplierChange(supplier: string, event: any): void {
    if (event.target.checked) {
      this.selectedSuppliers.push(supplier);
    } else {
      this.selectedSuppliers = this.selectedSuppliers.filter(s => s !== supplier);
    }
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.supplierName || '').toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        this.selectedCategories.includes(product.category)
      );
    }

    // Brand filter
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        product.brand && this.selectedBrands.includes(product.brand)
      );
    }

    // Supplier filter
    if (this.selectedSuppliers.length > 0) {
      filtered = filtered.filter(product =>
        this.selectedSuppliers.includes(product.supplierName || '')
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= this.priceRange.min && product.price <= this.priceRange.max
    );

    // Stock filter
    if (this.inStockOnly) {
      filtered = filtered.filter(product => product.stockQuantity > 0);
    }

    // Quick filters
    this.quickFilters.forEach(filter => {
      if (filter.active) {
        switch (filter.key) {
          case 'featured':
            filtered = filtered.filter(product => product.isFeatured);
            break;
          case 'onSale':
            filtered = filtered.filter(product => product.isOnSale);
            break;
          case 'inStock':
            filtered = filtered.filter(product => product.stockQuantity > 0);
            break;
          case 'new':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filtered = filtered.filter(product => new Date(product.createdAt) > oneWeekAgo);
            break;
        }
      }
    });

    // Apply sorting
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  private sortProducts(products: Product[]): Product[] {
    const sorted = [...products];
    
    switch (this.sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'salesCount':
        return sorted.sort((a, b) => b.salesCount - a.salesCount);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
    }
  }

  clearAllFilters(): void {
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.selectedSuppliers = [];
    this.priceRange = { ...this.filterOptions.priceRange };
    this.inStockOnly = false;
    this.quickFilters.forEach(filter => filter.active = false);
    this.searchControl.setValue('');
    this.applyFilters();
  }

  get activeFiltersCount(): number {
    let count = 0;
    count += this.selectedCategories.length;
    count += this.selectedBrands.length;
    count += this.selectedSuppliers.length;
    count += this.quickFilters.filter(f => f.active).length;
    if (this.inStockOnly) count++;
    if (this.searchControl.value) count++;
    return count;
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  // Cart functionality
  getQuantity(productId: string): number {
    return this.cartQuantities[productId] || 1;
  }

  updateQuantity(productId: string, event: any): void {
    const quantity = parseInt(event.target.value) || 1;
    this.cartQuantities[productId] = Math.max(1, quantity);
  }

  increaseQuantity(productId: string): void {
    const current = this.getQuantity(productId);
    const product = this.products.find(p => p.id === productId);
    const max = product?.stockQuantity || 1;
    this.cartQuantities[productId] = Math.min(max, current + 1);
  }

  decreaseQuantity(productId: string): void {
    const current = this.getQuantity(productId);
    this.cartQuantities[productId] = Math.max(1, current - 1);
  }

  addToCart(product: Product): void {
    const quantity = this.getQuantity(product.id);
    console.log('Adding to cart:', product.name, 'Quantity:', quantity);
    // Implement actual cart functionality
  }

  // Wishlist functionality
  isInWishlist(productId: string): boolean {
    return this.wishlistItems.includes(productId);
  }

  toggleWishlist(productId: string): void {
    if (this.isInWishlist(productId)) {
      this.wishlistItems = this.wishlistItems.filter(id => id !== productId);
    } else {
      this.wishlistItems.push(productId);
    }
  }

  quickView(product: Product): void {
    console.log('Quick view:', product.name);
    // Implement quick view modal
  }
}
