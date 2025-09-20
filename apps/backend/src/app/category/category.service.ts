import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
  CategoryResponseDto,
  SubcategoryResponseDto,
} from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new category
  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<CategoryResponseDto> {
    const { subcategories, ...categoryData } = createCategoryDto;

    // Check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: categoryData.slug },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with slug '${categoryData.slug}' already exists`
      );
    }

    // Create category with subcategories if provided
    const category = await this.prisma.category.create({
      data: {
        ...categoryData,
        subcategories: subcategories
          ? {
              create: subcategories.map((sub) => ({
                ...sub,
                slug: this.generateSlug(sub.name),
              })),
            }
          : undefined,
      },
      include: {
        subcategories: {
          orderBy: { sortOrder: 'asc' },
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
      include: {
        subcategories: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map((category) => this.mapToCategoryResponse(category));
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: {
          orderBy: { sortOrder: 'asc' },
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
        subcategories: {
          orderBy: { sortOrder: 'asc' },
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
        subcategories: {
          orderBy: { sortOrder: 'asc' },
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

  // Create subcategory
  async createSubcategory(
    categoryId: string,
    createSubcategoryDto: CreateSubcategoryDto
  ): Promise<SubcategoryResponseDto> {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${categoryId}' not found`);
    }

    // Check if slug already exists
    const existingSubcategory = await this.prisma.subcategory.findUnique({
      where: { slug: createSubcategoryDto.slug },
    });

    if (existingSubcategory) {
      throw new ConflictException(
        `Subcategory with slug '${createSubcategoryDto.slug}' already exists`
      );
    }

    const subcategory = await this.prisma.subcategory.create({
      data: {
        ...createSubcategoryDto,
        categoryId,
      },
    });

    return this.mapToSubcategoryResponse(subcategory);
  }

  // Update subcategory
  async updateSubcategory(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto
  ): Promise<SubcategoryResponseDto> {
    // Check if subcategory exists
    const existingSubcategory = await this.prisma.subcategory.findUnique({
      where: { id },
    });

    if (!existingSubcategory) {
      throw new NotFoundException(`Subcategory with ID '${id}' not found`);
    }

    // Check if new slug conflicts with existing ones
    if (
      updateSubcategoryDto.slug &&
      updateSubcategoryDto.slug !== existingSubcategory.slug
    ) {
      const slugConflict = await this.prisma.subcategory.findUnique({
        where: { slug: updateSubcategoryDto.slug },
      });

      if (slugConflict) {
        throw new ConflictException(
          `Subcategory with slug '${updateSubcategoryDto.slug}' already exists`
        );
      }
    }

    const updatedSubcategory = await this.prisma.subcategory.update({
      where: { id },
      data: updateSubcategoryDto,
    });

    return this.mapToSubcategoryResponse(updatedSubcategory);
  }

  // Delete subcategory
  async deleteSubcategory(id: string): Promise<void> {
    // Check if subcategory exists
    const existingSubcategory = await this.prisma.subcategory.findUnique({
      where: { id },
    });

    if (!existingSubcategory) {
      throw new NotFoundException(`Subcategory with ID '${id}' not found`);
    }

    await this.prisma.subcategory.delete({
      where: { id },
    });
  }

  // Get subcategory by ID
  async getSubcategoryById(id: string): Promise<SubcategoryResponseDto> {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID '${id}' not found`);
    }

    return this.mapToSubcategoryResponse(subcategory);
  }

  // Get all subcategories for a category
  async getSubcategoriesByCategory(
    categoryId: string,
    includeInactive = false
  ): Promise<SubcategoryResponseDto[]> {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${categoryId}' not found`);
    }

    const subcategories = await this.prisma.subcategory.findMany({
      where: {
        categoryId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { sortOrder: 'asc' },
    });

    return subcategories.map((subcategory) =>
      this.mapToSubcategoryResponse(subcategory)
    );
  }

  // Helper method to generate slug from name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Helper method to map category to response DTO
  private mapToCategoryResponse(category: any): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      subcategories: category.subcategories?.map((sub: any) =>
        this.mapToSubcategoryResponse(sub)
      ),
    };
  }

  // Helper method to map subcategory to response DTO
  private mapToSubcategoryResponse(subcategory: any): SubcategoryResponseDto {
    return {
      id: subcategory.id,
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description,
      icon: subcategory.icon,
      isActive: subcategory.isActive,
      sortOrder: subcategory.sortOrder,
      categoryId: subcategory.categoryId,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    };
  }
}
