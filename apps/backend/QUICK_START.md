# Quick Start - Product Module with Variants

## 🚨 Fix Prisma Lock Issue First

The Prisma generation is failing because Windows has locked the DLL file.

### Quick Fix:
1. **Close this VS Code window completely**
2. **Open a new PowerShell terminal** (not in VS Code)
3. **Run:**
```powershell
cd C:\Projects\exclusive-vuejs\apps\backend
.\regenerate-prisma.ps1
```

OR manually:
```powershell
cd C:\Projects\exclusive-vuejs\apps\backend
npx prisma generate
npx prisma migrate dev --name add_product_variants
```

## ✅ What's Been Updated

### Database Schema
- ✅ `items` → **`products`** table
- ✅ New **`product_variants`** table
- ✅ New **`product_images`** table (linked to File module)
- ✅ Updated `prices`, `stock` to link to variants
- ✅ Updated all foreign keys

### Backend Code
- ✅ `products.service.ts` - Complete CRUD for products & variants
- ✅ `products.controller.ts` - Full REST API with Swagger
- ✅ `dto/product.dto.ts` - Product DTOs
- ✅ `dto/variant.dto.ts` - Variant, Price, Stock, Image DTOs

## 📊 New Structure

```
Product (T-Shirt)
  ├── Variant (Red - Large)
  │   ├── Price: $29.99, Sale: $19.99
  │   ├── Stock: 100 units
  │   └── Images: [red-large-front.jpg, red-large-back.jpg]
  │
  └── Variant (Blue - Medium)
      ├── Price: $29.99
      ├── Stock: 50 units
      └── Images: [blue-medium-front.jpg]
```

## 🎯 API Endpoints (after migration)

### Products
- `POST /products` - Create product
- `GET /products?page=1&limit=20&search=shirt` - List products
- `GET /products/:id` - Get product with variants
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Variants
- `POST /products/variants` - Create variant
- `GET /products/:productId/variants` - Get product variants
- `GET /products/variants/:id` - Get variant details
- `PUT /products/variants/:id` - Update variant
- `DELETE /products/variants/:id` - Delete variant

### Prices
- `POST /products/prices` - Add price to variant
- `GET /products/variants/:variantId/prices` - Get variant prices
- `PUT /products/prices/:id` - Update price
- `DELETE /products/prices/:id` - Delete price

### Stock
- `POST /products/stock` - Add stock to variant
- `GET /products/variants/:variantId/stock` - Get variant stock
- `PUT /products/stock/:id` - Update stock

### Images
- `POST /products/images` - Add image (productId OR variantId)
- `GET /products/:productId/images` - Get product images
- `GET /products/variants/:variantId/images` - Get variant images
- `PUT /products/images/:id` - Update image
- `DELETE /products/images/:id` - Delete image

## 📝 Example Usage

```typescript
// 1. Create product
POST /products
{
  "name": "Premium T-Shirt",
  "description": "High-quality cotton",
  "sku": "TSHIRT-001",
  "categoryId": "cat_123"
}

// 2. Create variant
POST /products/variants
{
  "productId": "prod_123",
  "sku": "TSHIRT-001-RED-L",
  "name": "Red - Large",
  "attributes": { "color": "Red", "size": "L" },
  "isDefault": true
}

// 3. Add price
POST /products/prices
{
  "variantId": "var_123",
  "price": 29.99,
  "salePrice": 19.99
}

// 4. Add stock
POST /products/stock
{
  "variantId": "var_123",
  "quantity": 100
}

// 5. Add image
POST /products/images
{
  "variantId": "var_123",
  "fileId": "file_123",
  "isPrimary": true
}
```

All endpoints fully documented in Swagger at `http://localhost:3000/api`!

