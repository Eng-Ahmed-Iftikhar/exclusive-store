import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ICategories, CategoriesActions } from '.';

export const useCategoriesStore = defineStore('categories', () => {
  // ****** State ******
  const categories = ref<ICategories.Category[]>([]);
  const subcategories = ref<ICategories.Subcategory[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const selectedCategory = ref<ICategories.Category | null>(null);
  const selectedSubcategory = ref<ICategories.Subcategory | null>(null);

  // ****** Getters ******
  const activeCategories = computed(() => categories.value.filter(cat => cat.isActive));
  const categoriesWithSubcategories = computed(() => categories.value.filter(cat => cat.subcategories && cat.subcategories.length > 0));
  
  const getCategoryById = (id: string) => categories.value.find(cat => cat.id === id);
  const getSubcategoryById = (id: string) => subcategories.value.find(sub => sub.id === id);
  const getSubcategoriesByCategory = (categoryId: string) => subcategories.value.filter(sub => sub.categoryId === categoryId);

  // ****** Actions ******
  const fetchCategories = async (params?: ICategories.CategoryQueryParams): Promise<ICategories.Category[]> => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await CategoriesActions.getCategories(params);
      categories.value = response;
      
      // Extract all subcategories from categories
      subcategories.value = response.reduce((acc: ICategories.Subcategory[], category: ICategories.Category) => {
        if (category.subcategories) {
          acc.push(...category.subcategories);
        }
        return acc;
      }, []);
      
      return response;
    } catch (err) {
      error.value = 'Failed to fetch categories';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCategoryById = async (id: string): Promise<ICategories.Category> => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await CategoriesActions.getCategoryById(id);
      selectedCategory.value = response;
      return response;
    } catch (err) {
      error.value = 'Failed to fetch category';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchSubcategoryById = async (id: string): Promise<ICategories.Subcategory> => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await CategoriesActions.getSubcategoryById(id);
      selectedSubcategory.value = response;
      return response;
    } catch (err) {
      error.value = 'Failed to fetch subcategory';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setSelectedCategory = (category: ICategories.Category | null): void => {
    selectedCategory.value = category;
  };

  const setSelectedSubcategory = (subcategory: ICategories.Subcategory | null): void => {
    selectedSubcategory.value = subcategory;
  };

  const clearError = (): void => {
    error.value = null;
  };

  const resetState = (): void => {
    categories.value = [];
    subcategories.value = [];
    loading.value = false;
    error.value = null;
    selectedCategory.value = null;
    selectedSubcategory.value = null;
  };

  return {
    // ****** State ******
    categories,
    subcategories,
    loading,
    error,
    selectedCategory,
    selectedSubcategory,

    // ****** Getters ******
    activeCategories,
    categoriesWithSubcategories,
    getCategoryById,
    getSubcategoryById,
    getSubcategoriesByCategory,

    // ****** Actions ******
    fetchCategories,
    fetchCategoryById,
    fetchSubcategoryById,
    setSelectedCategory,
    setSelectedSubcategory,
    clearError,
    resetState,
  };
});
