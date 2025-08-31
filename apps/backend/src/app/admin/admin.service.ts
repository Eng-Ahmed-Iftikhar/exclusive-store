import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalItems,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      monthlyRevenue,
      lowStockItems,
      pendingReviews,
      activeFlashSales
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getTotalItems(),
      this.getTotalOrders(),
      this.getTotalRevenue(),
      this.getRecentOrders(),
      this.getTopProducts(),
      this.getMonthlyRevenue(),
      this.getLowStockItems(),
      this.getPendingReviews(),
      this.getActiveFlashSales()
    ]);

    return {
      totalUsers,
      totalItems,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      monthlyRevenue,
      lowStockItems,
      pendingReviews,
      activeFlashSales
    };
  }

  private async getTotalUsers() {
    return await this.prisma.user.count();
  }

  private async getTotalItems() {
    return await this.prisma.item.count({
      where: { isActive: true }
    });
  }

  private async getTotalOrders() {
    return await this.prisma.order.count({
      where: { 
        status: { not: 'cancelled' },
        paymentStatus: 'completed'
      }
    });
  }

  private async getTotalRevenue() {
    const orders = await this.prisma.order.findMany({
      where: { 
        status: { not: 'cancelled' },
        paymentStatus: 'completed'
      },
      select: { total: true }
    });

    return orders.reduce((sum, order) => sum + Number(order.total), 0);
  }

  private async getRecentOrders() {
    return await this.prisma.order.findMany({
      where: { 
        status: { not: 'cancelled' },
        paymentStatus: 'completed'
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
  }

  private async getTopProducts() {
    const orderItems = await this.prisma.orderItem.groupBy({
      by: ['itemId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    const topProducts = await Promise.all(
      orderItems.map(async (item) => {
        const itemDetails = await this.prisma.item.findUnique({
          where: { id: item.itemId },
          include: {
            prices: {
              where: { isActive: true },
              take: 1
            }
          }
        });

        if (!itemDetails) return null;

        const totalRevenue = await this.prisma.orderItem.aggregate({
          where: { itemId: item.itemId },
          _sum: {
            price: true
          }
        });

        return {
          id: item.itemId,
          name: itemDetails.name,
          sales: item._sum.quantity || 0,
          revenue: Number(totalRevenue._sum.price) || 0
        };
      })
    );

    return topProducts.filter(Boolean);
  }

  private async getMonthlyRevenue() {
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    const monthlyData = await Promise.all(
      months.map(async (month) => {
        const startDate = new Date(currentYear, month, 1);
        const endDate = new Date(currentYear, month + 1, 0);

        const orders = await this.prisma.order.findMany({
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate
            },
            status: { not: 'cancelled' },
            paymentStatus: 'completed'
          },
          select: { total: true }
        });

        const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const monthName = new Date(currentYear, month, 1).toLocaleString('default', { month: 'short' });

        return {
          month: monthName,
          revenue: Math.round(revenue * 100) / 100
        };
      })
    );

    return monthlyData;
  }

  private async getLowStockItems() {
    return await this.prisma.stock.findMany({
      where: {
        quantity: {
          lte: 10
        }
      },
      include: {
        item: {
          select: { name: true, sku: true }
        }
      },
      orderBy: { quantity: 'asc' },
      take: 5
    });
  }

  private async getPendingReviews() {
    return await this.prisma.review.count({
      where: { isApproved: false }
    });
  }

  private async getActiveFlashSales() {
    return await this.prisma.flashSale.count({
      where: {
        isActive: true,
        endDate: { gt: new Date() }
      }
    });
  }
}
