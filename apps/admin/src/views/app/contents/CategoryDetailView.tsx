import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCategoryByIdQuery } from '@/apis/services/categoryApi';
import { useGetSubcategoriesQuery } from '@/apis/services/categoryApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import { useGetFileByIdQuery } from '@/apis/services/fileApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FiPlus } from 'react-icons/fi';
import CategoryDetailHeader from '@/sections/app/contents/categories/CategoryDetailHeader';
import CategoryBasicInfo from '@/sections/app/contents/categories/CategoryBasicInfo';
import CategoryIconMetadata from '@/sections/app/contents/categories/CategoryIconMetadata';
import CategorySubcategoriesList from '@/sections/app/contents/categories/CategorySubcategoriesList';
import CategoryNotFound from '@/sections/app/contents/categories/CategoryNotFound';

const CategoryDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetCategoryByIdQuery(id || '', {
    skip: !id,
  });

  const {
    data: subcategories,
    isLoading: subcategoriesLoading,
    error: subcategoriesError,
  } = useGetSubcategoriesQuery(
    { categoryId: id || '', includeInactive: true },
    {
      skip: !id,
    }
  );

  const { data: iconFile } = useGetFileByIdQuery(category?.iconFileId || '', {
    skip: !category?.iconFileId,
  });

  const handleEdit = () => {
    navigate(`/content/categories/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/content/categories');
  };

  const handleCreateSubcategory = () => {
    navigate(`/content/subcategories/create?categoryId=${id}`);
  };

  const handleViewSubcategory = (subcategoryId: string) => {
    navigate(`/content/subcategories/${subcategoryId}`);
  };

  const handleEditSubcategory = (subcategoryId: string) => {
    navigate(`/content/subcategories/edit/${subcategoryId}`);
  };

  if (categoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    );
  }

  if (categoryError || !category) {
    return <CategoryNotFound onBack={handleBack} />;
  }

  return (
    <PermissionGuard action="view" subject="categories">
      <div className="space-y-6">
        <CategoryDetailHeader
          categoryName={category.name}
          onBack={handleBack}
          onEdit={handleEdit}
        />

        {/* Category Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryBasicInfo category={category} />
              <CategoryIconMetadata category={category} iconFile={iconFile} />
            </div>
          </div>
        </div>

        {/* Subcategories Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Subcategories
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage subcategories for this category
                </p>
              </div>
              <PermissionGuard action="create" subject="subcategories">
                <Button onClick={handleCreateSubcategory}>
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </PermissionGuard>
            </div>

            <CategorySubcategoriesList
              subcategories={subcategories}
              isLoading={subcategoriesLoading}
              error={subcategoriesError}
              onCreateSubcategory={handleCreateSubcategory}
              onViewSubcategory={handleViewSubcategory}
              onEditSubcategory={handleEditSubcategory}
            />
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
};

export default CategoryDetailView;
