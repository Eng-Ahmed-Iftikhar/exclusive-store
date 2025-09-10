import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name (e.g., customer_manager)',
    example: 'customer_manager',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Display name for the role',
    example: 'Customer Manager',
  })
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @ApiProperty({ description: 'Role description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Array of resource-permission assignments',
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        resourceId: { type: 'string', format: 'uuid' },
        permissionId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @IsArray()
  @IsOptional()
  assignments?: Array<{
    resourceId: string;
    permissionId: string;
  }>;
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Display name for the role',
    example: 'Customer Manager',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ description: 'Role description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the role is active', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Array of resource-permission assignments',
    required: false,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        resourceId: { type: 'string', format: 'uuid' },
        permissionId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @IsArray()
  @IsOptional()
  assignments?: Array<{
    resourceId: string;
    permissionId: string;
  }>;
}

export class RoleResponseDto {
  @ApiProperty({ description: 'Role ID' })
  id!: string;

  @ApiProperty({ description: 'Role name', example: 'customer_manager' })
  name!: string;

  @ApiProperty({ description: 'Display name', example: 'Customer Manager' })
  displayName!: string;

  @ApiProperty({ description: 'Role description' })
  description?: string;

  @ApiProperty({ description: 'Whether this is a system role' })
  isSystem!: boolean;

  @ApiProperty({ description: 'Whether the role is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'ID of the user who created this role' })
  createdBy!: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}

export class AssignResourceToRoleDto {
  @ApiProperty({ description: 'Role ID' })
  @IsString()
  roleId!: string;

  @ApiProperty({ description: 'Resource ID' })
  @IsString()
  resourceId!: string;

  @ApiProperty({ description: 'Permission ID' })
  @IsString()
  permissionId!: string;
}

export class BulkAssignResourcesDto {
  @ApiProperty({ description: 'Role ID' })
  @IsString()
  roleId!: string;

  @ApiProperty({ description: 'Array of resource-permission assignments' })
  @IsArray()
  assignments!: Array<{
    resourceId: string;
    permissionId: string;
  }>;
}

export class RoleResourceResponseDto {
  @ApiProperty({ description: 'Role Resource ID' })
  id!: string;

  @ApiProperty({ description: 'Role ID' })
  roleId!: string;

  @ApiProperty({ description: 'Resource ID' })
  resourceId!: string;

  @ApiProperty({ description: 'Permission ID' })
  permissionId!: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;
}
