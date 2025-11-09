import { useProductContext } from '@/contexts/ProductContext';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useCreatePriceMutation,
  useUpdatePriceMutation,
  useCreateStockMutation,
  useUpdateStockMutation,
  useCreateProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
  ProductImage,
} from '@/apis/services/productApi';
import { useUploadFileMutation } from '@/apis/services/fileApi';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const variantSchema = z.object({
  variantId: z.string().optional(),
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be positive'),
  salePrice: z.number().optional(),
  quantity: z.number().min(0, 'Quantity must be positive'),
  minThreshold: z.number().min(0, 'Min threshold must be positive'),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  priceId: z.string().optional(),
  stockId: z.string().optional(),
});

const formSchema = z.object({
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
});

type VariantFormData = z.infer<typeof variantSchema>;
type FormData = z.infer<typeof formSchema>;

interface ProductVariantsFormProps {
  onComplete: () => void;
  onBack: () => void;
}

const ProductVariantsForm: React.FC<ProductVariantsFormProps> = ({
  onComplete,
  onBack,
}) => {
  const { state, refreshProductData } = useProductContext();
  const productId = state.productData?.id;
  const existingVariants = state.productData?.variants || [];

  const [createVariant] = useCreateVariantMutation();
  const [updateVariant] = useUpdateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();
  const [createPrice] = useCreatePriceMutation();
  const [updatePrice] = useUpdatePriceMutation();
  const [createStock] = useCreateStockMutation();
  const [updateStock] = useUpdateStockMutation();
  const [createProductImage] = useCreateProductImageMutation();
  const [updateProductImage] = useUpdateProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const [uploadFile] = useUploadFileMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadingImages, setUploadingImages] = useState<{
    [key: number]: boolean;
  }>({});

  // Transform existing variants to form data
  const initialVariants: VariantFormData[] = existingVariants.map((v) => ({
    variantId: v.id,
    name: v.name,
    sku: v.sku,
    price: Number(v.prices?.[0]?.price || 0),
    salePrice: v.prices?.[0]?.salePrice
      ? Number(v.prices[0].salePrice)
      : undefined,
    quantity: v.stock?.[0]?.quantity || 0,
    minThreshold: v.stock?.[0]?.minThreshold || 10,
    isDefault: v.isDefault,
    isActive: v.isActive,
    sortOrder: v.sortOrder,
    priceId: v.prices?.[0]?.id,
    stockId: v.stock?.[0]?.id,
  }));

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variants: initialVariants.length > 0 ? initialVariants : [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'variants',
  });
  console.log(fields, 'fields', initialVariants);
  const addNewVariant = () => {
    const newVariant: VariantFormData = {
      name: '',
      sku: '',
      price: 0,
      quantity: 0,
      minThreshold: 10,
      isDefault: fields.length === 0,
      isActive: true,
      sortOrder: fields.length,
    };
    append(newVariant);
    setEditingIndex(fields.length);
  };

  const handleEditVariant = (index: number) => {
    setEditingIndex(index);
  };

  const handleCancelEdit = (index: number) => {
    // If it's a new variant (no id), remove it
    if (!fields[index].id) {
      remove(index);
    }
    setEditingIndex(null);
  };

  const handleDeleteVariant = async (index: number) => {
    const variant = fields[index];
    if (variant.id) {
      if (!window.confirm('Are you sure you want to delete this variant?'))
        return;

      try {
        await deleteVariant(variant.id).unwrap();
        remove(index);

        // Refresh product data from server
        await refreshProductData();
      } catch (error) {
        console.error('Failed to delete variant:', error);
        alert('Failed to delete variant. Please try again.');
      }
    } else {
      remove(index);
    }
    setEditingIndex(null);
  };

  const saveVariant = async (index: number) => {
    const variantData = form.getValues(`variants.${index}`);

    // Validate the variant
    const result = variantSchema.safeParse(variantData);
    if (!result.success) {
      alert('Please fill in all required fields correctly');
      return;
    }

    if (!productId) {
      alert('Product ID is missing. Please save basic info first.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (variantData.variantId) {
        // Update existing variant
        await updateVariant({
          id: variantData.variantId,
          name: variantData.name,
          sku: variantData.sku,
          isDefault: variantData.isDefault,
          isActive: variantData.isActive,
          sortOrder: variantData.sortOrder,
        }).unwrap();

        // Update price
        if (variantData.priceId) {
          await updatePrice({
            id: variantData.priceId,
            price: variantData.price,
            salePrice: variantData.salePrice,
          }).unwrap();
        } else {
          const priceResult = await createPrice({
            variantId: variantData.variantId,
            price: variantData.price,
            salePrice: variantData.salePrice,
            currency: 'USD',
            isActive: true,
          }).unwrap();
          update(index, { ...variantData, priceId: priceResult.id });
        }

        // Update stock
        if (variantData.stockId) {
          await updateStock({
            id: variantData.stockId,
            quantity: variantData.quantity,
            minThreshold: variantData.minThreshold,
          }).unwrap();
        } else {
          const stockResult = await createStock({
            variantId: variantData.variantId,
            quantity: variantData.quantity,
            minThreshold: variantData.minThreshold,
          }).unwrap();
          update(index, { ...variantData, stockId: stockResult.id });
        }
      } else {
        // Create new variant
        const newVariant = await createVariant({
          productId,
          name: variantData.name,
          sku: variantData.sku,
          isDefault: variantData.isDefault,
          isActive: variantData.isActive,
          sortOrder: variantData.sortOrder,
        }).unwrap();

        // Create price
        const priceResult = await createPrice({
          variantId: newVariant.id,
          price: variantData.price,
          salePrice: variantData.salePrice,
          currency: 'USD',
          isActive: true,
        }).unwrap();

        // Create stock
        const stockResult = await createStock({
          variantId: newVariant.id,
          quantity: variantData.quantity,
          minThreshold: variantData.minThreshold,
        }).unwrap();

        // Update the form with the new IDs
        update(index, {
          ...variantData,
          variantId: newVariant.id,
          priceId: priceResult.id,
          stockId: stockResult.id,
        });
      }

      setEditingIndex(null);

      // Refresh product data from server to get the latest changes
      await refreshProductData();
    } catch (error) {
      console.error('Failed to save variant:', error);
      alert('Failed to save variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image management functions
  const handleImageUpload = async (
    variantId: string,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const variant = existingVariants.find((v) => v.id === variantId);
    const existingImages = variant?.images || [];

    setUploadingImages((prev) => ({ ...prev, [index]: true }));
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await uploadFile(formData).unwrap();

        await createProductImage({
          variantId,
          fileId: uploadResponse.file.id,
          altText: file.name,
          isPrimary: existingImages.length === 0 && i === 0,
          sortOrder: existingImages.length + i,
        }).unwrap();
      }

      await refreshProductData();
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleSetPrimaryImage = async (imageId: string, variantId: string) => {
    try {
      const variant = existingVariants.find((v) => v.id === variantId);
      const primaryImage = variant?.images?.find((img) => img.isPrimary);

      // Remove primary from old image
      if (primaryImage && primaryImage.id !== imageId) {
        await updateProductImage({
          id: primaryImage.id,
          isPrimary: false,
        }).unwrap();
      }

      // Set new primary
      await updateProductImage({
        id: imageId,
        isPrimary: true,
      }).unwrap();

      await refreshProductData();
    } catch (error) {
      console.error('Failed to set primary image:', error);
      alert('Failed to set primary image. Please try again.');
    }
  };

  const handleDeleteImage = async (imageId: string, variantId: string) => {
    const variant = existingVariants.find((v) => v.id === variantId);
    const image = variant?.images?.find((img) => img.id === imageId);

    if (image?.isPrimary) {
      alert(
        'Cannot delete primary image. Please set another image as primary first.'
      );
      return;
    }

    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteProductImage(imageId).unwrap();
      await refreshProductData();
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleContinue = () => {
    if (fields.length === 0) {
      alert('Please create at least one product variant before continuing');
      return;
    }

    if (editingIndex !== null) {
      alert('Please save or cancel the variant you are editing');
      return;
    }

    onComplete();
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {fields.length} variant(s)
            </p>
          </div>
          <Button
            type="button"
            onClick={addNewVariant}
            disabled={editingIndex !== null}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Variant
          </Button>
        </div>

        {/* Variants List */}
        {fields.length > 0 ? (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.variantId}
                className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4"
              >
                {editingIndex === index ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {field.variantId ? 'Edit Variant' : 'New Variant'}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelEdit(index)}
                          disabled={isSubmitting}
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => saveVariant(index)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Variant Name{' '}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Red - Large"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.sku`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              SKU <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., TSHIRT-RED-L"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Price ($) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.salePrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sale Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={field.value || ''}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Optional discount price
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Stock Quantity{' '}
                              <span className="text-red-500">*</span>
                            </FormLabel>
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

                      <FormField
                        control={form.control}
                        name={`variants.${index}.minThreshold`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Stock Threshold</FormLabel>
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
                            <FormDescription>
                              Alert when stock falls below this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.sortOrder`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sort Order</FormLabel>
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

                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.isDefault`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Default Variant</FormLabel>
                              <FormDescription>
                                Set as the default option
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.isActive`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Active</FormLabel>
                              <FormDescription>
                                Available for purchase
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Variant Images Section */}
                    {field.variantId && (
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Variant Images
                          </h4>
                          <label
                            htmlFor={`variant-image-upload-${index}`}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
                          >
                            <PhotoIcon className="h-4 w-4 mr-1" />
                            {uploadingImages[index]
                              ? 'Uploading...'
                              : 'Add Images'}
                            <input
                              id={`variant-image-upload-${index}`}
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={(e) =>
                                field.variantId &&
                                handleImageUpload(field.variantId, index, e)
                              }
                              disabled={uploadingImages[index]}
                            />
                          </label>
                        </div>

                        {(() => {
                          const variant = existingVariants.find(
                            (v) => v.id === field.variantId
                          );
                          const variantImages = variant?.images || [];
                          console.log(existingVariants, field);
                          return variantImages.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {variantImages.map((img: ProductImage) => (
                                <div
                                  key={img.id}
                                  className="relative group bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-2"
                                >
                                  <div className="relative">
                                    <img
                                      src={img.file?.secureUrl || img.file?.url}
                                      alt={img.altText || 'Variant image'}
                                      className="w-full h-24 object-cover rounded"
                                    />

                                    {/* Primary Badge */}
                                    {img.isPrimary ? (
                                      <div className="absolute top-1 left-1 flex items-center px-1.5 py-0.5 bg-indigo-600 text-white text-xs font-medium rounded shadow-lg">
                                        <StarIconSolid className="h-3 w-3 mr-0.5" />
                                        Primary
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          field.variantId &&
                                          handleSetPrimaryImage(
                                            img.id,
                                            field.variantId
                                          )
                                        }
                                        className="absolute top-1 left-1 px-1.5 py-0.5 bg-gray-800/70 hover:bg-indigo-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Set as primary"
                                      >
                                        <StarIcon className="h-3 w-3 inline mr-0.5" />
                                        Set Primary
                                      </button>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        field.variantId &&
                                        handleDeleteImage(
                                          img.id,
                                          field.variantId
                                        )
                                      }
                                      disabled={img.isPrimary}
                                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                      title={
                                        img.isPrimary
                                          ? 'Set another image as primary first'
                                          : 'Delete image'
                                      }
                                    >
                                      <TrashIcon className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {img.altText || 'No description'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                No images yet. Click "Add Images" to upload.
                              </p>
                            </div>
                          );
                        })()}

                        {(() => {
                          const variant = existingVariants.find(
                            (v) => v.id === field.variantId
                          );
                          const variantImages = variant?.images || [];
                          const hasPrimary = variantImages.some(
                            (img) => img.isPrimary
                          );

                          return (
                            hasPrimary &&
                            variantImages.length > 1 && (
                              <div className="mt-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                                <span role="img" aria-label="tip">
                                  💡
                                </span>{' '}
                                To delete the primary image, first set another
                                image as primary.
                              </div>
                            )
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {field.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          SKU: {field.sku}
                        </p>
                        <div className="flex gap-4 text-xs">
                          <span className="text-gray-600 dark:text-gray-400">
                            Price: ${field.price.toFixed(2)}
                            {field.salePrice && (
                              <span className="ml-2 text-red-500">
                                Sale: ${field.salePrice.toFixed(2)}
                              </span>
                            )}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            Stock: {field.quantity} units
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded ${
                              field.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                            }`}
                          >
                            {field.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVariant(index)}
                          disabled={editingIndex !== null}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVariant(index)}
                          disabled={editingIndex !== null}
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    {/* Show images in view mode */}
                    {field.variantId &&
                      (() => {
                        const variant = existingVariants.find(
                          (v) => v.id === field.variantId
                        );
                        const variantImages = variant?.images || [];

                        return (
                          variantImages.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Images ({variantImages.length})
                              </p>
                              <div className="flex gap-2 overflow-x-auto">
                                {variantImages
                                  .slice(0, 4)
                                  .map((img: ProductImage) => (
                                    <div
                                      key={img.id}
                                      className="relative flex-shrink-0"
                                    >
                                      <img
                                        src={
                                          img.file?.secureUrl || img.file?.url
                                        }
                                        alt={img.altText || 'Variant image'}
                                        className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-600"
                                      />
                                      {img.isPrimary && (
                                        <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-0.5">
                                          <StarIconSolid className="h-3 w-3 text-white" />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                {variantImages.length > 4 && (
                                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-500">
                                    +{variantImages.length - 4}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        );
                      })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <PlusIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No variants yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Click "Add Variant" to create your first product variant
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Basic Info
          </Button>

          <Button
            type="button"
            onClick={handleContinue}
            disabled={fields.length === 0 || editingIndex !== null}
          >
            Continue to Images
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ProductVariantsForm;
