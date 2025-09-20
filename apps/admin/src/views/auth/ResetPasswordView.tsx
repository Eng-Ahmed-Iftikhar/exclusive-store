import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ResetPasswordForm from '@/sections/auth/reset-password/ResetPasswordForm';
import LoginBranding from '@/sections/auth/login/LoginBranding';
import LoginSupport from '@/sections/auth/login/LoginSupport';

const ResetPasswordView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSuccess = () => {
    navigate('/login');
  };

  // If no token, redirect to login
  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2">
          <LoginBranding />
        </div>

        {/* Right Side - Reset Password Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header (Mobile Only) */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-gray-900">
                Admin Panel
              </h1>
            </div>

            {/* Reset Password Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <ResetPasswordForm token={token} onSuccess={handleSuccess} />
            </div>

            {/* Support Information */}
            <div className="mt-8">
              <LoginSupport />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordView;
