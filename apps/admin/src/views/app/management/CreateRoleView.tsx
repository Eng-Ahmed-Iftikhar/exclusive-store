import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleFormHeader from '@/sections/app/management/roles/RoleFormHeader';
import CreateRoleForm from '@/sections/app/management/roles/CreateRoleForm';

const CreateRoleView: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate('/management/roles');
  };

  const handleSuccess = () => {
    navigate('/management/roles');
  };

  const handleCancel = () => {
    navigate('/management/roles');
  };

  return (
    <div className="min-h-screen ">
      <div className="w-full p-4">
        <div className="mt-6 w-full space-y-8">
          <RoleFormHeader
            title="Create New Role"
            description="Create a new role with specific permissions and access controls"
            onBack={handleBack}
          />
          <CreateRoleForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRoleView;
