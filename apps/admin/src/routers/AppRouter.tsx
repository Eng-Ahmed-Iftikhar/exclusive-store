import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/app/Layout';
import Dashboard from '@/pages/app/DashboardPage';
import PermissionPage from '@/pages/app/management/PermissionPage';
import CreatePermissionPage from '@/pages/app/management/CreatePermissionPage';
import EditPermissionPage from '@/pages/app/management/EditPermissionPage';
import ResourcePage from '@/pages/app/management/ResourcePage';
import CreateResourcePage from '@/pages/app/management/CreateResourcePage';
import EditResourcePage from '@/pages/app/management/EditResourcePage';
import RolePage from '@/pages/app/management/RolePage';
import CreateRolePage from '@/pages/app/management/CreateRolePage';
import EditRolePage from '@/pages/app/management/EditRolePage';
import TeamsPage from '@/pages/app/management/TeamsPage';
import CreateTeamPage from '@/pages/app/management/CreateTeamPage';
import EditTeamPage from '@/pages/app/management/EditTeamPage';
import CategoryPage from '@/pages/app/contents/CategoryPage';
import CategoryDetailPage from '@/pages/app/contents/CategoryDetailPage';
import CreateCategoryPage from '@/pages/app/contents/CreateCategoryPage';
import EditCategoryPage from '@/pages/app/contents/EditCategoryPage';
import SubcategoryPage from '@/pages/app/contents/SubcategoryPage';
import SubcategoryDetailPage from '@/pages/app/contents/SubcategoryDetailPage';
import CreateSubcategoryPage from '@/pages/app/contents/CreateSubcategoryPage';
import EditSubcategoryPage from '@/pages/app/contents/EditSubcategoryPage';
import ProductPage from '@/pages/app/contents/ProductPage';
import ProductDetailPage from '@/pages/app/contents/ProductDetailPage';
import CreateProductPage from '@/pages/app/contents/CreateProductPage';
import EditProductPage from '@/pages/app/contents/EditProductPage';
import Login from '@/pages/auth/LoginPage';
import SetupPasswordPage from '@/pages/auth/SetupPasswordPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import { PUBLIC_ROUTES, ADMIN_ROUTES, ROUTES } from '@/routers/routes';
import { ProtectedRoute, GuestRoute } from '@components/ProtectedRoute';

// Component mapping for dynamic route rendering
const COMPONENT_MAP = {
  Dashboard: Dashboard,
  Permissions: PermissionPage,
  CreatePermission: CreatePermissionPage,
  EditPermission: EditPermissionPage,
  Resources: ResourcePage,
  CreateResource: CreateResourcePage,
  EditResource: EditResourcePage,
  Roles: RolePage,
  CreateRole: CreateRolePage,
  EditRole: EditRolePage,
  Teams: TeamsPage,
  CreateTeam: CreateTeamPage,
  EditTeam: EditTeamPage,
  Categories: CategoryPage,
  CategoryDetail: CategoryDetailPage,
  CreateCategory: CreateCategoryPage,
  EditCategory: EditCategoryPage,
  Subcategories: SubcategoryPage,
  SubcategoryDetail: SubcategoryDetailPage,
  CreateSubcategory: CreateSubcategoryPage,
  EditSubcategory: EditSubcategoryPage,
  Products: ProductPage,
  ProductDetail: ProductDetailPage,
  CreateProduct: CreateProductPage,
  EditProduct: EditProductPage,
  Login: Login,
  SetupPassword: SetupPasswordPage,
  ForgotPassword: ForgotPasswordPage,
  ResetPassword: ResetPasswordPage,
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
              <GuestRoute redirectTo={ROUTES.ADMIN}>
                <Component />
              </GuestRoute>
            }
          />
        );
      })}

      {/* Individual Admin Pages */}
      {ADMIN_ROUTES.map((route) => {
        const Component =
          COMPONENT_MAP[route.element as keyof typeof COMPONENT_MAP];

        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute requireAuth={true} redirectTo={ROUTES.LOGIN}>
                <AdminLayout>
                  <Component />
                </AdminLayout>
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
