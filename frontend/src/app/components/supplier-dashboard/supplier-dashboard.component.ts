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
  client: string;
  total: number;
  status: string;
  date: string;
  items: number;
  priority: string;
}

interface TopProduct {
  name: string;
  sku: string;
  sales: number;
  revenue: number;
  stock: number;
  rating: number;
}

interface InventoryAlert {
  product: string;
  sku: string;
  currentStock: number;
  minStock: number;
  status: 'low' | 'out' | 'overstock';
}

@Component({
  selector: 'app-supplier-dashboard',
  templateUrl: './supplier-dashboard.component.html',
  styleUrls: ['./supplier-dashboard.component.scss']
})
export class SupplierDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: any = null;
  isLoading = true;
  
  // Dashboard Statistics
  stats = {
    totalOrders: 0,
    activeClients: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    monthlyGrowth: 0,
    averageOrderValue: 0,
    totalProducts: 0,
    lowStockItems: 0
  };

  // Supplier Stats for template
  supplierStats = [
    {
      title: 'Total Pedidos',
      value: '89',
      icon: 'shopping_cart',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Clientes Activos',
      value: '15',
      icon: 'people',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Ingresos Totales',
      value: '€45,600',
      icon: 'euro',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Productos',
      value: '45',
      icon: 'inventory',
      change: '+3',
      changeType: 'positive'
    }
  ];

  // Performance Metrics
  performanceMetrics = {
    orderFulfillment: 94,
    customerSatisfaction: 4.6,
    onTimeDelivery: 92,
    productQuality: 4.8
  };
  
  // Chart Data
  ordersChartData: ChartDataPoint[] = [];
  revenueChartData: ChartDataPoint[] = [];
  productsChartData: ChartDataPoint[] = [];
  
  // Quick Actions
  quickActions: QuickAction[] = [
    {
      title: 'Gestionar Productos',
      description: 'Añadir y editar productos',
      icon: 'inventory',
      route: '/supplier/products',
      color: 'primary'
    },
    {
      title: 'Ver Pedidos',
      description: 'Gestionar pedidos entrantes',
      icon: 'shopping_cart',
      route: '/supplier/orders',
      color: 'secondary'
    },
    {
      title: 'Control de Inventario',
      description: 'Revisar niveles de stock',
      icon: 'warehouse',
      route: '/supplier/inventory',
      color: 'accent'
    },
    {
      title: 'Análisis de Ventas',
      description: 'Ver reportes y estadísticas',
      icon: 'analytics',
      route: '/supplier/analysis',
      color: 'warning'
    }
  ];
  
  // Recent Orders
  recentOrders: RecentOrder[] = [
    {
      id: 'ORD-001',
      client: 'Restaurante El Buen Sabor',
      total: 1250.50,
      status: 'pending',
      date: '2024-01-15',
      items: 12,
      priority: 'high'
    },
    {
      id: 'ORD-002',
      client: 'Café Central',
      total: 890.25,
      status: 'confirmed',
      date: '2024-01-14',
      items: 8,
      priority: 'medium'
    },
    {
      id: 'ORD-003',
      client: 'Bar La Esquina',
      total: 450.75,
      status: 'shipped',
      date: '2024-01-13',
      items: 5,
      priority: 'low'
    }
  ];
  
  // Top Products
  topProducts: TopProduct[] = [
    {
      name: 'Leche Orgánica 1L',
      sku: 'LEO-001',
      sales: 156,
      revenue: 7488.00,
      stock: 45,
      rating: 4.8
    },
    {
      name: 'Pan Integral',
      sku: 'PAN-002',
      sales: 98,
      revenue: 2940.00,
      stock: 23,
      rating: 4.6
    },
    {
      name: 'Huevos Frescos',
      sku: 'HUE-003',
      sales: 87,
      revenue: 5220.00,
      stock: 67,
      rating: 4.9
    }
  ];
  
  // Inventory Alerts
  inventoryAlerts: InventoryAlert[] = [
    {
      product: 'Leche Deslactosada',
      sku: 'LED-004',
      currentStock: 5,
      minStock: 20,
      status: 'low'
    },
    {
      product: 'Queso Manchego',
      sku: 'QUE-005',
      currentStock: 0,
      minStock: 10,
      status: 'out'
    },
    {
      product: 'Yogur Griego',
      sku: 'YOG-006',
      currentStock: 150,
      minStock: 30,
      status: 'overstock'
    }
  ];
  
  // Notifications
  notifications = [
    {
      id: '1',
      title: 'Nuevo Pedido Recibido',
      message: 'Restaurante El Buen Sabor ha realizado un pedido por €1,250.50',
      type: 'info',
      time: '1 hora',
      read: false
    },
    {
      id: '2',
      title: 'Producto Agotado',
      message: 'Queso Manchego (QUE-005) se ha agotado',
      type: 'warning',
      time: '3 horas',
      read: false
    },
    {
      id: '3',
      title: 'Pedido Enviado',
      message: 'El pedido ORD-003 ha sido enviado exitosamente',
      type: 'success',
      time: '5 horas',
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
          console.log('[SUPPLIER-DASHBOARD] User loaded:', user);
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
      totalOrders: 89,
      activeClients: 15,
      totalRevenue: 45600.75,
      pendingOrders: 12,
      monthlyGrowth: 18.5,
      averageOrderValue: 512.36,
      totalProducts: 45,
      lowStockItems: 3
    };
  }
  
  private loadChartData(): void {
    // Orders chart data (last 6 months)
    this.ordersChartData = [
      { label: 'Aug', value: 12, date: '2023-08-01' },
      { label: 'Sep', value: 15, date: '2023-09-01' },
      { label: 'Oct', value: 18, date: '2023-10-01' },
      { label: 'Nov', value: 16, date: '2023-11-01' },
      { label: 'Dec', value: 22, date: '2023-12-01' },
      { label: 'Jan', value: 19, date: '2024-01-01' }
    ];
    
    // Revenue chart data (last 6 months)
    this.revenueChartData = [
      { label: 'Aug', value: 7200, date: '2023-08-01' },
      { label: 'Sep', value: 9000, date: '2023-09-01' },
      { label: 'Oct', value: 10800, date: '2023-10-01' },
      { label: 'Nov', value: 9600, date: '2023-11-01' },
      { label: 'Dec', value: 13200, date: '2023-12-01' },
      { label: 'Jan', value: 11400, date: '2024-01-01' }
    ];
    
    // Products chart data (last 6 months)
    this.productsChartData = [
      { label: 'Aug', value: 35, date: '2023-08-01' },
      { label: 'Sep', value: 38, date: '2023-09-01' },
      { label: 'Oct', value: 42, date: '2023-10-01' },
      { label: 'Nov', value: 40, date: '2023-11-01' },
      { label: 'Dec', value: 45, date: '2023-12-01' },
      { label: 'Jan', value: 45, date: '2024-01-01' }
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
  
  onProductClick(product: TopProduct): void {
    console.log('Product clicked:', product);
    // Navigate to product details
  }
  
  onAlertClick(alert: InventoryAlert): void {
    console.log('Alert clicked:', alert);
    // Navigate to inventory management
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
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
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
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  }
  
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  }
  
  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Media';
    }
  }
  
  getAlertClass(status: string): string {
    switch (status) {
      case 'low':
        return 'alert-low';
      case 'out':
        return 'alert-out';
      case 'overstock':
        return 'alert-overstock';
      default:
        return 'alert-normal';
    }
  }
  
  getAlertLabel(status: string): string {
    switch (status) {
      case 'low':
        return 'Stock Bajo';
      case 'out':
        return 'Sin Stock';
      case 'overstock':
        return 'Exceso de Stock';
      default:
        return 'Normal';
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
        return 'positive';
      case 'negative':
        return 'negative';
      default:
        return 'neutral';
    }
  }
}