# Centralized Axios Instance

This directory contains a centralized axios instance with automatic token refresh functionality.

## Features

- **Automatic Token Management**: Automatically adds the access token to all requests
- **Token Refresh**: Automatically refreshes expired tokens using the `/api/auth/refresh` endpoint
- **Request Queuing**: Queues failed requests during token refresh to prevent multiple refresh calls
- **Route Protection**: Skips token refresh for login/register routes
- **Error Handling**: Automatically redirects to login page when refresh fails

## Usage

### Basic API Calls

```typescript
import { apiClient } from '@stores/apis';

// GET request
const response = await apiClient.get('/api/users/profile');

// POST request
const response = await apiClient.post('/api/users', userData);

// PUT request
const response = await apiClient.put('/api/users/123', updateData);

// DELETE request
await apiClient.delete('/api/users/123');
```

### Creating API Modules

```typescript
// user.api.ts
import apiClient from './axios-instance';

export const UserApis = {
  getProfile: async () => {
    const response = await apiClient.get('/api/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await apiClient.put('/api/users/profile', userData);
    return response.data;
  },
};
```

### Using in Components

```typescript
import { UserApis } from '@stores/apis';

// In your component
const handleUpdateProfile = async () => {
  try {
    const updatedUser = await UserApis.updateProfile(formData);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## How Token Refresh Works

1. **Request Made**: Any API request is made with the current token
2. **401 Response**: If the server returns 401 (Unauthorized)
3. **Token Refresh**: The interceptor automatically calls `/api/auth/refresh`
4. **Request Retry**: The original request is retried with the new token
5. **Queue Processing**: Any other failed requests are retried with the new token

## Configuration

The axios instance is configured with:

- **Base URL**: `VITE_APP_BACKEND_URL` environment variable or `http://localhost:3000`
- **Headers**: `Content-Type: application/json` by default
- **Interceptors**: Automatic token management and refresh

## Environment Variables

```env
VITE_APP_BACKEND_URL=http://localhost:3000
```

## Notes

- Token refresh is skipped for `/auth/login` and `/auth/register` routes
- Failed requests are automatically queued during token refresh
- The instance automatically handles token storage in localStorage
- Redirects to `/login` when token refresh fails
