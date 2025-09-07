import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from './dto/permissions.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class PermissionsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { name: createPermissionDto.name },
    });

    if (existingPermission) {
      throw new ConflictException(
        `Permission with name '${createPermissionDto.name}' already exists`
      );
    }

    const permission = await this.prisma.permission.create({
      data: createPermissionDto,
    });

    // Log activity
    await this.activityService.logSystemActivity(
      'Permission Created',
      `New permission '${permission.displayName}' (${permission.name}) has been created`,
      {
        permissionId: permission.id,
        permissionName: permission.name,
        permissionDisplayName: permission.displayName,
        action: 'create',
      }
    );

    return permission;
  }

  async getAllPermissions(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { displayName: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [permissions, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.permission.count({ where }),
    ]);

    return {
      permissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPermissionById(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID '${id}' not found`);
    }

    return permission;
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    const existingPermission = await this.getPermissionById(id);

    const updatedPermission = await this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });

    // Log activity
    await this.activityService.logSystemActivity(
      'Permission Updated',
      `Permission '${updatedPermission.displayName}' (${updatedPermission.name}) has been updated`,
      {
        permissionId: updatedPermission.id,
        permissionName: updatedPermission.name,
        permissionDisplayName: updatedPermission.displayName,
        action: 'update',
        changes: {
          displayName:
            existingPermission.displayName !== updatedPermission.displayName,
          description:
            existingPermission.description !== updatedPermission.description,
          isActive: existingPermission.isActive !== updatedPermission.isActive,
        },
      }
    );

    return updatedPermission;
  }

  async deletePermission(id: string) {
    const permission = await this.getPermissionById(id);

    // Check if permission is being used by any roles
    const roleResources = await this.prisma.roleResource.findMany({
      where: { permissionId: id },
    });

    if (roleResources.length > 0) {
      throw new ConflictException(
        'Cannot delete permission that is assigned to roles'
      );
    }

    const deletedPermission = await this.prisma.permission.update({
      where: { id },
      data: { isActive: false },
    });

    // Log activity
    await this.activityService.logSystemActivity(
      'Permission Deleted',
      `Permission '${permission.displayName}' (${permission.name}) has been deleted`,
      {
        permissionId: permission.id,
        permissionName: permission.name,
        permissionDisplayName: permission.displayName,
        action: 'delete',
        assignedToRoles: roleResources.length,
      }
    );

    return deletedPermission;
  }

  async getActivePermissions() {
    return this.prisma.permission.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
