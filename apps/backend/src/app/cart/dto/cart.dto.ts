import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'Product ID to add to cart' })
  @IsString()
  productId!: string;

  @ApiProperty({ description: 'Variant ID (optional)', required: false })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ description: 'Quantity to add', minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  quantity!: number;
}

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item',
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  quantity!: number;
}

export class CartItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  productId!: string;

  @ApiProperty({ required: false })
  variantId?: string;

  @ApiProperty()
  product!: any;

  @ApiProperty({ required: false })
  variant?: any;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class CartDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({ type: [CartItemDto] })
  items!: CartItemDto[];

  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  subtotal!: number;

  @ApiProperty()
  shippingCost!: number;

  @ApiProperty()
  tax!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class CartResponseDto {
  @ApiProperty()
  cart!: CartDto;

  @ApiProperty({ required: false })
  message?: string;
}
