import apiClient from './axios-instance';
import { SearchUrls } from '../urls';

export interface SearchResult {
  categories: CategoryResult[];
  products: ProductResult[];
  total: number;
}

export interface CategoryResult {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    icon?: string;
  }>;
}

export interface ProductResult {
  id: string;
  name: string;
  description?: string;
  averageRating: number;
  totalReviews: number;
  currentPrice: number;
  salePrice?: number;
  isOnSale: boolean;
  primaryImage?: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon?: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface SearchSuggestion {
  type: 'category' | 'product';
  id: string;
  name: string;
  slug?: string; // Optional since products don't have slug
  icon?: string;
  category?: string;
  categorySlug?: string;
}

class SearchAPI {
  async search(query: string, type?: string): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({ q: query });
      if (type) {
        params.append('type', type);
      }

      const response = await apiClient.get(
        `${SearchUrls.SEARCH}?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      const response = await apiClient.get(
        `${SearchUrls.SUGGESTIONS}?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Suggestions error:', error);
      throw error;
    }
  }
}

export const searchAPI = new SearchAPI();
