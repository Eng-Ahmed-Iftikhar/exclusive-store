import React from 'react';
import { useAbility } from '../lib/AbilityContext';
import { Actions, Subjects } from '../lib/abilities';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PermissionGuardProps {
  children: React.ReactNode;
  action: Actions;
  subject: Subjects;
  fallback?: React.ReactNode;
  requireAll?: boolean; // If true, user must have ALL permissions, not just one
  permissions?: Array<{ action: Actions; subject: Subjects }>;
}

/**
 * Permission Guard Component
 * Renders children only if user has the required permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  action,
  subject,
  fallback = null,
  requireAll = false,
  permissions,
}) => {
  const ability = useAbility();
  const { user } = useSelector((state: RootState) => state.user);

  // Super-admin bypasses all permission checks
  if (
    user?.roles.includes('super-admin') ||
    user?.roles.includes('super_admin')
  ) {
    return children as React.ReactElement;
  }

  // If specific permissions are provided, check those
  if (permissions) {
    const hasPermission = requireAll
      ? permissions.every(({ action: permAction, subject: permSubject }) =>
          ability.can(permAction, permSubject)
        )
      : permissions.some(({ action: permAction, subject: permSubject }) =>
          ability.can(permAction, permSubject)
        );

    return hasPermission
      ? (children as React.ReactElement)
      : (fallback as React.ReactElement);
  }

  // Check single permission
  const hasPermission = ability.can(action, subject);

  return hasPermission
    ? (children as React.ReactElement)
    : (fallback as React.ReactElement);
};

/**
 * Higher-order component for permission-based rendering
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  action: Actions,
  subject: Subjects,
  fallback?: React.ReactNode
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGuard action={action} subject={subject} fallback={fallback}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}

/**
 * Hook-based permission guard for conditional rendering
 */
export const usePermissionGuard = (
  action: Actions,
  subject: Subjects
): boolean => {
  const ability = useAbility();
  return ability.can(action, subject);
};

/**
 * Multiple permissions guard
 */
interface MultiplePermissionsGuardProps {
  children: React.ReactNode;
  permissions: Array<{ action: Actions; subject: Subjects }>;
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const MultiplePermissionsGuard: React.FC<
  MultiplePermissionsGuardProps
> = ({ children, permissions, requireAll = false, fallback = null }) => {
  const ability = useAbility();
  const { user } = useSelector((state: RootState) => state.user);

  // Super-admin bypasses all permission checks
  if (
    user?.roles.includes('super-admin') ||
    user?.roles.includes('super_admin')
  ) {
    return children as React.ReactElement;
  }

  const hasPermission = requireAll
    ? permissions.every(({ action, subject }) => ability.can(action, subject))
    : permissions.some(({ action, subject }) => ability.can(action, subject));

  return hasPermission
    ? (children as React.ReactElement)
    : (fallback as React.ReactElement);
};
