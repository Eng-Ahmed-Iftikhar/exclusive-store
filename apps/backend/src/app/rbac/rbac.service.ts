import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RbacService {
  constructor(private prisma: PrismaService) {}

  // ==================== PERMISSION CHECKING ====================

  async checkUserPermission(
    userId: string,
    resource: string,
    permission: string
  ): Promise<boolean> {
    // Get all teams the user belongs to with their team roles
    const userTeams = await this.prisma.userTeam.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            teamRoles: {
              include: {
                role: {
                  include: {
                    roleResources: {
                      include: {
                        resource: true,
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Check if any of the user's team roles have the required permission
    for (const userTeam of userTeams) {
      for (const teamRole of userTeam.team.teamRoles) {
        for (const roleResource of teamRole.role.roleResources) {
          if (
            roleResource.resource.name === resource &&
            roleResource.permission.name === permission &&
            roleResource.resource.isActive &&
            roleResource.permission.isActive &&
            teamRole.role.isActive
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  async getUserPermissions(userId: string) {
    const userTeams = await this.prisma.userTeam.findMany({
      where: { userId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
          include: {
            teamRoles: {
              include: {
                role: {
                  include: {
                    roleResources: {
                      include: {
                        resource: true,
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const permissions = new Map<string, Set<string>>();

    for (const userTeam of userTeams) {
      for (const teamRole of userTeam.team.teamRoles) {
        if (!teamRole.role.isActive) continue;

        for (const roleResource of teamRole.role.roleResources) {
          if (
            !roleResource.resource.isActive ||
            !roleResource.permission.isActive
          )
            continue;

          const resourceName = roleResource.resource.name;
          const permissionName = roleResource.permission.name;

          if (!permissions.has(resourceName)) {
            permissions.set(resourceName, new Set());
          }
          const permissionSet = permissions.get(resourceName);
          if (permissionSet) {
            permissionSet.add(permissionName);
          }
        }
      }
    }

    // Convert to array format
    const result = [];
    for (const [resource, perms] of permissions) {
      result.push({
        resource,
        permissions: Array.from(perms),
      });
    }

    return result;
  }
}
