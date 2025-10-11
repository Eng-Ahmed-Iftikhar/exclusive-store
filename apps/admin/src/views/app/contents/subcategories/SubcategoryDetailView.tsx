import { useGetSubcategoryByIdQuery } from '@/apis/services/subcategoryApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import { useNavigate, useParams } from 'react-router-dom';
import SubcategoryDetailHeader from '@/sections/app/contents/subcategories/SubcategoryDetailHeader';
import SubcategoryBasicInfo from '@/sections/app/contents/subcategories/SubcategoryBasicInfo';
import SubcategoryCategoryInfo from '@/sections/app/contents/subcategories/SubcategoryCategoryInfo';
import SubcategoryDetailsSidebar from '@/sections/app/contents/subcategories/SubcategoryDetailsSidebar';
import SubcategoryNotFound from '@/sections/app/contents/subcategories/SubcategoryNotFound';
import SubcategoryLoadingSkeleton from '@/sections/app/contents/subcategories/SubcategoryLoadingSkeleton';

function SubcategoryDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: subcategory,
    isLoading,
    error,
    isError,
  } = useGetSubcategoryByIdQuery(id || '');

  const handleEdit = () => {
    if (subcategory) {
      navigate(`/content/subcategories/${subcategory.id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/content/subcategories');
  };

  if (isLoading) {
    return (
      <PermissionGuard action="view" subject="subcategories">
        <SubcategoryLoadingSkeleton onBack={handleBack} />
      </PermissionGuard>
    );
  }

  if (isError || !subcategory) {
    return (
      <PermissionGuard action="view" subject="subcategories">
        <SubcategoryNotFound onBack={handleBack} error={error} />
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard action="view" subject="subcategories">
      <div className="space-y-6">
        <SubcategoryDetailHeader
          subcategoryName={subcategory.name}
          onBack={handleBack}
          onEdit={handleEdit}
        />

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                <SubcategoryBasicInfo subcategory={subcategory} />
                <SubcategoryCategoryInfo category={subcategory.category} />
              </div>

              {/* Sidebar */}
              <div>
                <SubcategoryDetailsSidebar subcategory={subcategory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}

export default SubcategoryDetailView;
