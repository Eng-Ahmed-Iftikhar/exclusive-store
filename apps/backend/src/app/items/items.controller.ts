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
import { ItemsService } from './items.service';
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

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // ===== ITEM ENDPOINTS =====

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createItem(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    return this.itemsService.createItem(createItemDto);
  }

  @Get()
  async getAllItems(
    @Query() query: ItemQueryDto,
    @Request() req: any,
  ): Promise<{
    items: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userId = req.user?.id;
    return this.itemsService.getAllItems(query, userId);
  }

  // ===== FEATURED ITEMS =====

  @Get('featured')
  async getFeaturedItems(@Request() req: any): Promise<ItemResponseDto[]> {
    const userId = req.user?.id;
    return this.itemsService.getFeaturedItems(userId, 10);
  }

  @Get('best-selling')
  async getBestSellingItems(@Request() req: any): Promise<ItemResponseDto[]> {
    const userId = req.user?.id;
    return this.itemsService.getBestSellingItems(userId, 10);
  }

  @Get('top-rated')
  async getTopRatedItems(
    @Request() req: any,
    @Query('minRating') minRating?: string,
    @Query('limit') limit?: string,
  ): Promise<ItemResponseDto[]> {
    const userId = req.user?.id;
    const minRatingNum = minRating ? parseInt(minRating) : 4;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.itemsService.getItemsByRating(userId, minRatingNum, limitNum);
  }

  @Get('new-arrivals')
  async getNewArrivalItems(
    @Request() req: any,
    @Query('limit') limit?: string,
  ): Promise<ItemResponseDto[]> {
    const userId = req.user?.id;
    const limitNum = limit ? parseInt(limit) : 8;
    return this.itemsService.getNewArrivalItems(userId, limitNum);
  }

  // ===== CATEGORY ITEMS =====

  @Get('category/:categoryId')
  async getItemsByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: Omit<ItemQueryDto, 'categoryId'>,
    @Request() req: any,
  ): Promise<{
    items: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userId = req.user?.id;
    return this.itemsService.getAllItems({ ...query, categoryId }, userId);
  }

  @Get('subcategory/:subcategoryId')
  async getItemsBySubcategory(
    @Param('subcategoryId') subcategoryId: string,
    @Query() query: Omit<ItemQueryDto, 'subcategoryId'>,
    @Request() req: any,
  ): Promise<{
    items: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userId = req.user?.id;
    return this.itemsService.getAllItems({ ...query, subcategoryId }, userId);
  }

  // ===== SEARCH ITEMS =====

  @Get('search/search')
  async searchItems(
    @Query() query: ItemQueryDto,
    @Request() req: any,
  ): Promise<{
    items: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const userId = req.user?.id;
    return this.itemsService.getAllItems(query, userId);
  }

  @Get(':id')
  async getItemById(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ItemResponseDto> {
    const userId = req.user?.id;
    return this.itemsService.getItemById(id, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    return this.itemsService.updateItem(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItem(@Param('id') id: string): Promise<void> {
    return this.itemsService.deleteItem(id);
  }

  // ===== PRICE ENDPOINTS =====

  @Post('prices')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPrice(@Body() createPriceDto: CreatePriceDto): Promise<PriceResponseDto> {
    return this.itemsService.createPrice(createPriceDto);
  }

  @Put('prices/:id')
  @UseGuards(JwtAuthGuard)
  async updatePrice(
    @Param('id') id: string,
    @Body() updatePriceDto: UpdatePriceDto,
  ): Promise<PriceResponseDto> {
    return this.itemsService.updatePrice(id, updatePriceDto);
  }

  @Delete('prices/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePrice(@Param('id') id: string): Promise<void> {
    return this.itemsService.deletePrice(id);
  }

  // ===== STOCK ENDPOINTS =====

  @Post('stock')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createStock(@Body() createStockDto: CreateStockDto): Promise<StockResponseDto> {
    return this.itemsService.createStock(createStockDto);
  }

  @Put('stock/:id')
  @UseGuards(JwtAuthGuard)
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<StockResponseDto> {
    return this.itemsService.updateStock(id, updateStockDto);
  }

  @Delete('stock/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStock(@Param('id') id: string): Promise<void> {
    return this.itemsService.deleteStock(id);
  }

  // ===== IMAGE ENDPOINTS =====

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createItemImage(@Body() createItemImageDto: CreateItemImageDto): Promise<ItemImageResponseDto> {
    return this.itemsService.createItemImage(createItemImageDto);
  }

  @Put('images/:id')
  @UseGuards(JwtAuthGuard)
  async updateItemImage(
    @Param('id') id: string,
    @Body() updateItemImageDto: UpdateItemImageDto,
  ): Promise<ItemImageResponseDto> {
    return this.itemsService.updateItemImage(id, updateItemImageDto);
  }

  @Delete('images/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItemImage(@Param('id') id: string): Promise<void> {
    return this.itemsService.deleteItemImage(id);
  }

  // ===== REVIEW ENDPOINTS =====

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Request() req: any,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const userId = req.user.id;
    return this.itemsService.createReview(userId, createReviewDto);
  }

  @Put('reviews/:id')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const userId = req.user.id;
    return this.itemsService.updateReview(id, userId, updateReviewDto);
  }

  @Put('reviews/:id/admin')
  @UseGuards(JwtAuthGuard)
  async adminUpdateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: AdminUpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.itemsService.adminUpdateReview(id, updateReviewDto);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user.id;
    return this.itemsService.deleteReview(id, userId);
  }

  // ===== RATING ENDPOINTS =====

  @Post('ratings')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRating(
    @Request() req: any,
    @Body() createRatingDto: CreateRatingDto,
  ): Promise<RatingResponseDto> {
    const userId = req.user.id;
    return this.itemsService.createRating(userId, createRatingDto);
  }

  @Put('ratings/:id')
  @UseGuards(JwtAuthGuard)
  async updateRating(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<RatingResponseDto> {
    const userId = req.user.id;
    return this.itemsService.updateRating(id, userId, updateRatingDto);
  }

  @Delete('ratings/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRating(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user.id;
    return this.itemsService.deleteRating(id, userId);
  }

  // ===== FAVORITE ENDPOINTS =====

  @Post('favorites')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addToFavorites(
    @Request() req: any,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ): Promise<FavoriteResponseDto> {
    const userId = req.user.id;
    return this.itemsService.addToFavorites(userId, createFavoriteDto);
  }

  @Delete('favorites/:itemId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromFavorites(
    @Param('itemId') itemId: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user.id;
    return this.itemsService.removeFromFavorites(userId, itemId);
  }

  @Get('favorites/user')
  @UseGuards(JwtAuthGuard)
  async getUserFavorites(@Request() req: any): Promise<FavoriteResponseDto[]> {
    const userId = req.user.id;
    return this.itemsService.getUserFavorites(userId);
  }

}
