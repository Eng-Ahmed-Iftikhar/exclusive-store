import React from 'react';
import { useCreateResourceMutation } from '@/apis/services/resourceApi';
import ResourceForm from './ResourceForm';

interface CreateResourceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [createResource] = useCreateResourceMutation();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      await createResource({
        name: data.name,
        displayName: data.displayName,
        description: data.description,
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to create resource:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResourceForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title="Resource Details"
      description="Fill in the details below to create a new resource"
    />
  );
};

export default CreateResourceForm;
