import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Team name (e.g., sales_team)',
    example: 'sales_team',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Display name for the team',
    example: 'Sales Team',
  })
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @ApiProperty({ description: 'Team description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTeamDto {
  @ApiProperty({
    description: 'Display name for the team',
    example: 'Sales Team',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ description: 'Team description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the team is active', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class TeamResponseDto {
  @ApiProperty({ description: 'Team ID' })
  id!: string;

  @ApiProperty({ description: 'Team name', example: 'sales_team' })
  name!: string;

  @ApiProperty({ description: 'Display name', example: 'Sales Team' })
  displayName!: string;

  @ApiProperty({ description: 'Team description' })
  description?: string;

  @ApiProperty({ description: 'Whether the team is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'ID of the user who created this team' })
  createdBy!: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}

export class AddUserToTeamDto {
  @ApiProperty({
    description: 'User ID to add to the team',
    example: 'cmf9vpggx0001egb0qhgnl4pe',
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Team ID where the user will be added',
    example: 'cmf9vpggx0001egb0qhgnl4pe',
  })
  @IsString()
  teamId!: string;
}

export class UpdateUserTeamRoleDto {
  @ApiProperty({
    description: 'New Role ID to assign to the user in this team',
    example: 'cmf9vpggx0001egb0qhgnl4pe',
  })
  @IsString()
  roleId!: string;
}

export class UserTeamResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user-team-role assignment',
    example: 'clxabcdef1234567890',
  })
  id!: string;

  @ApiProperty({
    description: 'User ID who is assigned to the team',
    example: 'clx0987654321fedcba',
  })
  userId!: string;

  @ApiProperty({
    description: 'Team ID where the user is assigned',
    example: 'clx1234567890abcdef',
  })
  teamId!: string;

  @ApiProperty({
    description: 'Role ID assigned to the user in this team',
    example: 'clxfedcba0987654321',
  })
  roleId!: string;

  @ApiProperty({
    description: 'Timestamp when the user joined the team with this role',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  joinedAt!: Date;
}

export class BulkAddUsersToTeamDto {
  @ApiProperty({
    description: 'Team ID where users will be added',
    example: 'cmf9vpggx0001egb0qhgnl4pe',
  })
  @IsString()
  teamId!: string;

  @ApiProperty({
    description: 'Array of user IDs to add to the team',
    example: ['cmf9vpggx0001egb0qhgnl4pe', 'cmf9vpggx0003egb0qhgnl4pg'],
    type: 'array',
    items: {
      type: 'string',
      example: 'cmf9vpggx0001egb0qhgnl4pe',
    },
  })
  @IsArray()
  users!: Array<{
    userId: string;
  }>;
}

export class AddUsersByEmailToTeamDto {
  @ApiProperty({
    description: 'Array of user emails to invite to the team',
    example: ['user1@example.com', 'user2@example.com'],
    type: [String],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  userEmails!: string[];
}

export class AddRolesToTeamDto {
  @ApiProperty({
    description: 'Array of role IDs to assign to the team',
    example: ['cmf9vpggx0001egb0qhgnl4pe', 'cmf9vpggx0002egb0qhgnl4pf'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  roleIds!: string[];
}

export class AddMultipleRolesToUserDto {
  @ApiProperty({
    description: 'User ID to assign roles to',
    example: 'cmf9vpggx0001egb0qhgnl4pe',
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Team ID where the user will be assigned roles',
    example: 'cmf9vpggx0001egb0qhgnl4pe',
  })
  @IsString()
  teamId!: string;

  @ApiProperty({
    description:
      'Array of role IDs to assign to the user. Each role ID must be a valid CUID.',
    example: ['cmf9vpggx0001egb0qhgnl4pe', 'cmf9vpggx0002egb0qhgnl4pf'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  roleIds!: string[];
}

export class CreateTeamWithUsersDto {
  @ApiProperty({
    description: 'Team name (e.g., sales_team)',
    example: 'sales_team',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Display name for the team',
    example: 'Sales Team',
  })
  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @ApiProperty({ description: 'Team description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Array of user emails to invite to the team',
    example: ['user1@example.com', 'user2@example.com'],
    type: [String],
  })
  @IsArray()
  @IsEmail({}, { each: true })
  userEmails!: string[];

  @ApiProperty({
    description: 'Array of role IDs to assign to the team',
    example: ['cmf9vpggx0001egb0qhgnl4pe', 'cmf9vpggx0002egb0qhgnl4pf'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  roleIds!: string[];
}

export class TeamQueryDto {
  @ApiProperty({
    description: 'Search term for team name or display name',
    example: 'sales',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    description: 'Sort by field',
    example: 'name',
    enum: ['name', 'displayName', 'createdAt', 'updatedAt'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'displayName' | 'createdAt' | 'updatedAt';

  @ApiProperty({
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class RemoveRolesFromUserDto {
  @ApiProperty({
    description: 'Array of role IDs to remove from the user',
    example: ['cmf9vpggx0001egb0qhgnl4pe', 'cmf9vpggx0002egb0qhgnl4pf'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  roleIds!: string[];
}

export class TeamRoleResponseDto {
  @ApiProperty({ description: 'Team Role ID' })
  id!: string;

  @ApiProperty({ description: 'Team ID' })
  teamId!: string;

  @ApiProperty({ description: 'Role ID' })
  roleId!: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Role details' })
  role!: {
    id: string;
    name: string;
    displayName: string;
    description?: string;
  };
}
