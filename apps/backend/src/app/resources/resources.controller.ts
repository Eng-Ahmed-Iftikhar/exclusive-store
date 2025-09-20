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
import { CanManageResources } from '../auth/decorators/access-control.decorator';
import { ResourcesService } from './resources.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resources.dto';

@ApiTags('Resources')
@Controller('resources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @CanManageResources('create')
  @ApiOperation({
    summary: 'Create a new resource (Requires resources:create permission)',
  })
  @ApiResponse({ status: 201, description: 'Resource created successfully' })
  @ApiResponse({ status: 409, description: 'Resource already exists' })
  async createResource(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.createResource(createResourceDto);
  }

  @Get()
  @CanManageResources('view')
  @ApiOperation({
    summary:
      'Get all resources with pagination (Requires resources:view permission)',
  })
  @ApiResponse({ status: 200, description: 'Resources retrieved successfully' })
  async getAllResources(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string
  ) {
    return this.resourcesService.getAllResources(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search || ''
    );
  }

  @Get('active')
  @CanManageResources('view')
  @ApiOperation({
    summary: 'Get all active resources (Requires resources:view permission)',
  })
  @ApiResponse({
    status: 200,
    description: 'Active resources retrieved successfully',
  })
  async getActiveResources() {
    return this.resourcesService.getActiveResources();
  }

  @Get(':id')
  @CanManageResources('view')
  @ApiOperation({
    summary: 'Get resource by ID (Requires resources:view permission)',
  })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async getResourceById(@Param('id') id: string) {
    return this.resourcesService.getResourceById(id);
  }

  @Put(':id')
  @CanManageResources('edit')
  @ApiOperation({
    summary: 'Update resource by ID (Requires resources:edit permission)',
  })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource updated successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async updateResource(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto
  ) {
    return this.resourcesService.updateResource(id, updateResourceDto);
  }

  @Delete(':id')
  @CanManageResources('delete')
  @ApiOperation({
    summary: 'Delete resource by ID (Requires resources:delete permission)',
  })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete resource in use' })
  @HttpCode(HttpStatus.OK)
  async deleteResource(@Param('id') id: string) {
    return this.resourcesService.deleteResource(id);
  }
}
