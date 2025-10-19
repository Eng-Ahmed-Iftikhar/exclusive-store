import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

export enum AdminOrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum AdminPaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum OrderPriority {
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class AdminOrderItemDto {
  @ApiProperty({ description: 'Order item ID' })
  id!: string;

  @ApiProperty({ description: 'Product variant ID' })
  variantId!: string;

  @ApiProperty({ description: 'Product variant details' })
  variant!: {
    id: string;
    name: string;
    sku: string;
    product: {
      id: string;
      name: string;
      sku: string;
      category?: {
        id: string;
        name: string;
      };
      subcategory?: {
        id: string;
        name: string;
      };
    };
    images?: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };

  @ApiProperty({ description: 'Quantity ordered' })
  quantity!: number;

  @ApiProperty({ description: 'Price per item' })
  price!: number;

  @ApiProperty({ description: 'Total price for this item' })
  totalPrice!: number;
}

export class AdminOrderDto {
  @ApiProperty({ description: 'Order ID' })
  id!: string;

  @ApiProperty({ description: 'Human-readable order number' })
  orderNumber!: string;

  @ApiProperty({ description: 'User ID (if not guest order)' })
  userId?: string;

  @ApiProperty({ description: 'Customer information' })
  customer!: {
    name: string;
    email: string;
    phone?: string;
    isGuest: boolean;
  };

  @ApiProperty({ description: 'Shipping address' })
  shippingAddress!: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  @ApiProperty({ description: 'Order items' })
  items!: AdminOrderItemDto[];

  @ApiProperty({ description: 'Order totals' })
  totals!: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  };

  @ApiProperty({ description: 'Order status', enum: AdminOrderStatus })
  status!: AdminOrderStatus;

  @ApiProperty({ description: 'Payment status', enum: AdminPaymentStatus })
  paymentStatus!: AdminPaymentStatus;

  @ApiProperty({ description: 'Order priority', enum: OrderPriority })
  priority!: OrderPriority;

  @ApiProperty({ description: 'Order tags' })
  tags!: string[];

  @ApiProperty({ description: 'Public notes' })
  notes?: string;

  @ApiProperty({ description: 'Internal notes for admin use' })
  internalNotes?: string;

  @ApiProperty({ description: 'Shipping information' })
  shipping?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  };

  @ApiProperty({ description: 'Payment information' })
  payment?: {
    stripePaymentIntentId?: string;
    paymentMethod?: string;
    last4?: string;
    brand?: string;
  };

  @ApiProperty({ description: 'Order timestamps' })
  timestamps!: {
    createdAt: string;
    updatedAt: string;
  };

  @ApiProperty({ description: 'Total number of items in order' })
  totalItems!: number;
}

export class AdminOrderListDto {
  @ApiProperty({ description: 'List of orders', type: [AdminOrderDto] })
  orders!: AdminOrderDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  @ApiProperty({ description: 'Filter summary' })
  filters!: {
    status?: AdminOrderStatus;
    paymentStatus?: AdminPaymentStatus;
    priority?: OrderPriority;
    search?: string;
    dateRange?: {
      from: string;
      to: string;
    };
  };
}

export class AdminOrderQueryDto {
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
  limit?: number = 10;

  @ApiProperty({
    description: 'Search term for order number, customer name, or email',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by order status',
    enum: AdminOrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AdminOrderStatus)
  status?: AdminOrderStatus;

  @ApiProperty({
    description: 'Filter by payment status',
    enum: AdminPaymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(AdminPaymentStatus)
  paymentStatus?: AdminPaymentStatus;

  @ApiProperty({
    description: 'Filter by priority',
    enum: OrderPriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderPriority)
  priority?: OrderPriority;

  @ApiProperty({ description: 'Filter by tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

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
  sortBy?: 'createdAt' | 'updatedAt' | 'total' | 'orderNumber' | 'status';

  @ApiProperty({ description: 'Sort order', required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    description: 'Include only live orders (not delivered/cancelled)',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  liveOnly?: boolean = false;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'New order status', enum: AdminOrderStatus })
  @IsEnum(AdminOrderStatus)
  status!: AdminOrderStatus;

  @ApiProperty({
    description: 'Internal notes about the status change',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderShippingDto {
  @ApiProperty({ description: 'Tracking number', required: false })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiProperty({ description: 'Shipping carrier', required: false })
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiProperty({
    description: 'Estimated delivery date (ISO string)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @ApiProperty({
    description: 'Actual delivery date (ISO string)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  actualDelivery?: string;
}

export class UpdateOrderNotesDto {
  @ApiProperty({
    description: 'Public notes visible to customer',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Internal notes for admin use only',
    required: false,
  })
  @IsOptional()
  @IsString()
  internalNotes?: string;
}

export class UpdateOrderPriorityDto {
  @ApiProperty({ description: 'Order priority', enum: OrderPriority })
  @IsEnum(OrderPriority)
  priority!: OrderPriority;
}

export class UpdateOrderTagsDto {
  @ApiProperty({ description: 'Order tags' })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];
}

export class OrderStatsDto {
  @ApiProperty({ description: 'Total orders count' })
  totalOrders!: number;

  @ApiProperty({ description: 'Orders by status' })
  byStatus!: Record<AdminOrderStatus, number>;

  @ApiProperty({ description: 'Orders by payment status' })
  byPaymentStatus!: Record<AdminPaymentStatus, number>;

  @ApiProperty({ description: 'Orders by priority' })
  byPriority!: Record<OrderPriority, number>;

  @ApiProperty({ description: 'Revenue statistics' })
  revenue!: {
    total: number;
    average: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };

  @ApiProperty({ description: 'Recent activity' })
  recentActivity!: Array<{
    id: string;
    orderNumber: string;
    action: string;
    timestamp: string;
    user?: string;
  }>;
}
