import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditPermissionForm from '@/sections/app/management/permissions/EditPermissionForm';
import PermissionFormHeader from '@/sections/app/management/permissions/PermissionFormHeader';

function EditPermissionView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/permissions');
  };

  const handleCancel = () => {
    navigate('/permissions');
  };

  if (!id) {
    navigate('/permissions');
    return null;
  }

  return (
    <div className="p-6">
      <PermissionFormHeader
        title="Edit Permission"
        description="Update permission details and settings"
        onBack={handleCancel}
      />

      <div className="mt-6">
        <EditPermissionForm
          permissionId={id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </div>
  );
}

export default EditPermissionView;
