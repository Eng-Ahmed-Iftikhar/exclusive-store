import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/app/Layout';

import { ProductProvider } from '@/contexts/ProductContext';
import CategoryDetailPage from '@/pages/app/contents/categories/CategoryDetailPage';
import CategoryPage from '@/pages/app/contents/categories/CategoryPage';
import CreateCategoryPage from '@/pages/app/contents/categories/CreateCategoryPage';
import CreateSubcategoryPage from '@/pages/app/contents/categories/CreateSubcategoryPage';
import EditCategoryPage from '@/pages/app/contents/categories/EditCategoryPage';
import BasicInfoPage from '@/pages/app/contents/products/BasicInfoPage';
import CreateProductPage from '@/pages/app/contents/products/CreateProductPage';
import EditProductPage from '@/pages/app/contents/products/EditProductPage';
import ImagesPage from '@/pages/app/contents/products/ImagesPage';
import ProductDetailPage from '@/pages/app/contents/products/ProductDetailPage';
import ProductPage from '@/pages/app/contents/products/ProductPage';
import ReviewPage from '@/pages/app/contents/products/ReviewPage';
import VariantsPage from '@/pages/app/contents/products/VariantsPage';
import EditSubcategoryPage from '@/pages/app/contents/subcategories/EditSubcategoryPage';
import SubcategoryDetailPage from '@/pages/app/contents/subcategories/SubcategoryDetailPage';
import SubcategoryPage from '@/pages/app/contents/subcategories/SubcategoryPage';
import Dashboard from '@/pages/app/DashboardPage';
import CreatePermissionPage from '@/pages/app/management/CreatePermissionPage';
import CreateResourcePage from '@/pages/app/management/CreateResourcePage';
import CreateRolePage from '@/pages/app/management/CreateRolePage';
import CreateTeamPage from '@/pages/app/management/CreateTeamPage';
import EditPermissionPage from '@/pages/app/management/EditPermissionPage';
import EditResourcePage from '@/pages/app/management/EditResourcePage';
import EditRolePage from '@/pages/app/management/EditRolePage';
import EditTeamPage from '@/pages/app/management/EditTeamPage';
import PermissionPage from '@/pages/app/management/PermissionPage';
import ResourcePage from '@/pages/app/management/ResourcePage';
import RolePage from '@/pages/app/management/RolePage';
import TeamsPage from '@/pages/app/management/TeamsPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import Login from '@/pages/auth/LoginPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import SetupPasswordPage from '@/pages/auth/SetupPasswordPage';
import {
  ADMIN_ROUTES,
  AppRoute,
  PUBLIC_ROUTES,
  ROUTES,
} from '@/routers/routes';
import { GuestRoute, ProtectedRoute } from '@components/ProtectedRoute';

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
  CreateProductBasic: BasicInfoPage,
  CreateProductVariants: VariantsPage,
  CreateProductImages: ImagesPage,
  CreateProductReview: ReviewPage,
  EditProduct: EditProductPage,
  EditProductBasic: BasicInfoPage,
  EditProductVariants: VariantsPage,
  EditProductImages: ImagesPage,
  EditProductReview: ReviewPage,
  Login: Login,
  SetupPassword: SetupPasswordPage,
  ForgotPassword: ForgotPasswordPage,
  ResetPassword: ResetPasswordPage,
};

const PROVIDER_MAP = {
  ProductProvider,
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

      {/* Other Admin Pages (without ProductContext) */}
      {ADMIN_ROUTES.map((route) => {
        const Component =
          COMPONENT_MAP[route.element as keyof typeof COMPONENT_MAP];
        const Provider =
          PROVIDER_MAP[route.provider as keyof typeof PROVIDER_MAP] ||
          React.Fragment;
        const childrens = route.childrens || [];

        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute requireAuth={true} redirectTo={ROUTES.LOGIN}>
                <AdminLayout>
                  <Provider>
                    {childrens.length > 0 ? (
                      <SubRoutes routes={childrens} />
                    ) : (
                      <Component />
                    )}
                  </Provider>
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

const SubRoutes = ({ routes }: { routes: AppRoute[] }) => {
  return (
    <Routes>
      {routes.map((route) => {
        const Component =
          COMPONENT_MAP[route.element as keyof typeof COMPONENT_MAP];
        const Provider =
          PROVIDER_MAP[route.provider as keyof typeof PROVIDER_MAP] ||
          React.Fragment;
        const childrens = route.childrens || [];

        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Provider>
                {childrens.length > 0 ? (
                  <SubRoutes routes={childrens} />
                ) : (
                  <Component />
                )}
              </Provider>
            }
          />
        );
      })}
    </Routes>
  );
};

export default AppRouter;
