import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacService } from './rbac.service';
import { CheckPermissionDto } from './dto/rbac.dto';

@ApiTags('RBAC')
@Controller('rbac')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // ==================== PERMISSION CHECKING ENDPOINTS ====================

  @Post('permissions/check')
  @ApiOperation({ summary: 'Check if user has specific permission' })
  @ApiResponse({ status: 200, description: 'Permission check completed' })
  async checkUserPermission(
    @Body() checkPermissionDto: CheckPermissionDto,
    @Request() req: any
  ) {
    const hasPermission = await this.rbacService.checkUserPermission(
      req.user.id,
      checkPermissionDto.resource,
      checkPermissionDto.permission
    );

    return {
      hasPermission,
      userId: req.user.id,
      resource: checkPermissionDto.resource,
      permission: checkPermissionDto.permission,
    };
  }

  @Get('permissions/user')
  @ApiOperation({ summary: 'Get all permissions for current user' })
  @ApiResponse({
    status: 200,
    description: 'User permissions retrieved successfully',
  })
  async getUserPermissions(@Request() req: any) {
    return this.rbacService.getUserPermissions(req.user.id);
  }
}
