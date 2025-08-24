import { CategoriesUrls } from "../urls";
import axiosInstance from './axios-instance';
import type { ICategories } from '../modules/categories';

export const categoriesApi = {
  // Get all categories
  async getCategories(params?: ICategories.CategoryQueryParams): Promise<ICategories.Category[]> {
    const response = await axiosInstance.get(CategoriesUrls.GET_CATEGORIES, { params });
    return response.data;
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<ICategories.Category> {
    const response = await axiosInstance.get(CategoriesUrls.GET_CATEGORY_BY_ID(id));
    return response.data;
  },

  // Get subcategory by ID
  async getSubcategoryById(id: string): Promise<ICategories.Subcategory> {
    const response = await axiosInstance.get(`${CategoriesUrls.GET_CATEGORIES}/subcategories/${id}`);
    return response.data;
  },

  // Get subcategories by category ID
  async getSubcategoriesByCategory(categoryId: string): Promise<ICategories.Subcategory[]> {
    const response = await axiosInstance.get(CategoriesUrls.GET_SUBCATEGORIES(categoryId));
    return response.data;
  },

  // Create category (admin only)
  async createCategory(data: Partial<ICategories.Category>): Promise<ICategories.Category> {
    const response = await axiosInstance.post(CategoriesUrls.CREATE_CATEGORY, data);
    return response.data;
  },

  // Update category (admin only)
  async updateCategory(id: string, data: Partial<ICategories.Category>): Promise<ICategories.Category> {
    const response = await axiosInstance.put(CategoriesUrls.UPDATE_CATEGORY(id), data);
    return response.data;
  },

  // Delete category (admin only)
  async deleteCategory(id: string): Promise<void> {
    await axiosInstance.delete(CategoriesUrls.DELETE_CATEGORY(id));
  },

  // Create subcategory (admin only)
  async createSubcategory(data: Partial<ICategories.Subcategory>): Promise<ICategories.Subcategory> {
    const response = await axiosInstance.post(CategoriesUrls.CREATE_SUBCATEGORY(data.categoryId || ''), data);
    return response.data;
  },

  // Update subcategory (admin only)
  async updateSubcategory(id: string, data: Partial<ICategories.Subcategory>): Promise<ICategories.Subcategory> {
    const response = await axiosInstance.put(CategoriesUrls.UPDATE_SUBCATEGORY(data.categoryId || '', id), data);
    return response.data;
  },

  // Delete subcategory (admin only)
  async deleteSubcategory(id: string): Promise<void> {
    // Note: We need categoryId for this, but it's not in the data
    // This might need to be adjusted based on your API structure
    await axiosInstance.delete(`${CategoriesUrls.GET_CATEGORIES}/subcategories/${id}`);
  },
};
