import { ProductsUrls } from '../urls/products';
import axiosInstance from './axios-instance';
import type { IProducts } from '../modules/products';

export const productsApi = {
  // Get all products with pagination and filters
  async getProducts(params?: IProducts.ProductQueryParams): Promise<{
    products: IProducts.Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(ProductsUrls.GET_PRODUCTS, {
      params: {
        ...params,
        isActive: true, // Always fetch only active products on frontend
      },
    });
    return response.data;
  },

  // Get product by ID
  async getProductById(id: string): Promise<IProducts.Product> {
    const response = await axiosInstance.get(
      ProductsUrls.GET_PRODUCT_BY_ID(id)
    );
    return response.data;
  },

  // Get featured products
  async getFeaturedProducts(): Promise<IProducts.Product[]> {
    const response = await axiosInstance.get(
      ProductsUrls.GET_FEATURED_PRODUCTS
    );
    return response.data;
  },

  // Get best selling products
  async getBestSellingProducts(): Promise<IProducts.Product[]> {
    const response = await axiosInstance.get(
      ProductsUrls.GET_BEST_SELLING_PRODUCTS
    );
    return response.data;
  },

  // Get top rated products
  async getTopRatedProducts(
    minRating?: number,
    limit?: number
  ): Promise<IProducts.Product[]> {
    const params: any = {};
    if (minRating) params.minRating = minRating;
    if (limit) params.limit = limit;

    const response = await axiosInstance.get(
      ProductsUrls.GET_TOP_RATED_PRODUCTS,
      { params }
    );
    return response.data;
  },

  // Get new arrival products
  async getNewArrivalProducts(limit?: number): Promise<IProducts.Product[]> {
    const params: any = {};
    if (limit) params.limit = limit;

    const response = await axiosInstance.get(
      ProductsUrls.GET_NEW_ARRIVAL_PRODUCTS,
      { params }
    );
    return response.data;
  },

  // Get products by category
  async getProductsByCategory(
    categoryId: string,
    params?: Omit<IProducts.ProductQueryParams, 'categoryId'>
  ): Promise<{
    products: IProducts.Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(
      ProductsUrls.GET_PRODUCTS_BY_CATEGORY(categoryId),
      { params: { ...params, isActive: true } }
    );
    return response.data;
  },

  // Get products by subcategory
  async getProductsBySubcategory(
    subcategoryId: string,
    params?: Omit<IProducts.ProductQueryParams, 'subcategoryId'>
  ): Promise<{
    products: IProducts.Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(
      ProductsUrls.GET_PRODUCTS_BY_SUBCATEGORY(subcategoryId),
      { params: { ...params, isActive: true } }
    );
    return response.data;
  },

  // Search products
  async searchProducts(params: IProducts.ProductQueryParams): Promise<{
    products: IProducts.Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get(ProductsUrls.SEARCH_PRODUCTS, {
      params: { ...params, isActive: true },
    });
    return response.data;
  },

  // Create product (admin only)
  async createProduct(
    data: Partial<IProducts.Product>
  ): Promise<IProducts.Product> {
    const response = await axiosInstance.post(
      ProductsUrls.CREATE_PRODUCT,
      data
    );
    return response.data;
  },

  // Update product (admin only)
  async updateProduct(
    id: string,
    data: Partial<IProducts.Product>
  ): Promise<IProducts.Product> {
    const response = await axiosInstance.put(
      ProductsUrls.UPDATE_PRODUCT(id),
      data
    );
    return response.data;
  },

  // Delete product (admin only)
  async deleteProduct(id: string): Promise<void> {
    await axiosInstance.delete(ProductsUrls.DELETE_PRODUCT(id));
  },

  // Variant management (admin only)
  async createVariant(data: any): Promise<any> {
    const response = await axiosInstance.post(
      ProductsUrls.CREATE_VARIANT,
      data
    );
    return response.data;
  },

  async updateVariant(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(
      ProductsUrls.UPDATE_VARIANT(id),
      data
    );
    return response.data;
  },

  async deleteVariant(id: string): Promise<void> {
    await axiosInstance.delete(ProductsUrls.DELETE_VARIANT(id));
  },

  // Price management (admin only)
  async createPrice(data: any): Promise<any> {
    const response = await axiosInstance.post(ProductsUrls.CREATE_PRICE, data);
    return response.data;
  },

  async updatePrice(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(
      ProductsUrls.UPDATE_PRICE(id),
      data
    );
    return response.data;
  },

  async deletePrice(id: string): Promise<void> {
    await axiosInstance.delete(ProductsUrls.DELETE_PRICE(id));
  },

  // Stock management (admin only)
  async createStock(data: any): Promise<any> {
    const response = await axiosInstance.post(ProductsUrls.CREATE_STOCK, data);
    return response.data;
  },

  async updateStock(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(
      ProductsUrls.UPDATE_STOCK(id),
      data
    );
    return response.data;
  },

  async deleteStock(id: string): Promise<void> {
    await axiosInstance.delete(ProductsUrls.DELETE_STOCK(id));
  },

  // Image management (admin only)
  async createProductImage(data: any): Promise<any> {
    const response = await axiosInstance.post(
      ProductsUrls.CREATE_PRODUCT_IMAGE,
      data
    );
    return response.data;
  },

  async updateProductImage(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(
      ProductsUrls.UPDATE_PRODUCT_IMAGE(id),
      data
    );
    return response.data;
  },

  async deleteProductImage(id: string): Promise<void> {
    await axiosInstance.delete(ProductsUrls.DELETE_PRODUCT_IMAGE(id));
  },

  // Review management
  async createReview(data: any): Promise<any> {
    const response = await axiosInstance.post(ProductsUrls.CREATE_REVIEW, data);
    return response.data;
  },

  async updateReview(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(
      ProductsUrls.UPDATE_REVIEW(id),
      data
    );
    return response.data;
  },

  async deleteReview(id: string): Promise<void> {
    await axiosInstance.delete(ProductsUrls.DELETE_REVIEW(id));
  },

  // Rating management
  async createRating(data: any): Promise<any> {
    const response = await axiosInstance.post(ProductsUrls.CREATE_RATING, data);
    return response.data;
  },

  async updateRating(id: string, data: any): Promise<any> {
    const response = await axiosInstance.put(
      ProductsUrls.UPDATE_RATING(id),
      data
    );
    return response.data;
  },

  async deleteRating(id: string): Promise<void> {
    await axiosInstance.delete(ProductsUrls.DELETE_RATING(id));
  },

  // Favorites management
  async addToFavorites(productId: string): Promise<any> {
    const response = await axiosInstance.post(ProductsUrls.ADD_TO_FAVORITES, {
      productId,
    });
    return response.data;
  },

  async removeFromFavorites(productId: string): Promise<void> {
    await axiosInstance.delete(ProductsUrls.REMOVE_FROM_FAVORITES(productId));
  },

  async getUserFavorites(): Promise<any[]> {
    const response = await axiosInstance.get(ProductsUrls.GET_USER_FAVORITES);
    return response.data;
  },
};
