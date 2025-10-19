import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CategoryData {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export const categories: CategoryData[] = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    sortOrder: 1,
  },
  {
    name: 'Clothing & Fashion',
    slug: 'clothing-fashion',
    description: 'Apparel and fashion accessories',
    sortOrder: 2,
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and garden supplies',
    sortOrder: 3,
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    sortOrder: 4,
  },
  {
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, and digital media',
    sortOrder: 5,
  },
  {
    name: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Health products and beauty supplies',
    sortOrder: 6,
  },
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car parts and automotive accessories',
    sortOrder: 7,
  },
  {
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Toys, games, and entertainment',
    sortOrder: 8,
  },
  {
    name: 'Food & Beverages',
    slug: 'food-beverages',
    description: 'Food items and beverages',
    sortOrder: 9,
  },
  {
    name: 'Jewelry & Watches',
    slug: 'jewelry-watches',
    description: 'Fine jewelry and timepieces',
    sortOrder: 10,
  },
  {
    name: 'Office Supplies',
    slug: 'office-supplies',
    description: 'Office equipment and supplies',
    sortOrder: 11,
  },
  {
    name: 'Pet Supplies',
    slug: 'pet-supplies',
    description: 'Pet food, toys, and accessories',
    sortOrder: 12,
  },
  {
    name: 'Baby & Kids',
    slug: 'baby-kids',
    description: "Baby products and children's items",
    sortOrder: 13,
  },
  {
    name: 'Travel & Luggage',
    slug: 'travel-luggage',
    description: 'Travel accessories and luggage',
    sortOrder: 14,
  },
  {
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    description: 'Musical instruments and accessories',
    sortOrder: 15,
  },
  {
    name: 'Art & Crafts',
    slug: 'art-crafts',
    description: 'Art supplies and craft materials',
    sortOrder: 16,
  },
  {
    name: 'Industrial & Scientific',
    slug: 'industrial-scientific',
    description: 'Industrial equipment and scientific tools',
    sortOrder: 17,
  },
  {
    name: 'Garden & Outdoor',
    slug: 'garden-outdoor',
    description: 'Garden tools and outdoor furniture',
    sortOrder: 18,
  },
  {
    name: 'Collectibles',
    slug: 'collectibles',
    description: 'Collectible items and memorabilia',
    sortOrder: 19,
  },
  {
    name: 'Digital Services',
    slug: 'digital-services',
    description: 'Digital products and online services',
    sortOrder: 20,
  },
];

export async function seedCategories(): Promise<void> {
  console.log('📂 Seeding categories...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  console.log(`✅ Seeded ${categories.length} categories`);
}

export async function getCategories() {
  return await prisma.category.findMany();
}
