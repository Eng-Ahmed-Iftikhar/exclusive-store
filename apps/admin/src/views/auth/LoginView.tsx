import LoginBranding from '@/sections/auth/login/LoginBranding';
import LoginDemoCredentials from '@/sections/auth/login/LoginDemoCredentials';
import LoginForm from '@/sections/auth/login/LoginForm';
import LoginHeader from '@/sections/auth/login/LoginHeader';
import LoginMobileHeader from '@/sections/auth/login/LoginMobileHeader';
import LoginSupport from '@/sections/auth/login/LoginSupport';
import React from 'react';

// Main login page component with professional admin login experience
const LoginView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features (Desktop Only) */}
        <LoginBranding />

        {/* Right Side - Login Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header (Mobile Only) */}
            <LoginMobileHeader />

            {/* Login Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {/* Welcome Header */}
              <LoginHeader />

              {/* Demo Credentials */}
              <LoginDemoCredentials />

              {/* Login Form */}
              <LoginForm />

              {/* Support Information */}
              <LoginSupport />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
