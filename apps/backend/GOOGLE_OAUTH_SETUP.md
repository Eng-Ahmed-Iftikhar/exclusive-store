# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for the Exclusive e-commerce platform.

## Backend Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"
```

### 2. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
8. Copy the Client ID and Client Secret to your `.env` file

### 3. Backend Endpoints

The following endpoints are now available:

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles Google OAuth callback

## Frontend Setup

### 1. Google Signup Button

The Google signup button is already implemented in the `SignupForm.vue` component. When clicked, it will:

1. Store any redirect URL from query parameters
2. Redirect the user to the backend Google OAuth endpoint
3. Handle the callback and redirect appropriately

### 2. Google Callback Page

A new page has been created at `/auth/google/callback` that:

1. Extracts the token from URL parameters
2. Calls the auth store to handle the Google callback
3. Redirects the user to the appropriate page after successful authentication

## How It Works

### Signup Flow (Popup Implementation)

1. User clicks "Sign up with Google" button
2. Frontend opens a popup window to `/api/auth/google`
3. Backend redirects to Google OAuth consent screen in the popup
4. User grants permissions on Google
5. Google redirects to `/api/auth/google/callback` in the popup
6. Backend processes the OAuth response and creates/updates user
7. Backend returns HTML that sends auth data to parent window via postMessage
8. Popup closes automatically and user is logged in on the main page

### User Creation

- If the user doesn't exist, a new user account is created
- The user is automatically assigned the "user" role
- Email is marked as verified (Google emails are pre-verified)
- No password is set (OAuth users don't need passwords)

### Existing Users

- If a user with the same email already exists, they are logged in
- The existing user account is used (no duplicate accounts)

## Security Features

- JWT tokens are generated for authenticated users
- Refresh tokens are stored securely in Redis
- User activities are logged for audit purposes
- Email verification is automatically handled for Google users

## Testing

1. Start the backend server: `npm run backend:dev`
2. Start the frontend server: `npm run frontend:dev`
3. Navigate to the signup page
4. Click "Sign up with Google"
5. Complete the Google OAuth flow
6. Verify that you're logged in and redirected appropriately

## Production Deployment

1. Update the `GOOGLE_CALLBACK_URL` to your production domain
2. Add your production domain to Google Cloud Console authorized redirect URIs
3. Ensure all environment variables are properly set in production
4. Test the OAuth flow in your production environment

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Check that the callback URL in Google Cloud Console matches your environment variable
2. **"Client ID not found"**: Verify that `GOOGLE_CLIENT_ID` is correctly set in your `.env` file
3. **"Access denied"**: Check that the Google+ API is enabled in your Google Cloud project
4. **"Token not found"**: Ensure the callback URL is correctly configured and accessible

### Debug Mode

Enable debug logging by setting `LOG_LEVEL=debug` in your `.env` file to see detailed OAuth flow information.
