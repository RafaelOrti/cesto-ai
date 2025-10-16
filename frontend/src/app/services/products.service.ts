import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BaseApiService } from '../core/services/base-api.service';
import { 
  Product, 
  ProductFilters, 
  ProductSortOptions, 
  PaginatedResponse,
  ProductCategory,
  ApiResponse,
  PaginatedProducts
} from '../../shared/types/common.types';

// Product-specific interfaces (extending base types)
export interface ProductWithSupplier extends Product {
  supplier: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface ProductFiltersExtended extends ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  supplierIds?: string[];
  search?: string;
  isOnSale?: boolean;
  inStock?: boolean;
  rating?: number;
}

// Re-export base types for convenience
export { Product, ProductFilters, ProductSortOptions, ProductCategory, PaginatedResponse, ApiResponse, PaginatedProducts } from '../../shared/types/common.types';

export interface ProductSortOptionsExtended extends ProductSortOptions {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'discount';
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseApiService<Product> {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(
    http: HttpClient,
    @Inject('API_BASE_URL') apiBaseUrl: string
  ) {
    super(http, apiBaseUrl, '/products');
  }

  // ============================================================================
  // ABSTRACT METHODS IMPLEMENTATION
  // ============================================================================

  protected getEntityName(): string {
    return 'Product';
  }

  protected validateEntity(data: Partial<Product>): boolean {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Product name must be at least 2 characters long');
    }
    if (!data.price || data.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }
    if (!data.category) {
      throw new Error('Product category is required');
    }
    return true;
  }

  /**
   * Get all products with optional filtering and sorting
   */
  getProducts(
    filters?: ProductFiltersExtended,
    sort?: ProductSortOptionsExtended,
    page = 1,
    pageSize = 12
  ): Observable<PaginatedResponse<Product>> {
    const params = {
      page,
      limit: pageSize,
      sortBy: sort?.field,
      sortDirection: sort?.direction,
      ...filters
    };

    return this.getPaginated<Product>('/products', page, pageSize, params).pipe(
      tap(response => this.productsSubject.next(response.data))
    );
  }

  /**
   * Get products on sale
   */
  getProductsOnSale(
    limit = 12,
    category?: string
  ): Observable<Product[]> {
    const filters = {
      isOnSale: true,
      ...(category && { category })
    };

    return this.getPaginated<Product>('/products', 1, limit, { ...filters, page: 1, limit }).pipe(
      map(response => response.data),
      tap(products => this.productsSubject.next(products))
    );
  }

  /**
   * Get product by ID
   */
  getProductById(productId: string): Observable<Product> {
    return this.getById(productId);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(
    category: string,
    subcategory?: string,
    page = 1,
    pageSize = 12
  ): Observable<PaginatedResponse<Product>> {
    const filters = {
      category,
      ...(subcategory && { subcategory })
    };

    return this.getPaginated<Product>('/products', page, pageSize, { ...filters, page, limit: pageSize }).pipe(
      tap(response => this.productsSubject.next(response.data))
    );
  }

  /**
   * Get products by supplier
   */
  getProductsBySupplier(
    supplierId: string,
    filters?: Partial<ProductFiltersExtended>,
    page = 1,
    pageSize = 12
  ): Observable<PaginatedResponse<Product>> {
    const params = {
      supplierId,
      page,
      limit: pageSize,
      ...filters
    };

    return this.getPaginated<Product>(`/suppliers/${supplierId}/products`, page, pageSize, params).pipe(
      tap(response => this.productsSubject.next(response.data))
    );
  }

  /**
   * Search products
   */
  searchProducts(
    query: string,
    filters?: Partial<ProductFiltersExtended>,
    page = 1,
    pageSize = 12
  ): Observable<PaginatedResponse<Product>> {
    return this.search(query, { ...filters, page, limit: pageSize }).pipe(
      tap(response => this.productsSubject.next(response.data))
    );
  }

  // ============================================================================
  // SPECIALIZED METHODS
  // ============================================================================

  /**
   * Get product categories
   */
  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ApiResponse<ProductCategory[]>>(`${this.baseUrl}/categories`)
      .pipe(map(response => response.data));
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit = 8): Observable<Product[]> {
    return this.getPaginated<Product>('/products', 1, limit, { page: 1, limit, featured: true })
      .pipe(map(response => response.data));
  }

