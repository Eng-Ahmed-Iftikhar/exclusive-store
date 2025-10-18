const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create customer role
  console.log('📝 Creating customer role...');
  
  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: {
      name: 'customer',
      displayName: 'Customer',
      description: 'Customer role for e-commerce users',
      isSystem: true,
      isActive: true,
      createdBy: null,
    },
  });

  console.log('✅ Customer role created:', customerRole);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
