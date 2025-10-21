import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../core/services/notification.service';

interface Order {
  id: string;
  orderNumber: string;
  supplier: string;
  supplierLogo: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  deliveryDate?: string;
  trackingNumber?: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  status: 'draft' | 'sent' | 'confirmed' | 'completed';
  totalAmount: number;
  items: OrderItem[];
  approvalRequired: boolean;
  approvedBy?: string;
  approvedDate?: string;
}

interface DamagedProduct {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  quantityDamaged: number;
  reason: string;
  reportedDate: string;
  status: 'reported' | 'investigating' | 'resolved';
  compensationAmount?: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  selectedTab = 'past-orders';
  searchQuery = '';
  statusFilter = 'all';
  dateRange = 'all';
  expandedOrders = new Set<string>();
  loading = false;

  // Order tabs configuration
  orderTabs = [
    { id: 'past-orders', name: 'Past Orders', icon: 'fas fa-history', count: 0 },
    { id: 'purchase-orders', name: 'Purchase Orders', icon: 'fas fa-file-invoice', count: 0 },
    { id: 'unfulfilled', name: 'Unfulfilled', icon: 'fas fa-exclamation-triangle', count: 0 },
    { id: 'damaged', name: 'Damaged Products', icon: 'fas fa-exclamation-circle', count: 0 }
  ];

  // Sample data
  pastOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      supplier: 'Fever Tree Beverages',
      supplierLogo: 'assets/images/suppliers/fever-tree.png',
      date: '2024-01-15',
      status: 'delivered',
      totalAmount: 2304.50,
      deliveryDate: '2024-01-18',
      trackingNumber: 'TRK123456789',
      items: [
        {
          id: '1',
          productName: 'Premium Indian Tonic Water',
          productImage: 'assets/images/products/tonic-water.png',
          quantity: 8,
          unitPrice: 28.8,
          totalPrice: 230.4,
          category: 'Beverages'
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      supplier: 'Luntgårdena Mejeri',
      supplierLogo: 'assets/images/suppliers/luntgarden.png',
      date: '2024-01-12',
      status: 'shipped',
      totalAmount: 720.00,
      deliveryDate: '2024-01-20',
      trackingNumber: 'TRK987654321',
      items: [
        {
          id: '2',
          productName: 'Organic Milk 330ml',
          productImage: 'assets/images/products/milk.png',
          quantity: 12,
          unitPrice: 6.0,
          totalPrice: 72.0,
          category: 'Dairy'
        }
      ]
    }
  ];

