import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditResourceForm from '@/sections/app/management/resources/EditResourceForm';
import ResourceFormHeader from '@/sections/app/management/resources/ResourceFormHeader';

function EditResourceView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/management/resources');
  };

  const handleCancel = () => {
    navigate('/management/resources');
  };

  if (!id) {
    navigate('/management/resources');
    return null;
  }

  return (
    <div className="p-6">
      <ResourceFormHeader
        title="Edit Resource"
        description="Update resource details and settings"
        onBack={handleCancel}
      />

      <div className="mt-6">
        <EditResourceForm
          resourceId={id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </div>
  );
}

export default EditResourceView;
