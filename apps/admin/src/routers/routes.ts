const MANAGEMENT_ROUTES = {
  ADMIN_MANAGEMENT: '/management',
  ADMIN_PERMISSIONS: '/permissions',
  ADMIN_CREATE_PERMISSION: '/permissions/create',
  ADMIN_EDIT_PERMISSION: '/permissions/edit/:id',
  ADMIN_RESOURCES: '/resources',
  ADMIN_CREATE_RESOURCE: '/resources/create',
  ADMIN_EDIT_RESOURCE: '/resources/edit/:id',
};

// Route Paths
export const ROUTES = {
  // Public Routes
  LOGIN: '/login',

  // Admin Routes
  ADMIN: '/',
  ADMIN_PRODUCTS: '/products',
  ADMIN_ORDERS: '/orders',
  ADMIN_CUSTOMERS: '/customers',
  // management routes
  ...MANAGEMENT_ROUTES,

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
  PERMISSIONS: 'Permissions',
  CREATE_PERMISSION: 'Create Permission',
  EDIT_PERMISSION: 'Edit Permission',
  RESOURCES: 'Resources',
  CREATE_RESOURCE: 'Create Resource',
  EDIT_RESOURCE: 'Edit Resource',
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
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_PERMISSIONS,
    name: ROUTE_NAMES.PERMISSIONS,
    element: 'Permissions',
    icon: 'permissions',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_CREATE_PERMISSION,
    name: ROUTE_NAMES.CREATE_PERMISSION,
    element: 'CreatePermission',
    icon: 'create-permission',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_EDIT_PERMISSION,
    name: ROUTE_NAMES.EDIT_PERMISSION,
    element: 'EditPermission',
    icon: 'edit-permission',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_RESOURCES,
    name: ROUTE_NAMES.RESOURCES,
    element: 'Resources',
    icon: 'resources',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_CREATE_RESOURCE,
    name: ROUTE_NAMES.CREATE_RESOURCE,
    element: 'CreateResource',
    icon: 'create-resource',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_EDIT_RESOURCE,
    name: ROUTE_NAMES.EDIT_RESOURCE,
    element: 'EditResource',
    icon: 'edit-resource',
  },
];

// All Routes Array (for router configuration)
export const ALL_ROUTES = [...PUBLIC_ROUTES, ...ADMIN_ROUTES];
