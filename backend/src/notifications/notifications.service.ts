import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async getNotifications(userId: string, params: any) {
    return {
      data: [
        {
          id: '1',
          type: 'order',
          title: 'Order Delivered',
          message: 'Your order ORD-2024-001 has been delivered',
          isRead: false,
          createdAt: '2024-01-20T10:30:00Z',
          link: '/orders/1',
          priority: 'medium',
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment Received',
          message: 'Payment of €2,304.50 has been received',
          isRead: false,
          createdAt: '2024-01-20T09:15:00Z',
          link: '/transactions/1',
          priority: 'low',
        },
        {
          id: '3',
          type: 'alert',
          title: 'Low Stock Alert',
          message: 'Premium Milk 1L is running low on stock',
          isRead: true,
          createdAt: '2024-01-19T15:45:00Z',
          link: '/inventory',
          priority: 'high',
        },
      ],
      unreadCount: 2,
      total: 50,
      page: params.page || 1,
      limit: params.limit || 20,
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    return {
      data: {
        id: notificationId,
        isRead: true,
        readAt: new Date().toISOString(),
      },
    };
  }

  async markAllAsRead(userId: string) {
    return {
      success: true,
      message: 'All notifications marked as read',
      markedCount: 5,
      markedAt: new Date().toISOString(),
    };
  }

  async deleteNotification(userId: string, notificationId: string) {
    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  }

  async getSettings(userId: string) {
    return {
      email: {
        orders: true,
        payments: true,
        lowStock: true,
        marketing: false,
      },
      push: {
        orders: true,
        payments: false,
        lowStock: true,
        marketing: false,
      },
      sms: {
        orders: false,
        payments: false,
        lowStock: true,
        marketing: false,
      },
    };
  }

  async updateSettings(userId: string, settings: any) {
    return {
      data: settings,
      updatedAt: new Date().toISOString(),
      message: 'Notification settings updated successfully',
    };
  }
}






