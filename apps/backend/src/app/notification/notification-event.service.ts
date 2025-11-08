import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface NotificationEvent {
  type:
    | 'order'
    | 'user'
    | 'product'
    | 'payment'
    | 'review'
    | 'stock'
    | 'system'
    | 'security';
  category: 'info' | 'success' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  recipientId?: string;
  recipientRole?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, unknown>;
  icon?: string;
  entityType?: string;
  entityId?: string;
}

@Injectable()
export class NotificationEventService {
  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Emit a notification event
   */
  emitNotification(event: NotificationEvent) {
    this.eventEmitter.emit('notification.created', event);
  }

  /**
   * Order notifications
   */
  notifyOrderCreated(
    orderId: string,
    orderNumber: string,
    customerName?: string
  ) {
    this.emitNotification({
      type: 'order',
      category: 'info',
      title: 'New Order',
      message: `New order #${orderNumber} received${
        customerName ? ` from ${customerName}` : ''
      }`,
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      priority: 'high',
      icon: 'shopping-bag',
      entityType: 'order',
      entityId: orderId,
      metadata: { orderNumber, customerName },
    });
  }

  notifyOrderStatusChanged(
    orderId: string,
    orderNumber: string,
    oldStatus: string,
    newStatus: string
  ) {
    this.emitNotification({
      type: 'order',
      category: 'info',
      title: 'Order Status Updated',
      message: `Order #${orderNumber} status changed from ${oldStatus} to ${newStatus}`,
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      priority: 'normal',
      icon: 'package',
      entityType: 'order',
      entityId: orderId,
      metadata: { orderNumber, oldStatus, newStatus },
    });
  }

  notifyOrderCancelled(orderId: string, orderNumber: string, reason?: string) {
    this.emitNotification({
      type: 'order',
      category: 'warning',
      title: 'Order Cancelled',
      message: `Order #${orderNumber} has been cancelled${
        reason ? `: ${reason}` : ''
      }`,
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      priority: 'high',
      icon: 'x-circle',
      entityType: 'order',
      entityId: orderId,
      metadata: { orderNumber, reason },
    });
  }

  /**
   * Product notifications
   */
  notifyProductCreated(productId: string, productName: string) {
    this.emitNotification({
      type: 'product',
      category: 'success',
      title: 'New Product',
      message: `New product "${productName}" has been added`,
      actionUrl: `/products/${productId}`,
      actionLabel: 'View Product',
      priority: 'normal',
      icon: 'package',
      entityType: 'product',
      entityId: productId,
      metadata: { productName },
    });
  }

  notifyProductUpdated(productId: string, productName: string) {
    this.emitNotification({
      type: 'product',
      category: 'info',
      title: 'Product Updated',
      message: `Product "${productName}" has been updated`,
      actionUrl: `/products/${productId}`,
      actionLabel: 'View Product',
      priority: 'low',
      icon: 'edit',
      entityType: 'product',
      entityId: productId,
      metadata: { productName },
    });
  }

  notifyLowStock(productId: string, productName: string, quantity: number) {
    this.emitNotification({
      type: 'stock',
      category: 'warning',
      title: 'Low Stock Alert',
      message: `Product "${productName}" is running low (${quantity} left)`,
      actionUrl: `/products/${productId}`,
      actionLabel: 'View Product',
      priority: 'high',
      icon: 'alert-triangle',
      entityType: 'product',
      entityId: productId,
      metadata: { productName, quantity },
    });
  }

  notifyOutOfStock(productId: string, productName: string) {
    this.emitNotification({
      type: 'stock',
      category: 'error',
      title: 'Out of Stock',
      message: `Product "${productName}" is out of stock`,
      actionUrl: `/products/${productId}`,
      actionLabel: 'View Product',
      priority: 'urgent',
      icon: 'alert-circle',
      entityType: 'product',
      entityId: productId,
      metadata: { productName },
    });
  }

  /**
   * User notifications
   */
  notifyUserRegistered(userId: string, userName: string, userEmail: string) {
    this.emitNotification({
      type: 'user',
      category: 'success',
      title: 'New User',
      message: `New user registered: ${userName} (${userEmail})`,
      actionUrl: `/users/${userId}`,
      actionLabel: 'View User',
      priority: 'normal',
      icon: 'user-plus',
      entityType: 'user',
      entityId: userId,
      metadata: { userName, userEmail },
    });
  }

