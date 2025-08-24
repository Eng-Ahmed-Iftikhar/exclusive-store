import { IAuth } from "../modules/auth";
import { AuthUrls } from "../urls";
import apiClient from './axios-instance';

const emailLogin = async (payload: IAuth.LoginPayload): Promise<IAuth.AuthResponse> => {
  const response = await apiClient.post(AuthUrls.EMAIL_LOGIN, payload);
  return response.data;
};

const emailRegister = async (payload: IAuth.RegisterPayload): Promise<IAuth.AuthResponse> => {
  const response = await apiClient.post(AuthUrls.EMAIL_REGISTER, payload);
  return response.data;
};

const logout = async (): Promise<{ message: string }> => {
  const response = await apiClient.post(AuthUrls.LOGOUT);
  return response.data;
};

const getCurrentUser = async (): Promise<{ user: IAuth.User }> => {
  const response = await apiClient.get(AuthUrls.GET_ME);
  return response.data;
};

const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post(AuthUrls.FORGOT_PASSWORD, { email });
  return response.data;
};

const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const response = await apiClient.post(AuthUrls.RESET_PASSWORD, { token, newPassword });
  return response.data;
};

export const AuthApis = {
  emailLogin,
  emailRegister,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};