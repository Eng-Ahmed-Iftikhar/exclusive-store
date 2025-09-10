import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SetupPasswordForm from '@/sections/auth/setup-password/SetupPasswordForm';

function SetupPasswordView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const handleSuccess = () => {
    navigate('/login');
  };

  const handleCancel = () => {
    navigate('/login');
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h2>
          <p className="text-gray-600 mb-4">
            This password setup link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <SetupPasswordForm
        email={email}
        token={token}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
}

export default SetupPasswordView;
