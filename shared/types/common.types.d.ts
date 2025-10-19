export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'supplier' | 'buyer' | 'client';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
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
    reviews?: number;
}
export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    isActive: boolean;
    joinedDate: string;
    rating: number;
    totalProducts: number;
    categories: string[];
}
export interface Order {
    id: string;
    orderNumber: string;
    buyerId: string;
    supplierId: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}
export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export interface Category {
    id: string;
    name: string;
    description: string;
    parentId?: string;
    isActive: boolean;
}
export interface SearchFilters {
    query?: string;
    category?: string;
    supplier?: string;
    priceMin?: number;
    priceMax?: number;
    inStock?: boolean;
    rating?: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    status: number;
}
export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    message?: string;
    success: boolean;
    status: number;
}
export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}
export interface ApiError {
    message: string;
    code: string;
    details?: any;
    status: number;
}
export interface ValidationError {
    field: string;
    message: string;
    code: string;
}
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
    expiresAt?: string;
}
export interface ShoppingListItem {
    id: string;
    productName: string;
    productImage: string;
    category: string;
    supplier: string;
    quantity: number;
    unit: string;
    estimatedPrice: number;
    priority: 'high' | 'medium' | 'low';
    aiRecommended: boolean;
    aiConfidence: number;
    lastOrdered: string;
    averageConsumption: number;
    stockLevel: 'high' | 'medium' | 'low';
}
export interface ShoppingList {
    id: string;
    name: string;
    type: 'personal' | 'shared' | 'team';
    items: ShoppingListItem[];
    createdAt: string;
    updatedAt: string;
    sharedWith: string[];
    isActive: boolean;
}
export type ShoppingListType = 'personal' | 'shared' | 'team';
export type ItemPriority = 'high' | 'medium' | 'low';
export interface SupplierRelationshipRequest {
    id: string;
    buyerId: string;
    supplierId: string;
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    createdAt: string;
    updatedAt: string;
}
