import { IAuth } from '.';
import { AuthApis } from '../../apis/auth.api';

export async function emailLogin(
  payload: IAuth.LoginPayload
): Promise<IAuth.AuthResponse | null> {
  const response = await AuthApis.emailLogin(payload);
  return response;
}

export async function emailRegister(
  payload: IAuth.RegisterPayload
): Promise<IAuth.AuthResponse | null> {
  const response = await AuthApis.emailRegister(payload);
  return response;
}

export async function logout(): Promise<boolean> {
  await AuthApis.logout();
  return true;
}

export async function googleAuth(): Promise<Window | null> {
  return await AuthApis.googleAuth();
}

export async function googleCallback(
  token: string
): Promise<IAuth.AuthResponse | null> {
  const response = await AuthApis.googleCallback(token);
  return response;
}

export async function getCurrentUser(): Promise<IAuth.User | null> {
  const response = await AuthApis.getCurrentUser();
  return response.user;
}

export async function forgotPassword(
  email: string
): Promise<{ message: string } | null> {
  const response = await AuthApis.forgotPassword(email);
  return response;
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string } | null> {
  const response = await AuthApis.resetPassword(token, newPassword);
  return response;
}
