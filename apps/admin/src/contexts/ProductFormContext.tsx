import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Variant {
  tempId: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  salePrice?: number;
  quantity: number;
  minThreshold: number;
  images: Array<{ file: File; preview: string; altText: string }>;
  isDefault: boolean;
}

export interface ProductFormData {
  // Step 1: Basic Info
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  subcategoryId: string;
  isFeatured: boolean;
  sortOrder: number;

  // Step 2: Variants
  variants: Variant[];

  // Step 3: Product-level Images
  productImages: Array<{ file: File; preview: string; altText: string }>;

  // Step 4: Publishing
  isActive: boolean;
  publishNow: boolean;
}

interface ProductFormContextType {
  formData: ProductFormData;
  currentStep: number;
  isSubmitting: boolean;
  updateFormData: (updates: Partial<ProductFormData>) => void;
  setCurrentStep: (step: number) => void;
  setIsSubmitting: (value: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceedToNextStep: () => boolean;
  resetForm: () => void;

  // Variant management
  addVariant: (variant: Variant) => void;
  updateVariant: (tempId: string, updates: Partial<Variant>) => void;
  removeVariant: (tempId: string) => void;
  setDefaultVariant: (tempId: string) => void;

  // Image management
  addProductImage: (image: {
    file: File;
    preview: string;
    altText: string;
  }) => void;
  removeProductImage: (index: number) => void;
  updateProductImageAltText: (index: number, altText: string) => void;
}

const ProductFormContext = createContext<ProductFormContextType | undefined>(
  undefined
);

const INITIAL_FORM_DATA: ProductFormData = {
  name: '',
  description: '',
  sku: '',
  categoryId: '',
  subcategoryId: '',
  isFeatured: false,
  sortOrder: 0,
  variants: [],
  productImages: [],
  isActive: false,
  publishNow: false,
};

const TOTAL_STEPS = 4;

export const ProductFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.variants.length > 0;
      case 3:
        return true; // Images are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  // Variant management
  const addVariant = (variant: Variant) => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, variant],
    }));
  };

  const updateVariant = (tempId: string, updates: Partial<Variant>) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v.tempId === tempId ? { ...v, ...updates } : v
      ),
    }));
  };

  const removeVariant = (tempId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.tempId !== tempId),
    }));
  };

  const setDefaultVariant = (tempId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => ({
        ...v,
        isDefault: v.tempId === tempId,
      })),
    }));
  };

  // Image management
  const addProductImage = (image: {
    file: File;
    preview: string;
    altText: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, image],
    }));
  };

  const removeProductImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
  };

  const updateProductImageAltText = (index: number, altText: string) => {
    setFormData((prev) => ({
      ...prev,
      productImages: prev.productImages.map((img, i) =>
        i === index ? { ...img, altText } : img
      ),
    }));
  };

  const value: ProductFormContextType = {
    formData,
    currentStep,
    isSubmitting,
    updateFormData,
    setCurrentStep,
    setIsSubmitting,
    nextStep,
    prevStep,
    canProceedToNextStep,
    resetForm,
    addVariant,
    updateVariant,
    removeVariant,
    setDefaultVariant,
    addProductImage,
    removeProductImage,
    updateProductImageAltText,
  };

  return (
    <ProductFormContext.Provider value={value}>
      {children}
    </ProductFormContext.Provider>
  );
};

export const useProductForm = () => {
  const context = useContext(ProductFormContext);
  if (context === undefined) {
    throw new Error('useProductForm must be used within ProductFormProvider');
  }
  return context;
};
