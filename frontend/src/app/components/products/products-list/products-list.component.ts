import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProductsService, Product, ProductFiltersExtended, ProductSortOptionsExtended, ProductCategory } from '../../../services/products.service';
import { PaginatedResponse } from 'src/shared/types/common.types';
import { BaseComponent } from '../../../core/components/base-component';
import { UtilsService } from '../../../core/services/utils.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent extends BaseComponent implements OnInit, OnDestroy {
  private searchSubject = new Subject<string>();

  // Data
  products: Product[] = [];
  categories: ProductCategory[] = [];
  filteredProducts: Product[] = [];
  
  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;
  
  // Filters and search
  searchTerm = '';
  selectedCategory = '';
  selectedSubcategory = '';
  selectedSort: ProductSortOptionsExtended = { field: 'name', direction: 'asc' };
  selectedFilters: ProductFiltersExtended = {};
  
  // UI State
  showFilters = false;
  viewMode: 'grid' | 'list' = 'grid';
  
  // Forms
  searchForm: FormGroup;
  filterForm: FormGroup;
  
  // Sort options
  sortOptions = [
    { value: { field: 'name', direction: 'asc' }, label: 'Nombre A-Z' },
    { value: { field: 'name', direction: 'desc' }, label: 'Nombre Z-A' },
    { value: { field: 'price', direction: 'asc' }, label: 'Precio menor a mayor' },
    { value: { field: 'price', direction: 'desc' }, label: 'Precio mayor a menor' },
    { value: { field: 'rating', direction: 'desc' }, label: 'Mejor valorados' },
    { value: { field: 'createdAt', direction: 'desc' }, label: 'Más recientes' },
    { value: { field: 'discount', direction: 'desc' }, label: 'Mayor descuento' }
  ];

  // Filter options
  priceRanges = [
    { min: 0, max: 10, label: 'Menos de 10€' },
    { min: 10, max: 25, label: '10€ - 25€' },
    { min: 25, max: 50, label: '25€ - 50€' },
    { min: 50, max: 100, label: '50€ - 100€' },
    { min: 100, max: Infinity, label: 'Más de 100€' }
  ];

  ratingOptions = [
    { value: 5, label: '5 estrellas' },
    { value: 4, label: '4+ estrellas' },
    { value: 3, label: '3+ estrellas' }
  ];

  constructor(
    private productsService: ProductsService,
    private fb: FormBuilder,
    protected utils: UtilsService
  ) {
    super(utils);
    this.initializeForms();
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadProductsStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.filterForm = this.fb.group({
      category: [''],
      subcategory: [''],
      minPrice: [null],
      maxPrice: [null],
      isOnSale: [false],
      inStock: [true],
      rating: [null]
    });

    // Watch filter form changes
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private setupSearchDebounce(): void {
    this.safeSubscribe(
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      (searchTerm: string) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadProducts();
      }
    );
  }

  // Data loading methods
  loadProducts(): void {
    this.setLoading(true);
    this.clearErrors();
    
    const filters: ProductFiltersExtended = {
      ...this.selectedFilters,
      search: this.searchTerm,
      category: this.selectedCategory,
      subcategory: this.selectedSubcategory
    };

    this.safeSubscribe(
      this.productsService.getProducts(filters, this.selectedSort, this.currentPage, this.pageSize),
      (response: PaginatedResponse<Product>) => {
        this.products = response.data;
        this.filteredProducts = response.data;
        this.totalItems = response.total;
        this.totalPages = response.totalPages;
        this.setLoading(false);
      },
      (error) => {
        this.setError('Error al cargar los productos');
        this.setLoading(false);
      }
    );
  }

  loadCategories(): void {
    this.safeSubscribe(
      this.productsService.getCategories(),
      (categories) => {
        this.categories = Array.isArray(categories) ? categories : [];
      },
      (error) => {
        this.setError('Error al cargar las categorías');
      }
    );
  }

  loadProductsStats(): void {
    this.safeSubscribe(
      this.productsService.getProductStats(),
      (stats) => {
        // Handle stats if needed
      },
      (error) => {
        console.error('Error loading product stats:', error);
      }
    );
  }

  // Search and filter methods
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.selectedSubcategory = '';
    this.currentPage = 1;
    this.filterForm.patchValue({ subcategory: '' });
    this.loadProducts();
  }

  onSubcategoryChange(subcategoryId: string): void {
    this.selectedSubcategory = subcategoryId;
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(sort: ProductSortOptionsExtended): void {
    this.selectedSort = sort;
    this.currentPage = 1;
    this.loadProducts();
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    
    this.selectedFilters = {
      minPrice: formValue.minPrice,
      maxPrice: formValue.maxPrice,
      isOnSale: formValue.isOnSale,
      inStock: formValue.inStock,
      rating: formValue.rating
    };

    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.selectedFilters = {};
    this.searchTerm = '';
    this.currentPage = 1;
    
    this.filterForm.reset({
      category: '',
      subcategory: '',
      minPrice: null,
      maxPrice: null,
      isOnSale: false,
      inStock: true,
      rating: null
    });
    
    this.searchForm.reset();
    this.loadProducts();
  }

  // Pagination methods
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadProducts();
  }

  // UI methods
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // Product actions
  addToWishlist(product: Product): void {
    this.productsService.addToWishlist(product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.message);
          // You could show a toast notification here
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
        }
      });
  }

  removeFromWishlist(product: Product): void {
    this.productsService.removeFromWishlist(product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.message);
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
        }
      });
  }

  viewProduct(product: Product): void {
    // Navigate to product detail page
    console.log('View product:', product.id);
  }

  // Utility methods
  getProductDiscount(product: Product): number {
    if (product.originalPrice && product.originalPrice > product.price) {
      return this.productsService.calculateDiscount(product.originalPrice, product.price);
    }
    return 0;
  }

  formatPrice(price: number): string {
    return this.productsService.formatPrice(price);
  }

  getProductRatingText(rating: number): string {
    return this.productsService.getProductRatingText(rating);
  }

  getProductStatusText(product: Product): string {
    return this.productsService.getProductStatusText(product);
  }

  getProductStatusClass(product: Product): string {
    return this.productsService.getProductStatusClass(product);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  getSubcategoryName(categoryId: string, subcategoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      const subcategory = category.children?.find(s => s.id === subcategoryId);
      return subcategory ? subcategory.name : subcategoryId;
    }
    return subcategoryId;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.selectedCategory ||
      this.selectedSubcategory ||
      this.searchTerm ||
      Object.values(this.selectedFilters).some(value => value !== null && value !== false && value !== undefined)
    );
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedCategory) count++;
    if (this.selectedSubcategory) count++;
    if (this.searchTerm) count++;
    if (this.selectedFilters.minPrice) count++;
    if (this.selectedFilters.maxPrice) count++;
    if (this.selectedFilters.isOnSale) count++;
    if (this.selectedFilters.inStock) count++;
    if (this.selectedFilters.rating) count++;
    return count;
  }

  // Math utility for template
  Math = Math;
}