import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartRecoveryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Attempts to recover a cart by finding the cart item and determining its actual cart
   */
  async recoverCartFromItem(cartItemId: string): Promise<{ cartId: string; cartExists: boolean } | null> {
    try {
      const cartItem = await this.prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true }
      });

      if (!cartItem) {
        return null;
      }

      const cartExists = await this.prisma.cart.findUnique({
        where: { id: cartItem.cartId }
      });

      return {
        cartId: cartItem.cartId,
        cartExists: !!cartExists
      };
    } catch (error) {
      console.error(`[CartRecoveryService] Error recovering cart from item: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Attempts to find a user's most recent cart
   */
  async findUserRecentCart(userId: string): Promise<string | null> {
    try {
      const recentCart = await this.prisma.cart.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
      });

      return recentCart?.id || null;
    } catch (error) {
      console.error(`[CartRecoveryService] Error finding user recent cart: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Attempts to find a guest cart by checking recent activity
   */
  async findRecentGuestCart(): Promise<string | null> {
    try {
      const recentCart = await this.prisma.cart.findFirst({
        where: { userId: null },
        orderBy: { updatedAt: 'desc' }
      });

      return recentCart?.id || null;
    } catch (error) {
      console.error(`[CartRecoveryService] Error finding recent guest cart: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Creates a new cart and migrates items from an old cart if possible
   */
  async createRecoveryCart(userId?: string, oldCartId?: string): Promise<{ cartId: string; migratedItems: number }> {
    try {
      // Create new cart
      const newCart = await this.prisma.cart.create({
        data: { userId }
      });

      let migratedItems = 0;

      // If we have an old cart ID, try to migrate items
      if (oldCartId) {
        const oldCartItems = await this.prisma.cartItem.findMany({
          where: { cartId: oldCartId }
        });

        if (oldCartItems.length > 0) {
          // Migrate items to new cart
          for (const item of oldCartItems) {
            try {
              await this.prisma.cartItem.create({
                data: {
                  cartId: newCart.id,
                  itemId: item.itemId,
                  quantity: item.quantity,
                  price: item.price
                }
              });
              migratedItems++;
            } catch (error) {
              console.warn(`[CartRecoveryService] Failed to migrate item ${item.id}: ${error instanceof Error ? error.message : String(error)}`);
            }
          }
        }
      }

      return { cartId: newCart.id, migratedItems };
    } catch (error) {
      console.error(`[CartRecoveryService] Error creating recovery cart: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
