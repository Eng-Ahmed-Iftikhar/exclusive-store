<template>
  <div class="single-product-page">
    <v-container class="py-6">
      <!-- Breadcrumbs -->
      <ProductBreadcrumbs :breadcrumb-items="breadcrumbItems" />

      <!-- Loading State -->
      <ProductLoading v-if="loading" />

      <!-- Error State -->
      <ProductError v-else-if="error" :error="error" @go-back="goToProducts" />

      <!-- Product Content -->
      <div v-else-if="product" class="product-content">
        <v-row>
          <!-- Product Images -->
          <v-col cols="12" md="6" class="product-images-col">
            <ProductImageSlider :images="productImages" :product-name="product.name" />
          </v-col>

          <!-- Product Details -->
          <v-col cols="12" md="6" class="product-details-col">
            <ProductDetails :product="product" :is-in-cart="isInCart" :is-favorited="isFavorited"
              :is-on-sale="isOnSale || false" @add-to-cart="handleAddToCart" @remove-from-cart="handleRemoveFromCart"
              @toggle-favorite="handleFavoriteClick" />
          </v-col>
        </v-row>

        <!-- Related Products Section -->
        <RelatedProducts v-if="relatedProducts.length > 0" :products="relatedProducts" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../../stores/modules/cart/cart.store';
import { useFavoritesStore } from '../../../stores/modules/favorites/favorites.store';
import { useProductsStore } from '../../../stores/modules/products/products.store';

// Components
import ProductBreadcrumbs from '../components/ProductBreadcrumbs.vue';
import ProductLoading from '../components/ProductLoading.vue';
import ProductError from '../components/ProductError.vue';
import ProductImageSlider from '../components/ProductImageSlider.vue';
import ProductDetails from '../components/ProductDetails.vue';
import RelatedProducts from '../components/RelatedProducts.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const productsStore = useProductsStore();

// Refs
const relatedProducts = ref<any[]>([]);

// Computed properties
const product = computed(() => productsStore.selectedProduct);
const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error);

const isInCart = computed(() => {
  return product.value?.id ? cartStore.isItemInCart(product.value.id) : false;
});

const isFavorited = computed(() => {
  return product.value?.id ? favoritesStore.isItemFavorite(product.value.id) : false;
});

const isOnSale = computed(() => {
  if (!product.value?.variants?.[0]?.prices?.[0]) return false;
  const price = product.value.variants[0].prices[0];
  return !!(price.salePrice && price.salePrice < price.price);
});

const productImages = computed(() => {
  if (!product.value?.images) return [];
  return product.value.images.map(img => ({
    ...img,
    url: img.file?.url || ''
  }));
});

const breadcrumbItems = computed(() => [
  { title: 'Home', to: '/' },
  { title: 'Products', to: '/products' },
  { title: product.value?.category?.name || 'Category', to: `/products?category=${product.value?.category?.slug}` },
  { title: product.value?.name || 'Product', disabled: true }
]);

// Methods
const fetchProduct = async () => {
  try {
    const productId = route.params.id as string;
    if (!productId) return;

    const productData = await productsStore.fetchProductById(productId);

    // Fetch related products
    if (productData.category?.id) {
      const related = await productsStore.fetchProducts({
        categoryId: productData.category.id,
        limit: 4
      });
      // Filter out the current product from related products
      relatedProducts.value = related.filter(item => item.id !== productId);
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    // You could set an error state here if needed
  }
};

const handleAddToCart = async () => {
  if (!product.value) return;

  try {
    await cartStore.addToCart(product.value.id, 1);
    // You could add a success notification here
  } catch (err) {
    console.error('Error adding to cart:', err);
    // You could add an error notification here
  }
};

const handleRemoveFromCart = async () => {
  if (!product.value) return;

  try {
    await cartStore.removeFromCart(product.value.id);
  } catch (err) {
    console.error('Error removing from cart:', err);
  }
};

const handleFavoriteClick = async () => {
  if (!product.value) return;

  try {
    if (isFavorited.value) {
      await favoritesStore.removeFromFavorites(product.value.id);
    } else {
      await favoritesStore.addToFavorites(product.value.id);
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
  }
};

const goToProducts = () => {
  router.push('/products');
};

// Lifecycle
onMounted(() => {
  fetchProduct();
});

// Watch for route changes using watchEffect (more concise)
watchEffect(() => {
  const productId = route.params.id;
  if (productId && productId !== product.value?.id) {
    fetchProduct();
  }
});
</script>

<style scoped>
.single-product-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.product-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.product-images-col {
  padding: 0;
}

.product-details-col {
  padding: 24px;
}
</style>
