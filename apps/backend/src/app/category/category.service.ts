import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new category
  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<CategoryResponseDto> {
    // Check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with slug '${createCategoryDto.slug}' already exists`
      );
    }

    // Create category
    const category = await this.prisma.category.create({
      data: createCategoryDto,
      include: {
        _count: {
          select: {
            subcategories: true,
          },
        },
      },
    });

    return this.mapToCategoryResponse(category);
  }

  // Get all categories with optional filtering
  async getAllCategories(
    includeInactive = false
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            subcategories: true,
          },
        },
      },
    });

    return categories.map((category) => this.mapToCategoryResponse(category));
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subcategories: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    return this.mapToCategoryResponse(category);
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            subcategories: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return this.mapToCategoryResponse(category);
  }

  // Update category
  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Check if new slug conflicts with existing ones
    if (
      updateCategoryDto.slug &&
      updateCategoryDto.slug !== existingCategory.slug
    ) {
      const slugConflict = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });

      if (slugConflict) {
        throw new ConflictException(
          `Category with slug '${updateCategoryDto.slug}' already exists`
        );
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: {
          select: {
            subcategories: true,
          },
        },
      },
    });

    return this.mapToCategoryResponse(updatedCategory);
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Delete category (subcategories will be deleted due to cascade)
    await this.prisma.category.delete({
      where: { id },
    });
  }

  // Helper method to map category to response DTO
  private mapToCategoryResponse(category: any): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      iconFileId: category.iconFileId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      subcategoryCount: category._count?.subcategories || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
