import { IProducts } from '.';
import { productsApi } from '../../apis/products.api';

export async function getProducts(
  params?: IProducts.ProductQueryParams
): Promise<IProducts.ProductsResponse> {
  try {
    return await productsApi.getProducts(params);
  } catch (err) {
    throw new Error('Failed to fetch products');
  }
}

export async function getFeaturedProducts(): Promise<IProducts.Product[]> {
  try {
    return await productsApi.getFeaturedProducts();
  } catch (err) {
    throw new Error('Failed to fetch featured products');
  }
}

export async function getBestSellingProducts(): Promise<IProducts.Product[]> {
  try {
    const response = await productsApi.getBestSellingProducts();
    return response.slice(0, 4); // Get top 4
  } catch (err) {
    throw new Error('Failed to fetch best selling products');
  }
}

export async function getHeroSliderProducts(): Promise<IProducts.Product[]> {
  try {
    return await productsApi.getHeroSliderProducts();
  } catch (err) {
    throw new Error('Failed to fetch hero slider products');
  }
}

export async function getTopRatedProducts(
  minRating: number = 4,
  limit: number = 10
): Promise<IProducts.Product[]> {
  try {
    return await productsApi.getTopRatedProducts(minRating, limit);
  } catch (err) {
    throw new Error('Failed to fetch top rated products');
  }
}

export async function getNewArrivalProducts(
  limit: number = 8
): Promise<IProducts.Product[]> {
  try {
    return await productsApi.getNewArrivalProducts(limit);
  } catch (err) {
    throw new Error('Failed to fetch new arrival products');
  }
}

export async function getProductById(id: string): Promise<IProducts.Product> {
  try {
    return await productsApi.getProductById(id);
  } catch (err) {
    throw new Error('Failed to fetch product');
  }
}

export async function getProductsByCategory(
  categoryId: string,
  params?: Omit<IProducts.ProductQueryParams, 'categoryId'>
): Promise<IProducts.ProductsResponse> {
  try {
    return await productsApi.getProductsByCategory(categoryId, params);
  } catch (err) {
    throw new Error('Failed to fetch products by category');
  }
}

export async function getProductsBySubcategory(
  subcategoryId: string,
  params?: Omit<IProducts.ProductQueryParams, 'subcategoryId'>
): Promise<IProducts.ProductsResponse> {
  try {
    return await productsApi.getProductsBySubcategory(subcategoryId, params);
  } catch (err) {
    throw new Error('Failed to fetch products by subcategory');
  }
}

export async function searchProducts(
  query: string,
  params?: Omit<IProducts.ProductQueryParams, 'search'>
): Promise<IProducts.ProductsResponse> {
  try {
    return await productsApi.searchProducts({
      ...params,
      search: query,
    });
  } catch (err) {
    throw new Error('Failed to fetch search products');
  }
}
