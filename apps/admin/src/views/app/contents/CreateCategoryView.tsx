import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCategoryForm from '@/sections/app/contents/categories/CreateCategoryForm';
import { PermissionGuard } from '@/components/PermissionGuard';

function CreateCategoryView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/management/categories');
  };

  const handleCancel = () => {
    navigate('/management/categories');
  };

  return (
    <PermissionGuard action="create" subject="categories">
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
