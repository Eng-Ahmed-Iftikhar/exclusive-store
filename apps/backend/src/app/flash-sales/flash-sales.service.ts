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
            product: {
              include: {
                images: {
                  orderBy: { sortOrder: 'asc' },
                },
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
            product: {
              include: {
                variants: {
                  include: {
                    images: {
                      include: { file: true },
                      orderBy: { sortOrder: 'asc' },
                    },
                    stock: true,
                    prices: true,
                  },
                },
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
        product: {
          include: {
            variants: {
              include: {
                images: {
                  include: { file: true },
                  orderBy: { sortOrder: 'asc' },
                },
                stock: true,
                prices: true,
              },
            },
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
        product: {
          include: {
            variants: {
              include: {
                images: {
                  include: { file: true },
                  orderBy: { sortOrder: 'asc' },
                },
                stock: true,
                prices: true,
              },
            },
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
            product: {
              include: {
                variants: {
                  include: {
                    images: {
                      include: { file: true },
                      orderBy: { sortOrder: 'asc' },
                    },
                    stock: true,
                    prices: true,
                  },
                },
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

    // Return simplified product data for flash sales
    return (
      flashSale.items?.map((flashSaleItem: any) => {
        const product = flashSaleItem.product;
        const defaultVariant = product.variants?.[0]; // Use first variant

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          sortOrder: product.sortOrder,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          category: product.category,
          subcategory: product.subcategory,
          prices: defaultVariant?.prices || [],
          stock: defaultVariant?.stock,
          images: defaultVariant?.images || [],
          reviews: product.reviews || [],
          ratings: product.ratings || [],
          favorites: product.favorites || [],
          averageRating:
            product.ratings?.length > 0
              ? Math.round(
                  (product.ratings.reduce(
                    (sum: number, r: any) => sum + r.rating,
                    0
                  ) /
                    product.ratings.length) *
                    10
                ) / 10
              : 0,
          totalReviews: product.reviews?.length || 0,
          isFavorite: product.favorites?.length > 0,
          currentPrice: Number(flashSaleItem.originalPrice),
          salePrice: Number(flashSaleItem.salePrice),
          isOnSale: true,
          flashSaleId: flashSale.id,
          flashSaleDiscount: flashSale.discount,
          timeRemaining: this.calculateTimeRemaining(flashSale.endDate),
        };
      }) || []
    );
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
    const product = flashSaleItem.product;
    const defaultVariant = product.variants?.[0];

    return {
      id: flashSaleItem.id,
      itemId: flashSaleItem.productId,
      salePrice: Number(flashSaleItem.salePrice),
      currentPrice: Number(flashSaleItem.originalPrice),
      isActive: flashSaleItem.isActive,
      createdAt: flashSaleItem.createdAt,
      updatedAt: flashSaleItem.updatedAt,

      name: product.name,
      description: product.description,
      images:
        defaultVariant?.images?.map((img: any) => ({
          url: img.file?.url || img.file?.secureUrl,
          altText: img.altText,
          isPrimary: img.isPrimary,
        })) || [],
      stock: defaultVariant?.stock
        ? {
            quantity: defaultVariant.stock.quantity,
            isInStock: defaultVariant.stock.isInStock,
          }
        : undefined,
      reviews:
        product.reviews?.map((review: any) => ({
          rating: review.rating,
        })) || [],
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
      items: flashSale.items?.map((flashSaleItem: any) => {
        const product = flashSaleItem.product;
        const defaultVariant = product.variants?.[0];

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          sortOrder: product.sortOrder,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          category: product.category,
          subcategory: product.subcategory,
          prices: defaultVariant?.prices || [],
          stock: defaultVariant?.stock,
          images: defaultVariant?.images || [],
          reviews: product.reviews || [],
          ratings: product.ratings || [],
          favorites: product.favorites || [],
          averageRating:
            product.ratings?.length > 0
              ? Math.round(
                  (product.ratings.reduce(
                    (sum: number, r: any) => sum + r.rating,
                    0
                  ) /
                    product.ratings.length) *
                    10
                ) / 10
              : 0,
          totalReviews: product.reviews?.length || 0,
          isFavorite: product.favorites?.length > 0,
          currentPrice: Number(flashSaleItem.originalPrice),
          salePrice: Number(flashSaleItem.salePrice),
          isOnSale: true,
          flashSaleId: flashSale.id,
          flashSaleDiscount: flashSale.discount,
          timeRemaining: this.calculateTimeRemaining(flashSale.endDate),
        };
      }),
    };
  }
}
