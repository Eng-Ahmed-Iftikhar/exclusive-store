import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

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

  @ApiProperty({ description: 'Average rating', required: false })
  averageRating?: number;

  @ApiProperty({ description: 'Total reviews count', required: false })
  totalReviews?: number;

  @ApiProperty({ description: 'Total variants count', required: false })
  totalVariants?: number;
}
