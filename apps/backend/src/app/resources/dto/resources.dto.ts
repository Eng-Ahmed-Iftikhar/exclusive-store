import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({
    description: 'Resource name (e.g., customer, order)',
    example: 'customer',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Display name for the resource',
    example: 'Customer Management',
  })
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @ApiProperty({ description: 'Resource description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateResourceDto {
  @ApiProperty({
    description: 'Display name for the resource',
    example: 'Customer Management',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ description: 'Resource description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the resource is active', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ResourceResponseDto {
  @ApiProperty({ description: 'Resource ID' })
  id!: string;

  @ApiProperty({ description: 'Resource name', example: 'customer' })
  name!: string;

  @ApiProperty({ description: 'Display name', example: 'Customer Management' })
  displayName!: string;

  @ApiProperty({ description: 'Resource description' })
  description?: string;

  @ApiProperty({ description: 'Whether the resource is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}
