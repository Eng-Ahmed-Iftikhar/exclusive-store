import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateResourceForm from '@/sections/app/management/resources/CreateResourceForm';
import ResourceFormHeader from '@/sections/app/management/resources/ResourceFormHeader';

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
    <div className="min-h-screen ">
      <div className="w-full p-4">
        <ResourceFormHeader
          title="Create Resource"
          description="Add a new resource to the system"
          onBack={handleCancel}
        />

        <div className="mt-6 w-full">
          <CreateResourceForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateResourceView;
