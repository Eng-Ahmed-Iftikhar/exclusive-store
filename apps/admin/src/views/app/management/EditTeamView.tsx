import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditTeamForm from '@/sections/app/management/teams/EditTeamForm';

function EditTeamView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/management/teams');
  };

  const handleCancel = () => {
    navigate('/management/teams');
  };

  if (!id) {
    navigate('/management/teams');
    return null;
  }

  return (
    <div className="p-6">
      <EditTeamForm
        teamId={id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
}

export default EditTeamView;
