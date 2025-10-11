import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateProductPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to first step of product creation
    navigate('/content/products/create/basic-info', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Redirecting to product creation...
        </p>
      </div>
    </div>
  );
}

export default CreateProductPage;
