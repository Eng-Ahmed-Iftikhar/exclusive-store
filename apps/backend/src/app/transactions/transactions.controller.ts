import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponseDto,
  TransactionQueryDto,
  TransactionListResponseDto,
  TransactionStatsDto,
  CreateOrderTransactionDto,
} from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.createTransaction(
      createTransactionDto,
      user.id
    );
  }

  @Post('order')
  @ApiOperation({ summary: 'Create a transaction for an order' })
  @ApiResponse({
    status: 201,
    description: 'Order transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async createOrderTransaction(
    @Body() createOrderTransactionDto: CreateOrderTransactionDto,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.createOrderTransaction(
      createOrderTransactionDto,
      user.id
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: TransactionListResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: [
      'order_payment',
      'refunded',
      'partial_refund',
      'fee',
      'adjustment',
      'commission',
      'chargeback',
    ],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'pending',
      'completed',
      'failed',
      'cancelled',
      'refunded',
      'processing',
    ],
  })
  @ApiQuery({
    name: 'paymentMethod',
    required: false,
    enum: [
      'card',
      'paypal',
      'bank_transfer',
      'wallet',
      'cryptocurrency',
      'cash',
      'other',
    ],
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'orderId', required: false, type: String })
  @ApiQuery({ name: 'minAmount', required: false, type: Number })
  @ApiQuery({ name: 'maxAmount', required: false, type: Number })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'updatedAt', 'amount', 'processedAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getAllTransactions(
    @Query() query: TransactionQueryDto
  ): Promise<TransactionListResponseDto> {
    return this.transactionsService.getAllTransactions(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get transaction statistics' })
  @ApiResponse({
    status: 200,
    description: 'Transaction statistics retrieved successfully',
    type: TransactionStatsDto,
  })
  async getTransactionStats(): Promise<TransactionStatsDto> {
    return this.transactionsService.getTransactionStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransactionById(
    @Param('id') id: string
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.getTransactionById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @CurrentUser() user: any
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.updateTransaction(
      id,
      updateTransactionDto,
      user.id
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async deleteTransaction(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.transactionsService.deleteTransaction(id, user.id);
  }

  // ==================== USER-SPECIFIC ENDPOINTS ====================

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get transactions for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'User transactions retrieved successfully',
    type: TransactionListResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: [
      'order_payment',
      'refunded',
      'partial_refund',
      'fee',
      'adjustment',
      'commission',
      'chargeback',
    ],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'pending',
      'completed',
      'failed',
      'cancelled',
      'refunded',
      'processing',
    ],
  })
  async getUserTransactions(
    @Param('userId') userId: string,
    @Query() query: Omit<TransactionQueryDto, 'userId'>
  ): Promise<TransactionListResponseDto> {
    return this.transactionsService.getAllTransactions({
      ...query,
      userId,
    });
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get transactions for a specific order' })
  @ApiResponse({
    status: 200,
    description: 'Order transactions retrieved successfully',
    type: TransactionListResponseDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: [
      'order_payment',
      'refunded',
      'partial_refund',
      'fee',
      'adjustment',
      'commission',
      'chargeback',
    ],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'pending',
      'completed',
      'failed',
      'cancelled',
      'refunded',
      'processing',
    ],
  })
  async getOrderTransactions(
    @Param('orderId') orderId: string,
    @Query() query: Omit<TransactionQueryDto, 'orderId'>
  ): Promise<TransactionListResponseDto> {
    return this.transactionsService.getAllTransactions({
      ...query,
      orderId,
    });
  }

  // ==================== FINANCIAL REPORTS ====================

  @Get('reports/revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiResponse({
    status: 200,
    description: 'Revenue report retrieved successfully',
  })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({
    name: 'groupBy',
    required: false,
    enum: ['day', 'week', 'month', 'year'],
  })
  async getRevenueReport(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('groupBy') groupBy: 'day' | 'week' | 'month' | 'year' = 'day'
  ) {
    // This would be implemented in the service for detailed revenue reporting
    // For now, return basic stats
    const stats = await this.transactionsService.getTransactionStats();
    return {
      period: { from: dateFrom, to: dateTo },
      groupBy,
      totalRevenue: stats.financial.totalRevenue,
      totalFees: stats.financial.totalFees,
      netRevenue: stats.financial.netRevenue,
      averageTransaction: stats.financial.averageTransaction,
    };
  }

  @Get('reports/fees')
  @ApiOperation({ summary: 'Get fees report' })
  @ApiResponse({
    status: 200,
    description: 'Fees report retrieved successfully',
  })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async getFeesReport(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    // This would be implemented in the service for detailed fees reporting
    const stats = await this.transactionsService.getTransactionStats();
    return {
      period: { from: dateFrom, to: dateTo },
      totalProcessingFees: stats.financial.totalFees,
      totalPlatformFees: 0, // Would be calculated separately
      netFees: stats.financial.totalFees,
    };
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export transactions as CSV' })
  @ApiResponse({
    status: 200,
    description: 'CSV file exported successfully',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'paymentMethod', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async exportTransactionsAsCSV(
    @Query() query: TransactionQueryDto,
    @Res() res: Response
  ) {
    const csvContent = await this.transactionsService.exportToCSV(query);
    const filename = `transactions_${
      new Date().toISOString().split('T')[0]
    }.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  }

  @Get(':id/invoice')
  @ApiOperation({ summary: 'Generate invoice for a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Invoice generated successfully',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async generateInvoice(
    @Param('id') id: string,
    @Res() res: Response
  ): Promise<void> {
    const pdfBuffer = await this.transactionsService.generateInvoice(id);
    const filename = `invoice_${id.slice(-8)}_${
      new Date().toISOString().split('T')[0]
    }.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  }
}
