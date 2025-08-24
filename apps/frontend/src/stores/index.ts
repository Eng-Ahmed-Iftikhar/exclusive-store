import { useAuthStore } from './modules/auth';
import { useCategoriesStore } from './modules/categories';
import { useItemsStore } from './modules/items';
import { useFlashSaleTimerStore } from './modules/flash-sale-timer';
import { useFavoritesStore } from './modules/favorites';
import { useNotificationsStore } from './modules/notifications';
import { useCartStore } from './modules/cart';
import { useCheckoutStore } from './modules/checkout';

// Export interfaces
import * as IItems from './modules/items';
import * as ICategories from './modules/categories';

export {
  useAuthStore,
  useCategoriesStore,
  useItemsStore,
  useFlashSaleTimerStore,
  useFavoritesStore,
  useNotificationsStore,
  useCartStore,
  useCheckoutStore,
  IItems,
  ICategories,
};
