import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
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
import { RolesService } from './roles.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignResourceToRoleDto,
  BulkAssignResourcesDto,
} from './dto/roles.dto';

@ApiTags('Roles - System Roles Management')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // ==================== ROLE MANAGEMENT ====================

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 409, description: 'Role already exists' })
  async createRole(@Body() createRoleDto: CreateRoleDto, @Request() req: any) {
    return this.rolesService.createRole(createRoleDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Get('system')
  @ApiOperation({ summary: 'Get all system roles' })
  @ApiResponse({
    status: 200,
    description: 'System roles retrieved successfully',
  })
  async getSystemRoles() {
    return this.rolesService.getSystemRoles();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active roles' })
  @ApiResponse({
    status: 200,
    description: 'Active roles retrieved successfully',
  })
  async getActiveRoles() {
    return this.rolesService.getActiveRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID with details' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRoleById(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 403, description: 'Cannot modify system roles' })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 403, description: 'Cannot delete system roles' })
  @ApiResponse({ status: 409, description: 'Cannot delete role in use' })
  @HttpCode(HttpStatus.OK)
  async deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }

  // ==================== ROLE RESOURCE ASSIGNMENT ====================

  @Post(':roleId/resources')
  @ApiOperation({ summary: 'Assign resource to role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 201, description: 'Resource assigned successfully' })
  @ApiResponse({ status: 409, description: 'Assignment already exists' })
  async assignResourceToRole(
    @Param('roleId') roleId: string,
    @Body() assignResourceDto: AssignResourceToRoleDto
  ) {
    assignResourceDto.roleId = roleId;
    return this.rolesService.assignResourceToRole(assignResourceDto);
  }

  @Post(':roleId/resources/bulk')
  @ApiOperation({ summary: 'Bulk assign resources to role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 201, description: 'Resources assigned successfully' })
  async bulkAssignResourcesToRole(
    @Param('roleId') roleId: string,
    @Body() bulkAssignDto: BulkAssignResourcesDto
  ) {
    bulkAssignDto.roleId = roleId;
    return this.rolesService.bulkAssignResourcesToRole(bulkAssignDto);
  }

  @Get(':roleId/resources')
  @ApiOperation({ summary: 'Get all resources assigned to a role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role resources retrieved successfully',
  })
  async getRoleResources(@Param('roleId') roleId: string) {
    return this.rolesService.getRoleResources(roleId);
  }

  @Delete(':roleId/resources/:resourceId/permissions/:permissionId')
  @ApiOperation({ summary: 'Remove resource from role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'resourceId', description: 'Resource ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Resource removed successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @HttpCode(HttpStatus.OK)
  async removeResourceFromRole(
    @Param('roleId') roleId: string,
    @Param('resourceId') resourceId: string,
    @Param('permissionId') permissionId: string
  ) {
    return this.rolesService.removeResourceFromRole(
      roleId,
      resourceId,
      permissionId
    );
  }
}
