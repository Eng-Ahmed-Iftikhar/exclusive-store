import { useGetCategoriesQuery } from '@/apis/services/categoryApi';
import { useGetSubcategoriesByCategoryQuery } from '@/apis/services/subcategoryApi';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Autocomplete, AutocompleteField } from '@/components/ui/autocomplete';
import { useProductContext } from '@/contexts/ProductContext';
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const basicInfoFormSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  description: z.string(),
  sku: z.string(),
  categoryId: z.string(),
  subcategoryId: z.string(),
  isFeatured: z.boolean(),
  sortOrder: z.number(),
  stock: z.number().min(0, { message: 'Stock must be 0 or greater' }),
});

interface ProductBasicInfoFormData {
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  subcategoryId: string;
  isFeatured: boolean;
  sortOrder: number;
  stock: number;
}

interface ProductBasicInfoFormProps {
  onSubmit: (
    data: ProductBasicInfoFormData & {
      prices: {
        price: number;
        salePrice?: number;
        currency: string;
        isActive?: boolean;
      }[];
    }
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ProductBasicInfoForm: React.FC<ProductBasicInfoFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const { data: categories } = useGetCategoriesQuery({});
  const { state } = useProductContext();
  const productData = state.productData;

  // Memoize default values to prevent unnecessary re-initialization
  const defaultValues = useMemo(
    () => ({
      name: productData?.name || '',
      description: productData?.description || '',
      sku: productData?.sku || '',
      categoryId: productData?.categoryId || '',
      subcategoryId: productData?.subcategoryId || '',
      isFeatured: productData?.isFeatured || false,
      sortOrder: productData?.sortOrder || 0,
      stock: productData?.stock?.[0]?.quantity || 0,
    }),
    [productData]
  );

  const form = useForm<ProductBasicInfoFormData>({
    defaultValues,
    values: productData
      ? {
          name: productData.name || '',
          description: productData.description || '',
          sku: productData.sku || '',
          categoryId: productData.categoryId || '',
          subcategoryId: productData.subcategoryId || '',
          isFeatured: productData.isFeatured || false,
          sortOrder: productData.sortOrder || 0,
          stock: productData.stock?.[0]?.quantity || 0,
        }
      : undefined,
    resolver: zodResolver(basicInfoFormSchema),
  });

  const categoryId = form.watch('categoryId');
  const [prices, setPrices] = useState<
    {
      price: number;
      salePrice?: number;
      currency: string;
      isActive?: boolean;
    }[]
  >([{ price: 0, currency: 'USD', isActive: true }]);

  // Fetch subcategories when a category is selected
  const { data: subcategories } = useGetSubcategoriesByCategoryQuery(
    categoryId,
    {
      skip: !categoryId,
    }
  );

  // Price management functions
  const addPrice = () => {
    setPrices([...prices, { price: 0, currency: 'USD', isActive: false }]);
  };

  const removePrice = (index: number) => {
    if (prices.length > 1) {
      // Prevent removing the last active price
      const activePriceCount = prices.filter((p) => p.isActive).length;
      if (prices[index].isActive && activePriceCount === 1) {
        alert(
          'Cannot remove the last active price. At least one price must be active.'
        );
        return;
      }

      const updatedPrices = prices.filter((_, i) => i !== index);

      // If we removed the active price, set the first remaining price as active
      if (prices[index].isActive && updatedPrices.length > 0) {
        updatedPrices[0].isActive = true;
      }

      setPrices(updatedPrices);
    }
  };

  const updatePrice = (
    index: number,
    field: 'price' | 'salePrice' | 'currency' | 'isActive',
    value: string | number | boolean | undefined
  ) => {
    const updatedPrices = [...prices];

    if (field === 'isActive' && value === true) {
      // If setting this price as active, deactivate all others
      updatedPrices.forEach((price, i) => {
        price.isActive = i === index;
      });
    } else if (field === 'isActive' && value === false) {
      // Prevent deactivating the last active price
      const activePriceCount = updatedPrices.filter((p) => p.isActive).length;
      if (activePriceCount <= 1) {
        return; // Don't allow deactivating the last active price
      }
      updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    } else {
      updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    }

    setPrices(updatedPrices);
  };

  // Initialize prices from product data
  useEffect(() => {
    if (productData?.prices && productData.prices.length > 0) {
      setPrices(
        productData.prices.map((price) => ({
          price: price.price,
          salePrice: price.salePrice,
          currency: price.currency,
          isActive: price.isActive,
        }))
      );
    } else {
      setPrices([{ price: 0, currency: 'USD', isActive: true }]);
    }
  }, [productData]);

  const handleFormSubmit = async (data: ProductBasicInfoFormData) => {
    // Validate that at least one price is active
    const activePriceCount = prices.filter((p) => p.isActive).length;
    if (prices.length > 0 && activePriceCount === 0) {
      alert('At least one price must be active');
      return;
    }

    const formData = {
      ...data,
      prices: prices,
      stock: data.stock, // Include stock in the form data
    };
    await onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'Product name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Product Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., Premium Cotton T-Shirt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product in detail..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description to help customers understand your
                product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SKU */}
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base SKU (Stock Keeping Unit)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., TSHIRT-001" {...field} />
              </FormControl>
              <FormDescription>
                This is the base SKU. Each variant will have its own unique SKU
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="100"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>
                Available stock quantity for this product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pricing Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Product Pricing
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPrice}
            >
              Add Price
            </Button>
          </div>

