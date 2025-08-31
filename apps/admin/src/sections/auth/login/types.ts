import { LoginSchemaType } from './validation';

// Login form types and interfaces
// LoginFormValues interface derived from Zod schema for type consistency
export type LoginFormValues = LoginSchemaType;

// Alternative interface for extending the schema type if needed
export interface LoginFormExtended extends LoginSchemaType {
  // Add any additional properties here if needed
  // For example: custom fields, metadata, etc.
}

// Form submission result type
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
