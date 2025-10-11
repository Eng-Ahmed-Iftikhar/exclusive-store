import { useProductContext } from '@/contexts/ProductContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProductPage() {
  const navigate = useNavigate();
  const { productId } = useProductContext();

  useEffect(() => {
    if (!productId) {
      navigate('/content/products');
      return;
    }
    // Redirect to first step of product creation
    navigate(`/content/products/${productId}/edit/basic-info`, {
      replace: true,
    });
  }, [navigate, productId]);
  console.log('EditProductPage');

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Redirecting to product edit...
        </p>
      </div>
    </div>
  );
}

export default EditProductPage;
