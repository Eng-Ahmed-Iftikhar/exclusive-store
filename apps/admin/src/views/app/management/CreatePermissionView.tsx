import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePermissionForm from '@/sections/app/management/permissions/CreatePermissionForm';
import { PermissionGuard } from '@/components/PermissionGuard';

function CreatePermissionView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/management/permissions');
  };

  const handleCancel = () => {
    navigate('/management/permissions');
  };

  return (
    <PermissionGuard action="create" subject="permissions" fallback={
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to create permissions.
          </p>
        </div>
      </div>
    }>
      <div className="p-6">
        <CreatePermissionForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </PermissionGuard>
  );
}

export default CreatePermissionView;
