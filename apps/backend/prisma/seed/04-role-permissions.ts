import { PrismaClient } from '@prisma/client';
import { getPermissions } from './01-permissions';
import { getResources } from './02-resources';
import { getRoles } from './03-roles';

const prisma = new PrismaClient();

export async function seedRolePermissions(): Promise<void> {
  console.log('🔗 Seeding role-resource-permission mappings...');

  // Get all seeded data
  const permissions = await getPermissions();
  const resources = await getResources();
  const roles = await getRoles();

  // Find specific roles
  const superAdminRole = roles.find((role) => role.name === 'super-admin');
  const adminRole = roles.find((role) => role.name === 'admin');

  if (!superAdminRole || !adminRole) {
    throw new Error(
      'Required roles not found. Make sure roles are seeded first.'
    );
  }

  // Super Admin gets all permissions for all resources
  console.log('📋 Assigning all permissions to super-admin role...');
  for (const resource of resources) {
    for (const permission of permissions) {
      await prisma.roleResource.upsert({
        where: {
          roleId_resourceId_permissionId: {
            roleId: superAdminRole.id,
            resourceId: resource.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: superAdminRole.id,
          resourceId: resource.id,
          permissionId: permission.id,
        },
      });
    }
  }

  // Admin gets all permissions for product and category resources only
  console.log('📋 Assigning limited permissions to admin role...');
  const adminResources = resources.filter((resource) =>
    ['product', 'category'].includes(resource.name)
  );

  for (const resource of adminResources) {
    for (const permission of permissions) {
      await prisma.roleResource.upsert({
        where: {
          roleId_resourceId_permissionId: {
            roleId: adminRole.id,
            resourceId: resource.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          resourceId: resource.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const totalMappings =
    resources.length * permissions.length +
    adminResources.length * permissions.length;
  console.log(`✅ Seeded ${totalMappings} role-resource-permission mappings`);
}
