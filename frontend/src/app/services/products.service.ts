import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PaginatedResponse } from '../../shared/types/common.types';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  supplier: string;
  inStock: boolean;
  stockQuantity: number;
  rating?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  subcategories?: string[];
  children?: ProductCategory[];
}

export interface ProductFiltersExtended {
  searchTerm?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  supplier?: string;
}

export interface ProductSortOptionsExtended {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:3400/api/v1';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]>;
  getProducts(filters?: ProductFiltersExtended, sort?: ProductSortOptionsExtended, page?: number, limit?: number): Observable<PaginatedResponse<Product>>;
  getProducts(filters?: ProductFiltersExtended, sort?: ProductSortOptionsExtended, page?: number, limit?: number): Observable<Product[] | PaginatedResponse<Product>> {
    // Mock data for now
    const products: Product[] = [
      {
        id: '1',
        name: 'Organic Milk 1L',
        description: 'Fresh organic milk',
        category: 'Dairy',
        price: 20.00,
        image: 'assets/images/products/milk.png',
        supplier: 'Dairy Farm Co.',
        inStock: true,
        stockQuantity: 100
      },
      {
        id: '2',
        name: 'Fresh Bread Loaf',
        description: 'Artisan bread',
        category: 'Bakery',
        price: 20.00,
        image: 'assets/images/products/bread.png',
        supplier: 'Bakery Solutions',
        inStock: true,
        stockQuantity: 50
      }
    ];

    if (page !== undefined && limit !== undefined) {
      // Return paginated response
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = products.slice(startIndex, endIndex);
      
      return of({
        data: paginatedProducts,
        total: products.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(products.length / limit),
        hasNext: endIndex < products.length,
        hasPrevious: page > 1
      });
    } else {
      // Return simple array
      return of(products);
    }
  }

  getProductById(id: string): Observable<Product | null> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id) || null)
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  getProductsOnSale(limit?: number, category?: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        let filtered = products.filter(p => p.inStock);
        if (category && category !== 'all') {
          filtered = filtered.filter(p => p.category === category);
        }
        if (limit) {
          filtered = filtered.slice(0, limit);
        }
        return filtered;
      })
    );
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.getProducts().pipe(
      map(products => {
        const categories = [...new Set(products.map(p => p.category))];
        return categories.map(cat => ({
          id: cat.toLowerCase().replace(/\s+/g, '-'),
          name: cat,
          subcategories: []
        }));
      })
    );
  }

  addToWishlist(productId: string): Observable<any> {
    // Mock implementation
    return of({ success: true, message: 'Added to wishlist' });
  }

  removeFromWishlist(productId: string): Observable<any> {
    // Mock implementation
    return of({ success: true, message: 'Removed from wishlist' });
  }

  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getProductRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Fair';
    return 'Poor';
  }

  getProductStatusText(product: Product): string {
    if (!product.inStock) return 'Out of Stock';
    if (product.stockQuantity < 10) return 'Low Stock';
    return 'In Stock';
  }

  getProductStatusClass(product: Product): string {
    if (!product.inStock) return 'out-of-stock';
    if (product.stockQuantity < 10) return 'low-stock';
    return 'in-stock';
  }

  getProductStats(): Observable<any> {
    // Mock implementation
    return of({
      totalProducts: 100,
      inStock: 85,
      outOfStock: 15,
      lowStock: 10,
      averagePrice: 25.50,
      totalValue: 2550.00
    });
  }
}