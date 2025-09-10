import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootState } from '@/store';
import { FiSave, FiX, FiPlus, FiTrash2, FiMail, FiUsers } from 'react-icons/fi';
import { z } from 'zod';
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
import { useGetActiveRolesQuery } from '@/apis/services/roleApi';

// Validation schema for team form
const teamSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .regex(/^[a-z_]+$/, 'Team name must be lowercase with underscores only')
    .max(50, 'Team name must be less than 50 characters')
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
  userEmails: z
    .array(
      z.object({
        email: z.string().email('Invalid email address'),
      })
    )
    .optional(),
  roleIds: z
    .array(z.string())
    .min(1, 'At least one role is required')
    .max(5, 'Maximum 5 roles allowed'),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface TeamFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    name?: string;
    displayName?: string;
    description?: string;
    isActive?: boolean;
    userEmails?: Array<{ email: string }>;
    roleIds?: string[];
  };
  onSubmit: (data: TeamFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  title: string;
  description: string;
}

const TeamForm: React.FC<TeamFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  title,
  description,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [emailInput, setEmailInput] = useState('');

  const { data: roles } = useGetActiveRolesQuery();

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: initialData?.name || '',
      displayName: initialData?.displayName || '',
      description: initialData?.description || '',
      isActive: initialData?.isActive ?? true,
      userEmails: [],
      roleIds: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'userEmails',
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || '',
        displayName: initialData.displayName || '',
        description: initialData.description || '',
        isActive: initialData.isActive ?? true,
        userEmails: initialData.userEmails || [],
        roleIds: initialData.roleIds || [],
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: TeamFormData) => {
    // Custom validation for create mode
    if (mode === 'create') {
      if (!values.userEmails || values.userEmails.length === 0) {
        form.setError('userEmails', {
          type: 'manual',
          message: 'At least one team member is required',
        });
        return;
      }
    }

    await onSubmit(values);
  };

  const addEmail = () => {
    if (emailInput.trim()) {
      append({ email: emailInput.trim() });
      setEmailInput('');
    }
  };

  const removeEmail = (index: number) => {
    // In edit mode, allow removing all members
    // In create mode, require at least one member
    if (mode === 'edit' || fields.length > 1) {
      remove(index);
    } else {
      console.log(
        'Cannot remove member: need at least one member in create mode'
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Team Details Form */}
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
            {/* Team Name Field - Only show in edit mode */}
            {mode === 'edit' && initialData?.name && (
              <div className="space-y-2">
                <FormLabel>Team Name (Read-only)</FormLabel>
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
                  Team name cannot be changed after creation
                </FormDescription>
              </div>
            )}

            {/* Team Name Field - Only show in create mode */}
            {mode === 'create' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., sales_team, marketing_team"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use lowercase with underscores (e.g., sales_team,
                      marketing_team)
                    </FormDescription>
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
                      placeholder="e.g., Sales Team, Marketing Team"
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
                      placeholder="Describe the team's purpose and responsibilities..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Members Section - Show in both create and edit modes */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-blue-900/30 text-blue-300'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <FiUsers className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Team Members
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {mode === 'create'
                      ? 'Add team members by email. They will receive magic links to set up their passwords.'
                      : 'Manage team members. Add or remove members and their roles.'}
                  </p>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <FormLabel>
                  {mode === 'create' ? 'Add Team Members *' : 'Team Members'}
                </FormLabel>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={addEmail}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <FormDescription>
                  Press Enter or click the + button to add emails
                </FormDescription>
              </div>

              {/* Email List */}
              <div className="space-y-2">
                {fields.length === 0 ? (
                  <div
                    className={`flex flex-col items-center justify-center py-8 px-4 rounded-lg border-2 border-dashed ${
                      theme === 'dark'
                        ? 'border-slate-600 bg-slate-800/50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full mb-3 ${
                        theme === 'dark'
                          ? 'bg-slate-700 text-slate-400'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <FiMail className="w-6 h-6" />
                    </div>
                    <h3
                      className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                      }`}
                    >
                      No team members added yet
                    </h3>
                    <p
                      className={`text-xs text-center ${
                        theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                      }`}
                    >
                      Add email addresses above to invite team members
                    </p>
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <FiMail className="w-4 h-4" />
                      </div>
                      <Input
                        value={field.email}
                        disabled
                        className={`flex-1 ${
                          theme === 'dark'
                            ? 'bg-slate-600 border-slate-500 text-gray-300'
                            : 'bg-gray-100 border-gray-200 text-gray-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'text-red-400 hover:bg-red-900/30'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <FormField
                control={form.control}
                name="userEmails"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Role Selection - Show in both create and edit modes */}
            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {mode === 'create'
                      ? 'Default Roles for Team Members *'
                      : 'Team Member Roles *'}
                  </FormLabel>
                  <FormDescription>
                    {mode === 'create'
                      ? 'Select one or more roles to assign to all team members initially'
                      : 'Select roles to assign to team members. Changes will apply to all members.'}
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-3 flex flex-wrap gap-2 items-center ">
                      {roles?.map((role) => (
                        <div key={role.id} className="flex items-center">
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={field.value?.includes(role.id) || false}
                            onCheckedChange={(checked) => {
                              const currentRoles = field.value || [];
                              if (checked) {
                                field.onChange([...currentRoles, role.id]);
                              } else {
                                field.onChange(
                                  currentRoles.filter((id) => id !== role.id)
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`role-${role.id}`}
                            className={`text-sm font-medium cursor-pointer ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span>{role.displayName}</span>
                              <span
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                {role.name}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
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
                        Inactive teams cannot be assigned to users
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

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

export default TeamForm;
