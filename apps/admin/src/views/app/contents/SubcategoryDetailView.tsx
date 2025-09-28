import { useGetSubcategoryByIdQuery } from '@/apis/services/subcategoryApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import SubcategoryDetailSection from '@/sections/app/contents/subcategories/SubcategoryDetailSection';
import { ArrowLeftIcon, EditIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function SubcategoryDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: subcategory,
    isLoading,
    error,
    isError,
  } = useGetSubcategoryByIdQuery(id!);

  const handleEdit = () => {
    if (subcategory) {
      navigate(`/content/subcategories/edit/${subcategory.id}`);
    }
  };

  const handleBack = () => {
    navigate('/content/subcategories');
  };

  if (isLoading) {
    return (
      <PermissionGuard action="view" subject="subcategories">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <div className="space-y-4">
              <div className="h-6 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  if (isError || !subcategory) {
    return (
      <PermissionGuard action="view" subject="subcategories">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Subcategory Not Found
            </h1>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 p-6">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error && 'data' in error
                  ? (error.data as any)?.message || 'Failed to load subcategory'
                  : 'Subcategory not found'}
              </p>
              <Button variant="outline" onClick={handleBack}>
                Go Back to Subcategories
              </Button>
            </div>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard action="view" subject="subcategories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Subcategory Details
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <PermissionGuard action="edit" subject="subcategories">
              <Button
                onClick={handleEdit}
                className="flex items-center text-black dark:text-white space-x-2"
              >
                <EditIcon className="w-4 h-4" />
                <span>Edit</span>
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* Content */}
        <SubcategoryDetailSection subcategory={subcategory} />
      </div>
    </PermissionGuard>
  );
}

export default SubcategoryDetailView;
