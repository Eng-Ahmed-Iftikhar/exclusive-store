import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RoleFormHeader from '@/sections/app/management/roles/RoleFormHeader';
import EditRoleForm from '@/sections/app/management/roles/EditRoleForm';

const EditRoleView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  if (!id) {
    navigate('/management/roles');
    return null;
  }

  return (
    <div className="min-h-screen ">
      <div className="w-full p-4">
        <div className="mt-6 w-full space-y-8">
          <RoleFormHeader
            title="Edit Role"
            description="Update role details and permissions"
            onBack={handleBack}
          />
          <EditRoleForm
            roleId={id}
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

export default EditRoleView;
