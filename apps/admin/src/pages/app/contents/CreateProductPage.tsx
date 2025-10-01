import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This page redirects to the multi-step product creation flow
 * The actual creation happens across multiple pages:
 * 1. Basic Info -> /content/products/create/basic-info
 * 2. Variants -> /content/products/create/variants
 * 3. Images -> /content/products/create/images
 * 4. Review & Publish -> /content/products/create/review
 */
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
