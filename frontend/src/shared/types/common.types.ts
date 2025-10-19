export interface ShoppingList {
  id: string;
  name: string;
  description: string;
  type: ShoppingListType;
  status: 'active' | 'archived' | 'completed' | 'cancelled';
  isActive: boolean;
  isShared: boolean;
  sharedWith: string[];
  lastUsedDate: string;
  usageCount: number;
  totalItems: number;
  purchasedItems: number;
  pendingItems: number;
  estimatedTotal: number;
  actualTotal: number;
  items: ShoppingListItem[];
  aiRecommendations: AIRecommendations;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  productName: string;
  productImage?: string;
  category: string;
  supplier: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  priority: ItemPriority;
  aiRecommended: boolean;
  aiConfidence?: number;
  lastOrdered?: string;
  averageConsumption?: number;
  stockLevel?: 'low' | 'medium' | 'high' | 'out';
  notes?: string;
  purchased?: boolean;
}

export enum ShoppingListType {
  REGULAR = 'regular',
  BUY_LATER = 'saved_for_later',
  WISHLIST = 'wishlist',
  SEASONAL = 'seasonal',
  EMERGENCY = 'emergency'
}

export enum ItemPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface AIRecommendations {
  suggestedItems: SuggestedItem[];
  priceAlerts: PriceAlert[];
  restockPredictions: RestockPrediction[];
  seasonalInsights: SeasonalInsight[];
}

export interface SuggestedItem {
  name: string;
  reason: string;
  confidence: number;
}

export interface PriceAlert {
  item: string;
  oldPrice: number;
  newPrice: number;
  savings: number;
}

export interface RestockPrediction {
  item: string;
  predictedDate: string;
  confidence: number;
}

export interface SeasonalInsight {
  insight: string;
  recommendation: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

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
  leadTimeDays?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameSpanish: string;
  nameEnglish: string;
  nameSwedish: string;
  icon?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductFiltersExtended extends ProductFilters {
  brands?: string[];
  suppliers?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ProductSortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  companyName?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export type UserRole = 'admin' | 'client' | 'supplier';

export enum UserRoleEnum {
  ADMIN = 'admin',
  CLIENT = 'client',
  SUPPLIER = 'supplier'
}

// Helper function to convert UserRole to string
export function userRoleToString(role: UserRole): string {
  return role;
}

// Helper function to convert string to UserRole
export function stringToUserRole(role: string): UserRole {
  if (role === 'admin' || role === 'buyer' || role === 'supplier') {
    return role as UserRole;
  }
  throw new Error(`Invalid user role: ${role}`);
}

// Supplier related types
export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  supplierName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  logo?: string;
  description?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  relationshipStatus?: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected';
  relationshipId?: string;
}

export interface SupplierRelationshipRequest {
  id: string;
  supplierId: string;
  clientId: string;
  buyerId: string;
  requestType: 'partnership' | 'collaboration' | 'general';
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
  message?: string;
}

// Order related types
export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  supplierId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Address type
export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  phone?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  nameSpanish: string;
  nameEnglish: string;
  nameSwedish: string;
  icon?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  supplier?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  isOnSale?: boolean;
  featured?: boolean;
  tags?: string[];
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  ORDER_UPDATE = 'order_update',
  PRICE_ALERT = 'price_alert',
  STOCK_ALERT = 'stock_alert'
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path?: string;
  method?: string;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}