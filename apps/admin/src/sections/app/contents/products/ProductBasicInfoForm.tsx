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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  stock: z.number().min(0),
  categoryId: z.string(),
  subcategoryId: z.string(),
  isFeatured: z.boolean(),
  sortOrder: z.number(),
});

interface ProductBasicInfoFormData {
  name: string;
  description: string;
  sku: string;
  stock: number;
  categoryId: string;
  subcategoryId: string;
  isFeatured: boolean;
  sortOrder: number;
}

interface ProductBasicInfoFormProps {
  onSubmit: (
    data: ProductBasicInfoFormData & {
      prices: { price: number; salePrice?: number; currency: string }[];
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
      stock: productData?.stock || 0,
      categoryId: productData?.categoryId || '',
      subcategoryId: productData?.subcategoryId || '',
      isFeatured: productData?.isFeatured || false,
      sortOrder: productData?.sortOrder || 0,
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
          stock: productData.stock || 0,
          categoryId: productData.categoryId || '',
          subcategoryId: productData.subcategoryId || '',
          isFeatured: productData.isFeatured || false,
          sortOrder: productData.sortOrder || 0,
        }
      : undefined,
    resolver: zodResolver(basicInfoFormSchema),
  });

  const categoryId = form.watch('categoryId');
  const [prices, setPrices] = useState<
    { price: number; salePrice?: number; currency: string }[]
  >([{ price: 0, currency: 'USD' }]);

  // Fetch subcategories when a category is selected
  const { data: subcategories } = useGetSubcategoriesByCategoryQuery(
    categoryId,
    {
      skip: !categoryId,
    }
  );

  // Price management functions
  const addPrice = () => {
    setPrices([...prices, { price: 0, currency: 'USD' }]);
  };

  const removePrice = (index: number) => {
    if (prices.length > 1) {
      setPrices(prices.filter((_, i) => i !== index));
    }
  };

  const updatePrice = (
    index: number,
    field: 'price' | 'salePrice' | 'currency',
    value: string | number | undefined
  ) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: value };
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
        }))
      );
    } else {
      setPrices([{ price: 0, currency: 'USD' }]);
    }
  }, [productData]);

  // Create a key for forcing re-render of Select components
  const formKey = productData?.id || 'new';

  const handleFormSubmit = async (data: ProductBasicInfoFormData) => {
    const formData = {
      ...data,
      prices: prices,
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
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
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
                <Select
                  value={price.currency}
                  onValueChange={(value) =>
                    updatePrice(index, 'currency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                {prices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePrice(index)}
                    className="text-red-600 hover:text-red-700"
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
                <Select
                  key={`category-${formKey}`}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('subcategoryId', '');
                  }}
                  value={field.value || undefined}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  key={`subcategory-${formKey}-${categoryId}`}
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  defaultValue={field.value || undefined}
                  disabled={!categoryId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subcategories?.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
