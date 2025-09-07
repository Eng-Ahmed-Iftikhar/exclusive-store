import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePermissionForm from '@/sections/app/management/permissions/CreatePermissionForm';
import PermissionFormHeader from '@/sections/app/management/permissions/PermissionFormHeader';

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
    <div className="min-h-screen ">
      <div className="w-full p-4">
        <PermissionFormHeader
          title="Create Permission"
          description="Add a new permission to the system"
          onBack={handleCancel}
        />

        <div className="mt-6 w-full">
          <CreatePermissionForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default CreatePermissionView;
