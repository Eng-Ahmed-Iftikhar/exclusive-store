import { createRouter, createWebHistory } from 'vue-router';
import ForgotPasswordView from '../features/auth/views/ForgotPasswordView.vue';
import LoginView from '../features/auth/views/LoginView.vue';
import ResetPasswordView from '../features/auth/views/ResetPasswordView.vue';
import SignupView from '../features/auth/views/SignupView.vue';
import GoogleCallbackView from '../views/auth/GoogleCallback.vue';
import HomeView from '../features/home/views/HomeView.vue';
import { useAuthStore } from '../stores';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../features/contact/views/ContactView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
      meta: { requiresGuest: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/auth/google/callback',
      name: 'google-callback',
      component: GoogleCallbackView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../features/about/views/AboutView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../features/products/views/ProductsView.vue'),
    },
    {
      path: '/products/:id',
      name: 'single-product',
      component: () =>
        import('../features/products/views/SingleProductView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../features/dashboard/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../features/profile/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../features/favorites/views/FavoritesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../features/checkout/views/CheckoutView.vue'),
    },
    {
      path: '/order-success/:orderId',
      name: 'order-success',
      component: () =>
        import('../features/checkout/views/OrderSuccessView.vue'),
    },
  ],
});

// Route guards
router.beforeEach(async (to, from, next) => {
  console.log('Route guard - navigating to:', to.path);
  const authStore = useAuthStore();

  // Wait for auth store to be initialized if it hasn't been yet
  if (!authStore.getIsInitialized) {
    console.log('Route guard - initializing auth store...');
    await authStore.initializeFromStorage();
  }

  const isAuthenticated = authStore.isAuthenticated;
  console.log('isAuthenticated', isAuthenticated);

  console.log('Route guard - isAuthenticated:', isAuthenticated);

  // Routes that require guest access (not logged in)
  if (to.meta.requiresGuest && isAuthenticated) {
    console.log(
      'Route guard - user is authenticated, redirecting from guest page to home'
    );
    // If user is logged in and tries to access auth pages, redirect to home
    next('/');
    return;
  }

  // Routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log(
      'Route guard - user is not authenticated, redirecting to login'
    );
    // If user is not logged in and tries to access protected pages, redirect to login with redirect URL
    const redirectTo = encodeURIComponent(to.fullPath);
    next(`/login?redirectTo=${redirectTo}`);
    return;
  }

  console.log('Route guard - allowing navigation to:', to.path);
  next();
});

export default router;
