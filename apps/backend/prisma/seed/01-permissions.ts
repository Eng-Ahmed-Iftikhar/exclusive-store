import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PermissionData {
  name: string;
  displayName: string;
  description: string;
}

export const permissions: PermissionData[] = [
  {
    name: 'create',
    displayName: 'Create',
    description: 'Create new records and data',
  },
  {
    name: 'update',
    displayName: 'Update',
    description: 'Update existing records and data',
  },
  {
    name: 'view',
    displayName: 'View',
    description: 'View and read data',
  },
  {
    name: 'delete',
    displayName: 'Delete',
    description: 'Delete records and data',
  },
];

export async function seedPermissions(): Promise<void> {
  console.log('🔐 Seeding permissions...');

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: permission,
    });
  }

  console.log(`✅ Seeded ${permissions.length} permissions`);
}

export async function getPermissions() {
  return await prisma.permission.findMany();
}
