// API Routes Configuration
// Centralized management of all API endpoints

export const API_ROUTES = {
  // Authentication Routes
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    SETUP_PASSWORD: '/auth/setup-password',
    ADMIN_FORGOT_PASSWORD: '/auth/admin/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
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

  // Subcategories Routes
  SUBCATEGORIES: {
    LIST: '/subcategories',
    BY_ID: (id: string) => `/subcategories/${id}`,
    CREATE: '/subcategories',
    UPDATE: (id: string) => `/subcategories/${id}`,
    DELETE: (id: string) => `/subcategories/${id}`,
    BY_SLUG: (slug: string) => `/subcategories/slug/${slug}`,
    BY_CATEGORY: (categoryId: string) =>
      `/subcategories/category/${categoryId}`,
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
    LIST: '/users',
    CUSTOMERS: '/users/customers',
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Permissions Routes
  PERMISSIONS: {
    BASE: '/permissions',
    LIST: '/permissions',
    ACTIVE: '/permissions/active',
    BY_ID: (id: string) => `/permissions/${id}`,
  },

  // Resources Routes
  RESOURCES: {
    BASE: '/resources',
    LIST: '/resources',
    ACTIVE: '/resources/active',
    BY_ID: (id: string) => `/resources/${id}`,
  },

  // Roles Routes
  ROLES: {
    BASE: '/roles',
    LIST: '/roles',
    ACTIVE: '/roles/active',
    SYSTEM: '/roles/system',
    BY_ID: (id: string) => `/roles/${id}`,
  },

  // Notifications Routes
  NOTIFICATIONS: {
    BASE: '/notifications',
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_ALL_READ: '/notifications/mark-all-read',
    BY_ID: (id: string) => `/notifications/${id}`,
  },

  // Teams Routes
  TEAMS: {
    BASE: '/teams',
    LIST: '/teams',
    BY_ID: (id: string) => `/teams/${id}`,
    CREATE: '/teams',
    CREATE_WITH_USERS: '/teams/create-with-users',
    UPDATE: (id: string) => `/teams/${id}`,
    DELETE: (id: string) => `/teams/${id}`,
    ADD_USERS: (teamId: string) => `/teams/${teamId}/users/bulk`,
    ADD_USERS_BY_EMAIL: (teamId: string) => `/teams/${teamId}/users/by-email`,
    REMOVE_USER: (teamId: string, userId: string) =>
      `/teams/${teamId}/users/${userId}`,
    UPDATE_USER_ROLE: (teamId: string, userId: string) =>
      `/teams/${teamId}/users/${userId}/role`,
    ADD_MULTIPLE_ROLES: (teamId: string, userId: string) =>
      `/teams/${teamId}/users/${userId}/roles`,
    REMOVE_MULTIPLE_ROLES: (teamId: string, userId: string) =>
      `/teams/${teamId}/users/${userId}/roles`,
    GET_USER_ROLES: (teamId: string, userId: string) =>
      `/teams/${teamId}/users/${userId}/roles`,
    MEMBERS: (teamId: string) => `/teams/${teamId}/users`,
    // Team Role Management
    ADD_ROLES: (teamId: string) => `/teams/${teamId}/roles`,
    GET_ROLES: (teamId: string) => `/teams/${teamId}/roles`,
    REMOVE_ROLE: (teamId: string, roleId: string) =>
      `/teams/${teamId}/roles/${roleId}`,
  },

  // Files Routes
  FILES: {
    UPLOAD: '/files/upload',
    LIST: '/files',
    BY_ID: (id: string) => `/files/${id}`,
    UPDATE: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`,
    BULK_DELETE: '/files/bulk-delete',
    TRANSFORM: (id: string) => `/files/${id}/transform`,
    FOLDERS: '/files/folders/list',
    TAGS: '/files/tags/list',
    STATS: '/files/stats/overview',
    CLOUDINARY_USAGE: '/files/cloudinary/usage',
    CLOUDINARY_SEARCH: '/files/cloudinary/search',
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
