import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFlashSaleDto,
  UpdateFlashSaleDto,
  CreateFlashSaleItemDto,
  UpdateFlashSaleItemDto,
  FlashSaleResponseDto,
  FlashSaleItemResponseDto,
  FlashSaleItemDto,
} from './dto/flash-sale.dto';

@Injectable()
export class FlashSalesService {
  constructor(private readonly prisma: PrismaService) {}

  calculateOriginalPrice(salePrice: number, flashSaleDiscount: number): number {
    return Number((salePrice / (1 - flashSaleDiscount / 100)).toFixed(2));
  }
  async createFlashSale(
    createFlashSaleDto: CreateFlashSaleDto
  ): Promise<FlashSaleResponseDto> {
    const { items, ...flashSaleData } = createFlashSaleDto;

    const flashSale = await this.prisma.flashSale.create({
      data: {
        ...flashSaleData,
        startDate: new Date(flashSaleData.startDate),
        endDate: new Date(flashSaleData.endDate),
      },
    });

    // Create flash sale items if provided
    if (items && items.length > 0) {
      await Promise.all(
        items.map((item) =>
          this.prisma.flashSaleItem.create({
            data: {
              ...item,
              flashSaleId: flashSale.id,
            },
          })
        )
      );
    }

    return this.mapToFlashSaleResponse(flashSale);
  }

