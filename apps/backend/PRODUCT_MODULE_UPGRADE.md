# Product Module Upgrade - Variants Support

## Overview
The product module has been professionally restructured to support product variants with proper separation of concerns.

## Database Schema Changes

### Old Structure (Items-based)
```
items → prices, stock, item_images
```

### New Structure (Products with Variants)
```
products → product_variants → prices, stock, product_images
```

## New Models

### 1. **Product** (renamed from Item)
- Base product information
- Can have multiple variants
- Maps to `products` table

### 2. **ProductVariant** 
- Represents different versions (color, size, material, etc.)
- Each variant has unique SKU
- Attributes stored as JSON: `{ color: "Red", size: "Large" }`
- Maps to `product_variants` table

### 3. **ProductImage** (renamed from ItemImage)
- Unified image table
- Can link to either:
  - **Product** (product-level images) OR
  - **Variant** (variant-specific images)
- Links to **File** module via `fileId`
- Maps to `product_images` table

### 4. **Price**
- Now links to **variants** instead of items
- Each variant can have multiple price records
- Supports sale pricing

### 5. **Stock**
- Now links to **variants** instead of items
- Each variant has its own inventory tracking

## Key Changes

### Tables Renamed
- `items` → `products`
- `item_images` → `product_images`

### Foreign Key Updates
- `cart_items.itemId` → `cart_items.variantId`
- `order_items.itemId` → `order_items.variantId`
- `prices.itemId` → `prices.variantId`
- `stock.itemId` → `stock.variantId`
- `reviews.itemId` → `reviews.productId`
- `ratings.itemId` → `ratings.productId`
- `favorites.itemId` → `favorites.productId`
- `flash_sale_items.itemId` → `flash_sale_items.productId`

## API Endpoints

### Products
- `POST /products` - Create product
- `GET /products` - List all products (with pagination & search)
- `GET /products/:id` - Get product details
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Variants
- `POST /products/variants` - Create variant
- `GET /products/:productId/variants` - Get product variants
- `GET /products/variants/:id` - Get variant details
- `PUT /products/variants/:id` - Update variant
- `DELETE /products/variants/:id` - Delete variant

### Prices
- `POST /products/prices` - Create price for variant
- `GET /products/variants/:variantId/prices` - Get variant prices
- `PUT /products/prices/:id` - Update price
- `DELETE /products/prices/:id` - Delete price

### Stock
- `POST /products/stock` - Create stock for variant
- `GET /products/variants/:variantId/stock` - Get variant stock
- `PUT /products/stock/:id` - Update stock

### Images
- `POST /products/images` - Add image to product or variant
- `GET /products/:productId/images` - Get product images
- `GET /products/variants/:variantId/images` - Get variant images
- `PUT /products/images/:id` - Update image
- `DELETE /products/images/:id` - Delete image

## Migration Strategy

### Option 1: Fresh Start (Recommended if development)
```bash
npm run prisma:migrate-reset
npm run prisma:generate
npm run prisma:seed
```

### Option 2: Data Migration (if you have important data)

1. **Export existing data** (if needed)
2. **Run migration with data transformation**:

```bash
# The migration will:
# - Rename items → products
# - Create product_variants table
# - Create variant_images table
# - Update all foreign keys
```

3. **Post-migration data transformation**:
   - Create default variants for existing products
   - Migrate prices/stock to variants
   - Migrate item images to product images

## Example Usage

### Creating a Product with Variants

```typescript
// Step 1: Create base product
const product = await POST /products {
  name: "Premium T-Shirt",
  description: "High-quality cotton t-shirt",
  sku: "TSHIRT-001",
  categoryId: "cat_123",
  isActive: true,
  isFeatured: true
}

// Step 2: Create variants
const redLarge = await POST /products/variants {
  productId: product.id,
  sku: "TSHIRT-001-RED-L",
  name: "Red - Large",
  attributes: { color: "Red", size: "Large" },
  isDefault: true
}

const blueMedium = await POST /products/variants {
  productId: product.id,
  sku: "TSHIRT-001-BLUE-M",
  name: "Blue - Medium",
  attributes: { color: "Blue", size: "Medium" }
}

// Step 3: Add prices to variants
await POST /products/prices {
  variantId: redLarge.id,
  price: 29.99,
  salePrice: 19.99,
  isActive: true
}

// Step 4: Add stock to variants
await POST /products/stock {
  variantId: redLarge.id,
  quantity: 100,
  minThreshold: 10
}

// Step 5: Add images to variants
await POST /products/images {
  variantId: redLarge.id,
  fileId: "file_123",  // From file module
  isPrimary: true,
  altText: "Red T-Shirt Large"
}
```

## Benefits

✅ **Professional Structure** - Industry-standard variant management
✅ **Flexible Attributes** - JSON-based attributes support any combination
✅ **Separate Inventory** - Each variant has its own stock
✅ **Separate Pricing** - Each variant can have different prices
✅ **Variant Images** - Images can be product-level or variant-specific
✅ **File Module Integration** - All images link to centralized file management
✅ **Full Swagger Documentation** - Complete API documentation
✅ **Type Safety** - Full TypeScript support

## Files Updated

### New Files
- `apps/backend/src/app/products/dto/product.dto.ts` - Product DTOs
- `apps/backend/src/app/products/dto/variant.dto.ts` - Variant DTOs
- `apps/backend/src/app/products/products.service.ts` - New service
- `apps/backend/src/app/products/products.controller.ts` - New controller

### Updated Files
- `apps/backend/prisma/schema.prisma` - Schema with variants
- `apps/backend/src/app/products/index.ts` - Exports

### Backup Files (can be deleted after testing)
- `apps/backend/src/app/products/products.service.old.ts`
- `apps/backend/src/app/products/products.controller.old.ts`
- `apps/backend/src/app/products/dto/item.dto.ts` (old DTOs)

## Next Steps

1. **Review the schema changes** in `prisma/schema.prisma`
2. **Run the migration** (see Migration Strategy above)
3. **Generate Prisma client**: `npm run prisma:generate`
4. **Test the API** using Swagger UI at `/api`
5. **Delete backup files** once confirmed working

## Support

The module now fully supports:
- ✅ Products with multiple variants
- ✅ Variant attributes (color, size, material, etc.)
- ✅ Per-variant pricing and sales
- ✅ Per-variant inventory tracking
- ✅ Product and variant images linked to file module
- ✅ Full Swagger/OpenAPI documentation
- ✅ TypeScript type safety

