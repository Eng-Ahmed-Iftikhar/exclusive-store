import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  // Create categories with subcategories
  const categories = [
    {
      name: "Woman's Fashion",
      slug: "womans-fashion",
      description: "Trendy and stylish women's clothing and accessories",
      image: "https://picsum.photos/400/300?random=1",
      icon: "mdi-dress",
      sortOrder: 1,
      subcategories: [
        { name: "Dresses", slug: "dresses", description: "Elegant dresses for every occasion", icon: "mdi-dress", sortOrder: 1 },
        { name: "Tops", slug: "tops", description: "Stylish tops and blouses", icon: "mdi-tshirt-crew", sortOrder: 2 },
        { name: "Bottoms", slug: "bottoms", description: "Comfortable pants, skirts, and shorts", icon: "mdi-pants", sortOrder: 3 },
        { name: "Outerwear", slug: "outerwear", description: "Coats, jackets, and sweaters", icon: "mdi-coat-rack", sortOrder: 4 },
        { name: "Accessories", slug: "accessories", description: "Jewelry, bags, and fashion accessories", icon: "mdi-handbag", sortOrder: 5 }
      ]
    },
    {
      name: "Men's Fashion",
      slug: "mens-fashion",
      description: "Modern and classic men's clothing and accessories",
      image: "https://picsum.photos/400/300?random=2",
      icon: "mdi-account-tie",
      sortOrder: 2,
      subcategories: [
        { name: "Shirts", slug: "shirts", description: "Casual and formal shirts", icon: "mdi-tshirt-crew", sortOrder: 1 },
        { name: "Pants", slug: "pants", description: "Jeans, trousers, and casual pants", icon: "mdi-pants", sortOrder: 2 },
        { name: "Suits", slug: "suits", description: "Professional suits and formal wear", icon: "mdi-account-tie", sortOrder: 3 },
        { name: "Casual Wear", slug: "casual-wear", description: "Comfortable casual clothing", icon: "mdi-tshirt-crew", sortOrder: 4 },
        { name: "Accessories", slug: "mens-accessories", description: "Watches, belts, and men's accessories", icon: "mdi-watch", sortOrder: 5 }
      ]
    },
    {
      name: "Electronics",
      slug: "electronics",
      description: "Latest gadgets and electronic devices",
      image: "https://picsum.photos/400/300?random=3",
      icon: "mdi-laptop",
      sortOrder: 3,
      subcategories: [
        { name: "Smartphones", slug: "smartphones", description: "Latest mobile phones and accessories", icon: "mdi-cellphone", sortOrder: 1 },
        { name: "Laptops", slug: "laptops", description: "High-performance laptops and computers", icon: "mdi-laptop", sortOrder: 2 },
        { name: "Tablets", slug: "tablets", description: "Portable tablets and e-readers", icon: "mdi-tablet", sortOrder: 3 },
        { name: "Audio", slug: "audio", description: "Headphones, speakers, and audio equipment", icon: "mdi-headphones", sortOrder: 4 },
        { name: "Gaming", slug: "gaming", description: "Gaming consoles, games, and accessories", icon: "mdi-gamepad-variant", sortOrder: 5 }
      ]
    },
    {
      name: "Home & Lifestyle",
      slug: "home-lifestyle",
      description: "Everything you need for a beautiful home",
      image: "https://picsum.photos/400/300?random=4",
      icon: "mdi-home",
      sortOrder: 4,
      subcategories: [
        { name: "Furniture", slug: "furniture", description: "Modern and classic furniture pieces", icon: "mdi-sofa", sortOrder: 1 },
        { name: "Decor", slug: "decor", description: "Home decoration and wall art", icon: "mdi-palette", sortOrder: 2 },
        { name: "Kitchen", slug: "kitchen", description: "Kitchen appliances and cookware", icon: "mdi-silverware-fork-knife", sortOrder: 3 },
        { name: "Bedding", slug: "bedding", description: "Comfortable bedding and linens", icon: "mdi-bed", sortOrder: 4 },
        { name: "Lighting", slug: "lighting", description: "Beautiful lighting solutions", icon: "mdi-lightbulb", sortOrder: 5 }
      ]
    },
    {
      name: "Sports & Outdoor",
      slug: "sports-outdoor",
      description: "Equipment and gear for sports and outdoor activities",
      image: "https://picsum.photos/400/300?random=5",
      icon: "mdi-basketball",
      sortOrder: 5,
      subcategories: [
        { name: "Fitness", slug: "fitness", description: "Gym equipment and fitness gear", icon: "mdi-dumbbell", sortOrder: 1 },
        { name: "Outdoor Gear", slug: "outdoor-gear", description: "Camping and hiking equipment", icon: "mdi-tent", sortOrder: 2 },
        { name: "Team Sports", slug: "team-sports", description: "Equipment for team sports", icon: "mdi-soccer", sortOrder: 3 },
        { name: "Swimming", slug: "swimming", description: "Swimming gear and accessories", icon: "mdi-swim", sortOrder: 4 },
        { name: "Hiking", slug: "hiking", description: "Hiking boots and outdoor clothing", icon: "mdi-hiking", sortOrder: 5 }
      ]
    },
    {
      name: "Health & Beauty",
      slug: "health-beauty",
      description: "Products for health, beauty, and personal care",
      image: "https://picsum.photos/400/300?random=6",
      icon: "mdi-spa",
      sortOrder: 6,
      subcategories: [
        { name: "Skincare", slug: "skincare", description: "Facial and body skincare products", icon: "mdi-face-woman", sortOrder: 1 },
        { name: "Makeup", slug: "makeup", description: "Professional makeup and cosmetics", icon: "mdi-palette-swatch", sortOrder: 2 },
        { name: "Hair Care", slug: "hair-care", description: "Hair products and styling tools", icon: "mdi-hair-dryer", sortOrder: 3 },
        { name: "Fragrances", slug: "fragrances", description: "Perfumes and colognes", icon: "mdi-spray", sortOrder: 4 },
        { name: "Tools", slug: "beauty-tools", description: "Beauty tools and accessories", icon: "mdi-mirror", sortOrder: 5 }
      ]
    }
  ];

  for (const categoryData of categories) {
    const { subcategories, ...categoryInfo } = categoryData;
    
    const category = await prisma.category.create({
      data: categoryInfo,
    });

    console.log(`✅ Created category: ${category.name}`);

    // Create subcategories for this category
    for (const subcategoryData of subcategories) {
      await prisma.subcategory.create({
        data: {
          ...subcategoryData,
          categoryId: category.id,
        },
      });
      console.log(`  └─ Created subcategory: ${subcategoryData.name}`);
    }
  }

  console.log('\n🛍️  Creating sample items...');

  // Create sample items for each category
  const items = [
    // Women's Fashion Items
    {
      name: "Elegant Summer Dress",
      description: "A beautiful floral summer dress perfect for any occasion",
      sku: "WF-DRESS-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "womans-fashion" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "dresses" } }))?.id,
      isFeatured: true,
      sortOrder: 1,
      prices: [
        { price: 89.99, salePrice: 69.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 50, reserved: 5, minThreshold: 10, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=1", altText: "Summer Dress Front View", isPrimary: true, sortOrder: 1 },
        { url: "https://picsum.photos/400/300?random=2", altText: "Summer Dress Back View", isPrimary: false, sortOrder: 2 }
      ]
    },
    {
      name: "Classic White Blouse",
      description: "A versatile white blouse that goes with everything",
      sku: "WF-TOP-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "womans-fashion" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "tops" } }))?.id,
      isFeatured: false,
      sortOrder: 2,
      prices: [
        { price: 45.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 75, reserved: 3, minThreshold: 15, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=3", altText: "White Blouse Front View", isPrimary: true, sortOrder: 1 }
      ]
    },

    // Men's Fashion Items
    {
      name: "Premium Cotton Shirt",
      description: "High-quality cotton shirt for professional and casual wear",
      sku: "MF-SHIRT-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "mens-fashion" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "shirts" } }))?.id,
      isFeatured: true,
      sortOrder: 1,
      prices: [
        { price: 65.99, salePrice: 49.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 60, reserved: 8, minThreshold: 12, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=4", altText: "Cotton Shirt Front View", isPrimary: true, sortOrder: 1 },
        { url: "https://picsum.photos/400/300?random=5", altText: "Cotton Shirt Back View", isPrimary: false, sortOrder: 2 }
      ]
    },
    {
      name: "Slim Fit Jeans",
      description: "Modern slim fit jeans with stretch comfort",
      sku: "MF-PANTS-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "mens-fashion" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "pants" } }))?.id,
      isFeatured: false,
      sortOrder: 2,
      prices: [
        { price: 79.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 40, reserved: 2, minThreshold: 8, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=6", altText: "Slim Fit Jeans Front View", isPrimary: true, sortOrder: 1 }
      ]
    },

    // Electronics Items
    {
      name: "Wireless Bluetooth Headphones",
      description: "Premium wireless headphones with noise cancellation",
      sku: "EL-AUDIO-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "electronics" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "audio" } }))?.id,
      isFeatured: true,
      sortOrder: 1,
      prices: [
        { price: 199.99, salePrice: 149.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 25, reserved: 3, minThreshold: 5, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=10", altText: "Wireless Headphones", isPrimary: true, sortOrder: 1 },
        { url: "https://picsum.photos/400/300?random=11", altText: "Headphones Side View", isPrimary: false, sortOrder: 2 }
      ]
    },
    {
      name: "Gaming Laptop",
      description: "High-performance gaming laptop with RTX graphics",
      sku: "EL-LAPTOP-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "electronics" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "laptops" } }))?.id,
      isFeatured: true,
      sortOrder: 2,
      prices: [
        { price: 1299.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 15, reserved: 1, minThreshold: 3, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=12", altText: "Gaming Laptop Front View", isPrimary: true, sortOrder: 1 }
      ]
    },

    // Home & Lifestyle Items
    {
      name: "Modern Coffee Table",
      description: "Elegant wooden coffee table for your living room",
      sku: "HL-FURNITURE-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "home-lifestyle" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "furniture" } }))?.id,
      isFeatured: false,
      sortOrder: 1,
      prices: [
        { price: 299.99, salePrice: 249.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 20, reserved: 2, minThreshold: 4, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=13", altText: "Coffee Table Front View", isPrimary: true, sortOrder: 1 }
      ]
    },
    {
      name: "LED Floor Lamp",
      description: "Contemporary LED floor lamp with adjustable brightness",
      sku: "HL-LIGHTING-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "home-lifestyle" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "lighting" } }))?.id,
      isFeatured: true,
      sortOrder: 2,
      prices: [
        { price: 89.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 35, reserved: 4, minThreshold: 7, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=14", altText: "LED Floor Lamp", isPrimary: true, sortOrder: 1 }
      ]
    },

    // Sports & Outdoor Items
    {
      name: "Yoga Mat Premium",
      description: "Non-slip yoga mat perfect for home workouts",
      sku: "SO-FITNESS-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "sports-outdoor" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "fitness" } }))?.id,
      isFeatured: false,
      sortOrder: 1,
      prices: [
        { price: 39.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 100, reserved: 10, minThreshold: 20, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=15", altText: "Yoga Mat", isPrimary: true, sortOrder: 1 }
      ]
    },
    {
      name: "Hiking Backpack",
      description: "Durable hiking backpack with multiple compartments",
      sku: "SO-OUTDOOR-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "sports-outdoor" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "outdoor-gear" } }))?.id,
      isFeatured: true,
      sortOrder: 2,
      prices: [
        { price: 129.99, salePrice: 99.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 30, reserved: 2, minThreshold: 6, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=16", altText: "Hiking Backpack Front View", isPrimary: true, sortOrder: 1 }
      ]
    },

    // Health & Beauty Items
    {
      name: "Organic Face Cream",
      description: "Natural organic face cream for all skin types",
      sku: "HB-SKINCARE-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "health-beauty" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "skincare" } }))?.id,
      isFeatured: true,
      sortOrder: 1,
      prices: [
        { price: 34.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 80, reserved: 5, minThreshold: 16, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=17", altText: "Organic Face Cream", isPrimary: true, sortOrder: 1 }
      ]
    },
    {
      name: "Professional Makeup Brush Set",
      description: "Complete set of professional makeup brushes",
      sku: "HB-MAKEUP-001",
      categoryId: (await prisma.category.findFirst({ where: { slug: "health-beauty" } }))?.id,
      subcategoryId: (await prisma.subcategory.findFirst({ where: { slug: "makeup" } }))?.id,
      isFeatured: false,
      sortOrder: 2,
      prices: [
        { price: 59.99, salePrice: 44.99, currency: "USD", isActive: true }
      ],
      stock: { quantity: 45, reserved: 3, minThreshold: 9, isInStock: true },
      images: [
        { url: "https://picsum.photos/400/300?random=18", altText: "Makeup Brush Set", isPrimary: true, sortOrder: 1 }
      ]
    }
  ];

  // Create items with their related data
  for (const itemData of items) {
    const { prices, stock, images, ...itemInfo } = itemData;
    
    const item = await prisma.item.create({
      data: itemInfo,
    });

    console.log(`✅ Created item: ${item.name}`);

    // Create prices for the item
    for (const priceData of prices) {
      await prisma.price.create({
        data: {
          ...priceData,
          itemId: item.id,
        },
      });
      console.log(`  └─ Created price: $${priceData.price}`);
    }

    // Create stock for the item
    if (stock) {
      await prisma.stock.create({
        data: {
          ...stock,
          itemId: item.id,
        },
      });
      console.log(`  └─ Created stock: ${stock.quantity} units`);
    }

    // Create images for the item
    for (const imageData of images) {
      await prisma.itemImage.create({
        data: {
          ...imageData,
          itemId: item.id,
        },
      });
      console.log(`  └─ Created image: ${imageData.url}`);
    }
  }

  console.log('\n⭐ Creating sample reviews and ratings...');

  // Get some items to add reviews and ratings
  const sampleItems = await prisma.item.findMany({ take: 5 });
  const users = await prisma.user.findMany({ take: 3 });

  if (sampleItems.length > 0 && users.length > 0) {
    // Create sample reviews
    const reviews = [
      { itemId: sampleItems[0].id, userId: users[0].id, title: "Great quality!", content: "This product exceeded my expectations. Highly recommended!", rating: 5 },
      { itemId: sampleItems[0].id, userId: users[1].id, title: "Good value", content: "Good quality for the price. Would buy again.", rating: 4 },
      { itemId: sampleItems[1].id, userId: users[0].id, title: "Perfect fit", content: "Fits perfectly and very comfortable.", rating: 5 },
      { itemId: sampleItems[2].id, userId: users[2].id, title: "Amazing sound", content: "The sound quality is incredible!", rating: 5 },
      { itemId: sampleItems[3].id, userId: users[1].id, title: "Beautiful design", content: "Love the modern design and functionality.", rating: 4 }
    ];

    for (const reviewData of reviews) {
      await prisma.review.create({
        data: {
          ...reviewData,
          isApproved: true,
        },
      });
      console.log(`✅ Created review for item: ${reviewData.title}`);
    }

    // Create sample ratings
    const ratings = [
      { itemId: sampleItems[0].id, userId: users[2].id, rating: 4 },
      { itemId: sampleItems[1].id, userId: users[2].id, rating: 5 },
      { itemId: sampleItems[2].id, userId: users[0].id, rating: 5 },
      { itemId: sampleItems[3].id, userId: users[0].id, rating: 4 },
      { itemId: sampleItems[4].id, userId: users[1].id, rating: 5 }
    ];

    for (const ratingData of ratings) {
      await prisma.rating.create({
        data: ratingData,
      });
      console.log(`⭐ Created rating: ${ratingData.rating}/5 stars`);
    }

    // Create sample favorites
    const favorites = [
      { itemId: sampleItems[0].id, userId: users[0].id },
      { itemId: sampleItems[1].id, userId: users[0].id },
      { itemId: sampleItems[2].id, userId: users[1].id },
      { itemId: sampleItems[3].id, userId: users[1].id },
      { itemId: sampleItems[4].id, userId: users[2].id }
    ];

    for (const favoriteData of favorites) {
      await prisma.favorite.create({
        data: favoriteData,
      });
      console.log(`❤️  Added item to favorites`);
    }
  }

              console.log('\n⚡ Creating flash sales...');

            // Create a flash sale
            const flashSale = await prisma.flashSale.create({
              data: {
                name: "Summer Electronics Sale",
                description: "Huge discounts on electronics and gaming gear",
                startDate: new Date(),
                endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                isActive: true,
                discount: 25,
              },
            });

            console.log(`✅ Created flash sale: ${flashSale.name}`);

            // Add some items to the flash sale
            const flashSaleItems = [
              {
                itemId: sampleItems[0].id, // Summer Dress
                salePrice: 59.99,
                originalPrice: 89.99,
              },
              {
                itemId: sampleItems[1].id, // White Blouse
                salePrice: 32.99,
                originalPrice: 45.99,
              },
              {
                itemId: sampleItems[2].id, // Cotton Shirt
                salePrice: 45.99,
                originalPrice: 65.99,
              },
            ];

            for (const itemData of flashSaleItems) {
              await prisma.flashSaleItem.create({
                data: {
                  ...itemData,
                  flashSaleId: flashSale.id,
                },
              });
              console.log(`  └─ Added item to flash sale: $${itemData.salePrice} (was $${itemData.originalPrice})`);
            }

            // Create a second flash sale for variety
            const flashSale2 = await prisma.flashSale.create({
              data: {
                name: "Fashion & Beauty Flash Sale",
                description: "Amazing deals on fashion and beauty products",
                startDate: new Date(),
                endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                isActive: true,
                discount: 30,
              },
            });

            console.log(`✅ Created flash sale: ${flashSale2.name}`);

            // Add fashion and beauty items to the second flash sale
            const flashSaleItems2 = [
              {
                itemId: sampleItems[3].id, // Slim Fit Jeans
                salePrice: 55.99,
                originalPrice: 79.99,
              },
              {
                itemId: sampleItems[4].id, // Headphones
                salePrice: 149.99,
                originalPrice: 199.99,
              },
            ];

            for (const itemData of flashSaleItems2) {
              await prisma.flashSaleItem.create({
                data: {
                  ...itemData,
                  flashSaleId: flashSale2.id,
                },
              });
              console.log(`  └─ Added item to flash sale: $${itemData.salePrice} (was $${itemData.originalPrice})`);
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