  async getActiveFlashSales(): Promise<FlashSaleResponseDto[]> {
    const now = new Date();

    const flashSales = await this.prisma.flashSale.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        items: {
          where: { isActive: true },
          include: {
            item: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                },
                stock: true,
                reviews: {
                  where: { isApproved: true },
                },
                ratings: true,
                favorites: true,
                category: {
                  select: { id: true, name: true, slug: true },
                },
                subcategory: {
                  select: { id: true, name: true, slug: true },
                },
              },
            },
          },
        },
      },
      orderBy: { endDate: 'asc' },
    });

    return flashSales.map((flashSale) =>
      this.mapToFlashSaleResponse(flashSale)
    );
  }

  async getFlashSaleById(id: string): Promise<FlashSaleResponseDto> {
    const flashSale = await this.prisma.flashSale.findUnique({
      where: { id },
      include: {
        items: {
          where: { isActive: true },
          include: {
            item: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                },
                stock: true,
                reviews: {
                  where: { isApproved: true },
                },
              },
            },
          },
        },
      },
    });

    if (!flashSale) {
      throw new NotFoundException(`Flash sale with ID ${id} not found`);
    }

    return this.mapToFlashSaleResponse(flashSale);
  }

  async updateFlashSale(
    id: string,
    updateFlashSaleDto: UpdateFlashSaleDto
  ): Promise<FlashSaleResponseDto> {
    const flashSale = await this.prisma.flashSale.update({
      where: { id },
      data: {
        ...updateFlashSaleDto,
        ...(updateFlashSaleDto.startDate && {
          startDate: new Date(updateFlashSaleDto.startDate),
        }),
        ...(updateFlashSaleDto.endDate && {
          endDate: new Date(updateFlashSaleDto.endDate),
        }),
      },
    });

    return this.mapToFlashSaleResponse(flashSale);
  }

  async deleteFlashSale(id: string): Promise<void> {
    await this.prisma.flashSale.delete({
      where: { id },
    });
  }

  async addItemToFlashSale(
    flashSaleId: string,
    createFlashSaleItemDto: CreateFlashSaleItemDto
  ): Promise<FlashSaleItemResponseDto> {
    const flashSaleItem = await this.prisma.flashSaleItem.create({
      data: {
        ...createFlashSaleItemDto,
        flashSaleId,
      },
      include: {
        item: {
          include: {
            images: {
              orderBy: { sortOrder: 'asc' },
            },
            stock: true,
            reviews: {
              where: { isApproved: true },
            },
          },
        },
      },
    });

    return this.mapToFlashSaleItemResponse(flashSaleItem);
  }

  async updateFlashSaleItem(
    id: string,
    updateFlashSaleItemDto: UpdateFlashSaleItemDto
  ): Promise<FlashSaleItemResponseDto> {
    const flashSaleItem = await this.prisma.flashSaleItem.update({
      where: { id },
      data: updateFlashSaleItemDto,
      include: {
        item: {
          include: {
            images: {
              orderBy: { sortOrder: 'asc' },
            },
            stock: true,
            reviews: {
              where: { isApproved: true },
            },
          },
        },
      },
    });

    return this.mapToFlashSaleItemResponse(flashSaleItem);
  }

  async removeItemFromFlashSale(id: string): Promise<void> {
    await this.prisma.flashSaleItem.delete({
      where: { id },
    });
  }

  async getFlashSaleItems(flashSaleId: string): Promise<FlashSaleItemDto[]> {
    const flashSale = await this.prisma.flashSale.findUnique({
      where: { id: flashSaleId },
      include: {
        items: {
          where: { isActive: true },
          include: {
            item: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                },
                stock: true,
                reviews: {
                  where: { isApproved: true },
                },
                ratings: true,
                favorites: true,
                category: {
                  select: { id: true, name: true, slug: true },
                },
                subcategory: {
                  select: { id: true, name: true, slug: true },
                },
              },
            },
          },
        },
      },
    });

    if (!flashSale) {
      throw new NotFoundException('Flash sale not found');
    }

    return flashSale.items?.map((item: any) => ({
      id: item.item.id,
      name: item.item.name,
      description: item.item.description,
      sku: item.item.sku,
      isActive: item.item.isActive,
      isFeatured: item.item.isFeatured,
      sortOrder: item.item.sortOrder,
      categoryId: item.item.categoryId,
      subcategoryId: item.item.subcategoryId,
      createdAt: item.item.createdAt,
      updatedAt: item.item.updatedAt,
      category: item.item.category,
      subcategory: item.item.subcategory,
      prices: [{
        id: 'flash-sale-price',
        itemId: item.item.id,
        price: Number(item.currentPrice),
        salePrice: Number(item.salePrice),
        currency: 'USD',
        isActive: true,
        validFrom: flashSale.startDate,
        validTo: flashSale.endDate,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }],
      stock: item.item.stock ? {
        id: item.item.stock.id,
        itemId: item.item.stock.itemId,
        quantity: item.item.stock.quantity,
        reserved: item.item.stock.reserved,
        minThreshold: item.item.stock.minThreshold,
        maxThreshold: item.item.stock.maxThreshold,
        isInStock: item.item.stock.isInStock,
        createdAt: item.item.stock.createdAt,
        updatedAt: item.item.stock.updatedAt,
      } : undefined,
      images: item.item.images?.map((img: any) => ({
        id: img.id,
        itemId: img.itemId,
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt,
      })),
      reviews: item.item.reviews?.map((review: any) => ({
        id: review.id,
        itemId: review.itemId,
        userId: review.userId,
        title: review.title,
        content: review.content,
        rating: review.rating,
        isApproved: review.isApproved,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })),
      ratings: item.item.ratings?.map((rating: any) => ({
        id: rating.id,
        itemId: rating.itemId,
        userId: rating.userId,
        rating: rating.rating,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
      })),
      favorites: item.item.favorites?.map((favorite: any) => ({
        id: favorite.id,
        itemId: favorite.itemId,
        userId: favorite.userId,
        createdAt: favorite.createdAt,
        updatedAt: favorite.updatedAt,
      })),
      averageRating: item.item.ratings?.length > 0 
        ? Math.round((item.item.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / item.item.ratings.length) * 10) / 10
        : 0,
      totalReviews: item.item.reviews?.length || 0,
      isFavorite: item.item.favorites?.length > 0,
      currentPrice: Number(item.currentPrice),
      salePrice: Number(item.salePrice),
      isOnSale: true, // Flash sale items are always on sale
      flashSaleId: flashSale.id,
      flashSaleDiscount: flashSale.discount,
      timeRemaining: this.calculateTimeRemaining(flashSale.endDate),
    })) || [];
  }

  private calculateTimeRemaining(endDate: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  private mapToFlashSaleItemResponse(
    flashSaleItem: any
  ): FlashSaleItemResponseDto {
    return {
      id: flashSaleItem.id,
      itemId: flashSaleItem.itemId,
      salePrice: Number(flashSaleItem.salePrice),
      currentPrice: Number(flashSaleItem.currentPrice),
      isActive: flashSaleItem.isActive,
      createdAt: flashSaleItem.createdAt,
      updatedAt: flashSaleItem.updatedAt,

      name: flashSaleItem.item.name,
      description: flashSaleItem.item.description,
      images: flashSaleItem.item.images.map((img: any) => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
      })),
      stock: flashSaleItem.item.stock
        ? {
            quantity: flashSaleItem.item.stock.quantity,
            isInStock: flashSaleItem.item.stock.isInStock,
          }
        : undefined,
      reviews: flashSaleItem.item.reviews.map((review: any) => ({
        rating: review.rating,
      })),
    };
  }

  private mapToFlashSaleResponse(flashSale: any): FlashSaleResponseDto {
    return {
      id: flashSale.id,
      name: flashSale.name,
      description: flashSale.description,
      startDate: flashSale.startDate,
      endDate: flashSale.endDate,
      isActive: flashSale.isActive,
      discount: flashSale.discount,
      createdAt: flashSale.createdAt,
      updatedAt: flashSale.updatedAt,
      items: flashSale.items?.map((item: any) => ({
        id: item.item.id,
        name: item.item.name,
        description: item.item.description,
        sku: item.item.sku,
        isActive: item.item.isActive,
        isFeatured: item.item.isFeatured,
        sortOrder: item.item.sortOrder,
        categoryId: item.item.categoryId,
        subcategoryId: item.item.subcategoryId,
        createdAt: item.item.createdAt,
        updatedAt: item.item.updatedAt,
        category: item.item.category,
        subcategory: item.item.subcategory,
        prices: [{
          id: 'flash-sale-price',
          itemId: item.item.id,
          price: Number(item.currentPrice),
          salePrice: Number(item.salePrice),
          currency: 'USD',
          isActive: true,
          validFrom: flashSale.startDate,
          validTo: flashSale.endDate,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }],
        stock: item.item.stock ? {
          id: item.item.stock.id,
          itemId: item.item.stock.itemId,
          quantity: item.item.stock.quantity,
          reserved: item.item.stock.reserved,
          minThreshold: item.item.stock.minThreshold,
          maxThreshold: item.item.stock.maxThreshold,
          isInStock: item.item.stock.isInStock,
          createdAt: item.item.stock.createdAt,
          updatedAt: item.item.stock.updatedAt,
        } : undefined,
        images: item.item.images?.map((img: any) => ({
          id: img.id,
          itemId: img.itemId,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
        })),
        reviews: item.item.reviews?.map((review: any) => ({
          id: review.id,
          itemId: review.itemId,
          userId: review.userId,
          title: review.title,
          content: review.content,
          rating: review.rating,
          isApproved: review.isApproved,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        })),
        ratings: item.item.ratings?.map((rating: any) => ({
          id: rating.id,
          itemId: rating.itemId,
          userId: rating.userId,
          rating: rating.rating,
          createdAt: rating.createdAt,
          updatedAt: rating.updatedAt,
        })),
        favorites: item.item.favorites?.map((favorite: any) => ({
          id: favorite.id,
          itemId: favorite.itemId,
          userId: favorite.userId,
          createdAt: favorite.createdAt,
          updatedAt: favorite.updatedAt,
        })),
        averageRating: item.item.ratings?.length > 0 
          ? Math.round((item.item.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / item.item.ratings.length) * 10) / 10
          : 0,
        totalReviews: item.item.reviews?.length || 0,
        isFavorite: item.item.favorites?.length > 0,
        currentPrice: Number(item.currentPrice ) || this.calculateOriginalPrice(Number(item.salePrice), flashSale.discount),
        salePrice: Number(item.salePrice) || item.item.prices.find((price: any) => price.active)?.salePrice,
        isOnSale: true, // Flash sale items are always on sale
        flashSaleId: flashSale.id,
        flashSaleDiscount: flashSale.discount,
        timeRemaining: this.calculateTimeRemaining(flashSale.endDate),
      })),
    };

  }
}
