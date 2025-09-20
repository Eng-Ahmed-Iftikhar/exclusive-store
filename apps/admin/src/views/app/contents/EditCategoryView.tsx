import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditCategoryForm from '@/sections/app/contents/categories/EditCategoryForm';
import { PermissionGuard } from '@/components/PermissionGuard';

function EditCategoryView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!id) {
    navigate('/content/categories');
    return null;
  }

  const handleSuccess = () => {
    navigate('/content/categories');
  };

  const handleCancel = () => {
    navigate('/content/categories');
  };

  return (
    <PermissionGuard action="edit" subject="categories">
      <div className="space-y-6">
        <EditCategoryForm
          categoryId={id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </PermissionGuard>
  );
}

export default EditCategoryView;
