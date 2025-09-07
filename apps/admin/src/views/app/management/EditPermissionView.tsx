import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditPermissionForm from '@/sections/app/management/permissions/EditPermissionForm';

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
    <div className="p-6">
      <EditPermissionForm
        permissionId={id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
}

export default EditPermissionView;
