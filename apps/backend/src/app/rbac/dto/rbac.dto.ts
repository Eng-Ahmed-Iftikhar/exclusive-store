import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Permission Check DTOs
export class CheckPermissionDto {
  @ApiProperty({ description: 'Resource name to check', example: 'customer' })
  @IsString()
  @IsNotEmpty()
  resource!: string;

  @ApiProperty({ description: 'Permission to check', example: 'view' })
  @IsString()
  @IsNotEmpty()
  permission!: string;
}

export class PermissionCheckResponseDto {
  @ApiProperty({ description: 'Whether the user has the permission' })
  hasPermission!: boolean;

  @ApiProperty({ description: 'User ID' })
  userId!: string;

  @ApiProperty({ description: 'Resource name' })
  resource!: string;

  @ApiProperty({ description: 'Permission name' })
  permission!: string;
}
