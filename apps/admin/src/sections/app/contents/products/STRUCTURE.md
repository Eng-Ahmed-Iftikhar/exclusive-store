# Product Module File Structure

## 📁 File Organization

```
src/
├── contexts/
│   └── ProductFormContext.tsx                 # ✨ Centralized state management
│
├── sections/app/contents/products/
│   ├── MultiStepProductForm.tsx               # 🎯 Main orchestrator
│   ├── CreateProductView.tsx                  # 📄 Page wrapper
│   │
│   ├── components/                            # 🧩 Reusable components
│   │   ├── ProgressSteps.tsx                  # Progress indicator
│   │   ├── FormNavigation.tsx                 # Navigation buttons
│   │   ├── VariantCard.tsx                    # Variant display card
│   │   └── VariantFormModal.tsx               # Variant add/edit modal
│   │
│   ├── steps/                                 # 📋 Step components
│   │   ├── StepProductInfo.tsx                # Step 1: Basic info
│   │   ├── StepVariants.tsx                   # Step 2: Variants
│   │   ├── StepImages.tsx                     # Step 3: Images
│   │   └── StepReview.tsx                     # Step 4: Review & publish
│   │
│   └── README.md                              # Documentation
│
└── apis/services/
    └── productApi.ts                          # ✅ Updated with variant endpoints
```

## 🔄 Component Hierarchy

```
CreateProductPage
  └── CreateProductView
      └── MultiStepProductForm
          └── ProductFormProvider (Context)
              ├── Header
              ├── ProgressSteps
              │   └── Step indicators (4 steps)
              ├── Form Content Area
              │   ├── StepProductInfo (Step 1)
              │   ├── StepVariants (Step 2)
              │   │   ├── VariantCard (multiple)
              │   │   └── VariantFormModal
              │   ├── StepImages (Step 3)
              │   └── StepReview (Step 4)
              └── FormNavigation
                  ├── Previous/Cancel button
                  └── Next/Draft/Publish buttons
```

## 🎨 Component Responsibilities

### Context Layer
| Component | Responsibility |
|-----------|---------------|
| `ProductFormContext` | State management, validation, helper methods |

### Main Components
| Component | Responsibility |
|-----------|---------------|
| `MultiStepProductForm` | Orchestrates the entire form flow & API calls |
| `ProgressSteps` | Visual step indicator, allows step navigation |
| `FormNavigation` | Handle navigation between steps & submission |

### Step Components
| Component | Responsibility |
|-----------|---------------|
| `StepProductInfo` | Collect basic product information |
| `StepVariants` | Manage product variants with full details |
| `StepImages` | Handle product-level image uploads |
| `StepReview` | Display summary and publishing options |

### Utility Components
| Component | Responsibility |
|-----------|---------------|
| `VariantCard` | Display single variant in grid |
| `VariantFormModal` | Add/edit variant with all details |

## 📊 Data Flow

### Context → Components
```tsx
// Context provides:
{
  formData,              // Current form state
  currentStep,           // Active step (1-4)
  isSubmitting,          // Submission status
  updateFormData,        // Update form fields
  addVariant,            // Add variant
  updateVariant,         // Modify variant
  removeVariant,         // Delete variant
  setDefaultVariant,     // Set default variant
  addProductImage,       // Add product image
  removeProductImage,    // Remove product image
  nextStep,              // Navigate forward
  prevStep,              // Navigate backward
  canProceedToNextStep,  // Validation check
}
```

### Components → Context
```tsx
// Components update context via:
useProductForm().updateFormData({ name: 'New Product' })
useProductForm().addVariant(variantData)
useProductForm().nextStep()
```

## 🎯 Key Features

### 1. Separation of Concerns
- ✅ Business logic in Context
- ✅ UI components are pure presentational
- ✅ API calls isolated in main orchestrator
- ✅ Reusable components

### 2. Type Safety
- ✅ Full TypeScript types
- ✅ Interfaces exported from context
- ✅ Type-safe context hooks

### 3. User Experience
- ✅ Step-by-step guidance
- ✅ Visual progress tracking
- ✅ Inline validation
- ✅ Draft/Publish workflow
- ✅ Image previews
- ✅ Dark mode support

### 4. Developer Experience
- ✅ Easy to extend with new steps
- ✅ Simple to add new fields
- ✅ Clear component boundaries
- ✅ Documented and maintainable

## 🔧 Extending the Form

### Add a New Field to Step 1
1. Update `ProductFormData` interface in `ProductFormContext.tsx`
2. Update `INITIAL_FORM_DATA` in context
3. Add form field in `StepProductInfo.tsx`
4. Include field in API call in `MultiStepProductForm.tsx`

### Add a New Step
1. Add step to `STEPS` array in `ProgressSteps.tsx`
2. Create new step component in `steps/` folder
3. Add step rendering logic in `MultiStepProductForm.tsx`
4. Update `canProceedToNextStep()` validation
5. Update `TOTAL_STEPS` constant in `FormNavigation.tsx`

### Add Custom Validation
Update `canProceedToNextStep()` in `ProductFormContext.tsx`:

```tsx
const canProceedToNextStep = () => {
  switch (currentStep) {
    case 1:
      return formData.name.trim() !== '' && formData.sku.trim() !== '';
    case 2:
      return formData.variants.length > 0 && formData.variants.every(v => v.price > 0);
    // ... more validations
  }
};
```

## 🚀 Usage Example

```tsx
// In your page component
import MultiStepProductForm from '@/sections/app/contents/products/MultiStepProductForm';

<MultiStepProductForm
  onSuccess={() => navigate('/content/products')}
  onCancel={() => navigate('/content/products')}
  isSubmitting={isSubmitting}
  setIsSubmitting={setIsSubmitting}
/>
```

## ✨ Benefits of This Architecture

1. **Maintainability**: Each component has a single responsibility
2. **Scalability**: Easy to add new steps or features
3. **Reusability**: Components can be reused in edit mode
4. **Testability**: Context and components can be tested independently
5. **Performance**: Only active step components are rendered
6. **Type Safety**: Full TypeScript support prevents runtime errors

## 📝 Notes

- All form state is managed in React Context
- File uploads use FormData for multipart/form-data
- Images are previewed using Object URLs
- Variants use temporary IDs until saved to backend
- Navigation is disabled on incomplete steps
- Draft mode saves product with `isActive: false`
- Publish mode saves product with `isActive: true`

