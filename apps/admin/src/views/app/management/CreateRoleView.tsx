import { useCreateRoleMutation } from '@/apis/services/roleApi';
import RoleForm from '@/sections/app/management/roles/RoleForm';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRoleView: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createRole] = useCreateRoleMutation();

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
    <div className="p-6">
      <RoleForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        title="Role Details"
        description="Fill in the details below to create a new role"
      />
    </div>
  );
};

export default CreateRoleView;
