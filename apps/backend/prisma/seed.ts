import { PrismaClient } from '@prisma/client';
import { seedPermissions } from './seed/01-permissions';
import { seedResources } from './seed/02-resources';
import { seedRoles } from './seed/03-roles';
import { seedRolePermissions } from './seed/04-role-permissions';
import { seedCategories } from './seed/05-categories';
import { seedSubcategories } from './seed/06-subcategories';
import { seedProducts } from './seed/07-products';
import { seedVariants } from './seed/08-variants';
import { seedUsers } from './seed/09-users';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');
  console.log('=====================================');

  try {
    // Step 1: Seed permissions (create, update, view, delete)
    await seedPermissions();
    console.log('');

    // Step 2: Seed resources (product, category, permission, role, resource)
    await seedResources();
    console.log('');

    // Step 3: Seed roles (super-admin, admin)
    await seedRoles();
    console.log('');

    // Step 4: Link resources and permissions with roles
    await seedRolePermissions();
    console.log('');

    // Step 5: Seed categories (20 categories)
    await seedCategories();
    console.log('');

    // Step 6: Seed subcategories (10 per category = 200 subcategories)
    await seedSubcategories();
    console.log('');

    // Step 7: Seed products (10 per subcategory = 2000 products)
    await seedProducts();
    console.log('');

    // Step 8: Seed product variants (3 per product = 6000 variants)
    await seedVariants();
    console.log('');

    // Step 9: Seed admin users (super-admin and admin)
    await seedUsers();
    console.log('');

    console.log('=====================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('   • 4 permissions created');
    console.log('   • 5 resources created');
    console.log('   • 2 roles created');
    console.log('   • Role-permission mappings created');
    console.log('   • 20 categories created');
    console.log('   • 200 subcategories created');
    console.log('   • 2000 products created with pricing and stock');
    console.log('   • 6000 product variants created with pricing and stock');
    console.log(
      '   • 8000 total stock entries (2000 products + 6000 variants)'
    );
    console.log('   • 2 admin users created (super-admin and admin)');
    console.log('');
    console.log('✅ Your database is now ready for use!');
    console.log('');
    console.log('🔐 Admin Login Credentials:');
    console.log('   Super Admin: superadmin@exclusive.com / superadmin123');
    console.log('   Admin: admin@exclusive.com / admin123');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  main().catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
}

export { main as seedDatabase };
