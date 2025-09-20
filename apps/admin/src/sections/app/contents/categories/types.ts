import { z } from 'zod';

// Validation schema for category form
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal('')),
  icon: z
    .string()
    .max(50, 'Icon must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
  sortOrder: z
    .number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order must be 0 or greater')
    .optional(),
});

// Validation schema for subcategory form
export const subcategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Subcategory name is required')
    .max(100, 'Subcategory name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal('')),
  icon: z
    .string()
    .max(50, 'Icon must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
  sortOrder: z
    .number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order must be 0 or greater')
    .optional(),
});

// Type inference from schemas
export type CategorySchemaType = z.infer<typeof categorySchema>;
export type SubcategorySchemaType = z.infer<typeof subcategorySchema>;

// Form values types
export type CategoryFormValues = CategorySchemaType;
export type SubcategoryFormValues = SubcategorySchemaType;

// Alternative interfaces for extending the schema types if needed
export interface CategoryFormExtended extends CategorySchemaType {
  // Add any additional properties here if needed
  // For example: custom fields, metadata, etc.
}

export interface SubcategoryFormExtended extends SubcategorySchemaType {
  // Add any additional properties here if needed
  // For example: custom fields, metadata, etc.
}

// Form submission result types
export interface CategoryFormResult {
  success: boolean;
  message?: string;
  error?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface SubcategoryFormResult {
  success: boolean;
  message?: string;
  error?: string;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
}
