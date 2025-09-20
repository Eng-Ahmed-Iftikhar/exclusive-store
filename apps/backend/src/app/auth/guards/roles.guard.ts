import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
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

    // Superadmin bypass - if user is superadmin, they have access to everything
    if (userRoles.includes('super-admin')) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(
          ', '
        )}. User roles: ${userRoles.join(', ')}`
      );
    }

    return true;
  }
}
