import { useCreateSubcategoryMutation } from '@/apis/services/subcategoryApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import SubcategoryForm from '@/sections/app/contents/subcategories/SubcategoryForm';
import { SubcategoryFormValues } from '@/types/categories';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateSubcategoryView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createSubcategory] = useCreateSubcategoryMutation();

  const handleSuccess = () => {
    navigate('/content/subcategories');
  };

  const handleCancel = () => {
    navigate('/content/subcategories');
  };

  const handleSubmit = async (data: SubcategoryFormValues) => {
    setIsSubmitting(true);
    try {
      await createSubcategory(data).unwrap();
      handleSuccess();
    } catch (error) {
      console.error('Error creating subcategory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PermissionGuard action="create" subject="subcategories">
      <div className="space-y-6">
        <SubcategoryForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          title="Create Subcategory"
          description="Fill in the details to create a new subcategory"
        />
      </div>
    </PermissionGuard>
  );
}

export default CreateSubcategoryView;
