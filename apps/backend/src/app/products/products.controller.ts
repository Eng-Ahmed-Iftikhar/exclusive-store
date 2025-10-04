import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
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
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from './dto/product.dto';
import {
  CreateVariantDto,
  UpdateVariantDto,
  VariantResponseDto,
  CreatePriceDto,
  UpdatePriceDto,
  PriceResponseDto,
  CreateStockDto,
  UpdateStockDto,
  StockResponseDto,
  CreateProductImageDto,
  UpdateProductImageDto,
  ProductImageResponseDto,
} from './dto/variant.dto';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ==================== PRODUCT ENDPOINTS ====================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product with basic information',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'SKU already exists' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req: any
  ): Promise<ProductResponseDto> {
    return this.productsService.createProduct(createProductDto, req.user?.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve a paginated list of products with search functionality',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
    example: 't-shirt',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  async getAllProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string
  ): Promise<{
    products: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.productsService.getAllProducts(
      parseInt(page || '1'),
      parseInt(limit || '20'),
      search || ''
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description:
      'Retrieve detailed product information including variants, images, prices, and stock',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.getProductById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Update product information',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'SKU conflict' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete product',
    description:
      'Delete a product and all its variants, prices, stock, and images',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteProduct(id);
  }

  // ==================== VARIANT ENDPOINTS ====================

  @Post('variants')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a product variant',
    description:
      'Create a new variant for a product with specific attributes (color, size, etc.)',
  })
  @ApiBody({ type: CreateVariantDto })
  @ApiResponse({
    status: 201,
    description: 'Variant created successfully',
    type: VariantResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Variant SKU already exists' })
  async createVariant(
    @Body() createVariantDto: CreateVariantDto,
    @Request() req: any
  ): Promise<VariantResponseDto> {
    return this.productsService.createVariant(createVariantDto, req.user?.id);
  }

  @Get(':productId/variants')
  @ApiOperation({
    summary: 'Get product variants',
    description: 'Retrieve all variants for a specific product',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Variants retrieved successfully',
    type: [VariantResponseDto],
  })
  async getVariantsByProduct(
    @Param('productId') productId: string
  ): Promise<VariantResponseDto[]> {
    return this.productsService.getVariantsByProduct(productId);
  }

  @Get('variants/:id')
  @ApiOperation({
    summary: 'Get variant by ID',
    description:
      'Retrieve detailed variant information including prices, stock, and images',
  })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiResponse({
    status: 200,
    description: 'Variant retrieved successfully',
    type: VariantResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async getVariantById(@Param('id') id: string): Promise<VariantResponseDto> {
    return this.productsService.getVariantById(id);
  }

  @Put('variants/:id')
  @ApiOperation({
    summary: 'Update variant',
    description: 'Update variant information and attributes',
  })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiBody({ type: UpdateVariantDto })
  @ApiResponse({
    status: 200,
    description: 'Variant updated successfully',
    type: VariantResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  @ApiResponse({ status: 409, description: 'SKU conflict' })
  async updateVariant(
    @Param('id') id: string,
    @Body() updateVariantDto: UpdateVariantDto
  ): Promise<VariantResponseDto> {
    return this.productsService.updateVariant(id, updateVariantDto);
  }

  @Delete('variants/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete variant',
    description:
      'Delete a product variant and its associated prices, stock, and images',
  })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  @ApiResponse({ status: 204, description: 'Variant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async deleteVariant(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteVariant(id);
  }

  // ==================== PRICE ENDPOINTS ====================

  @Post('prices')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create price for variant',
    description: 'Add pricing information to a product variant',
  })
  @ApiBody({ type: CreatePriceDto })
  @ApiResponse({
    status: 201,
    description: 'Price created successfully',
    type: PriceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  async createPrice(
    @Body() createPriceDto: CreatePriceDto
  ): Promise<PriceResponseDto> {
    return this.productsService.createPrice(createPriceDto);
  }

  @Get('variants/:variantId/prices')
  @ApiOperation({
    summary: 'Get prices for variant',
    description: 'Retrieve all pricing records for a specific variant',
  })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  @ApiResponse({
    status: 200,
    description: 'Prices retrieved successfully',
    type: [PriceResponseDto],
  })
  async getPricesByVariant(
    @Param('variantId') variantId: string
  ): Promise<PriceResponseDto[]> {
    return this.productsService.getPricesByVariant(variantId);
  }

  @Put('prices/:id')
  @ApiOperation({
    summary: 'Update price',
    description: 'Update pricing information',
  })
  @ApiParam({ name: 'id', description: 'Price ID' })
  @ApiBody({ type: UpdatePriceDto })
  @ApiResponse({
    status: 200,
    description: 'Price updated successfully',
    type: PriceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Price not found' })
  async updatePrice(
    @Param('id') id: string,
    @Body() updatePriceDto: UpdatePriceDto
  ): Promise<PriceResponseDto> {
    return this.productsService.updatePrice(id, updatePriceDto);
  }

  @Delete('prices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete price',
    description: 'Remove a price record',
  })
  @ApiParam({ name: 'id', description: 'Price ID' })
  @ApiResponse({ status: 204, description: 'Price deleted successfully' })
  @ApiResponse({ status: 404, description: 'Price not found' })
  async deletePrice(@Param('id') id: string): Promise<void> {
    return this.productsService.deletePrice(id);
  }

  // ==================== STOCK ENDPOINTS ====================

  @Post('stock')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create stock for variant',
    description: 'Initialize inventory tracking for a product variant',
  })
  @ApiBody({ type: CreateStockDto })
  @ApiResponse({
    status: 201,
    description: 'Stock created successfully',
    type: StockResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  @ApiResponse({
    status: 409,
    description: 'Stock already exists for this variant',
  })
  async createStock(
    @Body() createStockDto: CreateStockDto
  ): Promise<StockResponseDto> {
    return this.productsService.createStock(createStockDto);
  }

  @Get('variants/:variantId/stock')
  @ApiOperation({
    summary: 'Get stock for variant',
    description: 'Retrieve inventory information for a specific variant',
  })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock retrieved successfully',
    type: StockResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async getStockByVariant(
    @Param('variantId') variantId: string
  ): Promise<StockResponseDto | null> {
    return this.productsService.getStockByVariant(variantId);
  }

  @Put('stock/:id')
  @ApiOperation({
    summary: 'Update stock',
    description: 'Update inventory quantities and thresholds',
  })
  @ApiParam({ name: 'id', description: 'Stock ID' })
  @ApiBody({ type: UpdateStockDto })
  @ApiResponse({
    status: 200,
    description: 'Stock updated successfully',
    type: StockResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto
  ): Promise<StockResponseDto> {
    return this.productsService.updateStock(id, updateStockDto);
  }

  // ==================== IMAGE ENDPOINTS ====================

  @Post('images')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add image to product or variant',
    description:
      'Link an uploaded file to a product or variant. Must specify either productId or variantId.',
  })
  @ApiBody({ type: CreateProductImageDto })
  @ApiResponse({
    status: 201,
    description: 'Image linked successfully',
    type: ProductImageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Must specify productId or variantId',
  })
  @ApiResponse({
    status: 404,
    description: 'Product, variant, or file not found',
  })
  async createProductImage(
    @Body() createImageDto: CreateProductImageDto
  ): Promise<ProductImageResponseDto> {
    return this.productsService.createProductImage(createImageDto);
  }

  @Get(':productId/images')
  @ApiOperation({
    summary: 'Get product images',
    description: 'Retrieve all images for a specific product',
  })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Images retrieved successfully',
    type: [ProductImageResponseDto],
  })
  async getImagesByProduct(
    @Param('productId') productId: string
  ): Promise<ProductImageResponseDto[]> {
    return this.productsService.getImagesByProduct(productId);
  }

  @Get('variants/:variantId/images')
  @ApiOperation({
    summary: 'Get variant images',
    description: 'Retrieve all images for a specific variant',
  })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  @ApiResponse({
    status: 200,
    description: 'Images retrieved successfully',
    type: [ProductImageResponseDto],
  })
  async getImagesByVariant(
    @Param('variantId') variantId: string
  ): Promise<ProductImageResponseDto[]> {
    return this.productsService.getImagesByVariant(variantId);
  }

  @Put('images/:id')
  @ApiOperation({
    summary: 'Update product image',
    description: 'Update image metadata (alt text, primary status, sort order)',
  })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiBody({ type: UpdateProductImageDto })
  @ApiResponse({
    status: 200,
    description: 'Image updated successfully',
    type: ProductImageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async updateProductImage(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateProductImageDto
  ): Promise<ProductImageResponseDto> {
    return this.productsService.updateProductImage(id, updateImageDto);
  }

  @Delete('images/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete product image',
    description: 'Remove image link from product or variant',
  })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteProductImage(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteProductImage(id);
  }
}
