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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CanManageCategories } from '../auth/decorators/access-control.decorator';
import { SubcategoryService } from './subcategory.service';
import {
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
  SubcategoryResponseDto,
  SubcategoryQueryDto,
  SubcategoryListResponseDto,
} from './dto/subcategory.dto';

@ApiTags('Subcategories')
@ApiBearerAuth('JWT-auth')
@Controller('subcategories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @CanManageCategories('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new subcategory',
    description:
      'Create a new subcategory with the provided information. Requires category management permissions.',
  })
  @ApiBody({
    type: CreateSubcategoryDto,
    description: 'Subcategory creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Subcategory created successfully',
    type: SubcategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Subcategory with this slug already exists',
  })
  async createSubcategory(
    @Body() createSubcategoryDto: CreateSubcategoryDto
  ): Promise<SubcategoryResponseDto> {
    return this.subcategoryService.createSubcategory(createSubcategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all subcategories',
    description:
      'Retrieve a paginated list of subcategories with optional filtering and sorting.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for subcategory name or description',
    example: 'smartphone',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by category ID',
    example: 'clxxxxx123456789',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Include inactive subcategories',
    example: false,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by field',
    enum: ['name', 'sortOrder', 'createdAt', 'updatedAt'],
    example: 'name',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Subcategories retrieved successfully',
    type: SubcategoryListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async getAllSubcategories(
    @Query() query: SubcategoryQueryDto
  ): Promise<SubcategoryListResponseDto> {
    return this.subcategoryService.getAllSubcategories(query);
  }

  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Get subcategories by category',
    description: 'Retrieve all subcategories belonging to a specific category.',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'Category ID',
    example: 'clxxxxx123456789',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Include inactive subcategories',
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Subcategories retrieved successfully',
    type: [SubcategoryResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async getSubcategoriesByCategory(
    @Param('categoryId') categoryId: string,
    @Query('includeInactive') includeInactive?: string
  ): Promise<SubcategoryResponseDto[]> {
    const includeInactiveBool = includeInactive === 'true';
    return this.subcategoryService.getSubcategoriesByCategory(
      categoryId,
      includeInactiveBool
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get subcategory by ID',
    description: 'Retrieve a specific subcategory by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Subcategory ID',
    example: 'clxxxxx123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Subcategory retrieved successfully',
    type: SubcategoryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategory not found',
  })
  async getSubcategoryById(
    @Param('id') id: string
  ): Promise<SubcategoryResponseDto> {
    return this.subcategoryService.getSubcategoryById(id);
  }

  @Put(':id')
  @CanManageCategories('edit')
  @ApiOperation({
    summary: 'Update subcategory',
    description:
      'Update an existing subcategory. Requires category management permissions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Subcategory ID',
    example: 'clxxxxx123456789',
  })
  @ApiBody({
    type: UpdateSubcategoryDto,
    description: 'Subcategory update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Subcategory updated successfully',
    type: SubcategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategory not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Subcategory with this slug already exists',
  })
  async updateSubcategory(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto
  ): Promise<SubcategoryResponseDto> {
    return this.subcategoryService.updateSubcategory(id, updateSubcategoryDto);
  }

  @Delete(':id')
  @CanManageCategories('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete subcategory',
    description:
      'Delete a subcategory. Requires category management permissions.',
  })
  @ApiParam({
    name: 'id',
    description: 'Subcategory ID',
    example: 'clxxxxx123456789',
  })
  @ApiResponse({
    status: 204,
    description: 'Subcategory deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategory not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Subcategory has associated items',
  })
  async deleteSubcategory(@Param('id') id: string): Promise<void> {
    return this.subcategoryService.deleteSubcategory(id);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get subcategory by slug',
    description: 'Retrieve a specific subcategory by its slug.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Subcategory slug',
    example: 'smartphones',
  })
  @ApiResponse({
    status: 200,
    description: 'Subcategory retrieved successfully',
    type: SubcategoryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Subcategory not found',
  })
  async getSubcategoryBySlug(
    @Param('slug') slug: string
  ): Promise<SubcategoryResponseDto> {
    return this.subcategoryService.getSubcategoryBySlug(slug);
  }
}
