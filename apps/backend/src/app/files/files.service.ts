import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CustomLoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import {
  UpdateFileDto,
  FileQueryDto,
  FileResponseDto,
  FileType,
  FileStatus,
  FileListResponseDto,
  TransformFileDto,
} from './dto/file.dto';

@Injectable()
export class FilesService {
  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService,
    private prisma: PrismaService
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.cloudinaryCloudName,
      api_key: this.configService.cloudinaryApiKey,
      api_secret: this.configService.cloudinaryApiSecret,
    });
  }

  // ==================== FILE UPLOAD ====================

  async uploadFile(
    file: Express.Multer.File,
    userId?: string
  ): Promise<FileResponseDto> {
    try {
      this.logger.log(
        `Starting file upload: ${file.originalname}`,
        'FilesService'
      );

      // Validate file
      this.validateFile(file);

      // Prepare upload options
      const uploadConfig: any = {
        resource_type: 'auto',
        folder: this.configService.cloudinaryFolder,
        use_filename: true,
        unique_filename: true,
      };

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        uploadConfig
      );

      // Determine file type
      const fileType = this.determineFileType(
        result.format,
        result.resource_type
      );

      // Save file metadata to database
      const savedFile = await this.prisma.file.create({
        data: {
          originalName: file.originalname,
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          type: fileType,
          status: FileStatus.READY,
          folder: result.folder,
          tags: [],
          metadata: {
            resourceType: result.resource_type,
            version: result.version,
            signature: result.signature,
            etag: result.etag,
            originalFilename: file.originalname,
            uploadedBy: userId,
          },
        },
      });

      this.logger.log(
        `File uploaded successfully: ${savedFile.id}`,
        'FilesService'
      );

      return this.mapToFileResponse(savedFile);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `File upload failed: ${errorMessage}`,
        errorStack,
        'FilesService'
      );
      throw new BadRequestException(`File upload failed: ${errorMessage}`);
    }
  }

  // ==================== FILE MANAGEMENT ====================

  async getAllFiles(query: FileQueryDto = {}): Promise<FileListResponseDto> {
    const {
      search,
      type,
      status,
      folder,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (folder) {
      where.folder = folder;
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Execute query
    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.file.count({ where }),
    ]);

    return {
      files: files.map((file) => this.mapToFileResponse(file)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFileById(id: string): Promise<FileResponseDto> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return this.mapToFileResponse(file);
  }

  async updateFile(
    id: string,
    updateData: UpdateFileDto
  ): Promise<FileResponseDto> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    // Update in Cloudinary if folder or tags changed
    if (updateData.folder || updateData.tags) {
      try {
        await cloudinary.api.update(file.publicId, {
          folder: updateData.folder,
          tags: updateData.tags,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        this.logger.error(
          `Failed to update file in Cloudinary: ${errorMessage}`,
          errorStack,
          'FilesService'
        );
        throw new BadRequestException('Failed to update file in Cloudinary');
      }
    }

    // Update in database
    const updatedFile = await this.prisma.file.update({
      where: { id },
      data: {
        folder: updateData.folder,
        tags: updateData.tags,
        metadata: updateData.metadata,
        updatedAt: new Date(),
      },
    });

    return this.mapToFileResponse(updatedFile);
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    try {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: this.getResourceType(file.format),
      });

      // Update status in database
      await this.prisma.file.update({
        where: { id },
        data: { status: FileStatus.DELETED },
      });

      this.logger.log(`File deleted successfully: ${id}`, 'FilesService');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to delete file: ${errorMessage}`,
        errorStack,
        'FilesService'
      );
      throw new BadRequestException('Failed to delete file');
    }
  }

  async bulkDeleteFiles(
    fileIds: string[]
  ): Promise<{ deleted: number; failed: string[] }> {
    const results = { deleted: 0, failed: [] as string[] };

    for (const fileId of fileIds) {
      try {
        await this.deleteFile(fileId);
        results.deleted++;
      } catch (error) {
        results.failed.push(fileId);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Failed to delete file ${fileId}: ${errorMessage}`,
          'FilesService'
        );
      }
    }

    return results;
  }

  // ==================== FILE TRANSFORMATIONS ====================

  async transformFile(
    id: string,
    transformData: TransformFileDto
  ): Promise<FileResponseDto> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    try {
      let transformedUrl: string;

      if (transformData.createNew) {
        // Create a new transformed version
        const result = await cloudinary.uploader.upload(file.url, {
          transformation: transformData.transformations,
          folder: file.folder || undefined,
          tags: [...(file.tags || []), 'transformed'],
        });

        // Save new file to database
        const newFile = await this.prisma.file.create({
          data: {
            originalName: `${file.originalName}_transformed`,
            publicId: result.public_id,
            url: result.url,
            secureUrl: result.secure_url,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            type: file.type,
            status: FileStatus.READY,
            folder: result.folder,
            tags: result.tags || [],
            metadata: {
              ...((file.metadata as object) || {}),
              originalFileId: file.id,
              transformation: transformData.transformations,
            },
          },
        });

        return this.mapToFileResponse(newFile);
      } else {
        // Generate transformed URL for existing file
        transformedUrl = cloudinary.url(file.publicId, {
          transformation: transformData.transformations,
          resource_type: this.getResourceType(file.format),
        });

        // Update file with transformed URL
        const updatedFile = await this.prisma.file.update({
          where: { id },
          data: {
            url: transformedUrl,
            secureUrl: transformedUrl,
            metadata: {
              ...((file.metadata as object) || {}),
              lastTransformation: transformData.transformations,
            },
          },
        });

        return this.mapToFileResponse(updatedFile);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `File transformation failed: ${errorMessage}`,
        errorStack,
        'FilesService'
      );
      throw new BadRequestException('File transformation failed');
    }
  }

  // ==================== UTILITY METHODS ====================

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed`
      );
    }
  }

  private determineFileType(format: string, resourceType: string): FileType {
    if (resourceType === 'image') {
      return FileType.IMAGE;
    } else if (resourceType === 'video') {
      return FileType.VIDEO;
    } else if (resourceType === 'raw') {
      if (['pdf', 'doc', 'docx', 'txt'].includes(format.toLowerCase())) {
        return FileType.DOCUMENT;
      } else if (['mp3', 'wav', 'aac', 'ogg'].includes(format.toLowerCase())) {
        return FileType.AUDIO;
      }
    }
    return FileType.OTHER;
  }

  private getResourceType(format: string): string {
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoFormats = ['mp4', 'webm', 'mov', 'avi'];

    if (imageFormats.includes(format.toLowerCase())) {
      return 'image';
    } else if (videoFormats.includes(format.toLowerCase())) {
      return 'video';
    }
    return 'raw';
  }

  private mapToFileResponse(file: any): FileResponseDto {
    return {
      id: file.id,
      originalName: file.originalName,
      publicId: file.publicId,
      url: file.url,
      secureUrl: file.secureUrl,
      format: file.format,
      bytes: file.bytes,
      width: file.width,
      height: file.height,
      type: file.type,
      status: file.status,
      folder: file.folder,
      tags: file.tags,
      metadata: file.metadata,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }

  // ==================== CLOUDINARY UTILITIES ====================

  async getCloudinaryUsage(): Promise<any> {
    try {
      const result = await cloudinary.api.usage();
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to get Cloudinary usage: ${errorMessage}`,
        errorStack,
        'FilesService'
      );
      throw new BadRequestException('Failed to get Cloudinary usage');
    }
  }

  async searchCloudinaryFiles(query: string, options: any = {}): Promise<any> {
    try {
      const result = await cloudinary.search
        .expression(query)
        .max_results(options.limit || 20)
        .execute();
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to search Cloudinary files: ${errorMessage}`,
        errorStack,
        'FilesService'
      );
      throw new BadRequestException('Failed to search Cloudinary files');
    }
  }
}
