import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ProductCreationState {
  productId: string | null;
  currentStep: number;
  completedSteps: number[];
  productData: {
    name: string;
    description: string;
    sku: string;
    categoryId: string;
    subcategoryId: string;
    isFeatured: boolean;
    sortOrder: number;
  } | null;
}

interface ProductCreationContextType {
  state: ProductCreationState;
  productId: string | null;
  currentStep: number;
  isStepCompleted: (step: number) => boolean;
  canAccessStep: (step: number) => boolean;
  setProductId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  updateProductData: (
    data: Partial<ProductCreationState['productData']>
  ) => void;
  resetCreation: () => void;
  navigateToStep: (step: number) => void;
}

const ProductCreationContext = createContext<
  ProductCreationContextType | undefined
>(undefined);

const INITIAL_STATE: ProductCreationState = {
  productId: null,
  currentStep: 1,
  completedSteps: [],
  productData: null,
};

export const ProductCreationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [state, setState] = useState<ProductCreationState>(INITIAL_STATE);

  const setProductId = (id: string) => {
    setState((prev) => ({ ...prev, productId: id }));
  };

  const setCurrentStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  };

  const markStepComplete = (step: number) => {
    setState((prev) => ({
      ...prev,
      completedSteps: prev.completedSteps.includes(step)
        ? prev.completedSteps
        : [...prev.completedSteps, step].sort(),
    }));
  };

  const isStepCompleted = (step: number) => {
    return state.completedSteps.includes(step);
  };

  const canAccessStep = (step: number) => {
    // Can always access step 1
    if (step === 1) return true;

    // Can access a step if previous step is completed
    return isStepCompleted(step - 1);
  };

  const updateProductData = (
    data: Partial<ProductCreationState['productData']>
  ) => {
    setState((prev) => ({
      ...prev,
      productData: prev.productData
        ? { ...prev.productData, ...data }
        : (data as ProductCreationState['productData']),
    }));
  };

  const resetCreation = () => {
    setState(INITIAL_STATE);
  };

  const navigateToStep = (step: number) => {
    if (!canAccessStep(step)) {
      console.warn(
        `Cannot access step ${step}. Complete previous steps first.`
      );
      return;
    }

    setCurrentStep(step);
    const routes = [
      '',
      '/content/products/create/basic-info',
      '/content/products/create/variants',
      '/content/products/create/images',
      '/content/products/create/review',
    ];

    navigate(routes[step]);
  };

  const value: ProductCreationContextType = {
    state,
    productId: state.productId,
    currentStep: state.currentStep,
    isStepCompleted,
    canAccessStep,
    setProductId,
    setCurrentStep,
    markStepComplete,
    updateProductData,
    resetCreation,
    navigateToStep,
  };

  return (
    <ProductCreationContext.Provider value={value}>
      {children}
    </ProductCreationContext.Provider>
  );
};

export const useProductCreation = () => {
  const context = useContext(ProductCreationContext);
  if (context === undefined) {
    throw new Error(
      'useProductCreation must be used within ProductCreationProvider'
    );
  }
  return context;
};
