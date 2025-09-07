// Route Paths
export const ROUTES = {
  // Public Routes
  LOGIN: '/login',

  // Admin Routes
  ADMIN: '/',
  ADMIN_PRODUCTS: '/products',
  ADMIN_ORDERS: '/orders',
  ADMIN_CUSTOMERS: '/customers',
  ADMIN_ANALYTICS: '/analytics',
  ADMIN_SETTINGS: '/settings',
} as const;

// Route Names for Navigation
export const ROUTE_NAMES = {
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard',
  PRODUCTS: 'Products',
  ORDERS: 'Orders',
  CUSTOMERS: 'Customers',
  ANALYTICS: 'Analytics',
  SETTINGS: 'Settings',
} as const;

// Public Routes Array
export const PUBLIC_ROUTES = [
  {
    path: ROUTES.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    element: 'Login',
  },
];

// Admin Routes Array
export const ADMIN_ROUTES = [
  {
    path: ROUTES.ADMIN,
    name: ROUTE_NAMES.DASHBOARD,
    element: 'Dashboard',
    icon: 'dashboard',
  },
  {
    path: ROUTES.ADMIN_PRODUCTS,
    name: ROUTE_NAMES.PRODUCTS,
    element: 'Products',
    icon: 'products',
  },
  {
    path: ROUTES.ADMIN_ORDERS,
    name: ROUTE_NAMES.ORDERS,
    element: 'Orders',
    icon: 'orders',
  },
  {
    path: ROUTES.ADMIN_CUSTOMERS,
    name: ROUTE_NAMES.CUSTOMERS,
    element: 'Customers',
    icon: 'customers',
  },
  {
    path: ROUTES.ADMIN_ANALYTICS,
    name: ROUTE_NAMES.ANALYTICS,
    element: 'Analytics',
    icon: 'analytics',
  },
  {
    path: ROUTES.ADMIN_SETTINGS,
    name: ROUTE_NAMES.SETTINGS,
    element: 'Settings',
    icon: 'settings',
  },
];

// All Routes Array (for router configuration)
export const ALL_ROUTES = [...PUBLIC_ROUTES, ...ADMIN_ROUTES];
