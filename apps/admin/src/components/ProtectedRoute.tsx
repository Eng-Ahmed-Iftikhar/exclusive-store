import { useLazyGetCurrentUserQuery } from '@/apis/services/authApi';
import { RootState } from '@/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth,
  redirectTo = '/login',
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { token } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser] = useLazyGetCurrentUserQuery();

  const getCurrentUser = useCallback(async () => {
    if (token && !user) {
      const response = await currentUser().unwrap();

      return response;
    }
    return null;
  }, [token, currentUser, user]);

  useEffect(() => {
    getCurrentUser().finally(() => {
      setLoading(false);
    });
  }, [getCurrentUser]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-slate-100"></div>
      </div>
    );
  }

  if (!user && requireAuth) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

// Guest route component (opposite of protected route)
export const GuestRoute: React.FC<Omit<ProtectedRouteProps, 'requireAuth'>> = ({
  ...props
}) => {
  const { user } = useSelector((state: RootState) => state.user);

  if (user) {
    return <Navigate to={props.redirectTo as string} />;
  }
  return <ProtectedRoute {...props} requireAuth={false} />;
};
