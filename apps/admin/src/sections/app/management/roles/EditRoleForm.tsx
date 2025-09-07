import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useGetRoleResourcesQuery,
} from '@/apis/services/roleApi';
import { FiSave, FiX } from 'react-icons/fi';
import ResourcePermissionSelect from './ResourcePermissionSelect';

interface EditRoleFormProps {
  roleId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditRoleForm: React.FC<EditRoleFormProps> = ({
  roleId,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    isActive: true,
  });
  const [selectedAssignments, setSelectedAssignments] = useState<
    Array<{
      resourceId: string;
      permissionId: string;
    }>
  >([]);

  const { data: role, isLoading, error } = useGetRoleByIdQuery(roleId);
  const { data: roleResources } = useGetRoleResourcesQuery(roleId);

  const [updateRole] = useUpdateRoleMutation();

  useEffect(() => {
    if (role) {
      setFormData({
        displayName: role.displayName,
        description: role.description || '',
        isActive: role.isActive,
      });
    }
  }, [role]);

  useEffect(() => {
    if (roleResources) {
      const assignments = roleResources.map((rr: any) => ({
        resourceId: rr.resourceId,
        permissionId: rr.permissionId,
      }));
      setSelectedAssignments(assignments);
    }
  }, [roleResources]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateRole({
        id: roleId,
        data: {
          displayName: formData.displayName,
          description: formData.description,
          isActive: formData.isActive,
          assignments: selectedAssignments,
        },
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignmentsChange = (
    assignments: Array<{
      resourceId: string;
      permissionId: string;
    }>
  ) => {
    setSelectedAssignments(assignments);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div
          className={`rounded-2xl border shadow-xl ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div
          className={`rounded-2xl border shadow-xl ${
            theme === 'dark'
              ? 'bg-red-900/20 border-red-700 text-red-300'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="text-red-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Failed to load role</h3>
                <p className="text-sm mt-1">
                  Please try refreshing the page or contact support if the
                  problem persists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return null;
  }

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
            Edit Role: {role.name}
          </h2>
          <p
            className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Update the role details below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-2">
            <label
              className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Role Name (Read-only)
            </label>
            <input
              type="text"
              value={role.name}
              disabled
              className={`w-full px-4 py-3 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-slate-600 border-slate-500 text-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-500'
              }`}
            />
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Role name cannot be changed after creation
            </p>
          </div>

          <div className="space-y-2">
            <label
              className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Display Name *
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:bg-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500'
              } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
              placeholder="e.g., Customer Manager, Content Editor"
            />
          </div>

          <div className="space-y-2">
            <label
              className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:bg-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500'
              } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
              placeholder="Describe the role's responsibilities and permissions..."
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className={`w-5 h-5 rounded border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-slate-600 bg-slate-700 text-green-500 focus:ring-green-500/20'
                    : 'border-gray-300 bg-white text-green-600 focus:ring-green-500/20'
                } focus:ring-4 focus:outline-none`}
              />
              <span
                className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                Active
              </span>
            </label>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Inactive roles cannot be assigned to users
            </p>
          </div>
        </form>
      </div>

      {/* Resource Permission Selection */}
      <ResourcePermissionSelect
        selectedAssignments={selectedAssignments}
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
          type="button"
          onClick={handleSubmit}
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
          {isSubmitting ? 'Updating...' : 'Update Role'}
        </button>
      </div>
    </div>
  );
};

export default EditRoleForm;
