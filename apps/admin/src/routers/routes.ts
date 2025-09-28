const MANAGEMENT_ROUTES = {
  ADMIN_MANAGEMENT: '/management',
  ADMIN_PERMISSIONS: '/permissions',
  ADMIN_CREATE_PERMISSION: '/permissions/create',
  ADMIN_EDIT_PERMISSION: '/permissions/edit/:id',
  ADMIN_RESOURCES: '/resources',
  ADMIN_CREATE_RESOURCE: '/resources/create',
  ADMIN_EDIT_RESOURCE: '/resources/edit/:id',
  ADMIN_ROLES: '/roles',
  ADMIN_CREATE_ROLE: '/roles/create',
  ADMIN_EDIT_ROLE: '/roles/edit/:id',
  ADMIN_TEAMS: '/teams',
  ADMIN_CREATE_TEAM: '/teams/create',
  ADMIN_EDIT_TEAM: '/teams/edit/:id',
};

const CONTENT_ROUTES = {
  ADMIN_CONTENT: '/content',
  ADMIN_CATEGORIES: '/categories',
  ADMIN_CREATE_CATEGORY: '/categories/create',
  ADMIN_EDIT_CATEGORY: '/categories/edit/:id',
  ADMIN_SUBCATEGORIES: '/subcategories',
  ADMIN_SUBCATEGORY_DETAIL: '/subcategories/:id',
  ADMIN_CREATE_SUBCATEGORY: '/subcategories/create',
  ADMIN_EDIT_SUBCATEGORY: '/subcategories/edit/:id',
};

const AUTH_ROUTES = {
  ADMIN_SETUP_PASSWORD: '/setup-password',
  ADMIN_FORGOT_PASSWORD: '/forgot-password',
  ADMIN_RESET_PASSWORD: '/reset-password',
};

// Route Paths

export const ROUTES = {
  ADMIN: '/',
  // Public Routes
  LOGIN: '/login',

  // management routes
  ...MANAGEMENT_ROUTES,
  // auth routes
  ...AUTH_ROUTES,

  // content routes
  ...CONTENT_ROUTES,

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
  ROLES: 'Roles',
  CREATE_ROLE: 'Create Role',
  EDIT_ROLE: 'Edit Role',
  TEAMS: 'Teams',
  CREATE_TEAM: 'Create Team',
  EDIT_TEAM: 'Edit Team',
  CATEGORIES: 'Categories',
  CREATE_CATEGORY: 'Create Category',
  EDIT_CATEGORY: 'Edit Category',
  SUBCATEGORIES: 'Subcategories',
  SUBCATEGORY_DETAIL: 'Subcategory Detail',
  CREATE_SUBCATEGORY: 'Create Subcategory',
  EDIT_SUBCATEGORY: 'Edit Subcategory',
  SETUP_PASSWORD: 'Setup Password',
  FORGOT_PASSWORD: 'Forgot Password',
  RESET_PASSWORD: 'Reset Password',
} as const;

// Public Routes Array
export const PUBLIC_ROUTES = [
  {
    path: ROUTES.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    element: 'Login',
  },
  {
    path: ROUTES.ADMIN_SETUP_PASSWORD,
    name: ROUTE_NAMES.SETUP_PASSWORD,
    element: 'SetupPassword',
  },
  {
    path: ROUTES.ADMIN_FORGOT_PASSWORD,
    name: ROUTE_NAMES.FORGOT_PASSWORD,
    element: 'ForgotPassword',
  },
  {
    path: ROUTES.ADMIN_RESET_PASSWORD,
    name: ROUTE_NAMES.RESET_PASSWORD,
    element: 'ResetPassword',
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
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_ROLES,
    name: ROUTE_NAMES.ROLES,
    element: 'Roles',
    icon: 'roles',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_CREATE_ROLE,
    name: ROUTE_NAMES.CREATE_ROLE,
    element: 'CreateRole',
    icon: 'create-role',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_EDIT_ROLE,
    name: ROUTE_NAMES.EDIT_ROLE,
    element: 'EditRole',
    icon: 'edit-role',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_TEAMS,
    name: ROUTE_NAMES.TEAMS,
    element: 'Teams',
    icon: 'teams',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_CREATE_TEAM,
    name: ROUTE_NAMES.CREATE_TEAM,
    element: 'CreateTeam',
    icon: 'create-team',
  },
  {
    path: ROUTES.ADMIN_MANAGEMENT + ROUTES.ADMIN_EDIT_TEAM,
    name: ROUTE_NAMES.EDIT_TEAM,
    element: 'EditTeam',
    icon: 'edit-team',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_CATEGORIES,
    name: ROUTE_NAMES.CATEGORIES,
    element: 'Categories',
    icon: 'categories',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_CREATE_CATEGORY,
    name: ROUTE_NAMES.CREATE_CATEGORY,
    element: 'CreateCategory',
    icon: 'create-category',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_EDIT_CATEGORY,
    name: ROUTE_NAMES.EDIT_CATEGORY,
    element: 'EditCategory',
    icon: 'edit-category',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_SUBCATEGORIES,
    name: ROUTE_NAMES.SUBCATEGORIES,
    element: 'Subcategories',
    icon: 'subcategories',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_SUBCATEGORY_DETAIL,
    name: ROUTE_NAMES.SUBCATEGORY_DETAIL,
    element: 'SubcategoryDetail',
    icon: 'subcategory-detail',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_CREATE_SUBCATEGORY,
    name: ROUTE_NAMES.CREATE_SUBCATEGORY,
    element: 'CreateSubcategory',
    icon: 'create-subcategory',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_EDIT_SUBCATEGORY,
    name: ROUTE_NAMES.EDIT_SUBCATEGORY,
    element: 'EditSubcategory',
    icon: 'edit-subcategory',
  },
];

// All Routes Array (for router configuration)
export const ALL_ROUTES = [...PUBLIC_ROUTES, ...ADMIN_ROUTES];
