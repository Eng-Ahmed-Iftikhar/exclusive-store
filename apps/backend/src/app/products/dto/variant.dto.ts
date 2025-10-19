import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsNotEmpty,
  IsArray,
  Min,
} from 'class-validator';

// ==================== PRODUCT VARIANT DTOs ====================

export class CreateVariantDto {
  @ApiProperty({
    description: 'Product ID this variant belongs to',
    example: 'clxxxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({
    description: 'Unique SKU for this variant',
    example: 'TSHIRT-RED-L',
  })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({
    description: 'Variant name',
    example: 'Red - Large',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Variant attributes as JSON object',
    example: { color: 'Red', size: 'Large', material: 'Cotton' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @ApiProperty({
    description: 'Whether this is the default variant',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({
    description: 'Whether the variant is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class StockResponseDto {
  @ApiProperty({ description: 'Stock ID' })
  id!: string;

  @ApiProperty({ description: 'Product ID', required: false })
  productId?: string;

  @ApiProperty({ description: 'Variant ID', required: false })
  variantId?: string;

  @ApiProperty({ description: 'Available quantity' })
  quantity!: number;

  @ApiProperty({ description: 'Reserved quantity' })
  reserved!: number;

  @ApiProperty({ description: 'Minimum threshold' })
  minThreshold!: number;

  @ApiProperty({ description: 'Maximum threshold' })
  maxThreshold?: number;

  @ApiProperty({ description: 'Is in stock' })
  isInStock!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}

export class UpdateVariantDto {
  @ApiProperty({
    description: 'Unique SKU for this variant',
    example: 'TSHIRT-RED-L',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Variant name',
    example: 'Red - Large',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Variant attributes as JSON object',
    example: { color: 'Red', size: 'Large', material: 'Cotton' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @ApiProperty({
    description: 'Whether this is the default variant',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({
    description: 'Whether the variant is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class VariantResponseDto {
  @ApiProperty({ description: 'Variant ID', example: 'clxxxxx123456789' })
  id!: string;

  @ApiProperty({ description: 'Product ID', example: 'clxxxxx987654321' })
  productId!: string;

  @ApiProperty({ description: 'Variant SKU', example: 'TSHIRT-RED-L' })
  sku!: string;

  @ApiProperty({ description: 'Variant name', example: 'Red - Large' })
  name!: string;

  @ApiProperty({
    description: 'Variant attributes',
    example: { color: 'Red', size: 'Large' },
  })
  attributes?: Record<string, any>;

  @ApiProperty({ description: 'Is default variant' })
  isDefault!: boolean;

  @ApiProperty({ description: 'Is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'Sort order' })
  sortOrder!: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @ApiProperty({ description: 'Variant prices', required: false })
  prices?: PriceResponseDto[];

  @ApiProperty({ description: 'Variant stock', required: false })
  stock?: StockResponseDto;

  @ApiProperty({ description: 'Variant images', required: false })
  images?: ProductImageResponseDto[];

  @ApiProperty({ description: 'Current active price', required: false })
  currentPrice?: number;

  @ApiProperty({ description: 'Sale price if available', required: false })
  salePrice?: number;

  @ApiProperty({ description: 'Whether variant is on sale', required: false })
  isOnSale?: boolean;
}

// ==================== PRICE DTOs ====================

export class CreatePriceDto {
  @ApiProperty({
    description: 'Variant ID',
    example: 'clxxxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  variantId!: string;

  @ApiProperty({
    description: 'Regular price',
    example: 29.99,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    description: 'Sale price (optional)',
    example: 19.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Whether this price is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePriceDto {
  @ApiProperty({
    description: 'Regular price',
    example: 29.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: 'Sale price',
    example: 19.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Whether this price is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PriceResponseDto {
  @ApiProperty({ description: 'Price ID' })
  id!: string;

  @ApiProperty({ description: 'Product ID', required: false })
  productId?: string;

  @ApiProperty({ description: 'Variant ID', required: false })
  variantId?: string;

  @ApiProperty({ description: 'Regular price' })
  price!: number;

  @ApiProperty({ description: 'Sale price' })
  salePrice?: number;

  @ApiProperty({ description: 'Currency' })
  currency!: string;

  @ApiProperty({ description: 'Is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'Valid from date' })
  validFrom!: Date;

  @ApiProperty({ description: 'Valid to date' })
  validTo?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}

// ==================== STOCK DTOs ====================

export class CreateStockDto {
  @ApiProperty({
    description: 'Variant ID',
    example: 'clxxxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  variantId!: string;

  @ApiProperty({
    description: 'Available quantity',
    example: 100,
  })
  @IsInt()
  @Min(0)
  quantity!: number;

  @ApiProperty({
    description: 'Reserved quantity',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  reserved?: number;

  @ApiProperty({
    description: 'Minimum threshold for low stock alert',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minThreshold?: number;

  @ApiProperty({
    description: 'Maximum threshold',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxThreshold?: number;

  @ApiProperty({
    description: 'Whether the variant is in stock',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isInStock?: boolean;
}

export class UpdateStockDto {
  @ApiProperty({
    description: 'Available quantity',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiProperty({
    description: 'Reserved quantity',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  reserved?: number;

  @ApiProperty({
    description: 'Minimum threshold for low stock alert',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minThreshold?: number;

  @ApiProperty({
    description: 'Maximum threshold',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxThreshold?: number;

  @ApiProperty({
    description: 'Whether the variant is in stock',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isInStock?: boolean;
}

// ==================== PRODUCT IMAGE DTOs ====================

export class CreateProductImageDto {
  @ApiProperty({
    description: 'Product ID (for product-level images)',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({
    description: 'Variant ID (for variant-specific images)',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({
    description: 'File ID from file module',
    example: 'clxxxxx987654321',
  })
  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @ApiProperty({
    description: 'Alternative text for the image',
    example: 'Red T-Shirt Large Size',
    required: false,
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({
    description: 'Whether this is the primary image',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateProductImageDto {
  @ApiProperty({
    description: 'File ID from file module',
    example: 'clxxxxx987654321',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileId?: string;

  @ApiProperty({
    description: 'Alternative text for the image',
    example: 'Red T-Shirt Large Size',
    required: false,
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({
    description: 'Whether this is the primary image',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class ProductImageResponseDto {
  @ApiProperty({ description: 'Image ID' })
  id!: string;

  @ApiProperty({ description: 'Product ID (if product-level image)' })
  productId?: string;

  @ApiProperty({ description: 'Variant ID (if variant-specific image)' })
  variantId?: string;

  @ApiProperty({ description: 'File ID' })
  fileId!: string;

  @ApiProperty({ description: 'Alternative text' })
  altText?: string;

  @ApiProperty({ description: 'Is primary image' })
  isPrimary!: boolean;

  @ApiProperty({ description: 'Sort order' })
  sortOrder!: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @ApiProperty({ description: 'File details', required: false })
  file?: {
    id: string;
    url: string;
    secureUrl: string;
    originalName: string;
    format: string;
    width?: number;
    height?: number;
  };
}

// ==================== BULK OPERATIONS DTOs ====================

export class BulkCreateVariantsDto {
  @ApiProperty({
    description: 'Product ID for all variants',
    example: 'clxxxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({
    description: 'Array of variants to create',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsArray()
  variants!: Array<Omit<CreateVariantDto, 'productId'>>;
}
