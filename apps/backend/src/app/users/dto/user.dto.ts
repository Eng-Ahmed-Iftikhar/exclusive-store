import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Search by name or email',
    example: 'john',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by role name',
    example: 'customer',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 'cuid123' })
  id!: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email!: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name!: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Email verification status',
    example: true,
  })
  isEmailVerified!: boolean;

  @ApiProperty({
    description: 'Authentication provider',
    example: 'google',
    required: false,
  })
  provider?: string;

  @ApiProperty({ description: 'User creation date' })
  createdAt!: Date;

  @ApiProperty({
    description: 'User role',
    required: false,
  })
  role?: {
    id: string;
    name: string;
    displayName: string;
  };
}

export class UsersListResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserResponseDto],
  })
  data!: UserResponseDto[];

  @ApiProperty({
    description: 'Pagination information',
  })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
