import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/app/Layout';
import Dashboard from '@/pages/DashboardPage';
import Login from '@/pages/auth/LoginPage';
import { PUBLIC_ROUTES, ADMIN_ROUTES, ROUTES } from '@/routers/routes';
import { ProtectedRoute, GuestRoute } from '@components/ProtectedRoute';

// Component mapping for dynamic route rendering
const COMPONENT_MAP = {
  Dashboard: Dashboard,
  Login: Login,
};

// Main Router Component
const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {PUBLIC_ROUTES.map((route) => {
        const Component =
          COMPONENT_MAP[route.element as keyof typeof COMPONENT_MAP];
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <GuestRoute>
                <Component />
              </GuestRoute>
            }
          />
        );
      })}

      {/* Protected Admin Routes */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      {/* Individual Admin Pages */}
      {ADMIN_ROUTES.map((route) => {
        if (route.path === ROUTES.ADMIN) return null; // Skip dashboard as it's handled above
        const Component =
          COMPONENT_MAP[route.element as keyof typeof COMPONENT_MAP];
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
          />
        );
      })}

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to={ROUTES.ADMIN} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.ADMIN} replace />} />
    </Routes>
  );
};

export default AppRouter;
