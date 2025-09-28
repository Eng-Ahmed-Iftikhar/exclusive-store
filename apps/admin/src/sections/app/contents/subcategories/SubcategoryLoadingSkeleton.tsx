import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

interface SubcategoryLoadingSkeletonProps {
  onBack: () => void;
}

const SubcategoryLoadingSkeleton: React.FC<SubcategoryLoadingSkeletonProps> = ({
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
  );
};

export default SubcategoryLoadingSkeleton;
