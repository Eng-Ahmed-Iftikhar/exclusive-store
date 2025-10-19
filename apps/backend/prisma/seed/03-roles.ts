import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RoleData {
  name: string;
  displayName: string;
  description: string;
  isSystem: boolean;
}

export const roles: RoleData[] = [
  {
    name: 'super-admin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    isSystem: true,
  },
  {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Administrative access to most system features',
    isSystem: true,
  },
  {
    name: 'customer',
    displayName: 'Customer',
    description: 'Customer access to the system',
    isSystem: true,
  },
];

export async function seedRoles(): Promise<void> {
  console.log('👥 Seeding roles...');

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: {
        ...role,
        createdBy: null, // System roles have no creator
      },
    });
  }

  console.log(`✅ Seeded ${roles.length} roles`);
}

export async function getRoles() {
  return await prisma.role.findMany();
}
