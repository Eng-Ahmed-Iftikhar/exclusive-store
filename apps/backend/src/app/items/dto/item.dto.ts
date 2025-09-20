import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

// ===== ITEM DTOs =====

export class CreateItemDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  subcategoryId?: string;
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  subcategoryId?: string;
}

// ===== PRICE DTOs =====

export class CreatePriceDto {
  @IsString()
  itemId!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  validFrom?: Date;

  @IsOptional()
  validTo?: Date;
}

export class UpdatePriceDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  validFrom?: Date;

  @IsOptional()
  validTo?: Date;
}

// ===== STOCK DTOs =====

export class CreateStockDto {
  @IsString()
  itemId!: string;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reserved?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minThreshold?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxThreshold?: number;

  @IsOptional()
  @IsBoolean()
  isInStock?: boolean;
}

export class UpdateStockDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reserved?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minThreshold?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxThreshold?: number;

  @IsOptional()
  @IsBoolean()
  isInStock?: boolean;
}

// ===== IMAGE DTOs =====

export class CreateItemImageDto {
  @IsString()
  itemId!: string;

  @IsString()
  fileId!: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateItemImageDto {
  @IsOptional()
  @IsString()
  fileId?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

// ===== REVIEW DTOs =====

export class CreateReviewDto {
  @IsString()
  itemId!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  content!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class AdminUpdateReviewDto extends UpdateReviewDto {
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}

// ===== RATING DTOs =====

export class CreateRatingDto {
  @IsString()
  itemId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}

export class UpdateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}

// ===== FAVORITE DTOs =====

export class CreateFavoriteDto {
  @IsString()
  itemId!: string;
}

// ===== RESPONSE DTOs =====

export class PriceResponseDto {
  id!: string;
  itemId!: string;
  price!: number;
  salePrice?: number;
  currency!: string;
  isActive!: boolean;
  validFrom!: Date;
  validTo?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class StockResponseDto {
  id!: string;
  itemId!: string;
  quantity!: number;
  reserved!: number;
  minThreshold!: number;
  maxThreshold?: number;
  isInStock!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ItemImageResponseDto {
  id!: string;
  itemId!: string;
  fileId!: string;
  altText?: string;
  isPrimary!: boolean;
  sortOrder!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ReviewResponseDto {
  id!: string;
  itemId!: string;
  userId!: string;
  title?: string;
  content!: string;
  rating!: number;
  isApproved!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export class RatingResponseDto {
  id!: string;
  itemId!: string;
  userId!: string;
  rating!: number;
  createdAt!: Date;
  updatedAt!: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export class FavoriteResponseDto {
  id!: string;
  itemId!: string;
  userId!: string;
  createdAt!: Date;
  item?: {
    id: string;
    name: string;
    description?: string;
  };
}

export class ItemResponseDto {
  id!: string;
  name!: string;
  description?: string;
  sku?: string;
  isActive!: boolean;
  isFeatured!: boolean;
  sortOrder!: number;
  categoryId?: string;
  subcategoryId?: string;
  createdAt!: Date;
  updatedAt!: Date;

  // Relations
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  prices?: PriceResponseDto[];
  stock?: StockResponseDto;
  images?: ItemImageResponseDto[];
  reviews?: ReviewResponseDto[];
  ratings?: RatingResponseDto[];
  favorites?: FavoriteResponseDto[];

  // Computed fields
  averageRating?: number;
  totalReviews?: number;
  isFavorite?: boolean;
  currentPrice?: number;
  salePrice?: number;
  isOnSale?: boolean;
}

// ===== QUERY DTOs =====

export class ItemQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  category?: string; // Category slug

  @IsOptional()
  @Transform(() => undefined) // Ignore this field completely
  @IsString()
  priceRange?: string; // Frontend price range (will be ignored in processing)

  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @IsOptional()
  @IsString()
  subcategory?: string; // Subcategory slug

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(5)
  minRating?: number;
}
