import React from 'react';
import { useProductContext } from '@/contexts/ProductContext';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  PhotoIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface StepLayoutProps {
  currentStep: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

const STEPS = [
  {
    id: 1,
    name: 'Basic Info',
    icon: DocumentTextIcon,
    path: '/content/products/create/basic-info',
  },
  {
    id: 2,
    name: 'Variants',
    icon: Squares2X2Icon,
    path: '/content/products/create/variants',
  },
  {
    id: 3,
    name: 'Images',
    icon: PhotoIcon,
    path: '/content/products/create/images',
  },
  {
    id: 4,
    name: 'Review & Publish',
    icon: EyeIcon,
    path: '/content/products/create/review',
  },
];

const StepLayout: React.FC<StepLayoutProps> = ({
  currentStep,
  title,
  description,
  children,
}) => {
  const { isStepCompleted, canAccessStep, navigateToStep } =
    useProductContext();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Product
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Multi-step product creation with automatic draft saving
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between relative">
              {STEPS.map((step, stepIdx) => {
                const StepIcon = step.icon;
                const isCompleted = isStepCompleted(step.id);
                const isCurrent = currentStep === step.id;
                const isAccessible = canAccessStep(step.id);

                return (
                  <li
                    key={step.id}
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
                      onClick={() => isAccessible && navigateToStep(step.id)}
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
                        {step.name}
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
      </div>
    </div>
  );
};

export default StepLayout;
