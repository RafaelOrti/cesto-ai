import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  selectedFilter = 'all';
  isLoading = false;
  
  filters = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'info', label: 'Info' }
  ];

  constructor(
    public i18n: I18nService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNotifications(): void {
    this.isLoading = true;
    
    // Simulate loading notifications
    setTimeout(() => {
      this.notifications = [
        {
          id: '1',
          title: 'New Order Received',
          message: 'You have received a new order from Fresh Foods Co.',
          type: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          actionUrl: '/client/orders',
          actionLabel: 'View Order'
        },
        {
          id: '2',
          title: 'Low Stock Alert',
          message: 'Product "Organic Tomatoes" is running low on stock.',
          type: 'warning',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          actionUrl: '/client/inventory',
          actionLabel: 'Check Inventory'
        },
        {
          id: '3',
          title: 'Supplier Update',
          message: 'Beverage Solutions has updated their product catalog.',
          type: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          read: true,
          actionUrl: '/client/suppliers',
          actionLabel: 'View Catalog'
        },
        {
          id: '4',
          title: 'Payment Failed',
          message: 'Payment for order #12345 could not be processed.',
          type: 'error',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          read: true,
          actionUrl: '/client/transactions',
          actionLabel: 'Retry Payment'
        },
        {
          id: '5',
          title: 'Weekly Report Ready',
          message: 'Your weekly analytics report is now available.',
          type: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          actionUrl: '/client/analysis',
          actionLabel: 'View Report'
        }
      ];
      
      this.filterNotifications();
      this.isLoading = false;
    }, 1000);
  }

  filterNotifications(): void {
    if (this.selectedFilter === 'all') {
      this.filteredNotifications = [...this.notifications];
    } else if (this.selectedFilter === 'unread') {
      this.filteredNotifications = this.notifications.filter(n => !n.read);
    } else {
      this.filteredNotifications = this.notifications.filter(n => n.type === this.selectedFilter);
    }
  }

  onFilterChange(): void {
    this.filterNotifications();
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    this.filterNotifications();
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.filterNotifications();
  }

  deleteNotification(notification: Notification): void {
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.filterNotifications();
    }
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.filteredNotifications = [];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  }
}
