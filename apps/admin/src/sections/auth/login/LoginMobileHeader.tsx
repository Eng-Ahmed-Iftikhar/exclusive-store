import React from 'react';

// LoginMobileHeader component for mobile logo and branding
const LoginMobileHeader: React.FC = () => {
  return (
    <div className="lg:hidden text-center mb-8">
      {/* Mobile Logo Container */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        {/* Logo Icon */}
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-sm"></div>
        </div>
        
        {/* Company Name and Tagline */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AdminPanel
          </h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
            E-commerce Admin
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginMobileHeader;
