import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  supplier: {
    id: string;
    name: string;
    logo?: string;
  };
  images: string[];
  tags: string[];
  isOnSale: boolean;
  isAvailable: boolean;
  stock: number;
  minOrderQuantity: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients?: string[];
  allergens?: string[];
  certifications?: string[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  isOnSale?: boolean;
  search?: string;
  tags?: string[];
  supplierIds?: string[];
  inStock?: boolean;
  rating?: number;
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'discount';
  direction: 'asc' | 'desc';
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: ProductFilters;
  sort: ProductSortOptions;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly API_URL = 'http://localhost:3000/api';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all products with optional filtering and sorting
   */
  getProducts(
    filters?: ProductFilters,
    sort?: ProductSortOptions,
    page = 1,
    pageSize = 12
  ): Observable<PaginatedProducts> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.subcategory) params = params.set('subcategory', filters.subcategory);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.isOnSale) params = params.set('isOnSale', filters.isOnSale.toString());
      if (filters.search) params = params.set('search', filters.search);
      if (filters.inStock) params = params.set('inStock', filters.inStock.toString());
      if (filters.rating) params = params.set('rating', filters.rating.toString());
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params = params.append('tags', tag));
      }
      if (filters.supplierIds && filters.supplierIds.length > 0) {
        filters.supplierIds.forEach(id => params = params.append('supplierIds', id));
      }
    }

    if (sort) {
      params = params.set('sortBy', sort.field);
      params = params.set('sortDirection', sort.direction);
    }

    return this.http.get<PaginatedProducts>(`${this.API_URL}/products`, { params });
  }

  /**
   * Get products on sale
   */
  getProductsOnSale(
    limit = 12,
    category?: string
  ): Observable<Product[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (category) params = params.set('category', category);

    return this.http.get<Product[]>(`${this.API_URL}/products/on-sale`, { params });
  }

  /**
   * Get product by ID
   */
  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${productId}`);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(
    category: string,
    subcategory?: string,
    page = 1,
    pageSize = 12
  ): Observable<PaginatedProducts> {
    let params = new HttpParams()
      .set('category', category)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (subcategory) params = params.set('subcategory', subcategory);

    return this.http.get<PaginatedProducts>(`${this.API_URL}/products/category/${category}`, { params });
  }

  /**
   * Get products by supplier
   */
  getProductsBySupplier(
    supplierId: string,
    filters?: Partial<ProductFilters>,
    page = 1,
    pageSize = 12
  ): Observable<PaginatedProducts> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<PaginatedProducts>(`${this.API_URL}/products/supplier/${supplierId}`, { params });
  }

  /**
   * Search products
   */
  searchProducts(
    query: string,
    filters?: Partial<ProductFilters>,
    page = 1,
    pageSize = 12
  ): Observable<PaginatedProducts> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.isOnSale) params = params.set('isOnSale', filters.isOnSale.toString());
    }

    return this.http.get<PaginatedProducts>(`${this.API_URL}/products/search`, { params });
  }

  /**
   * Get product categories
   */
  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.API_URL}/products/categories`);
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/featured`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get recently added products
   */
  getRecentlyAddedProducts(limit = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/recent`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get best selling products
   */
  getBestSellingProducts(limit = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/best-selling`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get related products
   */
  getRelatedProducts(productId: string, limit = 4): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/${productId}/related`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(productId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/products/${productId}/wishlist`, {});
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/products/${productId}/wishlist`);
  }

  /**
   * Get wishlist products
   */
  getWishlistProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/wishlist`);
  }

  /**
   * Rate a product
   */
  rateProduct(productId: string, rating: number, review?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/products/${productId}/rate`, {
      rating,
      review
    });
  }

  /**
   * Get product reviews
   */
  getProductReviews(productId: string, page = 1, pageSize = 10): Observable<{
    reviews: any[];
    total: number;
    averageRating: number;
  }> {
    return this.http.get<any>(`${this.API_URL}/products/${productId}/reviews`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
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
    return this.http.get<any>(`${this.API_URL}/products/stats`);
  }

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

  /**
   * Utility methods
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  getProductRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 4.0) return 'Muy bueno';
    if (rating >= 3.0) return 'Bueno';
    if (rating >= 2.0) return 'Regular';
    return 'Malo';
  }

  getProductStatusText(product: Product): string {
    if (!product.isAvailable) return 'No disponible';
    if (product.stock === 0) return 'Sin stock';
    if (product.stock < 10) return 'Últimas unidades';
    return 'Disponible';
  }

  getProductStatusClass(product: Product): string {
    if (!product.isAvailable) return 'status-unavailable';
    if (product.stock === 0) return 'status-out-of-stock';
    if (product.stock < 10) return 'status-low-stock';
    return 'status-available';
  }

  /**
   * Validation helpers
   */
  validateProductData(productData: Partial<Product>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!productData.name || productData.name.trim().length < 2) {
      errors.push('Nombre del producto debe tener al menos 2 caracteres');
    }

    if (!productData.price || productData.price <= 0) {
      errors.push('Precio debe ser mayor a 0');
    }

    if (!productData.category || productData.category.trim().length < 2) {
      errors.push('Categoría es requerida');
    }

    if (productData.originalPrice && productData.originalPrice <= productData.price) {
      errors.push('Precio original debe ser mayor al precio actual');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}