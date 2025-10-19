import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

// ==================== PRICE DTOs ====================

export class CreatePriceDto {
  @ApiProperty({
    description: 'Price amount',
    example: 29.99,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    description: 'Sale price amount',
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
    description: 'Whether the price is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePriceDto {
  @ApiProperty({
    description: 'Price amount',
    example: 29.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: 'Sale price amount',
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
    description: 'Whether the price is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ==================== STOCK DTOs ====================

export class CreateStockDto {
  @ApiProperty({
    description: 'Stock quantity',
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
    description: 'Minimum threshold',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minThreshold?: number;

  @ApiProperty({
    description: 'Maximum threshold',
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxThreshold?: number;

  @ApiProperty({
    description: 'Whether the item is in stock',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isInStock?: boolean;
}

export class UpdateStockDto {
  @ApiProperty({
    description: 'Stock quantity',
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
    description: 'Minimum threshold',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minThreshold?: number;

  @ApiProperty({
    description: 'Maximum threshold',
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxThreshold?: number;

  @ApiProperty({
    description: 'Whether the item is in stock',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isInStock?: boolean;
}

// ==================== PRODUCT DTOs ====================

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Cotton T-Shirt',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality cotton t-shirt with modern fit',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Base SKU for the product',
    example: 'TSHIRT-COTTON-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Product prices array',
    type: 'array',
    required: false,
  })
  @IsOptional()
  prices?: {
    price: number;
    salePrice?: number;
    currency?: string;
    isActive?: boolean;
  }[];

  @ApiProperty({
    description: 'Stock quantity for the product',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiProperty({
    description: 'Whether the product is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Whether the product is featured',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({
    description: 'Category ID',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Subcategory ID',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcategoryId?: string;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Cotton T-Shirt',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality cotton t-shirt with modern fit',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Base SKU for the product',
    example: 'TSHIRT-COTTON-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Product prices array',
    type: 'array',
    required: false,
  })
  @IsOptional()
  prices?: {
    price: number;
    salePrice?: number;
    currency?: string;
    isActive?: boolean;
  }[];

  @ApiProperty({
    description: 'Stock quantity for the product',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiProperty({
    description: 'Whether the product is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Whether the product is featured',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({
    description: 'Category ID',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Subcategory ID',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcategoryId?: string;
}

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID' })
  id!: string;

  @ApiProperty({ description: 'Product name' })
  name!: string;

  @ApiProperty({ description: 'Product description' })
  description?: string;

  @ApiProperty({ description: 'Base SKU' })
  sku?: string;

  @ApiProperty({
    description: 'Product prices',
    type: 'array',
    required: false,
  })
  prices?: {
    id: string;
    price: number;
    salePrice?: number;
    currency: string;
    isActive: boolean;
  }[];

  @ApiProperty({
    description: 'Product stock information',
    required: false,
  })
  stock?: {
    id: string;
    quantity: number;
    reserved: number;
    minThreshold: number;
    maxThreshold?: number;
    isInStock: boolean;
  }[];

  @ApiProperty({ description: 'Whether the product is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'Whether the product is featured' })
  isFeatured!: boolean;

  @ApiProperty({ description: 'Sort order' })
  sortOrder!: number;

  @ApiProperty({ description: 'Category ID' })
  categoryId?: string;

  @ApiProperty({ description: 'Subcategory ID' })
  subcategoryId?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @ApiProperty({ description: 'Category details', required: false })
  category?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({ description: 'Subcategory details', required: false })
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({
    description: 'Product variants',
    type: 'array',
    required: false,
  })
  variants?: any[];

  @ApiProperty({
    description: 'Product images',
    type: 'array',
    required: false,
  })
  images?: any[];

  @ApiProperty({ description: 'Average rating', required: false })
  averageRating?: number;

  @ApiProperty({ description: 'Total reviews count', required: false })
  totalReviews?: number;

  @ApiProperty({ description: 'Total variants count', required: false })
  totalVariants?: number;
}
