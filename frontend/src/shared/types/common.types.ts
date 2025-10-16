// Common types for the CESTO application

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedProducts extends PaginatedResponse<Product> {
  data: Product[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Product related types
export interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  imageUrls?: string[];
  category: string;
  subcategory?: string;
  supplierId: string;
  supplierName: string;
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  isFeatured: boolean;
  isOnSale: boolean;
  isAvailable: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  salesCount: number;
  viewCount: number;
  weight?: number;
  dimensions?: string;
  brand?: string;
  model?: string;
  warrantyPeriod?: number;
  originCountry?: string;
  allergens?: string[];
  nutritionalInfo?: any;
  specifications?: any;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameSwedish?: string;
  nameSpanish?: string;
  nameEnglish?: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  children?: ProductCategory[];
  parent?: ProductCategory;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  supplierIds?: string[];
  isOnSale?: boolean;
  inStock?: boolean;
  rating?: number;
  featured?: boolean;
}

export interface ProductFiltersExtended extends ProductFilters {
  sortBy?: 'name' | 'rating' | 'createdAt' | 'price' | 'discount' | 'popularity';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ProductSortOptions {
  field: 'name' | 'rating' | 'createdAt' | 'price' | 'discount' | 'popularity';
  direction: 'asc' | 'desc';
}

// Supplier related types
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logo?: string;
  description?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviewCount?: number;
  deliveryAreas?: string[];
  paymentTerms?: string;
  deliveryTerms?: string;
  minimumOrderAmount?: number;
}

// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'buyer' | 'supplier';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profile?: {
    company?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  };
  preferences?: {
    language: string;
    notifications: boolean;
    theme: string;
  };
}

// Order related types
export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  supplierId: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryDate?: string;
  deliveryAddress?: string;
  notes?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Error related types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  path?: string;
  method?: string;
  timestamp?: string;
}

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Shopping cart types
export interface ShoppingCartItem {
  id: string;
  buyerId: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
  updatedAt: string;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  buyerId: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Product review types
export interface ProductReview {
  id: string;
  productId: string;
  buyerId: string;
  buyer: User;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}