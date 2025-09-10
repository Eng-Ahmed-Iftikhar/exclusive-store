import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  AddUserToTeamDto,
  BulkAddUsersToTeamDto,
  AddUsersByEmailToTeamDto,
  AddRolesToTeamDto,
  CreateTeamWithUsersDto,
} from './dto/teams.dto';
import * as crypto from 'crypto';

interface TeamQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private emailService: EmailService
  ) {}

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

  async createTeamWithUsers(
    createTeamWithUsersDto: CreateTeamWithUsersDto,
    createdBy: string
  ) {
    const { userEmails, roleIds, ...teamData } = createTeamWithUsersDto;

    // Check if team already exists
    const existingTeam = await this.prisma.team.findUnique({
      where: { name: teamData.name },
    });

    if (existingTeam) {
      throw new ConflictException(
        `Team with name '${teamData.name}' already exists`
      );
    }

    // Verify all roles exist
    for (const roleId of roleIds) {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID '${roleId}' not found`);
      }
    }

    // Create team first
    const team = await this.prisma.team.create({
      data: {
        ...teamData,
        createdBy,
      },
    });

    // Add roles to team
    for (const roleId of roleIds) {
      await this.prisma.teamRole.create({
        data: {
          teamId: team.id,
          roleId: roleId,
        },
      });
    }

    // Process each user email
    const results = [];
    for (const email of userEmails) {
      try {
        // Check if user already exists
        let user = await this.prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Create user without password (they'll set it via magic link)
          user = await this.prisma.user.create({
            data: {
              email,
              name: email.split('@')[0], // Use email prefix as name
              password: '', // Empty password, will be set via magic link
              isEmailVerified: false,
            },
          });
        }

        // Add user to team (without roles - roles are managed at team level)
        const userTeam = await this.prisma.userTeam.create({
          data: {
            userId: user.id,
            teamId: team.id,
          },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        });

        results.push(userTeam);

        // Generate magic link token for new users
        if (!user.password) {
          const magicToken = crypto.randomBytes(32).toString('hex');
          const tokenExpiry = 24 * 60 * 60; // 24 hours in seconds

          // Store magic link token in Redis
          await this.redisService.set(
            `magic_link:${magicToken}`,
            JSON.stringify({
              userId: user.id,
              email: user.email,
              teamId: team.id,
              teamName: team.name,
            }),
            tokenExpiry
          );

          // Send magic link email
          const magicLink = `${
            process.env.FRONTEND_URL
          }/setup-password?email=${encodeURIComponent(
            email
          )}&token=${magicToken}`;

          try {
            await this.emailService.sendMagicLink({
              to: email,
              teamName: team.name,
              magicLink,
              userName: user.name,
            });
          } catch (emailError) {
            console.error(
              `Failed to send magic link email to ${email}:`,
              emailError
            );
            // Continue even if email fails
          }
        }
      } catch (error) {
        console.error(`Failed to process user ${email}:`, error);
        // Continue with other users even if one fails
      }
    }

    return {
      team,
      members: results,
      message: `Team created successfully. ${results.length} users invited.`,
    };
  }

  async getAllTeams(query: TeamQuery = {}) {
    const {
      search,
      isActive = true,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = query;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await this.prisma.team.count({ where });

    // Get teams with pagination
    const teams = await this.prisma.team.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { userTeams: true },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    return {
      teams,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
          },
        },
        teamRoles: {
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

    // Use transaction to ensure all operations succeed or fail together
    return this.prisma.$transaction(async (tx) => {
      // Remove all team members first
      if (team.userTeams.length > 0) {
        await tx.userTeam.deleteMany({
          where: { teamId: id },
        });
      }

      // Remove all team roles
      await tx.teamRole.deleteMany({
        where: { teamId: id },
      });

      // Hard delete the team (completely remove from database)
      return tx.team.delete({
        where: { id },
      });
    });
  }

  // ==================== USER TEAM MANAGEMENT ====================

  async addUserToTeam(addUserDto: AddUserToTeamDto) {
    // Verify team exists
    await this.getTeamById(addUserDto.teamId);

    // Check if user is already in the team
    const existingUserTeam = await this.prisma.userTeam.findUnique({
      where: {
        userId_teamId: {
          userId: addUserDto.userId,
          teamId: addUserDto.teamId,
        },
      },
    });

    if (existingUserTeam) {
      throw new ConflictException('User is already in this team');
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
      },
    });
  }

  async bulkAddUsersToTeam(bulkAddDto: BulkAddUsersToTeamDto) {
    await this.getTeamById(bulkAddDto.teamId);

    const userTeams: { teamId: string; userId: string }[] = [];
    for (const user of bulkAddDto.users) {
      userTeams.push({
        teamId: bulkAddDto.teamId,
        userId: user.userId,
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
            },
          });
          results.push(result);
        } catch (error: unknown) {
          // Skip if user already has this role in team
          if (
            error &&
            typeof error === 'object' &&
            'code' in error &&
            error.code === 'P2002'
          ) {
            continue;
          }
          throw error;
        }
      }

      return results;
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
      },
    });
  }

  async addUsersByEmailToTeam(
    teamId: string,
    addUsersDto: AddUsersByEmailToTeamDto
  ) {
    const { userEmails } = addUsersDto;

    // Verify team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // No need to verify roles since they are managed at team level

    const results = {
      created: 0,
      invited: 0,
      alreadyExists: 0,
      errors: [] as string[],
    };

    for (const email of userEmails) {
      try {
        // Check if user already exists
        let user = await this.prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Create new user
          user = await this.prisma.user.create({
            data: {
              email,
              name: email.split('@')[0], // Use email prefix as name
              password: '', // Will be set when they use magic link
              isEmailVerified: false,
              // roleId will be set when they join the team
            },
          });
          results.created++;
        } else {
          results.alreadyExists++;
        }

        // Check if user is already in team
        const existingUserTeam = await this.prisma.userTeam.findFirst({
          where: {
            userId: user.id,
            teamId: teamId,
          },
        });

        if (existingUserTeam) {
          // User already in team, skip
          continue;
        }

        // Add user to team (roles are managed at team level)
        await this.prisma.userTeam.create({
          data: {
            userId: user.id,
            teamId: teamId,
          },
        });

        // Send magic link if user doesn't have password set
        if (!user.password) {
          // Generate magic link token
          const magicToken = crypto.randomBytes(32).toString('hex');
          const tokenExpiry = 24 * 60 * 60; // 24 hours in seconds

          // Store token in Redis
          await this.redisService.set(
            `magic_link:${magicToken}`,
            JSON.stringify({
              userId: user.id,
              email: user.email,
              teamId: teamId,
            }),
            tokenExpiry
          );

          // Generate magic link URL
          const magicLink = `${
            process.env.FRONTEND_URL
          }/setup-password?email=${encodeURIComponent(
            user.email
          )}&token=${magicToken}`;

          try {
            await this.emailService.sendMagicLink({
              to: user.email,
              teamName: team.name,
              magicLink,
              userName: user.name,
            });
            results.invited++;
          } catch (emailError) {
            console.error('Failed to send magic link:', emailError);
            results.errors.push(`Failed to send magic link to ${user.email}`);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Failed to process ${email}: ${errorMessage}`);
      }
    }

    return {
      message: 'Users processed successfully',
      results,
    };
  }

  // ==================== TEAM ROLE MANAGEMENT ====================

  async addRolesToTeam(teamId: string, addRolesDto: AddRolesToTeamDto) {
    const { roleIds } = addRolesDto;

    // Verify team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Verify all roles exist
    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } },
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('One or more roles not found');
    }

    // Add roles to team
    const results = [];
    for (const roleId of roleIds) {
      try {
        const teamRole = await this.prisma.teamRole.create({
          data: {
            teamId,
            roleId,
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
        results.push(teamRole);
      } catch (error: unknown) {
        // Skip if role already exists in team
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          error.code === 'P2002'
        ) {
          continue;
        }
        throw error;
      }
    }

    return {
      message: 'Roles added to team successfully',
      teamRoles: results,
    };
  }

  async getTeamRoles(teamId: string) {
    // Verify team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const teamRoles = await this.prisma.teamRole.findMany({
      where: { teamId },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      teamId,
      teamRoles: teamRoles.map((tr) => ({
        id: tr.id,
        teamId: tr.teamId,
        roleId: tr.roleId,
        createdAt: tr.createdAt,
        role: tr.role,
      })),
    };
  }

  async removeRoleFromTeam(teamId: string, roleId: string) {
    // Verify team exists
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Verify role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Remove role from team
    const teamRole = await this.prisma.teamRole.findFirst({
      where: {
        teamId,
        roleId,
      },
    });

    if (!teamRole) {
      throw new NotFoundException('Role is not assigned to this team');
    }

    await this.prisma.teamRole.delete({
      where: { id: teamRole.id },
    });

    return {
      message: 'Role removed from team successfully',
    };
  }
}
