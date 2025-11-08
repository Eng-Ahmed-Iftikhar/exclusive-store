import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from './notification.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { CreateNotificationDto } from './dto/notification.dto';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  namespace: '/api/notifications',
  cors: {
    origin: process.env.ADMIN_URL,
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedClients: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  constructor(
    private notificationService: NotificationService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client attempting to connect: ${client.id}`);

    try {
      // Extract token from handshake
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`No token provided for client ${client.id}`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      let payload: { sub: string; email: string };
      try {
        payload = await this.jwtService.verifyAsync(token);
      } catch (error) {
        this.logger.error(`Invalid token for client ${client.id}:`, error);
        client.disconnect();
        return;
      }

      // Fetch user from database with role
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!user) {
        this.logger.warn(`User not found for client ${client.id}`);
        client.disconnect();
        return;
      }

      // Store user info on socket
      client.userId = user.id;
      client.userRole = user.role?.name;

      // Track connected client
      if (!this.connectedClients.has(user.id)) {
        this.connectedClients.set(user.id, new Set());
      }
      const userSockets = this.connectedClients.get(user.id);
      if (userSockets) {
        userSockets.add(client.id);
      }

      // Join user-specific room
      client.join(`user:${user.id}`);

      // Join role-specific room if role is available
      if (user.role?.name) {
        client.join(`role:${user.role.name}`);
      }

      // Send unread count on connection
      const unreadCount = await this.notificationService.getUnreadCount(
        user.id
      );
      console.log({ unreadCount });

      client.emit('unread-count', unreadCount);

      this.logger.log(
        `✅ Client authenticated: ${client.id} (User: ${user.id}, Role: ${
          user.role?.name || 'none'
        })`
      );
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Remove client from tracking
    if (client.userId) {
      const userSockets = this.connectedClients.get(client.userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedClients.delete(client.userId);
        }
      }
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuthenticate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { token: string }
  ) {
    this.logger.log(`Client ${client.id} re-authenticating with new token`);

    try {
      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(data.token);

      // Fetch user from database with role
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Update stored user info
      client.userId = user.id;
      client.userRole = user.role?.name;

      // Track connected client
      if (!this.connectedClients.has(user.id)) {
        this.connectedClients.set(user.id, new Set());
      }
      const userSockets = this.connectedClients.get(user.id);
      if (userSockets) {
        userSockets.add(client.id);
      }

      // Join user-specific room
      client.join(`user:${user.id}`);

      // Join role-specific room if role is provided
      if (user.role?.name) {
        client.join(`role:${user.role.name}`);
      }

      // Send unread count on connection
      const unreadCount = await this.notificationService.getUnreadCount(
        user.id
      );
      client.emit('unread-count', unreadCount);

      return { success: true, message: 'Authenticated successfully' };
    } catch (error) {
      this.logger.error(`Authentication error for client ${client.id}:`, error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  @SubscribeMessage('get-notifications')
  @UseGuards(WsJwtGuard)
  async handleGetNotifications(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { page?: number; limit?: number }
  ) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    const notifications = await this.notificationService.getNotifications(
      client.userId,
      { page: data.page || 1, limit: data.limit || 20 }
    );

    return notifications;
  }

  @SubscribeMessage('mark-as-read')
  @UseGuards(WsJwtGuard)
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { notificationIds: string[] }
  ) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    const result = await this.notificationService.markAsRead(
      data.notificationIds,
      client.userId
    );

    // Send updated unread count
    const unreadCount = await this.notificationService.getUnreadCount(
      client.userId
    );
    client.emit('unread-count', unreadCount);

    return result;
  }

  @SubscribeMessage('mark-all-as-read')
  @UseGuards(WsJwtGuard)
  async handleMarkAllAsRead(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    const result = await this.notificationService.markAllAsRead(client.userId);

    // Send updated unread count
    const unreadCount = await this.notificationService.getUnreadCount(
      client.userId
    );
    client.emit('unread-count', unreadCount);

    return result;
  }

  /**
   * Emit notification to specific user
   */
  async emitToUser(userId: string, event: string, data: unknown) {
    // Emit with both the generic event name and specific event names
    this.server.to(`user:${userId}`).emit(event, data);

    this.logger.log(`Emitted ${event} to user ${userId}`);
  }

  /**
   * Emit notification to all users with specific role
   */
  async emitToRole(role: string, event: string, data: unknown) {
    // Emit with both the generic event name and specific event names
    this.server.to(`role:${role}`).emit(event, data);

    this.logger.log(`Emitted ${event} to role ${role}`);
  }

  /**
   * Broadcast notification to all connected clients
   */
  async broadcast(event: string, data: unknown) {
    this.server.emit(event, data);
    this.logger.log(`Broadcasted ${event} to all clients`);
  }

  /**
   * Send notification and persist it
   */
  async sendNotification(notification: CreateNotificationDto) {
    // Save notification to database
    const savedNotification = await this.notificationService.createNotification(
      notification
    );

    // Emit to appropriate recipients
    if (notification.recipientId) {
      // Send to specific user
      await this.emitToUser(
        notification.recipientId,
        'notification',
        savedNotification
      );

      // Update unread count for user
      const unreadCount = await this.notificationService.getUnreadCount(
        notification.recipientId
      );
      await this.emitToUser(
        notification.recipientId,
        'unread-count',
        unreadCount
      );
    } else if (notification.recipientRole) {
      // Send to all users with specific role
      await this.emitToRole(
        notification.recipientRole,
        'notification',
        savedNotification
      );
    } else {
      // Broadcast to all admin users
      await this.emitToRole('admin', 'notification', savedNotification);
      await this.emitToRole('super-admin', 'notification', savedNotification);
    }

    return savedNotification;
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Get connected clients for a specific user
   */
  getUserConnections(userId: string): number {
    return this.connectedClients.get(userId)?.size || 0;
  }
}
