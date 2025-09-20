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
      },
      {
        name: 'Products',
        path: '/content/products',
        icon: 'products',
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
