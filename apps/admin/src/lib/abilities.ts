import { Ability, AbilityBuilder, createMongoAbility } from '@casl/ability';

// Define the subjects (resources) that can be acted upon
export type Subjects =
  | 'permission'
  | 'resource'
  | 'role'
  | 'team'
  | 'user'
  | 'dashboard'
  | 'category'
  | 'subcategory'
  | 'product'
  | 'order'
  | 'finance'
  | 'transactions'
  | 'payment'
  | 'review'
  | 'favorite'
  | 'rating'
  | 'cart'
  | 'all';

// Define the actions that can be performed
export type Actions = 'view' | 'create' | 'edit' | 'delete' | 'manage' | 'all';

// Define the ability type
export type AppAbility = Ability<[Actions, Subjects]>;

// Define the permission string format: "resource:action"
export type PermissionString = `${string}:${string}`;

/**
 * Creates abilities based on user permissions
 * @param permissions Array of permission strings in format "resource:action"
 * @param userRole Optional user role to check for super-admin
 * @returns CASL Ability instance
 */
export function createAbility(
  permissions: PermissionString[],
  userRole?: string
): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  // If user has no permissions, they can't do anything
  if (!permissions || permissions.length === 0) {
    cannot('all', 'all');
    return build();
  }

  // Parse permissions and create abilities
  permissions.forEach((permission) => {
    const [resource, action] = permission.split(':');

    if (resource && action) {
      // Handle specific resource:action combinations
      if (action === 'manage') {
        // 'manage' means all actions on the resource
        can(['view', 'create', 'edit', 'delete'], resource as Subjects);
      } else {
        // Specific action on specific resource
        can(action as Actions, resource as Subjects);
      }
    }
  });

  return build();
}

/**
 * Default ability for unauthenticated users
 */
export function createDefaultAbility(): AppAbility {
  const { cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  cannot('all', 'all');
  return build();
}

/**
 * Permission constants for easy reference
 */
export const PERMISSIONS = {
  // Permission management
  PERMISSIONS_VIEW: 'permissions:view',
  PERMISSIONS_CREATE: 'permissions:create',
  PERMISSIONS_EDIT: 'permissions:edit',
  PERMISSIONS_DELETE: 'permissions:delete',
  PERMISSIONS_MANAGE: 'permissions:manage',

  // Resource management
  RESOURCES_VIEW: 'resources:view',
  RESOURCES_CREATE: 'resources:create',
  RESOURCES_EDIT: 'resources:edit',
  RESOURCES_DELETE: 'resources:delete',
  RESOURCES_MANAGE: 'resources:manage',

  // Role management
  ROLES_VIEW: 'roles:view',
  ROLES_CREATE: 'roles:create',
  ROLES_EDIT: 'roles:edit',
  ROLES_DELETE: 'roles:delete',
  ROLES_MANAGE: 'roles:manage',

  // Team management
  TEAMS_VIEW: 'teams:view',
  TEAMS_CREATE: 'teams:create',
  TEAMS_EDIT: 'teams:edit',
  TEAMS_DELETE: 'teams:delete',
  TEAMS_MANAGE: 'teams:manage',

  // User management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE: 'users:manage',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',

  // Super admin
  ALL_ALL: 'all:all',
} as const;

/**
 * Helper function to check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: PermissionString[],
  resource: Subjects,
  action: Actions,
  userRole?: string
): boolean {
  const ability = createAbility(userPermissions, userRole);
  return ability.can(action, resource);
}

/**
 * Helper function to check if a user can manage a resource
 */
export function canManage(
  userPermissions: PermissionString[],
  resource: Subjects,
  userRole?: string
): boolean {
  return (
    hasPermission(userPermissions, resource, 'manage', userRole) ||
    hasPermission(userPermissions, resource, 'edit', userRole) ||
    hasPermission(userPermissions, resource, 'delete', userRole)
  );
}
