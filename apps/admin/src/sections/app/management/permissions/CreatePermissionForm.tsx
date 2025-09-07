import React from 'react';
import { useCreatePermissionMutation } from '@/apis/services/permissionApi';
import PermissionForm from './PermissionForm';

interface CreatePermissionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const CreatePermissionForm: React.FC<CreatePermissionFormProps> = ({
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [createPermission] = useCreatePermissionMutation();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      await createPermission({
        name: data.name,
        displayName: data.displayName,
        description: data.description,
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to create permission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PermissionForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title="Permission Details"
      description="Fill in the details below to create a new permission"
    />
  );
};

export default CreatePermissionForm;
