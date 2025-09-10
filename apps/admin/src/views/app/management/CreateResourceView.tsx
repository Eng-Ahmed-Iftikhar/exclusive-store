import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateResourceForm from '@/sections/app/management/resources/CreateResourceForm';

function CreateResourceView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/management/resources');
  };

  const handleCancel = () => {
    navigate('/management/resources');
  };

  return (
    <div className="p-6">
      <CreateResourceForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
}

export default CreateResourceView;
