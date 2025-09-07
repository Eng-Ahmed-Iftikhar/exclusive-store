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
        path: '/permissions',
        icon: 'permissions',
      },
      {
        name: 'Roles',
        path: '/roles',
        icon: 'roles',
      },
      {
        name: 'Users',
        path: '/users',
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
        path: '/categories',
        icon: 'categories',
      },
      {
        name: 'Products',
        path: '/products',
        icon: 'products',
      },
      {
        name: 'Orders',
        path: '/orders',
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
