import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import userReducer from './userSlice';
import uiReducer from './uiSlice';
import { adminApi } from '@/apis/services/adminApi';
import { authApi } from '@/apis/services/authApi';
import { permissionApi } from '@/apis/services/permissionApi';
import { resourceApi } from '@/apis/services/resourceApi';

const apiReducers = {
  [adminApi.reducerPath]: adminApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [permissionApi.reducerPath]: permissionApi.reducer,
  [resourceApi.reducerPath]: resourceApi.reducer,
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
  ...apiReducers,
});

export default rootReducer;
