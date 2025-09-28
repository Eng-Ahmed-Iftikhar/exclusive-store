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
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateItemDto,
  UpdateItemDto,
  CreatePriceDto,
  UpdatePriceDto,
  CreateStockDto,
  UpdateStockDto,
  CreateItemImageDto,
  UpdateItemImageDto,
  CreateReviewDto,
  UpdateReviewDto,
  AdminUpdateReviewDto,
  CreateRatingDto,
  UpdateRatingDto,
  CreateFavoriteDto,
  ItemResponseDto,
  PriceResponseDto,
  StockResponseDto,
  ItemImageResponseDto,
  ReviewResponseDto,
  RatingResponseDto,
  FavoriteResponseDto,
  ItemQueryDto,
} from './dto/item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ===== PRODUCT ENDPOINTS =====

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body() createItemDto: CreateItemDto,
    @Request() req: any
  ): Promise<ItemResponseDto> {
    const userId = req.user?.id;
    return this.productsService.createItem(createItemDto, userId);
  }

  @Get()
  async getAllProducts(
    @Query() query: ItemQueryDto,
    @Request() req: any
  ): Promise<{
    products: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userId = req.user?.id;
    const result = await this.productsService.getAllItems(query, userId);
    return {
      products: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  // ===== FEATURED PRODUCTS =====

  @Get('featured')
  async getFeaturedProducts(@Request() req: any): Promise<ItemResponseDto[]> {
    const userId = req.user?.id;
    return this.productsService.getFeaturedItems(userId, 10);
  }

  @Get('best-selling')
  async getBestSellingProducts(
    @Request() req: any
  ): Promise<ItemResponseDto[]> {
    const userId = req.user?.id;
    return this.productsService.getBestSellingItems(userId, 10);
  }

  @Get('top-rated')
  async getTopRatedProducts(
    @Request() req: any,
    @Query('minRating') minRating?: string,
    @Query('limit') limit?: string
  ): Promise<ItemResponseDto[]> {
    const userId = req.user?.id;
    const minRatingNum = minRating ? parseInt(minRating) : 4;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.productsService.getItemsByRating(
      userId,
      minRatingNum,
      limitNum
    );
  }

  @Get('new-arrivals')
  async getNewArrivalProducts(
    @Request() req: any,
    @Query('limit') limit?: string
  ): Promise<ItemResponseDto[]> {
    const userId = req.user?.id;
    const limitNum = limit ? parseInt(limit) : 8;
    return this.productsService.getNewArrivalItems(userId, limitNum);
  }

  // ===== CATEGORY PRODUCTS =====

  @Get('category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: Omit<ItemQueryDto, 'categoryId'>,
    @Request() req: any
  ): Promise<{
    products: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userId = req.user?.id;
    const result = await this.productsService.getAllItems(
      { ...query, categoryId },
      userId
    );
    return {
      products: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get('subcategory/:subcategoryId')
  async getProductsBySubcategory(
    @Param('subcategoryId') subcategoryId: string,
    @Query() query: Omit<ItemQueryDto, 'subcategoryId'>,
    @Request() req: any
  ): Promise<{
    products: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userId = req.user?.id;
    const result = await this.productsService.getAllItems(
      { ...query, subcategoryId },
      userId
    );
    return {
      products: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  // ===== SEARCH PRODUCTS =====

  @Get('search')
  async searchProducts(
    @Query() query: ItemQueryDto,
    @Request() req: any
  ): Promise<{
    products: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userId = req.user?.id;
    const result = await this.productsService.getAllItems(query, userId);
    return {
      products: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  async getProductById(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<ItemResponseDto> {
    const userId = req.user?.id;
    return this.productsService.getItemById(id, userId);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto
  ): Promise<ItemResponseDto> {
    return this.productsService.updateItem(id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteItem(id);
  }

  // ===== PRICE ENDPOINTS =====

  @Post('prices')
  @HttpCode(HttpStatus.CREATED)
  async createPrice(
    @Body() createPriceDto: CreatePriceDto
  ): Promise<PriceResponseDto> {
    return this.productsService.createPrice(createPriceDto);
  }

  @Put('prices/:id')
  async updatePrice(
    @Param('id') id: string,
    @Body() updatePriceDto: UpdatePriceDto
  ): Promise<PriceResponseDto> {
    return this.productsService.updatePrice(id, updatePriceDto);
  }

  @Delete('prices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePrice(@Param('id') id: string): Promise<void> {
    return this.productsService.deletePrice(id);
  }

  // ===== STOCK ENDPOINTS =====

  @Post('stock')
  @HttpCode(HttpStatus.CREATED)
  async createStock(
    @Body() createStockDto: CreateStockDto
  ): Promise<StockResponseDto> {
    return this.productsService.createStock(createStockDto);
  }

  @Put('stock/:id')
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto
  ): Promise<StockResponseDto> {
    return this.productsService.updateStock(id, updateStockDto);
  }

  @Delete('stock/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStock(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteStock(id);
  }

  // ===== IMAGE ENDPOINTS =====

  @Post('images')
  @HttpCode(HttpStatus.CREATED)
  async createProductImage(
    @Body() createItemImageDto: CreateItemImageDto
  ): Promise<ItemImageResponseDto> {
    return this.productsService.createItemImage(createItemImageDto);
  }

  @Put('images/:id')
  async updateProductImage(
    @Param('id') id: string,
    @Body() updateItemImageDto: UpdateItemImageDto
  ): Promise<ItemImageResponseDto> {
    return this.productsService.updateItemImage(id, updateItemImageDto);
  }

  @Delete('images/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProductImage(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteItemImage(id);
  }

  // ===== REVIEW ENDPOINTS =====

  @Post('reviews')
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Request() req: any,
    @Body() createReviewDto: CreateReviewDto
  ): Promise<ReviewResponseDto> {
    const userId = req.user.id;
    return this.productsService.createReview(userId, createReviewDto);
  }

  @Put('reviews/:id')
  async updateReview(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateReviewDto: UpdateReviewDto
  ): Promise<ReviewResponseDto> {
    const userId = req.user.id;
    return this.productsService.updateReview(id, userId, updateReviewDto);
  }

  @Put('reviews/:id/admin')
  async adminUpdateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: AdminUpdateReviewDto
  ): Promise<ReviewResponseDto> {
    return this.productsService.adminUpdateReview(id, updateReviewDto);
  }

  @Delete('reviews/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<void> {
    const userId = req.user.id;
    return this.productsService.deleteReview(id, userId);
  }

  // ===== RATING ENDPOINTS =====

  @Post('ratings')
  @HttpCode(HttpStatus.CREATED)
  async createRating(
    @Request() req: any,
    @Body() createRatingDto: CreateRatingDto
  ): Promise<RatingResponseDto> {
    const userId = req.user.id;
    return this.productsService.createRating(userId, createRatingDto);
  }

  @Put('ratings/:id')
  async updateRating(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateRatingDto: UpdateRatingDto
  ): Promise<RatingResponseDto> {
    const userId = req.user.id;
    return this.productsService.updateRating(id, userId, updateRatingDto);
  }

  @Delete('ratings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRating(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<void> {
    const userId = req.user.id;
    return this.productsService.deleteRating(id, userId);
  }

  // ===== FAVORITE ENDPOINTS =====

  @Post('favorites')
  @HttpCode(HttpStatus.CREATED)
  async addToFavorites(
    @Request() req: any,
    @Body() createFavoriteDto: CreateFavoriteDto
  ): Promise<FavoriteResponseDto> {
    const userId = req.user.id;
    return this.productsService.addToFavorites(userId, createFavoriteDto);
  }

  @Delete('favorites/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromFavorites(
    @Param('itemId') itemId: string,
    @Request() req: any
  ): Promise<void> {
    const userId = req.user.id;
    return this.productsService.removeFromFavorites(userId, itemId);
  }

  @Get('favorites/user')
  async getUserFavorites(@Request() req: any): Promise<FavoriteResponseDto[]> {
    const userId = req.user.id;
    return this.productsService.getUserFavorites(userId);
  }
}
