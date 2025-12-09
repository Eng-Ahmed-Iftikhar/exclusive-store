<template>
  <div class="wishlist-view">
    <v-container>
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">My Wishlist</h1>
        <p class="page-subtitle">{{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }} saved</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p>Loading your wishlist...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <v-icon icon="mdi-alert-circle" size="64" color="error" />
        <p>{{ error }}</p>
        <v-btn @click="loadWishlist" color="primary" variant="outlined">Retry</v-btn>
      </div>

      <!-- Empty Wishlist -->
      <EmptyWishlist v-else-if="!wishlistItems.length" />

      <!-- Wishlist Grid -->
      <div v-else class="wishlist-grid">
        <ProductCard
          v-for="item in wishlistItems"
          :key="item.id"
          :product="item"
          :show-sale-tag="true"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFavoritesStore } from '../../../stores';
import EmptyWishlist from '../components/EmptyWishlist.vue';
import ProductCard from '../../../components/ProductCard.vue';

const favoritesStore = useFavoritesStore();

const loading = ref(true);
const error = ref('');

const wishlistItems = computed(() => favoritesStore.favorites || []);
const itemCount = computed(() => wishlistItems.value.length);

const loadWishlist = async () => {
  try {
    loading.value = true;
    error.value = '';
    await favoritesStore.fetchFavorites();
  } catch (err: any) {
    error.value = err.message || 'Failed to load wishlist';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadWishlist();
});
</script>

<style scoped>
.wishlist-view {
  min-height: calc(100vh - 200px);
  padding: 40px 0;
  background: #f8f9fa;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  gap: 20px;
}

.loading-state p,
.error-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .wishlist-view {
    padding: 20px 0;
  }

  .page-title {
    font-size: 24px;
  }

  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}
</style>
