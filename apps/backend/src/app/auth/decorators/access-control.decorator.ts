import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Roles } from './roles.decorator';
import { Permissions } from './permissions.decorator';

export interface AccessControlOptions {
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL roles/permissions. If false, user needs ANY of them.
}

export function AccessControl(options: AccessControlOptions) {
  const decorators = [
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('JWT-auth'),
    ApiForbiddenResponse({
      description: 'Access denied. Insufficient permissions.',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Access denied' },
          error: { type: 'string', example: 'Forbidden' },
        },
      },
    }),
  ];

  // Add role-based access control
  if (options.roles && options.roles.length > 0) {
    decorators.push(UseGuards(RolesGuard));
    decorators.push(Roles(...options.roles));
  }

  // Add permission-based access control
  if (options.permissions && options.permissions.length > 0) {
    decorators.push(UseGuards(PermissionsGuard));
    decorators.push(Permissions(...options.permissions));
  }

  return applyDecorators(...decorators);
}

// Convenience decorators for common access patterns
export function SuperAdminOnly() {
  return AccessControl({ roles: ['super-admin'] });
}

export function AdminOrSuperAdmin() {
  return AccessControl({ roles: ['admin', 'super-admin'] });
}

export function CanManageTeams(permission: string) {
  return AccessControl({
    permissions: [
      'teams:create',
      'teams:view',
      'teams:edit',
      'teams:delete',
    ].filter((p) => p.includes(permission)),
  });
}

export function CanManageRoles(permission: string) {
  return AccessControl({
    permissions: [
      'roles:create',
      'roles:view',
      'roles:edit',
      'roles:delete',
    ].filter((p) => p.includes(permission)),
  });
}

export function CanManagePermissions(permission: string) {
  return AccessControl({
    permissions: [
      'permissions:create',
      'permissions:view',
      'permissions:edit',
      'permissions:delete',
    ].filter((p) => p.includes(permission)),
  });
}

export function CanManageCategories(permission: string) {
  return AccessControl({
    permissions: [
      'categories:create',
      'categories:view',
      'categories:edit',
      'categories:delete',
    ].filter((p) => p.includes(permission)),
  });
}
export function CanManageResources(permission: string) {
  return AccessControl({
    permissions: [
      'resources:create',
      'resources:view',
      'resources:edit',
      'resources:delete',
    ].filter((p) => p.includes(permission)),
  });
}
