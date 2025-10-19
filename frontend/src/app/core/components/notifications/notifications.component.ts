import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

/**
 * Global notifications component that displays app notifications
 * Shows toast notifications and persistent notifications
 */
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  showDropdown = false;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {
    // Start auto-cleanup
    this.notificationService.startAutoCleanup();
  }

  ngOnDestroy(): void {
    // Component cleanup
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  removeNotification(notificationId: string): void {
    this.notificationService.removeNotification(notificationId);
  }

  clearAll(): void {
    this.notificationService.clearAll();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }

  toggleNotifications(): void {
    this.showDropdown = !this.showDropdown;
  }

  viewAllNotifications(): void {
    // Navigate to notifications page or show all notifications
    console.log('View all notifications');
  }
}
