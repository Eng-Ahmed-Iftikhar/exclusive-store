import { z } from 'zod';

// Validation schema for forgot password form
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

// Type inference from schema
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

// Form values type
export type ForgotPasswordFormValues = ForgotPasswordSchemaType;

// Alternative interface for extending the schema type if needed
export interface ForgotPasswordFormExtended extends ForgotPasswordSchemaType {
  // Add any additional properties here if needed
  // For example: custom fields, metadata, etc.
}

// Form submission result type
export interface ForgotPasswordFormResult {
  success: boolean;
  message?: string;
  error?: string;
}
