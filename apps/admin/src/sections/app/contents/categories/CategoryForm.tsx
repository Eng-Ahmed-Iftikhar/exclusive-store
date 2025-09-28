import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootState } from '@/store';
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
  useGetFileByIdQuery,
  useDeleteFileMutation,
} from '@/apis/services/fileApi';
import { CategoryFormValues } from '@/types/categories';

// Validation schema for category form
const categorySchema = z.object({
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
  iconFileId: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  sortOrder: z
    .number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order must be 0 or greater')
    .optional(),
});

interface CategoryFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    name?: string;
    slug?: string;
    description?: string;
    iconFileId?: string;
    isActive?: boolean;
    sortOrder?: number;
  };
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  title: string;
  description: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  title,
  description,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      iconFileId: initialData?.iconFileId || '',
      isActive: initialData?.isActive ?? true,
      sortOrder: initialData?.sortOrder || 0,
    },
  });
  const iconFileId = form.watch('iconFileId') || '';

  const { data: iconFile } = useGetFileByIdQuery(iconFileId, {
    skip: !iconFileId,
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

  const handleSubmit = async (values: CategoryFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Category Details Form */}
      <div
        className={`rounded-2xl border shadow-xl ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Form Header */}
        <div
          className={`px-8 py-6 border-b ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {description}
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="p-8 space-y-8"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Electronics, Clothing, Books"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The display name for the category
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
                      placeholder="e.g., electronics, clothing, books"
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
                      placeholder="Describe this category..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description for the category
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
                        <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <img
                            src={iconFile.secureUrl}
                            alt="Category icon"
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {iconFile.originalName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {iconFile.format.toUpperCase()} •{' '}
                              {Math.round(iconFile.bytes / 1024)} KB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveIcon}
                            className="text-red-500 hover:text-red-700"
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
                    Upload an icon image for the category
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
                    Order in which categories appear (lower numbers first)
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
                      Inactive categories won't be visible to customers
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
                className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white border border-slate-600 hover:border-slate-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
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

export default CategoryForm;
