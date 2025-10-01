import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string, type?: string) {
    const searchQuery = {
      contains: query,
      mode: 'insensitive' as const,
    };

    let categories: any[] = [];
    let products: any[] = [];

    // Search categories if type is not specified or is 'category'
    if (!type || type === 'category') {
      categories = await this.prisma.category.findMany({
        where: {
          OR: [
            { name: searchQuery },
            { description: searchQuery },
            { slug: searchQuery },
          ],
        },
        include: {
          subcategories: {
            select: {
              id: true,
              name: true,
              slug: true,
              iconFileId: true,
            },
          },
        },
        take: 5,
      });
    }

    // Search products if type is not specified or is 'product'
    if (!type || type === 'product') {
      const rawProducts = await this.prisma.product.findMany({
        where: {
          OR: [
            { name: searchQuery },
            { description: searchQuery },
            {
              category: {
                name: searchQuery,
              },
            },
            {
              subcategory: {
                name: searchQuery,
              },
            },
          ],
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              iconFileId: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            take: 1,
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
                include: {
                  file: {
                    select: {
                      id: true,
                      url: true,
                      secureUrl: true,
                    },
                  },
                },
              },
              prices: {
                where: { isActive: true },
                take: 1,
                select: {
                  price: true,
                  salePrice: true,
                },
              },
              stock: {
                select: {
                  quantity: true,
                  isInStock: true,
                },
              },
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        take: 10,
      });

      // Calculate average rating and format products
      products = rawProducts.map((product) => {
        const avgRating =
          product.reviews.length > 0
            ? product.reviews.reduce(
                (sum: number, review: any) => sum + review.rating,
                0
              ) / product.reviews.length
            : 0;

        const defaultVariant = product.variants?.[0];

        return {
          ...product,
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: product.reviews.length,
          currentPrice: defaultVariant?.prices?.[0]?.price
            ? Number(defaultVariant.prices[0].price)
            : 0,
          salePrice: defaultVariant?.prices?.[0]?.salePrice
            ? Number(defaultVariant.prices[0].salePrice)
            : null,
          isOnSale:
            defaultVariant?.prices?.[0]?.salePrice &&
            Number(defaultVariant.prices[0].salePrice) <
              Number(defaultVariant.prices[0].price),
          primaryImage: defaultVariant?.images?.[0]?.file?.url || null,
        };
      });
    }

    return {
      categories,
      products,
      total: categories.length + products.length,
    };
  }

  async getSuggestions(query: string) {
    const searchQuery = {
      contains: query,
      mode: 'insensitive' as const,
    };

    const [categories, products] = await Promise.all([
      this.prisma.category.findMany({
        where: {
          OR: [{ name: searchQuery }, { slug: searchQuery }],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          iconFileId: true,
        },
        take: 3,
      }),
      this.prisma.product.findMany({
        where: {
          OR: [{ name: searchQuery }],
        },
        select: {
          id: true,
          name: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        take: 3,
      }),
    ]);

    return [
      ...categories.map((cat: any) => ({
        type: 'category' as const,
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        iconFileId: cat.iconFileId,
      })),
      ...products.map((prod) => ({
        type: 'product' as const,
        id: prod.id,
        name: prod.name,
        category: prod.category?.name || 'Unknown',
        categorySlug: prod.category?.slug || '',
      })),
    ];
  }
}
