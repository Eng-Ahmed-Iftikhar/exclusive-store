// Type definitions for auth forms
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface SetupPasswordFormData {
  password: string;
  confirmPassword: string;
}

// Form values types
export type LoginFormValues = LoginFormData;
export type ForgotPasswordFormValues = ForgotPasswordFormData;
export type ResetPasswordFormValues = ResetPasswordFormData;
export type SetupPasswordFormValues = SetupPasswordFormData;

// Alternative interfaces for extending the schema types if needed
// These can be extended when additional properties are needed
// export interface LoginFormExtended extends LoginSchemaType {
//   // Add any additional properties here if needed
//   // For example: custom fields, metadata, etc.
// }

// export interface ForgotPasswordFormExtended extends ForgotPasswordSchemaType {
//   // Add any additional properties here if needed
//   // For example: custom fields, metadata, etc.
// }

// export interface ResetPasswordFormExtended extends ResetPasswordSchemaType {
//   // Add any additional properties here if needed
//   // For example: custom fields, metadata, etc.
// }

// export interface SetupPasswordFormExtended extends SetupPasswordSchemaType {
//   // Add any additional properties here if needed
//   // For example: custom fields, metadata, etc.
// }

// Form submission result types
export interface LoginFormResult {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface ForgotPasswordFormResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ResetPasswordFormResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SetupPasswordFormResult {
  success: boolean;
  message?: string;
  error?: string;
}
