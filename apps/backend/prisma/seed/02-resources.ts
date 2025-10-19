import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ResourceData {
  name: string;
  displayName: string;
  description: string;
}

export const resources: ResourceData[] = [
  {
    name: 'product',
    displayName: 'Product Management',
    description: 'Manage products and product catalog',
  },
  {
    name: 'category',
    displayName: 'Category Management',
    description: 'Manage product categories and subcategories',
  },
  {
    name: 'permission',
    displayName: 'Permission Management',
    description: 'Manage system permissions',
  },
  {
    name: 'role',
    displayName: 'Role Management',
    description: 'Manage user roles and role assignments',
  },
  {
    name: 'resource',
    displayName: 'Resource Management',
    description: 'Manage system resources',
  },
];

export async function seedResources(): Promise<void> {
  console.log('🔧 Seeding resources...');

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { name: resource.name },
      update: resource,
      create: resource,
    });
  }

  console.log(`✅ Seeded ${resources.length} resources`);
}

export async function getResources() {
  return await prisma.resource.findMany();
}
