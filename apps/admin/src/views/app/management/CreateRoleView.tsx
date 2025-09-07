import { useCreateRoleMutation } from '@/apis/services/roleApi';
import RoleForm from '@/sections/app/management/roles/RoleForm';
import RoleFormHeader from '@/sections/app/management/roles/RoleFormHeader';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRoleView: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createRole] = useCreateRoleMutation();

  const handleBack = () => {
    navigate('/management/roles');
  };

  const handleCancel = () => {
    navigate('/management/roles');
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      await createRole({
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        assignments: data.assignments,
      }).unwrap();

      navigate('/management/roles');
    } catch (error) {
      console.error('Failed to create role:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <RoleForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            title="Role Details"
            description="Fill in the details below to create a new role"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRoleView;
