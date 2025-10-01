import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
            subcategory: {
              select: { id: true, name: true, slug: true },
            },
            variants: {
              include: {
                prices: {
                  where: { isActive: true },
                  orderBy: { price: 'asc' },
                  take: 1,
                },
                stock: true,
                images: {
                  include: { file: true },
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
            reviews: {
              where: { isApproved: true },
            },
            ratings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((fav) => ({
      id: fav.id,
      product: fav.product,
      createdAt: fav.createdAt,
    }));
  }

  async addToFavorites(userId: string, productId: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already favorited
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Product is already in favorites');
    }

    // Add to favorites
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
            subcategory: {
              select: { id: true, name: true, slug: true },
            },
            variants: {
              include: {
                prices: {
                  where: { isActive: true },
                  orderBy: { price: 'asc' },
                  take: 1,
                },
                stock: true,
                images: {
                  include: { file: true },
                  orderBy: { sortOrder: 'asc' },
                  take: 1,
                },
              },
            },
            reviews: {
              where: { isApproved: true },
            },
            ratings: true,
          },
        },
      },
    });

    return {
      id: favorite.id,
      product: favorite.product,
      createdAt: favorite.createdAt,
    };
  }

  async removeFromFavorites(userId: string, productId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    return { message: 'Removed from favorites' };
  }

  async checkFavoriteStatus(userId: string, productId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    return { isFavorited: !!favorite };
  }
}
