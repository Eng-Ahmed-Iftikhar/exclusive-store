import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  PhotoIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface EditStepLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onCancel: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
  isFinalStep?: boolean;
}

const EditStepLayout: React.FC<EditStepLayoutProps> = ({
  step,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onBack,
  onCancel,
  canProceed,
  isSubmitting,
  isFinalStep = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const STEPS = [
    {
      id: 1,
      name: 'Basic Info',
      icon: DocumentTextIcon,
      path: `/content/products/${id}/edit/basic-info`,
    },
    {
      id: 2,
      name: 'Variants',
      icon: Squares2X2Icon,
      path: `/content/products/${id}/edit/variants`,
    },
    {
      id: 3,
      name: 'Images',
      icon: PhotoIcon,
      path: `/content/products/${id}/edit/images`,
    },
    {
      id: 4,
      name: 'Review & Publish',
      icon: EyeIcon,
      path: `/content/products/${id}/edit/review`,
    },
  ];

  const handleStepClick = (stepId: number) => {
    const targetStep = STEPS.find((s) => s.id === stepId);
    if (targetStep) {
      navigate(targetStep.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Multi-step product editing with automatic draft saving
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between relative">
              {STEPS.map((stepItem, stepIdx) => {
                const StepIcon = stepItem.icon;
                const isCompleted = stepItem.id < step;
                const isCurrent = step === stepItem.id;
                const isAccessible = stepItem.id <= step || isCompleted;

                return (
                  <li
                    key={stepItem.id}
                    className="relative flex-1 flex items-center"
                  >
                    {stepIdx !== 0 && (
                      <div
                        className={`absolute right-1/2 left-0 top-5 h-0.5 transition-colors duration-300 -z-10 ${
                          isCompleted
                            ? 'bg-indigo-600 dark:bg-indigo-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        isAccessible && handleStepClick(stepItem.id)
                      }
                      className={`relative flex flex-col items-center w-full transition-opacity ${
                        isAccessible
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                      disabled={!isAccessible}
                    >
                      <span
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                          isCompleted
                            ? 'border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500'
                            : isCurrent
                            ? 'border-indigo-600 bg-white dark:border-indigo-500 dark:bg-gray-800'
                            : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon className="h-6 w-6 text-white" />
                        ) : (
                          <StepIcon
                            className={`h-6 w-6 transition-colors ${
                              isCurrent
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          />
                        )}
                      </span>
                      <span
                        className={`mt-2 text-xs sm:text-sm font-medium transition-colors text-center ${
                          isCurrent
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : isCompleted
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {stepItem.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
          {children}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canProceed || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              {isSubmitting
                ? 'Saving...'
                : isFinalStep
                ? 'Save & Publish'
                : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStepLayout;
