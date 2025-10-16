import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  notes?: string;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

@Component({
  selector: 'app-provider-orders',
  template: `
    <div class="provider-orders-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>
            <i class="fas fa-shopping-cart"></i>
            Order Management
          </h1>
          <p>Manage incoming orders from your customers</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="refreshOrders()">
            <i class="fas fa-sync-alt"></i>
            Refresh
          </button>
          <button class="btn btn-secondary" (click)="exportOrders()">
            <i class="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of statsCards" [ngClass]="'stat-' + stat.type">
          <div class="stat-icon">
            <i [class]="stat.icon"></i>
          </div>
          <div class="stat-content">
            <h3>{{stat.value}}</h3>
            <p>{{stat.label}}</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-bar">
          <input type="text" [(ngModel)]="searchTerm" (input)="filterOrders()" 
                 placeholder="Search orders..." class="form-control">
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-options">
          <select [(ngModel)]="selectedStatus" (change)="filterOrders()" class="form-control">
            <option value="">All Status</option>
            <option *ngFor="let status of orderStatuses" [value]="status.value">
              {{status.label}}
            </option>
          </select>
          <select [(ngModel)]="selectedPriority" (change)="filterOrders()" class="form-control">
            <option value="">All Priority</option>
            <option *ngFor="let priority of orderPriorities" [value]="priority.value">
              {{priority.label}}
            </option>
          </select>
          <input type="date" [(ngModel)]="selectedDate" (change)="filterOrders()" class="form-control">
        </div>
      </div>

      <!-- Orders Table -->
      <div class="orders-table-container">
        <div class="table-header">
          <h3>Orders ({{filteredOrders.length}})</h3>
          <div class="view-options">
            <button class="view-btn" [class.active]="viewMode === 'table'" (click)="setViewMode('table')">
              <i class="fas fa-table"></i>
            </button>
            <button class="view-btn" [class.active]="viewMode === 'cards'" (click)="setViewMode('cards')">
              <i class="fas fa-th-large"></i>
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div *ngIf="viewMode === 'table'" class="table-view">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of filteredOrders; trackBy: trackByOrderId" class="order-row">
                <td class="order-number">
                  <span class="order-id">{{order.orderNumber}}</span>
                  <span class="order-date">{{formatDate(order.orderDate)}}</span>
                </td>
                <td class="customer-info">
                  <div class="customer-details">
                    <h4>{{order.customerName}}</h4>
                    <p>{{order.customerEmail}}</p>
                  </div>
                </td>
                <td class="order-date-cell">
                  <span class="date">{{formatDate(order.orderDate)}}</span>
                  <span class="time">{{formatTime(order.orderDate)}}</span>
                </td>
                <td class="items-info">
                  <div class="items-count">{{order.items.length}} items</div>
                  <div class="items-preview">
                    <span *ngFor="let item of order.items.slice(0, 2)" class="item-name">
                      {{item.productName}}
                    </span>
                    <span *ngIf="order.items.length > 2" class="more-items">
                      +{{order.items.length - 2}} more
                    </span>
                  </div>
                </td>
                <td class="total-amount">
                  <span class="amount">€{{order.totalAmount}}</span>
                  <span class="payment-status" [ngClass]="'payment-' + order.paymentStatus">
                    {{getPaymentStatusText(order.paymentStatus)}}
                  </span>
                </td>
                <td class="order-status">
                  <span class="status-badge" [ngClass]="'status-' + order.status">
                    {{getStatusText(order.status)}}
                  </span>
                </td>
                <td class="order-priority">
                  <span class="priority-badge" [ngClass]="'priority-' + order.priority">
                    {{getPriorityText(order.priority)}}
                  </span>
                </td>
                <td class="order-actions">
                  <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" (click)="viewOrder(order.id)" title="View Details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" (click)="updateOrderStatus(order.id)" title="Update Status">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" (click)="printOrder(order.id)" title="Print Order">
                      <i class="fas fa-print"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards View -->
        <div *ngIf="viewMode === 'cards'" class="cards-view">
          <div class="orders-grid">
            <div *ngFor="let order of filteredOrders; trackBy: trackByOrderId" class="order-card">
              <div class="card-header">
                <div class="order-info">
                  <h3>{{order.orderNumber}}</h3>
                  <span class="order-date">{{formatDate(order.orderDate)}}</span>
                </div>
                <div class="order-badges">
                  <span class="status-badge" [ngClass]="'status-' + order.status">
                    {{getStatusText(order.status)}}
                  </span>
                  <span class="priority-badge" [ngClass]="'priority-' + order.priority">
                    {{getPriorityText(order.priority)}}
                  </span>
                </div>
              </div>

              <div class="card-content">
                <div class="customer-section">
                  <h4>{{order.customerName}}</h4>
                  <p>{{order.customerEmail}}</p>
                </div>

                <div class="items-section">
                  <h5>Items ({{order.items.length}}):</h5>
                  <div class="items-list">
                    <div *ngFor="let item of order.items.slice(0, 3)" class="item-row">
                      <span class="item-name">{{item.productName}}</span>
                      <span class="item-qty">x{{item.quantity}}</span>
                      <span class="item-price">€{{item.totalPrice}}</span>
                    </div>
                    <div *ngIf="order.items.length > 3" class="more-items">
                      +{{order.items.length - 3}} more items
                    </div>
                  </div>
                </div>

                <div class="order-summary">
                  <div class="summary-row">
                    <span>Total Amount:</span>
                    <span class="total-amount">€{{order.totalAmount}}</span>
                  </div>
                  <div class="summary-row">
                    <span>Payment Status:</span>
                    <span class="payment-status" [ngClass]="'payment-' + order.paymentStatus">
                      {{getPaymentStatusText(order.paymentStatus)}}
                    </span>
                  </div>
                  <div class="summary-row" *ngIf="order.deliveryDate">
                    <span>Delivery Date:</span>
                    <span>{{formatDate(order.deliveryDate)}}</span>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <div class="action-buttons">
                  <button class="btn btn-sm btn-primary" (click)="viewOrder(order.id)">
                    View Details
                  </button>
                  <button class="btn btn-sm btn-secondary" (click)="updateOrderStatus(order.id)">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredOrders.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <h3>No orders found</h3>
          <p>No orders match your current filters.</p>
          <button class="btn btn-primary" (click)="clearFilters()">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./orders.component.scss']
})
export class ProviderOrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderStats: OrderStats = {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  };

  // Filters
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedPriority: string = '';
  selectedDate: string = '';
  viewMode: 'table' | 'cards' = 'table';

  // Options
  orderStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  orderPriorities = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  statsCards = [
    { type: 'total', icon: 'fas fa-shopping-cart', label: 'Total Orders', value: '0' },
    { type: 'pending', icon: 'fas fa-clock', label: 'Pending', value: '0' },
    { type: 'revenue', icon: 'fas fa-euro-sign', label: 'Revenue', value: '€0' },
    { type: 'average', icon: 'fas fa-chart-line', label: 'Avg Order', value: '€0' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadOrders();
    this.calculateStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOrders(): void {
    // Mock data - replace with actual API call
    this.orders = [
      {
        id: 'order-1',
        orderNumber: 'ORD-2024-001',
        customerId: 'customer-1',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        orderDate: '2024-05-22T10:30:00Z',
        deliveryDate: '2024-05-24',
        status: 'pending',
        totalAmount: 1250,
        items: [
          {
            id: 'item-1',
            productId: 'prod-1',
            productName: 'Minimjölk 0,1%',
            quantity: 2,
            unitPrice: 10,
            totalPrice: 20,
            productImage: '/assets/images/products/minimjolk.jpg'
          },
          {
            id: 'item-2',
            productId: 'prod-2',
            productName: 'Getmjölk 1 L',
            quantity: 1,
            unitPrice: 600,
            totalPrice: 600,
            productImage: '/assets/images/products/getmjolk.jpg'
          }
        ],
        notes: 'Please deliver before 10 AM',
        deliveryAddress: '123 Main Street, Stockholm',
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        priority: 'normal'
      },
      {
        id: 'order-2',
        orderNumber: 'ORD-2024-002',
        customerId: 'customer-2',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        orderDate: '2024-05-21T14:15:00Z',
        deliveryDate: '2024-05-23',
        status: 'confirmed',
        totalAmount: 890,
        items: [
          {
            id: 'item-3',
            productId: 'prod-3',
            productName: 'Lättmjölk 1L HV 80 st',
            quantity: 1,
            unitPrice: 25,
            totalPrice: 25,
            productImage: '/assets/images/products/lattmjolk.jpg'
          }
        ],
        deliveryAddress: '456 Oak Avenue, Gothenburg',
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'pending',
        priority: 'high'
      }
    ];

    this.filteredOrders = [...this.orders];
  }

  private calculateStats(): void {
    this.orderStats.totalOrders = this.orders.length;
    this.orderStats.pendingOrders = this.orders.filter(o => o.status === 'pending').length;
    this.orderStats.confirmedOrders = this.orders.filter(o => o.status === 'confirmed').length;
    this.orderStats.shippedOrders = this.orders.filter(o => o.status === 'shipped').length;
    this.orderStats.deliveredOrders = this.orders.filter(o => o.status === 'delivered').length;
    this.orderStats.cancelledOrders = this.orders.filter(o => o.status === 'cancelled').length;
    this.orderStats.totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    this.orderStats.averageOrderValue = this.orderStats.totalOrders > 0 ? 
      this.orderStats.totalRevenue / this.orderStats.totalOrders : 0;

    // Update stats cards
    this.statsCards[0].value = this.orderStats.totalOrders.toString();
    this.statsCards[1].value = this.orderStats.pendingOrders.toString();
    this.statsCards[2].value = `€${this.orderStats.totalRevenue}`;
    this.statsCards[3].value = `€${this.orderStats.averageOrderValue.toFixed(2)}`;
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || order.status === this.selectedStatus;
      const matchesPriority = !this.selectedPriority || order.priority === this.selectedPriority;
      
      const matchesDate = !this.selectedDate || 
        order.orderDate.startsWith(this.selectedDate);

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.selectedDate = '';
    this.filteredOrders = [...this.orders];
  }

  setViewMode(mode: 'table' | 'cards'): void {
    this.viewMode = mode;
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  refreshOrders(): void {
    this.loadOrders();
    this.calculateStats();
    this.filterOrders();
  }

  exportOrders(): void {
    console.log('Exporting orders...');
    // Implement export functionality
  }

  viewOrder(orderId: string): void {
    console.log('Viewing order:', orderId);
    // Navigate to order details or open modal
  }

  updateOrderStatus(orderId: string): void {
    console.log('Updating order status:', orderId);
    // Open status update modal
  }

  printOrder(orderId: string): void {
    console.log('Printing order:', orderId);
    // Implement print functionality
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusText(status: string): string {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'preparing': 'Preparing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  getPriorityText(priority: string): string {
    const priorityMap = {
      'low': 'Low',
      'normal': 'Normal',
      'high': 'High',
      'urgent': 'Urgent'
    };
    return priorityMap[priority] || priority;
  }

  getPaymentStatusText(status: string): string {
    const statusMap = {
      'pending': 'Pending',
      'paid': 'Paid',
      'failed': 'Failed',
      'refunded': 'Refunded'
    };
    return statusMap[status] || status;
  }
}
