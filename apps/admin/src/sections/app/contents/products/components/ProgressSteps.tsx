import React from 'react';
import { useProductForm } from '@/contexts/ProductFormContext';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  PhotoIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const STEPS = [
  { id: 1, name: 'Product Info', icon: DocumentTextIcon },
  { id: 2, name: 'Variants', icon: Squares2X2Icon },
  { id: 3, name: 'Images', icon: PhotoIcon },
  { id: 4, name: 'Review & Publish', icon: EyeIcon },
];

const ProgressSteps: React.FC = () => {
  const { currentStep, setCurrentStep } = useProductForm();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {STEPS.map((step, stepIdx) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <li key={step.id} className="relative flex-1">
                {stepIdx !== 0 && (
                  <div
                    className={`absolute left-0 top-5 -ml-px mt-0.5 h-0.5 w-full transition-colors duration-300 ${
                      isCompleted
                        ? 'bg-indigo-600 dark:bg-indigo-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    style={{ width: 'calc(100% - 2rem)' }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`group relative flex flex-col items-center transition-opacity ${
                    isCurrent || isCompleted
                      ? ''
                      : 'cursor-not-allowed opacity-50'
                  }`}
                  disabled={!isCurrent && !isCompleted}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
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
                    className={`mt-2 text-sm font-medium transition-colors ${
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
  );
};

export default ProgressSteps;
