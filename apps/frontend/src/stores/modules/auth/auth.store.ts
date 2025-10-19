import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IAuth, AuthActions } from '.';

export const useAuthStore = defineStore('auth', () => {
  // ****** State ******
  const user = ref<IAuth.User | null>(null);
  const accessToken = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const errorMessage = ref<string | null>(null);
  const isInitialized = ref<boolean>(false);

  // ****** Getters ******
  const getUser = computed(() => user.value);
  const getAccessToken = computed(() => accessToken.value);
  const getIsLoading = computed(() => isLoading.value);
  const getErrorMessage = computed(() => errorMessage.value);
  const getIsInitialized = computed(() => isInitialized.value);
  const isAuthenticated = computed(() =>
    Boolean(accessToken.value && user.value)
  );

  // ****** Actions ******
  const login = async (payload: IAuth.LoginPayload): Promise<boolean> => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await AuthActions.emailLogin(payload);
      console.log('=== Login Response Debug ===');
      console.log('Full response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null');
      console.log('User exists:', response?.user ? 'yes' : 'no');
      console.log('Token exists:', response?.accessToken ? 'yes' : 'no');
      console.log('==========================');

      // Check if we have valid response data
      if (response && response.user && response.accessToken) {
        user.value = response.user;
        accessToken.value = response.accessToken;

        // Store token in localStorage for persistence
        localStorage.setItem('accessToken', response.accessToken);

        console.log('Login successful, user and token set');
        return true;
      } else {
        console.error('Invalid login response:', response);
        errorMessage.value = 'Login failed. Invalid response from server.';
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage.value =
        error instanceof Error ? error.message : 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const loginWithRedirect = async (
    payload: IAuth.LoginPayload,
    redirectTo?: string
  ): Promise<boolean> => {
    const success = await login(payload);
    if (success && redirectTo) {
      // Store redirect URL for after login completion
      localStorage.setItem('redirectAfterLogin', redirectTo);
    }
    return success;
  };

  const register = async (payload: IAuth.RegisterPayload): Promise<boolean> => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await AuthActions.emailRegister(payload);

      if (response) {
        user.value = response.user;
        accessToken.value = response.accessToken;

        // Store only token in localStorage for persistence
        localStorage.setItem('accessToken', response.accessToken);

        return true;
      } else {
        errorMessage.value = 'Registration failed. Please try again.';
        return false;
      }
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Registration failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const registerWithRedirect = async (
    payload: IAuth.RegisterPayload,
    redirectTo?: string
  ): Promise<boolean> => {
    const success = await register(payload);
    if (success && redirectTo) {
      // Store redirect URL for after registration completion
      localStorage.setItem('redirectAfterLogin', redirectTo);
    }
    return success;
  };

  const getRedirectAfterLogin = (): string | null => {
    return localStorage.getItem('redirectAfterLogin');
  };

  const clearRedirectAfterLogin = (): void => {
    localStorage.removeItem('redirectAfterLogin');
  };

  const handlePostAuthRedirect = (router: any): void => {
    console.log('handlePostAuthRedirect called');
    const redirectTo = getRedirectAfterLogin();
    console.log('Redirect URL from storage:', redirectTo);

    try {
      if (redirectTo) {
        console.log('Redirecting to stored URL:', redirectTo);
        clearRedirectAfterLogin();
        router.push(redirectTo);
      } else {
        console.log('Redirecting to dashboard');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Router push error:', error);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await AuthActions.forgotPassword(email);
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to send reset email';
      setErrorMessage(errorMessage);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<boolean> => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await AuthActions.resetPassword(token, newPassword);
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to reset password';
      setErrorMessage(errorMessage);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    isLoading.value = true;

    try {
      await AuthActions.logout();
    } catch (error) {
      // Logout error
    } finally {
      // Clear state regardless of API call success
      user.value = null;
      accessToken.value = null;
      errorMessage.value = null;

      // Clear only token from localStorage
      localStorage.removeItem('accessToken');

      isLoading.value = false;
    }
  };

  const initializeFromStorage = async (): Promise<void> => {
    console.log('=== initializeFromStorage called ===');
    const token = localStorage.getItem('accessToken');
    console.log('Token from localStorage:', token ? 'exists' : 'not found');

    if (token) {
      accessToken.value = token;
      console.log('Setting accessToken in store');

      // Fetch user data from API using the stored token
      try {
        console.log('Attempting to fetch user data...');
        const userData = await AuthActions.getCurrentUser();
        console.log('User data response:', userData);

        if (userData) {
          user.value = userData;
          console.log('User data set successfully');
        } else {
          console.log('No user data received, clearing token');
          // If user fetch fails, clear the invalid token
          accessToken.value = null;
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If user fetch fails, clear the invalid token
        accessToken.value = null;
        localStorage.removeItem('accessToken');
      }
    }

    // Mark as initialized regardless of success/failure
    isInitialized.value = true;
    console.log('Auth store initialized');
    console.log('================================');
  };

  const googleSignup = async (): Promise<boolean> => {
    // Store redirect URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirectTo');
    if (redirectTo) {
      localStorage.setItem('redirectAfterLogin', redirectTo);
    }

    // Open popup window for Google OAuth
    const popup = await AuthActions.googleAuth();

    if (!popup) {
      errorMessage.value =
        'Failed to open Google OAuth popup. Please check your popup blocker settings.';
      return false;
    }

    // Listen for messages from the popup
    return new Promise((resolve) => {
      const messageHandler = async (event: MessageEvent) => {
        // Check if it's a Google OAuth message
        if (event.data && event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          // Remove the event listener
          window.removeEventListener('message', messageHandler);

          // Handle the successful authentication

          const token = event.data.data.accessToken;
          console.log({ token });
          // Set token
          accessToken.value = token;

          // Store token in localStorage for persistence
          localStorage.setItem('accessToken', token);

          resolve(true);
          // Close the popup
          popup.close();
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          // Remove the event listener
          window.removeEventListener('message', messageHandler);

          // Handle the error
          errorMessage.value =
            event.data.error || 'Google authentication failed';

          // Close the popup
          popup.close();

          resolve(false);
        }
      };

      // Add event listener for popup messages
      window.addEventListener('message', messageHandler);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          resolve(false);
        }
      }, 1000);
    });
  };

  const handleGoogleCallback = async (token: string): Promise<boolean> => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await AuthActions.googleCallback(token);

      if (response && response.user && response.accessToken) {
        user.value = response.user;
        accessToken.value = response.accessToken;

        // Store token in localStorage for persistence
        localStorage.setItem('accessToken', response.accessToken);

        return true;
      } else {
        errorMessage.value =
          'Google authentication failed. Invalid response from server.';
        return false;
      }
    } catch (error) {
      console.error('Google callback error:', error);
      errorMessage.value =
        error instanceof Error ? error.message : 'Google authentication failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = (): void => {
    errorMessage.value = null;
  };

  const setErrorMessage = (message: string): void => {
    errorMessage.value = message;
  };

  const refreshUserData = async (): Promise<void> => {
    if (accessToken.value) {
      try {
        const userData = await AuthActions.getCurrentUser();
        if (userData) {
          user.value = userData;
        }
      } catch (error) {
        // If refresh fails, user might be logged out
        user.value = null;
        accessToken.value = null;
        localStorage.removeItem('accessToken');
      }
    }
  };

  // ****** Mutations ******
  const setUser = (newUser: IAuth.User | null): void => {
    user.value = newUser;
  };

  const updateUser = (updatedUser: Partial<IAuth.User>): void => {
    if (user.value) {
      user.value = {
        ...user.value,
        ...updatedUser,
      };

      // Note: User data is not persisted to localStorage anymore
      // It will be fetched from API on page refresh
    }
  };

  return {
    // ****** State ******
    user,
    accessToken,
    isLoading,
    errorMessage,
    isInitialized,

    // ****** Getters ******
    getUser,
    getAccessToken,
    getIsLoading,
    getErrorMessage,
    getIsInitialized,
    isAuthenticated,

    // ****** Actions ******
    login,
    loginWithRedirect,
    register,
    registerWithRedirect,
    logout,
    initializeFromStorage,
    clearError,
    setErrorMessage,
    refreshUserData,
    getRedirectAfterLogin,
    clearRedirectAfterLogin,
    handlePostAuthRedirect,
    forgotPassword,
    resetPassword,
    googleSignup,
    handleGoogleCallback,

    // ****** Mutations ******
    setUser,
    updateUser,
  };
});
