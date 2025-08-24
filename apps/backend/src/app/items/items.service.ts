import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  // ===== ITEM OPERATIONS =====

  async createItem(createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    // Check if SKU already exists
    if (createItemDto.sku) {
      const existingItem = await this.prisma.item.findUnique({
        where: { sku: createItemDto.sku },
      });

      if (existingItem) {
        throw new ConflictException(
          `Item with SKU '${createItemDto.sku}' already exists`
        );
      }
    }

    const item = await this.prisma.item.create({
      data: createItemDto,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        prices: true,
        stock: true,
        images: true,
        reviews: true,
        ratings: true,
        favorites: true,
      },
    });

    return this.mapToItemResponse(item);
  }

  async getAllItems(
    query: ItemQueryDto,
    userId?: string
  ): Promise<{
    items: ItemResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      categoryId,
      category,
      subcategoryId,
      subcategory,
      isFeatured,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      minPrice,
      maxPrice,
      minRating,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category filtering
    if (categoryId) {
      where.categoryId = categoryId;
    } else if (category) {
      where.category = {
        slug: category,
      };
    }

    // Subcategory filtering
    if (subcategoryId) {
      where.subcategoryId = subcategoryId;
    } else if (subcategory) {
      where.subcategory = {
        slug: subcategory,
      };
    }

    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (isActive !== undefined) where.isActive = isActive;

    // Price filtering
    if (minPrice || maxPrice) {
      where.prices = {
        some: {
          isActive: true,
          ...(minPrice && { price: { gte: minPrice } }),
          ...(maxPrice && { price: { lte: maxPrice } }),
        },
      };
    }

    // Rating filtering
    if (minRating) {
      where.ratings = {
        some: {
          rating: { gte: minRating },
        },
      };
    }

    // Build orderBy clause to support price/rating sorting via relation aggregates
    const orderByClause: any = (() => {
      if (sortBy === 'price') {
        // Sort by the minimum active price per item (closest representation of current price)
        return { prices: { _min: { price: sortOrder } } };
      }
      if (sortBy === 'rating') {
        // Sort by average rating
        return { ratings: { _avg: { rating: sortOrder } } };
      }
      return { [sortBy]: sortOrder };
    })();

    // Get items with relations
    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          subcategory: {
            select: { id: true, name: true, slug: true },
          },
          prices: true,
          stock: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          reviews: {
            where: { isApproved: true },
          },
          ratings: true,
          favorites: userId
            ? {
                where: { userId },
              }
            : false,
        },
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      this.prisma.item.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((item) => this.mapToItemResponse(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getItemById(id: string, userId?: string): Promise<ItemResponseDto> {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        prices: true,
        stock: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        ratings: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        favorites: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID '${id}' not found`);
    }

    return this.mapToItemResponse(item);
  }

  async updateItem(
    id: string,
    updateItemDto: UpdateItemDto
  ): Promise<ItemResponseDto> {
    // Check if item exists
    const existingItem = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!existingItem) {
      throw new NotFoundException(`Item with ID '${id}' not found`);
    }

    // Check if new SKU conflicts with existing ones
    if (updateItemDto.sku && updateItemDto.sku !== existingItem.sku) {
      const skuConflict = await this.prisma.item.findUnique({
        where: { sku: updateItemDto.sku },
      });

      if (skuConflict) {
        throw new ConflictException(
          `Item with SKU '${updateItemDto.sku}' already exists`
        );
      }
    }

    const updatedItem = await this.prisma.item.update({
      where: { id },
      data: updateItemDto,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        prices: true,
        stock: true,
        images: true,
        reviews: true,
        ratings: true,
        favorites: true,
      },
    });

    return this.mapToItemResponse(updatedItem);
  }

  async deleteItem(id: string): Promise<void> {
    // Check if item exists
    const existingItem = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!existingItem) {
      throw new NotFoundException(`Item with ID '${id}' not found`);
    }

    // Delete item (related data will be deleted due to cascade)
    await this.prisma.item.delete({
      where: { id },
    });
  }

  // ===== PRICE OPERATIONS =====

  async createPrice(createPriceDto: CreatePriceDto): Promise<PriceResponseDto> {
    // Check if item exists
    const item = await this.prisma.item.findUnique({
      where: { id: createPriceDto.itemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID '${createPriceDto.itemId}' not found`
      );
    }

    const price = await this.prisma.price.create({
      data: createPriceDto,
    });

    return this.mapToPriceResponse(price);
  }

  async updatePrice(
    id: string,
    updatePriceDto: UpdatePriceDto
  ): Promise<PriceResponseDto> {
    // Check if price exists
    const existingPrice = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!existingPrice) {
      throw new NotFoundException(`Price with ID '${id}' not found`);
    }

    const updatedPrice = await this.prisma.price.update({
      where: { id },
      data: updatePriceDto,
    });

    return this.mapToPriceResponse(updatedPrice);
  }

  async deletePrice(id: string): Promise<void> {
    // Check if price exists
    const existingPrice = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!existingPrice) {
      throw new NotFoundException(`Price with ID '${id}' not found`);
    }

    await this.prisma.price.delete({
      where: { id },
    });
  }

  // ===== STOCK OPERATIONS =====

  async createStock(createStockDto: CreateStockDto): Promise<StockResponseDto> {
    // Check if item exists
    const item = await this.prisma.item.findUnique({
      where: { id: createStockDto.itemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID '${createStockDto.itemId}' not found`
      );
    }

    // Check if stock already exists for this item
    const existingStock = await this.prisma.stock.findUnique({
      where: { itemId: createStockDto.itemId },
    });

    if (existingStock) {
      throw new ConflictException(
        `Stock already exists for item '${createStockDto.itemId}'`
      );
    }

    const stock = await this.prisma.stock.create({
      data: createStockDto,
    });

    return this.mapToStockResponse(stock);
  }

  async updateStock(
    id: string,
    updateStockDto: UpdateStockDto
  ): Promise<StockResponseDto> {
    // Check if stock exists
    const existingStock = await this.prisma.stock.findUnique({
      where: { id },
    });

    if (!existingStock) {
      throw new NotFoundException(`Stock with ID '${id}' not found`);
    }

    const updatedStock = await this.prisma.stock.update({
      where: { id },
      data: updateStockDto,
    });

    return this.mapToStockResponse(updatedStock);
  }

  async deleteStock(id: string): Promise<void> {
    // Check if stock exists
    const existingStock = await this.prisma.stock.findUnique({
      where: { id },
    });

    if (!existingStock) {
      throw new NotFoundException(`Stock with ID '${id}' not found`);
    }

    await this.prisma.stock.delete({
      where: { id },
    });
  }

  // ===== IMAGE OPERATIONS =====

  async createItemImage(
    createItemImageDto: CreateItemImageDto
  ): Promise<ItemImageResponseDto> {
    // Check if item exists
    const item = await this.prisma.item.findUnique({
      where: { id: createItemImageDto.itemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID '${createItemImageDto.itemId}' not found`
      );
    }

    // If this is the primary image, unset other primary images
    if (createItemImageDto.isPrimary) {
      await this.prisma.itemImage.updateMany({
        where: { itemId: createItemImageDto.itemId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const image = await this.prisma.itemImage.create({
      data: createItemImageDto,
    });

    return this.mapToItemImageResponse(image);
  }

  async updateItemImage(
    id: string,
    updateItemImageDto: UpdateItemImageDto
  ): Promise<ItemImageResponseDto> {
    // Check if image exists
    const existingImage = await this.prisma.itemImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      throw new NotFoundException(`Image with ID '${id}' not found`);
    }

    // If this is being set as primary, unset other primary images
    if (updateItemImageDto.isPrimary) {
      await this.prisma.itemImage.updateMany({
        where: { itemId: existingImage.itemId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const updatedImage = await this.prisma.itemImage.update({
      where: { id },
      data: updateItemImageDto,
    });

    return this.mapToItemImageResponse(updatedImage);
  }

  async deleteItemImage(id: string): Promise<void> {
    // Check if image exists
    const existingImage = await this.prisma.itemImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      throw new NotFoundException(`Image with ID '${id}' not found`);
    }

    await this.prisma.itemImage.delete({
      where: { id },
    });
  }

  // ===== REVIEW OPERATIONS =====

  async createReview(
    userId: string,
    createReviewDto: CreateReviewDto
  ): Promise<ReviewResponseDto> {
    // Check if item exists
    const item = await this.prisma.item.findUnique({
      where: { id: createReviewDto.itemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID '${createReviewDto.itemId}' not found`
      );
    }

    // Check if user already reviewed this item
    const existingReview = await this.prisma.review.findUnique({
      where: { itemId_userId: { itemId: createReviewDto.itemId, userId } },
    });

    if (existingReview) {
      throw new ConflictException(`You have already reviewed this item`);
    }

    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return this.mapToReviewResponse(review);
  }

  async updateReview(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto
  ): Promise<ReviewResponseDto> {
    // Check if review exists and belongs to user
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID '${id}' not found`);
    }

    if (existingReview.userId !== userId) {
      throw new BadRequestException(`You can only update your own reviews`);
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return this.mapToReviewResponse(updatedReview);
  }

  async adminUpdateReview(
    id: string,
    updateReviewDto: AdminUpdateReviewDto
  ): Promise<ReviewResponseDto> {
    // Check if review exists
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID '${id}' not found`);
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return this.mapToReviewResponse(updatedReview);
  }

  async deleteReview(id: string, userId: string): Promise<void> {
    // Check if review exists and belongs to user
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review with ID '${id}' not found`);
    }

    if (existingReview.userId !== userId) {
      throw new BadRequestException(`You can only delete your own reviews`);
    }

    await this.prisma.review.delete({
      where: { id },
    });
  }

  // ===== RATING OPERATIONS =====

  async createRating(
    userId: string,
    createRatingDto: CreateRatingDto
  ): Promise<RatingResponseDto> {
    // Check if item exists
    const item = await this.prisma.item.findUnique({
      where: { id: createRatingDto.itemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID '${createRatingDto.itemId}' not found`
      );
    }

    // Check if user already rated this item
    const existingRating = await this.prisma.rating.findUnique({
      where: { itemId_userId: { itemId: createRatingDto.itemId, userId } },
    });

    if (existingRating) {
      throw new ConflictException(`You have already rated this item`);
    }

    const rating = await this.prisma.rating.create({
      data: {
        ...createRatingDto,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return this.mapToRatingResponse(rating);
  }

  async updateRating(
    id: string,
    userId: string,
    updateRatingDto: UpdateRatingDto
  ): Promise<RatingResponseDto> {
    // Check if rating exists and belongs to user
    const existingRating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!existingRating) {
      throw new NotFoundException(`Rating with ID '${id}' not found`);
    }

    if (existingRating.userId !== userId) {
      throw new BadRequestException(`You can only update your own ratings`);
    }

    const updatedRating = await this.prisma.rating.update({
      where: { id },
      data: updateRatingDto,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return this.mapToRatingResponse(updatedRating);
  }

  async deleteRating(id: string, userId: string): Promise<void> {
    // Check if rating exists and belongs to user
    const existingRating = await this.prisma.rating.findUnique({
      where: { id },
    });

    if (!existingRating) {
      throw new NotFoundException(`Rating with ID '${id}' not found`);
    }

    if (existingRating.userId !== userId) {
      throw new BadRequestException(`You can only delete your own ratings`);
    }

    await this.prisma.rating.delete({
      where: { id },
    });
  }

  // ===== FAVORITE OPERATIONS =====

  async addToFavorites(
    userId: string,
    createFavoriteDto: CreateFavoriteDto
  ): Promise<FavoriteResponseDto> {
    // Check if item exists
    const item = await this.prisma.item.findUnique({
      where: { id: createFavoriteDto.itemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID '${createFavoriteDto.itemId}' not found`
      );
    }

    // Check if already in favorites
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: { itemId_userId: { itemId: createFavoriteDto.itemId, userId } },
    });

    if (existingFavorite) {
      throw new ConflictException(`Item is already in your favorites`);
    }

    const favorite = await this.prisma.favorite.create({
      data: {
        ...createFavoriteDto,
        userId,
      },
      include: {
        item: {
          select: { id: true, name: true, description: true },
        },
      },
    });

    return this.mapToFavoriteResponse(favorite);
  }

  async removeFromFavorites(userId: string, itemId: string): Promise<void> {
    // Check if favorite exists
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: { itemId_userId: { itemId, userId } },
    });

    if (!existingFavorite) {
      throw new NotFoundException(`Item is not in your favorites`);
    }

    await this.prisma.favorite.delete({
      where: { itemId_userId: { itemId, userId } },
    });
  }

  async getUserFavorites(userId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        item: {
          select: { id: true, name: true, description: true },
        },
      },
    });

    return favorites.map((favorite) => this.mapToFavoriteResponse(favorite));
  }

  // ===== FEATURED ITEMS =====

  async getFeaturedItems(
    userId?: string,
    limit = 10
  ): Promise<ItemResponseDto[]> {
    const items = await this.prisma.item.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        prices: true,
        stock: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
        },
        ratings: true,
        favorites: userId
          ? {
              where: { userId },
            }
          : false,
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    return items.map((item) => this.mapToItemResponse(item));
  }

  async getBestSellingItems(
    userId?: string,
    limit = 10
  ): Promise<ItemResponseDto[]> {
    // Get items with high ratings and good reviews
    const items = await this.prisma.item.findMany({
      where: {
        isActive: true,
        ratings: {
          some: {
            rating: { gte: 4 }, // Items with 4+ star ratings
          },
        },
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        prices: true,
        stock: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
        },
        ratings: true,
        favorites: userId
          ? {
              where: { userId },
            }
          : false,
      },
      orderBy: [
        { ratings: { _count: 'desc' } }, // Most rated first
        { sortOrder: 'asc' }, // Then by sort order
      ],
      take: limit,
    });

    return items.map((item) => this.mapToItemResponse(item));
  }

  async getItemsByRating(
    userId?: string,
    minRating = 4,
    limit = 10
  ): Promise<ItemResponseDto[]> {
    const items = await this.prisma.item.findMany({
      where: {
        isActive: true,
        ratings: {
          some: {
            rating: { gte: minRating },
          },
        },
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        prices: true,
        stock: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
        },
        ratings: true,
        favorites: userId
          ? {
              where: { userId },
            }
          : false,
      },
      orderBy: [{ ratings: { _count: 'desc' } }, { sortOrder: 'asc' }],
      take: limit,
    });

    return items.map((item) => this.mapToItemResponse(item));
  }

  async getNewArrivalItems(
    userId?: string,
    limit = 8
  ): Promise<ItemResponseDto[]> {
    // Get recently created items
    const items = await this.prisma.item.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        prices: true,
        stock: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
        },
        ratings: true,
        favorites: userId
          ? {
              where: { userId },
            }
          : false,
      },
      orderBy: [
        { createdAt: 'desc' }, // Most recent first
        { sortOrder: 'asc' }, // Then by sort order
      ],
      take: limit,
    });

    return items.map((item) => this.mapToItemResponse(item));
  }

  // ===== HELPER METHODS =====

  private mapToItemResponse(item: any): ItemResponseDto {
    const currentPrice =
      Number(item.prices?.find((p: any) => p.isActive)?.price) || 0;
    const salePrice =
      Number(item.prices?.find((p: any) => p.isActive)?.salePrice) || 0;
    const averageRating =
      item.ratings?.length > 0
        ? item.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
          item.ratings.length
        : 0;
    const totalReviews = item.reviews?.length || 0;
    const isFavorite = item.favorites?.length > 0;

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      sku: item.sku,
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      sortOrder: item.sortOrder,
      categoryId: item.categoryId,
      subcategoryId: item.subcategoryId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      category: item.category,
      subcategory: item.subcategory,
      prices: item.prices?.map((p: any) => this.mapToPriceResponse(p)),
      stock: item.stock ? this.mapToStockResponse(item.stock) : undefined,
      images: item.images?.map((i: any) => this.mapToItemImageResponse(i)),
      reviews: item.reviews?.map((r: any) => this.mapToReviewResponse(r)),
      ratings: item.ratings?.map((r: any) => this.mapToRatingResponse(r)),
      favorites: item.favorites?.map((f: any) => this.mapToFavoriteResponse(f)),
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      isFavorite,
      currentPrice,
      salePrice,
      isOnSale:
        Boolean(salePrice) &&
        Number(salePrice) < Number(currentPrice) &&
        Number(salePrice) > 0,
    };
  }

  private mapToPriceResponse(price: any): PriceResponseDto {
    return {
      id: price.id,
      itemId: price.itemId,
      price: Number(price.price),
      salePrice: price.salePrice ? Number(price.salePrice) : undefined,
      currency: price.currency,
      isActive: price.isActive,
      validFrom: price.validFrom,
      validTo: price.validTo,
      createdAt: price.createdAt,
      updatedAt: price.updatedAt,
    };
  }

  private mapToStockResponse(stock: any): StockResponseDto {
    return {
      id: stock.id,
      itemId: stock.itemId,
      quantity: stock.quantity,
      reserved: stock.reserved,
      minThreshold: stock.minThreshold,
      maxThreshold: stock.maxThreshold,
      isInStock: stock.isInStock,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    };
  }

  private mapToItemImageResponse(image: any): ItemImageResponseDto {
    return {
      id: image.id,
      itemId: image.itemId,
      url: image.url,
      altText: image.altText,
      isPrimary: image.isPrimary,
      sortOrder: image.sortOrder,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }

  private mapToReviewResponse(review: any): ReviewResponseDto {
    return {
      id: review.id,
      itemId: review.itemId,
      userId: review.userId,
      title: review.title,
      content: review.content,
      rating: review.rating,
      isApproved: review.isApproved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user,
    };
  }

  private mapToRatingResponse(rating: any): RatingResponseDto {
    return {
      id: rating.id,
      itemId: rating.itemId,
      userId: rating.userId,
      rating: rating.rating,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
      user: rating.user,
    };
  }

  private mapToFavoriteResponse(favorite: any): FavoriteResponseDto {
    return {
      id: favorite.id,
      itemId: favorite.itemId,
      userId: favorite.userId,
      createdAt: favorite.createdAt,
      item: favorite.item,
    };
  }
}
