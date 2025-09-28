import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSave, FiX } from 'react-icons/fi';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/FileUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetFileByIdQuery,
  useDeleteFileMutation,
} from '@/apis/services/fileApi';
import { useGetCategoriesQuery } from '@/apis/services/categoryApi';
import { SubcategoryFormValues } from '@/types/categories';

// Validation schema for subcategory form
const subcategorySchema = z.object({
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
  iconFileId: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  sortOrder: z
    .number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order must be 0 or greater')
    .optional(),
  categoryId: z.string().min(1, 'Category is required'),
});

interface SubcategoryFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    name?: string;
    slug?: string;
    description?: string;
    iconFileId?: string;
    isActive?: boolean;
    sortOrder?: number;
    categoryId?: string;
  };
  onSubmit: (data: SubcategoryFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  title: string;
  description: string;
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  title,
  description,
}) => {
  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      iconFileId: initialData?.iconFileId || '',
      isActive: initialData?.isActive ?? true,
      sortOrder: initialData?.sortOrder || 0,
      categoryId: initialData?.categoryId || '',
    },
  });
  const iconFileId = form.watch('iconFileId') || '';

  const { data: iconFile } = useGetFileByIdQuery(iconFileId, {
    skip: !iconFileId,
  });

  const { data: categories } = useGetCategoriesQuery({
    includeInactive: false,
  });

  const [deleteFile] = useDeleteFileMutation();

  // Handle file deletion
  const handleRemoveIcon = async () => {
    if (iconFileId) {
      try {
        await deleteFile(iconFileId).unwrap();
        form.setValue('iconFileId', '');
      } catch (error) {
        console.error('Failed to delete file:', error);
        // Still clear the form field even if deletion fails
        form.setValue('iconFileId', '');
      }
    }
  };

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        iconFileId: initialData.iconFileId || '',
        isActive: initialData.isActive ?? true,
        sortOrder: initialData.sortOrder || 0,
        categoryId: initialData.categoryId || '',
      });
    }
  }, [initialData, form]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    form.setValue('slug', slug);
  };

  const handleSubmit = async (values: SubcategoryFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Subcategory Details Form */}
      <div className="rounded-2xl border shadow-xl bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        {/* Form Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="p-8 space-y-8"
          >
            {/* Category Selection */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the parent category for this subcategory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Smartphones, Laptops, Tablets"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The display name for the subcategory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., smartphones, laptops, tablets"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version of the name (auto-generated from name)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this subcategory..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description for the subcategory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon Upload Field */}
            <FormField
              control={form.control}
              name="iconFileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Show existing icon if available */}
                      {field.value && iconFile && (
                        <div className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
                          <img
                            src={iconFile.secureUrl}
                            alt="Subcategory icon"
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {iconFile.originalName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {iconFile.format.toUpperCase()} •{' '}
                              {Math.round(iconFile.bytes / 1024)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveIcon}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {!iconFileId && (
                        <FileUpload
                          accept="image/*"
                          maxSize={5}
                          onFileUploaded={(file) => {
                            field.onChange(file.id);
                            form.setValue('iconFileId', file.id);
                          }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an icon image for the subcategory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sort Order Field */}
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Order in which subcategories appear (lower numbers first)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Checkbox */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Inactive subcategories won't be visible to customers
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"
              >
                <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <FiSave
                  className={`w-4 h-4 ${
                    isSubmitting
                      ? 'animate-spin'
                      : 'group-hover:scale-110 transition-transform duration-200'
                  }`}
                />
                {isSubmitting
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                  ? 'Create'
                  : 'Update'}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SubcategoryForm;
