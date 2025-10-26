import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponseDto,
  TransactionQueryDto,
  TransactionListResponseDto,
  TransactionStatsDto,
  CreateOrderTransactionDto,
  TransactionType,
  TransactionStatus,
  PaymentMethod,
} from './dto/transaction.dto';
import { Prisma } from '@prisma/client';
import PDFDocument from 'pdfkit';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  // ==================== TRANSACTION CRUD OPERATIONS ====================

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId?: string
  ): Promise<TransactionResponseDto> {
    try {
      // Calculate net amount if not provided
      const processingFee = createTransactionDto.processingFee || 0;
      const platformFee = createTransactionDto.platformFee || 0;
      const netAmount =
        createTransactionDto.netAmount ||
        createTransactionDto.amount - processingFee - platformFee;

      const transaction = await this.prisma.transaction.create({
        data: {
          ...createTransactionDto,
          netAmount,
          processedAt: createTransactionDto.processedAt
            ? new Date(createTransactionDto.processedAt)
            : null,
        },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Log activity
      await this.activityService.logSystemActivity(
        'Transaction Created',
        `Transaction ${transaction.id} created for ${createTransactionDto.type}`,
        {
          transactionId: transaction.id,
          type: createTransactionDto.type,
          amount: createTransactionDto.amount,
          orderId: createTransactionDto.orderId,
        }
      );

      return this.mapToTransactionResponse(transaction);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create transaction: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async createOrderTransaction(
    createOrderTransactionDto: CreateOrderTransactionDto,
    userId?: string
  ): Promise<TransactionResponseDto> {
    try {
      // Verify order exists
      const order = await this.prisma.order.findUnique({
        where: { id: createOrderTransactionDto.orderId },
        select: { id: true, orderNumber: true, total: true, status: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Calculate fees if not provided
      const processingFee = createOrderTransactionDto.processingFee || 0;
      const platformFee = createOrderTransactionDto.platformFee || 0;
      const netAmount =
        createOrderTransactionDto.amount - processingFee - platformFee;

      const transaction = await this.prisma.transaction.create({
        data: {
          orderId: createOrderTransactionDto.orderId,
          userId: createOrderTransactionDto.userId,
          type: TransactionType.ORDER_PAYMENT,
          status: TransactionStatus.COMPLETED,
          amount: createOrderTransactionDto.amount,
          currency: 'USD',
          description: `Payment for Order #${order.orderNumber}`,
          reference: createOrderTransactionDto.reference,
          paymentMethod: createOrderTransactionDto.paymentMethod,
          paymentMethodDetails: createOrderTransactionDto.paymentMethodDetails,
          processingFee,
          platformFee,
          netAmount,
          processedAt: new Date(),
        },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Log activity
      await this.activityService.logOrderActivity(
        createOrderTransactionDto.orderId,
        'Payment Received',
        userId
      );

      return this.mapToTransactionResponse(transaction);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create order transaction: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async getAllTransactions(
    query: TransactionQueryDto
  ): Promise<TransactionListResponseDto> {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      status,
      paymentMethod,
      userId,
      orderId,
      minAmount,
      maxAmount,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: Prisma.TransactionWhereInput = {};

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (userId) {
      where.userId = userId;
    }

    if (orderId) {
      where.orderId = orderId;
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) {
        where.amount.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.amount.lte = maxAmount;
      }
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Build order by clause
    const orderBy: Prisma.TransactionOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    // Execute query with pagination
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      transactions: transactions.map((transaction) =>
        this.mapToTransactionResponse(transaction)
      ),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      filters: {
        type,
        status,
        paymentMethod,
        search,
        dateRange:
          dateFrom || dateTo
            ? { from: dateFrom || '', to: dateTo || '' }
            : undefined,
      },
    };
  }

  async getTransactionById(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            subtotal: true,
            shippingCost: true,
            tax: true,
            status: true,
            guestUserInfo: true,
            isGuestOrder: true,
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
                      },
                    },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.mapToTransactionResponse(transaction);
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId?: string
  ): Promise<TransactionResponseDto> {
    try {
      // Check if transaction exists
      const existingTransaction = await this.prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      // Calculate net amount if amount or fees are being updated
      let netAmount = existingTransaction.netAmount;
      if (
        updateTransactionDto.processingFee !== undefined ||
        updateTransactionDto.platformFee !== undefined
      ) {
        const processingFee =
          updateTransactionDto.processingFee ??
          existingTransaction.processingFee ??
          0;
        const platformFee =
          updateTransactionDto.platformFee ??
          existingTransaction.platformFee ??
          0;
        netAmount = existingTransaction.amount - processingFee - platformFee;
      }

      const transaction = await this.prisma.transaction.update({
        where: { id },
        data: {
          ...updateTransactionDto,
          netAmount,
          processedAt: updateTransactionDto.processedAt
            ? new Date(updateTransactionDto.processedAt)
            : undefined,
        },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Log activity
      await this.activityService.logSystemActivity(
        'Transaction Updated',
        `Transaction ${id} updated`,
        {
          transactionId: id,
          changes: updateTransactionDto,
        }
      );

      return this.mapToTransactionResponse(transaction);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update transaction: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async deleteTransaction(id: string, userId?: string): Promise<void> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      await this.prisma.transaction.delete({
        where: { id },
      });

      // Log activity
      await this.activityService.logSystemActivity(
        'Transaction Deleted',
        `Transaction ${id} deleted`,
        {
          transactionId: id,
          type: transaction.type,
          amount: transaction.amount,
        }
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete transaction: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  // ==================== TRANSACTION STATISTICS ====================

  async getTransactionStats(): Promise<TransactionStatsDto> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get basic counts
    const [
      totalTransactions,
      byType,
      byStatus,
      byPaymentMethod,
      recentTransactions,
    ] = await Promise.all([
      this.prisma.transaction.count(),
      this.getTransactionsByType(),
      this.getTransactionsByStatus(),
      this.getTransactionsByPaymentMethod(),
      this.getRecentTransactions(10),
    ]);

    // Get financial data
    const [
      totalRevenue,
      totalFees,
      todayRevenue,
      thisWeekRevenue,
      thisMonthRevenue,
    ] = await Promise.all([
      this.getTotalRevenue(),
      this.getTotalFees(),
      this.getRevenueForPeriod(today, now),
      this.getRevenueForPeriod(weekAgo, now),
      this.getRevenueForPeriod(monthAgo, now),
    ]);

    const netRevenue = totalRevenue - totalFees;
    const averageTransaction =
      totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalTransactions,
      byType,
      byStatus,
      byPaymentMethod,
      financial: {
        totalRevenue,
        totalFees,
        netRevenue,
        averageTransaction,
        todayRevenue,
        thisWeekRevenue,
        thisMonthRevenue,
      },
      recentTransactions,
    };
  }

  // ==================== HELPER METHODS ====================

  private async getTransactionsByType(): Promise<
    Record<TransactionType, number>
  > {
    const result = await this.prisma.transaction.groupBy({
      by: ['type'],
      _count: { type: true },
    });

    const byType: Record<TransactionType, number> = {} as Record<
      TransactionType,
      number
    >;

    // Initialize all types with 0
    Object.values(TransactionType).forEach((type) => {
      byType[type] = 0;
    });

    // Fill in actual counts
    result.forEach((item) => {
      byType[item.type as TransactionType] = item._count.type;
    });

    return byType;
  }

  private async getTransactionsByStatus(): Promise<
    Record<TransactionStatus, number>
  > {
    const result = await this.prisma.transaction.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const byStatus: Record<TransactionStatus, number> = {} as Record<
      TransactionStatus,
      number
    >;

    // Initialize all statuses with 0
    Object.values(TransactionStatus).forEach((status) => {
      byStatus[status] = 0;
    });

    // Fill in actual counts
    result.forEach((item) => {
      byStatus[item.status as TransactionStatus] = item._count.status;
    });

    return byStatus;
  }

  private async getTransactionsByPaymentMethod(): Promise<
    Record<PaymentMethod, number>
  > {
    const result = await this.prisma.transaction.groupBy({
      by: ['paymentMethod'],
      _count: { paymentMethod: true },
      where: {
        paymentMethod: { not: null },
      },
    });

    const byPaymentMethod: Record<PaymentMethod, number> = {} as Record<
      PaymentMethod,
      number
    >;

    // Initialize all payment methods with 0
    Object.values(PaymentMethod).forEach((method) => {
      byPaymentMethod[method] = 0;
    });

    // Fill in actual counts
    result.forEach((item) => {
      if (item.paymentMethod) {
        byPaymentMethod[item.paymentMethod as PaymentMethod] =
          item._count.paymentMethod;
      }
    });

    return byPaymentMethod;
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: TransactionType.ORDER_PAYMENT,
        status: TransactionStatus.COMPLETED,
      },
    });

    return result._sum.amount || 0;
  }

  private async getTotalFees(): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      _sum: {
        processingFee: true,
        platformFee: true,
      },
      where: {
        status: TransactionStatus.COMPLETED,
      },
    });

    return (result._sum.processingFee || 0) + (result._sum.platformFee || 0);
  }

  private async getRevenueForPeriod(from: Date, to: Date): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        type: TransactionType.ORDER_PAYMENT,
        status: TransactionStatus.COMPLETED,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });

    return result._sum.amount || 0;
  }

  private async getRecentTransactions(limit: number): Promise<
    Array<{
      id: string;
      type: TransactionType;
      amount: number;
      description: string;
      createdAt: string;
    }>
  > {
    const transactions = await this.prisma.transaction.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true,
      },
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type as TransactionType,
      amount: transaction.amount,
      description: transaction.description,
      createdAt: transaction.createdAt.toISOString(),
    }));
  }

  private mapToTransactionResponse(transaction: any): TransactionResponseDto {
    // Mask sensitive payment method details
    let maskedPaymentMethodDetails = transaction.paymentMethodDetails;
    if (
      maskedPaymentMethodDetails &&
      typeof maskedPaymentMethodDetails === 'object'
    ) {
      maskedPaymentMethodDetails = { ...maskedPaymentMethodDetails };

      // Mask card numbers (last4 field)
      if (maskedPaymentMethodDetails.last4) {
        maskedPaymentMethodDetails.last4 = `****${maskedPaymentMethodDetails.last4}`;
      }

      // Mask any fields that might contain sensitive data
      if (maskedPaymentMethodDetails.card?.number) {
        maskedPaymentMethodDetails.card.number = '****-****-****-****';
      }

      if (maskedPaymentMethodDetails.account_number) {
        maskedPaymentMethodDetails.account_number = '****-****-****-****';
      }
    }

    return {
      id: transaction.id,
      orderId: transaction.orderId,
      userId: transaction.userId,
      type: transaction.type,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      description: transaction.description,
      reference: transaction.reference,
      metadata: transaction.metadata,
      paymentMethod: transaction.paymentMethod,
      paymentMethodDetails: maskedPaymentMethodDetails,
      processingFee: transaction.processingFee,
      platformFee: transaction.platformFee,
      netAmount: transaction.netAmount,
      processedAt: transaction.processedAt,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      order: transaction.order,
      user: transaction.user,
    };
  }

  // ==================== EXPORT OPERATIONS ====================

  async exportToCSV(query: TransactionQueryDto): Promise<string> {
    // Fetch all transactions matching the query (no pagination for export)
    const transactions = await this.getAllTransactionsForExport(query);

    // Create CSV header
    const headers = [
      'Transaction ID',
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Type',
      'Status',
      'Amount',
      'Currency',
      'Payment Method',
      'Processing Fee',
      'Platform Fee',
      'Net Amount',
      'Description',
      'Reference',
      'Created At',
      'Processed At',
    ];

    // Create CSV rows
    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.order?.orderNumber || 'N/A',
      transaction.user?.name || 'Guest',
      transaction.user?.email || 'N/A',
      transaction.type.replace('_', ' ').toUpperCase(),
      transaction.status.toUpperCase(),
      transaction.amount.toString(),
      transaction.currency,
      transaction.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A',
      transaction.processingFee?.toString() || '0',
      transaction.platformFee?.toString() || '0',
      transaction.netAmount.toString(),
      transaction.description || 'N/A',
      transaction.reference || 'N/A',
      new Date(transaction.createdAt).toISOString(),
      transaction.processedAt
        ? new Date(transaction.processedAt).toISOString()
        : 'N/A',
    ]);

    // Combine headers and rows
    const csvLines = [headers.join(',')];
    rows.forEach((row) => {
      csvLines.push(row.map((cell) => `"${cell}"`).join(','));
    });

    return csvLines.join('\n');
  }

  private async getAllTransactionsForExport(
    query: TransactionQueryDto
  ): Promise<TransactionResponseDto[]> {
    const {
      search,
      type,
      status,
      paymentMethod,
      userId,
      orderId,
      minAmount,
      maxAmount,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: Prisma.TransactionWhereInput = {};

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (userId) {
      where.userId = userId;
    }

    if (orderId) {
      where.orderId = orderId;
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) {
        where.amount.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.amount.lte = maxAmount;
      }
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    // Build order by clause
    const orderBy: Prisma.TransactionOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    // Fetch all transactions (no pagination)
    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Map to response DTOs
    return transactions.map((transaction) =>
      this.mapToTransactionResponse(transaction)
    );
  }

  async generateInvoice(transactionId: string): Promise<Buffer> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            subtotal: true,
            shippingCost: true,
            tax: true,
            total: true,
            status: true,
            guestUserInfo: true,
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const formatCurrency = (amount: number, currency = 'USD') => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    };

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const order = transaction.order;
    const subtotal = order?.subtotal || transaction.amount;
    const shippingCost = order?.shippingCost || 0;
    const tax = order?.tax || 0;
    const processingFee = transaction.processingFee || 0;
    const total = transaction.netAmount;

    const items = order?.items || [];

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    // Add content to PDF
    // Header
    doc.fontSize(28).fillColor('#3b82f6').text('EXCLUSIVE', 50, 50);

    doc
      .fontSize(36)
      .fillColor('#1e40af')
      .text('INVOICE', 50, 50, { align: 'right', width: 500 });

    doc
      .fontSize(11)
      .fillColor('#666')
      .text(
        `Transaction ID: TXN-${transaction.id.slice(-8).toUpperCase()}`,
        50,
        92,
        { align: 'right', width: 500 }
      );

    // Line separator
    doc.moveTo(50, 105).lineTo(550, 105).stroke('#3b82f6').lineWidth(3);

    // Bill To section
    doc.fontSize(18).fillColor('#1e40af').text('Bill To', 50, 130);

    // Parse guest user info if available
    let guestInfo: any = null;
    if (transaction.order?.guestUserInfo) {
      try {
        guestInfo = JSON.parse(transaction.order.guestUserInfo);
      } catch {
        // Ignore parse errors
      }
    }

    const customerName = transaction.user?.name || guestInfo?.name || 'Guest';
    const customerEmail = transaction.user?.email || guestInfo?.email || 'N/A';
    const customerPhone = guestInfo?.phone || 'N/A';

    doc.fontSize(12).fillColor('#333').text(customerName, 50, 155);

    doc.fontSize(11).fillColor('#666').text(customerEmail, 50, 173);

    doc.fontSize(11).fillColor('#666').text(customerPhone, 50, 191);

    // Transaction Details section (right column)
    doc
      .fontSize(18)
      .fillColor('#1e40af')
      .text('Transaction Details', 50, 130, { align: 'right', width: 500 });

    doc
      .fontSize(12)
      .fillColor('#555')
      .text(`Date: ${formatDate(transaction.createdAt)}`, 50, 155, {
        align: 'right',
        width: 500,
      });

    doc
      .fontSize(12)
      .fillColor('#555')
      .text(
        `Order Number: ${transaction.order?.orderNumber || 'N/A'}`,
        50,
        173,
        { align: 'right', width: 500 }
      );

    doc
      .fontSize(12)
      .fillColor('#555')
      .text(`Status: ${transaction.status.toUpperCase()}`, 50, 191, {
        align: 'right',
        width: 500,
      });

    // Items table header
    doc.rect(50, 220, 500, 30).fill('#3b82f6');

    doc.fontSize(12).fillColor('#fff').text('Item', 60, 230, { width: 240 });
    doc
      .fontSize(12)
      .fillColor('#fff')
      .text('Quantity', 300, 230, { width: 80, align: 'center' });
    doc
      .fontSize(12)
      .fillColor('#fff')
      .text('Price', 380, 230, { align: 'right', width: 70 });
    doc
      .fontSize(12)
      .fillColor('#fff')
      .text('Total', 450, 230, { align: 'right', width: 90 });

    // Items
    let yPosition = 255;
    items.forEach((item: any) => {
      const productName =
        item.variant?.product?.name || item.variant?.name || 'Product';
      const variantName = item.variant?.name;

      // Check if this item has a variant name separate from product name
      const hasVariantDetails = variantName && item.variant?.product?.name;

      doc
        .fontSize(10)
        .fillColor('#333')
        .text(productName, 60, yPosition, { width: 240 });

      if (hasVariantDetails) {
        doc
          .fontSize(8)
          .fillColor('#666')
          .text(variantName, 60, yPosition + 12, { width: 240 });
      }

      doc
        .fontSize(10)
        .fillColor('#333')
        .text(`${item.quantity}`, 300, yPosition, {
          width: 80,
          align: 'center',
        });

      doc
        .fontSize(10)
        .fillColor('#333')
        .text(
          formatCurrency(item.price, transaction.currency),
          380,
          yPosition,
          {
            align: 'right',
            width: 70,
          }
        );

      doc
        .fontSize(10)
        .fillColor('#333')
        .text(
          formatCurrency(item.price * item.quantity, transaction.currency),
          450,
          yPosition,
          { align: 'right', width: 90 }
        );

      yPosition += hasVariantDetails ? 32 : 22;
    });

    // Totals section
    yPosition += 25;
    doc.fontSize(12).fillColor('#333').text('Subtotal:', 350, yPosition);

    doc
      .fontSize(12)
      .fillColor('#333')
      .text(formatCurrency(subtotal, transaction.currency), 430, yPosition, {
        align: 'right',
        width: 120,
      });

    if (shippingCost > 0) {
      yPosition += 20;
      doc.fontSize(12).fillColor('#333').text('Shipping:', 350, yPosition);

      doc
        .fontSize(12)
        .fillColor('#333')
        .text(
          formatCurrency(shippingCost, transaction.currency),
          430,
          yPosition,
          {
            align: 'right',
            width: 120,
          }
        );
    }

    if (tax > 0) {
      yPosition += 20;
      doc.fontSize(12).fillColor('#333').text('Tax:', 350, yPosition);

      doc
        .fontSize(12)
        .fillColor('#333')
        .text(formatCurrency(tax, transaction.currency), 430, yPosition, {
          align: 'right',
          width: 120,
        });
    }

    if (processingFee > 0) {
      yPosition += 20;
      doc
        .fontSize(12)
        .fillColor('#333')
        .text('Processing Fee:', 350, yPosition);

      doc
        .fontSize(12)
        .fillColor('#333')
        .text(
          formatCurrency(processingFee, transaction.currency),
          430,
          yPosition,
          { align: 'right', width: 120 }
        );
    }

    yPosition += 25;
    doc
      .fillColor('#1e40af')
      .rect(350, yPosition - 5, 200, 35)
      .fill('#eff6ff');

    doc
      .fontSize(14)
      .fillColor('#1e40af')
      .text('TOTAL:', 360, yPosition + 5);

    doc
      .fontSize(14)
      .fillColor('#1e40af')
      .text(formatCurrency(total, transaction.currency), 430, yPosition + 5, {
        align: 'right',
        width: 120,
      });

    // Footer
    yPosition += 50;
    doc
      .fontSize(14)
      .fillColor('#666')
      .text('Thank you for your business!', 50, yPosition, {
        align: 'center',
        width: 500,
      });

    doc
      .fontSize(12)
      .fillColor('#999')
      .text('This is a computer-generated invoice.', 50, yPosition + 22, {
        align: 'center',
        width: 500,
      });

    // Finalize PDF
    doc.end();

    // Wait for PDF to be generated
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }
}
