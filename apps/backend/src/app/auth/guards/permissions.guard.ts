import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from '../services/access-control.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user roles from the roles array (contains role names as strings)
    const userRoles: string[] = user.roles || [];

    if (userRoles.length === 0) {
      throw new ForbiddenException('User has no roles assigned');
    }

    // Superadmin bypass - if user is superadmin, they have all permissions
    if (userRoles.includes('super-admin')) {
      return true;
    }

    // Check if user has all required permissions
    const hasAllPermissions = await this.accessControlService.hasAllPermissions(
      user.id,
      requiredPermissions
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Access denied. Required permissions: ${requiredPermissions.join(', ')}`
      );
    }

    return true;
  }
}
