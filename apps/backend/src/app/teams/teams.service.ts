import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  AddUserToTeamDto,
  UpdateUserTeamRoleDto,
  BulkAddUsersToTeamDto,
} from './dto/teams.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  // ==================== TEAM MANAGEMENT ====================

  async createTeam(createTeamDto: CreateTeamDto, createdBy: string) {
    const existingTeam = await this.prisma.team.findUnique({
      where: { name: createTeamDto.name },
    });

    if (existingTeam) {
      throw new ConflictException(
        `Team with name '${createTeamDto.name}' already exists`
      );
    }

    return this.prisma.team.create({
      data: {
        ...createTeamDto,
        createdBy,
      },
    });
  }

  async getAllTeams() {
    return this.prisma.team.findMany({
      where: { isActive: true },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { userTeams: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getTeamById(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        userTeams: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            role: {
              select: { id: true, name: true, displayName: true },
            },
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID '${id}' not found`);
    }

    return team;
  }

  async updateTeam(id: string, updateTeamDto: UpdateTeamDto) {
    await this.getTeamById(id);

    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
  }

  async deleteTeam(id: string) {
    const team = await this.getTeamById(id);

    // Check if team has members
    if (team.userTeams.length > 0) {
      throw new ConflictException('Cannot delete team that has members');
    }

    return this.prisma.team.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ==================== USER TEAM MANAGEMENT ====================

  async addUserToTeam(addUserDto: AddUserToTeamDto) {
    // Verify team and role exist
    await this.getTeamById(addUserDto.teamId);

    const role = await this.prisma.role.findUnique({
      where: { id: addUserDto.roleId },
    });
    if (!role) {
      throw new NotFoundException(
        `Role with ID '${addUserDto.roleId}' not found`
      );
    }

    // Check if user already has this specific role in the team
    const existingUserTeam = await this.prisma.userTeam.findUnique({
      where: {
        userId_teamId_roleId: {
          userId: addUserDto.userId,
          teamId: addUserDto.teamId,
          roleId: addUserDto.roleId,
        },
      },
    });

    if (existingUserTeam) {
      throw new ConflictException('User already has this role in this team');
    }

    return this.prisma.userTeam.create({
      data: addUserDto,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        team: {
          select: { id: true, name: true, displayName: true },
        },
        role: {
          select: { id: true, name: true, displayName: true },
        },
      },
    });
  }

  async bulkAddUsersToTeam(bulkAddDto: BulkAddUsersToTeamDto) {
    await this.getTeamById(bulkAddDto.teamId);

    const userTeams: { teamId: string; userId: string; roleId: string }[] = [];
    for (const user of bulkAddDto.users) {
      const role = await this.prisma.role.findUnique({
        where: { id: user.roleId },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID '${user.roleId}' not found`);
      }

      userTeams.push({
        teamId: bulkAddDto.teamId,
        userId: user.userId,
        roleId: user.roleId,
      });
    }

    // Use transaction to ensure all assignments succeed or fail together
    return this.prisma.$transaction(async (tx) => {
      const results = [];
      for (const userTeam of userTeams) {
        try {
          const result = await tx.userTeam.create({
            data: userTeam,
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
              team: {
                select: { id: true, name: true, displayName: true },
              },
              role: {
                select: { id: true, name: true, displayName: true },
              },
            },
          });
          results.push(result);
        } catch (error: any) {
          // Skip if user already has this role in team
          if (error.code === 'P2002') {
            continue;
          }
          throw error;
        }
      }

      return results;
    });
  }

  async updateUserTeamRole(
    userId: string,
    teamId: string,
    updateDto: UpdateUserTeamRoleDto
  ) {
    // Find the specific user-team-role combination to update
    const userTeam = await this.prisma.userTeam.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    if (!userTeam) {
      throw new NotFoundException('User is not a member of this team');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: updateDto.roleId },
    });
    if (!role) {
      throw new NotFoundException(
        `Role with ID '${updateDto.roleId}' not found`
      );
    }

    // Check if user already has this role in the team
    const existingRole = await this.prisma.userTeam.findUnique({
      where: {
        userId_teamId_roleId: {
          userId,
          teamId,
          roleId: updateDto.roleId,
        },
      },
    });

    if (existingRole && existingRole.id !== userTeam.id) {
      throw new ConflictException('User already has this role in this team');
    }

    return this.prisma.userTeam.update({
      where: { id: userTeam.id },
      data: { roleId: updateDto.roleId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        team: {
          select: { id: true, name: true, displayName: true },
        },
        role: {
          select: { id: true, name: true, displayName: true },
        },
      },
    });
  }

  async removeUserFromTeam(userId: string, teamId: string) {
    const userTeam = await this.prisma.userTeam.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    if (!userTeam) {
      throw new NotFoundException('User is not a member of this team');
    }

    return this.prisma.userTeam.delete({
      where: { id: userTeam.id },
    });
  }

  async getUserTeams(userId: string) {
    return this.prisma.userTeam.findMany({
      where: { userId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
      },
    });
  }

  // New method to add multiple roles to a user in a team
  async addMultipleRolesToUser(
    userId: string,
    teamId: string,
    roleIds: string[]
  ) {
    // Verify team exists
    await this.getTeamById(teamId);

    // Verify all roles exist
    for (const roleId of roleIds) {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID '${roleId}' not found`);
      }
    }

    // Use transaction to ensure all assignments succeed or fail together
    return this.prisma.$transaction(async (tx) => {
      const results = [];
      for (const roleId of roleIds) {
        try {
          const result = await tx.userTeam.create({
            data: {
              userId,
              teamId,
              roleId,
            },
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
              team: {
                select: { id: true, name: true, displayName: true },
              },
              role: {
                select: { id: true, name: true, displayName: true },
              },
            },
          });
          results.push(result);
        } catch (error: any) {
          // Skip if user already has this role in team
          if (error.code === 'P2002') {
            continue;
          }
          throw error;
        }
      }

      return results;
    });
  }

  // New method to get all roles for a user in a specific team
  async getUserTeamRoles(userId: string, teamId: string) {
    return this.prisma.userTeam.findMany({
      where: {
        userId,
        teamId,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
      },
    });
  }
}
