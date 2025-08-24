import { IAuth } from "../modules/auth";
import { UserUrls } from "../urls";
import apiClient from './axios-instance';

// Example user API methods using the centralized axios instance
export const UserApis = {
  // Get user profile
  getProfile: async (): Promise<IAuth.User> => {
    const response = await apiClient.get(UserUrls.GET_USER_PROFILE);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<IAuth.User>): Promise<IAuth.User> => {
    const response = await apiClient.put(UserUrls.UPDATE_USER_PROFILE, userData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post(UserUrls.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post(UserUrls.UPDATE_USER_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
