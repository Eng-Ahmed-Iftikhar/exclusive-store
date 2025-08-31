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
    // Get all teams the user belongs to
    const userTeams = await this.prisma.userTeam.findMany({
      where: { userId },
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
    });

    // Check if any of the user's roles in any team have the required permission
    for (const userTeam of userTeams) {
      for (const roleResource of userTeam.role.roleResources) {
        if (
          roleResource.resource.name === resource &&
          roleResource.permission.name === permission &&
          roleResource.resource.isActive &&
          roleResource.permission.isActive &&
          userTeam.role.isActive
        ) {
          return true;
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
        },
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
    });

    const permissions = new Map<string, Set<string>>();

    for (const userTeam of userTeams) {
      if (!userTeam.role.isActive) continue;

      for (const roleResource of userTeam.role.roleResources) {
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
