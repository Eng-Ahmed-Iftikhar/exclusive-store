import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ActivityService } from './activity.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../notification/guards/ws-jwt.guard';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.ADMIN_URL,
    credentials: true,
  },
  namespace: '/api/activity',
})
export class ActivityGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ActivityGateway.name);
  private connectedClients = new Map<string, Set<string>>(); // userId -> socketIds

  constructor(
    private readonly activityService: ActivityService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client attempting to connect: ${client.id}`);

    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`No token provided for client ${client.id}`);
        client.disconnect();
        return;
      }

      let payload: { sub: string; email: string };
      try {
        payload = await this.jwtService.verifyAsync(token);
      } catch (error) {
        this.logger.error(`Invalid token for client ${client.id}:`, error);
        client.disconnect();
        return;
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: { select: { name: true } },
        },
      });

      if (!user) {
        this.logger.warn(`User not found for client ${client.id}`);
        client.disconnect();
        return;
      }

      // attach auth info
      client.userId = user.id;
      client.userRole = user.role?.name;

      // track sockets per user
      let socketSet = this.connectedClients.get(user.id);
      if (!socketSet) {
        socketSet = new Set<string>();
        this.connectedClients.set(user.id, socketSet);
      }
      socketSet.add(client.id);

      // join user and role rooms
      client.join(`user:${user.id}`);
      if (user.role?.name) {
        client.join(`role:${user.role.name}`);
      }

      // Back-compat: join legacy admin room for admins
      if (user.role?.name === 'admin' || user.role?.name === 'super-admin') {
        client.join('admin-room');
      }

      this.logger.log(
        `✅Activity client authenticated: ${client.id} (User: ${
          user.id
        }, Role: ${user.role?.name || 'none'})`
      );
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Activity client disconnected: ${client.id}`);
    // remove from tracking
    for (const [userId, sockets] of this.connectedClients.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.connectedClients.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join-admin-room')
  handleJoinAdminRoom(@ConnectedSocket() client: Socket) {
    client.join('admin-room');
    console.log(`Client ${client.id} joined admin room`);
  }

  @SubscribeMessage('leave-admin-room')
  handleLeaveAdminRoom(@ConnectedSocket() client: Socket) {
    client.leave('admin-room');
    console.log(`Client ${client.id} left admin room`);
  }

  @SubscribeMessage('get-user-activities')
  @UseGuards(WsJwtGuard)
  async handleGetUserActivities(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { limit?: number }
  ) {
    if (!client.userId) return;
    const activities = await this.activityService.getActivitiesByUser(
      client.userId,
      data.limit || 10
    );
    client.emit('user-activities', activities);
  }

  @OnEvent('activity.created')
  async handleActivityCreated(activity: {
    id?: string;
    type?: string;
    message?: string;
    userId?: string;
    createdAt?: Date;
    [key: string]: unknown;
  }) {
    // Broadcast to admin roles
    this.server.to('role:admin').emit('new-activity', activity);
    this.server.to('role:super-admin').emit('new-activity', activity);

    // If activity is tied to a specific user, also emit directly to that user
    if (activity?.userId) {
      this.server.to(`user:${activity.userId}`).emit('new-activity', activity);
    }
  }

  // Method to broadcast activity to all connected clients
  broadcastActivity(activity: unknown) {
    this.server.to('admin-room').emit('new-activity', activity);
  }
}
