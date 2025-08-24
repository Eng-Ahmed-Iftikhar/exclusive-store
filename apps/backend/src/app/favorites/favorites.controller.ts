import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserFavorites(@Request() req: any) {
    const userId = req.user.id;
    return this.favoritesService.getUserFavorites(userId);
  }

  @Post(':itemId')
  @ApiOperation({ summary: 'Add item to favorites' })
  @ApiParam({ name: 'itemId', description: 'ID of the item to add to favorites' })
  @ApiResponse({ 
    status: 201, 
    description: 'Item added to favorites successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        item: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Item already in favorites' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addToFavorites(@Param('itemId') itemId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.favoritesService.addToFavorites(userId, itemId);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Remove item from favorites' })
  @ApiParam({ name: 'itemId', description: 'ID of the item to remove from favorites' })
  @ApiResponse({ 
    status: 200, 
    description: 'Item removed from favorites successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Removed from favorites' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeFromFavorites(@Param('itemId') itemId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.favoritesService.removeFromFavorites(userId, itemId);
  }

  @Get('check/:itemId')
  @ApiOperation({ summary: 'Check if item is in user favorites' })
  @ApiParam({ name: 'itemId', description: 'ID of the item to check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns favorite status of the item',
    schema: {
      type: 'object',
      properties: {
        isFavorited: { type: 'boolean' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkFavoriteStatus(@Param('itemId') itemId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.favoritesService.checkFavoriteStatus(userId, itemId);
  }
}
