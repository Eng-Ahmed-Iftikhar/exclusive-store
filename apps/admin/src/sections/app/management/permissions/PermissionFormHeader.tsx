import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FiArrowLeft, FiShield } from 'react-icons/fi';

interface PermissionFormHeaderProps {
  title: string;
  description: string;
  onBack: () => void;
}

const PermissionFormHeader: React.FC<PermissionFormHeaderProps> = ({
  title,
  description,
  onBack,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:bg-slate-700 hover:text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-900/30 text-blue-400'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <h1
              className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title}
            </h1>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionFormHeader;
