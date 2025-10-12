import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CartRecoveryService } from './cart-recovery.service';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  CartDto,
  CartResponseDto,
  UpdateCartItemDto,
} from './dto/cart.dto';

@ApiTags('Cart')
@Controller('cart')
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartRecoveryService: CartRecoveryService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart (authenticated users)' })
  @ApiResponse({
    status: 200,
    description: 'User cart retrieved successfully',
    type: CartDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserCart(@CurrentUser() user: any): Promise<CartDto> {
    return this.cartService.getUserCart(user.id);
  }

  @Get(':cartId')
  @ApiOperation({ summary: 'Get cart by ID (guest users)' })
  @ApiParam({ name: 'cartId', description: 'Cart ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart retrieved successfully',
    type: CartDto,
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCartById(@Param('cartId') cartId: string): Promise<CartDto> {
    return this.cartService.getCartById(cartId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new cart (guest users)' })
  @ApiResponse({
    status: 201,
    description: 'Cart created successfully',
    type: CartDto,
  })
  async createCart(): Promise<CartDto> {
    return this.cartService.createCart();
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @Request() req: any
  ): Promise<CartResponseDto> {
    // Extract cart ID from query parameters
    const cartId = req.query.cartId;
    if (!cartId) {
      throw new Error('Cart ID is required in query parameters');
    }

    // Extract user ID if authenticated
    const userId = req.user?.id;

    return this.cartService.addToCart(cartId, addToCartDto, userId);
  }

  @Put('items/:cartItemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'cartItemId', description: 'Cart item ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Cart or cart item not found' })
  async updateCartItem(
    @Param('cartItemId') cartItemId: string,
    @Body() updateDto: UpdateCartItemDto,
    @Request() req: any
  ): Promise<CartResponseDto> {
    // Extract cart ID from query parameters
    const cartId = req.query.cartId;
    if (!cartId) {
      throw new Error('Cart ID is required in query parameters');
    }

    // Extract user ID if authenticated
    const userId = req.user?.id;

    return this.cartService.updateCartItem(
      cartId,
      cartItemId,
      updateDto,
      userId
    );
  }

  @Delete('items/:cartItemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'cartItemId', description: 'Cart item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart or cart item not found' })
  async removeFromCart(
    @Param('cartItemId') cartItemId: string,
    @Request() req: any
  ): Promise<CartResponseDto> {
    // Extract cart ID from query parameters
    const cartId = req.query.cartId;
    if (!cartId) {
      throw new Error('Cart ID is required in query parameters');
    }

    // Extract user ID if authenticated
    const userId = req.user?.id;

    return this.cartService.removeFromCart(cartId, cartItemId, userId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async clearCart(@Request() req: any): Promise<CartResponseDto> {
    // Extract cart ID from query parameters
    const cartId = req.query.cartId;
    if (!cartId) {
      throw new Error('Cart ID is required in query parameters');
    }

    // Extract user ID if authenticated
    const userId = req.user?.id;

    return this.cartService.clearCart(cartId, userId);
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Clean up orphaned carts and items (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cleanup completed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async cleanupOrphanedCarts(): Promise<{
    deletedCarts: number;
    deletedItems: number;
  }> {
    return this.cartService.cleanupOrphanedCarts();
  }

  @Get('validate/:cartId')
  @ApiOperation({ summary: 'Validate cart integrity' })
  @ApiParam({ name: 'cartId', description: 'Cart ID to validate' })
  @ApiResponse({ status: 200, description: 'Cart validation completed' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async validateCart(
    @Param('cartId') cartId: string
  ): Promise<{ isValid: boolean; issues: string[] }> {
    return this.cartService.validateCartIntegrity(cartId);
  }

  @Post('recover')
  @ApiOperation({
    summary: 'Attempt to recover cart from cart item or create new cart',
  })
  @ApiResponse({ status: 200, description: 'Cart recovery completed' })
  async recoverCart(
    @Body() body: { cartItemId?: string; userId?: string; oldCartId?: string }
  ): Promise<{ cartId: string; recovered: boolean; migratedItems: number }> {
    let cartId: string | null = null;
    let recovered = false;
    let migratedItems = 0;

    // Try to recover from cart item first
    if (body.cartItemId) {
      const recovery = await this.cartRecoveryService.recoverCartFromItem(
        body.cartItemId
      );
      if (recovery && recovery.cartExists) {
        cartId = recovery.cartId;
        recovered = true;
      }
    }

    // If no cart found, try to find user's recent cart
    if (!cartId && body.userId) {
      cartId = await this.cartRecoveryService.findUserRecentCart(body.userId);
      if (cartId) {
        recovered = true;
      }
    }

    // If still no cart, try to find recent guest cart
    if (!cartId && !body.userId) {
      cartId = await this.cartRecoveryService.findRecentGuestCart();
      if (cartId) {
        recovered = true;
      }
    }

    // If no cart found at all, create a new one
    if (!cartId) {
      const newCart = await this.cartRecoveryService.createRecoveryCart(
        body.userId,
        body.oldCartId
      );
      cartId = newCart.cartId;
      migratedItems = newCart.migratedItems;
    }

    return { cartId, recovered, migratedItems };
  }

  @Post('recalculate-prices')
  @ApiOperation({
    summary: 'Recalculate cart item prices (useful when sale prices change)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart prices recalculated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async recalculateCartPrices(@Request() req: any): Promise<CartResponseDto> {
    // Extract cart ID from query parameters
    const cartId = req.query.cartId;
    if (!cartId) {
      throw new Error('Cart ID is required in query parameters');
    }

    // Extract user ID if authenticated
    const userId = req.user?.id;

    return this.cartService.recalculateCartPrices(cartId, userId);
  }
}
