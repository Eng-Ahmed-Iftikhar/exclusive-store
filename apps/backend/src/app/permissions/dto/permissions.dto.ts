import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Permission name (e.g., view, create)',
    example: 'view',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Display name for the permission',
    example: 'View',
  })
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @ApiProperty({ description: 'Permission description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'Display name for the permission',
    example: 'View',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ description: 'Permission description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the permission is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class PermissionResponseDto {
  @ApiProperty({ description: 'Permission ID' })
  id!: string;

  @ApiProperty({ description: 'Permission name', example: 'view' })
  name!: string;

  @ApiProperty({ description: 'Display name', example: 'View' })
  displayName!: string;

  @ApiProperty({ description: 'Permission description' })
  description?: string;

  @ApiProperty({ description: 'Whether the permission is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}
