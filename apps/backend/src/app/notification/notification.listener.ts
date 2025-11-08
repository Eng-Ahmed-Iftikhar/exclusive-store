import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationGateway } from './notification.gateway';
import { NotificationEvent } from './notification-event.service';
import {
  NotificationType,
  NotificationCategory,
  NotificationPriority,
} from './dto/notification.dto';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private notificationGateway: NotificationGateway) {}

  @OnEvent('notification.created')
  async handleNotificationCreated(event: NotificationEvent) {
    this.logger.log(`Handling notification: ${event.title}`);

    try {
      // Send notification via WebSocket and persist to database
      await this.notificationGateway.sendNotification({
        type: event.type as NotificationType,
        category: event.category as NotificationCategory,
        title: event.title,
        message: event.message,
        actionUrl: event.actionUrl,
        actionLabel: event.actionLabel,
        recipientId: event.recipientId,
        recipientRole: event.recipientRole,
        priority: event.priority as NotificationPriority,
        metadata: event.metadata,
        icon: event.icon,
        entityType: event.entityType,
        entityId: event.entityId,
      });

      this.logger.log(`Notification sent successfully: ${event.title}`);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${event.title}`, error);
    }
  }
}
