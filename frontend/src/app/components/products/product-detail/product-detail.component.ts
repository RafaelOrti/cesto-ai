import { Component, OnInit, Input } from '@angular/core';

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  images: string[];
  category: string;
  subcategory: string;
  supplier: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    reviewCount: number;
  };
  pricing: {
    currentPrice: number;
    originalPrice?: number;
    unit: string;
    moq: number;
    bulkPricing?: {
      minQty: number;
      maxQty: number;
      price: number;
    }[];
  };
  specifications: {
    brand: string;
    weight: string;
    dimensions: string;
    color: string;
    material: string;
    origin: string;
    shelfLife: string;
    storage: string;
  };
  availability: {
    inStock: boolean;
    stockLevel: number;
    expectedRestock?: string;
    leadTime: string;
  };
  features: string[];
  reviews: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }[];
  averageRating: number;
  totalReviews: number;
  relatedProducts: {
    id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
  }[];
  tags: string[];
  isOnSale: boolean;
  isNew: boolean;
  isRecommended: boolean;
  aiInsights?: {
    demandPrediction: string;
    priceTrend: string;
    seasonalPattern: string;
    recommendationScore: number;
  };
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Input() productId: string = '';
  
  product: ProductDetail | null = null;
  selectedImageIndex = 0;
  selectedQuantity = 1;
  selectedSpecs: { [key: string]: string } = {};
  showReviews = false;
  showSpecifications = true;
  showRelatedProducts = true;
  loading = false;

  // Mock data - replace with actual service
  mockProduct: ProductDetail = {
    id: 'prod-1',
    name: 'Fever Tree Premium Indian Tonic Water',
    description: 'Premium tonic water with natural quinine',
    longDescription: 'Fever Tree Premium Indian Tonic Water is crafted with the highest quality natural ingredients. Made with natural quinine from the fever tree, this premium tonic water delivers a perfectly balanced bitter-sweet taste that complements premium spirits beautifully.',
    images: [
      '/assets/images/products/tonic-water-1.jpg',
      '/assets/images/products/tonic-water-2.jpg',
      '/assets/images/products/tonic-water-3.jpg'
    ],
    category: 'Beverages',
    subcategory: 'Tonic Water',
    supplier: {
      id: 'supplier-1',
      name: 'Fever Tree Beverages',
      logo: '/assets/images/suppliers/fever-tree.png',
      rating: 4.8,
      reviewCount: 1247
    },
    pricing: {
      currentPrice: 28.8,
      originalPrice: 32.0,
      unit: 'PC',
      moq: 1,
      bulkPricing: [
        { minQty: 12, maxQty: 23, price: 26.4 },
        { minQty: 24, maxQty: 47, price: 24.0 },
        { minQty: 48, maxQty: 99, price: 21.6 },
        { minQty: 100, maxQty: 999, price: 19.2 }
      ]
    },
    specifications: {
      brand: 'Fever Tree',
      weight: '200ml',
      dimensions: '6.5cm x 6.5cm x 20cm',
      color: 'Clear',
      material: 'Glass bottle',
      origin: 'United Kingdom',
      shelfLife: '24 months',
      storage: 'Store in cool, dry place'
    },
    availability: {
      inStock: true,
      stockLevel: 150,
      expectedRestock: '2024-02-15',
      leadTime: '2-3 business days'
    },
    features: [
      'Natural quinine from the fever tree',
      'No artificial sweeteners',
      'Perfect for premium spirits',
      'Award-winning taste',
      'Premium glass bottle',
      'Suitable for cocktails'
    ],
    reviews: [
      {
        id: 'rev-1',
        user: 'John D.',
        rating: 5,
        comment: 'Excellent tonic water, perfect with gin. The quality is outstanding.',
        date: '2024-01-15',
        verified: true
      },
      {
        id: 'rev-2',
        user: 'Sarah M.',
        rating: 4,
        comment: 'Great taste and quality. A bit pricey but worth it for special occasions.',
        date: '2024-01-10',
        verified: true
      }
    ],
    averageRating: 4.7,
    totalReviews: 1247,
    relatedProducts: [
      {
        id: 'prod-2',
        name: 'Fever Tree Mediterranean Tonic',
        image: '/assets/images/products/mediterranean-tonic.jpg',
        price: 28.8,
        rating: 4.6
      },
      {
        id: 'prod-3',
        name: 'Fever Tree Elderflower Tonic',
        image: '/assets/images/products/elderflower-tonic.jpg',
        price: 28.8,
        rating: 4.5
      }
    ],
    tags: ['Premium', 'Natural', 'Cocktail', 'Award-winning'],
    isOnSale: true,
    isNew: false,
    isRecommended: true,
    aiInsights: {
      demandPrediction: 'High demand expected for summer season',
      priceTrend: 'Stable pricing with occasional promotions',
      seasonalPattern: 'Peak sales in summer months',
      recommendationScore: 0.92
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.product = this.mockProduct;
      this.loading = false;
    }, 500);
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  updateQuantity(change: number): void {
    const newQuantity = this.selectedQuantity + change;
    if (newQuantity >= this.product!.pricing.moq && newQuantity <= 999) {
      this.selectedQuantity = newQuantity;
    }
  }

  onQuantityChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const quantity = parseInt(target.value) || this.product!.pricing.moq;
    this.selectedQuantity = Math.max(quantity, this.product!.pricing.moq);
  }

  getBulkPrice(): number {
    if (!this.product?.pricing.bulkPricing) return this.product!.pricing.currentPrice;
    
    const bulkPrice = this.product.pricing.bulkPricing.find(bp => 
      this.selectedQuantity >= bp.minQty && this.selectedQuantity <= bp.maxQty
    );
    
    return bulkPrice ? bulkPrice.price : this.product.pricing.currentPrice;
  }

  getSavings(): number {
    if (!this.product?.pricing.originalPrice) return 0;
    return this.product.pricing.originalPrice - this.product.pricing.currentPrice;
  }

  getTotalPrice(): number {
    return this.getBulkPrice() * this.selectedQuantity;
  }

  addToCart(): void {
    console.log('Adding to cart:', {
      productId: this.product!.id,
      quantity: this.selectedQuantity,
      price: this.getBulkPrice()
    });
    // Implement add to cart logic
  }

  addToWishlist(): void {
    console.log('Adding to wishlist:', this.product!.id);
    // Implement wishlist logic
  }

  buyNow(): void {
    console.log('Buying now:', {
      productId: this.product!.id,
      quantity: this.selectedQuantity,
      price: this.getBulkPrice()
    });
    // Implement buy now logic
  }

  contactSupplier(): void {
    console.log('Contacting supplier:', this.product!.supplier.id);
    // Implement contact supplier logic
  }

  toggleReviews(): void {
    this.showReviews = !this.showReviews;
  }

  toggleSpecifications(): void {
    this.showSpecifications = !this.showSpecifications;
  }

  toggleRelatedProducts(): void {
    this.showRelatedProducts = !this.showRelatedProducts;
  }

  viewRelatedProduct(product: any): void {
    console.log('Viewing related product:', product.id);
    // Navigate to related product
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getStockStatusClass(): string {
    if (!this.product?.availability.inStock) return 'out-of-stock';
    if (this.product.availability.stockLevel < 10) return 'low-stock';
    return 'in-stock';
  }

  getStockStatusText(): string {
    if (!this.product?.availability.inStock) return 'Out of Stock';
    if (this.product.availability.stockLevel < 10) return 'Low Stock';
    return 'In Stock';
  }

  getDiscountPercentage(): number {
    if (!this.product?.pricing.originalPrice) return 0;
    return Math.round(((this.product.pricing.originalPrice - this.product.pricing.currentPrice) / this.product.pricing.originalPrice) * 100);
  }

  getStarRating(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  getPartialStar(rating: number): number {
    return rating % 1;
  }

  round(value: number): number {
    return Math.round(value);
  }
}
