import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../core/services/base-api.service';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../shared/types/common.types';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  supplierId: string;
  supplierName?: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  notes?: string;
  paymentStatus: PaymentStatus;
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export interface OrderFilter {
  status?: OrderStatus;
  supplierId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  paymentStatus?: PaymentStatus;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  trends: Record<string, { orders: number; sales: number }>;
  suppliers: Array<{
    supplierId: string;
    supplierName: string;
    orders: number;
    sales: number;
    avgOrder: number;
  }>;
  monthlyData: Array<{
    month: string;
    orders: number;
    sales: number;
  }>;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  activeSuppliers: number;
  totalSpent: number;
  monthlyGrowth: number;
  averageOrderValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseApiService<Order> {
  constructor(http: HttpClient, @Inject('API_BASE_URL') private apiBaseUrl: string) {
    super(http, apiBaseUrl, '/orders');
  }

  /**
   * Get buyer orders with filtering and pagination
   */
  getBuyerOrders(
    pagination: PaginationParams,
    filters?: OrderFilter
  ): Observable<PaginatedResponse<Order>> {
    const params = {
      ...pagination,
      ...filters
    };

    return this.getAll(params);
  }

  /**
   * Get order by ID
   */
  getOrderById(id: string): Observable<Order> {
    return this.getById(id);
  }

  /**
   * Create new order
   */
  createOrder(order: Partial<Order>): Observable<Order> {
    return this.create(order);
  }

  /**
   * Update order
   */
  updateOrder(id: string, updates: Partial<Order>): Observable<Order> {
    return this.update(id, updates);
  }

  /**
   * Cancel order
   */
  cancelOrder(id: string, reason?: string): Observable<{ success: boolean }> {
    return this.http.post<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/${id}/cancel`, {
      reason
    }).pipe(map(response => response.data));
  }

  /**
   * Get buyer analytics
   */
  getBuyerAnalytics(
    dateFrom?: string,
    dateTo?: string
  ): Observable<OrderAnalytics> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);

    return this.http.get<ApiResponse<OrderAnalytics>>(`${this.baseUrl}/buyer/analytics`, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Get order statistics for dashboard
   */
  getOrderStats(): Observable<OrderStats> {
    return this.http.get<ApiResponse<OrderStats>>(`${this.baseUrl}/buyer/stats`)
      .pipe(map(response => response.data));
  }

  /**
   * Get recent orders
   */
  getRecentOrders(limit: number = 10): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/buyer/recent`, {
      params: { limit: limit.toString() }
    }).pipe(map(response => response.data));
  }

  /**
   * Get top suppliers by orders
   */
  getTopSuppliers(limit: number = 5): Observable<Array<{
    supplierId: string;
    supplierName: string;
    orders: number;
    totalValue: number;
    rating: number;
    lastOrder: string;
  }>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/buyer/top-suppliers`, {
      params: { limit: limit.toString() }
    }).pipe(map(response => response.data));
  }

  /**
   * Get order status history
   */
  getOrderStatusHistory(orderId: string): Observable<Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
    updatedBy: string;
  }>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/${orderId}/status-history`)
      .pipe(map(response => response.data));
  }

  /**
   * Track order delivery
   */
  trackOrder(orderId: string): Observable<{
    status: OrderStatus;
    location?: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
    carrier?: string;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${orderId}/track`)
      .pipe(map(response => response.data));
  }

  /**
   * Get order items
   */
  getOrderItems(orderId: string): Observable<OrderItem[]> {
    return this.http.get<ApiResponse<OrderItem[]>>(`${this.baseUrl}/${orderId}/items`)
      .pipe(map(response => response.data));
  }

  /**
   * Add item to order
   */
  addOrderItem(orderId: string, item: Partial<OrderItem>): Observable<OrderItem> {
    return this.http.post<ApiResponse<OrderItem>>(`${this.baseUrl}/${orderId}/items`, item)
      .pipe(map(response => response.data));
  }

  /**
   * Update order item
   */
  updateOrderItem(orderId: string, itemId: string, updates: Partial<OrderItem>): Observable<OrderItem> {
    return this.http.put<ApiResponse<OrderItem>>(`${this.baseUrl}/${orderId}/items/${itemId}`, updates)
      .pipe(map(response => response.data));
  }

  /**
   * Remove item from order
   */
  removeOrderItem(orderId: string, itemId: string): Observable<{ success: boolean }> {
    return this.http.delete<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/${orderId}/items/${itemId}`)
      .pipe(map(response => response.data));
  }

  /**
   * Get order notifications
   */
  getOrderNotifications(): Observable<Array<{
    id: string;
    orderId: string;
    orderNumber: string;
    type: 'status_change' | 'payment_update' | 'delivery_update' | 'reminder';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/buyer/notifications`)
      .pipe(map(response => response.data));
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): Observable<{ success: boolean }> {
    return this.http.put<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/notifications/${notificationId}/read`, {})
      .pipe(map(response => response.data));
  }

  /**
   * Get order summary for date range
   */
  getOrderSummary(dateFrom: string, dateTo: string): Observable<{
    totalOrders: number;
    totalAmount: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    ordersByMonth: Array<{
      month: string;
      orders: number;
      amount: number;
    }>;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/buyer/summary`, {
      params: { dateFrom, dateTo }
    }).pipe(map(response => response.data));
  }

  // ============================================================================
  // ABSTRACT METHODS IMPLEMENTATION
  // ============================================================================

  protected getEntityName(): string {
    return 'Order';
  }

  protected validateEntity(data: Partial<Order>): boolean {
    return !!(data.buyerId && data.supplierId && data.items && data.items.length > 0);
  }
}
