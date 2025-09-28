import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'blue' | 'gray' | 'dark' | 'slate' | 'primary';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'white',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const colorClasses = {
    white: 'border-white border-t-transparent',
    blue: 'border-blue-600 border-t-transparent dark:border-blue-400',
    gray: 'border-gray-600 border-t-transparent dark:border-gray-400',
    dark: 'border-gray-300 dark:border-slate-500 border-t-transparent',
    slate: 'border-slate-300 dark:border-slate-600 border-t-transparent',
    primary: 'border-blue-600 dark:border-blue-400 border-t-transparent',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin ${className}`}
    />
  );
};

export default LoadingSpinner;
