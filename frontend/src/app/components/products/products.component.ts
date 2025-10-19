import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Product, ProductCategory } from '../../../shared/types/common.types';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Tab {
  id: string;
  label: string;
}

interface ProductItem {
  id: number;
  name: string;
  image: string;
  supplier: string;
  volume: string;
  quantity: string;
  pricePerPiece: number;
  totalPrice: number;
  originalPrice?: number;
  discount?: number;
  bestBefore?: string;
  isCampaign?: boolean;
  category: string;
  // Enhanced features
  imageUrl?: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  unit?: string;
  moq?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  stockQuantity?: number;
  leadTimeDays?: number;
  rating?: number;
  reviewCount?: number;
  supplierName?: string;
  supplierId?: string;
  lastOrderDate?: string;
  campaign?: string;
}

interface Offer {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  volume: string;
  deliveryDate: string;
  category: string;
}

interface FilterOptions {
  categories: ProductCategory[];
  priceRange: { min: number; max: number };
  brands: string[];
  suppliers: string[];
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Search and filters
  searchQuery = '';
  selectedCategory = 'all';
  selectedTab = 'all-items';
  showTutorial = true;
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'createdAt';
  currentPage = 1;
  itemsPerPage = 12;
  
  // Availability filters
  selectedAvailability: string[] = [];
  isLoading = false;
  
  // Popular products and special offers
  popularProducts: ProductItem[] = [];
  specialOffers: ProductItem[] = [];

  // Forms
  searchForm: FormGroup;

  // Filter options
  filterOptions: FilterOptions = {
    categories: [],
    priceRange: { min: 0, max: 1000 },
    brands: [],
    suppliers: []
  };

  // Selected filters
  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedSuppliers: string[] = [];
  priceRange = { min: 0, max: 1000 };
  inStockOnly = false;

  // Quick filters
  quickFilters = [
    { id: 'featured', label: 'Featured', active: false },
    { id: 'sale', label: 'On Sale', active: false },
    { id: 'new', label: 'New Arrivals', active: false },
    { id: 'low-stock', label: 'Low Stock', active: false }
  ];

  // Data
  products: ProductItem[] = [];
  filteredProducts: ProductItem[] = [];
  paginatedProducts: ProductItem[] = [];
  totalPages = 1;
  loading = false;