  /**
   * Get recently added products
   */
  getRecentlyAddedProducts(limit = 8): Observable<Product[]> {
    return this.getPaginated<Product>('/products', 1, limit, { page: 1, limit, sortBy: 'createdAt', sortDirection: 'desc' })
      .pipe(map(response => response.data));
  }

  /**
   * Get best selling products
   */
  getBestSellingProducts(limit = 8): Observable<Product[]> {
    return this.getPaginated<Product>('/products', 1, limit, { page: 1, limit, sortBy: 'salesCount', sortDirection: 'desc' })
      .pipe(map(response => response.data));
  }

  /**
   * Get related products
   */
  getRelatedProducts(productId: string, limit = 4): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/${productId}/related`, {
      params: { limit: limit.toString() }
    }).pipe(map(response => response.data));
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(productId: string): Observable<{ message: string }> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.baseUrl}/${productId}/wishlist`, {})
      .pipe(map(response => response.data));
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: string): Observable<{ message: string }> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/${productId}/wishlist`)
      .pipe(map(response => response.data));
  }

  /**
   * Get wishlist products
   */
  getWishlistProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/wishlist`)
      .pipe(map(response => response.data));
  }

  /**
   * Rate a product
   */
  rateProduct(productId: string, rating: number, review?: string): Observable<{ message: string }> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.baseUrl}/${productId}/rate`, {
      rating,
      review
    }).pipe(map(response => response.data));
  }

  /**
   * Get product reviews
   */
  getProductReviews(productId: string, page = 1, pageSize = 10): Observable<{
    reviews: any[];
    total: number;
    averageRating: number;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${productId}/reviews`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    }).pipe(map(response => response.data));
  }

  /**
   * Get product statistics
   */
  getProductStats(): Observable<{
    totalProducts: number;
    productsOnSale: number;
    averagePrice: number;
    categoriesCount: number;
    topCategories: { category: string; count: number }[];
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats`)
      .pipe(map(response => response.data));
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  /**
   * Update local products cache
   */
  updateLocalProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  /**
   * Add product to local cache
   */
  addProductToCache(product: Product): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([product, ...currentProducts]);
  }

  /**
   * Update product in local cache
   */
  updateProductInCache(updatedProduct: Product): void {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      currentProducts[index] = updatedProduct;
      this.productsSubject.next([...currentProducts]);
    }
  }

  /**
   * Remove product from local cache
   */
  removeProductFromCache(productId: string): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next(currentProducts.filter(p => p.id !== productId));
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Format price in EUR currency
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  /**
   * Calculate discount percentage
   */
  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  /**
   * Get product rating text
   */
  getProductRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 4.0) return 'Muy bueno';
    if (rating >= 3.0) return 'Bueno';
    if (rating >= 2.0) return 'Regular';
    return 'Malo';
  }

  /**
   * Get product status text
   */
  getProductStatusText(product: Product): string {
    if (product.stockQuantity === 0) return 'No disponible';
    if (product.stockQuantity === 0) return 'Sin stock';
    if (product.stockQuantity < 10) return 'Últimas unidades';
    return 'Disponible';
  }

  /**
   * Get product status CSS class
   */
  getProductStatusClass(product: Product): string {
    if (product.stockQuantity === 0) return 'status-unavailable';
    if (product.stockQuantity === 0) return 'status-out-of-stock';
    if (product.stockQuantity < 10) return 'status-low-stock';
    return 'status-available';
  }

  // ============================================================================
  // ENTITY CHANGE NOTIFICATIONS
  // ============================================================================

  protected notifyEntityChange(action: 'created' | 'updated' | 'deleted', entity: Product): void {
    switch (action) {
      case 'created':
        this.addProductToCache(entity);
        break;
      case 'updated':
        this.updateProductInCache(entity);
        break;
      case 'deleted':
        this.removeProductFromCache(entity.id);
        break;
    }
  }
}