import { useLazyGetCurrentUserQuery } from '@/apis/services/authApi';
import { RootState } from '@/store';
import React, { useCallback, useEffect } from 'react';
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
  const [currentUser, { isLoading }] = useLazyGetCurrentUserQuery();

  const getCurrentUser = useCallback(async () => {
    if (token) {
      const response = await currentUser().unwrap();
      return response;
    }
    return null;
  }, [token, currentUser]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
