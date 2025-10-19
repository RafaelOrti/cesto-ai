import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AnalyticsService } from '../../core/services/analytics.service';

interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

interface RecentOrder {
  id: string;
  supplier: string;
  total: number;
  status: string;
  date: string;
  items: number;
}

interface TopSupplier {
  name: string;
  orders: number;
  totalValue: number;
  rating: number;
  lastOrder: string;
}

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: any = null;
  isLoading = true;
  
  // Dashboard Statistics
  stats = {
    totalOrders: 0,
    activeSuppliers: 0,
    totalSpent: 0,
    pendingOrders: 0,
    monthlyGrowth: 0,
    averageOrderValue: 0
  };
  
  // Chart Data
  ordersChartData: ChartDataPoint[] = [];
  spendingChartData: ChartDataPoint[] = [];
  suppliersChartData: ChartDataPoint[] = [];
  
  // Quick Actions
  quickActions: QuickAction[] = [
    {
      title: 'New Order',
      description: 'Create a new purchase order',
      icon: 'shopping_cart',
      route: '/client/orders',
      color: 'primary'
    },
    {
      title: 'Find Suppliers',
      description: 'Explore new suppliers',
      icon: 'store',
      route: '/client/suppliers/explore',
      color: 'secondary'
    },
    {
      title: 'Shopping List',
      description: 'Manage your shopping lists',
      icon: 'shopping_list',
      route: '/client/shopping-lists',
      color: 'accent'
    },
    {
      title: 'Inventory',
      description: 'Check inventory levels',
      icon: 'warehouse',
      route: '/client/inventory',
      color: 'warning'
    }
  ];
  
  // Recent Orders
  recentOrders: RecentOrder[] = [
    {
      id: 'ORD-001',
      supplier: 'Fresh Foods Co.',
      total: 1250.50,
      status: 'delivered',
      date: '2024-01-15',
      items: 12
    },
    {
      id: 'ORD-002',
      supplier: 'Beverage Solutions',
      total: 890.25,
      status: 'shipped',
      date: '2024-01-14',
      items: 8
    },
    {
      id: 'ORD-003',
      supplier: 'Dairy Farm Co.',
      total: 450.75,
      status: 'processing',
      date: '2024-01-13',
      items: 5
    }
  ];
  
  // Top Suppliers
  topSuppliers: TopSupplier[] = [
    {
      name: 'Fresh Foods Co.',
      orders: 24,
      totalValue: 15600.50,
      rating: 4.8,
      lastOrder: '2024-01-15'
    },
    {
      name: 'Beverage Solutions',
      orders: 18,
      totalValue: 12400.25,
      rating: 4.6,
      lastOrder: '2024-01-14'
    },
    {
      name: 'Dairy Farm Co.',
      orders: 15,
      totalValue: 8900.75,
      rating: 4.9,
      lastOrder: '2024-01-13'
    }
  ];
  
  // Quick Stats for template
  quickStats = [
    {
      title: 'Total Orders',
      value: '156',
      icon: 'shopping_cart',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Suppliers',
      value: '12',
      icon: 'store',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Total Spent',
      value: '€45,600',
      icon: 'euro',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Pending Orders',
      value: '8',
      icon: 'schedule',
      change: '-3',
      changeType: 'negative'
    }
  ];

  // Recent Activity
  recentActivity = [
    {
      title: 'Order Placed',
      description: 'Order #ORD-001 placed with Fresh Foods Co.',
      time: '2 hours ago',
      type: 'order',
      status: 'completed'
    },
    {
      title: 'Supplier Added',
      description: 'Organic Farm Co. added to your supplier list',
      time: '4 hours ago',
      type: 'supplier',
      status: 'completed'
    },
    {
      title: 'Payment Processed',
      description: 'Payment of €1,250.50 processed successfully',
      time: '6 hours ago',
      type: 'payment',
      status: 'completed'
    }
  ];

  // Customer Data (for suppliers list)
  customerData = [
    {
      name: 'Fresh Foods Co.',
      orders: 24,
      total: 15600.50,
      status: 'active'
    },
    {
      name: 'Beverage Solutions',
      orders: 18,
      total: 12400.25,
      status: 'active'
    },
    {
      name: 'Dairy Farm Co.',
      orders: 15,
      total: 8900.75,
      status: 'active'
    }
  ];

  // Notifications
  notifications = [
    {
      id: '1',
      title: 'Order Delivered',
      message: 'Your order ORD-001 has been delivered successfully',
      type: 'success',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'New Supplier Available',
      message: 'Organic Farm Co. is now available in your area',
      type: 'info',
      time: '4 hours ago',
      read: false
    },
    {
      id: '3',
      title: 'Low Stock Alert',
      message: 'Milk inventory is running low',
      type: 'warning',
      time: '6 hours ago',
      read: true
    }
  ];
  
  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) {}
  
  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          console.log('[CLIENT-DASHBOARD] User loaded:', user);
        }
      });
  }
  
  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Simulate API calls
    setTimeout(() => {
      this.loadStats();
      this.loadChartData();
      this.isLoading = false;
    }, 1000);
  }
  
  private loadStats(): void {
    this.stats = {
      totalOrders: 156,
      activeSuppliers: 12,
      totalSpent: 45600.75,
      pendingOrders: 8,
      monthlyGrowth: 12.5,
      averageOrderValue: 292.31
    };
  }
  
  private loadChartData(): void {
    // Orders chart data (last 6 months)
    this.ordersChartData = [
      { label: 'Aug', value: 24, date: '2023-08-01' },
      { label: 'Sep', value: 28, date: '2023-09-01' },
      { label: 'Oct', value: 32, date: '2023-10-01' },
      { label: 'Nov', value: 29, date: '2023-11-01' },
      { label: 'Dec', value: 35, date: '2023-12-01' },
      { label: 'Jan', value: 31, date: '2024-01-01' }
    ];
    
    // Spending chart data (last 6 months)
    this.spendingChartData = [
      { label: 'Aug', value: 7200, date: '2023-08-01' },
      { label: 'Sep', value: 8400, date: '2023-09-01' },
      { label: 'Oct', value: 9600, date: '2023-10-01' },
      { label: 'Nov', value: 8700, date: '2023-11-01' },
      { label: 'Dec', value: 10500, date: '2023-12-01' },
      { label: 'Jan', value: 9200, date: '2024-01-01' }
    ];
    
    // Suppliers chart data (last 6 months)
    this.suppliersChartData = [
      { label: 'Aug', value: 8, date: '2023-08-01' },
      { label: 'Sep', value: 9, date: '2023-09-01' },
      { label: 'Oct', value: 11, date: '2023-10-01' },
      { label: 'Nov', value: 10, date: '2023-11-01' },
      { label: 'Dec', value: 12, date: '2023-12-01' },
      { label: 'Jan', value: 12, date: '2024-01-01' }
    ];
  }
  
  // Event Handlers
  onQuickActionClick(action: QuickAction): void {
    console.log('Quick action clicked:', action);
    // Navigation will be handled by router
  }
  
  onOrderClick(order: RecentOrder): void {
    console.log('Order clicked:', order);
    // Navigate to order details
  }
  
  onSupplierClick(supplier: TopSupplier): void {
    console.log('Supplier clicked:', supplier);
    // Navigate to supplier details
  }
  
  onNotificationClick(notification: any): void {
    console.log('Notification clicked:', notification);
    notification.read = true;
  }
  
  onRefreshData(): void {
    this.loadDashboardData();
  }
  
  // Utility Methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES');
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'delivered':
        return 'Entregado';
      case 'shipped':
        return 'Enviado';
      case 'processing':
        return 'Procesando';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  }
  
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'notifications';
    }
  }
  
  getNotificationClass(type: string): string {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'info':
        return 'notification-info';
      case 'warning':
        return 'notification-warning';
      case 'error':
        return 'notification-error';
      default:
        return 'notification-default';
    }
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getChangeClass(changeType: string): string {
    switch (changeType) {
      case 'positive':
        return 'change-positive';
      case 'negative':
        return 'change-negative';
      default:
        return 'change-neutral';
    }
  }
}