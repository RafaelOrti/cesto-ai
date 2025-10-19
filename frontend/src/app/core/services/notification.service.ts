import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationOptions {
  duration?: number;
  position?: 'top' | 'bottom';
  type?: 'success' | 'error' | 'warning' | 'info';
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  public unreadCount$: Observable<number> = this.unreadCountSubject.asObservable();

  constructor() { }

  success(message: string, options?: NotificationOptions): void {
    console.log('Success:', message);
    // Implementation for success notifications
  }

  error(message: string, options?: NotificationOptions): void {
    console.log('Error:', message);
    // Implementation for error notifications
  }

  warning(message: string, options?: NotificationOptions): void {
    console.log('Warning:', message);
    // Implementation for warning notifications
  }

  info(message: string, options?: NotificationOptions): void {
    console.log('Info:', message);
    // Implementation for info notifications
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', options?: NotificationOptions): void {
    switch (type) {
      case 'success':
        this.success(message, options);
        break;
      case 'error':
        this.error(message, options);
        break;
      case 'warning':
        this.warning(message, options);
        break;
      case 'info':
        this.info(message, options);
        break;
    }
  }

  startAutoCleanup(): void {
    // Auto-cleanup implementation
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notificationsSubject.next([...notifications]);
      this.updateUnreadCount();
    }
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value;
    notifications.forEach(n => n.read = true);
    this.notificationsSubject.next([...notifications]);
    this.updateUnreadCount();
  }

  removeNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const filtered = notifications.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(filtered);
    this.updateUnreadCount();
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }
}