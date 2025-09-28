import React from 'react';

const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome Back
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Sign in to your admin dashboard
      </p>
    </div>
  );
};

export default LoginHeader;
