import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from '../../../shared/types/common.types';

/**
 * Advanced notification service with multiple notification types and persistence
 * Provides toast notifications, modal dialogs, and in-app notifications
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public readonly notifications$ = this.notificationsSubject.asObservable();

  private readonly unreadCountSubject = new BehaviorSubject<number>(0);
  public readonly unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.loadNotificationsFromStorage();
  }

  // ============================================================================
  // TOAST NOTIFICATIONS
  // ============================================================================

  /**
   * Show success toast notification
   */
  success(message: string, action?: string, duration: number = 4000): void {
    this.showToast(message, 'success', action, duration);
  }

  /**
   * Show error toast notification
   */
  error(message: string, action?: string, duration: number = 6000): void {
    this.showToast(message, 'error', action, duration);
  }

  /**
   * Show warning toast notification
   */
  warning(message: string, action?: string, duration: number = 5000): void {
    this.showToast(message, 'warning', action, duration);
  }

  /**
   * Show info toast notification
   */
  info(message: string, action?: string, duration: number = 4000): void {
    this.showToast(message, 'info', action, duration);
  }

  /**
   * Show custom toast notification
   */
  showToast(
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    action?: string,
    duration: number = 4000
  ): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: [`notification-${type}`, 'notification-toast'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: { type, message, action }
    };

    this.snackBar.open(message, action || 'Cerrar', config);
  }

  // ============================================================================
  // PERSISTENT NOTIFICATIONS
  // ============================================================================

  /**
   * Add persistent notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      isRead: false
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotification, ...currentNotifications]);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();

    return newNotification;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, isRead: true }));
    
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Remove notification
   */
  removeNotification(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== notificationId));
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Clear notifications by type
   */
  clearByType(type: 'info' | 'success' | 'warning' | 'error'): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.type !== type));
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // ============================================================================
  // SPECIALIZED NOTIFICATIONS
  // ============================================================================

  /**
   * Product-related notifications
   */
  productAddedToCart(productName: string): void {
    this.success(`"${productName}" añadido al carrito`);
    this.addNotification({
      userId: 'current-user', // Should be injected from auth service
      type: 'success',
      title: 'Producto añadido',
      message: `"${productName}" ha sido añadido a tu carrito de compras`
    });
  }

  productAddedToWishlist(productName: string): void {
    this.success(`"${productName}" añadido a favoritos`);
    this.addNotification({
      userId: 'current-user',
      type: 'info',
      title: 'Producto añadido a favoritos',
      message: `"${productName}" ha sido añadido a tu lista de deseos`
    });
  }

  productOutOfStock(productName: string): void {
    this.warning(`"${productName}" está agotado`);
    this.addNotification({
      userId: 'current-user',
      type: 'warning',
      title: 'Producto agotado',
      message: `"${productName}" ya no está disponible`
    });
  }

  productPriceChanged(productName: string, oldPrice: number, newPrice: number): void {
    const priceChange = newPrice > oldPrice ? 'aumentado' : 'reducido';
    this.info(`Precio de "${productName}" ha ${priceChange}`);
    this.addNotification({
      userId: 'current-user',
      type: 'info',
      title: 'Cambio de precio',
      message: `El precio de "${productName}" ha ${priceChange} de ${oldPrice}€ a ${newPrice}€`
    });
  }

  /**
   * Order-related notifications
   */
  orderPlaced(orderNumber: string): void {
    this.success(`Pedido ${orderNumber} realizado correctamente`);
    this.addNotification({
      userId: 'current-user',
      type: 'success',
      title: 'Pedido confirmado',
      message: `Tu pedido ${orderNumber} ha sido confirmado y está siendo procesado`
    });
  }

  orderShipped(orderNumber: string, trackingNumber?: string): void {
    this.info(`Pedido ${orderNumber} enviado`);
    this.addNotification({
      userId: 'current-user',
      type: 'info',
      title: 'Pedido enviado',
      message: `Tu pedido ${orderNumber} ha sido enviado${trackingNumber ? ` (${trackingNumber})` : ''}`
    });
  }

  orderDelivered(orderNumber: string): void {
    this.success(`Pedido ${orderNumber} entregado`);
    this.addNotification({
      userId: 'current-user',
      type: 'success',
      title: 'Pedido entregado',
      message: `Tu pedido ${orderNumber} ha sido entregado exitosamente`
    });
  }

  orderCancelled(orderNumber: string, reason?: string): void {
    this.warning(`Pedido ${orderNumber} cancelado`);
    this.addNotification({
      userId: 'current-user',
      type: 'warning',
      title: 'Pedido cancelado',
      message: `Tu pedido ${orderNumber} ha sido cancelado${reason ? `: ${reason}` : ''}`
    });
  }

  /**
   * Account-related notifications
   */
  profileUpdated(): void {
    this.success('Perfil actualizado correctamente');
    this.addNotification({
      userId: 'current-user',
      type: 'success',
      title: 'Perfil actualizado',
      message: 'Tu información de perfil ha sido actualizada'
    });
  }

  passwordChanged(): void {
    this.success('Contraseña cambiada correctamente');
    this.addNotification({
      userId: 'current-user',
      type: 'success',
      title: 'Contraseña actualizada',
      message: 'Tu contraseña ha sido cambiada exitosamente'
    });
  }

  emailVerificationSent(email: string): void {
    this.info(`Email de verificación enviado a ${email}`);
    this.addNotification({
      userId: 'current-user',
      type: 'info',
      title: 'Verificación de email',
      message: `Se ha enviado un email de verificación a ${email}`
    });
  }

  /**
   * System notifications
   */
  maintenanceScheduled(startTime: string, duration: string): void {
    this.warning(`Mantenimiento programado: ${startTime} (${duration})`);
    this.addNotification({
      userId: 'current-user',
      type: 'warning',
      title: 'Mantenimiento programado',
      message: `El sistema estará en mantenimiento el ${startTime} durante ${duration}`
    });
  }

  newFeatureAvailable(featureName: string): void {
    this.info(`Nueva funcionalidad disponible: ${featureName}`);
    this.addNotification({
      userId: 'current-user',
      type: 'info',
      title: 'Nueva funcionalidad',
      message: `${featureName} está ahora disponible en la plataforma`
    });
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk add notifications
   */
  addBulkNotifications(notifications: Array<Omit<Notification, 'id' | 'createdAt' | 'isRead'>>): void {
    const newNotifications = notifications.map(n => ({
      ...n,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      isRead: false
    }));

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...newNotifications, ...currentNotifications]);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Bulk mark as read
   */
  markBulkAsRead(notificationIds: string[]): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n =>
      notificationIds.includes(n.id) ? { ...n, isRead: true } : n
    );
    
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // ============================================================================
  // OBSERVABLES
  // ============================================================================

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: 'info' | 'success' | 'warning' | 'error'): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => n.type === type))
    );
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.isRead))
    );
  }

  /**
   * Get recent notifications
   */
  getRecentNotifications(limit: number = 10): Observable<Notification[]> {
    return this.notifications$.pipe(
      map(notifications => notifications.slice(0, limit))
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Update unread count
   */
  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Save notifications to localStorage
   */
  private saveNotificationsToStorage(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notificationsSubject.value));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  /**
   * Load notifications from localStorage
   */
  private loadNotificationsFromStorage(): void {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const notifications = JSON.parse(saved);
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
      localStorage.removeItem('notifications');
    }
  }

  // ============================================================================
  // AUTO-CLEANUP
  // ============================================================================

  /**
   * Start auto-cleanup of old notifications
   */
  startAutoCleanup(): void {
    // Clean notifications older than 30 days
    timer(0, 24 * 60 * 60 * 1000).subscribe(() => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const currentNotifications = this.notificationsSubject.value;
      const filteredNotifications = currentNotifications.filter(n => 
        new Date(n.createdAt) > thirtyDaysAgo
      );

      if (filteredNotifications.length !== currentNotifications.length) {
        this.notificationsSubject.next(filteredNotifications);
        this.updateUnreadCount();
        this.saveNotificationsToStorage();
      }
    });
  }

  // ============================================================================
  // EXPORT/IMPORT
  // ============================================================================

  /**
   * Export notifications to JSON
   */
  exportNotifications(): string {
    return JSON.stringify(this.notificationsSubject.value, null, 2);
  }

  /**
   * Import notifications from JSON
   */
  importNotifications(json: string): boolean {
    try {
      const notifications = JSON.parse(json);
      if (Array.isArray(notifications)) {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
        this.saveNotificationsToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing notifications:', error);
      return false;
    }
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  /**
   * Get notification statistics
   */
  getStats(): {
    total: number;
    unread: number;
    byType: Record<string, number>;
    recent: number;
  } {
    const notifications = this.notificationsSubject.value;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recent = notifications.filter(n => new Date(n.createdAt) > oneWeekAgo).length;

    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      byType,
      recent
    };
  }
}