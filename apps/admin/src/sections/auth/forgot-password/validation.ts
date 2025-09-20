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
