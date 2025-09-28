// Type definitions for category forms
export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  iconFileId?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SubcategoryFormData {
  name: string;
  slug: string;
  description?: string;
  iconFileId?: string;
  isActive?: boolean;
  sortOrder?: number;
  categoryId: string;
}

// Form values types
export type CategoryFormValues = CategoryFormData;
export type SubcategoryFormValues = SubcategoryFormData;

// Alternative interfaces for extending the schema types if needed
// These can be extended when additional properties are needed
// export interface CategoryFormExtended extends CategorySchemaType {
//   // Add any additional properties here if needed
//   // For example: custom fields, metadata, etc.
// }

// export interface SubcategoryFormExtended extends SubcategorySchemaType {
//   // Add any additional properties here if needed
//   // For example: custom fields, metadata, etc.
// }

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
