import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface CreateActivityDto {
  type: 'order' | 'user' | 'product' | 'payment' | 'revenue' | 'system';
  title: string;
  description: string;
  metadata?: any;
  userId?: string;
}

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createActivity(data: CreateActivityDto) {
    const activity = await this.prisma.activity.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        metadata: data.metadata || {},
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Emit event for real-time updates
    this.eventEmitter.emit('activity.created', activity);

    return activity;
  }

  async getRecentActivities(limit = 10) {
    return await this.prisma.activity.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getActivitiesByType(type: string, limit = 10) {
    return await this.prisma.activity.findMany({
      where: {
        type,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getActivitiesByUser(userId: string, limit = 10) {
    return await this.prisma.activity.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  // Helper methods for common activities
  async logOrderActivity(orderId: string, action: string, userId?: string) {
    return this.createActivity({
      type: 'order',
      title: `Order ${action}`,
      description: `Order #${orderId} has been ${action}`,
      metadata: { orderId, action },
      userId,
    });
  }

  async logUserActivity(userId: string, action: string, userEmail?: string) {
    return this.createActivity({
      type: 'user',
      title: `User ${action}`,
      description: userEmail
        ? `${userEmail} has been ${action}`
        : `User ${action}`,
      metadata: { userId, action },
      userId,
    });
  }

  async logProductActivity(productId: string, action: string, userId?: string) {
    return this.createActivity({
      type: 'product',
      title: `Product ${action}`,
      description: `Product #${productId} has been ${action}`,
      metadata: { productId, action },
      userId,
    });
  }

  async logPaymentActivity(
    paymentId: string,
    action: string,
    amount?: number,
    userId?: string
  ) {
    return this.createActivity({
      type: 'payment',
      title: `Payment ${action}`,
      description: `Payment #${paymentId} has been ${action}${
        amount ? ` for $${amount}` : ''
      }`,
      metadata: { paymentId, action, amount },
      userId,
    });
  }

  async logRevenueActivity(
    description: string,
    amount?: number,
    userId?: string
  ) {
    return this.createActivity({
      type: 'revenue',
      title: 'Revenue Update',
      description,
      metadata: { amount },
      userId,
    });
  }

  async logSystemActivity(title: string, description: string, metadata?: any) {
    return this.createActivity({
      type: 'system',
      title,
      description,
      metadata,
    });
  }
}
