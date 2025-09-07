import { Checkbox } from '@/components/ui/checkbox';
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
import { RootState } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import ResourcePermissionSelect from './ResourcePermissionSelect';

// Validation schema for role form
const roleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .regex(/^[a-z_]+$/, 'Role name must be lowercase with underscores only')
    .max(50, 'Role name must be less than 50 characters')
    .optional(),
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  isActive: z.boolean().optional(),
  assignments: z
    .array(
      z.object({
        resourceId: z.string().min(1, 'Resource ID is required'),
        permissionId: z.string().min(1, 'Permission ID is required'),
      })
    )
    .optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    name?: string;
    displayName?: string;
    description?: string;
    isActive?: boolean;
    assignments?: Array<{
      resourceId: string;
      permissionId: string;
    }>;
  };
  onSubmit: (data: RoleFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  title: string;
  description: string;
}

const RoleForm: React.FC<RoleFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  title,
  description,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialData?.name || '',
      displayName: initialData?.displayName || '',
      description: initialData?.description || '',
      isActive: initialData?.isActive ?? true,
      assignments: initialData?.assignments || [],
    },
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || '',
        displayName: initialData.displayName || '',
        description: initialData.description || '',
        isActive: initialData.isActive ?? true,
        assignments: initialData.assignments || [],
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: RoleFormData) => {
    await onSubmit(values);
  };

  const handleAssignmentsChange = (
    assignments: Array<{
      resourceId: string;
      permissionId: string;
    }>
  ) => {
    form.setValue('assignments', assignments);
  };

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Role Details Form */}
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
            {/* Role Name Field - Only show in edit mode */}
            {mode === 'edit' && initialData?.name && (
              <div className="space-y-2">
                <FormLabel>Role Name (Read-only)</FormLabel>
                <Input
                  value={initialData.name}
                  disabled
                  className={`${
                    theme === 'dark'
                      ? 'bg-slate-600 border-slate-500 text-gray-400'
                      : 'bg-gray-100 border-gray-200 text-gray-500'
                  }`}
                />
                <FormDescription>
                  Role name cannot be changed after creation
                </FormDescription>
              </div>
            )}

            {/* Role Name Field - Only show in create mode */}
            {mode === 'create' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., customer_manager, content_editor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Display Name Field */}
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Customer Manager, Content Editor"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Describe the role's responsibilities and permissions..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Checkbox - Only show in edit mode */}
            {mode === 'edit' && (
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
                        Inactive roles cannot be assigned to users
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Resource Permission Selection */}
            <ResourcePermissionSelect
              selectedAssignments={form.watch('assignments') || []}
              onAssignmentsChange={handleAssignmentsChange}
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

export default RoleForm;
