import { z } from 'zod';

// Login form validation schema using Zod
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

// TypeScript type inferred from the Zod schema
export type LoginSchemaType = z.infer<typeof loginSchema>;
