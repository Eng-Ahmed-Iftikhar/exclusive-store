import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function usePageTitle() {
  const route = useRoute();
  const pageTitle = ref('Exclusive - Premium Electronics Store');

  const setPageTitle = (title: string) => {
    const fullTitle = title
      ? `${title} - Exclusive`
      : 'Exclusive - Premium Electronics Store';
    pageTitle.value = fullTitle;
    document.title = fullTitle;
  };

  const setHomeTitle = () => {
    setPageTitle('');
  };

  // Watch for route changes to automatically update titles
  watch(
    () => route.name,
    (newRouteName) => {
      if (newRouteName) {
        switch (newRouteName) {
          case 'home':
            setHomeTitle();
            break;
          case 'products':
            setPageTitle('Products');
            break;
          case 'single-product':
            setPageTitle('Product Details');
            break;
          case 'cart':
            setPageTitle('Shopping Cart');
            break;
          case 'checkout':
            setPageTitle('Checkout');
            break;
          case 'order-success':
            setPageTitle('Order Confirmed');
            break;
          case 'login':
            setPageTitle('Login');
            break;
          case 'signup':
            setPageTitle('Sign Up');
            break;
          case 'forgot-password':
            setPageTitle('Forgot Password');
            break;
          case 'reset-password':
            setPageTitle('Reset Password');
            break;
          case 'profile':
            setPageTitle('My Profile');
            break;
          case 'favorites':
            setPageTitle('My Favorites');
            break;
          case 'about':
            setPageTitle('About Us');
            break;
          case 'contact':
            setPageTitle('Contact Us');
            break;
          default:
            // For dynamic routes, try to extract meaningful title
            if (route.params.id) {
              setPageTitle('Details');
            } else {
              setPageTitle('');
            }
        }
      }
    },
    { immediate: true }
  );

  return {
    pageTitle,
    setPageTitle,
    setHomeTitle,
  };
}
