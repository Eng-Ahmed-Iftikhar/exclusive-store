import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCategoryForm from '@/sections/app/contents/categories/CreateCategoryForm';
import { PermissionGuard } from '@/components/PermissionGuard';

function CreateCategoryView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/content/categories');
  };

  const handleCancel = () => {
    navigate('/content/categories');
  };

  return (
    <PermissionGuard action="create" subject="category">
      <div className="space-y-6">
        <CreateCategoryForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </PermissionGuard>
  );
}

export default CreateCategoryView;
