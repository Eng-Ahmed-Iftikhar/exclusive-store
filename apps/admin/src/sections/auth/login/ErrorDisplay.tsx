import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface ErrorDisplayProps {
  error?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
      <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <span className="text-sm font-medium">{error}</span>
    </div>
  );
};

export default ErrorDisplay;
