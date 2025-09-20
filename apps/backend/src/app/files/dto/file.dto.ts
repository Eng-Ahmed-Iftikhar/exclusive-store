import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
  OTHER = 'other',
}

export enum FileStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
  DELETED = 'deleted',
}

export class UploadFileDto {
  @ApiProperty({
    description: 'File folder/path in Cloudinary',
    example: 'products',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class FileResponseDto {
  @ApiProperty({ description: 'File ID' })
  id!: string;

  @ApiProperty({ description: 'Original filename' })
  originalName!: string;

  @ApiProperty({ description: 'File public ID in Cloudinary' })
  publicId!: string;

  @ApiProperty({ description: 'File URL' })
  url!: string;

  @ApiProperty({ description: 'Secure file URL (HTTPS)' })
  secureUrl!: string;

  @ApiProperty({ description: 'File format' })
  format!: string;

  @ApiProperty({ description: 'File size in bytes' })
  bytes!: number;

  @ApiProperty({ description: 'File width (for images/videos)' })
  width?: number;

  @ApiProperty({ description: 'File height (for images/videos)' })
  height?: number;

  @ApiProperty({ description: 'File type' })
  type!: FileType;

  @ApiProperty({ description: 'File status' })
  status!: FileStatus;

  @ApiProperty({ description: 'File folder in Cloudinary' })
  folder?: string;

  @ApiProperty({ description: 'File tags' })
  tags?: string[];

  @ApiProperty({ description: 'File metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}

export class UpdateFileDto {
  @ApiProperty({
    description: 'New folder/path in Cloudinary',
    example: 'products/electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiProperty({
    description: 'File tags for organization',
    example: ['product', 'electronics', 'featured'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'File metadata',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class FileQueryDto {
  @ApiProperty({
    description: 'Search term for filename or tags',
    example: 'product',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by file type',
    example: 'image',
    enum: FileType,
    required: false,
  })
  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @ApiProperty({
    description: 'Filter by file status',
    example: 'ready',
    enum: FileStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;

  @ApiProperty({
    description: 'Filter by folder',
    example: 'products',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiProperty({
    description: 'Filter by tags',
    example: ['product', 'featured'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Sort by field',
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'originalName', 'bytes'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'updatedAt' | 'originalName' | 'bytes';

  @ApiProperty({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class BulkDeleteFilesDto {
  @ApiProperty({
    description: 'Array of file IDs to delete',
    example: ['file1', 'file2', 'file3'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  fileIds!: string[];
}

export class TransformFileDto {
  @ApiProperty({
    description: 'Transformation options',
    example: {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
    },
  })
  @IsObject()
  transformations!: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
    gravity?: string;
    radius?: number;
    effect?: string;
    opacity?: number;
    overlay?: string;
    underlay?: string;
    color?: string;
    background?: string;
    border?: string;
    flags?: string[];
  };

  @ApiProperty({
    description: 'Whether to create a new version or update existing',
    example: false,
    required: false,
  })
  @IsOptional()
  createNew?: boolean;
}

export class FileUploadResponseDto {
  @ApiProperty({ description: 'Uploaded file information' })
  file!: FileResponseDto;

  @ApiProperty({ description: 'Success message' })
  message!: string;
}

export class FileListResponseDto {
  @ApiProperty({ description: 'Array of files' })
  files!: FileResponseDto[];

  @ApiProperty({ description: 'Total number of files' })
  total!: number;

  @ApiProperty({ description: 'Current page number' })
  page!: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;
}
