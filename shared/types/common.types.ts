export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
  status: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'supplier' | 'buyer' | 'client';
  isActive: boolean;
  lastLoginAt?: string;
}

export interface Supplier extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  description?: string;
  logo?: string;
  isVerified: boolean;
  isActive: boolean;
  rating?: number;
  totalReviews?: number;
  categories: string[];
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  minOrderQuantity: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  supplierId: string;
  supplier?: Supplier;
  tags: string[];
  specifications?: Record<string, any>;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  buyerId: string;
  supplierId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  company?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: Category[];
  isActive: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  supplierId: string;
  startDate: string;
  endDate: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  products: string[];
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  buyer?: User;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  supplier?: string;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface DashboardStats {
  totalUsers: number;
  totalSuppliers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeSuppliers: number;
  newProducts: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface AdminAuditLog extends BaseEntity {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId?: string;
  description?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  isSuccessful: boolean;
  errorMessage?: string;
  metadata?: any;
}

export interface ApiErrorResponse {
  message: string;
  errors?: ValidationError[];
  status: number;
  timestamp: string;
  path: string;
}