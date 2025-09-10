import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePermissionForm from '@/sections/app/management/permissions/CreatePermissionForm';

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
    <div className="p-6">
      <CreatePermissionForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
}

export default CreatePermissionView;
