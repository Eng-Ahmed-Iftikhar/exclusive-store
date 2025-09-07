import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePermissionForm from '@/sections/app/management/permissions/CreatePermissionForm';
import PermissionFormHeader from '@/sections/app/management/permissions/PermissionFormHeader';

function CreatePermissionView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/permissions');
  };

  const handleCancel = () => {
    navigate('/permissions');
  };

  return (
    <div className="p-6">
      <PermissionFormHeader
        title="Create Permission"
        description="Add a new permission to the system"
        onBack={handleCancel}
      />

      <div className="mt-6">
        <CreatePermissionForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </div>
  );
}

export default CreatePermissionView;
