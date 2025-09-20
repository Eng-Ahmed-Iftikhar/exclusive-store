import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { adminApi } from '../apis/services/adminApi';
import { authApi } from '../apis/services/authApi';
import { permissionApi } from '../apis/services/permissionApi';
import { resourceApi } from '../apis/services/resourceApi';
import { roleApi } from '../apis/services/roleApi';
import { teamApi } from '../apis/services/teamApi';
import { notificationApi } from '../apis/services/notificationApi';
import { rbacApi } from '../apis/services/rbacApi';
import rootReducer from './slices';
import { categoryApi } from '@/apis/services/categoryApi';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'], // Only persist auth and user slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const apiMiddleware = [
  adminApi.middleware,
  authApi.middleware,
  permissionApi.middleware,
  resourceApi.middleware,
  roleApi.middleware,
  teamApi.middleware,
  notificationApi.middleware,
  rbacApi.middleware,
  categoryApi.middleware,
];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiMiddleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
