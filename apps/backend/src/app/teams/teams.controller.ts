import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamsService } from './teams.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  AddUserToTeamDto,
  UpdateUserTeamRoleDto,
  BulkAddUsersToTeamDto,
  AddMultipleRolesToUserDto,
} from './dto/teams.dto';

@ApiTags('Teams - Team Management')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // ==================== TEAM MANAGEMENT ====================

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  @ApiResponse({ status: 409, description: 'Team already exists' })
  async createTeam(@Body() createTeamDto: CreateTeamDto, @Request() req: any) {
    return this.teamsService.createTeam(createTeamDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active teams' })
  @ApiResponse({ status: 200, description: 'Teams retrieved successfully' })
  async getAllTeams() {
    return this.teamsService.getAllTeams();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by ID with members' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Team retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async getTeamById(@Param('id') id: string) {
    return this.teamsService.getTeamById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update team by ID' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async updateTeam(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto
  ) {
    return this.teamsService.updateTeam(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete team by ID' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Team deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete team with members' })
  @HttpCode(HttpStatus.OK)
  async deleteTeam(@Param('id') id: string) {
    return this.teamsService.deleteTeam(id);
  }

  // ==================== USER TEAM MANAGEMENT ====================

  @Post(':teamId/users')
  @ApiOperation({ summary: 'Add user to team' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiResponse({ status: 201, description: 'User added to team successfully' })
  @ApiResponse({ status: 409, description: 'User already in team' })
  async addUserToTeam(
    @Param('teamId') teamId: string,
    @Body() addUserDto: AddUserToTeamDto
  ) {
    addUserDto.teamId = teamId;
    return this.teamsService.addUserToTeam(addUserDto);
  }

  @Post(':teamId/users/bulk')
  @ApiOperation({ summary: 'Bulk add users to team' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiResponse({ status: 201, description: 'Users added to team successfully' })
  async bulkAddUsersToTeam(
    @Param('teamId') teamId: string,
    @Body() bulkAddDto: BulkAddUsersToTeamDto
  ) {
    bulkAddDto.teamId = teamId;
    return this.teamsService.bulkAddUsersToTeam(bulkAddDto);
  }

  @Put(':teamId/users/:userId/role')
  @ApiOperation({ summary: 'Update user role in team' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 404, description: 'User not in team' })
  async updateUserTeamRole(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Body() updateDto: UpdateUserTeamRoleDto
  ) {
    return this.teamsService.updateUserTeamRole(userId, teamId, updateDto);
  }

  @Delete(':teamId/users/:userId')
  @ApiOperation({ summary: 'Remove user from team' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User removed from team successfully',
  })
  @ApiResponse({ status: 404, description: 'User not in team' })
  @HttpCode(HttpStatus.OK)
  async removeUserFromTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.teamsService.removeUserFromTeam(userId, teamId);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get all teams for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User teams retrieved successfully',
  })
  async getUserTeams(@Param('userId') userId: string) {
    return this.teamsService.getUserTeams(userId);
  }

  @Post(':teamId/users/:userId/roles')
  @ApiOperation({
    summary: 'Add multiple roles to a user in a team',
    description:
      'Assigns multiple roles to a user within a specific team. If the user already has some of the roles, they will be skipped gracefully.',
  })
  @ApiParam({
    name: 'teamId',
    description: 'Team ID',
    example: 'clx1234567890abcdef',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'clx0987654321fedcba',
  })
  @ApiResponse({
    status: 201,
    description: 'Roles added to user successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxabcdef1234567890' },
          userId: { type: 'string', example: 'clx0987654321fedcba' },
          teamId: { type: 'string', example: 'clx1234567890abcdef' },
          roleId: { type: 'string', example: 'clxfedcba0987654321' },
          joinedAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john@example.com' },
            },
          },
          team: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'sales_team' },
              displayName: { type: 'string', example: 'Sales Team' },
            },
          },
          role: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'customer_manager' },
              displayName: { type: 'string', example: 'Customer Manager' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 404, description: 'Team or user not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async addMultipleRolesToUser(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Body() addRolesDto: AddMultipleRolesToUserDto
  ) {
    addRolesDto.teamId = teamId;
    addRolesDto.userId = userId;
    return this.teamsService.addMultipleRolesToUser(
      userId,
      teamId,
      addRolesDto.roleIds
    );
  }

  @Get(':teamId/users/:userId/roles')
  @ApiOperation({
    summary: 'Get all roles for a user in a specific team',
    description:
      'Retrieves all role assignments for a specific user within a specific team, including role details and permissions.',
  })
  @ApiParam({
    name: 'teamId',
    description: 'Team ID',
    example: 'clx1234567890abcdef',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'clx0987654321fedcba',
  })
  @ApiResponse({
    status: 200,
    description: 'User team roles retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clxabcdef1234567890' },
          userId: { type: 'string', example: 'clx0987654321fedcba' },
          teamId: { type: 'string', example: 'clx1234567890abcdef' },
          roleId: { type: 'string', example: 'clxfedcba0987654321' },
          joinedAt: { type: 'string', format: 'date-time' },
          role: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'customer_manager' },
              displayName: { type: 'string', example: 'Customer Manager' },
              description: {
                type: 'string',
                example: 'Manages customer relationships and data',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Team or user not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getUserTeamRoles(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return this.teamsService.getUserTeamRoles(userId, teamId);
  }
}
