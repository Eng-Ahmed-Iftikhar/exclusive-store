import { useLazyGetCurrentUserQuery } from '@/apis/services/authApi';
import { AppDispatch, RootState } from '@/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, lastFetched } = useSelector(
    (state: RootState) => state.user
  );
  const { token } = useSelector((state: RootState) => state.auth);
  const [currentUser] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    const checkAuth = async () => {
      // If we have a token but no user data, fetch user profile
      if (token && !user && !isLoading) {
        try {
          await currentUser().unwrap();
        } catch (error) {
          // If fetching user profile fails, clear auth and redirect to login
          console.error('Failed to fetch user profile:', error);
          navigate(redirectTo, { replace: true, state: { from: location } });
          return;
        }
      }

      // If we need authentication but user is not authenticated
      if (requireAuth && !user && !isLoading) {
        navigate(redirectTo, { replace: true, state: { from: location } });
        return;
      }

      // If we don't need authentication but user is authenticated, redirect to dashboard
      if (!requireAuth && user) {
        navigate('/dashboard', { replace: true });
        return;
      }
    };

    checkAuth();
  }, [
    token,
    user,
    isLoading,
    requireAuth,
    navigate,
    redirectTo,
    location,
    dispatch,
    currentUser,
  ]);

  // Show loading while checking authentication
  if (isLoading || (token && !user && !lastFetched)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If we need auth and user is not authenticated, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If we don't need auth and user is authenticated, don't render children
  if (!requireAuth && user) {
    return null;
  }

  // Render children if authentication requirements are met
  return children;
};

// Guest route component (opposite of protected route)
export const GuestRoute: React.FC<Omit<ProtectedRouteProps, 'requireAuth'>> = (
  props
) => <ProtectedRoute {...props} requireAuth={false} />;
