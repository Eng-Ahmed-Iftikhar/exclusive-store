import { RouteProps } from 'react-router-dom';

export type AppRoute = RouteProps & {
  name: string;
  icon?: string;
  childrens?: AppRoute[];
  provider?: string;
};

const MANAGEMENT_ROUTES = {
  ADMIN_MANAGEMENT: '/management',
  ADMIN_PERMISSIONS: '/permissions',
  ADMIN_CREATE_PERMISSION: '/permissions/create',
  ADMIN_EDIT_PERMISSION: '/permissions/:id/edit',
  ADMIN_RESOURCES: '/resources',
  ADMIN_CREATE_RESOURCE: '/resources/create',
  ADMIN_EDIT_RESOURCE: '/resources/:id/edit',
  ADMIN_ROLES: '/roles',
  ADMIN_CREATE_ROLE: '/roles/create',
  ADMIN_EDIT_ROLE: '/roles/:id/edit',
  ADMIN_TEAMS: '/teams',
  ADMIN_CREATE_TEAM: '/teams/create',
  ADMIN_EDIT_TEAM: '/teams/:id/edit',
};

const CONTENT_ROUTES = {
  ADMIN_CONTENT: '/content',
  ADMIN_CATEGORIES: '/categories',
  ADMIN_CATEGORY_DETAIL: '/categories/:id',
  ADMIN_CREATE_CATEGORY: '/categories/create',
  ADMIN_EDIT_CATEGORY: '/categories/:id/edit',
  ADMIN_SUBCATEGORIES: '/subcategories',
  ADMIN_SUBCATEGORY_DETAIL: '/subcategories/:id',
  ADMIN_CREATE_SUBCATEGORY: '/subcategories/create',
  ADMIN_EDIT_SUBCATEGORY: '/subcategories/:id/edit',
  ADMIN_PRODUCTS: '/products',
  ADMIN_PRODUCT_DETAIL: '/products/:productId',
  ADMIN_CREATE_PRODUCT: '/products/create/*',
  ADMIN_CREATE_PRODUCT_BASIC: '/basic-info',
  ADMIN_CREATE_PRODUCT_VARIANTS: '/variants',
  ADMIN_CREATE_PRODUCT_IMAGES: '/images',
  ADMIN_CREATE_PRODUCT_REVIEW: '/review',
  ADMIN_EDIT_PRODUCT: '/products/:productId/edit/*',
  ADMIN_EDIT_PRODUCT_BASIC: '/basic-info',
  ADMIN_EDIT_PRODUCT_VARIANTS: '/variants',
  ADMIN_EDIT_PRODUCT_IMAGES: '/images',
  ADMIN_EDIT_PRODUCT_REVIEW: '/review',
};

const FINANCE_ROUTES = {
  ADMIN_FINANCE: '/finance',
  ADMIN_FINANCE_DASHBOARD: '/finance/dashboard',
  ADMIN_LIVE_ORDERS: '/finance/live-orders',
  ADMIN_ORDER_DETAIL: '/finance/orders/:id',
  ADMIN_ORDER_HISTORY: '/finance/order-history',
  ADMIN_TRANSACTIONS: '/finance/transactions',
  ADMIN_TRANSACTION_DETAIL: '/finance/transactions/:id',
  ADMIN_INVOICE: '/finance/invoice/:id',
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
  // finance routes
  ...FINANCE_ROUTES,

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
  CATEGORY_DETAIL: 'Category Detail',
  CREATE_CATEGORY: 'Create Category',
  EDIT_CATEGORY: 'Edit Category',
  SUBCATEGORIES: 'Subcategories',
  SUBCATEGORY_DETAIL: 'Subcategory Detail',
  CREATE_SUBCATEGORY: 'Create Subcategory',
  EDIT_SUBCATEGORY: 'Edit Subcategory',
  PRODUCT_DETAIL: 'Product Detail',
  CREATE_PRODUCT: 'Create Product',
  CREATE_PRODUCT_BASIC: 'Create Product - Basic Info',
  CREATE_PRODUCT_VARIANTS: 'Create Product - Variants',
  CREATE_PRODUCT_IMAGES: 'Create Product - Images',
  CREATE_PRODUCT_REVIEW: 'Create Product - Review',
  EDIT_PRODUCT: 'Edit Product',
  EDIT_PRODUCT_BASIC: 'Edit Product - Basic Info',
  EDIT_PRODUCT_VARIANTS: 'Edit Product - Variants',
  EDIT_PRODUCT_IMAGES: 'Edit Product - Images',
  EDIT_PRODUCT_REVIEW: 'Edit Product - Review',
  FINANCE_DASHBOARD: 'Financial Dashboard',
  LIVE_ORDERS: 'Live Orders',
  ORDER_DETAIL: 'Order Detail',
  ORDER_HISTORY: 'Order History',
  TRANSACTIONS: 'Transactions',
  TRANSACTION_DETAIL: 'Transaction Detail',
  INVOICE: 'Invoice',
  SETUP_PASSWORD: 'Setup Password',
  FORGOT_PASSWORD: 'Forgot Password',
  RESET_PASSWORD: 'Reset Password',
} as const;

