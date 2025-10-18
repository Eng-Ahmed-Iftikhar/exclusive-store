import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignResourceToRoleDto,
  BulkAssignResourcesDto,
} from './dto/roles.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  // ==================== ROLE MANAGEMENT ====================

  async createRole(createRoleDto: CreateRoleDto, createdBy: string) {
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException(
        `Role with name '${createRoleDto.name}' already exists`
      );
    }

    // Extract assignments from DTO
    const { assignments, ...roleData } = createRoleDto;

    const role = await this.prisma.role.create({
      data: {
        ...roleData,
        createdBy,
      },
    });

    // Handle assignments if provided
    if (assignments && assignments.length > 0) {
      await this.bulkAssignResourcesToRole({
        roleId: role.id,
        assignments,
      });
    }

    // Log activity
    await this.activityService.createActivity({
      type: 'system',
      title: 'Role Created',
      description: `Role "${role.displayName}" (${role.name}) was created`,
      metadata: { roleId: role.id, roleName: role.name },
      userId: createdBy,
    });

    return role;
  }

  async getAllRoles(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause: Record<string, unknown> = { isActive: true };
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        where: whereClause,
        include: {
          creator: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { roleResources: true, teamRoles: true },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.role.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      roles,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getRoleById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        roleResources: {
          include: {
            resource: true,
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }

    return role;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.getRoleById(id);

    if (role.isSystem) {
      throw new ForbiddenException('Cannot modify system roles');
    }

    // Extract assignments from DTO
    const { assignments, ...roleData } = updateRoleDto;

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: roleData,
    });

    // Handle assignments if provided
    if (assignments !== undefined) {
      await this.bulkAssignResourcesToRole({
        roleId: id,
        assignments,
      });
    }

    // Log activity
    await this.activityService.createActivity({
      type: 'system',
      title: 'Role Updated',
      description: `Role "${updatedRole.displayName}" (${updatedRole.name}) was updated`,
      metadata: { roleId: updatedRole.id, roleName: updatedRole.name },
      userId: role.createdBy || undefined,
    });

    return updatedRole;
  }

  async deleteRole(id: string) {
    const role = await this.getRoleById(id);

    if (role.isSystem) {
      throw new ForbiddenException('Cannot delete system roles');
    }

    // Check if role is being used by any teams
    const teamRoles = await this.prisma.teamRole.findMany({
      where: { roleId: id },
    });

    if (teamRoles.length > 0) {
      throw new ConflictException(
        'Cannot delete role that is assigned to teams'
      );
    }

    const deletedRole = await this.prisma.role.update({
      where: { id },
      data: { isActive: false },
    });

    // Log activity
    await this.activityService.createActivity({
      type: 'system',
      title: 'Role Deleted',
      description: `Role "${deletedRole.displayName}" (${deletedRole.name}) was deleted`,
      metadata: { roleId: deletedRole.id, roleName: deletedRole.name },
      userId: role.createdBy || undefined,
    });

    return deletedRole;
  }

  async getSystemRoles() {
    return this.prisma.role.findMany({
      where: { isSystem: true, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getActiveRoles() {
    return this.prisma.role.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  // ==================== ROLE RESOURCE ASSIGNMENT ====================

  async assignResourceToRole(assignResourceDto: AssignResourceToRoleDto) {
    // Verify role, resource, and permission exist
    await this.getRoleById(assignResourceDto.roleId);

    const resource = await this.prisma.resource.findUnique({
      where: { id: assignResourceDto.resourceId },
    });
    if (!resource) {
      throw new NotFoundException(
        `Resource with ID '${assignResourceDto.resourceId}' not found`
      );
    }

    const permission = await this.prisma.permission.findUnique({
      where: { id: assignResourceDto.permissionId },
    });
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID '${assignResourceDto.permissionId}' not found`
      );
    }

    // Check if assignment already exists
    const existingAssignment = await this.prisma.roleResource.findUnique({
      where: {
        roleId_resourceId_permissionId: {
          roleId: assignResourceDto.roleId,
          resourceId: assignResourceDto.resourceId,
          permissionId: assignResourceDto.permissionId,
        },
      },
    });

    if (existingAssignment) {
      throw new ConflictException(
        'Resource-permission combination already assigned to this role'
      );
    }

    return this.prisma.roleResource.create({
      data: assignResourceDto,
      include: {
        role: true,
        resource: true,
        permission: true,
      },
    });
  }

  async bulkAssignResourcesToRole(bulkAssignDto: BulkAssignResourcesDto) {
    await this.getRoleById(bulkAssignDto.roleId);

    const assignments: {
      roleId: string;
      resourceId: string;
      permissionId: string;
    }[] = [];
    for (const assignment of bulkAssignDto.assignments) {
      const resource = await this.prisma.resource.findUnique({
        where: { id: assignment.resourceId },
      });
      if (!resource) {
        throw new NotFoundException(
          `Resource with ID '${assignment.resourceId}' not found`
        );
      }

      const permission = await this.prisma.permission.findUnique({
        where: { id: assignment.permissionId },
      });
      if (!permission) {
        throw new NotFoundException(
          `Permission with ID '${assignment.permissionId}' not found`
        );
      }

      assignments.push({
        roleId: bulkAssignDto.roleId,
        resourceId: assignment.resourceId,
        permissionId: assignment.permissionId,
      });
    }

    // Use transaction to ensure all assignments succeed or fail together
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Remove existing assignments for this role
      await tx.roleResource.deleteMany({
        where: { roleId: bulkAssignDto.roleId },
      });

      // Create new assignments
      const results = [];
      for (const assignment of assignments) {
        const result = await tx.roleResource.create({
          data: assignment,
          include: {
            resource: true,
            permission: true,
          },
        });
        results.push(result);
      }

      return results;
    });
  }

  async removeResourceFromRole(
    roleId: string,
    resourceId: string,
    permissionId: string
  ) {
    const assignment = await this.prisma.roleResource.findUnique({
      where: {
        roleId_resourceId_permissionId: {
          roleId,
          resourceId,
          permissionId,
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(
        'Resource-permission assignment not found for this role'
      );
    }

    return this.prisma.roleResource.delete({
      where: { id: assignment.id },
    });
  }

  async getRoleResources(roleId: string) {
    await this.getRoleById(roleId);

    return this.prisma.roleResource.findMany({
      where: { roleId },
      include: {
        resource: true,
        permission: true,
      },
    });
  }
}
