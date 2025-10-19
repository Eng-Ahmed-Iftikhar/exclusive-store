import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export interface VariantData {
  name: string;
  sku: string;
  attributes: Record<string, any>;
  isDefault: boolean;
  sortOrder: number;
  prices: {
    price: number;
    salePrice?: number;
    currency: string;
  }[];
  stock: {
    quantity: number;
    reserved: number;
    minThreshold: number;
    maxThreshold?: number;
  };
}

// Variant templates for different product types
const variantTemplates: Record<string, VariantData[]> = {
  // Electronics - Smartphones
  smartphones: [
    {
      name: '128GB - Space Black',
      sku: '',
      attributes: { storage: '128GB', color: 'Space Black' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
    {
      name: '256GB - Space Black',
      sku: '',
      attributes: { storage: '256GB', color: 'Space Black' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
    {
      name: '512GB - Space Black',
      sku: '',
      attributes: { storage: '512GB', color: 'Space Black' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
  ],

  // Electronics - Laptops
  laptops: [
    {
      name: '8GB RAM - 256GB SSD',
      sku: '',
      attributes: { ram: '8GB', storage: '256GB SSD', color: 'Silver' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 3, maxThreshold: 50 },
    },
    {
      name: '16GB RAM - 512GB SSD',
      sku: '',
      attributes: { ram: '16GB', storage: '512GB SSD', color: 'Silver' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 3, maxThreshold: 50 },
    },
    {
      name: '32GB RAM - 1TB SSD',
      sku: '',
      attributes: { ram: '32GB', storage: '1TB SSD', color: 'Silver' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 3, maxThreshold: 50 },
    },
  ],

  // Electronics - Tablets
  tablets: [
    {
      name: '64GB - Wi-Fi',
      sku: '',
      attributes: {
        storage: '64GB',
        connectivity: 'Wi-Fi',
        color: 'Space Gray',
      },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 75 },
    },
    {
      name: '256GB - Wi-Fi',
      sku: '',
      attributes: {
        storage: '256GB',
        connectivity: 'Wi-Fi',
        color: 'Space Gray',
      },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 75 },
    },
    {
      name: '256GB - Wi-Fi + Cellular',
      sku: '',
      attributes: {
        storage: '256GB',
        connectivity: 'Wi-Fi + Cellular',
        color: 'Space Gray',
      },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 75 },
    },
  ],

  // Clothing & Fashion
  clothing: [
    {
      name: 'Small - Black',
      sku: '',
      attributes: { size: 'S', color: 'Black' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 200 },
    },
    {
      name: 'Medium - Black',
      sku: '',
      attributes: { size: 'M', color: 'Black' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 200 },
    },
    {
      name: 'Large - Black',
      sku: '',
      attributes: { size: 'L', color: 'Black' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 200 },
    },
  ],

  // Shoes
  shoes: [
    {
      name: 'Size 8 - Black',
      sku: '',
      attributes: { size: '8', color: 'Black' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
    {
      name: 'Size 9 - Black',
      sku: '',
      attributes: { size: '9', color: 'Black' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
    {
      name: 'Size 10 - Black',
      sku: '',
      attributes: { size: '10', color: 'Black' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
  ],

  // Home & Garden
  home: [
    {
      name: 'Standard Size',
      sku: '',
      attributes: { size: 'Standard', material: 'Wood', color: 'Natural' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 3, maxThreshold: 50 },
    },
    {
      name: 'Large Size',
      sku: '',
      attributes: { size: 'Large', material: 'Wood', color: 'Natural' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 3, maxThreshold: 50 },
    },
    {
      name: 'Premium Size',
      sku: '',
      attributes: { size: 'Premium', material: 'Wood', color: 'Natural' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 3, maxThreshold: 50 },
    },
  ],

  // Sports & Outdoors
  sports: [
    {
      name: 'Regular - Blue',
      sku: '',
      attributes: { size: 'Regular', color: 'Blue', material: 'Polyester' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
    {
      name: 'Large - Blue',
      sku: '',
      attributes: { size: 'Large', color: 'Blue', material: 'Polyester' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
    {
      name: 'XL - Blue',
      sku: '',
      attributes: { size: 'XL', color: 'Blue', material: 'Polyester' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
  ],

  // Books & Media
  books: [
    {
      name: 'Paperback',
      sku: '',
      attributes: { format: 'Paperback', language: 'English' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 500 },
    },
    {
      name: 'Hardcover',
      sku: '',
      attributes: { format: 'Hardcover', language: 'English' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 500 },
    },
    {
      name: 'Digital',
      sku: '',
      attributes: { format: 'Digital', language: 'English' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 500 },
    },
  ],

  // Health & Beauty
  beauty: [
    {
      name: '50ml',
      sku: '',
      attributes: { size: '50ml', type: 'Standard' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 200 },
    },
    {
      name: '100ml',
      sku: '',
      attributes: { size: '100ml', type: 'Standard' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 200 },
    },
    {
      name: '150ml',
      sku: '',
      attributes: { size: '150ml', type: 'Standard' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 10, maxThreshold: 200 },
    },
  ],

  // Default template for other categories
  default: [
    {
      name: 'Standard',
      sku: '',
      attributes: { type: 'Standard', color: 'Default' },
      isDefault: true,
      sortOrder: 0,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
    {
      name: 'Premium',
      sku: '',
      attributes: { type: 'Premium', color: 'Default' },
      isDefault: false,
      sortOrder: 1,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
    {
      name: 'Deluxe',
      sku: '',
      attributes: { type: 'Deluxe', color: 'Default' },
      isDefault: false,
      sortOrder: 2,
      prices: [{ price: 0, currency: 'USD' }],
      stock: { quantity: 0, reserved: 0, minThreshold: 5, maxThreshold: 100 },
    },
  ],
};

// Function to get variant template based on subcategory
function getVariantTemplate(subcategorySlug: string): VariantData[] {
  // Map subcategory slugs to variant templates
  if (
    subcategorySlug.includes('smartphone') ||
    subcategorySlug.includes('phone')
  ) {
    return variantTemplates.smartphones;
  } else if (
    subcategorySlug.includes('laptop') ||
    subcategorySlug.includes('notebook')
  ) {
    return variantTemplates.laptops;
  } else if (
    subcategorySlug.includes('tablet') ||
    subcategorySlug.includes('ipad')
  ) {
    return variantTemplates.tablets;
  } else if (
    subcategorySlug.includes('shirt') ||
    subcategorySlug.includes('dress') ||
    subcategorySlug.includes('jacket') ||
    subcategorySlug.includes('pants')
  ) {
    return variantTemplates.clothing;
  } else if (
    subcategorySlug.includes('shoe') ||
    subcategorySlug.includes('sneaker') ||
    subcategorySlug.includes('boot')
  ) {
    return variantTemplates.shoes;
  } else if (
    subcategorySlug.includes('furniture') ||
    subcategorySlug.includes('chair') ||
    subcategorySlug.includes('table') ||
    subcategorySlug.includes('sofa')
  ) {
    return variantTemplates.home;
  } else if (
    subcategorySlug.includes('sport') ||
    subcategorySlug.includes('fitness') ||
    subcategorySlug.includes('outdoor')
  ) {
    return variantTemplates.sports;
  } else if (
    subcategorySlug.includes('book') ||
    subcategorySlug.includes('magazine') ||
    subcategorySlug.includes('media')
  ) {
    return variantTemplates.books;
  } else if (
    subcategorySlug.includes('beauty') ||
    subcategorySlug.includes('cosmetic') ||
    subcategorySlug.includes('skincare')
  ) {
    return variantTemplates.beauty;
  } else {
    return variantTemplates.default;
  }
}

export async function seedVariants() {
  console.log('🌱 Seeding product variants...');

  // Get all products with their subcategories
  const products = await prisma.product.findMany({
    include: {
      subcategory: true,
      prices: true,
    },
  });

  let seededCount = 0;
  let priceCount = 0;
  let stockCount = 0;

  for (const product of products) {
    // Get variant template based on subcategory
    const variantTemplate = getVariantTemplate(product.subcategory?.slug || '');

    // Create variants for this product
    for (let i = 0; i < variantTemplate.length; i++) {
      const template = variantTemplate[i];

      // Generate unique SKU for variant
      const variantSku = `${product.sku}-${String(i + 1).padStart(2, '0')}`;

      // Calculate variant pricing (base price + variation)
      const basePrice = product.prices[0]?.price || 0;
      const priceVariation = faker.number.float({
        min: 0.8,
        max: 1.5,
        fractionDigits: 2,
      });
      const variantPrice = Number(basePrice) * priceVariation;
      const variantSalePrice = template.prices[0].salePrice
        ? Number(basePrice) * priceVariation * 0.8
        : undefined;

      // Create variant
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: variantSku,
          name: template.name,
          attributes: template.attributes,
          isDefault: template.isDefault,
          isActive: true,
          sortOrder: template.sortOrder,
        },
      });

      // Create prices for variant
      await prisma.price.create({
        data: {
          variantId: variant.id,
          price: variantPrice,
          salePrice: variantSalePrice,
          currency: 'USD',
        },
      });
      priceCount++;

      // Create stock for variant
      await prisma.stock.create({
        data: {
          variantId: variant.id,
          quantity:
            template.stock.quantity + faker.number.int({ min: 0, max: 50 }),
          reserved: template.stock.reserved,
          minThreshold: template.stock.minThreshold,
          maxThreshold: template.stock.maxThreshold,
          isInStock: true,
        },
      });
      stockCount++;

      seededCount++;
    }
  }

  console.log(
    `✅ Seeded ${seededCount} variants with ${priceCount} variant prices and ${stockCount} stock entries`
  );
}

export async function getVariants() {
  return await prisma.productVariant.findMany({
    include: {
      product: {
        include: {
          category: true,
          subcategory: true,
        },
      },
      prices: true,
      stock: true,
    },
  });
}
