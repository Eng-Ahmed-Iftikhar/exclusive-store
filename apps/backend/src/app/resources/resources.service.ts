import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resources.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class ResourcesService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService
  ) {}

  async createResource(createResourceDto: CreateResourceDto) {
    const existingResource = await this.prisma.resource.findUnique({
      where: { name: createResourceDto.name },
    });

    if (existingResource) {
      throw new ConflictException(
        `Resource with name '${createResourceDto.name}' already exists`
      );
    }

    const resource = await this.prisma.resource.create({
      data: createResourceDto,
    });

    // Log activity
    await this.activityService.logSystemActivity(
      'Resource Created',
      `New resource '${resource.displayName}' (${resource.name}) has been created`,
      { resourceId: resource.id, resourceName: resource.name }
    );

    return resource;
  }

  async getAllResources(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const whereClause = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { displayName: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [resources, total] = await Promise.all([
      this.prisma.resource.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.resource.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      resources,
      total,
      page,
      limit,
      totalPages,
    };
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
    const resource = await this.prisma.resource.update({
      where: { id },
      data: updateResourceDto,
    });

    // Log activity
    await this.activityService.logSystemActivity(
      'Resource Updated',
      `Resource '${resource.displayName}' (${resource.name}) has been updated`,
      { resourceId: resource.id, resourceName: resource.name }
    );

    return resource;
  }

  async deleteResource(id: string) {
    const existingResource = await this.getResourceById(id);

    // Check if resource is being used by any roles
    const roleResources = await this.prisma.roleResource.findMany({
      where: { resourceId: id },
    });

    if (roleResources.length > 0) {
      throw new ConflictException(
        'Cannot delete resource that is assigned to roles'
      );
    }

    const resource = await this.prisma.resource.update({
      where: { id },
      data: { isActive: false },
    });

    // Log activity
    await this.activityService.logSystemActivity(
      'Resource Deleted',
      `Resource '${resource.displayName}' (${resource.name}) has been deleted`,
      { resourceId: resource.id, resourceName: resource.name }
    );

    return resource;
  }

  async getActiveResources() {
    return this.prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
