# Multi-Step Product Creation Form

A professional, multi-step form for creating products with variants, pricing, stock management, and images.

## Architecture

### Context-Based State Management
- **Location**: `src/contexts/ProductFormContext.tsx`
- **Purpose**: Centralized state management for the entire product creation flow
- **Benefits**: 
  - Cleaner component code
  - Easier state sharing across steps
  - Better testability
  - Separation of concerns

### Component Structure

```
products/
├── MultiStepProductForm.tsx          # Main orchestrator component
├── components/                        # Reusable UI components
│   ├── ProgressSteps.tsx             # Step indicator with progress bar
│   ├── FormNavigation.tsx            # Bottom navigation (Previous/Next/Draft/Publish)
│   ├── VariantCard.tsx               # Individual variant display card
│   └── VariantFormModal.tsx          # Modal for adding/editing variants
└── steps/                            # Step-specific components
    ├── StepProductInfo.tsx           # Step 1: Basic product information
    ├── StepVariants.tsx              # Step 2: Product variants management
    ├── StepImages.tsx                # Step 3: Product-level images
    └── StepReview.tsx                # Step 4: Review and publish options
```

## Features

### 1. Multi-Step Flow
- **Step 1: Product Info** - Name, description, SKU, category, subcategory
- **Step 2: Variants** - Create product variants with attributes, pricing, stock, and images
- **Step 3: Images** - Upload product-level images (optional if variant images exist)
- **Step 4: Review & Publish** - Review all details and choose to draft or publish

### 2. Variant Management
- Add multiple product variants (colors, sizes, materials, etc.)
- Custom attributes (JSON-based, flexible)
- Individual pricing per variant (regular + sale price)
- Individual stock management per variant
- Variant-specific images
- Set default variant
- Edit/remove variants

### 3. Draft & Publish
- **Save as Draft**: Product saved but not visible to customers (`isActive: false`)
- **Publish**: Product immediately visible to customers (`isActive: true`)

### 4. Professional UI/UX
- Clean, modern design with Tailwind CSS
- Dark mode support
- Step-by-step validation
- Visual progress indicator
- Responsive design
- Hover effects and transitions
- Image previews with drag-and-drop support

## Usage

### Basic Usage

```tsx
import MultiStepProductForm from '@/sections/app/contents/products/MultiStepProductForm';

function CreateProductPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    navigate('/content/products');
  };

  const handleCancel = () => {
    navigate('/content/products');
  };

  return (
    <MultiStepProductForm
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}
```

### Using the Context

```tsx
import { useProductForm } from '@/contexts/ProductFormContext';

function CustomComponent() {
  const {
    formData,
    currentStep,
    updateFormData,
    addVariant,
    removeVariant,
    nextStep,
    prevStep,
  } = useProductForm();

  // Access and modify form data
}
```

## Data Flow

### 1. Product Creation
```
User fills Step 1 → Next → Step 2 → Add Variants → Step 3 → Add Images → Step 4 → Publish/Draft
```

### 2. Backend API Calls (on Submit)
```
1. POST /products → Create base product
2. For each variant:
   a. POST /products/variants → Create variant
   b. POST /products/prices → Create variant price
   c. POST /products/stock → Create variant stock
   d. For each variant image:
      - POST /files/upload → Upload image to Cloudinary
      - POST /products/images → Link image to variant
3. For each product image:
   - POST /files/upload → Upload image
   - POST /products/images → Link image to product
```

## Schema Alignment

The form aligns perfectly with the backend schema:

### Product
- `name`, `description`, `sku` - Basic info
- `categoryId`, `subcategoryId` - Categorization
- `isFeatured`, `sortOrder` - Display options
- `isActive` - Draft/Publish status

### ProductVariant
- `productId` - Links to parent product
- `sku`, `name` - Variant identification
- `attributes` - Flexible JSON attributes
- `isDefault` - Default variant flag

### Price (per variant)
- `variantId` - Links to variant
- `price`, `salePrice` - Pricing
- `currency`, `isActive` - Price settings

### Stock (per variant)
- `variantId` - Links to variant
- `quantity`, `minThreshold` - Stock levels

### ProductImage
- `productId` OR `variantId` - Can link to either
- `fileId` - Links to File module
- `altText`, `isPrimary`, `sortOrder` - Image settings

## Validation Rules

### Step 1 (Product Info)
- Product name is required
- Other fields are optional

### Step 2 (Variants)
- At least 1 variant is required
- Each variant must have: SKU, Name, Price > 0
- Only one default variant allowed

### Step 3 (Images)
- Optional (can skip if variant images exist)

### Step 4 (Review)
- No validation, just confirmation

## State Management

### Context Methods

#### Form Data
- `formData` - Current form state
- `updateFormData(updates)` - Update form fields

#### Navigation
- `currentStep` - Current step number (1-4)
- `setCurrentStep(step)` - Jump to specific step
- `nextStep()` - Go to next step
- `prevStep()` - Go to previous step
- `canProceedToNextStep()` - Validation check

#### Variants
- `addVariant(variant)` - Add new variant
- `updateVariant(tempId, updates)` - Update existing variant
- `removeVariant(tempId)` - Remove variant
- `setDefaultVariant(tempId)` - Set as default

#### Images
- `addProductImage(image)` - Add product image
- `removeProductImage(index)` - Remove product image
- `updateProductImageAltText(index, altText)` - Update alt text

## Styling

- Uses Tailwind CSS utility classes
- Supports dark mode throughout
- Responsive breakpoints: `sm`, `md`, `lg`
- Color scheme: Indigo (primary), Gray (neutral), Red (destructive), Green (success)

## Future Enhancements

- [ ] Bulk variant creation from CSV
- [ ] Image reordering with drag-and-drop
- [ ] Auto-generate SKUs based on attributes
- [ ] Price history/scheduling
- [ ] Stock alerts configuration
- [ ] SEO metadata fields
- [ ] Related products linking
- [ ] Duplicate product feature

