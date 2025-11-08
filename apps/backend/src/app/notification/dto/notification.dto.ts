import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum NotificationType {
  ORDER = 'order',
  USER = 'user',
  PRODUCT = 'product',
  PAYMENT = 'payment',
  REVIEW = 'review',
  STOCK = 'stock',
  SYSTEM = 'system',
  SECURITY = 'security',
}

export enum NotificationCategory {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification type',
    enum: NotificationType,
    example: NotificationType.ORDER,
  })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiProperty({
    description: 'Notification category',
    enum: NotificationCategory,
    example: NotificationCategory.INFO,
  })
  @IsEnum(NotificationCategory)
  category!: NotificationCategory;

  @ApiProperty({
    description: 'Notification title',
    example: 'New Order Received',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Order #12345 has been placed by John Doe',
  })
  @IsString()
  message!: string;

  @ApiProperty({
    description: 'Action URL',
    example: '/orders/12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiProperty({
    description: 'Action button label',
    example: 'View Order',
    required: false,
  })
  @IsOptional()
  @IsString()
  actionLabel?: string;

  @ApiProperty({
    description: 'Recipient user ID (null for broadcast)',
    required: false,
  })
  @IsOptional()
  @IsString()
  recipientId?: string;

  @ApiProperty({
    description: 'Recipient role (e.g., admin, superadmin)',
    required: false,
  })
  @IsOptional()
  @IsString()
  recipientRole?: string;

  @ApiProperty({
    description: 'Notification priority',
    enum: NotificationPriority,
    example: NotificationPriority.NORMAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiProperty({
    description: 'Additional metadata',
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Icon identifier',
    example: 'shopping-cart',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Entity type',
    example: 'order',
    required: false,
  })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiProperty({
    description: 'Entity ID',
    example: '12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  entityId?: string;
}

export class GetNotificationsQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Filter by type',
    enum: NotificationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({
    description: 'Filter by category',
    enum: NotificationCategory,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;

  @ApiProperty({
    description: 'Filter by read status',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRead?: boolean;

  @ApiProperty({
    description: 'Filter by priority',
    enum: NotificationPriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;
}

export class MarkAsReadDto {
  @ApiProperty({
    description: 'Notification IDs to mark as read',
    type: [String],
    example: ['notif123', 'notif456'],
  })
  @IsString({ each: true })
  notificationIds!: string[];
}

export class NotificationResponseDto {
  @ApiProperty({ description: 'Notification ID' })
  id!: string;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  type!: string;

  @ApiProperty({
    description: 'Notification category',
    enum: NotificationCategory,
  })
  category!: string;

  @ApiProperty({ description: 'Notification title' })
  title!: string;

  @ApiProperty({ description: 'Notification message' })
  message!: string;

  @ApiProperty({ description: 'Action URL', required: false })
  actionUrl?: string;

  @ApiProperty({ description: 'Action label', required: false })
  actionLabel?: string;

  @ApiProperty({ description: 'Is read status' })
  isRead!: boolean;

  @ApiProperty({ description: 'Read at timestamp', required: false })
  readAt?: Date;

  @ApiProperty({ description: 'Priority', enum: NotificationPriority })
  priority!: string;

  @ApiProperty({ description: 'Metadata', required: false })
  metadata?: Record<string, unknown>;

  @ApiProperty({ description: 'Icon identifier', required: false })
  icon?: string;

  @ApiProperty({ description: 'Entity type', required: false })
  entityType?: string;

  @ApiProperty({ description: 'Entity ID', required: false })
  entityId?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt!: Date;
}

export class NotificationsListResponseDto {
  @ApiProperty({
    description: 'List of notifications',
    type: [NotificationResponseDto],
  })
  data!: NotificationResponseDto[];

  @ApiProperty({
    description: 'Pagination information',
  })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  @ApiProperty({
    description: 'Unread count',
  })
  unreadCount!: number;
}

export class NotificationStatsResponseDto {
  @ApiProperty({ description: 'Total notifications' })
  total!: number;

  @ApiProperty({ description: 'Unread notifications' })
  unread!: number;

  @ApiProperty({ description: 'By type breakdown' })
  byType!: Record<string, number>;

  @ApiProperty({ description: 'By category breakdown' })
  byCategory!: Record<string, number>;

  @ApiProperty({ description: 'By priority breakdown' })
  byPriority!: Record<string, number>;
}