  purchaseOrders: PurchaseOrder[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      supplier: 'TT Beverage Supplier',
      date: '2024-01-20',
      status: 'sent',
      totalAmount: 2040.00,
      approvalRequired: false,
      items: [
        {
          id: '1',
          productName: 'Non-Alcoholic Origin',
          productImage: 'assets/images/products/non-alcoholic.png',
          quantity: 24,
          unitPrice: 8.5,
          totalPrice: 204.0,
          category: 'Beverages'
        }
      ]
    }
  ];

  unfulfilledOrders: Order[] = [
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      supplier: 'General Snus Supplier',
      supplierLogo: 'assets/images/suppliers/general.png',
      date: '2024-01-18',
      status: 'pending',
      totalAmount: 3600.00,
      items: [
        {
          id: '3',
          productName: 'Fuzn Slim All White',
          productImage: 'assets/images/products/snus.png',
          quantity: 240,
          unitPrice: 15.0,
          totalPrice: 3600.0,
          category: 'Tobacco'
        }
      ]
    }
  ];

  damagedProducts: DamagedProduct[] = [
    {
      id: '1',
      orderId: 'ORD-2024-001',
      productName: 'Premium Indian Tonic Water',
      productImage: 'assets/images/products/tonic-water.png',
      quantityDamaged: 2,
      reason: 'Broken bottles during transport',
      reportedDate: '2024-01-19',
      status: 'investigating',
      compensationAmount: 57.6
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Check for filter query parameter
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['filter']) {
        // Map filter param to tab
        if (params['filter'] === 'past') {
          this.selectedTab = 'past-orders';
        } else if (params['filter'] === 'incoming') {
          this.selectedTab = 'purchase-orders';
        }
      }
    });

    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onTabSelect(tab: string): void {
    this.selectedTab = tab;
  }

  onSearch(): void {
    // Implement search functionality
  }

  onStatusFilter(status: string): void {
    this.statusFilter = status;
    this.filterOrders();
  }

  onDateRangeChange(range: string): void {
    this.dateRange = range;
    this.filterOrders();
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled',
      'draft': 'status-draft',
      'sent': 'status-sent',
      'completed': 'status-completed',
      'reported': 'status-reported',
      'investigating': 'status-investigating',
      'resolved': 'status-resolved'
    };
    return statusClasses[status] || 'status-default';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'draft': 'Draft',
      'sent': 'Sent',
      'completed': 'Completed',
      'reported': 'Reported',
      'investigating': 'Investigating',
      'resolved': 'Resolved'
    };
    return statusTexts[status] || status;
  }

  trackOrder(order: Order): void {
    if (order.trackingNumber) {
      // Open tracking page or modal
      console.log('Tracking order:', order.trackingNumber);
    }
  }

  viewOrderDetails(order: Order): void {
    // Navigate to order details
    console.log('View order details:', order.id);
  }

  cancelOrder(order: Order): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      order.status = 'cancelled';
      console.log('Order cancelled:', order.id);
    }
  }

  approvePurchaseOrder(po: PurchaseOrder): void {
    if (confirm('Approve this purchase order?')) {
      po.status = 'confirmed';
      po.approvedBy = 'Current User';
      po.approvedDate = new Date().toISOString();
      console.log('Purchase order approved:', po.id);
    }
  }

  reportDamagedProduct(order: Order): void {
    // Open damaged product reporting modal
    console.log('Report damaged product for order:', order.id);
  }

  resolveDamagedProduct(damaged: DamagedProduct): void {
    if (confirm('Mark this damaged product as resolved?')) {
      damaged.status = 'resolved';
      console.log('Damaged product resolved:', damaged.id);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getTotalOrders(): number {
    return this.pastOrders.length + this.purchaseOrders.length + this.unfulfilledOrders.length;
  }

  getOrdersByStatus(status: string): Order[] {
    const allOrders = [...this.pastOrders, ...this.unfulfilledOrders];
    return allOrders.filter(order => order.status === status);
  }

  isOrderExpanded(orderId: string): boolean {
    return this.expandedOrders.has(orderId);
  }

  toggleOrderItems(orderId: string): void {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
    }
  }

  createNewOrder(): void {
    console.log('Creating new order');
    // Implement new order creation
  }

  exportOrders(): void {
    console.log('Exporting orders');
    // Implement order export
  }

  refreshOrders(): void {
    console.log('Refreshing orders');
    this.loadOrders();
  }

  createPurchaseOrder(): void {
    console.log('Creating new purchase order');
    // Implement purchase order creation
  }

  viewPODetails(po: PurchaseOrder): void {
    console.log('Viewing PO details:', po.id);
    // Implement PO details view
  }

  editPurchaseOrder(po: PurchaseOrder): void {
    console.log('Editing purchase order:', po.id);
    // Implement PO editing
  }

  escalateUnfulfilledOrders(): void {
    console.log('Escalating all unfulfilled orders');
    // Implement escalation logic
  }

  escalateOrder(order: Order): void {
    console.log('Escalating order:', order.id);
    // Implement order escalation
  }


  viewDamagedDetails(damaged: DamagedProduct): void {
    console.log('Viewing damaged product details:', damaged.id);
    // Implement damaged product details view
  }

  repeatOrder(order: Order): void {
    console.log('Repeating order:', order.id);
    // Implement order repetition
  }

  private loadOrders(): void {
    this.loading = true;
    
    this.orderService.getAll()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          const orders = Array.isArray(response) ? response : (response.data || []);
          
          // Map orders to different categories
          this.pastOrders = orders
            .filter((order: any) => order.status === 'delivered' || order.status === 'completed')
            .map((order: any) => this.mapOrder(order));
            
          this.purchaseOrders = orders
            .filter((order: any) => order.isPurchaseOrder)
            .map((order: any) => this.mapOrder(order));
            
          this.unfulfilledOrders = orders
            .filter((order: any) => order.status === 'delayed' || order.status === 'unfulfilled')
            .map((order: any) => this.mapOrder(order));
          
          this.updateTabCounts();
          this.filterOrders();
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.notificationService.error('Error loading orders');
        }
      });
  }
  
  private mapOrder(order: any): any {
    return {
      id: order.id,
      orderNumber: order.orderNumber || order.id,
      supplier: order.supplier?.name || order.supplierName || '',
      supplierId: order.supplier?.id || order.supplierId || '',
      date: order.createdAt || order.orderDate,
      deliveryDate: order.deliveryDate || order.estimatedDelivery,
      status: order.status,
      total: order.total || order.totalAmount,
      items: order.items || [],
      itemsCount: order.items?.length || order.itemsCount || 0,
      isPurchaseOrder: order.isPurchaseOrder || false,
      notes: order.notes || ''
    };
  }

  private filterOrders(): void {
    // Implement filtering logic
  }

  private updateTabCounts(): void {
    this.orderTabs[0].count = this.pastOrders.length;
    this.orderTabs[1].count = this.purchaseOrders.length;
    this.orderTabs[2].count = this.unfulfilledOrders.length;
    this.orderTabs[3].count = this.damagedProducts.length;
  }
}
