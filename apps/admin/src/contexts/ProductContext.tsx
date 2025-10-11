import {
  Product,
  useLazyGetProductByIdQuery,
} from '@/apis/services/productApi';
import { basicInfoFormSchema } from '@/sections/app/contents/products/ProductBasicInfoForm';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export interface ProductCreationState {
  currentStep: CURRENT_STEPS;
  completedSteps: CURRENT_STEPS[];
  productData: Product | null;
}
export enum CURRENT_STEPS {
  BASIC_INFO = 'BASIC_INFO',
  VARIANTS = 'VARIANTS',
  IMAGES = 'IMAGES',
  REVIEW = 'REVIEW',
}

interface ProductContextType {
  state: ProductCreationState;
  currentStep: CURRENT_STEPS;
  isStepCompleted: (step: CURRENT_STEPS) => boolean;
  canAccessStep: (step: CURRENT_STEPS) => boolean;
  setCurrentStep: (step: CURRENT_STEPS) => void;
  markStepComplete: (step: CURRENT_STEPS) => Promise<boolean>;
  updateProductData: (
    data: Partial<ProductCreationState['productData']>
  ) => Promise<boolean>;
  refreshProductData: () => Promise<void>;
  resetCreation: () => void;
  navigateToStep: (step: CURRENT_STEPS) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const INITIAL_STATE: ProductCreationState = {
  currentStep: CURRENT_STEPS.BASIC_INFO,
  completedSteps: [],
  productData: null,
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [getProductById] = useLazyGetProductByIdQuery();
  const [state, setState] = useState<ProductCreationState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  const setCurrentStep = useCallback((step: CURRENT_STEPS) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const markStepComplete = useCallback((step: CURRENT_STEPS) => {
    return new Promise<boolean>((resolve) => {
      try {
        setState((prev) => ({
          ...prev,
          completedSteps: [...new Set([...prev.completedSteps, step])],
        }));
        resolve(true);
      } catch (error) {
        console.error('ProductContext: Failed to mark step complete', error);
        resolve(false);
      }
    });
  }, []);

  const isStepCompleted = useCallback(
    (step: CURRENT_STEPS) => {
      return state.completedSteps.includes(step);
    },
    [state]
  );

  const canAccessStep = useCallback(
    (newStep: CURRENT_STEPS) => {
      // Can always access step 1
      if (newStep === CURRENT_STEPS.BASIC_INFO) return true;

      // Can access a step if previous step is completed
      return !isStepCompleted(newStep);
    },
    [isStepCompleted]
  );

  const updateProductData = useCallback(
    (data: Partial<ProductCreationState['productData']>) => {
      return new Promise<boolean>((resolve) => {
        try {
          setState((prev) => ({
            ...prev,
            productData: prev.productData
              ? { ...prev.productData, ...data }
              : (data as ProductCreationState['productData']),
          }));
          resolve(true);
        } catch (error) {
          console.error('ProductContext: Failed to update product data', error);
          resolve(false);
        }
      });
    },
    []
  );

  const resetCreation = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const navigateToStep = useCallback(
    (step: CURRENT_STEPS) => {
      setCurrentStep(step);
      const createProductRoutes: Record<CURRENT_STEPS, string> = {
        [CURRENT_STEPS.BASIC_INFO]: '/content/products/create/basic-info',
        [CURRENT_STEPS.IMAGES]: '/content/products/create/images',
        [CURRENT_STEPS.REVIEW]: '/content/products/create/review',
        [CURRENT_STEPS.VARIANTS]: '/content/products/create/variants',
      };
      const editProductRoutes: Record<CURRENT_STEPS, string> = {
        [CURRENT_STEPS.BASIC_INFO]: `/content/products/${productId}/edit/basic-info`,
        [CURRENT_STEPS.VARIANTS]: `/content/products/${productId}/edit/variants`,
        [CURRENT_STEPS.IMAGES]: `/content/products/${productId}/edit/images`,
        [CURRENT_STEPS.REVIEW]: `/content/products/${productId}/edit/review`,
      };
      const navRoute = productId
        ? editProductRoutes[step]
        : createProductRoutes[step];
      navigate(navRoute);
    },
    [setCurrentStep, productId, navigate]
  );

  const updateCompletedSteps = useCallback((productData: Product) => {
    if (basicInfoFormSchema.safeParse(productData).success) {
      setState((prev) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, CURRENT_STEPS.BASIC_INFO],
      }));
    }
    if (productData.variants && productData.variants.length > 0) {
      setState((prev) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, CURRENT_STEPS.VARIANTS],
      }));
    }
    if (productData.images && productData.images.length > 0) {
      setState((prev) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, CURRENT_STEPS.IMAGES],
      }));
    }
    if (productData.reviews && productData.reviews.length > 0) {
      setState((prev) => ({
        ...prev,
        completedSteps: [...prev.completedSteps, CURRENT_STEPS.REVIEW],
      }));
    }
  }, []);

  const getProductByIdCallback = useCallback(async () => {
    if (!productId) {
      console.log('No productId, skipping fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getProductById(productId as string);
      console.log('ProductContext: Loaded product data', response.data);
      setState((prev) => ({ ...prev, productData: response.data as Product }));
      updateCompletedSteps(response.data as Product);
    } catch (error) {
      console.error('ProductContext: Failed to load product', error);
    } finally {
      setLoading(false);
    }
  }, [getProductById, productId, updateCompletedSteps]);

  const refreshProductData = useCallback(async () => {
    if (!productId) {
      return;
    }

    try {
      const response = await getProductById(productId as string);
      console.log('ProductContext: Refreshed product data', response.data);
      setState((prev) => ({ ...prev, productData: response.data as Product }));
    } catch (error) {
      console.error('ProductContext: Failed to refresh product', error);
    }
  }, [getProductById, productId]);

  useEffect(() => {
    getProductByIdCallback();
  }, [getProductByIdCallback]);

  const value: ProductContextType = {
    state,
    currentStep: state.currentStep,
    isStepCompleted,
    canAccessStep,
    setCurrentStep,
    markStepComplete,
    updateProductData,
    refreshProductData,
    resetCreation,
    navigateToStep,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within ProductProvider');
  }
  return context;
};
