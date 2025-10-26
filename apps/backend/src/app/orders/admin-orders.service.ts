import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { OrderActivityService } from './order-activity.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../config/config.service';
import { TransactionsService } from '../transactions/transactions.service';
import {
  TransactionType,
  TransactionStatus,
} from '../transactions/dto/transaction.dto';
import {
  AdminOrderDto,
  AdminOrderListDto,
  AdminOrderQueryDto,
  AdminOrderStatus,
  AdminPaymentStatus,
  OrderPriority,
  UpdateOrderStatusDto,
  UpdateOrderShippingDto,
  UpdateOrderNotesDto,
  UpdateOrderPriorityDto,
  UpdateOrderTagsDto,
  OrderStatsDto,
} from './dto/admin-order.dto';

// Interfaces for proper typing
interface ActivityMetadata {
  orderNumber?: string;
  [key: string]: any;
}

@Injectable()
export class AdminOrdersService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
    private orderActivityService: OrderActivityService,
    private emailService: EmailService,
    private configService: ConfigService,
    private transactionsService: TransactionsService
  ) {
    this.stripe = new Stripe(this.configService.stripeSecretKey, {
      apiVersion: '2025-07-30.basil',
    });
  }

  async getOrders(query: AdminOrderQueryDto): Promise<AdminOrderListDto> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      priority,
      tags,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      liveOnly = false,
    } = query;

    // Build where clause
    const where: any = {};

    // Live orders filter (exclude delivered and cancelled)
    if (liveOnly) {
      where.status = {
        notIn: ['delivered', 'cancelled'],
      };
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Payment status filter
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    // Priority filter
    if (priority) {
      where.priority = priority;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { guestUserInfo: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    // Build order by clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get total count
    const total = await this.prisma.order.count({ where });

    // Get orders with pagination
    const orders = await this.prisma.order.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                  where: {
                    isPrimary: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
        paymentHistory: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Map orders to DTOs
    const orderDtos = orders.map((order) => this.mapOrderToAdminDto(order));

    return {
      orders: orderDtos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        status,
        paymentStatus,
        priority,
        search,
        dateRange:
          dateFrom || dateTo
            ? { from: dateFrom || '', to: dateTo || '' }
            : undefined,
      },
    };
  }

  async getOrderById(orderId: string): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                },
              },
            },
          },
        },
        paymentHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapOrderToAdminDto(order);
  }

  async updateOrderStatus(
    orderId: string,
    updateDto: UpdateOrderStatusDto,
    userId?: string
  ): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updateData: any = {
      status: updateDto.status,
      internalNotes: updateDto.notes
        ? `${
            order.internalNotes || ''
          }\n[${new Date().toISOString()}] Status changed to ${
            updateDto.status
          }: ${updateDto.notes}`.trim()
        : order.internalNotes,
    };

    // Set actualDelivery when status is changed to "delivered"
    if (updateDto.status === 'delivered') {
      updateData.actualDelivery = new Date();
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                },
              },
            },
          },
        },
        paymentHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Log activity
    await this.activityService.logOrderActivity(
      orderId,
      `status updated to ${updateDto.status}`,
      userId || 'admin'
    );

    // Track detailed order activity
    await this.orderActivityService.createActivity(
      {
        orderId,
        action: 'status_change',
        field: 'status',
        oldValue: order.status,
        newValue: updateDto.status,
        metadata: {
          notes: updateDto.notes,
        },
      },
      userId
    );

    return this.mapOrderToAdminDto(updatedOrder);
  }

  async updateOrderShipping(
    orderId: string,
    updateDto: UpdateOrderShippingDto,
    userId?: string
  ): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updateData: any = {};

    if (updateDto.trackingNumber !== undefined) {
      updateData.trackingNumber = updateDto.trackingNumber;
    }
    if (updateDto.carrier !== undefined) {
      updateData.carrier = updateDto.carrier;
    }
    if (updateDto.estimatedDelivery !== undefined) {
      updateData.estimatedDelivery = new Date(updateDto.estimatedDelivery);
    }
    if (updateDto.actualDelivery !== undefined) {
      updateData.actualDelivery = new Date(updateDto.actualDelivery);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                },
              },
            },
          },
        },
        paymentHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Log activity
    await this.activityService.logOrderActivity(
      orderId,
      'shipping information updated',
      userId || 'admin'
    );

    // Track detailed shipping activities
    if (updateDto.trackingNumber !== undefined) {
      await this.orderActivityService.createActivity(
        {
          orderId,
          action: 'shipping_update',
          field: 'trackingNumber',
          oldValue: order.trackingNumber || undefined,
          newValue: updateDto.trackingNumber || undefined,
        },
        userId
      );
    }
    if (updateDto.carrier !== undefined) {
      await this.orderActivityService.createActivity(
        {
          orderId,
          action: 'shipping_update',
          field: 'carrier',
          oldValue: order.carrier || undefined,
          newValue: updateDto.carrier || undefined,
        },
        userId
      );
    }
    if (updateDto.estimatedDelivery !== undefined) {
      await this.orderActivityService.createActivity(
        {
          orderId,
          action: 'shipping_update',
          field: 'estimatedDelivery',
          oldValue: order.estimatedDelivery?.toISOString() || undefined,
          newValue: updateDto.estimatedDelivery || undefined,
        },
        userId
      );
    }
    if (updateDto.actualDelivery !== undefined) {
      await this.orderActivityService.createActivity(
        {
          orderId,
          action: 'shipping_update',
          field: 'actualDelivery',
          oldValue: order.actualDelivery?.toISOString() || undefined,
          newValue: updateDto.actualDelivery || undefined,
        },
        userId
      );
    }

    return this.mapOrderToAdminDto(updatedOrder);
  }

  async updateOrderNotes(
    orderId: string,
    updateDto: UpdateOrderNotesDto,
    userId?: string
  ): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        notes: updateDto.notes,
        internalNotes: updateDto.internalNotes,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                },
              },
            },
          },
        },
        paymentHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Log activity
    await this.activityService.logOrderActivity(
      orderId,
      'notes updated',
      userId || 'admin'
    );

    // Track detailed notes activities
    if (updateDto.notes !== undefined) {
      await this.orderActivityService.createActivity(
        {
          orderId,
          action: 'notes_update',
          field: 'notes',
          oldValue: order.notes || undefined,
          newValue: updateDto.notes || undefined,
        },
        userId
      );
    }
    if (updateDto.internalNotes !== undefined) {
      await this.orderActivityService.createActivity(
        {
          orderId,
          action: 'notes_update',
          field: 'internalNotes',
          oldValue: order.internalNotes || undefined,
          newValue: updateDto.internalNotes || undefined,
        },
        userId
      );
    }

    return this.mapOrderToAdminDto(updatedOrder);
  }

  async updateOrderPriority(
    orderId: string,
    updateDto: UpdateOrderPriorityDto,
    userId?: string
  ): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        priority: updateDto.priority,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                },
              },
            },
          },
        },
        paymentHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Log activity
    await this.activityService.logOrderActivity(
      orderId,
      `priority updated to ${updateDto.priority}`,
      userId || 'admin'
    );

    return this.mapOrderToAdminDto(updatedOrder);
  }

  async updateOrderTags(
    orderId: string,
    updateDto: UpdateOrderTagsDto,
    userId?: string
  ): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        tags: updateDto.tags,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                },
              },
            },
          },
        },
        paymentHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Log activity
    await this.activityService.logOrderActivity(
      orderId,
      `tags updated to: ${updateDto.tags.join(', ')}`,
      userId || 'admin'
    );

    return this.mapOrderToAdminDto(updatedOrder);
  }

  async getOrderStats(): Promise<OrderStatsDto> {
    // Get total orders count
    const totalOrders = await this.prisma.order.count();

    // Get orders by status
    const statusCounts = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const byStatus = statusCounts.reduce((acc, item) => {
      acc[item.status as AdminOrderStatus] = item._count.status;
      return acc;
    }, {} as Record<AdminOrderStatus, number>);

    // Get orders by payment status
    const paymentStatusCounts = await this.prisma.order.groupBy({
      by: ['paymentStatus'],
      _count: {
        paymentStatus: true,
      },
    });

    const byPaymentStatus = paymentStatusCounts.reduce((acc, item) => {
      acc[item.paymentStatus as AdminPaymentStatus] = item._count.paymentStatus;
      return acc;
    }, {} as Record<AdminPaymentStatus, number>);

    // Get orders by priority
    const priorityCounts = await this.prisma.order.groupBy({
      by: ['priority'],
      _count: {
        priority: true,
      },
    });

    const byPriority = priorityCounts.reduce((acc, item) => {
      acc[item.priority as OrderPriority] = item._count.priority;
      return acc;
    }, {} as Record<OrderPriority, number>);

    // Get revenue statistics
    const revenueStats = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      _avg: {
        total: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const thisMonth = new Date(today);
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    const [todayRevenue, thisWeekRevenue, thisMonthRevenue] = await Promise.all(
      [
        this.prisma.order.aggregate({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
          _sum: {
            total: true,
          },
        }),
        this.prisma.order.aggregate({
          where: {
            createdAt: {
              gte: thisWeek,
            },
          },
          _sum: {
            total: true,
          },
        }),
        this.prisma.order.aggregate({
          where: {
            createdAt: {
              gte: thisMonth,
            },
          },
          _sum: {
            total: true,
          },
        }),
      ]
    );

    // Get recent activity
    const recentActivity = await this.prisma.activity.findMany({
      where: {
        type: 'order',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      totalOrders,
      byStatus,
      byPaymentStatus,
      byPriority,
      revenue: {
        total: revenueStats._sum.total || 0,
        average: revenueStats._avg.total || 0,
        today: todayRevenue._sum.total || 0,
        thisWeek: thisWeekRevenue._sum.total || 0,
        thisMonth: thisMonthRevenue._sum.total || 0,
      },
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        orderNumber:
          (activity.metadata as ActivityMetadata)?.orderNumber || 'N/A',
        action: activity.title,
        timestamp: activity.createdAt.toISOString(),
        user: activity.user?.name,
      })),
    };
  }

  async markAsDelivered(
    orderId: string,
    userId?: string
  ): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'delivered') {
      throw new BadRequestException('Order is already marked as delivered');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'delivered',
        actualDelivery: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                },
              },
            },
          },
        },
        paymentHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Log activity
    await this.activityService.logOrderActivity(
      orderId,
      'marked as delivered',
      userId || 'admin'
    );

    return this.mapOrderToAdminDto(updatedOrder);
  }

  async cancelOrder(
    orderId: string,
    notes?: string,
    userId?: string
  ): Promise<AdminOrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'delivered') {
      throw new BadRequestException('Cannot cancel delivered order');
    }

    if (order.status === 'cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }

    // Process refund if payment was made
    let refundIntent;
    if (order.paymentStatus === 'paid' && order.stripePaymentIntentId) {
      try {
        refundIntent = await this.stripe.refunds.create({
          payment_intent: order.stripePaymentIntentId,
          reason: 'requested_by_customer',
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            cancelledBy: userId || 'admin',
            cancellationNotes: notes || '',
          },
        });
      } catch (error) {
        console.error('Error processing refund:', error);
        throw new BadRequestException('Failed to process refund');
      }
    }

    // Restore stock for all items
    for (const item of order.items) {
      if (item.variantId) {
        const variantStock = await this.prisma.stock.findFirst({
          where: { variantId: item.variantId },
        });

        if (variantStock) {
          const newQuantity = variantStock.quantity + item.quantity;
          await this.prisma.stock.update({
            where: { id: variantStock.id },
            data: {
              quantity: newQuantity,
              isInStock: newQuantity > 0,
            },
          });
        }
      }

      // Also restore product-level stock
      if (item.variant) {
        const productStock = await this.prisma.stock.findFirst({
          where: { productId: item.variant.productId },
        });

        if (productStock) {
          const newQuantity = productStock.quantity + item.quantity;
          await this.prisma.stock.update({
            where: { id: productStock.id },
            data: {
              quantity: newQuantity,
              isInStock: newQuantity > 0,
            },
          });
        }
      }
    }

    // Update order status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        paymentStatus:
          order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus,
        internalNotes: notes
          ? `${
              order.internalNotes || ''
            }\n[${new Date().toISOString()}] Order cancelled by admin: ${notes}`.trim()
          : order.internalNotes,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  include: {
                    file: true,
                  },
                },
              },
            },
          },
        },
        paymentHistory: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Create transaction record for refund
    if (order.paymentStatus === 'paid' && refundIntent) {
      try {
        await this.transactionsService.createTransaction(
          {
            orderId: order.id,
            userId: order.userId || undefined,
            type: TransactionType.REFUNDED,
            status: TransactionStatus.COMPLETED,
            amount: -order.total, // Negative amount for refund
            currency: 'USD',
            description: `Refund for cancelled order ${order.orderNumber}`,
            reference: refundIntent.id,
            metadata: {
              refundId: refundIntent.id,
              refundAmount: refundIntent.amount / 100, // Convert from cents
              cancellationNotes: notes || '',
              cancelledBy: userId || 'admin',
            },
            netAmount: -order.total,
            processedAt: new Date().toISOString(),
          },
          userId
        );
      } catch (error) {
        console.error('Error creating transaction record:', error);
        // Don't throw - transaction logging failure shouldn't block cancellation
      }
    }

    // Log activity
    await this.activityService.logOrderActivity(
      orderId,
      'order cancelled and refunded',
      userId || 'admin'
    );

    // Track detailed cancellation activity
    await this.orderActivityService.createActivity(
      {
        orderId,
        action: 'order_cancelled',
        field: 'status',
        oldValue: order.status,
        newValue: 'cancelled',
        metadata: {
          notes,
          refundProcessed: order.paymentStatus === 'paid',
        },
      },
      userId
    );

    // Send cancellation email to customer
    try {
      const customerEmail =
        order.user?.email || JSON.parse(order.guestUserInfo || '{}').email;
      if (customerEmail) {
        await this.emailService.sendEmail({
          to: customerEmail,
          subject: `Order ${order.orderNumber} Cancelled`,
          html: `
            <h2>Order Cancelled</h2>
            <p>Your order ${order.orderNumber} has been cancelled.</p>
            ${
              order.paymentStatus === 'paid'
                ? '<p>A refund has been processed and will appear in your account within 5-10 business days.</p>'
                : ''
            }
            ${notes ? `<p>Reason: ${notes}</p>` : ''}
            <p>If you have any questions, please contact our support team.</p>
          `,
        });
      }
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      // Don't throw - email failure shouldn't block cancellation
    }

    return this.mapOrderToAdminDto(updatedOrder);
  }

  private mapOrderToAdminDto(order: any): AdminOrderDto {
    // Parse customer information
    let customer;
    if (order.user) {
      customer = {
        name: order.user.name,
        email: order.user.email,
        isGuest: false,
      };
    } else if (order.guestUserInfo) {
      const guestInfo = JSON.parse(order.guestUserInfo);
      customer = {
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        isGuest: true,
      };
    } else {
      customer = {
        name: 'Unknown Customer',
        email: 'unknown@example.com',
        isGuest: true,
      };
    }

    // Parse shipping address
    const shippingAddress = JSON.parse(order.shippingAddress);

    // Map order items
    const items = order.items.map((item: any) => ({
      id: item.id,
      variantId: item.variantId,
      variant: {
        id: item.variant.id,
        name: item.variant.name,
        sku: item.variant.sku,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          sku: item.variant.product.sku,
          category: item.variant.product.category
            ? {
                id: item.variant.product.category.id,
                name: item.variant.product.category.name,
              }
            : undefined,
          subcategory: item.variant.product.subcategory
            ? {
                id: item.variant.product.subcategory.id,
                name: item.variant.product.subcategory.name,
              }
            : undefined,
        },
        images: item.variant.images?.map((img: any) => ({
          id: img.id,
          url: img.file?.secureUrl || img.url,
          isPrimary: img.isPrimary,
        })),
      },
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.quantity * item.price,
    }));

    // Get payment information
    const latestPayment = order.paymentHistory?.[0];
    const payment = latestPayment
      ? {
          stripePaymentIntentId: latestPayment.stripePaymentIntentId,
          paymentMethod: latestPayment.paymentMethod,
          last4: latestPayment.last4,
          brand: latestPayment.brand,
        }
      : undefined;

    return {
      id: order.id,
      orderNumber: order.orderNumber || order.id,
      userId: order.userId,
      customer,
      shippingAddress,
      items,
      totals: {
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        tax: order.tax,
        total: order.total,
      },
      status: order.status as AdminOrderStatus,
      paymentStatus: order.paymentStatus as AdminPaymentStatus,
      priority: (order.priority as OrderPriority) || OrderPriority.NORMAL,
      tags: order.tags || [],
      notes: order.notes,
      internalNotes: order.internalNotes,
      shipping: {
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        estimatedDelivery: order.estimatedDelivery?.toISOString(),
        actualDelivery: order.actualDelivery?.toISOString(),
      },
      payment,
      timestamps: {
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      },
      totalItems: items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ),
    };
  }

  async exportToCSV(query: AdminOrderQueryDto): Promise<string> {
    // Fetch all orders matching the query (no pagination for export)
    const orders = await this.getAllOrdersForExport(query);

    // Create CSV header
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Status',
      'Payment Status',
      'Priority',
      'Total Items',
      'Subtotal',
      'Shipping Cost',
      'Tax',
      'Total',
      'Order Date',
      'Updated Date',
      'Carrier',
      'Tracking Number',
      'Estimated Delivery',
      'Actual Delivery',
    ];

    // Create CSV rows
    const rows = orders.map((order) => [
      order.orderNumber,
      order.customer.name,
      order.customer.email,
      order.status.toUpperCase(),
      order.paymentStatus.toUpperCase(),
      order.priority.toUpperCase(),
      order.totalItems.toString(),
      order.totals.subtotal.toString(),
      order.totals.shippingCost.toString(),
      order.totals.tax.toString(),
      order.totals.total.toString(),
      order.timestamps.createdAt,
      order.timestamps.updatedAt,
      order.shipping?.carrier || 'N/A',
      order.shipping?.trackingNumber || 'N/A',
      order.shipping?.estimatedDelivery || 'N/A',
      order.shipping?.actualDelivery || 'N/A',
    ]);

    // Combine headers and rows
    const csvLines = [headers.join(',')];
    rows.forEach((row) => {
      csvLines.push(row.map((cell) => `"${cell}"`).join(','));
    });

    return csvLines.join('\n');
  }

  private async getAllOrdersForExport(
    query: AdminOrderQueryDto
  ): Promise<AdminOrderDto[]> {
    const {
      search,
      status,
      paymentStatus,
      priority,
      tags,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        {
          user: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
        {
          user: {
            email: { contains: search, mode: 'insensitive' },
          },
        },
        {
          guestUserInfo: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Payment status filter
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    // Priority filter
    if (priority) {
      where.priority = priority;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Fetch orders
    const orders = await this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    subcategory: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                images: {
                  select: {
                    id: true,
                    file: {
                      select: {
                        secureUrl: true,
                      },
                    },
                    isPrimary: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // Map to DTOs
    return orders.map((order) => this.mapOrderToAdminDto(order));
  }
}