  notifyUserVerified(userId: string, userName: string, userEmail: string) {
    this.emitNotification({
      type: 'user',
      category: 'info',
      title: 'Email Verified',
      message: `User ${userName} (${userEmail}) verified their email`,
      actionUrl: `/users/${userId}`,
      actionLabel: 'View User',
      priority: 'low',
      icon: 'check-circle',
      entityType: 'user',
      entityId: userId,
      metadata: { userName, userEmail },
    });
  }

  /**
   * Payment notifications
   */
  notifyPaymentReceived(
    orderId: string,
    orderNumber: string,
    amount: number,
    currency = 'USD'
  ) {
    this.emitNotification({
      type: 'payment',
      category: 'success',
      title: 'Payment Received',
      message: `Payment of ${currency} ${amount.toFixed(
        2
      )} received for order #${orderNumber}`,
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      priority: 'normal',
      icon: 'dollar-sign',
      entityType: 'payment',
      entityId: orderId,
      metadata: { orderNumber, amount, currency },
    });
  }

  notifyPaymentFailed(orderId: string, orderNumber: string, reason?: string) {
    this.emitNotification({
      type: 'payment',
      category: 'error',
      title: 'Payment Failed',
      message: `Payment failed for order #${orderNumber}${
        reason ? `: ${reason}` : ''
      }`,
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      priority: 'high',
      icon: 'alert-circle',
      entityType: 'payment',
      entityId: orderId,
      metadata: { orderNumber, reason },
    });
  }

  notifyPaymentRefunded(
    orderId: string,
    orderNumber: string,
    amount: number,
    currency = 'USD'
  ) {
    this.emitNotification({
      type: 'payment',
      category: 'warning',
      title: 'Payment Refunded',
      message: `Payment of ${currency} ${amount.toFixed(
        2
      )} refunded for order #${orderNumber}`,
      actionUrl: `/orders/${orderId}`,
      actionLabel: 'View Order',
      priority: 'normal',
      icon: 'rotate-ccw',
      entityType: 'payment',
      entityId: orderId,
      metadata: { orderNumber, amount, currency },
    });
  }

  /**
   * Review notifications
   */
  notifyNewReview(
    reviewId: string,
    productId: string,
    productName: string,
    rating: number,
    userName: string
  ) {
    this.emitNotification({
      type: 'review',
      category: 'info',
      title: 'New Review',
      message: `${userName} left a ${rating}-star review for "${productName}"`,
      actionUrl: `/reviews/${reviewId}`,
      actionLabel: 'Review',
      priority: 'normal',
      icon: 'star',
      entityType: 'review',
      entityId: reviewId,
      metadata: { productId, productName, rating, userName },
    });
  }

  /**
   * System notifications
   */
  notifySystemError(message: string, details?: Record<string, unknown>) {
    this.emitNotification({
      type: 'system',
      category: 'critical',
      title: 'System Error',
      message,
      priority: 'urgent',
      icon: 'alert-triangle',
      entityType: 'system',
      metadata: details,
    });
  }

  notifySystemWarning(message: string, details?: Record<string, unknown>) {
    this.emitNotification({
      type: 'system',
      category: 'warning',
      title: 'System Warning',
      message,
      priority: 'high',
      icon: 'alert-circle',
      entityType: 'system',
      metadata: details,
    });
  }

  /**
   * Security notifications
   */
  notifySecurityAlert(message: string, details?: Record<string, unknown>) {
    this.emitNotification({
      type: 'security',
      category: 'critical',
      title: 'Security Alert',
      message,
      priority: 'urgent',
      icon: 'shield-alert',
      entityType: 'security',
      metadata: details,
    });
  }

  notifySuspiciousActivity(
    userId: string,
    activityType: string,
    details?: Record<string, unknown>
  ) {
    this.emitNotification({
      type: 'security',
      category: 'warning',
      title: 'Suspicious Activity',
      message: `Suspicious ${activityType} detected for user ${userId}`,
      actionUrl: `/users/${userId}`,
      actionLabel: 'View User',
      priority: 'high',
      icon: 'alert-triangle',
      entityType: 'user',
      entityId: userId,
      metadata: { activityType, ...details },
    });
  }
}