          {prices.map((price, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="29.99"
                  value={price.price}
                  onChange={(e) =>
                    updatePrice(index, 'price', parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sale Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="19.99"
                  value={price.salePrice || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    updatePrice(
                      index,
                      'salePrice',
                      value ? parseFloat(value) : undefined
                    );
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currency
                </label>
                <Autocomplete
                  value={price.currency}
                  onValueChange={(value) =>
                    updatePrice(index, 'currency', value)
                  }
                  options={[
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                    { value: 'GBP', label: 'GBP' },
                  ]}
                  placeholder="Select Currency"
                  searchPlaceholder="Search currencies..."
                  emptyMessage="No currency found."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`active-${index}`}
                  checked={price.isActive || false}
                  disabled={
                    price.isActive &&
                    prices.filter((p) => p.isActive).length === 1
                  }
                  onCheckedChange={(checked) =>
                    updatePrice(index, 'isActive', checked === true)
                  }
                />
                <label
                  htmlFor={`active-${index}`}
                  className={`text-sm font-medium ${
                    price.isActive &&
                    prices.filter((p) => p.isActive).length === 1
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Active Price
                  {price.isActive &&
                    prices.filter((p) => p.isActive).length === 1 && (
                      <span className="text-xs text-gray-500 ml-1">
                        (Required)
                      </span>
                    )}
                </label>
              </div>

              <div className="flex items-end">
                {prices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePrice(index)}
                    disabled={
                      price.isActive &&
                      prices.filter((p) => p.isActive).length === 1
                    }
                    className={`${
                      price.isActive &&
                      prices.filter((p) => p.isActive).length === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <AutocompleteField
                    field={field}
                    options={
                      categories?.map((category) => ({
                        value: category.id,
                        label: category.name,
                      })) || []
                    }
                    placeholder="Select Category"
                    searchPlaceholder="Search categories..."
                    emptyMessage="No categories found."
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('subcategoryId', '');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <AutocompleteField
                    field={field}
                    options={
                      subcategories?.map((sub) => ({
                        value: sub.id,
                        label: sub.name,
                      })) || []
                    }
                    placeholder="Select Subcategory"
                    searchPlaceholder="Search subcategories..."
                    emptyMessage="No subcategories found."
                    disabled={!categoryId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Options */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Additional Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Product</FormLabel>
                    <FormDescription>
                      Show this product in featured sections
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
            {!isSubmitting && <ArrowRightIcon className="h-5 w-5 ml-2" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductBasicInfoForm;
