# Role-Based Access Control (RBAC) with CASL

This implementation provides a comprehensive role-based access control system using React CASL library for the admin panel.

## Overview

The RBAC system is built around the following components:

1. **Backend Integration**: Updated `/me` API to include user permissions
2. **CASL Abilities**: Permission definitions and ability creation
3. **Permission Guards**: React components for conditional rendering
4. **Navigation Protection**: Sidebar navigation with permission checks
5. **Component Protection**: Individual components protected by permissions

## Permission Format

Permissions are stored as strings in the format: `"resource:action"`

Examples:

- `"permissions:view"` - Can view permissions
- `"permissions:create"` - Can create permissions
- `"permissions:edit"` - Can edit permissions
- `"permissions:delete"` - Can delete permissions
- `"permissions:manage"` - Can perform all actions on permissions

## Usage Examples

### 1. Protecting Components

```tsx
import { PermissionGuard } from '@/components/PermissionGuard';

// Protect a button
<PermissionGuard action="create" subject="permission">
  <button onClick={handleCreate}>Create Permission</button>
</PermissionGuard>

// Protect with fallback
<PermissionGuard
  action="view"
  subject="permission"
  fallback={<div>Access Denied</div>}
>
  <PermissionTable />
</PermissionGuard>
```

### 2. Using Hooks

```tsx
import { useHasPermission, useCanManage } from '@/lib/AbilityContext';

function MyComponent() {
  const canView = useHasPermission('permissions', 'view');
  const canManage = useCanManage('permissions');

  return (
    <div>
      {canView && <div>View content</div>}
      {canManage && <div>Management content</div>}
    </div>
  );
}
```

### 3. Navigation Protection

Navigation items are automatically protected based on their permission configuration:

```tsx
// In admin.navigations.ts
{
  name: 'Permissions',
  path: '/management/permissions',
  icon: 'permissions',
  permission: {
    action: 'view',
    subject: 'permissions',
  },
}
```

## Available Permissions

The system defines the following permission constants:

```tsx
import { PERMISSIONS } from '@/lib/abilities';

// Permission management
PERMISSIONS.PERMISSIONS_VIEW;
PERMISSIONS.PERMISSIONS_CREATE;
PERMISSIONS.PERMISSIONS_EDIT;
PERMISSIONS.PERMISSIONS_DELETE;
PERMISSIONS.PERMISSIONS_MANAGE;

// Resource management
PERMISSIONS.RESOURCES_VIEW;
PERMISSIONS.RESOURCES_CREATE;
// ... etc
```

## Backend Integration

The backend `/me` API now returns user permissions in the following format:

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "permissions": ["permissions:view", "permissions:create", "resources:view", "roles:manage"]
  }
}
```

## Database Structure

Permissions are derived from the RBAC tables:

- `roles` - User roles
- `resources` - System resources (permissions, resources, roles, teams)
- `permissions` - Available actions (view, create, edit, delete, manage)
- `role_resources` - Junction table linking roles to resource-permission combinations

## Security Features

1. **Client-side Protection**: UI elements are hidden/shown based on permissions
2. **Server-side Validation**: Backend validates permissions for API endpoints
3. **Navigation Filtering**: Sidebar only shows accessible routes
4. **Component Guards**: Individual components check permissions before rendering
5. **Super-Admin Bypass**: Users with `super-admin` or `super_admin` role have unrestricted access to everything

## Super-Admin Role

Users with the `super-admin` or `super_admin` role have unrestricted access to all features and bypass all permission checks. This is useful for:

- System administrators who need full access
- Emergency access scenarios
- Initial setup and configuration

The super-admin bypass is implemented at multiple levels:

- **CASL Abilities**: Automatically grants `can('all', 'all')` permissions
- **Permission Guards**: Bypasses all permission checks in components
- **Navigation**: Shows all navigation items regardless of permissions

## Testing Permissions

To test the permission system:

1. Create a user with specific permissions
2. Assign permissions to roles
3. Assign roles to users
4. Login and verify UI elements are shown/hidden correctly
5. Test super-admin role by setting user role to `super-admin` or `super_admin`

## Future Enhancements

- [ ] Permission caching for better performance
- [ ] Dynamic permission updates without page refresh
- [ ] Permission inheritance from team roles
- [ ] Audit logging for permission changes
- [ ] Bulk permission operations
