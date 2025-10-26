import { ApiProperty } from '@nestjs/swagger';

export class OrderActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  id!: string;

  @ApiProperty({ description: 'Order ID' })
  orderId!: string;

  @ApiProperty({ description: 'Action type', example: 'status_change' })
  action!: string;

  @ApiProperty({ description: 'Field that was changed', example: 'status' })
  field?: string;

  @ApiProperty({ description: 'Previous value', example: 'processing' })
  oldValue?: string;

  @ApiProperty({ description: 'New value', example: 'shipped' })
  newValue?: string;

  @ApiProperty({ description: 'Admin/User ID who performed the action' })
  performedBy?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: any;

  @ApiProperty({ description: 'When the activity occurred' })
  createdAt!: Date;

  @ApiProperty({
    description: 'User who performed the action',
    required: false,
  })
  performedByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export class CreateOrderActivityDto {
  @ApiProperty({ description: 'Order ID' })
  orderId!: string;

  @ApiProperty({ description: 'Action type', example: 'status_change' })
  action!: string;

  @ApiProperty({ description: 'Field that was changed', example: 'status' })
  field?: string;

  @ApiProperty({ description: 'Previous value', example: 'processing' })
  oldValue?: string;

  @ApiProperty({ description: 'New value', example: 'shipped' })
  newValue?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: any;
}

export class OrderActivityListDto {
  @ApiProperty({ description: 'List of activities', type: [OrderActivityDto] })
  activities!: OrderActivityDto[];

  @ApiProperty({ description: 'Total count' })
  total!: number;
}
