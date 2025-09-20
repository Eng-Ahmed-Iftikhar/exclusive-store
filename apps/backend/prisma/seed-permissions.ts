import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPermissionsAndRoles() {
  console.log('🌱 Seeding permissions and roles...');

  // Create resources
  const resources = [
    {
      name: 'teams',
      displayName: 'Teams Management',
      description: 'Manage teams and team members',
    },
    {
      name: 'roles',
      displayName: 'Roles Management',
      description: 'Manage user roles and permissions',
    },
    {
      name: 'permissions',
      displayName: 'Permissions Management',
      description: 'Manage system permissions',
    },
    {
      name: 'resources',
      displayName: 'Resources Management',
      description: 'Manage system resources',
    },
    {
      name: 'users',
      displayName: 'User Management',
      description: 'Manage users and user accounts',
    },
    {
      name: 'items',
      displayName: 'Items Management',
      description: 'Manage products and items',
    },
    {
      name: 'orders',
      displayName: 'Orders Management',
      description: 'Manage orders and transactions',
    },
    {
      name: 'files',
      displayName: 'Files Management',
      description: 'Manage files and media uploads',
    },
    {
      name: 'categories',
      displayName: 'Categories Management',
      description: 'Manage product categories and subcategories',
    },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { name: resource.name },
      update: resource,
      create: resource,
    });
  }

  // Create permissions
  const permissions = [
    { name: 'view', displayName: 'View', description: 'View/list items' },
    { name: 'create', displayName: 'Create', description: 'Create new items' },
    {
      name: 'update',
      displayName: 'Update',
      description: 'Update existing items',
    },
    { name: 'delete', displayName: 'Delete', description: 'Delete items' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: permission,
    });
  }

  // Get all resources and permissions
  const allResources = await prisma.resource.findMany();
  const allPermissions = await prisma.permission.findMany();

  // Create superadmin role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {
      displayName: 'Super Administrator',
      description: 'Full system access with all permissions',
      isSystem: true,
      isActive: true,
    },
    create: {
      name: 'superadmin',
      displayName: 'Super Administrator',
      description: 'Full system access with all permissions',
      isSystem: true,
      isActive: true,
      createdBy: 'system', // This will be updated when we have a system user
    },
  });

  // Create admin role
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      displayName: 'Administrator',
      description: 'Administrative access to most system features',
      isSystem: true,
      isActive: true,
    },
    create: {
      name: 'admin',
      displayName: 'Administrator',
      description: 'Administrative access to most system features',
      isSystem: true,
      isActive: true,
      createdBy: 'system',
    },
  });

  // Create user role
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {
      displayName: 'User',
      description: 'Basic user access',
      isSystem: true,
      isActive: true,
    },
    create: {
      name: 'user',
      displayName: 'User',
      description: 'Basic user access',
      isSystem: true,
      isActive: true,
      createdBy: 'system',
    },
  });

  // Assign all permissions to superadmin
  for (const resource of allResources) {
    for (const permission of allPermissions) {
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

  // Assign limited permissions to admin (everything except superadmin functions)
  const adminResources = allResources.filter(
    (r) => r.name !== 'permissions' && r.name !== 'resources'
  );
  for (const resource of adminResources) {
    for (const permission of allPermissions) {
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

  // Assign basic permissions to user (view only for most resources)
  const userResources = allResources.filter((r) =>
    ['items', 'orders'].includes(r.name)
  );
  for (const resource of userResources) {
    const viewPermission = allPermissions.find((p) => p.name === 'view');
    if (viewPermission) {
      await prisma.roleResource.upsert({
        where: {
          roleId_resourceId_permissionId: {
            roleId: userRole.id,
            resourceId: resource.id,
            permissionId: viewPermission.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          resourceId: resource.id,
          permissionId: viewPermission.id,
        },
      });
    }
  }

  console.log('✅ Permissions and roles seeded successfully!');
  console.log(`📊 Created ${allResources.length} resources`);
  console.log(`📊 Created ${allPermissions.length} permissions`);
  console.log(`📊 Created 3 roles: superadmin, admin, user`);
}

async function main() {
  try {
    await seedPermissionsAndRoles();
  } catch (error) {
    console.error('❌ Error seeding permissions and roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedPermissionsAndRoles };
