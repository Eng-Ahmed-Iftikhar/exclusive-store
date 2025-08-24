# Items API Documentation

## Overview

The Items API provides comprehensive e-commerce functionality for managing products, including items, prices, stock, images, reviews, ratings, and favorites. This API is designed to handle all aspects of product management in an e-commerce system.

## Features

- **Complete Item Management**: CRUD operations for products with categories and subcategories
- **Dynamic Pricing**: Support for regular prices, sale prices, and currency management
- **Inventory Management**: Stock tracking with reserved quantities and threshold alerts
- **Image Management**: Multiple images per item with primary image designation
- **Review System**: User reviews with approval workflow
- **Rating System**: 1-5 star ratings from users
- **Favorites**: User wishlist functionality
- **Advanced Search**: Filtering by category, price range, ratings, and more
- **Pagination**: Efficient data retrieval with configurable page sizes

## Database Schema

### Core Models

#### Item
- Basic product information (name, description, SKU)
- Category and subcategory relationships
- Active/featured status management
- Sort order for display sequencing

#### Price
- Regular and sale prices
- Currency support (defaults to USD)
- Validity periods (from/to dates)
- Active status for price management

#### Stock
- Current quantity and reserved amounts
- Minimum and maximum thresholds
- Stock status indicators

#### ItemImage
- Multiple images per item
- Primary image designation
- Sort order for image display
- Alt text for accessibility

#### Review
- User-generated product reviews
- Title and content
- 1-5 star ratings
- Approval workflow for moderation

#### Rating
- Simple 1-5 star ratings
- One rating per user per item
- Separate from review system

#### Favorite
- User wishlist items
- One favorite entry per user per item

## API Endpoints

### Items

#### Create Item
```
POST /items
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "sku": "PROD-001",
  "categoryId": "category_id",
  "subcategoryId": "subcategory_id",
  "isFeatured": true,
  "sortOrder": 1
}
```

#### Get All Items
```
GET /items?page=1&limit=20&categoryId=cat_id&minPrice=10&maxPrice=100&minRating=4
```

**Query Parameters:**
- `search`: Text search in name, description, or SKU
- `categoryId`: Filter by category
- `subcategoryId`: Filter by subcategory
- `isFeatured`: Filter featured items
- `isActive`: Filter active items
- `sortBy`: Sort by name, price, rating, or createdAt
- `sortOrder`: asc or desc
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `minRating`: Minimum rating filter

#### Get Item by ID
```
GET /items/:id
```

#### Update Item
```
PUT /items/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Delete Item
```
DELETE /items/:id
Authorization: Bearer <JWT_TOKEN>
```

### Prices

#### Create Price
```
POST /items/prices
Authorization: Bearer <JWT_TOKEN>

{
  "itemId": "item_id",
  "price": 99.99,
  "salePrice": 79.99,
  "currency": "USD",
  "isActive": true
}
```

#### Update Price
```
PUT /items/prices/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Delete Price
```
DELETE /items/prices/:id
Authorization: Bearer <JWT_TOKEN>
```

### Stock

#### Create Stock
```
POST /items/stock
Authorization: Bearer <JWT_TOKEN>

{
  "itemId": "item_id",
  "quantity": 100,
  "reserved": 5,
  "minThreshold": 10,
  "maxThreshold": 200,
  "isInStock": true
}
```

#### Update Stock
```
PUT /items/stock/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Delete Stock
```
DELETE /items/stock/:id
Authorization: Bearer <JWT_TOKEN>
```

### Images

#### Create Item Image
```
POST /items/images
Authorization: Bearer <JWT_TOKEN>

{
  "itemId": "item_id",
  "url": "https://example.com/image.jpg",
  "altText": "Product image description",
  "isPrimary": true,
  "sortOrder": 1
}
```

#### Update Item Image
```
PUT /items/images/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Delete Item Image
```
DELETE /items/images/:id
Authorization: Bearer <JWT_TOKEN>
```

### Reviews

#### Create Review
```
POST /items/reviews
Authorization: Bearer <JWT_TOKEN>

{
  "itemId": "item_id",
  "title": "Great Product!",
  "content": "This product exceeded my expectations...",
  "rating": 5
}
```

#### Update Review
```
PUT /items/reviews/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Admin Update Review
```
PUT /items/reviews/:id/admin
Authorization: Bearer <JWT_TOKEN>

