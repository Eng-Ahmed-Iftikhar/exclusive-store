import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedActivities() {
  console.log('Seeding activities...');

  // Sample activities
  const activities = [
    {
      type: 'order',
      title: 'New Order Received',
      description: 'Order #12345 from John Doe',
      metadata: { orderId: '12345', total: 299.99 },
      userId: null,
    },
    {
      type: 'user',
      title: 'New User Registration',
      description: 'Sarah Wilson joined the platform',
      metadata: { action: 'registration' },
      userId: null,
    },
    {
      type: 'payment',
      title: 'Payment Processed',
      description: 'Payment for Order #12344 completed',
      metadata: { paymentId: '12344', amount: 149.50 },
      userId: null,
    },
    {
      type: 'product',
      title: 'Product Updated',
      description: 'iPhone 15 Pro stock updated',
      metadata: { productId: 'iphone-15-pro', action: 'stock_update' },
      userId: null,
    },
    {
      type: 'revenue',
      title: 'Daily Revenue Target',
      description: 'Target of $5,000 reached',
      metadata: { amount: 5234.67 },
      userId: null,
    },
    {
      type: 'system',
      title: 'System Maintenance',
      description: 'Database optimization completed',
      metadata: { action: 'maintenance' },
      userId: null,
    },
  ];

  for (const activity of activities) {
    await prisma.activity.create({
      data: activity,
    });
  }

  console.log('Activities seeded successfully!');
}

seedActivities()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
