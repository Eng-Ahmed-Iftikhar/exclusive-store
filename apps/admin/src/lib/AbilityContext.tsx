import React, { useMemo } from 'react';
import {
  createAbility,
  createDefaultAbility,
  PermissionString,
  Actions,
  Subjects,
} from './abilities';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

/**
 * Ability Provider Component
 * Provides CASL abilities to the entire application based on user permissions
 */
export const AbilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return children as React.ReactElement;
};

/**
 * Hook to access CASL abilities
 */
export const useAbility = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return useMemo(() => {
    if (!user || !user.permissions) {
      return createDefaultAbility();
    }
    return createAbility(user.permissions as PermissionString[], user.role);
  }, [user]);
};

/**
 * Hook to check if user can perform an action on a subject
 */
export const useCan = () => {
  const ability = useAbility();
  return (action: string, subject: string) =>
    ability.can(action as Actions, subject as Subjects);
};

/**
 * Hook to check if user cannot perform an action on a subject
 */
export const useCannot = () => {
  const ability = useAbility();
  return (action: string, subject: string) =>
    ability.cannot(action as Actions, subject as Subjects);
};

/**
 * Hook to get user permissions
 */
export const usePermissions = () => {
  const { user } = useSelector((state: RootState) => state.user);
  return user?.permissions || [];
};

/**
 * Hook to check if user has specific permission
 */
export const useHasPermission = (resource: string, action: string) => {
  const ability = useAbility();
  return ability.can(action as Actions, resource as Subjects);
};

/**
 * Hook to check if user can manage a resource
 */
export const useCanManage = (resource: string) => {
  const ability = useAbility();
  return (
    ability.can('manage', resource as Subjects) ||
    ability.can('edit', resource as Subjects) ||
    ability.can('delete', resource as Subjects)
  );
};
