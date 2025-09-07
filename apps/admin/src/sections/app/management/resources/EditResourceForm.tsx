import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetResourceByIdQuery,
  useUpdateResourceMutation,
} from '@/apis/services/resourceApi';
import ResourceForm from './ResourceForm';

interface EditResourceFormProps {
  resourceId: string;
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const EditResourceForm: React.FC<EditResourceFormProps> = ({
  resourceId,
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [resourceData, setResourceData] = useState<any>(null);

  const {
    data: resource,
    isLoading,
    error,
  } = useGetResourceByIdQuery(resourceId);

  const [updateResource] = useUpdateResourceMutation();

  useEffect(() => {
    if (resource) {
      setResourceData({
        name: resource.name,
        displayName: resource.displayName || '',
        description: resource.description || '',
        isActive: resource.isActive ?? true,
      });
    }
  }, [resource]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      await updateResource({
        id: resourceId,
        data: {
          displayName: data.displayName,
          description: data.description,
          isActive: data.isActive,
        },
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to update resource:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                <h3 className="font-medium">Failed to load resource</h3>
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

  if (!resourceData) {
    return null;
  }

  return (
    <ResourceForm
      mode="edit"
      initialData={resourceData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title={`Edit Resource: ${resourceData.name}`}
      description="Update the resource details below"
    />
  );
};

export default EditResourceForm;
