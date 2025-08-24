import { BaseUrls } from "./base";

const EMAIL_LOGIN = BaseUrls.AUTH_BASE_URL + '/login';
const EMAIL_REGISTER = BaseUrls.AUTH_BASE_URL + '/register';
const LOGOUT = BaseUrls.AUTH_BASE_URL + '/logout';
const GET_ME = BaseUrls.AUTH_BASE_URL + '/me';
const FORGOT_PASSWORD = BaseUrls.AUTH_BASE_URL + '/forgot-password';
const RESET_PASSWORD = BaseUrls.AUTH_BASE_URL + '/reset-password';

export const AuthUrls = {
  EMAIL_LOGIN,
  EMAIL_REGISTER,
  LOGOUT,
  GET_ME,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
};
