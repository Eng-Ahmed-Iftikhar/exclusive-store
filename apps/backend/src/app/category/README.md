# Category API Documentation

This module provides comprehensive APIs for managing categories and subcategories in the e-commerce system.

## Features

- **Category Management**: CRUD operations for product categories
- **Subcategory Management**: CRUD operations for subcategories within categories
- **Hierarchical Structure**: Categories can have multiple subcategories
- **Slug-based URLs**: SEO-friendly URLs using slugs
- **Sorting**: Categories and subcategories can be ordered
- **Active/Inactive Status**: Soft activation/deactivation
- **Image Support**: Categories and subcategories can have associated images

## Database Schema

### Category Model
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  image       String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  subcategories Subcategory[]
}
```

### Subcategory Model
```prisma
model Subcategory {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  image       String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  categoryId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### Categories

#### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics",
  "slug": "electronics",
  "description": "Latest gadgets and electronic devices",
  "image": "/images/categories/electronics.jpg",
  "sortOrder": 1,
  "isActive": true,
  "subcategories": [
    {
      "name": "Smartphones",
      "slug": "smartphones",
      "description": "Latest mobile phones",
      "sortOrder": 1
    }
  ]
}
```

#### Get All Categories
```http
GET /categories?includeInactive=false
```

#### Get Category by ID
```http
GET /categories/:id
```

#### Get Category by Slug
```http
GET /categories/slug/:slug
```

#### Update Category
```http
PUT /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Electronics",
  "description": "Updated description"
}
```

#### Delete Category
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

### Subcategories

#### Create Subcategory
```http
POST /categories/:categoryId/subcategories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptops",
  "slug": "laptops",
  "description": "High-performance laptops",
  "sortOrder": 2
}
```

#### Get Subcategories by Category
```http
GET /categories/:categoryId/subcategories?includeInactive=false
```

#### Get Subcategory by ID
```http
GET /categories/subcategories/:id
```

#### Update Subcategory
```http
PUT /categories/subcategories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Laptops",
  "description": "Updated description"
}
```

#### Delete Subcategory
```http
DELETE /categories/subcategories/:id
Authorization: Bearer <token>
```

## Response Format

### Category Response
```json
{
  "id": "clx1234567890",
  "name": "Electronics",
  "slug": "electronics",
  "description": "Latest gadgets and electronic devices",
  "image": "/images/categories/electronics.jpg",
  "isActive": true,
  "sortOrder": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "subcategories": [
    {
      "id": "clx0987654321",
      "name": "Smartphones",
      "slug": "smartphones",
      "description": "Latest mobile phones",
      "image": null,
      "isActive": true,
      "sortOrder": 1,
      "categoryId": "clx1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Subcategory Response
```json
{
  "id": "clx0987654321",
  "name": "Smartphones",
  "slug": "smartphones",
  "description": "Latest mobile phones",
  "image": null,
  "isActive": true,
  "sortOrder": 1,
  "categoryId": "clx1234567890",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Category or subcategory not found
- `409 Conflict`: Slug already exists
- `500 Internal Server Error`: Server-side errors

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Usage Examples

### Frontend Integration

```typescript
// Get all categories
const categories = await fetch('/api/categories').then(res => res.json());

// Create a new category
const newCategory = await fetch('/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'New Category',
    slug: 'new-category',
    description: 'Description here'
  })
}).then(res => res.json());
```

### Backend Integration

```typescript
import { CategoryService } from './category/category.service';

@Injectable()
export class ProductService {
  constructor(private readonly categoryService: CategoryService) {}

  async getProductsByCategory(categorySlug: string) {
    const category = await this.categoryService.getCategoryBySlug(categorySlug);
    // Use category data to filter products
  }
}
```

## Seeding

The database comes pre-seeded with common e-commerce categories:

- Woman's Fashion
- Men's Fashion
- Electronics
- Home & Lifestyle
- Sports & Outdoor
- Health & Beauty

Each category includes relevant subcategories with proper descriptions and sorting.

## Notes

- Slugs are automatically generated from names if not provided
- Deleting a category will cascade delete all its subcategories
- Categories and subcategories support soft activation/deactivation
- Sort order determines the display sequence
- Images are stored as file paths (implement file upload separately)
