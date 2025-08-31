import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resources.dto';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async createResource(createResourceDto: CreateResourceDto) {
    const existingResource = await this.prisma.resource.findUnique({
      where: { name: createResourceDto.name },
    });

    if (existingResource) {
      throw new ConflictException(
        `Resource with name '${createResourceDto.name}' already exists`
      );
    }

    return this.prisma.resource.create({
      data: createResourceDto,
    });
  }

  async getAllResources() {
    return this.prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getResourceById(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID '${id}' not found`);
    }

    return resource;
  }

  async updateResource(id: string, updateResourceDto: UpdateResourceDto) {
    await this.getResourceById(id);

    return this.prisma.resource.update({
      where: { id },
      data: updateResourceDto,
    });
  }

  async deleteResource(id: string) {
    await this.getResourceById(id);

    // Check if resource is being used by any roles
    const roleResources = await this.prisma.roleResource.findMany({
      where: { resourceId: id },
    });

    if (roleResources.length > 0) {
      throw new ConflictException(
        'Cannot delete resource that is assigned to roles'
      );
    }

    return this.prisma.resource.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getActiveResources() {
    return this.prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
