import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from './dto/product.dto';
import {
  CreateVariantDto,
  UpdateVariantDto,
  VariantResponseDto,
  CreateProductImageDto,
  UpdateProductImageDto,
  ProductImageResponseDto,
  CreatePriceDto,
  UpdatePriceDto,
  PriceResponseDto,
  CreateStockDto,
  UpdateStockDto,
  StockResponseDto,
} from './dto/variant.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService
  ) {}

  // ==================== PRODUCT OPERATIONS ====================

  async createProduct(
    createProductDto: CreateProductDto,
    userId?: string
  ): Promise<ProductResponseDto> {
    // Check if SKU already exists
    if (createProductDto.sku) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku: createProductDto.sku },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with SKU '${createProductDto.sku}' already exists`
        );
      }
    }

    const product = await this.prisma.product.create({
      data: createProductDto,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        variants: {
          include: {
            prices: true,
            stock: true,
            images: {
              include: {
                file: {
                  select: {
                    id: true,
                    url: true,
                    secureUrl: true,
                    originalName: true,
                    format: true,
                    width: true,
                    height: true,
                  },
                },
              },
            },
          },
        },
        reviews: true,
        ratings: true,
      },
    });

    // Log product creation activity
    if (userId) {
      await this.activityService.logProductActivity(
        product.id,
        'created',
        userId
      );
    }

    return this.mapToProductResponse(product);
  }

  async getAllProducts(
    page = 1,
    limit = 20,
    search = ''
  ): Promise<{
    products: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          subcategory: {
            select: { id: true, name: true, slug: true },
          },
          variants: {
            include: {
              prices: { where: { isActive: true } },
              stock: true,
              images: {
                include: {
                  file: {
                    select: {
                      id: true,
                      url: true,
                      secureUrl: true,
                      originalName: true,
                      format: true,
                      width: true,
                      height: true,
                    },
                  },
                },
              },
            },
          },
          reviews: { where: { isApproved: true } },
          ratings: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => this.mapToProductResponse(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        variants: {
          include: {
            prices: true,
            stock: true,
            images: {
              include: {
                file: {
                  select: {
                    id: true,
                    url: true,
                    secureUrl: true,
                    originalName: true,
                    format: true,
                    width: true,
                    height: true,
                  },
                },
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        reviews: { where: { isApproved: true } },
        ratings: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.mapToProductResponse(product);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    // Check if product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check SKU conflict
    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const skuConflict = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (skuConflict) {
        throw new ConflictException(
          `Product with SKU '${updateProductDto.sku}' already exists`
        );
      }
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
        variants: {
          include: {
            prices: true,
            stock: true,
            images: {
              include: {
                file: {
                  select: {
                    id: true,
                    url: true,
                    secureUrl: true,
                    originalName: true,
                    format: true,
                    width: true,
                    height: true,
                  },
                },
              },
            },
          },
        },
        reviews: { where: { isApproved: true } },
        ratings: true,
      },
    });

    return this.mapToProductResponse(product);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({
      where: { id },
    });
  }

  // ==================== VARIANT OPERATIONS ====================

  async createVariant(
    createVariantDto: CreateVariantDto,
    userId?: string
  ): Promise<VariantResponseDto> {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: createVariantDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createVariantDto.productId} not found`
      );
    }

    // Check if SKU already exists
    const existingVariant = await this.prisma.productVariant.findUnique({
      where: { sku: createVariantDto.sku },
    });

    if (existingVariant) {
      throw new ConflictException(
        `Variant with SKU '${createVariantDto.sku}' already exists`
      );
    }

    // If this is marked as default, unset other defaults for this product
    if (createVariantDto.isDefault) {
      await this.prisma.productVariant.updateMany({
        where: { productId: createVariantDto.productId },
        data: { isDefault: false },
      });
    }

    const variant = await this.prisma.productVariant.create({
      data: createVariantDto,
      include: {
        prices: true,
        stock: true,
        images: {
          include: {
            file: {
              select: {
                id: true,
                url: true,
                secureUrl: true,
                originalName: true,
                format: true,
                width: true,
                height: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (userId) {
      await this.activityService.createActivity({
        type: 'product',
        title: 'Variant Created',
        description: `Created variant "${variant.name}" for product`,
        metadata: { variantId: variant.id, productId: variant.productId },
        userId,
      });
    }

    return this.mapToVariantResponse(variant);
  }

  async getVariantsByProduct(productId: string): Promise<VariantResponseDto[]> {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      include: {
        prices: { where: { isActive: true } },
        stock: true,
        images: {
          include: {
            file: {
              select: {
                id: true,
                url: true,
                secureUrl: true,
                originalName: true,
                format: true,
                width: true,
                height: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [{ isDefault: 'desc' }, { sortOrder: 'asc' }],
    });

    return variants.map((v) => this.mapToVariantResponse(v));
  }

  async getVariantById(id: string): Promise<VariantResponseDto> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        prices: true,
        stock: true,
        images: {
          include: {
            file: {
              select: {
                id: true,
                url: true,
                secureUrl: true,
                originalName: true,
                format: true,
                width: true,
                height: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return this.mapToVariantResponse(variant);
  }

  async updateVariant(
    id: string,
    updateVariantDto: UpdateVariantDto
  ): Promise<VariantResponseDto> {
    const existingVariant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!existingVariant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    // Check SKU conflict
    if (updateVariantDto.sku && updateVariantDto.sku !== existingVariant.sku) {
      const skuConflict = await this.prisma.productVariant.findUnique({
        where: { sku: updateVariantDto.sku },
      });

      if (skuConflict) {
        throw new ConflictException(
          `Variant with SKU '${updateVariantDto.sku}' already exists`
        );
      }
    }

    // If setting as default, unset other defaults
    if (updateVariantDto.isDefault) {
      await this.prisma.productVariant.updateMany({
        where: {
          productId: existingVariant.productId,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const variant = await this.prisma.productVariant.update({
      where: { id },
      data: updateVariantDto,
      include: {
        prices: true,
        stock: true,
        images: {
          include: {
            file: {
              select: {
                id: true,
                url: true,
                secureUrl: true,
                originalName: true,
                format: true,
                width: true,
                height: true,
              },
            },
          },
        },
      },
    });

    return this.mapToVariantResponse(variant);
  }

  async deleteVariant(id: string): Promise<void> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    await this.prisma.productVariant.delete({
      where: { id },
    });
  }

  // ==================== PRICE OPERATIONS ====================

  async createPrice(createPriceDto: CreatePriceDto): Promise<PriceResponseDto> {
    // Verify variant exists
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: createPriceDto.variantId },
    });

    if (!variant) {
      throw new NotFoundException(
        `Variant with ID ${createPriceDto.variantId} not found`
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
    const existingPrice = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!existingPrice) {
      throw new NotFoundException(`Price with ID ${id} not found`);
    }

    const price = await this.prisma.price.update({
      where: { id },
      data: updatePriceDto,
    });

    return this.mapToPriceResponse(price);
  }

  async deletePrice(id: string): Promise<void> {
    const price = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException(`Price with ID ${id} not found`);
    }

    await this.prisma.price.delete({
      where: { id },
    });
  }

  async getPricesByVariant(variantId: string): Promise<PriceResponseDto[]> {
    const prices = await this.prisma.price.findMany({
      where: { variantId },
      orderBy: { createdAt: 'desc' },
    });

    return prices.map((p) => this.mapToPriceResponse(p));
  }

  // ==================== STOCK OPERATIONS ====================

  async createStock(createStockDto: CreateStockDto): Promise<StockResponseDto> {
    // Verify variant exists
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: createStockDto.variantId },
    });

    if (!variant) {
      throw new NotFoundException(
        `Variant with ID ${createStockDto.variantId} not found`
      );
    }

    // Check if stock already exists for this variant
    const existingStock = await this.prisma.stock.findUnique({
      where: { variantId: createStockDto.variantId },
    });

    if (existingStock) {
      throw new ConflictException(
        `Stock record already exists for variant ${createStockDto.variantId}`
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
    const existingStock = await this.prisma.stock.findUnique({
      where: { id },
    });

    if (!existingStock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    const stock = await this.prisma.stock.update({
      where: { id },
      data: updateStockDto,
    });

    return this.mapToStockResponse(stock);
  }

  async getStockByVariant(variantId: string): Promise<StockResponseDto | null> {
    const stock = await this.prisma.stock.findUnique({
      where: { variantId },
    });

    return stock ? this.mapToStockResponse(stock) : null;
  }

  // ==================== PRODUCT IMAGE OPERATIONS ====================

  async createProductImage(
    createImageDto: CreateProductImageDto
  ): Promise<ProductImageResponseDto> {
    // Must specify either productId or variantId
    if (!createImageDto.productId && !createImageDto.variantId) {
      throw new BadRequestException(
        'Either productId or variantId must be specified'
      );
    }

    // Verify product or variant exists
    if (createImageDto.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: createImageDto.productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${createImageDto.productId} not found`
        );
      }
    }

    if (createImageDto.variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: createImageDto.variantId },
      });
      if (!variant) {
        throw new NotFoundException(
          `Variant with ID ${createImageDto.variantId} not found`
        );
      }
    }

    // Verify file exists
    const file = await this.prisma.file.findUnique({
      where: { id: createImageDto.fileId },
    });

    if (!file) {
      throw new NotFoundException(
        `File with ID ${createImageDto.fileId} not found`
      );
    }

    // If this is marked as primary, unset other primaries
    if (createImageDto.isPrimary) {
      const where: any = {};
      if (createImageDto.productId) {
        where.productId = createImageDto.productId;
      }
      if (createImageDto.variantId) {
        where.variantId = createImageDto.variantId;
      }
      await this.prisma.productImage.updateMany({
        where,
        data: { isPrimary: false },
      });
    }

    const image = await this.prisma.productImage.create({
      data: createImageDto,
      include: {
        file: {
          select: {
            id: true,
            url: true,
            secureUrl: true,
            originalName: true,
            format: true,
            width: true,
            height: true,
          },
        },
      },
    });

    return this.mapToProductImageResponse(image);
  }

  async updateProductImage(
    id: string,
    updateImageDto: UpdateProductImageDto
  ): Promise<ProductImageResponseDto> {
    const existingImage = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      throw new NotFoundException(`Product image with ID ${id} not found`);
    }

    // If setting as primary, unset other primaries
    if (updateImageDto.isPrimary) {
      const where: any = {};
      if (existingImage.productId) {
        where.productId = existingImage.productId;
      }
      if (existingImage.variantId) {
        where.variantId = existingImage.variantId;
      }
      where.id = { not: id };

      await this.prisma.productImage.updateMany({
        where,
        data: { isPrimary: false },
      });
    }

    const image = await this.prisma.productImage.update({
      where: { id },
      data: updateImageDto,
      include: {
        file: {
          select: {
            id: true,
            url: true,
            secureUrl: true,
            originalName: true,
            format: true,
            width: true,
            height: true,
          },
        },
      },
    });

    return this.mapToProductImageResponse(image);
  }

  async deleteProductImage(id: string): Promise<void> {
    const image = await this.prisma.productImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Product image with ID ${id} not found`);
    }

    await this.prisma.productImage.delete({
      where: { id },
    });
  }

  async getImagesByProduct(
    productId: string
  ): Promise<ProductImageResponseDto[]> {
    const images = await this.prisma.productImage.findMany({
      where: { productId },
      include: {
        file: {
          select: {
            id: true,
            url: true,
            secureUrl: true,
            originalName: true,
            format: true,
            width: true,
            height: true,
          },
        },
      },
      orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    });

    return images.map((img) => this.mapToProductImageResponse(img));
  }

  async getImagesByVariant(
    variantId: string
  ): Promise<ProductImageResponseDto[]> {
    const images = await this.prisma.productImage.findMany({
      where: { variantId },
      include: {
        file: {
          select: {
            id: true,
            url: true,
            secureUrl: true,
            originalName: true,
            format: true,
            width: true,
            height: true,
          },
        },
      },
      orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    });

    return images.map((img) => this.mapToProductImageResponse(img));
  }

  // ==================== MAPPING METHODS ====================

  private mapToProductResponse(product: any): ProductResponseDto {
    const averageRating =
      product.ratings && product.ratings.length > 0
        ? product.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
          product.ratings.length
        : 0;

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
      variants: product.variants?.map((v: any) => this.mapToVariantResponse(v)),
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: product.reviews?.length || 0,
      totalVariants: product.variants?.length || 0,
    };
  }

  private mapToVariantResponse(variant: any): VariantResponseDto {
    const activePrice = variant.prices?.find((p: any) => p.isActive);
    const currentPrice = activePrice ? Number(activePrice.price) : 0;
    const salePrice = activePrice?.salePrice
      ? Number(activePrice.salePrice)
      : undefined;

    return {
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      name: variant.name,
      attributes: variant.attributes,
      isDefault: variant.isDefault,
      isActive: variant.isActive,
      sortOrder: variant.sortOrder,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
      prices: variant.prices?.map((p: any) => this.mapToPriceResponse(p)),
      stock: variant.stock ? this.mapToStockResponse(variant.stock) : undefined,
      images: variant.images?.map((img: any) =>
        this.mapToProductImageResponse(img)
      ),
      currentPrice,
      salePrice,
      isOnSale: salePrice ? salePrice < currentPrice : false,
    };
  }

  private mapToPriceResponse(price: any): PriceResponseDto {
    return {
      id: price.id,
      variantId: price.variantId,
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
      variantId: stock.variantId,
      quantity: stock.quantity,
      reserved: stock.reserved,
      minThreshold: stock.minThreshold,
      maxThreshold: stock.maxThreshold,
      isInStock: stock.isInStock,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    };
  }

  private mapToProductImageResponse(image: any): ProductImageResponseDto {
    return {
      id: image.id,
      productId: image.productId,
      variantId: image.variantId,
      fileId: image.fileId,
      altText: image.altText,
      isPrimary: image.isPrimary,
      sortOrder: image.sortOrder,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
      file: image.file,
    };
  }
}
