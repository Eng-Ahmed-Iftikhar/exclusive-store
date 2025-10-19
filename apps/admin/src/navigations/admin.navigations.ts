export interface NavigationItem {
  name: string;
  path?: string;
  icon: string;
  isParent?: boolean;
  children?: NavigationItem[];
  permission?: {
    action: string;
    subject: string;
  };
}

const adminNavigations: NavigationItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
  },
  {
    isParent: true,
    name: 'Management',
    icon: 'products',
    children: [
      {
        name: 'Permissions',
        path: '/management/permissions',
        icon: 'permissions',
        permission: {
          action: 'view',
          subject: 'permissions',
        },
      },
      {
        name: 'Resources',
        path: '/management/resources',
        icon: 'resources',
        permission: {
          action: 'view',
          subject: 'resources',
        },
      },
      {
        name: 'Roles',
        path: '/management/roles',
        icon: 'roles',
        permission: {
          action: 'view',
          subject: 'roles',
        },
      },
      {
        name: 'Teams',
        path: '/management/teams',
        icon: 'teams',
        permission: {
          action: 'view',
          subject: 'teams',
        },
      },
    ],
  },
  {
    isParent: true,
    name: 'Content',
    icon: 'content',
    children: [
      {
        name: 'Categories',
        path: '/content/categories',
        icon: 'categories',
        permission: {
          action: 'view',
          subject: 'categories',
        },
      },

      {
        name: 'Subcategories',
        path: '/content/subcategories',
        icon: 'products',
        permission: {
          action: 'view',
          subject: 'subcategories',
        },
      },
      {
        name: 'Products',
        path: '/content/products',
        icon: 'products',
        permission: {
          action: 'view',
          subject: 'products',
        },
      },
    ],
  },
  {
    isParent: true,
    name: 'Finance',
    icon: 'finance',
    children: [
      {
        name: 'Live Orders',
        path: '/finance/live-orders',
        icon: 'orders',
        permission: {
          action: 'view',
          subject: 'orders',
        },
      },
      {
        name: 'Order History',
        path: '/finance/order-history',
        icon: 'history',
        permission: {
          action: 'view',
          subject: 'orders',
        },
      },
      {
        name: 'Transactions',
        path: '/finance/transactions',
        icon: 'transactions',
        permission: {
          action: 'view',
          subject: 'transactions',
        },
      },
      {
        name: 'Financial Dashboard',
        path: '/finance/dashboard',
        icon: 'dashboard',
        permission: {
          action: 'view',
          subject: 'finance',
        },
      },
    ],
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: 'analytics',
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'settings',
  },
];

export default adminNavigations;
