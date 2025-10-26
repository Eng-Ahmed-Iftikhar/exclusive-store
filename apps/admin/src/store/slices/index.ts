import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import userReducer from './userSlice';
import uiReducer from './uiSlice';
import { adminApi } from '@/apis/services/adminApi';
import { authApi } from '@/apis/services/authApi';
import { permissionApi } from '@/apis/services/permissionApi';
import { resourceApi } from '@/apis/services/resourceApi';
import { roleApi } from '@/apis/services/roleApi';
import { notificationApi } from '@/apis/services/notificationApi';
import { rbacApi } from '@/apis/services/rbacApi';
import { teamApi } from '@/apis/services/teamApi';
import { categoryApi } from '@/apis/services/categoryApi';
import { fileApi } from '@/apis/services/fileApi';
import { subcategoryApi } from '@/apis/services/subcategoryApi';
import { productApi } from '@/apis/services/productApi';
import { orderApi } from '@/apis/services/orderApi';
import { transactionApi } from '@/apis/services/transactionApi';

const apiReducers = {
  [adminApi.reducerPath]: adminApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [permissionApi.reducerPath]: permissionApi.reducer,
  [resourceApi.reducerPath]: resourceApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [rbacApi.reducerPath]: rbacApi.reducer,
  [teamApi.reducerPath]: teamApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [subcategoryApi.reducerPath]: subcategoryApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
  ...apiReducers,
});

export default rootReducer;
