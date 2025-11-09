import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

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

      // Only allow non-customer roles (activities are admin-panel only)
      if (user.role?.name === 'customer') {
        this.logger.warn(
          `Customer attempted to connect to activity gateway: ${client.id}`
        );
        client.disconnect();
        return;
      }

      // join user and role rooms
      client.join(`user:${user.id}`);
      if (user.role?.name) {
        client.join(`role:${user.role.name}`);
      }

      this.logger.log(
        `✅ Activity client authenticated: ${client.id} (User: ${
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

  @OnEvent('activity.created')
  async handleActivityCreated(activity: {
    id?: string;
    type?: string;
    message?: string;
    userId?: string;
    createdAt?: Date;
    [key: string]: unknown;
  }) {
    // Broadcast to all connected admin users (excludes customers as they can't connect)
    this.server.emit('new-activity', activity);
  }
}
