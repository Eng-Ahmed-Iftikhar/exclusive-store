import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface UserPermission {
  id: string;
  name: string;
  displayName: string;
  resource: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface UserRole {
  id: string;
  name: string;
  displayName: string;
  isSystem: boolean;
  isActive: boolean;
}

@Injectable()
export class AccessControlService {
  constructor(private prisma: PrismaService) {}

  async getUserPermissions(userId: string): Promise<string[]> {
    // Get user's main role permissions
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { roleId: true },
    });

    // Get permissions from main role (if exists)
    let rolePermissions: Array<{
      permission: { id: string; name: string; displayName: string };
      resource: { id: string; name: string; displayName: string };
    }> = [];
    if (user?.roleId) {
      rolePermissions = await this.prisma.roleResource.findMany({
        where: { roleId: user.roleId },
        include: {
          permission: true,
          resource: true,
        },
      });
    }

    // Get permissions from team roles (always check team roles)
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
                        permission: true,
                        resource: true,
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

    // Combine all permissions
    const allPermissions = [
      ...rolePermissions.map((rp) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        displayName: rp.permission.displayName,
        resource: {
          id: rp.resource.id,
          name: rp.resource.name,
          displayName: rp.resource.displayName,
        },
      })),
      ...userTeams.flatMap((ut) =>
        ut.team.teamRoles.flatMap((tr) =>
          tr.role.roleResources.map((rr) => ({
            id: rr.permission.id,
            name: rr.permission.name,
            displayName: rr.permission.displayName,
            resource: {
              id: rr.resource.id,
              name: rr.resource.name,
              displayName: rr.resource.displayName,
            },
          }))
        )
      ),
    ];

    return allPermissions.map(
      (permission) => `${permission.resource.name}:${permission.name}`
    );
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        userTeams: {
          include: {
            team: {
              include: {
                teamRoles: {
                  include: {
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    const roles = [];

    // Add main role
    if (user.role) {
      roles.push({
        id: user.role.id,
        name: user.role.name,
        displayName: user.role.displayName,
        isSystem: user.role.isSystem,
        isActive: user.role.isActive,
      });
    }

    // Add team roles
    user.userTeams.forEach((ut) => {
      ut.team.teamRoles.forEach((tr) => {
        roles.push({
          id: tr.role.id,
          name: tr.role.name,
          displayName: tr.role.displayName,
          isSystem: tr.role.isSystem,
          isActive: tr.role.isActive,
        });
      });
    });

    // Remove duplicates
    const uniqueRoles = roles.filter(
      (role, index, self) => index === self.findIndex((r) => r.id === role.id)
    );

    return uniqueRoles;
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    // Superadmin bypass - if user is superadmin, they have all permissions
    const isSuperAdmin = await this.hasRole(userId, 'super-admin');
    if (isSuperAdmin) {
      return true;
    }

    const permissions = await this.getUserPermissions(userId);
    return permissions.some((p) => p === permission);
  }

  async hasRole(userId: string, role: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some((r) => r.name === role);
  }

  async hasAnyPermission(
    userId: string,
    permissions: string[]
  ): Promise<boolean> {
    // Superadmin bypass - if user is superadmin, they have all permissions
    const isSuperAdmin = await this.hasRole(userId, 'super-admin');
    if (isSuperAdmin) {
      return true;
    }

    const userPermissions = await this.getUserPermissions(userId);
    return permissions.some((permission) =>
      userPermissions.some((p) => p === permission)
    );
  }

  async hasAllPermissions(
    userId: string,
    permissions: string[]
  ): Promise<boolean> {
    // Superadmin bypass - if user is superadmin, they have all permissions
    const isSuperAdmin = await this.hasRole(userId, 'super-admin');
    if (isSuperAdmin) {
      return true;
    }
    console.log({ permissions, userId });

    const userPermissions = await this.getUserPermissions(userId);
    console.log({ userPermissions });

    const isAllowed = permissions.some((permission) =>
      userPermissions.find((p) => p === permission)
    );

    return isAllowed;
  }

  async hasAnyRole(userId: string, roles: string[]): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    return roles.some((role) => userRoles.some((r) => r.name === role));
  }

  async canAccessResource(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    // Superadmin bypass - if user is superadmin, they have all permissions
    const isSuperAdmin = await this.hasRole(userId, 'super-admin');
    if (isSuperAdmin) {
      return true;
    }

    const permissions = await this.getUserPermissions(userId);
    const permissionName = `${resource}:${action}`;
    return permissions.some((p) => p === permissionName);
  }
}
