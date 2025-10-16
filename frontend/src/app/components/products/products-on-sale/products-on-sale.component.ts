import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService, Product, ProductCategory } from '../../../services/products.service';

@Component({
  selector: 'app-products-on-sale',
  templateUrl: './products-on-sale.component.html',
  styleUrls: ['./products-on-sale.component.scss']
})
export class ProductsOnSaleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  products: Product[] = [];
  categories: ProductCategory[] = [];
  
  // UI State
  loading = false;
  selectedCategory = '';
  
  // Configuration
  productsLimit = 12;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductsOnSale();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data loading methods
  loadProductsOnSale(): void {
    this.loading = true;
    
    this.productsService.getProductsOnSale(this.productsLimit, this.selectedCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products on sale:', error);
          this.loading = false;
        }
      });
  }

  loadCategories(): void {
    this.productsService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  // Event handlers
  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.loadProductsOnSale();
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

  addToCart(product: Product): void {
    // Add to cart logic
    console.log('Add to cart:', product.id);
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
      const subcategory = category.subcategories.find(s => s.id === subcategoryId);
      return subcategory ? subcategory.name : subcategoryId;
    }
    return subcategoryId;
  }

  // Check if product is in wishlist (you would implement this based on your wishlist state)
  isInWishlist(product: Product): boolean {
    // This would be implemented based on your wishlist state management
    return false;
  }

  // Get time remaining for sale (you could implement this based on product sale end date)
  getTimeRemaining(product: Product): string {
    // This would be implemented based on product sale end date
    return '2 días';
  }
}