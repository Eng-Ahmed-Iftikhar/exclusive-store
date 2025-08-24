import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlashSaleItemDto {
  @IsString()
  itemId!: string;

  @IsInt()
  @Min(0)
  salePrice!: number;

  @IsInt()
  @Min(0)
  originalPrice!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateFlashSaleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsInt()
  @Min(0)
  @Max(100)
  discount!: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashSaleItemDto)
  items?: CreateFlashSaleItemDto[];
}

export class UpdateFlashSaleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discount?: number;
}

export class UpdateFlashSaleItemDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class FlashSaleItemResponseDto {
  id!: string;
  itemId!: string;
  salePrice!: number;
  currentPrice!: number;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  name!: string;
  description?: string;
  images!: Array<{ url: string; altText?: string; isPrimary: boolean }>;
  stock?: { quantity: number; isInStock: boolean };
  reviews!: Array<{ rating: number }>;
}

// New DTO that matches the items API structure
export class FlashSaleItemDto {
  id!: string;
  name!: string;
  description?: string;
  sku?: string;
  isActive!: boolean;
  isFeatured!: boolean;
  sortOrder?: number;
  categoryId?: string;
  subcategoryId?: string;
  createdAt!: Date;
  updatedAt!: Date;
  category?: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string };
  prices!: Array<{
    id: string;
    itemId: string;
    price: number;
    salePrice: number;
    currency: string;
    isActive: boolean;
    validFrom: Date;
    validTo: Date;
    createdAt: Date;
    updatedAt: Date;
  }>;
  stock?: {
    id: string;
    itemId: string;
    quantity: number;
    reserved: number;
    minThreshold: number;
    maxThreshold: number;
    isInStock: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  images!: Array<{
    id: string;
    itemId: string;
    url: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  reviews!: Array<{
    id: string;
    itemId: string;
    userId: string;
    title: string;
    content: string;
    rating: number;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  ratings!: Array<{
    id: string;
    itemId: string;
    userId: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  favorites!: Array<{
    id: string;
    itemId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  averageRating!: number;
  totalReviews!: number;
  isFavorite!: boolean;
  currentPrice!: number;
  salePrice!: number;
  isOnSale!: boolean;
  flashSaleId!: string;
  flashSaleDiscount!: number;
  timeRemaining!: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export class FlashSaleResponseDto {
  id!: string;
  name!: string;
  description?: string;
  startDate!: Date;
  endDate!: Date;
  isActive!: boolean;
  discount!: number;
  createdAt!: Date;
  updatedAt!: Date;
  items?: FlashSaleItemDto[];
}
