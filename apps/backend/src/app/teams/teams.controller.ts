import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
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
import { CanManageTeams } from '../auth/decorators/access-control.decorator';
import { TeamsService } from './teams.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  AddUserToTeamDto,
  BulkAddUsersToTeamDto,
  AddUsersByEmailToTeamDto,
  AddRolesToTeamDto,
  CreateTeamWithUsersDto,
  TeamQueryDto,
} from './dto/teams.dto';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // ==================== TEAM MANAGEMENT ====================

  @Post()
  @CanManageTeams('create')
  @ApiOperation({
    summary: 'Create a new team (Requires teams:create permission)',
  })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  @ApiResponse({ status: 409, description: 'Team already exists' })
  async createTeam(
    @Body() createTeamDto: CreateTeamDto,
    @Request() req: { user: { id: string } }
  ) {
    return this.teamsService.createTeam(createTeamDto, req.user.id);
  }

  @Post('create-with-users')
  @CanManageTeams('create')
  @ApiOperation({
    summary:
      'Create team and invite users with magic links (Requires teams:create permission)',
  })
  @ApiResponse({
    status: 201,
    description: 'Team created and users invited successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Team already exists or user already exists',
  })
  async createTeamWithUsers(
    @Body() createTeamWithUsersDto: CreateTeamWithUsersDto,
    @Request() req: { user: { id: string } }
  ) {
    return this.teamsService.createTeamWithUsers(
      createTeamWithUsersDto,
      req.user.id
    );
  }

  @Get()
  @CanManageTeams('view')
  @ApiOperation({
    summary:
      'Get all teams with pagination and search (Requires teams:view permission)',
  })
  @ApiResponse({
    status: 200,
    description: 'Teams retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        teams: {
          type: 'array',
          items: { type: 'object' },
        },
        total: { type: 'number', example: 25 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 3 },
      },
    },
  })
  async getAllTeams(@Query() query: TeamQueryDto) {
    return this.teamsService.getAllTeams(query);
  }

  @Get(':id')
  @CanManageTeams('view')
  @ApiOperation({
    summary: 'Get team by ID with members (Requires teams:view permission)',
  })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiResponse({ status: 200, description: 'Team retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async getTeamById(@Param('id') id: string) {
    return this.teamsService.getTeamById(id);
  }

  @Put(':id')
  @CanManageTeams('edit')
  @ApiOperation({
    summary: 'Update team by ID (Requires teams:edit permission)',
  })
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
  @CanManageTeams('delete')
  @ApiOperation({
    summary: 'Delete team by ID (Requires teams:delete permission)',
    description:
      'Permanently deletes a team and removes all team members and roles from the database. This operation cannot be undone.',
  })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiResponse({
    status: 200,
    description:
      'Team permanently deleted from database along with all members and roles',
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @HttpCode(HttpStatus.OK)
  async deleteTeam(@Param('id') id: string) {
    return this.teamsService.deleteTeam(id);
  }

  // ==================== USER TEAM MANAGEMENT ====================

  @Post(':teamId/users')
  @CanManageTeams('create')
  @ApiOperation({
    summary: 'Add user to team (Requires teams:create permission)',
  })
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
  @CanManageTeams('create')
  @ApiOperation({
    summary: 'Bulk add users to team (Requires teams:create permission)',
  })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiResponse({ status: 201, description: 'Users added to team successfully' })
  async bulkAddUsersToTeam(
    @Param('teamId') teamId: string,
    @Body() bulkAddDto: BulkAddUsersToTeamDto
  ) {
    bulkAddDto.teamId = teamId;
    return this.teamsService.bulkAddUsersToTeam(bulkAddDto);
  }

  @Post(':teamId/users/by-email')
  @CanManageTeams('create')
  @ApiOperation({ summary: 'Add users to team by email with magic links' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiResponse({
    status: 201,
    description: 'Users invited to team successfully',
  })
  async addUsersByEmailToTeam(
    @Param('teamId') teamId: string,
    @Body() addUsersDto: AddUsersByEmailToTeamDto
  ) {
    return this.teamsService.addUsersByEmailToTeam(teamId, addUsersDto);
  }

  @Post(':teamId/roles')
  @CanManageTeams('edit')
  @ApiOperation({ summary: 'Add roles to team' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiResponse({ status: 201, description: 'Roles added to team successfully' })
  async addRolesToTeam(
    @Param('teamId') teamId: string,
    @Body() addRolesDto: AddRolesToTeamDto
  ) {
    return this.teamsService.addRolesToTeam(teamId, addRolesDto);
  }

  @Get(':teamId/roles')
  @CanManageTeams('view')
  @ApiOperation({ summary: 'Get team roles' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiResponse({
    status: 200,
    description: 'Team roles retrieved successfully',
  })
  async getTeamRoles(@Param('teamId') teamId: string) {
    return this.teamsService.getTeamRoles(teamId);
  }

  @Delete(':teamId/roles/:roleId')
  @CanManageTeams('edit')
  @ApiOperation({ summary: 'Remove role from team' })
  @ApiParam({ name: 'teamId', description: 'Team ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role removed from team successfully',
  })
  async removeRoleFromTeam(
    @Param('teamId') teamId: string,
    @Param('roleId') roleId: string
  ) {
    return this.teamsService.removeRoleFromTeam(teamId, roleId);
  }

  @Delete(':teamId/users/:userId')
  @CanManageTeams('delete')
  @ApiOperation({
    summary: 'Remove user from team (Requires teams:delete permission)',
  })
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
  @CanManageTeams('view')
  @ApiOperation({
    summary: 'Get all teams for a user (Requires teams:view permission)',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User teams retrieved successfully',
  })
  async getUserTeams(@Param('userId') userId: string) {
    return this.teamsService.getUserTeams(userId);
  }
}
