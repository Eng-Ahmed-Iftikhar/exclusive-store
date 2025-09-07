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

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  namespace: '/activity',
})
export class ActivityGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private connectedClients = new Map<string, Socket>();

  constructor(private readonly activityService: ActivityService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);

    // Send recent activities to newly connected client
    this.sendRecentActivities(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
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

  @SubscribeMessage('get-recent-activities')
  async handleGetRecentActivities(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { limit?: number }
  ) {
    const activities = await this.activityService.getRecentActivities(
      data.limit || 10
    );
    client.emit('recent-activities', activities);
  }

  @OnEvent('activity.created')
  async handleActivityCreated(activity: unknown) {
    // Broadcast to all connected admin clients
    this.server.to('admin-room').emit('new-activity', activity);

    // Also send updated recent activities
    const recentActivities = await this.activityService.getRecentActivities(10);
    this.server.to('admin-room').emit('recent-activities', recentActivities);
  }

  private async sendRecentActivities(client: Socket) {
    try {
      const activities = await this.activityService.getRecentActivities(10);
      client.emit('recent-activities', activities);
    } catch (error) {
      console.error('Error sending recent activities:', error);
    }
  }

  // Method to broadcast activity to all connected clients
  broadcastActivity(activity: unknown) {
    this.server.to('admin-room').emit('new-activity', activity);
  }
}
