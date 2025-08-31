# Admin Dashboard

A professional admin dashboard for the Exclusive e-commerce platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Dashboard Statistics**: Uses backend API data instead of mock data
- **Professional UI/UX**: Clean, modern design with dark/light theme support
- **Responsive Design**: Works on all device sizes
- **Theme Toggle**: Switch between light and dark modes
- **Protected Routes**: Authentication-based access control
- **Real API Integration**: Connected to backend services

## Prerequisites

Before running the admin dashboard, ensure you have:

1. **Backend Server Running**: The admin dashboard requires the backend API to be running on `http://localhost:3000`
2. **Database Seeded**: The backend should have sample data (run `npm run prisma:seed` in the backend directory)
3. **Environment Variables**: Backend should have proper `.env` configuration

## Quick Start

### 1. Start the Backend Server

```bash
cd apps/backend
npm run serve
```

The backend will start on `http://localhost:3000`

### 2. Start the Admin Dashboard

```bash
cd apps/admin
npm run dev
```

The admin dashboard will start on `http://localhost:5173`

### 3. Access the Dashboard

Navigate to `http://localhost:5173/admin` in your browser.

## API Integration

The admin dashboard is now fully integrated with the backend API:

### Dashboard Statistics
- **Endpoint**: `GET /api/admin/dashboard/stats`
- **Data**: Real-time statistics from the database
- **Fallback**: Mock data if API is unavailable

### Available Data
- Total Users, Products, Orders, Revenue
- Recent Orders with customer details
- Top Products by sales and revenue
- Monthly Revenue charts
- Low Stock Alerts
- Pending Reviews count
- Active Flash Sales count

### Authentication
- **Login**: `POST /api/auth/login`
- **Current User**: `GET /api/auth/me`
- **Logout**: `POST /api/auth/logout`

## Backend API Endpoints

The admin dashboard uses these backend endpoints:

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics

### Items/Products
- `GET /api/items` - List all products
- `POST /api/items` - Create new product
- `PUT /api/items/:id` - Update product
- `DELETE /api/items/:id` - Delete product

### Orders
- `GET /api/orders` - List all orders
- `PUT /api/orders/:id/status` - Update order status

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category

### Flash Sales
- `GET /api/flash-sales` - List active flash sales

## Data Flow

1. **Dashboard Load**: Fetches real data from `/api/admin/dashboard/stats`
2. **Real-time Updates**: Data is fetched fresh on each page load
3. **Error Handling**: Gracefully falls back to mock data if API fails
4. **Authentication**: JWT tokens are automatically included in API requests

## Development

### API Structure

The admin dashboard uses a centralized API management system:

- **`src/apis/routes.ts`**: Centralized route configuration for all API endpoints
- **`src/apis/services/`**: Contains individual API service files (adminApi.ts, authApi.ts)
- **`src/apis/index.ts`**: Main export file for clean imports

### Adding New API Endpoints

1. **Backend**: Add new endpoints in the appropriate controller
2. **Routes**: Add new route definitions in `src/apis/routes.ts`
3. **API Service**: Add new queries/mutations in the appropriate service file
4. **Components**: Use the new API hooks in your components

### Styling

- **Theme Support**: All components support light/dark themes
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive**: Mobile-first design approach

### State Management

- **Redux Toolkit**: Modern Redux with RTK Query
- **API Caching**: Automatic caching and invalidation
- **Real-time Updates**: Fresh data on each request

## Troubleshooting

### Common Issues

1. **API Connection Failed**: Ensure backend is running on port 3000
2. **Authentication Errors**: Check JWT token validity
3. **Data Not Loading**: Verify database has sample data
4. **CORS Errors**: Backend should allow frontend origin

### Debug Mode

Enable debug logging in the browser console to see API requests and responses.

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: More detailed charts and reports
- **Bulk Operations**: Mass product/order management
- **Export Features**: CSV/PDF export capabilities
- **User Management**: Admin user roles and permissions

## Contributing

1. Follow the existing code structure
2. Ensure all components support theme switching
3. Add proper error handling and loading states
4. Test with both real API and fallback scenarios
