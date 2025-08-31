import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';
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
    example: 'clx0987654321fedcba',
    format: 'uuid',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    description: 'Team ID where the user will be added',
    example: 'clx1234567890abcdef',
    format: 'uuid',
  })
  @IsUUID()
  teamId!: string;

  @ApiProperty({
    description: 'Role ID to assign to the user in this team',
    example: 'clxfedcba0987654321',
    format: 'uuid',
  })
  @IsUUID()
  roleId!: string;
}

export class UpdateUserTeamRoleDto {
  @ApiProperty({
    description: 'New Role ID to assign to the user in this team',
    example: 'clxfedcba0987654321',
    format: 'uuid',
  })
  @IsUUID()
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
    example: 'clx1234567890abcdef',
    format: 'uuid',
  })
  @IsUUID()
  teamId!: string;

  @ApiProperty({
    description: 'Array of user-role assignments to add to the team',
    example: [
      { userId: 'clx0987654321fedcba', roleId: 'clxfedcba0987654321' },
      { userId: 'clxabcdef1234567890', roleId: 'clx1234567890fedcba' },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
          example: 'clx0987654321fedcba',
        },
        roleId: {
          type: 'string',
          format: 'uuid',
          example: 'clxfedcba0987654321',
        },
      },
    },
  })
  @IsArray()
  users!: Array<{
    userId: string;
    roleId: string;
  }>;
}

export class AddMultipleRolesToUserDto {
  @ApiProperty({
    description: 'User ID to assign roles to',
    example: 'clx0987654321fedcba',
    format: 'uuid',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    description: 'Team ID where the user will be assigned roles',
    example: 'clx1234567890abcdef',
    format: 'uuid',
  })
  @IsUUID()
  teamId!: string;

  @ApiProperty({
    description:
      'Array of role IDs to assign to the user. Each role ID must be a valid UUID.',
    example: ['clxfedcba0987654321', 'clx1234567890fedcba'],
    type: [String],
    format: 'uuid',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds!: string[];
}
