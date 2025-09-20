import { z } from 'zod';

// Validation schema for reset password form
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Type inference from schema
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

// Form values type
export type ResetPasswordFormValues = ResetPasswordSchemaType;

// Alternative interface for extending the schema type if needed
export interface ResetPasswordFormExtended extends ResetPasswordSchemaType {
  // Add any additional properties here if needed
  // For example: custom fields, metadata, etc.
}

// Form submission result type
export interface ResetPasswordFormResult {
  success: boolean;
  message?: string;
  error?: string;
}
