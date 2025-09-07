import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FiArrowLeft, FiDatabase } from 'react-icons/fi';

interface ResourceFormHeaderProps {
  title: string;
  description: string;
  onBack: () => void;
}

const ResourceFormHeader: React.FC<ResourceFormHeaderProps> = ({
  title,
  description,
  onBack,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            theme === 'dark'
              ? 'text-gray-400 hover:bg-slate-800 hover:text-white border border-slate-700 hover:border-slate-600'
              : 'text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
          }`}
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Resources</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`p-4 rounded-xl shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-green-900/40 to-green-800/40 text-green-300 border border-green-700/50'
              : 'bg-gradient-to-br from-green-50 to-green-100 text-green-600 border border-green-200'
          }`}
        >
          <FiDatabase className="w-8 h-8" />
        </div>
        <div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceFormHeader;
