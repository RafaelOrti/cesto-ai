import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  notes?: string;
  deliveryAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

@Component({
  selector: 'app-order-history',
  template: `
    <div class="order-history-modal" *ngIf="isVisible" (click)="onBackdropClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Order History - {{supplierName}}</h2>
          <button class="close-btn" (click)="close()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="orders-list" *ngIf="orders.length > 0; else noOrders">
            <div *ngFor="let order of orders" class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <h3>Order #{{order.orderNumber}}</h3>
                  <span class="order-date">{{formatDate(order.orderDate)}}</span>
                </div>
                <div class="order-status">
                  <span class="status-badge" [ngClass]="'status-' + order.status">
                    {{getStatusText(order.status)}}
                  </span>
                </div>
              </div>
              
              <div class="order-details">
                <div class="order-items">
                  <h4>Items Ordered:</h4>
                  <div class="items-list">
                    <div *ngFor="let item of order.items" class="item-row">
                      <div class="item-image" *ngIf="item.productImage">
                        <img [src]="item.productImage" [alt]="item.productName">
                      </div>
                      <div class="item-info">
                        <span class="item-name">{{item.productName}}</span>
                        <span class="item-quantity">Qty: {{item.quantity}}</span>
                      </div>
                      <div class="item-price">
                        <span class="unit-price">€{{item.unitPrice}}/unit</span>
                        <span class="total-price">€{{item.totalPrice}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="order-summary">
                  <div class="summary-row">
                    <span>Total Amount:</span>
                    <span class="total-amount">€{{order.totalAmount}}</span>
                  </div>
                  <div class="summary-row" *ngIf="order.deliveryDate">
                    <span>Delivery Date:</span>
                    <span>{{formatDate(order.deliveryDate)}}</span>
                  </div>
                  <div class="summary-row" *ngIf="order.trackingNumber">
                    <span>Tracking Number:</span>
                    <span class="tracking-number">{{order.trackingNumber}}</span>
                  </div>
                  <div class="summary-row" *ngIf="order.notes">
                    <span>Notes:</span>
                    <span>{{order.notes}}</span>
                  </div>
                </div>
              </div>
              
              <div class="order-actions">
                <button class="btn btn-sm btn-primary" (click)="reorder(order.id)">
                  <i class="fas fa-redo"></i>
                  Reorder
                </button>
                <button class="btn btn-sm btn-secondary" (click)="viewOrderDetails(order.id)">
                  <i class="fas fa-eye"></i>
                  View Details
                </button>
                <button class="btn btn-sm btn-outline" (click)="downloadInvoice(order.id)">
                  <i class="fas fa-download"></i>
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
          
          <ng-template #noOrders>
            <div class="no-orders">
              <i class="fas fa-shopping-cart"></i>
              <h3>No orders found</h3>
              <p>You haven't placed any orders with this supplier yet.</p>
            </div>
          </ng-template>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="close()">Close</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() supplierId: string = '';
  @Input() supplierName: string = '';
  @Input() orders: Order[] = [];
  
  @Output() closeEvent = new EventEmitter<void>();
  @Output() reorderEvent = new EventEmitter<string>();
  @Output() viewDetailsEvent = new EventEmitter<string>();
  @Output() downloadInvoiceEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    if (this.isVisible) {
      this.loadOrderHistory();
    }
  }

  ngOnChanges(): void {
    if (this.isVisible && this.supplierId) {
      this.loadOrderHistory();
    }
  }

  private loadOrderHistory(): void {
    // Mock data - replace with actual API call
    this.orders = [
      {
        id: 'order-1',
        orderNumber: 'ORD-2024-001',
        supplierId: this.supplierId,
        supplierName: this.supplierName,
        orderDate: '2024-05-22',
        deliveryDate: '2024-05-24',
        status: 'delivered',
        totalAmount: 1250,
        items: [
          {
            id: 'item-1',
            productName: 'Delibricka Premium',
            quantity: 2,
            unitPrice: 450,
            totalPrice: 900,
            productImage: '/assets/images/products/delibricka.jpg'
          },
          {
            id: 'item-2',
            productName: 'Ost Mix',
            quantity: 1,
            unitPrice: 350,
            totalPrice: 350,
            productImage: '/assets/images/products/ost-mix.jpg'
          }
        ],
        notes: 'Please deliver before 10 AM',
        deliveryAddress: '123 Main Street, Stockholm',
        paymentMethod: 'Credit Card',
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'order-2',
        orderNumber: 'ORD-2024-002',
        supplierId: this.supplierId,
        supplierName: this.supplierName,
        orderDate: '2024-05-15',
        deliveryDate: '2024-05-17',
        status: 'delivered',
        totalAmount: 890,
        items: [
          {
            id: 'item-3',
            productName: 'Charcuterie Board',
            quantity: 1,
            unitPrice: 650,
            totalPrice: 650,
            productImage: '/assets/images/products/charcuterie.jpg'
          },
          {
            id: 'item-4',
            productName: 'Wine Selection',
            quantity: 1,
            unitPrice: 240,
            totalPrice: 240,
            productImage: '/assets/images/products/wine.jpg'
          }
        ],
        deliveryAddress: '123 Main Street, Stockholm',
        paymentMethod: 'Bank Transfer'
      }
    ];
  }

  close(): void {
    this.closeEvent.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  reorder(orderId: string): void {
    this.reorderEvent.emit(orderId);
  }

  viewOrderDetails(orderId: string): void {
    this.viewDetailsEvent.emit(orderId);
  }

  downloadInvoice(orderId: string): void {
    this.downloadInvoiceEvent.emit(orderId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusText(status: string): string {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }
}
