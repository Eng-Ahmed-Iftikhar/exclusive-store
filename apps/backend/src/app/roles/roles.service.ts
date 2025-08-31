import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignResourceToRoleDto,
  BulkAssignResourcesDto,
} from './dto/roles.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.role.create({
      data: {
        ...createRoleDto,
        createdBy,
      },
    });
  }

  async getAllRoles() {
    return this.prisma.role.findMany({
      where: { isActive: true },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { roleResources: true, userTeams: true },
        },
      },
      orderBy: { name: 'asc' },
    });
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

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async deleteRole(id: string) {
    const role = await this.getRoleById(id);

    if (role.isSystem) {
      throw new ForbiddenException('Cannot delete system roles');
    }

    // Check if role is being used by any users
    const userTeams = await this.prisma.userTeam.findMany({
      where: { roleId: id },
    });

    if (userTeams.length > 0) {
      throw new ConflictException(
        'Cannot delete role that is assigned to users'
      );
    }

    return this.prisma.role.update({
      where: { id },
      data: { isActive: false },
    });
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
    return this.prisma.$transaction(async (tx) => {
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
