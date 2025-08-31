import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default roles
  console.log('📝 Creating default roles...');

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      displayName: 'User',
      description: 'Standard user with basic permissions',
      isSystem: true,
      isActive: true,
      createdBy: 'system', // We'll update this later
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'Admin',
      description: 'Administrator with elevated permissions',
      isSystem: true,
      isActive: true,
      createdBy: 'system', // We'll update this later
    },
  });

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {},
    create: {
      name: 'superadmin',
      displayName: 'Super Admin',
      description: 'Super administrator with full system access',
      isSystem: true,
      isActive: true,
      createdBy: 'system', // We'll update this later
    },
  });

  console.log('✅ Default roles created:', {
    userRole,
    adminRole,
    superAdminRole,
  });

  // Create default resources
  console.log('🔧 Creating default resources...');

  const customerResource = await prisma.resource.upsert({
    where: { name: 'customer' },
    update: {},
    create: {
      name: 'customer',
      displayName: 'Customer Management',
      description: 'Manage customer data and relationships',
      isActive: true,
    },
  });

  const orderResource = await prisma.resource.upsert({
    where: { name: 'order' },
    update: {},
    create: {
      name: 'order',
      displayName: 'Order Management',
      description: 'Manage orders and order processing',
      isActive: true,
    },
  });

  const productResource = await prisma.resource.upsert({
    where: { name: 'product' },
    update: {},
    create: {
      name: 'product',
      displayName: 'Product Management',
      description: 'Manage product catalog and inventory',
      isActive: true,
    },
  });

  const userResource = await prisma.resource.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      displayName: 'User Management',
      description: 'Manage system users and accounts',
      isActive: true,
    },
  });

  const roleResource = await prisma.resource.upsert({
    where: { name: 'role' },
    update: {},
    create: {
      name: 'role',
      displayName: 'Role Management',
      description: 'Manage system roles and permissions',
      isActive: true,
    },
  });

  const teamResource = await prisma.resource.upsert({
    where: { name: 'team' },
    update: {},
    create: {
      name: 'team',
      displayName: 'Team Management',
      description: 'Manage teams and team assignments',
      isActive: true,
    },
  });

  console.log('✅ Default resources created');

  // Create default permissions
  console.log('🔐 Creating default permissions...');

  const viewPermission = await prisma.permission.upsert({
    where: { name: 'view' },
    update: {},
    create: {
      name: 'view',
      displayName: 'View',
      description: 'View data and information',
      isActive: true,
    },
  });

  const createPermission = await prisma.permission.upsert({
    where: { name: 'create' },
    update: {},
    create: {
      name: 'create',
      displayName: 'Create',
      description: 'Create new data and records',
      isActive: true,
    },
  });

  const editPermission = await prisma.permission.upsert({
    where: { name: 'edit' },
    update: {},
    create: {
      name: 'edit',
      displayName: 'Edit',
      description: 'Edit existing data and records',
      isActive: true,
    },
  });

  const deletePermission = await prisma.permission.upsert({
    where: { name: 'delete' },
    update: {},
    create: {
      name: 'delete',
      displayName: 'Delete',
      description: 'Delete data and records',
      isActive: true,
    },
  });

  console.log('✅ Default permissions created');

  // Create role-resource-permission mappings
  console.log('🔗 Creating role-resource-permission mappings...');

  // User role permissions (basic access)
  await prisma.roleResource.upsert({
    where: {
      roleId_resourceId_permissionId: {
        roleId: userRole.id,
        resourceId: customerResource.id,
        permissionId: viewPermission.id,
      },
    },
    update: {},
    create: {
      roleId: userRole.id,
      resourceId: customerResource.id,
      permissionId: viewPermission.id,
    },
  });

  await prisma.roleResource.upsert({
    where: {
      roleId_resourceId_permissionId: {
        roleId: userRole.id,
        resourceId: orderResource.id,
        permissionId: viewPermission.id,
      },
    },
    update: {},
    create: {
      roleId: userRole.id,
      resourceId: orderResource.id,
      permissionId: viewPermission.id,
    },
  });

  await prisma.roleResource.upsert({
    where: {
      roleId_resourceId_permissionId: {
        roleId: userRole.id,
        resourceId: productResource.id,
        permissionId: viewPermission.id,
      },
    },
    update: {},
    create: {
      roleId: userRole.id,
      resourceId: productResource.id,
      permissionId: viewPermission.id,
    },
  });

  // Admin role permissions (elevated access)
  await prisma.roleResource.upsert({
    where: {
      roleId_resourceId_permissionId: {
        roleId: adminRole.id,
        resourceId: customerResource.id,
        permissionId: viewPermission.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      resourceId: customerResource.id,
      permissionId: viewPermission.id,
    },
  });

  await prisma.roleResource.upsert({
    where: {
      roleId_resourceId_permissionId: {
        roleId: adminRole.id,
        resourceId: customerResource.id,
        permissionId: createPermission.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      resourceId: customerResource.id,
      permissionId: createPermission.id,
    },
  });

  await prisma.roleResource.upsert({
    where: {
      roleId_resourceId_permissionId: {
        roleId: adminRole.id,
        resourceId: customerResource.id,
        permissionId: editPermission.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      resourceId: customerResource.id,
      permissionId: editPermission.id,
    },
  });

  // Super Admin role permissions (full access to everything)
  const allResources = [
    customerResource,
    orderResource,
    productResource,
    userResource,
    roleResource,
    teamResource,
  ];
  const allPermissions = [
    viewPermission,
    createPermission,
    editPermission,
    deletePermission,
  ];

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

  console.log('✅ Role-resource-permission mappings created');

  // Update existing user to have super admin role
  console.log('👤 Updating existing user with super admin role...');

  const existingUser = await prisma.user.findFirst({
    where: { email: 'admin@exclusive.com' },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { roleId: superAdminRole.id },
    });
    console.log('✅ Existing user updated with super admin role');
  } else {
    console.log('⚠️  No existing user found with admin@exclusive.com email');
  }

  // Update role creators to point to the existing user
  if (existingUser) {
    await prisma.role.updateMany({
      where: { createdBy: 'system' },
      data: { createdBy: existingUser.id },
    });
    console.log('✅ Role creators updated');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
