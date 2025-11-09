import { Subcategory } from '@/apis/services/subcategoryApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import SubcategoriesTable from '@/sections/app/contents/subcategories/SubcategoriesTable';
import { useNavigate } from 'react-router-dom';

function SubcategoryView() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/content/subcategories/create');
  };

  const handleEdit = (subcategory: Subcategory) => {
    navigate(`/content/subcategories/${subcategory.id}/edit`);
  };

  const handleView = (subcategory: Subcategory) => {
    navigate(`/content/subcategories/${subcategory.id}`);
  };

  return (
    <PermissionGuard action="view" subject="subcategory">
      <div className="space-y-6">
        <SubcategoriesTable
          onEdit={handleEdit}
          onCreate={handleCreate}
          onView={handleView}
        />
      </div>
    </PermissionGuard>
  );
}

export default SubcategoryView;
