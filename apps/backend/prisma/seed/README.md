# Database Seeding Structure

This folder contains organized seed files for populating the database with initial data.

## File Structure

### Core RBAC (Role-Based Access Control)
- **01-permissions.ts** - Creates 4 basic permissions: create, update, view, delete
- **02-resources.ts** - Creates 5 system resources: product, category, permission, role, resource
- **03-roles.ts** - Creates 2 roles: super-admin, admin
- **04-role-permissions.ts** - Links resources and permissions to roles

### Content Management
- **05-categories.ts** - Creates 20 product categories
- **06-subcategories.ts** - Creates 10 subcategories for each category (200 total)
- **07-products.ts** - Creates 10 products for each subcategory (2000 total)
- **08-variants.ts** - Creates 3 variants for each product (6000 total)

## Usage

### Run Complete Seeding
```bash
npx prisma db seed
```

### Run Individual Seed Files
```typescript
import { seedPermissions } from './seed/01-permissions';
await seedPermissions();
```

## Data Summary

- **Permissions**: 4 (create, update, view, delete)
- **Resources**: 5 (product, category, permission, role, resource)
- **Roles**: 2 (super-admin, admin)
- **Categories**: 20
- **Subcategories**: 200 (10 per category)
- **Products**: 2000 (10 per subcategory)
- **Prices**: 2000 (1 price per product)
- **Product Stock**: 2000 (1 stock per product)
- **Variants**: 6000 (3 per product)
- **Variant Prices**: 6000 (1 price per variant)
- **Variant Stock**: 6000 (1 stock per variant)
- **Total Stock Entries**: 8000 (2000 products + 6000 variants)

## Role Permissions

### Super Admin
- Full access to all resources with all permissions

### Admin
- Full access to product and category resources only
- No access to permission, role, or resource management

## Notes

- All seed files use `upsert` operations to prevent duplicates
- Products include random pricing and stock levels
- 20% of products are marked as featured
- 30% of products have sale prices (20% discount)
- Stock is managed through the Stock table (not in Product model)
- Products have their own stock entries in the Stock table
- Variants include realistic attributes (size, color, storage, etc.)
- Variant pricing varies from base product price (80%-150%)
- Each variant has its own stock management
- All data is created with proper relationships and foreign keys
