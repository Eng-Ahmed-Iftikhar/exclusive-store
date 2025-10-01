import { Category } from '@/apis/services/categoryApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import CategoriesTable from '@/sections/app/contents/categories/CategoriesTable';
import { useNavigate } from 'react-router-dom';

function CategoryView() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/content/categories/create');
  };

  const handleEdit = (category: Category) => {
    navigate(`/content/categories/${category.id}/edit`);
  };

  const handleView = (category: Category) => {
    navigate(`/content/categories/${category.id}`);
  };

  return (
    <PermissionGuard action="view" subject="categories">
      <div className="space-y-6">
        <CategoriesTable
          onEdit={handleEdit}
          onCreate={handleCreate}
          onView={handleView}
        />
      </div>
    </PermissionGuard>
  );
}

export default CategoryView;
