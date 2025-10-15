import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  route: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isBuyer = false;
  isSupplier = false;

  dashboardCards: DashboardCard[] = [];
  recentOrders: any[] = [];
  lowStockItems: any[] = [];
  upcomingDeliveries: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.isBuyer = user.role === 'buyer';
        this.isSupplier = user.role === 'supplier';
        this.setupDashboard();
        this.loadDashboardData();
      }
    });
  }

  private setupDashboard() {
    if (this.isBuyer) {
      this.dashboardCards = [
        {
          title: 'Active Suppliers',
          value: 12,
          icon: 'store',
          color: '#2E7D32',
          route: '/suppliers',
          trend: { value: 8.5, isPositive: true }
        },
        {
          title: 'Total Orders',
          value: 156,
          icon: 'shopping_cart',
          color: '#1976D2',
          route: '/orders',
          trend: { value: 12.3, isPositive: true }
        },
        {
          title: 'Products in Inventory',
          value: 2847,
          icon: 'warehouse',
          color: '#FF9800',
          route: '/inventory',
          trend: { value: 2.1, isPositive: true }
        },
        {
          title: 'Shopping List Items',
          value: 23,
          icon: 'shopping_list',
          color: '#9C27B0',
          route: '/shopping-list',
          trend: { value: 5.2, isPositive: false }
        }
      ];
    } else if (this.isSupplier) {
      this.dashboardCards = [
        {
          title: 'Active Buyers',
          value: 45,
          icon: 'group',
          color: '#2E7D32',
          route: '/buyers',
          trend: { value: 15.2, isPositive: true }
        },
        {
          title: 'Products Listed',
          value: 156,
          icon: 'inventory',
          color: '#1976D2',
          route: '/products',
          trend: { value: 8.7, isPositive: true }
        },
        {
          title: 'Pending Orders',
          value: 12,
          icon: 'shopping_cart',
          color: '#FF9800',
          route: '/orders',
          trend: { value: 3.1, isPositive: false }
        },
        {
          title: 'Revenue This Month',
          value: '€24,580',
          icon: 'euro',
          color: '#4CAF50',
          route: '/analytics',
          trend: { value: 18.5, isPositive: true }
        }
      ];
    }
  }

  private loadDashboardData() {
    // Mock data - in real app, this would come from API
    this.recentOrders = [
      {
        id: 'ORD-001',
        supplier: 'Luntgårdens Mejeri',
        total: '€450.00',
        status: 'delivered',
        date: '2024-01-15'
      },
      {
        id: 'ORD-002',
        supplier: 'Fresh Produce Co.',
        total: '€320.50',
        status: 'in_transit',
        date: '2024-01-14'
      },
      {
        id: 'ORD-003',
        supplier: 'Meat Suppliers Ltd',
        total: '€680.75',
        status: 'processing',
        date: '2024-01-13'
      }
    ];

    this.lowStockItems = [
      { name: 'Organic Milk 1L', currentStock: 8, minStock: 10, category: 'Dairy' },
      { name: 'Fresh Tomatoes', currentStock: 5, minStock: 15, category: 'Produce' },
      { name: 'Chicken Breast', currentStock: 3, minStock: 8, category: 'Meat' }
    ];

    this.upcomingDeliveries = [
      {
        supplier: 'Luntgårdens Mejeri',
        date: '2024-01-18',
        items: 12,
        status: 'confirmed'
      },
      {
        supplier: 'Fresh Produce Co.',
        date: '2024-01-19',
        items: 8,
        status: 'pending'
      }
    ];
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return '#4CAF50';
      case 'in_transit': return '#2196F3';
      case 'processing': return '#FF9800';
      case 'pending': return '#9E9E9E';
      case 'confirmed': return '#4CAF50';
      default: return '#9E9E9E';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'delivered': return 'check_circle';
      case 'in_transit': return 'local_shipping';
      case 'processing': return 'schedule';
      case 'pending': return 'pending';
      case 'confirmed': return 'verified';
      default: return 'help';
    }
  }
}
