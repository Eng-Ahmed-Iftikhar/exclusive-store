import React from 'react';
import { FiShield, FiTrendingUp } from 'react-icons/fi';

interface AdminLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white' | 'minimal';
  showText?: boolean;
}

const AdminLogo: React.FC<AdminLogoProps> = ({ 
  size = 'md', 
  variant = 'default',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getLogoColors = () => {
    switch (variant) {
      case 'white':
        return 'bg-white text-blue-600';
      case 'minimal':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'white':
        return 'text-gray-900';
      case 'minimal':
        return 'text-gray-900';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`${sizeClasses[size]} ${getLogoColors()} rounded-xl flex items-center justify-center shadow-lg`}>
        <div className="relative">
          <FiShield className={`${iconSizes[size]} absolute inset-0 m-auto`} />
          <FiTrendingUp className={`${iconSizes[size]} absolute inset-0 m-auto text-blue-200 opacity-60`} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-bold ${getTextColor()} leading-none`}>
            AdminPanel
          </h1>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            E-commerce Admin
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminLogo;
