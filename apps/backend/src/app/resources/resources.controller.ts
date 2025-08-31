import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import { ResourcesService } from './resources.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resources.dto';

@ApiTags('Resources - System Resources Management')
@Controller('resources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiResponse({ status: 201, description: 'Resource created successfully' })
  @ApiResponse({ status: 409, description: 'Resource already exists' })
  async createResource(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.createResource(createResourceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active resources' })
  @ApiResponse({ status: 200, description: 'Resources retrieved successfully' })
  async getAllResources() {
    return this.resourcesService.getAllResources();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active resources' })
  @ApiResponse({
    status: 200,
    description: 'Active resources retrieved successfully',
  })
  async getActiveResources() {
    return this.resourcesService.getActiveResources();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async getResourceById(@Param('id') id: string) {
    return this.resourcesService.getResourceById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update resource by ID' })
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
  @ApiOperation({ summary: 'Delete resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete resource in use' })
  @HttpCode(HttpStatus.OK)
  async deleteResource(@Param('id') id: string) {
    return this.resourcesService.deleteResource(id);
  }
}
