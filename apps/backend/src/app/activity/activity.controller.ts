import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('activity')
@Controller('activity')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('recent')
  @ApiOperation({
    summary: 'Get recent activities',
    description: 'Retrieve the most recent activities from the system',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of activities to retrieve (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          metadata: { type: 'object' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getRecentActivities(@Query('limit') limit?: number) {
    return this.activityService.getRecentActivities(limit || 10);
  }

  @Get('by-type')
  @ApiOperation({
    summary: 'Get activities by type',
    description:
      'Retrieve activities filtered by type (order, user, product, payment, revenue, system)',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    type: String,
    description: 'Activity type to filter by',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of activities to retrieve (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          metadata: { type: 'object' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getActivitiesByType(
    @Query('type') type: string,
    @Query('limit') limit?: number
  ) {
    return this.activityService.getActivitiesByType(type, limit || 10);
  }

  @Get('by-user')
  @ApiOperation({
    summary: 'Get activities by user',
    description: 'Retrieve activities performed by a specific user',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'User ID to filter activities by',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of activities to retrieve (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'User activities retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          metadata: { type: 'object' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getActivitiesByUser(
    @Query('userId') userId: string,
    @Query('limit') limit?: number
  ) {
    return this.activityService.getActivitiesByUser(userId, limit || 10);
  }
}
