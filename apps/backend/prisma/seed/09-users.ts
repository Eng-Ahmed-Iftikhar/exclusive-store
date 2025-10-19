import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { getRoles } from './03-roles';

const prisma = new PrismaClient();

export interface UserData {
  email: string;
  name: string;
  password: string;
  roleName: string;
  isEmailVerified: boolean;
}

export const users: UserData[] = [
  {
    email: 'superadmin@exclusive.com',
    name: 'Super Administrator',
    password: 'superadmin123',
    roleName: 'super-admin',
    isEmailVerified: true,
  },
  {
    email: 'admin@exclusive.com',
    name: 'Administrator',
    password: 'admin123',
    roleName: 'admin',
    isEmailVerified: true,
  },
];

export async function seedUsers(): Promise<void> {
  console.log('👤 Seeding users...');

  // Get all roles
  const roles = await getRoles();
  const roleMap = new Map(roles.map((role) => [role.name, role.id]));

  let seededCount = 0;

  for (const userData of users) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Get the role ID
    const roleId = roleMap.get(userData.roleName);
    if (!roleId) {
      console.warn(`⚠️  Role not found for user: ${userData.email}`);
      continue;
    }

    // Create or update the user
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        password: hashedPassword,
        roleId,
        isEmailVerified: userData.isEmailVerified,
      },
      create: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        roleId,
        isEmailVerified: userData.isEmailVerified,
      },
    });

    seededCount++;
    console.log(
      `✅ Created/Updated user: ${userData.email} with role: ${userData.roleName}`
    );
  }

  console.log(`✅ Seeded ${seededCount} users`);
}

export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
          description: true,
        },
      },
    },
  });
}
