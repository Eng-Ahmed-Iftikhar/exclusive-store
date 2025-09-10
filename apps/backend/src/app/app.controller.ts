import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get public data',
    description: 'Get public application data (no authentication required)',
  })
  @ApiResponse({
    status: 200,
    description: 'Public data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Hello API' },
      },
    },
  })
  getData() {
    return this.appService.getData();
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get protected data',
    description: 'Get protected application data (authentication required)',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Protected data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Hello authenticated user!' },
        user: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  getProtectedData(@CurrentUser() user: any) {
    return {
      message: `Hello ${user.name}! This is protected data.`,
      user: user,
    };
  }
}
