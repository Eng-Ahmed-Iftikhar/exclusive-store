import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  Min,
  Max,
} from 'class-validator';

export enum TransactionType {
  ORDER_PAYMENT = 'order_payment',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund',
  FEE = 'fee',
  ADJUSTMENT = 'adjustment',
  COMMISSION = 'commission',
  CHARGEBACK = 'chargeback',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PROCESSING = 'processing',
}

export enum PaymentMethod {
  CARD = 'card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  CRYPTOCURRENCY = 'cryptocurrency',
  CASH = 'cash',
  OTHER = 'other',
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Order ID that this transaction is related to',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({
    description: 'User ID who made the transaction (null for guest orders)',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @ApiProperty({
    description: 'Transaction status',
    enum: TransactionStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus = TransactionStatus.PENDING;

  @ApiProperty({
    description:
      'Transaction amount (positive for income, negative for expenses)',
    example: 99.99,
  })
  @IsNumber()
  @Min(-999999.99)
  @Max(999999.99)
  amount!: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiProperty({
    description: 'Human-readable description of the transaction',
    example: 'Payment for Order #12345',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'External reference (e.g., Stripe payment intent ID)',
    required: false,
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({
    description: 'Additional transaction data (JSON)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Payment method specific details (JSON)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  paymentMethodDetails?: any;

  @ApiProperty({
    description: 'Processing fee amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  processingFee?: number;

  @ApiProperty({
    description: 'Platform fee amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  platformFee?: number;

  @ApiProperty({
    description: 'Net amount after fees',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  netAmount?: number;

  @ApiProperty({
    description: 'When the transaction was processed',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  processedAt?: string;
}

export class UpdateTransactionDto {
  @ApiProperty({
    description: 'Transaction status',
    enum: TransactionStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({
    description: 'Human-readable description of the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'External reference',
    required: false,
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({
    description: 'Additional transaction data (JSON)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiProperty({
    description: 'Payment method specific details (JSON)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  paymentMethodDetails?: any;

  @ApiProperty({
    description: 'Processing fee amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  processingFee?: number;

  @ApiProperty({
    description: 'Platform fee amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  platformFee?: number;

  @ApiProperty({
    description: 'Net amount after fees',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  netAmount?: number;

  @ApiProperty({
    description: 'When the transaction was processed',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  processedAt?: string;
}

export class TransactionResponseDto {
  @ApiProperty({ description: 'Transaction ID' })
  id!: string;

  @ApiProperty({ description: 'Order ID', required: false })
  orderId?: string;

  @ApiProperty({ description: 'User ID', required: false })
  userId?: string;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  type!: TransactionType;

  @ApiProperty({ description: 'Transaction status', enum: TransactionStatus })
  status!: TransactionStatus;

  @ApiProperty({ description: 'Transaction amount' })
  amount!: number;

  @ApiProperty({ description: 'Currency code' })
  currency!: string;

  @ApiProperty({ description: 'Transaction description' })
  description!: string;

  @ApiProperty({ description: 'External reference', required: false })
  reference?: string;

  @ApiProperty({ description: 'Transaction metadata', required: false })
  metadata?: any;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    required: false,
  })
  paymentMethod?: PaymentMethod;

  @ApiProperty({ description: 'Payment method details', required: false })
  paymentMethodDetails?: any;

  @ApiProperty({ description: 'Processing fee', required: false })
  processingFee?: number;

  @ApiProperty({ description: 'Platform fee', required: false })
  platformFee?: number;

  @ApiProperty({ description: 'Net amount after fees' })
  netAmount!: number;

  @ApiProperty({ description: 'Processed timestamp', required: false })
  processedAt?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  // Relations
  @ApiProperty({ description: 'Related order details', required: false })
  order?: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
  };

  @ApiProperty({ description: 'User details', required: false })
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export class TransactionQueryDto {
  @ApiProperty({ description: 'Page number', minimum: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({
    description: 'Search term for description or reference',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by transaction type',
    enum: TransactionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({
    description: 'Filter by transaction status',
    enum: TransactionStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({
    description: 'Filter by payment method',
    enum: PaymentMethod,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Filter by user ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Filter by order ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({
    description: 'Filter by minimum amount',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAmount?: number;

  @ApiProperty({
    description: 'Filter by maximum amount',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;

  @ApiProperty({
    description: 'Filter by date range - from date (ISO string)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({
    description: 'Filter by date range - to date (ISO string)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ description: 'Sort by field', required: false })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'updatedAt' | 'amount' | 'processedAt';

  @ApiProperty({ description: 'Sort order', required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class TransactionListResponseDto {
  @ApiProperty({
    description: 'List of transactions',
    type: [TransactionResponseDto],
  })
  transactions!: TransactionResponseDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  @ApiProperty({ description: 'Filter summary' })
  filters!: {
    type?: TransactionType;
    status?: TransactionStatus;
    paymentMethod?: PaymentMethod;
    search?: string;
    dateRange?: {
      from: string;
      to: string;
    };
  };
}

export class TransactionStatsDto {
  @ApiProperty({ description: 'Total transactions count' })
  totalTransactions!: number;

  @ApiProperty({ description: 'Transactions by type' })
  byType!: Record<TransactionType, number>;

  @ApiProperty({ description: 'Transactions by status' })
  byStatus!: Record<TransactionStatus, number>;

  @ApiProperty({ description: 'Transactions by payment method' })
  byPaymentMethod!: Record<PaymentMethod, number>;

  @ApiProperty({ description: 'Financial summary' })
  financial!: {
    totalRevenue: number;
    totalFees: number;
    netRevenue: number;
    averageTransaction: number;
    todayRevenue: number;
    thisWeekRevenue: number;
    thisMonthRevenue: number;
  };

  @ApiProperty({ description: 'Recent transactions' })
  recentTransactions!: Array<{
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    createdAt: string;
  }>;
}

export class CreateOrderTransactionDto {
  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId!: string;

  @ApiProperty({ description: 'User ID (optional for guest orders)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsNumber()
  amount!: number;

  @ApiProperty({ description: 'Payment method used' })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ description: 'External payment reference' })
  @IsString()
  reference!: string;

  @ApiProperty({ description: 'Payment method details', required: false })
  @IsOptional()
  @IsObject()
  paymentMethodDetails?: any;

  @ApiProperty({ description: 'Processing fee', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  processingFee?: number;

  @ApiProperty({ description: 'Platform fee', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  platformFee?: number;
}
