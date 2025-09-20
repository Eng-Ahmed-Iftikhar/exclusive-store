import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CanManageFiles } from '../auth/decorators/access-control.decorator';
import {
  UpdateFileDto,
  FileQueryDto,
  FileResponseDto,
  FileListResponseDto,
  BulkDeleteFilesDto,
  TransformFileDto,
  FileUploadResponseDto,
} from './dto/file.dto';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Upload a file to Cloudinary using configured folder',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: FileUploadResponseDto,
    example: {
      file: {
        id: 'cm123456789',
        originalName: 'product-image.jpg',
        publicId: 'uploads/product-image_123456789',
        url: 'http://res.cloudinary.com/your-cloud/image/upload/v1234567890/uploads/product-image_123456789.jpg',
        secureUrl:
          'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/uploads/product-image_123456789.jpg',
        format: 'jpg',
        bytes: 245760,
        width: 800,
        height: 600,
        type: 'image',
        status: 'ready',
        folder: 'uploads',
        tags: ['product', 'featured'],
        metadata: {
          resourceType: 'image',
          version: 1234567890,
          uploadedBy: 'user123',
        },
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
      message: 'File uploaded successfully',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file or upload failed',
    example: {
      statusCode: 400,
      message: 'File size exceeds 10MB limit',
      error: 'Bad Request',
    },
  })
  @CanManageFiles('create')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ): Promise<FileUploadResponseDto> {
    const uploadedFile = await this.filesService.uploadFile(file, req.user?.id);
    return {
      file: uploadedFile,
      message: 'File uploaded successfully',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all files',
    description:
      'Retrieve a paginated list of files with optional filtering and search',
  })
  @ApiResponse({
    status: 200,
    description: 'Files retrieved successfully',
    type: FileListResponseDto,
    example: {
      files: [
        {
          id: 'cm123456789',
          originalName: 'product-image.jpg',
          publicId: 'uploads/product-image_123456789',
          url: 'http://res.cloudinary.com/your-cloud/image/upload/v1234567890/uploads/product-image_123456789.jpg',
          secureUrl:
            'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/uploads/product-image_123456789.jpg',
          format: 'jpg',
          bytes: 245760,
          width: 800,
          height: 600,
          type: 'image',
          status: 'ready',
          folder: 'uploads',
          tags: ['product', 'featured'],
          metadata: {
            resourceType: 'image',
            version: 1234567890,
            uploadedBy: 'user123',
          },
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
  })
  @CanManageFiles('view')
  async getAllFiles(
    @Query() query: FileQueryDto
  ): Promise<FileListResponseDto> {
    return this.filesService.getAllFiles(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get file by ID',
    description: 'Retrieve a specific file by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'File retrieved successfully',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @CanManageFiles('view')
  async getFileById(@Param('id') id: string): Promise<FileResponseDto> {
    return this.filesService.getFileById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update file metadata',
    description:
      'Update file metadata such as folder, tags, and custom metadata',
  })
  @ApiResponse({
    status: 200,
    description: 'File updated successfully',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @CanManageFiles('update')
  async updateFile(
    @Param('id') id: string,
    @Body() updateData: UpdateFileDto
  ): Promise<FileResponseDto> {
    return this.filesService.updateFile(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a file',
    description: 'Delete a file from both Cloudinary and the database',
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @CanManageFiles('delete')
  async deleteFile(@Param('id') id: string): Promise<{ message: string }> {
    await this.filesService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }

  @Post('bulk-delete')
  @ApiOperation({
    summary: 'Delete multiple files',
    description: 'Delete multiple files at once',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk delete completed',
    schema: {
      type: 'object',
      properties: {
        deleted: {
          type: 'number',
          description: 'Number of files successfully deleted',
        },
        failed: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs of files that failed to delete',
        },
        message: { type: 'string' },
      },
    },
  })
  @CanManageFiles('delete')
  async bulkDeleteFiles(@Body() bulkDeleteDto: BulkDeleteFilesDto): Promise<{
    deleted: number;
    failed: string[];
    message: string;
  }> {
    const result = await this.filesService.bulkDeleteFiles(
      bulkDeleteDto.fileIds
    );
    return {
      ...result,
      message: `Successfully deleted ${result.deleted} files${
        result.failed.length > 0 ? `, ${result.failed.length} failed` : ''
      }`,
    };
  }

  @Post(':id/transform')
  @ApiOperation({
    summary: 'Transform a file',
    description:
      'Apply transformations to an existing file (resize, crop, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'File transformed successfully',
    type: FileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @CanManageFiles('update')
  async transformFile(
    @Param('id') id: string,
    @Body() transformData: TransformFileDto
  ): Promise<FileResponseDto> {
    return this.filesService.transformFile(id, transformData);
  }

  @Get('cloudinary/usage')
  @ApiOperation({
    summary: 'Get Cloudinary usage statistics',
    description: 'Retrieve current Cloudinary account usage and limits',
  })
  @ApiResponse({
    status: 200,
    description: 'Usage statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        plan: { type: 'string' },
        objects: { type: 'object' },
        bandwidth: { type: 'object' },
        storage: { type: 'object' },
        requests: { type: 'object' },
        resources: { type: 'object' },
        derived_resources: { type: 'object' },
      },
    },
  })
  @CanManageFiles('view')
  async getCloudinaryUsage(): Promise<any> {
    return this.filesService.getCloudinaryUsage();
  }

  @Get('cloudinary/search')
  @ApiOperation({
    summary: 'Search files in Cloudinary',
    description:
      'Search for files directly in Cloudinary using their search API',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  @CanManageFiles('view')
  async searchCloudinaryFiles(
    @Query('query') query: string,
    @Query('limit') limit?: number
  ): Promise<any> {
    return this.filesService.searchCloudinaryFiles(query, { limit });
  }

  // ==================== FILE ORGANIZATION ENDPOINTS ====================

  @Get('folders/list')
  @ApiOperation({
    summary: 'List all folders',
    description: 'Get a list of all folders used in file organization',
  })
  @ApiResponse({
    status: 200,
    description: 'Folders retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        folders: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @CanManageFiles('view')
  async getFolders(): Promise<{ folders: string[] }> {
    // This would typically query the database for unique folders
    // For now, returning a placeholder
    return { folders: ['uploads', 'products', 'categories', 'users'] };
  }

  @Get('tags/list')
  @ApiOperation({
    summary: 'List all tags',
    description: 'Get a list of all tags used for file organization',
  })
  @ApiResponse({
    status: 200,
    description: 'Tags retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        tags: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @CanManageFiles('view')
  async getTags(): Promise<{ tags: string[] }> {
    // This would typically query the database for unique tags
    // For now, returning a placeholder
    return { tags: ['product', 'featured', 'banner', 'thumbnail', 'gallery'] };
  }

  @Get('stats/overview')
  @ApiOperation({
    summary: 'Get file statistics',
    description:
      'Get overview statistics about files (count by type, total size, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalFiles: { type: 'number' },
        totalSize: { type: 'number' },
        filesByType: { type: 'object' },
        filesByStatus: { type: 'object' },
        recentUploads: { type: 'number' },
      },
    },
  })
  @CanManageFiles('view')
  async getFileStats(): Promise<any> {
    // This would typically query the database for statistics
    // For now, returning a placeholder
    return {
      totalFiles: 0,
      totalSize: 0,
      filesByType: {},
      filesByStatus: {},
      recentUploads: 0,
    };
  }
}
