import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ChartConfiguration } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SupplierService } from '../../services/supplier.service';
import { OrderService } from '../../services/order.service';
import { ClientDashboardService, DashboardStats, DashboardChartData, RecentActivity, DashboardNotification } from '../../services/client-dashboard.service';
import { DashboardService } from '../../services/dashboard.service';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import * as XLSX from 'xlsx';

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

interface FilterOption {
  id: string;
  label: string;
  type: 'delivered' | 'deliveryDate' | 'supplier' | 'product' | 'custom';
  value?: any;
}

interface InsightRow {
  store: string;
  sales: number;
  orders: number;
  avgOrder: number;
  frequency: number;
  icon?: string;
  color?: string;
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
  isGenerating = false;
  
  // Selected metric for filters toggle group
  metricSelected: 'sales' | 'orders' | 'deliveries' | 'deliveryDate' = 'sales';
  
  // Filters
  activeFilters: FilterOption[] = [];
  availableFilterTypes = [
    { value: 'delivered', label: 'Delivered' },
    { value: 'deliveryDate', label: 'Delivery Date' },
    { value: 'supplier', label: 'Supplier' },
    { value: 'product', label: 'Product' }
  ];
  
  // Date range
  dateRangeStart: Date = new Date(new Date().setMonth(new Date().getMonth() - 12));
  dateRangeEnd: Date = new Date();
  dateRangeText = '';
  
  // Comparison
  showComparison = false;
  comparisonDateRangeStart?: Date;
  comparisonDateRangeEnd?: Date;
  
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
  recentActivity: RecentActivity[] = [];

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

  // Table data for Buyer Insights
  displayedColumns: string[] = ['store', 'sales', 'orders', 'avgOrder', 'frequency'];
  dataSource = new MatTableDataSource<InsightRow>([]);
  totalStores = 0;
  totalSales = 0;
  totalOrders = 0;
  
