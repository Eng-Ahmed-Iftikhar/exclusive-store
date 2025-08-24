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
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
  CategoryResponseDto,
  SubcategoryResponseDto,
} from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ===== CATEGORY ENDPOINTS =====

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories(
    @Query('includeInactive') includeInactive?: string,
  ): Promise<CategoryResponseDto[]> {
    const includeInactiveBool = includeInactive === 'true';
    return this.categoryService.getAllCategories(includeInactiveBool);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoryService.getCategoryById(id);
  }

  @Get('slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    return this.categoryService.getCategoryBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }

  // ===== SUBCATEGORY ENDPOINTS =====

  @Post(':categoryId/subcategories')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSubcategory(
    @Param('categoryId') categoryId: string,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<SubcategoryResponseDto> {
    return this.categoryService.createSubcategory(categoryId, createSubcategoryDto);
  }

  @Get(':categoryId/subcategories')
  async getSubcategoriesByCategory(
    @Param('categoryId') categoryId: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<SubcategoryResponseDto[]> {
    const includeInactiveBool = includeInactive === 'true';
    return this.categoryService.getSubcategoriesByCategory(categoryId, includeInactiveBool);
  }

  @Get('subcategories/:id')
  async getSubcategoryById(@Param('id') id: string): Promise<SubcategoryResponseDto> {
    return this.categoryService.getSubcategoryById(id);
  }

  @Put('subcategories/:id')
  @UseGuards(JwtAuthGuard)
  async updateSubcategory(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<SubcategoryResponseDto> {
    return this.categoryService.updateSubcategory(id, updateSubcategoryDto);
  }

  @Delete('subcategories/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubcategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteSubcategory(id);
  }
}