  // Categories (from original component)
  categories: Category[] = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'fruits', name: 'Fruits & Vegetables', icon: '🥕' },
    { id: 'meat', name: 'Meat & Deli', icon: '🥩' },
    { id: 'frozen', name: 'Frozen', icon: '🧊' },
    { id: 'seafood', name: 'Fresh Seafood', icon: '🐟' },
    { id: 'bakery', name: 'Bakery', icon: '🥖' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' }
  ];

  tabs: Tab[] = [
    { id: 'all-items', label: 'All Items/Artículos' },
    { id: 'on-sale', label: 'On Sale' }
  ];

  // Sample data (from original component)
  private popularProductsData: ProductItem[] = [
    {
      id: 1,
      name: 'Fever Tree Premium Indian Tonic Water',
      image: 'assets/images/products/tonic-water.png',
      imageUrl: 'assets/images/products/tonic-water.png',
      supplier: 'Fever Tree Beverages Ltd',
      supplierName: 'Fever Tree Beverages Ltd',
      supplierId: 'fever-tree',
      volume: '500 ml',
      quantity: '8 PC',
      pricePerPiece: 28.8,
      totalPrice: 230.4,
      price: 28.8,
      unit: 'PC',
      moq: 1,
      category: 'drink',
      isFeatured: true,
      isOnSale: false,
      stockQuantity: 50,
      leadTimeDays: 3,
      rating: 4.8,
      reviewCount: 1247,
      shortDescription: 'Premium tonic water with natural quinine from the Congo',
      description: 'Fever Tree Premium Indian Tonic Water is crafted with the highest quality natural ingredients including quinine from the Democratic Republic of Congo and natural fruit extracts.'
    },
    {
      id: 2,
      name: 'Organic Whole Milk 3.5% Fat',
      image: 'assets/images/products/milk.png',
      imageUrl: 'assets/images/products/milk.png',
      supplier: 'Luntgårdena Mejeri AB',
      supplierName: 'Luntgårdena Mejeri AB',
      supplierId: 'luntgarden',
      volume: '330 ml',
      quantity: '12 st',
      pricePerPiece: 6,
      totalPrice: 72,
      originalPrice: 12,
      discount: 50,
      price: 6,
      unit: 'st',
      moq: 1,
      bestBefore: '2024-12-24',
      isCampaign: true,
      isOnSale: true,
      category: 'dairy',
      stockQuantity: 25,
      leadTimeDays: 2,
      rating: 4.6,
      reviewCount: 892,
      shortDescription: 'Fresh organic milk from Swedish farms',
      description: 'Organic milk from local Swedish farms, rich in nutrients and flavor. Produced without antibiotics or growth hormones.'
    },
    {
      id: 3,
      name: 'General G.4 Slim All White Portion Snus',
      image: 'assets/images/products/snus.png',
      imageUrl: 'assets/images/products/snus.png',
      supplier: 'Swedish Match AB',
      supplierName: 'Swedish Match AB',
      supplierId: 'general-snus',
      volume: '19.2 g',
      quantity: '240 st',
      pricePerPiece: 15,
      totalPrice: 3600,
      price: 15,
      unit: 'st',
      moq: 1,
      category: 'tobacco',
      stockQuantity: 100,
      leadTimeDays: 5,
      rating: 4.2,
      reviewCount: 456,
      shortDescription: 'Premium Swedish snus with traditional taste',
      description: 'High-quality Swedish snus product with traditional taste. Made with carefully selected tobacco and natural ingredients.'
    },
    {
      id: 4,
      name: 'Craft Non-Alcoholic IPA Beer',
      image: 'assets/images/products/non-alcoholic.png',
      imageUrl: 'assets/images/products/non-alcoholic.png',
      supplier: 'TT Beverage Solutions',
      supplierName: 'TT Beverage Solutions',
      supplierId: 'tt-beverage',
      volume: '33 cl',
      quantity: '24 st',
      pricePerPiece: 8.5,
      totalPrice: 204,
      price: 8.5,
      unit: 'st',
      moq: 1,
      category: 'drink',
      stockQuantity: 75,
      leadTimeDays: 4,
      rating: 4.4,
      reviewCount: 678,
      shortDescription: 'Premium non-alcoholic craft beer with hoppy flavor',
      description: 'Crafted non-alcoholic beer with natural flavors and traditional brewing methods. Perfect for those who want the taste without the alcohol.'
    },
    {
      id: 5,
      name: 'Fresh Atlantic Salmon Fillet',
      image: 'assets/images/products/salmon.png',
      imageUrl: 'assets/images/products/salmon.png',
      supplier: 'Nordic Seafood AB',
      supplierName: 'Nordic Seafood AB',
      supplierId: 'nordic-seafood',
      volume: '1 kg',
      quantity: '1 PC',
      pricePerPiece: 45,
      totalPrice: 45,
      price: 45,
      unit: 'kg',
      moq: 1,
      category: 'seafood',
      stockQuantity: 30,
      leadTimeDays: 1,
      rating: 4.7,
      reviewCount: 234,
      shortDescription: 'Fresh Atlantic salmon fillet, sustainably sourced',
      description: 'Premium Atlantic salmon fillet from sustainable fisheries. Fresh, high-quality fish perfect for restaurants and retail.'
    },
    {
      id: 6,
      name: 'Artisan Sourdough Bread',
      image: 'assets/images/products/bread.png',
      imageUrl: 'assets/images/products/bread.png',
      supplier: 'Stockholm Bakery Co.',
      supplierName: 'Stockholm Bakery Co.',
      supplierId: 'stockholm-bakery',
      volume: '500 g',
      quantity: '6 PC',
      pricePerPiece: 12,
      totalPrice: 72,
      price: 12,
      unit: 'PC',
      moq: 1,
      category: 'bakery',
      stockQuantity: 40,
      leadTimeDays: 1,
      rating: 4.5,
      reviewCount: 156,
      shortDescription: 'Traditional sourdough bread made with organic flour',
      description: 'Artisan sourdough bread made with traditional methods and organic flour. Perfect crust and soft interior.'
    }
  ];

  private offersData: Offer[] = [
    {
      id: 1,
      name: 'Special Offer - Premium Wine',
      image: 'assets/images/products/wine.png',
      originalPrice: 299,
      discountPrice: 199,
      discount: 33,
      volume: '750ml',
      deliveryDate: '2024-02-15',
      category: 'beverages'
    }
  ];

  constructor() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
    this.initializeProductArrays();
  }

  private initializeProductArrays(): void {
    // Initialize popular products and special offers
    this.popularProducts = this.products.slice(0, 3); // Use first 3 products as popular
    this.specialOffers = this.products.filter(p => p.isOnSale).slice(0, 3); // Use products on sale as special offers
  }

  onAvailabilityChange(availability: string, event: any): void {
    if (event.checked) {
      if (!this.selectedAvailability.includes(availability)) {
        this.selectedAvailability.push(availability);
      }
    } else {
      this.selectedAvailability = this.selectedAvailability.filter(a => a !== availability);
    }
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.searchQuery = value;
        this.applyFilters();
      });
  }

  private loadProducts(): void {
    this.loading = true;
    // Mock data - replace with actual service
    setTimeout(() => {
      this.products = [...this.popularProductsData];
      this.filteredProducts = [...this.products];
      this.updatePagination();
      this.loading = false;
    }, 1000);
  }

  onSearch(): void {
    this.searchQuery = this.searchForm.get('search')?.value || '';
    this.applyFilters();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  onTabChange(tabId: string): void {
    this.selectedTab = tabId;
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

  onPriceRangeChange(value: number): void {
    this.priceRange.max = value;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Search filter
    if (this.searchQuery) {
      const searchTerm = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.supplier.toLowerCase().includes(searchTerm) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Tab filter
    if (this.selectedTab === 'on-sale') {
      filtered = filtered.filter(product => product.isOnSale || product.isCampaign);
    }

    // Selected categories filter
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        this.selectedCategories.includes(product.category)
      );
    }

    // Brand filter
    if (this.selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        this.selectedBrands.some(brand => 
          product.supplier.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Supplier filter
    if (this.selectedSuppliers.length > 0) {
      filtered = filtered.filter(product => 
        this.selectedSuppliers.includes(product.supplierId || '')
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.price || product.pricePerPiece;
      return price >= this.priceRange.min && price <= this.priceRange.max;
    });

    // Stock filter
    if (this.inStockOnly) {
      filtered = filtered.filter(product => 
        product.stockQuantity ? product.stockQuantity > 0 : true
      );
    }

    // Quick filters
    if (this.quickFilters.find(f => f.id === 'featured')?.active) {
      filtered = filtered.filter(product => product.isFeatured);
    }
    if (this.quickFilters.find(f => f.id === 'sale')?.active) {
      filtered = filtered.filter(product => product.isOnSale || product.isCampaign);
    }
    if (this.quickFilters.find(f => f.id === 'new')?.active) {
      filtered = filtered.filter(product => product.id > 2); // Mock new products
    }
    if (this.quickFilters.find(f => f.id === 'low-stock')?.active) {
      filtered = filtered.filter(product => 
        product.stockQuantity ? product.stockQuantity <= 10 : false
      );
    }

    // Sort
    this.sortProducts(filtered);

    this.filteredProducts = filtered;
    this.updatePagination();
  }

  private sortProducts(products: ProductItem[]): void {
    switch (this.sortBy) {
      case 'price-asc':
        products.sort((a, b) => (a.price || a.pricePerPiece) - (b.price || b.pricePerPiece));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.price || b.pricePerPiece) - (a.price || a.pricePerPiece));
        break;
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'salesCount':
        products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'createdAt':
      default:
        products.sort((a, b) => b.id - a.id);
        break;
    }
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedTab = 'all-items';
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.selectedSuppliers = [];
    this.priceRange = { min: 0, max: 1000 };
    this.inStockOnly = false;
    this.quickFilters.forEach(filter => filter.active = false);
    this.searchForm.get('search')?.setValue('');
    this.applyFilters();
  }

  quickView(product: ProductItem): void {
    console.log('Quick view product:', product.id);
  }

  decreaseQuantity(productId: number): void {
    console.log('Decrease quantity for product:', productId);
  }

  increaseQuantity(productId: number): void {
    console.log('Increase quantity for product:', productId);
  }

  getQuantity(productId: number): number {
    // Mock implementation
    return 1;
  }

  updateQuantity(productId: number, event: any): void {
    console.log('Update quantity for product:', productId, event.target.value);
  }

  trackByProductId(index: number, product: ProductItem): number {
    return product.id;
  }

  closeTutorial(): void {
    this.showTutorial = false;
  }

  get filteredOffers(): Offer[] {
    return this.offersData;
  }

  get filteredPopularProducts(): ProductItem[] {
    return this.popularProductsData;
  }

  getSpecialOffers(): ProductItem[] {
    // Return products with discounts as special offers
    return this.products.filter(product => product.discount && product.discount > 0);
  }

  viewProduct(product: ProductItem): void {
    console.log('View product:', product);
    // Implement product view logic
  }

  onPaginatorChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.updatePaginatedProducts();
  }

  private updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  // Additional methods for complete functionality
  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.icon : 'category';
  }

  getProductsByCategory(categoryId: string): ProductItem[] {
    if (categoryId === 'all') {
      return this.filteredProducts;
    }
    return this.filteredProducts.filter(product => product.category === categoryId);
  }

  getStockIcon(stockQuantity: number): string {
    if (stockQuantity > 50) return 'check_circle';
    if (stockQuantity > 10) return 'warning';
    return 'error';
  }

  getStockIconClass(stockQuantity: number): string {
    if (stockQuantity > 50) return 'stock-high';
    if (stockQuantity > 10) return 'stock-medium';
    return 'stock-low';
  }

  getStockText(stockQuantity: number): string {
    if (stockQuantity > 50) return 'In Stock';
    if (stockQuantity > 10) return 'Low Stock';
    return 'Out of Stock';
  }

  getStockTextClass(stockQuantity: number): string {
    if (stockQuantity > 50) return 'stock-text-high';
    if (stockQuantity > 10) return 'stock-text-medium';
    return 'stock-text-low';
  }


  viewOffer(offer: Offer): void {
    console.log('View offer:', offer);
    // Implement offer view logic
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  isInWishlist(product: ProductItem): boolean {
    // Implement wishlist logic
    return false;
  }

  toggleWishlist(product: ProductItem): void {
    // Implement wishlist toggle logic
    console.log('Toggle wishlist for:', product.name);
  }

  addToCart(product: ProductItem): void {
    console.log('Add to cart:', product);
    // Implement add to cart logic
  }

  onCategoryTabChange(index: number): void {
    const category = this.categories[index];
    this.selectedCategory = category.id;
    this.applyFilters();
  }

  get selectedCategoryIndex(): number {
    return this.categories.findIndex(c => c.id === this.selectedCategory);
  }

  set selectedCategoryIndex(value: number) {
    // This setter is needed for two-way binding
  }

  getProductImage(product: ProductItem): string {
    // Return a more realistic placeholder image based on product category
    const categoryImages: { [key: string]: string } = {
      'drink': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      'dairy': 'https://images.unsplash.com/photo-1550583724-b2696b85b150?w=400&h=300&fit=crop',
      'fruits': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
      'meat': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
      'frozen': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'seafood': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop',
      'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      'tobacco': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
    };
    
    if (product.imageUrl || product.image) {
      return product.imageUrl || product.image;
    }
    
    return categoryImages[product.category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
  }

  getStockStatus(product: ProductItem): string {
    const stock = product.stockQuantity || 0;
    if (stock > 50) return 'in-stock';
    if (stock > 10) return 'low-stock';
    return 'out-of-stock';
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedCategories.length > 0) count++;
    if (this.selectedBrands.length > 0) count++;
    if (this.selectedSuppliers.length > 0) count++;
    if (this.inStockOnly) count++;
    if (this.quickFilters.some(f => f.active)) count++;
    if (this.priceRange.min > this.filterOptions.priceRange.min || 
        this.priceRange.max < this.filterOptions.priceRange.max) count++;
    return count;
  }
}