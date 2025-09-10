import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CanManagePermissions } from '../auth/decorators/access-control.decorator';
import { PermissionsService } from './permissions.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from './dto/permissions.dto';

@ApiTags('Permissions - System Permissions Management')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @CanManagePermissions('create')
  @ApiOperation({
    summary: 'Create a new permission (Requires permissions:create permission)',
  })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({ status: 409, description: 'Permission already exists' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @Get()
  @CanManagePermissions('view')
  @ApiOperation({
    summary:
      'Get all permissions with pagination and search (Requires permissions:view)',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
  })
  async getAllPermissions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const searchTerm = search || '';

    return this.permissionsService.getAllPermissions(
      pageNum,
      limitNum,
      searchTerm
    );
  }

  @Get('active')
  @CanManagePermissions('view')
  @ApiOperation({
    summary:
      'Get all active permissions (Requires permissions:view permission)',
  })
  @ApiResponse({
    status: 200,
    description: 'Active permissions retrieved successfully',
  })
  async getActivePermissions() {
    return this.permissionsService.getActivePermissions();
  }

  @Get(':id')
  @CanManagePermissions('view')
  @ApiOperation({
    summary: 'Get permission by ID (Requires permissions:view permission)',
  })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async getPermissionById(@Param('id') id: string) {
    return this.permissionsService.getPermissionById(id);
  }

  @Put(':id')
  @CanManagePermissions('edit')
  @ApiOperation({
    summary: 'Update permission by ID (Requires permissions:edit permission)',
  })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionsService.updatePermission(id, updatePermissionDto);
  }

  @Delete(':id')
  @CanManagePermissions('delete')
  @ApiOperation({
    summary: 'Delete permission by ID (Requires permissions:delete permission)',
  })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete permission in use' })
  @HttpCode(HttpStatus.OK)
  async deletePermission(@Param('id') id: string) {
    return this.permissionsService.deletePermission(id);
  }
}
