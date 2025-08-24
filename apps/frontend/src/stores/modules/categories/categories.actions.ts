import { categoriesApi } from '../../apis/categories.api';
import type { ICategories } from '.';

export const CategoriesActions = {
  async getCategories(params?: ICategories.CategoryQueryParams): Promise<ICategories.Category[]> {
    try {
      const response = await categoriesApi.getCategories(params);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  },

  async getCategoryById(id: string): Promise<ICategories.Category> {
    try {
      const response = await categoriesApi.getCategoryById(id);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch category');
    }
  },

  async getSubcategoryById(id: string): Promise<ICategories.Subcategory> {
    try {
      const response = await categoriesApi.getSubcategoryById(id);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch subcategory');
    }
  },

  async getSubcategoriesByCategory(categoryId: string): Promise<ICategories.Subcategory[]> {
    try {
      const response = await categoriesApi.getSubcategoriesByCategory(categoryId);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch subcategories');
    }
  },
};