  // Chart configuration
  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2E7D32',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: { 
      x: { 
        display: true,
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: { 
        display: true,
        grid: { color: 'rgba(0,0,0,0.06)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Notifications
  notifications: DashboardNotification[] = [];
  
  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private supplierService: SupplierService,
    private orderService: OrderService,
    private clientDashboardService: ClientDashboardService,
    private dashboardService: DashboardService,
    public i18n: I18nService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    console.log('[CLIENT-DASHBOARD] Component initialized');
    this.loadUserData();
    this.loadDashboardData();
    this.fetchAnalytics();
    this.updateDateRangeText();
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
    
    this.clientDashboardService.getDashboardData()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          this.loadStatsFromService(data.stats);
          this.loadChartDataFromService(data.chartData);
          this.loadRecentActivityFromService(data.recentActivity);
          this.loadNotificationsFromService(data.notifications);
          this.quickActions = data.quickActions;
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.notificationService.error('Error loading dashboard data');
          // Load default data on error
          this.loadDefaultData();
        }
      });
  }
  
  private loadStatsFromService(dashboardStats: DashboardStats): void {
    this.stats = {
      totalOrders: dashboardStats.totalOrders,
      activeSuppliers: dashboardStats.activeSuppliers,
      totalSpent: dashboardStats.totalSpent,
      pendingOrders: dashboardStats.pendingOrders,
      monthlyGrowth: dashboardStats.monthlyGrowth,
      averageOrderValue: dashboardStats.averageOrderValue
    };
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
  
  private loadChartDataFromService(chartData: DashboardChartData): void {
    this.ordersChartData = chartData.orders;
    this.spendingChartData = chartData.spending;
    this.suppliersChartData = chartData.suppliers;
    
    // Update Chart.js data based on selected metric
    this.updateChartData();
  }

  private updateChartData(): void {
    let selectedData: ChartDataPoint[] = [];
    
    switch (this.metricSelected) {
      case 'sales':
        selectedData = this.spendingChartData;
        break;
      case 'orders':
        selectedData = this.ordersChartData;
        break;
      case 'deliveries':
        selectedData = this.ordersChartData; // Use orders as proxy for deliveries
        break;
      case 'deliveryDate':
        selectedData = this.ordersChartData; // Use orders as proxy for delivery dates
        break;
      default:
        selectedData = this.ordersChartData;
    }

    this.chartData = {
      labels: selectedData.map(d => d.label),
      datasets: [
        { 
          label: this.metricSelected, 
          data: selectedData.map(d => d.value), 
          borderColor: '#2E7D32', 
          backgroundColor: 'rgba(46,125,50,0.2)', 
          pointBorderColor: '#2E7D32', 
          pointBackgroundColor: '#fff', 
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true
        }
      ]
    };
  }

  private loadRecentActivityFromService(activity: RecentActivity[]): void {
    this.recentActivity = activity;
  }

  private loadNotificationsFromService(notifications: DashboardNotification[]): void {
    this.notifications = notifications;
  }

  private loadDefaultData(): void {
    this.loadStats();
    this.loadChartData();
    this.updateChartData();
    this.recentActivity = [];
    this.notifications = [];
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

  private fetchAnalytics(): void {
    const filters = {
      selectedFilter: this.metricSelected,
      dateRange: { 
        from: this.dateRangeStart.toISOString().split('T')[0], 
        to: this.dateRangeEnd.toISOString().split('T')[0] 
      },
      additionalFilters: this.activeFilters.map(f => f.type)
    } as any;

    this.clientDashboardService.getBuyerInsightsData(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          // Chart.js dataset
          this.chartData = {
            labels: res.chartData.map(d => d.month),
            datasets: [
              { 
                label: this.metricSelected, 
                data: res.chartData.map(d => d.value), 
                borderColor: '#2E7D32', 
                backgroundColor: 'rgba(46,125,50,0.2)', 
                pointBorderColor: '#2E7D32', 
                pointBackgroundColor: '#fff', 
                pointRadius: 6, 
                borderWidth: 3, 
                fill: true, 
                tension: 0.4,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#2E7D32',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
              }
            ]
          };

          this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                display: true,
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 14,
                    weight: 500
                  }
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#2E7D32',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': €' + (context.parsed.y * 1000000).toLocaleString() + 'M';
                  }
                }
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            },
            scales: {
              x: {
                display: true,
                grid: { display: false },
                ticks: { 
                  color: '#64748b', 
                  font: { size: 12, weight: 500 },
                  padding: 8
                },
                title: {
                  display: true,
                  text: 'Months',
                  color: '#64748b',
                  font: { size: 14, weight: 600 }
                }
              },
              y: {
                display: true,
                grid: { 
                  color: 'rgba(0,0,0,0.06)'
                },
                ticks: { 
                  color: '#64748b', 
                  font: { size: 12, weight: 500 },
                  padding: 8,
                  callback: function(value) {
                    return '€' + value + 'M';
                  }
                },
                title: {
                  display: true,
                  text: 'Sales (Millions)',
                  color: '#64748b',
                  font: { size: 14, weight: 600 }
                }
              }
            }
          };

          // Table datasource
          const idToName = new Map<string, string>();
          this.supplierService.getMySuppliers().subscribe(sups => 
            sups.forEach(s => idToName.set((s as any).id || (s as any)._id || s.name, s.name))
          );
          const rows = res.customerData.map(c => ({
            store: idToName.get(c.name) || c.name,
            sales: c.sales,
            orders: c.orders,
            avgOrder: c.averageOrder,
            frequency: c.frequency,
            icon: this.getStoreIcon(c.name),
            color: this.getStoreColor(c.name)
          }));
          this.dataSource.data = rows;
          this.updateTableTotals();
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        },
        error: (error) => {
          console.error('Error fetching analytics:', error);
          this.notificationService.error('Error loading analytics data');
        }
      });
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
  
  onNotificationClick(notification: DashboardNotification): void {
    console.log('Notification clicked:', notification);
    if (!notification.read) {
      this.clientDashboardService.markNotificationAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            if (result.success) {
              notification.read = true;
            }
          },
          error: (error) => {
            console.error('Error marking notification as read:', error);
          }
        });
    }
  }
  
  onRefreshData(): void {
    this.isLoading = true;
    this.clientDashboardService.refreshDashboardData()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          this.loadStatsFromService(data.stats);
          this.loadChartDataFromService(data.chartData);
          this.loadRecentActivityFromService(data.recentActivity);
          this.loadNotificationsFromService(data.notifications);
          this.quickActions = data.quickActions;
          this.notificationService.success('Dashboard data refreshed successfully');
        },
        error: (error) => {
          console.error('Error refreshing dashboard data:', error);
          this.notificationService.error('Error refreshing dashboard data');
        }
      });
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

  // New methods for Buyer Insights Dashboard
  
  onMetricChange(metric: 'sales' | 'orders' | 'deliveries' | 'deliveryDate'): void {
    this.metricSelected = metric;
    this.updateChartData();
    console.log('[BUYER-INSIGHTS] Metric changed to:', metric);
  }

  addFilter(): void {
    const newFilter: FilterOption = {
      id: `filter-${Date.now()}`,
      label: this.i18n.translate('buyerInsights.chooseFilter'),
      type: 'custom'
    };
    this.activeFilters.push(newFilter);
  }

  removeFilter(filterId: string): void {
    this.activeFilters = this.activeFilters.filter(f => f.id !== filterId);
  }

  updateDateRangeText(): void {
    const start = this.formatDate(this.dateRangeStart.toISOString());
    const end = this.formatDate(this.dateRangeEnd.toISOString());
    this.dateRangeText = `${start} - ${end}`;
  }

  toggleComparison(): void {
    this.showComparison = !this.showComparison;
    if (this.showComparison && !this.comparisonDateRangeStart) {
      // Set default comparison period (previous year)
      this.comparisonDateRangeStart = new Date(this.dateRangeStart);
      this.comparisonDateRangeStart.setFullYear(this.comparisonDateRangeStart.getFullYear() - 1);
      this.comparisonDateRangeEnd = new Date(this.dateRangeEnd);
      this.comparisonDateRangeEnd.setFullYear(this.comparisonDateRangeEnd.getFullYear() - 1);
    }
  }

  generateInsights(): void {
    this.isGenerating = true;
    console.log('[BUYER-INSIGHTS] Generating insights with filters:', {
      metric: this.metricSelected,
      dateRange: { start: this.dateRangeStart, end: this.dateRangeEnd },
      filters: this.activeFilters,
      comparison: this.showComparison
    });

    // Use real backend data
    this.fetchAnalytics();
    this.isGenerating = false;
    this.notificationService.success(
      this.i18n.translate('buyerInsights.insightsGenerated')
    );
  }

  downloadExcelReport(): void {
    try {
      // Prepare data for Excel
      const exportData = this.dataSource.data.map(row => ({
        'Store': row.store,
        'Sales €': row.sales,
        'Orders': row.orders,
        'Average Order €': row.avgOrder,
        'Frequency': row.frequency
      }));

      // Add summary row
      exportData.push({
        'Store': `Total (${this.totalStores} stores)`,
        'Sales €': this.totalSales,
        'Orders': this.totalOrders,
        'Average Order €': this.totalSales / this.totalOrders || 0,
        'Frequency': 0
      });

      // Create workbook
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Buyer Insights');

      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `buyer-insights-${date}.xlsx`;

      // Download
      XLSX.writeFile(wb, filename);

      this.notificationService.success(
        this.i18n.translate('buyerInsights.reportDownloaded')
      );
    } catch (error) {
      console.error('Error downloading Excel report:', error);
      this.notificationService.error(
        this.i18n.translate('buyerInsights.reportDownloadError')
      );
    }
  }

  requestAIAnalysis(): void {
    // Placeholder for AI integration with Groq/AI Services
    this.notificationService.info(
      this.i18n.translate('buyerInsights.aiAnalysisRequested')
    );
    
    console.log('[BUYER-INSIGHTS] AI Analysis requested');
    // TODO: Integrate with AI services endpoint
    // this.analyticsService.requestAIInsights(this.dataSource.data).subscribe(...)
  }

  getStoreIcon(store: string): string {
    // Generate consistent icon based on store name
    const icons = ['store', 'local_grocery_store', 'shopping_basket', 'storefront', 'business'];
    const index = store.charCodeAt(0) % icons.length;
    return icons[index];
  }

  getStoreColor(store: string): string {
    // Generate consistent color based on store name
    const colors = ['#2E7D32', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'];
    const index = store.charCodeAt(0) % colors.length;
    return colors[index];
  }

  private updateTableTotals(): void {
    this.totalStores = this.dataSource.data.length;
    this.totalSales = this.dataSource.data.reduce((sum, row) => sum + row.sales, 0);
    this.totalOrders = this.dataSource.data.reduce((sum, row) => sum + row.orders, 0);
  }

  getTotalFrequency(): number {
    return this.dataSource.data.reduce((sum, row) => sum + row.frequency, 0);
  }

  getTotalAvgOrder(): number {
    return this.totalOrders > 0 ? this.totalSales / this.totalOrders : 0;
  }
}