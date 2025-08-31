import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ 
    summary: 'Get dashboard statistics',
    description: 'Retrieve comprehensive dashboard statistics for admin panel' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number', example: 1250 },
        totalItems: { type: 'number', example: 450 },
        totalOrders: { type: 'number', example: 3200 },
        totalRevenue: { type: 'number', example: 125000.50 },
        recentOrders: { type: 'array' },
        topProducts: { type: 'array' },
        monthlyRevenue: { type: 'array' },
        lowStockItems: { type: 'array' },
        pendingReviews: { type: 'number', example: 45 },
        activeFlashSales: { type: 'number', example: 3 }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing token' 
  })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
