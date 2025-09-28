import React from 'react';

// LoginDemoCredentials component for demo access information
const LoginDemoCredentials: React.FC = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      {/* Demo Access Header */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Admin Access
        </span>
      </div>
      
      {/* Instructions */}
      <p className="text-sm text-blue-700 dark:text-blue-300">
        Use these credentials to access the admin panel
      </p>
      
      {/* Credentials Display */}
      <div className="mt-3 space-y-2">
        <div className="text-xs text-blue-600 dark:text-blue-400">
          <span className="font-medium">Admin:</span> admin@exclusive.com / admin123
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400">
          <span className="font-medium">Superadmin:</span> superadmin@exclusive.com / superadmin123
        </div>
      </div>
    </div>
  );
};

export default LoginDemoCredentials;
