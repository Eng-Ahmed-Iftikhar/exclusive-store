import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of user favorite items',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          item: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserFavorites(@Request() req: any) {
    const userId = req.user.id;
    return this.favoritesService.getUserFavorites(userId);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add product to favorites' })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product to add to favorites',
  })
  @ApiResponse({
    status: 201,
    description: 'Product added to favorites successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        product: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Product already in favorites' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addToFavorites(
    @Param('productId') productId: string,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.favoritesService.addToFavorites(userId, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from favorites' })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product to remove from favorites',
  })
  @ApiResponse({
    status: 200,
    description: 'Product removed from favorites successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Removed from favorites' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeFromFavorites(
    @Param('productId') productId: string,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.favoritesService.removeFromFavorites(userId, productId);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Check if product is in user favorites' })
  @ApiParam({ name: 'productId', description: 'ID of the product to check' })
  @ApiResponse({
    status: 200,
    description: 'Returns favorite status of the product',
    schema: {
      type: 'object',
      properties: {
        isFavorited: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkFavoriteStatus(
    @Param('productId') productId: string,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.favoritesService.checkFavoriteStatus(userId, productId);
  }
}
