import React from 'react';

interface TableHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`p-6 pb-0 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
};

export default TableHeader;