// Public Routes Array
export const PUBLIC_ROUTES: AppRoute[] = [
  {
    path: ROUTES.LOGIN,
    icon: 'login',
    name: ROUTE_NAMES.LOGIN,
    element: 'Login',
    index: true,
  },
  {
    path: ROUTES.ADMIN_SETUP_PASSWORD,
    icon: 'setup-password',
    name: ROUTE_NAMES.SETUP_PASSWORD,
    element: 'SetupPassword',
  },
  {
    path: ROUTES.ADMIN_FORGOT_PASSWORD,
    icon: 'forgot-password',
    name: ROUTE_NAMES.FORGOT_PASSWORD,
    element: 'ForgotPassword',
  },
  {
    path: ROUTES.ADMIN_RESET_PASSWORD,
    icon: 'reset-password',
    name: ROUTE_NAMES.RESET_PASSWORD,
    element: 'ResetPassword',
  },
];

// Admin Routes Array
export const ADMIN_ROUTES: AppRoute[] = [
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
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_CATEGORY_DETAIL,
    name: ROUTE_NAMES.CATEGORY_DETAIL,
    element: 'CategoryDetail',
    icon: 'category-detail',
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
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_PRODUCTS,
    name: ROUTE_NAMES.PRODUCTS,
    element: 'Products',
    icon: 'products',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_PRODUCT_DETAIL,
    name: ROUTE_NAMES.PRODUCT_DETAIL,
    element: 'ProductDetail',
    icon: 'product-detail',
  },
  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_CREATE_PRODUCT,
    name: ROUTE_NAMES.CREATE_PRODUCT,
    provider: 'ProductProvider',
    childrens: [
      {
        path: '/',
        name: ROUTE_NAMES.CREATE_PRODUCT,
        element: 'CreateProduct',
        icon: 'create-product',
        index: true,
      },
    ],
  },

  {
    path: ROUTES.ADMIN_CONTENT + ROUTES.ADMIN_EDIT_PRODUCT,
    name: ROUTE_NAMES.EDIT_PRODUCT,
    provider: 'ProductProvider',
    childrens: [
      {
        path: '/',
        name: ROUTE_NAMES.EDIT_PRODUCT,
        element: 'EditProduct',
        icon: 'edit-product',
        index: true,
      },
      {
        path: ROUTES.ADMIN_EDIT_PRODUCT_BASIC,
        name: ROUTE_NAMES.EDIT_PRODUCT_BASIC,
        element: 'EditProductBasic',
        icon: 'edit-product-basic',
      },
      {
        path: ROUTES.ADMIN_EDIT_PRODUCT_VARIANTS,
        name: ROUTE_NAMES.EDIT_PRODUCT_VARIANTS,
        element: 'EditProductVariants',
        icon: 'edit-product-variants',
      },
      {
        path: ROUTES.ADMIN_EDIT_PRODUCT_IMAGES,
        name: ROUTE_NAMES.EDIT_PRODUCT_IMAGES,
        element: 'EditProductImages',
        icon: 'edit-product-images',
      },
      {
        path: ROUTES.ADMIN_EDIT_PRODUCT_REVIEW,
        name: ROUTE_NAMES.EDIT_PRODUCT_REVIEW,
        element: 'EditProductReview',
        icon: 'edit-product-review',
      },
    ],
  },
  {
    path: ROUTES.ADMIN_FINANCE_DASHBOARD,
    name: ROUTE_NAMES.FINANCE_DASHBOARD,
    element: 'FinancialDashboard',
    icon: 'dashboard',
  },
  {
    path: ROUTES.ADMIN_LIVE_ORDERS,
    name: ROUTE_NAMES.LIVE_ORDERS,
    element: 'LiveOrders',
    icon: 'orders',
  },
  {
    path: ROUTES.ADMIN_ORDER_DETAIL,
    name: ROUTE_NAMES.ORDER_DETAIL,
    element: 'OrderDetail',
    icon: 'order-detail',
  },
  {
    path: ROUTES.ADMIN_ORDER_HISTORY,
    name: ROUTE_NAMES.ORDER_HISTORY,
    element: 'OrderHistory',
    icon: 'history',
  },
  {
    path: ROUTES.ADMIN_TRANSACTIONS,
    name: ROUTE_NAMES.TRANSACTIONS,
    element: 'Transactions',
    icon: 'transactions',
  },
  {
    path: ROUTES.ADMIN_TRANSACTION_DETAIL,
    name: ROUTE_NAMES.TRANSACTION_DETAIL,
    element: 'TransactionDetail',
    icon: 'transaction-detail',
  },
  {
    path: ROUTES.ADMIN_INVOICE,
    name: ROUTE_NAMES.INVOICE,
    element: 'Invoice',
    icon: 'invoice',
  },
];

// All Routes Array (for router configuration)
export const ALL_ROUTES = [...PUBLIC_ROUTES, ...ADMIN_ROUTES];
