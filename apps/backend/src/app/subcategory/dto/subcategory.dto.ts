import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSubcategoryDto {
  @ApiProperty({
    description: 'Subcategory name',
    example: 'Smartphones',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'URL-friendly slug for the subcategory',
    example: 'smartphones',
  })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({
    description: 'Subcategory description',
    example: 'Latest smartphones and mobile devices',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'File ID for the subcategory icon',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  iconFileId?: string;

  @ApiProperty({
    description: 'Whether the subcategory is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({
    description: 'Parent category ID',
    example: 'clxxxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}

export class UpdateSubcategoryDto {
  @ApiProperty({
    description: 'Subcategory name',
    example: 'Smartphones',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'URL-friendly slug for the subcategory',
    example: 'smartphones',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @ApiProperty({
    description: 'Subcategory description',
    example: 'Latest smartphones and mobile devices',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'File ID for the subcategory icon',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  iconFileId?: string;

  @ApiProperty({
    description: 'Whether the subcategory is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class SubcategoryResponseDto {
  @ApiProperty({
    description: 'Subcategory unique identifier',
    example: 'clxxxxx123456789',
  })
  id!: string;

  @ApiProperty({
    description: 'Subcategory name',
    example: 'Smartphones',
  })
  name!: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'smartphones',
  })
  slug!: string;

  @ApiProperty({
    description: 'Subcategory description',
    example: 'Latest smartphones and mobile devices',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'File ID for the subcategory icon',
    example: 'clxxxxx123456789',
    required: false,
  })
  iconFileId?: string;

  @ApiProperty({
    description: 'Whether the subcategory is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Sort order for display',
    example: 1,
  })
  sortOrder!: number;

  @ApiProperty({
    description: 'Parent category ID',
    example: 'clxxxxx123456789',
  })
  categoryId!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Parent category information',
    required: false,
  })
  category?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({
    description: 'Icon file information',
    required: false,
  })
  iconFile?: {
    id: string;
    url: string;
    originalName: string;
  };
}

export class SubcategoryQueryDto {
  @ApiProperty({
    description: 'Search term for subcategory name or description',
    example: 'smartphone',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by category ID',
    example: 'clxxxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: 'Include inactive subcategories',
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  includeInactive?: boolean;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    description: 'Sort by field',
    example: 'name',
    enum: ['name', 'sortOrder', 'createdAt', 'updatedAt'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'sortOrder' | 'createdAt' | 'updatedAt';

  @ApiProperty({
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class SubcategoryListResponseDto {
  @ApiProperty({
    description: 'Array of subcategories',
    type: [SubcategoryResponseDto],
  })
  subcategories!: SubcategoryResponseDto[];

  @ApiProperty({
    description: 'Total number of subcategories',
    example: 25,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  totalPages!: number;
}
