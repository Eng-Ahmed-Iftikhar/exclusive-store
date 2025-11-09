import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditPermissionForm from '@/sections/app/management/permissions/EditPermissionForm';
import { PermissionGuard } from '@/components/PermissionGuard';

function EditPermissionView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/management/permissions');
  };

  const handleCancel = () => {
    navigate('/management/permissions');
  };

  if (!id) {
    navigate('/management/permissions');
    return null;
  }

  return (
    <PermissionGuard
      action="edit"
      subject="permission"
      fallback={
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to edit permissions.
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6">
        <EditPermissionForm
          permissionId={id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </PermissionGuard>
  );
}

export default EditPermissionView;
