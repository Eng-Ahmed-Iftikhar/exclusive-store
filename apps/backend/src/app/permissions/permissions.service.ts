import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { name: createPermissionDto.name },
    });

    if (existingPermission) {
      throw new ConflictException(
        `Permission with name '${createPermissionDto.name}' already exists`
      );
    }

    return this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
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
    await this.getPermissionById(id);

    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  async deletePermission(id: string) {
    await this.getPermissionById(id);

    // Check if permission is being used by any roles
    const roleResources = await this.prisma.roleResource.findMany({
      where: { permissionId: id },
    });

    if (roleResources.length > 0) {
      throw new ConflictException(
        'Cannot delete permission that is assigned to roles'
      );
    }

    return this.prisma.permission.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getActivePermissions() {
    return this.prisma.permission.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
