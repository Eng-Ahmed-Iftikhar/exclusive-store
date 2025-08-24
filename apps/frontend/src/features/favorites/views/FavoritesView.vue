<template>
  <div class="favorites-page">
    <v-container class="py-8">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold mb-6">My Favorites</h1>
        </v-col>
      </v-row>

      <v-row v-if="favorites.length > 0">
        <v-col 
          v-for="favorite in favorites" 
          :key="favorite.id"
          cols="12" 
          sm="6" 
          md="4" 
          lg="3"
        >
          <ItemCard :item="favorite" />
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" class="text-center">
          <v-icon size="120" color="grey-lighten-1" class="mb-4">mdi-heart-outline</v-icon>
          <h2 class="text-h5 font-weight-medium mb-2">No favorites yet</h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Start adding products to your favorites to see them here
          </p>
          <v-btn 
            color="primary" 
            variant="flat" 
            size="large"
            to="/products"
          >
            Browse Products
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ItemCard } from '../../shared/components';

const favorites = ref([]);

onMounted(async () => {
  // Load favorites from store or API
  // For now, using empty array
  favorites.value = [];
});
</script>

<style scoped>
.favorites-page {
  background: #f8f9fa;
  min-height: 100vh;
}
</style>
