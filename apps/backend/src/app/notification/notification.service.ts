import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationDto,
  GetNotificationsQueryDto,
  NotificationPriority,
  NotificationType,
  NotificationCategory,
} from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new notification
   */
  async createNotification(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        type: dto.type,
        category: dto.category,
        title: dto.title,
        message: dto.message,
        actionUrl: dto.actionUrl,
        actionLabel: dto.actionLabel,
        recipientId: dto.recipientId,
        recipientRole: dto.recipientRole,
        priority: dto.priority || NotificationPriority.NORMAL,
        metadata: dto.metadata as any,
        icon: dto.icon,
        entityType: dto.entityType,
        entityId: dto.entityId,
      },
    });
  }

  /**
   * Get notifications for a user with filters
   */
  async getNotifications(userId: string, query: GetNotificationsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<{
        recipientRole?: string;
        recipientId: string | null;
      }>;
      type?: string;
      category?: string;
      isRead?: boolean;
      priority?: string;
    } = {
      OR: [
        { recipientId: userId }, // Direct notification
        { recipientId: null }, // Broadcast notification
      ],
    };

    // Apply filters
    if (query.type) {
      where.type = query.type;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.isRead !== undefined) {
      where.isRead = query.isRead;
    }
    if (query.priority) {
      where.priority = query.priority;
    }

    // Fetch notifications and count
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' }, // Urgent first
          { createdAt: 'desc' }, // Most recent first
        ],
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: {
          ...where,
          isRead: false,
        },
      }),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id,
        OR: [
          { recipientId: userId },
          { recipientId: null }, // Broadcast
        ],
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  /**
   * Mark notification(s) as read
   */
  async markAsRead(notificationIds: string[], userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        OR: [
          { recipientId: userId },
          { recipientId: null }, // Broadcast
        ],
        isRead: false, // Only update unread notifications
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true,
      updatedCount: result.count,
    };
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        OR: [
          { recipientId: userId },
          { recipientId: null }, // Broadcast
        ],
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true,
      updatedCount: result.count,
    };
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string, userId: string) {
    // Verify ownership
    await this.getNotificationById(id, userId);

    await this.prisma.notification.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  }

  /**
   * Delete multiple notifications
   */
  async deleteNotifications(notificationIds: string[], userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        OR: [
          { recipientId: userId },
          { recipientId: null }, // Broadcast
        ],
      },
    });

    return {
      success: true,
      deletedCount: result.count,
    };
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        OR: [
          { recipientId: userId },
          { recipientId: null }, // Broadcast
        ],
      },
      select: {
        type: true,
        category: true,
        priority: true,
        isRead: true,
      },
    });

    const stats = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };

    // Aggregate by type
    notifications.forEach((n) => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
      stats.byCategory[n.category] = (stats.byCategory[n.category] || 0) + 1;
      stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        OR: [
          { recipientId: userId },
          { recipientId: null }, // Broadcast
        ],
        isRead: false,
      },
    });

    return { unreadCount: count };
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpiredNotifications() {
    const result = await this.prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });

    return {
      success: true,
      deletedCount: result.count,
    };
  }

  /**
   * Helper: Create order notification
   */
  async createOrderNotification(
    orderId: string,
    orderNumber: string,
    type: 'created' | 'updated' | 'cancelled',
    customerName?: string
  ) {
    const messages = {
      created: `New order #${orderNumber} received${
        customerName ? ` from ${customerName}` : ''
      }`,
      updated: `Order #${orderNumber} status has been updated`,
      cancelled: `Order #${orderNumber} has been cancelled`,
    };

    return this.createNotification({
      type: NotificationType.ORDER,
      category:
        type === 'cancelled'
          ? NotificationCategory.WARNING
          : NotificationCategory.INFO,
      title: type === 'created' ? 'New Order' : 'Order Update',
      message: messages[type],
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      priority:
        type === 'created'
          ? NotificationPriority.HIGH
          : NotificationPriority.NORMAL,
      icon: 'shopping-bag',
      entityType: 'order',
      entityId: orderId,
      metadata: { orderNumber, type },
    });
  }

  /**
   * Helper: Create product notification
   */
  async createProductNotification(
    productId: string,
    productName: string,
    type: 'created' | 'updated' | 'low_stock' | 'out_of_stock'
  ) {
    const messages = {
      created: `New product "${productName}" has been added`,
      updated: `Product "${productName}" has been updated`,
      low_stock: `Product "${productName}" is running low on stock`,
      out_of_stock: `Product "${productName}" is out of stock`,
    };

    const categories = {
      created: 'success',
      updated: 'info',
      low_stock: 'warning',
      out_of_stock: 'error',
    };

    return this.createNotification({
      type:
        type === 'low_stock' || type === 'out_of_stock'
          ? NotificationType.STOCK
          : NotificationType.PRODUCT,
      category: categories[type] as NotificationCategory,
      title:
        type === 'created'
          ? 'New Product'
          : type === 'updated'
          ? 'Product Updated'
          : 'Stock Alert',
      message: messages[type],
      actionUrl: `/products/${productId}`,
      actionLabel: 'View Product',
      priority:
        type === 'out_of_stock'
          ? NotificationPriority.URGENT
          : type === 'low_stock'
          ? NotificationPriority.HIGH
          : NotificationPriority.NORMAL,
      icon:
        type === 'low_stock' || type === 'out_of_stock'
          ? 'alert-triangle'
          : 'package',
      entityType: 'product',
      entityId: productId,
      metadata: { productName, type },
    });
  }

  /**
   * Helper: Create review notification
   */
  async createReviewNotification(
    reviewId: string,
    productName: string,
    rating: number,
    userName: string
  ) {
    return this.createNotification({
      type: NotificationType.REVIEW,
      category: NotificationCategory.INFO,
      title: 'New Review',
      message: `${userName} left a ${rating}-star review for "${productName}"`,
      actionUrl: `/reviews/${reviewId}`,
      actionLabel: 'Review',
      priority: NotificationPriority.NORMAL,
      icon: 'star',
      entityType: 'review',
      entityId: reviewId,
      metadata: { productName, rating, userName },
    });
  }

  /**
   * Helper: Create user notification
   */
  async createUserNotification(
    userId: string,
    userName: string,
    userEmail: string,
    type: 'registered' | 'verified' | 'updated'
  ) {
    const messages = {
      registered: `New user registered: ${userName} (${userEmail})`,
      verified: `User ${userName} verified their email`,
      updated: `User ${userName} updated their profile`,
    };

    return this.createNotification({
      type: NotificationType.USER,
      category:
        type === 'registered'
          ? NotificationCategory.SUCCESS
          : NotificationCategory.INFO,
      title: type === 'registered' ? 'New User' : 'User Update',
      message: messages[type],
      actionUrl: `/users/${userId}`,
      actionLabel: 'View User',
      priority:
        type === 'registered'
          ? NotificationPriority.NORMAL
          : NotificationPriority.LOW,
      icon: 'user',
      entityType: 'user',
      entityId: userId,
      metadata: { userName, userEmail, type },
    });
  }

  /**
   * Helper: Create payment notification
   */
  async createPaymentNotification(
    orderId: string,
    orderNumber: string,
    amount: number,
    status: 'succeeded' | 'failed' | 'refunded'
  ) {
    const messages = {
      succeeded: `Payment of $${amount.toFixed(
        2
      )} received for order #${orderNumber}`,
      failed: `Payment failed for order #${orderNumber}`,
      refunded: `Payment of $${amount.toFixed(
        2
      )} refunded for order #${orderNumber}`,
    };

    const categories = {
      succeeded: 'success',
      failed: 'error',
      refunded: 'warning',
    };

    return this.createNotification({
      type: NotificationType.PAYMENT,
      category: categories[status] as NotificationCategory,
      title:
        status === 'succeeded'
          ? 'Payment Received'
          : status === 'failed'
          ? 'Payment Failed'
          : 'Payment Refunded',
      message: messages[status],
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      priority:
        status === 'failed'
          ? NotificationPriority.HIGH
          : NotificationPriority.NORMAL,
      icon: status === 'succeeded' ? 'dollar-sign' : 'alert-circle',
      entityType: 'payment',
      entityId: orderId,
      metadata: { orderNumber, amount, status },
    });
  }
}
