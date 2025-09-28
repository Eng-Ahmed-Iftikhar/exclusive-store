import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

interface SubcategoryNotFoundProps {
  onBack: () => void;
  error?: any;
}

const SubcategoryNotFound: React.FC<SubcategoryNotFoundProps> = ({
  onBack,
  error,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
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
          <Button variant="outline" onClick={onBack}>
            Go Back to Subcategories
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryNotFound;
