import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import {
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
  SubcategoryResponseDto,
  SubcategoryQueryDto,
  SubcategoryListResponseDto,
} from './dto/subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService
  ) {}

  async createSubcategory(
    createSubcategoryDto: CreateSubcategoryDto
  ): Promise<SubcategoryResponseDto> {
    const { categoryId, slug, name } = createSubcategoryDto;

    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Check if subcategory with this slug already exists
    const existingSubcategory = await this.prisma.subcategory.findUnique({
      where: { slug },
    });

    if (existingSubcategory) {
      throw new ConflictException(
        `Subcategory with slug '${slug}' already exists`
      );
    }

    // Check if icon file exists (if provided)
    if (createSubcategoryDto.iconFileId) {
      const iconFile = await this.prisma.file.findUnique({
        where: { id: createSubcategoryDto.iconFileId },
      });

      if (!iconFile) {
        throw new NotFoundException(
          `Icon file with ID ${createSubcategoryDto.iconFileId} not found`
        );
      }
    }

    try {
      const subcategory = await this.prisma.subcategory.create({
        data: {
          ...createSubcategoryDto,
          isActive: createSubcategoryDto.isActive ?? true,
          sortOrder: createSubcategoryDto.sortOrder ?? 0,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          iconFile: {
            select: {
              id: true,
              url: true,
              originalName: true,
            },
          },
        },
      });

      // Log activity
      await this.activityService.logSystemActivity(
        'Subcategory Created',
        `Subcategory '${name}' was created in category '${category.name}'`
      );

      return this.mapToSubcategoryResponse(subcategory);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Subcategory with slug '${slug}' already exists`
        );
      }
      throw error;
    }
  }

  async getAllSubcategories(
    query: SubcategoryQueryDto
  ): Promise<SubcategoryListResponseDto> {
    const {
      search,
      categoryId,
      includeInactive = false,
      page = 1,
      limit = 10,
      sortBy = 'sortOrder',
      sortOrder = 'asc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    try {
      const [subcategories, total] = await Promise.all([
        this.prisma.subcategory.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            iconFile: {
              select: {
                id: true,
                url: true,
                originalName: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.subcategory.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        subcategories: subcategories.map((subcategory) =>
          this.mapToSubcategoryResponse(subcategory)
        ),
        total,
        page,
        limit,
        totalPages,
      };
    } catch {
      throw new BadRequestException('Failed to retrieve subcategories');
    }
  }

  async getSubcategoryById(id: string): Promise<SubcategoryResponseDto> {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        iconFile: {
          select: {
            id: true,
            url: true,
            originalName: true,
          },
        },
      },
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }

    return this.mapToSubcategoryResponse(subcategory);
  }

  async getSubcategoryBySlug(slug: string): Promise<SubcategoryResponseDto> {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        iconFile: {
          select: {
            id: true,
            url: true,
            originalName: true,
          },
        },
      },
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with slug '${slug}' not found`);
    }

    return this.mapToSubcategoryResponse(subcategory);
  }

  async getSubcategoriesByCategory(
    categoryId: string,
    includeInactive = false
  ): Promise<SubcategoryResponseDto[]> {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const where: Record<string, unknown> = { categoryId };

    if (!includeInactive) {
      where.isActive = true;
    }

    const subcategories = await this.prisma.subcategory.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        iconFile: {
          select: {
            id: true,
            url: true,
            originalName: true,
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return subcategories.map((subcategory) =>
      this.mapToSubcategoryResponse(subcategory)
    );
  }

  async updateSubcategory(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto
  ): Promise<SubcategoryResponseDto> {
    // Check if subcategory exists
    const existingSubcategory = await this.prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingSubcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }

    // Check if slug is being updated and if it conflicts
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

    // Check if icon file exists (if provided)
    if (updateSubcategoryDto.iconFileId) {
      const iconFile = await this.prisma.file.findUnique({
        where: { id: updateSubcategoryDto.iconFileId },
      });

      if (!iconFile) {
        throw new NotFoundException(
          `Icon file with ID ${updateSubcategoryDto.iconFileId} not found`
        );
      }
    }

    try {
      const subcategory = await this.prisma.subcategory.update({
        where: { id },
        data: updateSubcategoryDto,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          iconFile: {
            select: {
              id: true,
              url: true,
              originalName: true,
            },
          },
        },
      });

      // Log activity
      await this.activityService.logSystemActivity(
        'Subcategory Updated',
        `Subcategory '${subcategory.name}' was updated in category '${subcategory.category.name}'`
      );

      return this.mapToSubcategoryResponse(subcategory);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Subcategory with slug '${updateSubcategoryDto.slug}' already exists`
        );
      }
      throw error;
    }
  }

  async deleteSubcategory(id: string): Promise<void> {
    // Check if subcategory exists
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        items: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }

    // Check if subcategory has associated items
    if (subcategory.items.length > 0) {
      throw new ConflictException(
        `Cannot delete subcategory '${subcategory.name}' because it has ${subcategory.items.length} associated item(s)`
      );
    }

    try {
      await this.prisma.subcategory.delete({
        where: { id },
      });

      // Log activity
      await this.activityService.logSystemActivity(
        'Subcategory Deleted',
        `Subcategory '${subcategory.name}' was deleted from category '${subcategory.category.name}'`
      );
    } catch {
      throw new BadRequestException('Failed to delete subcategory');
    }
  }

  private mapToSubcategoryResponse(subcategory: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    iconFileId: string | null;
    isActive: boolean;
    sortOrder: number;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
    iconFile: {
      id: string;
      url: string;
      originalName: string;
    } | null;
  }): SubcategoryResponseDto {
    return {
      id: subcategory.id,
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || undefined,
      iconFileId: subcategory.iconFileId || undefined,
      isActive: subcategory.isActive,
      sortOrder: subcategory.sortOrder,
      categoryId: subcategory.categoryId,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
      category: subcategory.category || undefined,
      iconFile: subcategory.iconFile || undefined,
    };
  }
}
