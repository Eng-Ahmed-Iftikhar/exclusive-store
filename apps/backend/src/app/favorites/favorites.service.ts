import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        item: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
            subcategory: {
              select: { id: true, name: true, slug: true },
            },
            prices: {
              where: { isActive: true },
              orderBy: { price: 'asc' },
              take: 1,
            },
            stock: true,
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
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

    return favorites.map(fav => ({
      id: fav.id,
      item: fav.item,
      createdAt: fav.createdAt,
    }));
  }

  async addToFavorites(userId: string, itemId: string) {
    // Check if item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Check if already favorited
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Item is already in favorites');
    }

    // Add to favorites
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        itemId,
      },
      include: {
        item: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
            subcategory: {
              select: { id: true, name: true, slug: true },
            },
            prices: {
              where: { isActive: true },
              orderBy: { price: 'asc' },
              take: 1,
            },
            stock: true,
            images: {
              orderBy: { sortOrder: 'asc' },
              take: 1,
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
      item: favorite.item,
      createdAt: favorite.createdAt,
    };
  }

  async removeFromFavorites(userId: string, itemId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        itemId_userId: {
          itemId,
          userId,
        },
      },
    });

    return { message: 'Removed from favorites' };
  }

  async checkFavoriteStatus(userId: string, itemId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId,
        },
      },
    });

    return { isFavorited: !!favorite };
  }
}
