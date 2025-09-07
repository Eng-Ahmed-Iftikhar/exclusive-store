// API Routes Configuration
// Centralized management of all API endpoints

export const API_ROUTES = {
  // Authentication Routes
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Admin Dashboard Routes
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    DASHBOARD_CHARTS: '/admin/dashboard/charts',
  },
  // Activity Routes
  ACTIVITY: {
    RECENT: '/activity/recent',
    BY_TYPE: '/activity/by-type',
    BY_USER: '/activity/by-user',
  },

  // Items/Products Routes
  ITEMS: {
    LIST: '/items',
    BY_ID: (id: string) => `/items/${id}`,
    CREATE: '/items',
    UPDATE: (id: string) => `/items/${id}`,
    DELETE: (id: string) => `/items/${id}`,
    REVIEWS: {
      PENDING: '/items/reviews/pending',
      APPROVE: (id: string) => `/items/reviews/${id}/admin`,
    },
  },

  // Orders Routes
  ORDERS: {
    LIST: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },

  // Categories Routes
  CATEGORIES: {
    LIST: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },

  // Flash Sales Routes
  FLASH_SALES: {
    LIST: '/flash-sales',
    BY_ID: (id: string) => `/flash-sales/${id}`,
    CREATE: '/flash-sales',
    UPDATE: (id: string) => `/flash-sales/${id}`,
    DELETE: (id: string) => `/flash-sales/${id}`,
  },

  // Users/Customers Routes
  USERS: {
    LIST: '/auth/users',
    BY_ID: (id: string) => `/auth/users/${id}`,
  },
} as const;

// Base URL configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Route helper functions
export const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number>
) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;

  if (params) {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryString.append(key, String(value));
    });
    url += `?${queryString.toString()}`;
  }

  return url;
};

// Export types for better TypeScript support
export type ApiRoute = typeof API_ROUTES;
export type ApiConfig = typeof API_CONFIG;
