# Dynamic Role-Based Access Control (RBAC) System

This system provides flexible, database-driven access control for the application using permissions and roles.

## Overview

The RBAC system consists of:
- **Resources**: Things that can be accessed (e.g., 'teams', 'users', 'orders')
- **Permissions**: Actions that can be performed (e.g., 'view', 'create', 'update', 'delete')
- **Roles**: Collections of permissions (e.g., 'admin', 'user', 'superadmin')
- **Users**: Can have one main role and multiple team roles

## Database Structure

### Resources
```sql
resources (id, name, displayName, description, isActive)
```

### Permissions
```sql
permissions (id, name, displayName, description, isActive)
```

### Roles
```sql
roles (id, name, displayName, description, isSystem, isActive, createdBy)
```

### Role-Resource-Permission Assignments
```sql
role_resources (id, roleId, resourceId, permissionId)
```

### User Teams (for team-based roles)
```sql
user_teams (id, userId, teamId, roleId, joinedAt)
```

## Usage

### 1. Basic Permission Check

```typescript
import { AccessControl } from './decorators/access-control.decorator';

@Controller('teams')
export class TeamsController {
  @Get()
  @AccessControl({ permissions: ['teams:view'] })
  async getTeams() {
    // Only users with 'teams:view' permission can access
  }
}
```

### 2. Role-Based Access

```typescript
@Post()
@AccessControl({ roles: ['admin', 'superadmin'] })
async createTeam() {
  // Only users with 'admin' or 'superadmin' role can access
}
```

### 3. Combined Access Control

```typescript
@Put(':id')
@AccessControl({ 
  roles: ['admin', 'superadmin'],
  permissions: ['teams:edit']
})
async updateTeam() {
  // User must have admin/superadmin role AND teams:edit permission
}
```

### 4. Convenience Decorators

```typescript
import { 
  SuperAdminOnly, 
  CanManageTeams, 
  CanManageRoles 
} from './decorators/access-control.decorator';

@Get()
@CanManageTeams() // Equivalent to permissions: ['teams:create', 'teams:view', 'teams:edit', 'teams:delete']
async getTeams() {}

@Post()
@SuperAdminOnly() // Equivalent to roles: ['superadmin']
async createSystemConfig() {}
```

### 5. Programmatic Permission Checks

```typescript
import { AccessControlService } from './services/access-control.service';

@Injectable()
export class SomeService {
  constructor(private accessControl: AccessControlService) {}

  async someMethod(userId: string) {
    // Check if user has specific permission
    const canView = await this.accessControl.hasPermission(userId, 'teams:view');
    
    // Check if user has any of multiple permissions
    const canManage = await this.accessControl.hasAnyPermission(userId, ['teams:create', 'teams:edit']);
    
    // Check if user has all permissions
    const canFullyManage = await this.accessControl.hasAllPermissions(userId, ['teams:create', 'teams:view', 'teams:edit', 'teams:delete']);
    
    // Check resource-specific permission
    const canAccessTeams = await this.accessControl.canAccessResource(userId, 'teams', 'view');
  }
}
```

## Permission Naming Convention

Permissions follow the pattern: `{resource}:{action}`

Examples:
- `teams:create` - Create teams
- `teams:view` - View teams
- `teams:edit` - Update teams
- `teams:delete` - Delete teams
- `users:view` - View users
- `orders:create` - Create orders

## Setting Up Permissions

### 1. Run the Permission Seed Script

```bash
npx ts-node prisma/seed-permissions.ts
```

This creates:
- Basic resources (teams, roles, permissions, resources, users, items, orders)
- Basic permissions (view, create, update, delete)
- System roles (superadmin, admin, user)
- Permission assignments

### 2. Create Custom Roles

```typescript
// Create a new role
const teamManagerRole = await prisma.role.create({
  data: {
    name: 'team_manager',
    displayName: 'Team Manager',
    description: 'Can manage teams and team members',
    createdBy: currentUserId,
  },
});

// Assign permissions to the role
await prisma.roleResource.createMany({
  data: [
    { roleId: teamManagerRole.id, resourceId: teamsResource.id, permissionId: viewPermission.id },
    { roleId: teamManagerRole.id, resourceId: teamsResource.id, permissionId: createPermission.id },
    { roleId: teamManagerRole.id, resourceId: teamsResource.id, permissionId: updatePermission.id },
  ],
});
```

### 3. Assign Roles to Users

```typescript
// Assign main role to user
await prisma.user.update({
  where: { id: userId },
  data: { roleId: teamManagerRole.id },
});

// Assign team role to user
await prisma.userTeam.create({
  data: {
    userId: userId,
    teamId: teamId,
    roleId: teamRoleId,
  },
});
```

## Team-Based Roles

Users can have different roles in different teams:

```typescript
// User is a 'viewer' in Team A
await prisma.userTeam.create({
  data: {
    userId: 'user1',
    teamId: 'teamA',
    roleId: 'viewerRoleId',
  },
});

// User is a 'manager' in Team B
await prisma.userTeam.create({
  data: {
    userId: 'user1',
    teamId: 'teamB',
    roleId: 'managerRoleId',
  },
});
```

## Migration from Static Roles

To migrate from the old static role system:

1. Run the permission seed script
2. Update controllers to use new decorators
3. Assign appropriate roles to existing users
4. Test permission checks

## Best Practices

1. **Use specific permissions** rather than broad roles when possible
2. **Create role hierarchies** where higher roles inherit lower role permissions
3. **Use team-based roles** for project-specific access control
4. **Regularly audit permissions** to ensure users have appropriate access
5. **Use the AccessControlService** for complex permission logic in services

## Troubleshooting

### Common Issues

1. **Permission denied errors**: Check if user has the required role/permission
2. **Role not found**: Ensure user has a main role assigned
3. **Team permissions not working**: Verify user is assigned to the team with the correct role

### Debugging

```typescript
// Get all user permissions
const permissions = await accessControlService.getUserPermissions(userId);
console.log('User permissions:', permissions);

// Get all user roles
const roles = await accessControlService.getUserRoles(userId);
console.log('User roles:', roles);
```
