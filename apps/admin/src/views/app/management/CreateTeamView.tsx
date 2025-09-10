import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTeamForm from '@/sections/app/management/teams/CreateTeamForm';

function CreateTeamView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/management/teams');
  };

  const handleCancel = () => {
    navigate('/management/teams');
  };

  return (
    <div className="p-6">
      <CreateTeamForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
}

export default CreateTeamView;
