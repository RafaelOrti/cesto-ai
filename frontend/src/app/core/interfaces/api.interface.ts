export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'supplier' | 'admin';
  companyName: string;
  supplier?: Supplier;
  buyer?: Buyer;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  isVerified?: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  // Additional properties for the suppliers component
  category?: string;
  onSale?: boolean;
  freeDelivery?: boolean;
  coDelivery?: boolean;
  recentlyAdded?: boolean;
  popular?: boolean;
  inquirySent?: boolean;
  imageUrl?: string;
}

export interface Buyer {
  id: string;
  companyName: string;
  businessType?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  sku?: string;
  imageUrl?: string;
  isActive: boolean;
  supplierId: string;
  supplier?: Supplier;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  supplierId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  orderDate: Date;
  deliveryDate?: Date;
  buyer?: Buyer;
  supplier?: Supplier;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: string;
  buyerId: string;
  productId: string;
  currentStock: number;
  minStockThreshold: number;
  maxStockThreshold?: number;
  lastRestocked?: Date;
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface EdiDocument {
  id: string;
  documentNumber: string;
  documentType: 'purchase_order' | 'invoice' | 'product_catalog' | 'acknowledgment';
  format: 'xml' | 'json' | 'csv';
  status: 'pending' | 'processing' | 'processed' | 'error' | 'sent' | 'received';
  senderId?: string;
  receiverId?: string;
  rawContent: string;
  parsedContent?: any;
  validationErrors?: any;
  sentAt?: Date;
  receivedAt?: Date;
  processedAt?: Date;
  errorMessage?: string;
  metadata?: any;
  isAutomated: boolean;
  requiresManualReview: boolean;
  originalFilename?: string;
  filePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  role: 'buyer' | 'supplier';
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface FilterParams {
  category?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  success?: boolean;
}
