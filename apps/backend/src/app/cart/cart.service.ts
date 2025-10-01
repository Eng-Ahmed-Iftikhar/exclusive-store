import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '../config/config.service';
import {
  AddToCartDto,
  CartDto,
  CartResponseDto,
  UpdateCartItemDto,
} from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async getUserCart(userId: string): Promise<CartDto> {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                images: {
                  include: { file: true },
                },
                product: {
                  include: {
                    category: true,
                    subcategory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // Create new cart for user
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  images: {
                    include: { file: true },
                  },
                  product: {
                    include: {
                      category: true,
                      subcategory: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return this.formatCart(cart);
  }

  async getCartById(cartId: string): Promise<CartDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            variant: {
              include: {
                images: {
                  include: { file: true },
                },
                product: {
                  include: {
                    category: true,
                    subcategory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.formatCart(cart);
  }

  async createCart(): Promise<CartDto> {
    const cart = await this.prisma.cart.create({
      data: {},
      include: {
        items: {
          include: {
            variant: {
              include: {
                images: {
                  include: { file: true },
                },
                product: {
                  include: {
                    category: true,
                    subcategory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.formatCart(cart);
  }

  async addToCart(
    cartId: string,
    addToCartDto: AddToCartDto,
    userId?: string
  ): Promise<CartResponseDto> {
    // Check if variant exists
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: addToCartDto.variantId },
      include: { prices: true },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    // Get the active price and determine the correct price to use
    const activePrice = variant.prices.find((price: any) => price.isActive);
    let variantPrice = 0;

    if (activePrice) {
      // Check if there's a sale price available
      if (
        activePrice.salePrice &&
        Number(activePrice.salePrice) > 0 &&
        Number(activePrice.salePrice) < Number(activePrice.price)
      ) {
        // Use sale price if it's less than original price
        variantPrice = Number(activePrice.salePrice);
      } else {
        // Use original price if no sale or sale price is invalid
        variantPrice = Number(activePrice.price);
      }
    }

    // Check if variant is already in cart
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        variantId: addToCartDto.variantId,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + addToCartDto.quantity;
      if (newQuantity > 10) {
        throw new BadRequestException('Maximum quantity per item is 10');
      }

      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Add new variant to cart
      await this.prisma.cartItem.create({
        data: {
          cartId,
          variantId: addToCartDto.variantId,
          quantity: addToCartDto.quantity,
          price: variantPrice,
        },
      });
    }

    // Get updated cart
    const updatedCart = await this.getCartById(cartId);

    return {
      cart: updatedCart,
      message: existingCartItem
        ? 'Cart item quantity updated'
        : 'Item added to cart',
    };
  }

  async updateCartItem(
    cartId: string,
    cartItemId: string,
    updateDto: UpdateCartItemDto,
    userId?: string
  ): Promise<CartResponseDto> {
    // Verify cart access
    await this.verifyCartAccess(cartId, userId);

    // Check if cart item exists
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId,
      },
      include: {
        variant: {
          include: { prices: true },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (updateDto.quantity === 0) {
      // Remove item from cart
      await this.prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      // Recalculate price in case sale status has changed
      const activePrice = cartItem.variant.prices.find(
        (price: any) => price.isActive
      );
      let newPrice = cartItem.price; // Keep existing price as fallback
      console.log({ activePrice });

      if (activePrice) {
        // Check if there's a sale price available
        if (
          activePrice.salePrice &&
          Number(activePrice.salePrice) > 0 &&
          Number(activePrice.salePrice) < Number(activePrice.price)
        ) {
          // Use sale price if it's less than original price
          newPrice = Number(activePrice.salePrice);
        } else {
          // Use original price if no sale or sale price is invalid
          newPrice = Number(activePrice.price);
        }
      }

      // Update quantity and price
      await this.prisma.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity: updateDto.quantity,
          price: newPrice,
        },
      });
    }

    // Get updated cart
    const updatedCart = await this.getCartById(cartId);

    return {
      cart: updatedCart,
      message:
        updateDto.quantity === 0
          ? 'Item removed from cart'
          : 'Cart updated successfully',
    };
  }

  async removeFromCart(
    cartId: string,
    cartItemId: string,
    userId?: string
  ): Promise<CartResponseDto> {
    try {
      // Verify cart access
      await this.verifyCartAccess(cartId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Try to recover by checking if the cart item exists and getting its cart
        const cartItem = await this.prisma.cartItem.findUnique({
          where: { id: cartItemId },
          include: { cart: true },
        });

        if (cartItem) {
          console.log(
            `[CartService] Cart item found in different cart: ${cartItem.cartId}, attempting recovery`
          );
          // Use the cart ID from the cart item instead
          cartId = cartItem.cartId;
          // Verify access to the recovered cart
          await this.verifyCartAccess(cartId, userId);
        } else {
          throw error; // Re-throw if we can't recover
        }
      } else {
        throw error;
      }
    }

    // Check if cart item exists
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Remove item from cart
    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    // Get updated cart
    const updatedCart = await this.getCartById(cartId);

    return {
      cart: updatedCart,
      message: 'Item removed from cart',
    };
  }

  async clearCart(cartId: string, userId?: string): Promise<CartResponseDto> {
    // Verify cart access
    await this.verifyCartAccess(cartId, userId);

    // Remove all items from cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });

    // Get updated cart
    const updatedCart = await this.getCartById(cartId);

    return {
      cart: updatedCart,
      message: 'Cart cleared successfully',
    };
  }

  private async verifyCartAccess(
    cartId: string,
    userId?: string
  ): Promise<any> {
    // Add logging to debug cart access issues
    console.log(
      `[CartService] Verifying cart access for cartId: ${cartId}, userId: ${
        userId || 'anonymous'
      }`
    );

    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      console.error(`[CartService] Cart not found: ${cartId}`);
      throw new NotFoundException(
        `Cart with ID ${cartId} not found. The cart may have been deleted or expired.`
      );
    }

    console.log(
      `[CartService] Cart found: ${cartId}, owner: ${cart.userId || 'guest'}`
    );

    // If user is authenticated, verify they own the cart
    if (userId && cart.userId && cart.userId !== userId) {
      console.error(
        `[CartService] Access denied: user ${userId} trying to access cart ${cartId} owned by ${cart.userId}`
      );
      throw new ForbiddenException('Access denied to this cart');
    }

    return cart;
  }

  private formatCart(cart: any): CartDto {
    const items = cart.items.map((item: any) => ({
      id: item.id,
      variantId: item.variantId,
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    const totalItems = items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    const subtotal = parseFloat(
      items
        .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
        .toFixed(2)
    );

    // Calculate shipping cost from config
    const shippingCost =
      subtotal >= this.configService.freeShippingThreshold
        ? 0
        : this.configService.shippingCost;

    // Calculate tax from config rate
    const tax = parseFloat(
      ((subtotal + shippingCost) * this.configService.taxRate).toFixed(2)
    );

    // Calculate total
    const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

    return {
      id: cart.id,
      userId: cart.userId || undefined,
      items,
      totalItems,
      subtotal,
      shippingCost,
      tax,
      total,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    };
  }

  // Utility method to clean up orphaned carts
  async cleanupOrphanedCarts(): Promise<{
    deletedCarts: number;
    deletedItems: number;
  }> {
    console.log('[CartService] Starting cleanup of orphaned carts...');

    // Find carts with no items
    const emptyCarts = await this.prisma.cart.findMany({
      where: {
        items: {
          none: {},
        },
      },
    });

    let deletedCarts = 0;
    let deletedItems = 0;

    for (const cart of emptyCarts) {
      // Only delete guest carts (no userId) that are older than 24 hours
      if (!cart.userId && this.isCartExpired(cart.createdAt)) {
        await this.prisma.cart.delete({
          where: { id: cart.id },
        });
        deletedCarts++;
        console.log(`[CartService] Deleted expired guest cart: ${cart.id}`);
      }
    }

    // Find and delete orphaned cart items (items that reference non-existent carts)
    // Note: This query might not work as expected with Prisma, so we'll use a different approach
    const allCartItems = await this.prisma.cartItem.findMany({
      include: { cart: true },
    });

    const orphanedItems = allCartItems.filter((item) => !item.cart);

    if (orphanedItems.length > 0) {
      await this.prisma.cartItem.deleteMany({
        where: {
          id: {
            in: orphanedItems.map((item) => item.id),
          },
        },
      });
      deletedItems = orphanedItems.length;
      console.log(`[CartService] Deleted ${deletedItems} orphaned cart items`);
    }

    console.log(
      `[CartService] Cleanup completed. Deleted ${deletedCarts} carts and ${deletedItems} items`
    );
    return { deletedCarts, deletedItems };
  }

  private isCartExpired(createdAt: Date): boolean {
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return Date.now() - createdAt.getTime() > expirationTime;
  }

  // Method to validate cart integrity
  async validateCartIntegrity(
    cartId: string
  ): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];

    try {
      const cart = await this.prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      });

      if (!cart) {
        issues.push('Cart does not exist');
        return { isValid: false, issues };
      }

      // Check if all cart items reference valid variants
      for (const item of cart.items) {
        const variantExists = await this.prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variantExists) {
          issues.push(
            `Cart item ${item.id} references non-existent variant ${item.variantId}`
          );
        }
      }

      return { isValid: issues.length === 0, issues };
    } catch (error) {
      issues.push(
        `Error validating cart: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return { isValid: false, issues };
    }
  }

  // Method to recalculate all cart item prices (useful when sale prices change)
  async recalculateCartPrices(
    cartId: string,
    userId?: string
  ): Promise<CartResponseDto> {
    // Verify cart access
    await this.verifyCartAccess(cartId, userId);

    // Get cart with items and their current prices
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            variant: {
              include: { prices: true },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Update prices for all cart items
    for (const cartItem of cart.items) {
      const activePrice = cartItem.variant.prices.find(
        (price: any) => price.isActive
      );
      let newPrice = cartItem.price; // Keep existing price as fallback

      if (activePrice) {
        // Check if there's a sale price available
        if (
          activePrice.salePrice &&
          Number(activePrice.salePrice) > 0 &&
          Number(activePrice.salePrice) < Number(activePrice.price)
        ) {
          // Use sale price if it's less than original price
          newPrice = Number(activePrice.salePrice);
        } else {
          // Use original price if no sale or sale price is invalid
          newPrice = Number(activePrice.price);
        }
      }

      // Update price if it has changed
      if (newPrice !== cartItem.price) {
        await this.prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { price: newPrice },
        });
      }
    }

    // Get updated cart
    const updatedCart = await this.getCartById(cartId);

    return {
      cart: updatedCart,
      message: 'Cart prices recalculated successfully',
    };
  }
}