{
  "isApproved": true
}
```

#### Delete Review
```
DELETE /items/reviews/:id
Authorization: Bearer <JWT_TOKEN>
```

### Ratings

#### Create Rating
```
POST /items/ratings
Authorization: Bearer <JWT_TOKEN>

{
  "itemId": "item_id",
  "rating": 5
}
```

#### Update Rating
```
PUT /items/ratings/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Delete Rating
```
DELETE /items/ratings/:id
Authorization: Bearer <JWT_TOKEN>
```

### Favorites

#### Add to Favorites
```
POST /items/favorites
Authorization: Bearer <JWT_TOKEN>

{
  "itemId": "item_id"
}
```

#### Remove from Favorites
```
DELETE /items/favorites/:itemId
Authorization: Bearer <JWT_TOKEN>
```

#### Get User Favorites
```
GET /items/favorites/user
Authorization: Bearer <JWT_TOKEN>
```

### Special Endpoints

#### Featured Items
```
GET /items/featured/featured
```

#### Items by Category
```
GET /items/category/:categoryId
```

#### Items by Subcategory
```
GET /items/subcategory/:subcategoryId
```

#### Search Items
```
GET /items/search/search?q=search_term
```

## Response Formats

### Item Response
```json
{
  "id": "item_id",
  "name": "Product Name",
  "description": "Product description",
  "sku": "PROD-001",
  "isActive": true,
  "isFeatured": false,
  "sortOrder": 1,
  "categoryId": "category_id",
  "subcategoryId": "subcategory_id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "category": {
    "id": "category_id",
    "name": "Category Name",
    "slug": "category-slug"
  },
  "subcategory": {
    "id": "subcategory_id",
    "name": "Subcategory Name",
    "slug": "subcategory-slug"
  },
  "prices": [
    {
      "id": "price_id",
      "price": 99.99,
      "salePrice": 79.99,
      "currency": "USD",
      "isActive": true
    }
  ],
  "stock": {
    "id": "stock_id",
    "quantity": 100,
    "reserved": 5,
    "isInStock": true
  },
  "images": [
    {
      "id": "image_id",
      "url": "https://example.com/image.jpg",
      "altText": "Description",
      "isPrimary": true,
      "sortOrder": 1
    }
  ],
  "reviews": [...],
  "ratings": [...],
  "favorites": [...],
  "averageRating": 4.5,
  "totalReviews": 10,
  "isFavorite": false,
  "currentPrice": 99.99,
  "salePrice": 79.99,
  "isOnSale": true
}
```

### Paginated Response
```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server-side error

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

Public endpoints (no authentication required):
- `GET /items` - List items
- `GET /items/:id` - Get item details
- `GET /items/featured/featured` - Get featured items
- `GET /items/category/:categoryId` - Get items by category
- `GET /items/subcategory/:subcategoryId` - Get items by subcategory
- `GET /items/search/search` - Search items

## Business Logic

### Price Management
- Items can have multiple prices with validity periods
- Sale prices are automatically calculated for discounts
- Only active prices are considered for current pricing

### Stock Management
- Reserved quantities prevent overselling
- Threshold alerts for low stock
- Automatic stock status updates

### Image Management
- Only one primary image per item
- Automatic reordering when setting new primary image
- Sort order for consistent display

### Review System
- One review per user per item
- Approval workflow for content moderation
- Reviews are hidden until approved

### Rating System
- One rating per user per item
- Separate from review system
- Used for average rating calculations

### Favorites
- One favorite entry per user per item
- Prevents duplicate favorites
- User-specific wishlist management

## Usage Examples

### Creating a Complete Product
1. Create the item
2. Add pricing information
3. Set stock levels
4. Upload product images
5. Set primary image

### Managing Inventory
1. Update stock quantities
2. Monitor reserved amounts
3. Set threshold alerts
4. Update stock status

### User Engagement
1. Allow users to rate products
2. Enable review submissions
3. Manage favorite items
4. Moderate user content

## Performance Considerations

- Pagination for large datasets
- Efficient database queries with proper indexing
- Image optimization for faster loading
- Caching strategies for frequently accessed data

## Security Features

- JWT authentication for protected endpoints
- User ownership validation for personal data
- Input validation and sanitization
- SQL injection prevention through Prisma ORM

## Future Enhancements

- Bulk operations for inventory management
- Advanced analytics and reporting
- Integration with payment gateways
- Multi-language support
- Advanced search with Elasticsearch
- Image processing and optimization
- Inventory forecasting
- Automated pricing strategies
