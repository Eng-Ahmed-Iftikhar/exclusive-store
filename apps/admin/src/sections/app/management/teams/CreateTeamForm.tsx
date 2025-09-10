import React from 'react';
import { useCreateTeamMutation } from '@/apis/services/teamApi';
import TeamForm from './TeamForm';

interface CreateTeamFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [createTeam] = useCreateTeamMutation();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      await createTeam({
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        userEmails: data.userEmails.map((item: any) => item.email),
        roleIds: data.roleIds,
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to create team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TeamForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      title="Team Details"
      description="Fill in the details below to create a new team and invite members"
    />
  );
};

export default CreateTeamForm;
