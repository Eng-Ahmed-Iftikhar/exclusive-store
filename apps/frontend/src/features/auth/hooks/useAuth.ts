// Re-export the centralized auth store composable
export { useAuthStore as useAuth } from '@stores/modules/auth';

// For backward compatibility
export type LoginCredentials =
  import('@stores/modules/auth').IAuth.LoginPayload;
