import { BaseUrls } from "./base";

const GET_USER_PROFILE = BaseUrls.USER_BASE_URL;
const UPDATE_USER_PROFILE = BaseUrls.USER_BASE_URL;
const UPDATE_USER_AVATAR = `${BaseUrls.USER_BASE_URL}/avatar`;
const DELETE_USER_AVATAR = `${BaseUrls.USER_BASE_URL}/avatar`;
const CHANGE_PASSWORD = `${BaseUrls.USER_BASE_URL}/password`;
const FORGOT_PASSWORD = `${BaseUrls.USER_BASE_URL}/forgot-password`;
const RESET_PASSWORD = `${BaseUrls.USER_BASE_URL}/reset-password`;
const VERIFY_EMAIL = `${BaseUrls.USER_BASE_URL}/verify-email`;
const RESEND_VERIFICATION_EMAIL = `${BaseUrls.USER_BASE_URL}/resend-verification`;
const DELETE_ACCOUNT = `${BaseUrls.USER_BASE_URL}/delete`;

// User preferences
const GET_USER_PREFERENCES = `${BaseUrls.USER_BASE_URL}/preferences`;
const UPDATE_USER_PREFERENCES = `${BaseUrls.USER_BASE_URL}/preferences`;

// User addresses
const GET_USER_ADDRESSES = `${BaseUrls.USER_BASE_URL}/addresses`;
const ADD_USER_ADDRESS = `${BaseUrls.USER_BASE_URL}/addresses`;
const UPDATE_USER_ADDRESS = (id: string) => `${BaseUrls.USER_BASE_URL}/addresses/${id}`;
const DELETE_USER_ADDRESS = (id: string) => `${BaseUrls.USER_BASE_URL}/addresses/${id}`;
const SET_DEFAULT_ADDRESS = (id: string) => `${BaseUrls.USER_BASE_URL}/addresses/${id}/default`;

export const UserUrls = {
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  UPDATE_USER_AVATAR,
  DELETE_USER_AVATAR,
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  VERIFY_EMAIL,
  RESEND_VERIFICATION_EMAIL,
  DELETE_ACCOUNT,
  GET_USER_PREFERENCES,
  UPDATE_USER_PREFERENCES,
  GET_USER_ADDRESSES,
  ADD_USER_ADDRESS,
  UPDATE_USER_ADDRESS,
  DELETE_USER_ADDRESS,
  SET_DEFAULT_ADDRESS,
};
