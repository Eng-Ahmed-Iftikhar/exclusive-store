import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrderActivityDto,
  OrderActivityDto,
  OrderActivityListDto,
} from './dto/order-activity.dto';

@Injectable()
export class OrderActivityService {
  constructor(private prisma: PrismaService) {}

  async createActivity(
    createActivityDto: CreateOrderActivityDto,
    performedBy?: string
  ): Promise<OrderActivityDto> {
    const activity = await this.prisma.orderActivity.create({
      data: {
        orderId: createActivityDto.orderId,
        action: createActivityDto.action,
        field: createActivityDto.field,
        oldValue: createActivityDto.oldValue,
        newValue: createActivityDto.newValue,
        performedBy: performedBy,
        metadata: createActivityDto.metadata || {},
      },
      include: {
        performedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.mapToDto(activity);
  }

  async getOrderActivities(orderId: string): Promise<OrderActivityListDto> {
    const activities = await this.prisma.orderActivity.findMany({
      where: { orderId },
      include: {
        performedByUser: {
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
    });

    return {
      activities: activities.map((activity) => this.mapToDto(activity)),
      total: activities.length,
    };
  }

  private mapToDto(activity: any): OrderActivityDto {
    return {
      id: activity.id,
      orderId: activity.orderId,
      action: activity.action,
      field: activity.field,
      oldValue: activity.oldValue,
      newValue: activity.newValue,
      performedBy: activity.performedBy,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
      performedByUser: activity.performedByUser
        ? {
            id: activity.performedByUser.id,
            name: activity.performedByUser.name,
            email: activity.performedByUser.email,
          }
        : undefined,
    };
  }
}
