import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  GetNotificationsQueryDto,
  MarkAsReadDto,
  NotificationsListResponseDto,
  NotificationResponseDto,
  NotificationStatsResponseDto,
} from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a notification',
    description: 'Create a new notification (admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationService.createNotification(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get notifications',
    description: 'Retrieve paginated list of notifications with filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: NotificationsListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getNotifications(
    @Request() req: { user: { userId: string } },
    @Query() query: GetNotificationsQueryDto
  ) {
    return this.notificationService.getNotifications(req.user.userId, query);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get notification statistics',
    description: 'Get aggregated statistics for notifications',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: NotificationStatsResponseDto,
  })
  async getNotificationStats(@Request() req: { user: { userId: string } }) {
    return this.notificationService.getNotificationStats(req.user.userId);
  }

  @Get('unread-count')
  @ApiOperation({
    summary: 'Get unread notification count',
    description: 'Get the count of unread notifications',
  })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  async getUnreadCount(@Request() req: { user: { userId: string } }) {
    return this.notificationService.getUnreadCount(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get notification by ID',
    description: 'Retrieve a specific notification by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification retrieved successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  async getNotificationById(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } }
  ) {
    return this.notificationService.getNotificationById(id, req.user.userId);
  }

  @Post('mark-as-read')
  @ApiOperation({
    summary: 'Mark notifications as read',
    description: 'Mark one or more notifications as read',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications marked as read successfully',
  })
  async markAsRead(
    @Body() dto: MarkAsReadDto,
    @Request() req: { user: { userId: string } }
  ) {
    return this.notificationService.markAsRead(
      dto.notificationIds,
      req.user.userId
    );
  }

  @Post('mark-all-as-read')
  @ApiOperation({
    summary: 'Mark all notifications as read',
    description: 'Mark all notifications for the current user as read',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read successfully',
  })
  async markAllAsRead(@Request() req: { user: { userId: string } }) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete notification',
    description: 'Delete a specific notification',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  async deleteNotification(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } }
  ) {
    return this.notificationService.deleteNotification(id, req.user.userId);
  }

  @Post('delete-multiple')
  @ApiOperation({
    summary: 'Delete multiple notifications',
    description: 'Delete multiple notifications by their IDs',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications deleted successfully',
  })
  async deleteNotifications(
    @Body() dto: MarkAsReadDto,
    @Request() req: { user: { userId: string } }
  ) {
    return this.notificationService.deleteNotifications(
      dto.notificationIds,
      req.user.userId
    );
  }

  @Post('cleanup-expired')
  @ApiOperation({
    summary: 'Cleanup expired notifications',
    description:
      'Delete all notifications that have passed their expiration date',
  })
  @ApiResponse({
    status: 200,
    description: 'Expired notifications cleaned up successfully',
  })
  async cleanupExpiredNotifications() {
    return this.notificationService.cleanupExpiredNotifications();
  }
}
