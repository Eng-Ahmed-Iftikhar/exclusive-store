import React from 'react';

// LoginSupport component for support information and contact details
const LoginSupport: React.FC = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Need help?{' '}
        <button 
          type="button"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
        >
          Contact support
        </button>
      </p>
    </div>
  );
};

export default LoginSupport;
