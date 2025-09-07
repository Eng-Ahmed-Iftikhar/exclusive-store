export interface NavigationItem {
  name: string;
  path?: string;
  icon: string;
  isParent?: boolean;
  children?: NavigationItem[];
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
      },
      {
        name: 'Roles',
        path: '/management/roles',
        icon: 'roles',
      },
      {
        name: 'Users',
        path: '/management/users',
        icon: 'users',
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
      },
      {
        name: 'Products',
        path: '/content/products',
        icon: 'products',
      },
      {
        name: 'Orders',
        path: '/content/orders',
        icon: 'orders',
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
