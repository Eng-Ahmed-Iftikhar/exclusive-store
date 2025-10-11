import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from './dto/category.dto';
import { SubcategoryResponseDto } from '../subcategory/dto/subcategory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CanManageCategories } from '../auth/decorators/access-control.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subcategoryService: SubcategoryService
  ) {}

  // ===== CATEGORY ENDPOINTS =====

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @CanManageCategories('create')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories(
    @Query('includeInactive') includeInactive?: string
  ): Promise<CategoryResponseDto[]> {
    const includeInactiveBool = includeInactive === 'true';
    return this.categoryService.getAllCategories(includeInactiveBool);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoryService.getCategoryById(id);
  }

  @Get('slug/:slug')
  async getCategoryBySlug(
    @Param('slug') slug: string
  ): Promise<CategoryResponseDto> {
    return this.categoryService.getCategoryBySlug(slug);
  }

  @Get(':id/subcategories')
  async getSubcategoriesByCategory(
    @Param('id') id: string,
    @Query('includeInactive') includeInactive?: string
  ): Promise<SubcategoryResponseDto[]> {
    const includeInactiveBool = includeInactive === 'true';
    return this.subcategoryService.getSubcategoriesByCategory(
      id,
      includeInactiveBool
    );
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @CanManageCategories('edit')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @CanManageCategories('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
