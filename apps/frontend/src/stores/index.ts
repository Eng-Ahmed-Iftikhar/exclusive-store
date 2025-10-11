import { useAuthStore } from './modules/auth';
import { useCategoriesStore } from './modules/categories';
import { useProductsStore } from './modules/products';
import { useFlashSaleTimerStore } from './modules/flash-sale-timer';
import { useFavoritesStore } from './modules/favorites';
import { useNotificationsStore } from './modules/notifications';
import { useCartStore } from './modules/cart';
import { useCheckoutStore } from './modules/checkout';

// Export interfaces
import * as IProducts from './modules/products';
import * as ICategories from './modules/categories';

export {
  useAuthStore,
  useCategoriesStore,
  useProductsStore,
  useFlashSaleTimerStore,
  useFavoritesStore,
  useNotificationsStore,
  useCartStore,
  useCheckoutStore,
  IProducts,
  ICategories,
};
