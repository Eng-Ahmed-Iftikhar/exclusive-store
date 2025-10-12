import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconFileId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconFileId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CategoryResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  description?: string;
  iconFileId?: string;
  isActive!: boolean;
  sortOrder!: number;
  subcategoryCount!: number;
  subcategories?: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    iconFileId?: string;
    isActive: boolean;
    sortOrder: number;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  createdAt!: Date;
  updatedAt!: Date;
}
