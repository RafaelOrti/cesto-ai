import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OrderService, OrderStats, OrderAnalytics } from './order.service';
import { SupplierService } from './supplier.service';
import { AnalyticsService } from '../core/services/analytics.service';

export interface DashboardStats {
  totalOrders: number;
  activeSuppliers: number;
  totalSpent: number;
  pendingOrders: number;
  monthlyGrowth: number;
  averageOrderValue: number;
}

export interface DashboardChartData {
  orders: Array<{ label: string; value: number; date: string }>;
  spending: Array<{ label: string; value: number; date: string }>;
  suppliers: Array<{ label: string; value: number; date: string }>;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'supplier' | 'payment' | 'notification';
  status: 'completed' | 'pending' | 'failed';
  orderId?: string;
  supplierId?: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  time: string;
  read: boolean;
  orderId?: string;
  supplierId?: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientDashboardService {
  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') private apiBaseUrl: string,
    private orderService: OrderService,
    private supplierService: SupplierService,
    private analyticsService: AnalyticsService
  ) {}

  /**
   * Get complete dashboard data
   */
  getDashboardData(): Observable<{
    stats: DashboardStats;
    chartData: DashboardChartData;
    recentActivity: RecentActivity[];
    notifications: DashboardNotification[];
    quickActions: QuickAction[];
  }> {
    return forkJoin({
      stats: this.getDashboardStats(),
      chartData: this.getChartData(),
      recentActivity: this.getRecentActivity(),
      notifications: this.getNotifications(),
      quickActions: of(this.getQuickActions())
    }).pipe(
      catchError(error => {
        console.error('Error loading dashboard data:', error);
        // Return default data on error
        return of({
          stats: this.getDefaultStats(),
          chartData: this.getDefaultChartData(),
          recentActivity: [],
          notifications: [],
          quickActions: this.getQuickActions()
        });
      })
    );
  }

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.orderService.getOrderStats().pipe(
      map(stats => ({
        totalOrders: stats.totalOrders,
        activeSuppliers: stats.activeSuppliers,
        totalSpent: stats.totalSpent,
        pendingOrders: stats.pendingOrders,
        monthlyGrowth: stats.monthlyGrowth,
        averageOrderValue: stats.averageOrderValue
      })),
      catchError(error => {
        console.error('Error loading dashboard stats:', error);
        return of(this.getDefaultStats());
      })
    );
  }

  /**
   * Get chart data for dashboard
   */
  getChartData(): Observable<DashboardChartData> {
    const dateFrom = new Date();
    dateFrom.setMonth(dateFrom.getMonth() - 6);
    const dateTo = new Date();

    return this.orderService.getBuyerAnalytics(
      dateFrom.toISOString().split('T')[0],
      dateTo.toISOString().split('T')[0]
    ).pipe(
      map(analytics => this.transformAnalyticsToChartData(analytics)),
      catchError(error => {
        console.error('Error loading chart data:', error);
        return of(this.getDefaultChartData());
      })
    );
  }

  /**
   * Get recent activity
   */
  getRecentActivity(): Observable<RecentActivity[]> {
    return this.orderService.getRecentOrders(5).pipe(
      map(orders => this.transformOrdersToActivity(orders)),
      catchError(error => {
        console.error('Error loading recent activity:', error);
        return of([]);
      })
    );
  }

  /**
   * Get notifications
   */
  getNotifications(): Observable<DashboardNotification[]> {
    return this.orderService.getOrderNotifications().pipe(
      map(notifications => this.transformOrderNotifications(notifications)),
      catchError(error => {
        console.error('Error loading notifications:', error);
        return of([]);
      })
    );
  }

  /**
   * Get quick actions
   */
  getQuickActions(): QuickAction[] {
    return [
      {
        title: 'New Order',
        description: 'Create a new purchase order',
        icon: 'shopping_cart',
        route: '/client/orders/new',
        color: 'primary',
        enabled: true
      },
      {
        title: 'Find Suppliers',
        description: 'Explore new suppliers',
        icon: 'store',
        route: '/client/suppliers/explore',
        color: 'secondary',
        enabled: true
      },
      {
        title: 'Shopping List',
        description: 'Manage your shopping lists',
        icon: 'shopping_list',
        route: '/client/shopping-lists',
        color: 'accent',
        enabled: true
      },
      {
        title: 'Inventory',
        description: 'Check inventory levels',
        icon: 'warehouse',
        route: '/client/inventory',
        color: 'warning',
        enabled: true
      }
    ];
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboardData(): Observable<any> {
    return this.getDashboardData();
  }

  /**
   * Get analytics data for buyer insights
   */
  getBuyerInsightsData(filters: any): Observable<any> {
    return this.analyticsService.getAnalyticsData(filters);
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId: string): Observable<{ success: boolean }> {
    return this.orderService.markNotificationAsRead(notificationId);
  }

  /**
   * Get order summary for date range
   */
  getOrderSummary(dateFrom: string, dateTo: string): Observable<any> {
    return this.orderService.getOrderSummary(dateFrom, dateTo);
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private transformAnalyticsToChartData(analytics: OrderAnalytics): DashboardChartData {
    const monthlyData = analytics.monthlyData || [];
    
    return {
      orders: monthlyData.map(data => ({
        label: this.formatMonthLabel(data.month),
        value: data.orders,
        date: data.month
      })),
      spending: monthlyData.map(data => ({
        label: this.formatMonthLabel(data.month),
        value: data.sales,
        date: data.month
      })),
      suppliers: monthlyData.map(data => ({
        label: this.formatMonthLabel(data.month),
        value: Math.floor(data.orders / 2), // Approximate suppliers based on orders
        date: data.month
      }))
    };
  }

  private transformOrdersToActivity(orders: any[]): RecentActivity[] {
    return orders.map(order => ({
      id: order.id,
      title: 'Order Placed',
      description: `Order #${order.orderNumber} placed with ${order.supplierName || 'Supplier'}`,
      time: this.getRelativeTime(order.createdAt),
      type: 'order',
      status: this.mapOrderStatusToActivityStatus(order.status),
      orderId: order.id,
      supplierId: order.supplierId
    }));
  }

  private transformOrderNotifications(notifications: any[]): DashboardNotification[] {
    return notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: this.mapNotificationType(notification.type),
      time: this.getRelativeTime(notification.timestamp),
      read: notification.read,
      orderId: notification.orderId,
      supplierId: notification.supplierId
    }));
  }

  private mapOrderStatusToActivityStatus(status: string): 'completed' | 'pending' | 'failed' {
    switch (status) {
      case 'delivered':
      case 'confirmed':
        return 'completed';
      case 'cancelled':
      case 'returned':
        return 'failed';
      default:
        return 'pending';
    }
  }

  private mapNotificationType(type: string): 'success' | 'info' | 'warning' | 'error' {
    switch (type) {
      case 'status_change':
        return 'info';
      case 'payment_update':
        return 'success';
      case 'delivery_update':
        return 'info';
      case 'reminder':
        return 'warning';
      default:
        return 'info';
    }
  }

  private formatMonthLabel(monthString: string): string {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short' });
  }

  private getRelativeTime(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  private getDefaultStats(): DashboardStats {
    return {
      totalOrders: 0,
      activeSuppliers: 0,
      totalSpent: 0,
      pendingOrders: 0,
      monthlyGrowth: 0,
      averageOrderValue: 0
    };
  }

  private getDefaultChartData(): DashboardChartData {
    return {
      orders: [],
      spending: [],
      suppliers: []
    };
  }
}
