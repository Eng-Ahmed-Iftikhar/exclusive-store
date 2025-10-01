import React from 'react';
import { useProductForm } from '@/contexts/ProductFormContext';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface FormNavigationProps {
  onCancel: () => void;
  onSubmit: (publishNow: boolean) => Promise<void>;
}

const TOTAL_STEPS = 4;

const FormNavigation: React.FC<FormNavigationProps> = ({
  onCancel,
  onSubmit,
}) => {
  const {
    currentStep,
    isSubmitting,
    canProceedToNextStep,
    nextStep,
    prevStep,
    updateFormData,
  } = useProductForm();

  const handleSaveDraft = async () => {
    updateFormData({ publishNow: false, isActive: false });
    await onSubmit(false);
  };

  const handlePublish = async () => {
    updateFormData({ publishNow: true, isActive: true });
    await onSubmit(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={currentStep === 1 ? onCancel : prevStep}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>

        <div className="flex space-x-3">
          {currentStep === TOTAL_STEPS && (
            <>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting || !canProceedToNextStep()}
                className="inline-flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting || !canProceedToNextStep()}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Product'}
                <CheckCircleIcon className="h-5 w-5 ml-2" />
              </button>
            </>
          )}

          {currentStep < TOTAL_STEPS && (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNextStep()}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Step
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormNavigation;
