<template>
  <section class="new-arrival-section">
    <v-container>
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <div class="red-bar"></div>
          <h2 class="section-title">Featured New Arrival</h2>
        </div>
      </div>

      <!-- New Arrival Items -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" />
        <p>Loading new arrivals...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <v-icon icon="mdi-alert" size="64" color="error" />
        <p>{{ error }}</p>
        <v-btn @click="fetchNewArrivals" color="primary" variant="flat">
          Try Again
        </v-btn>
      </div>

      <div v-else-if="newArrivalItems.length > 0" class="products-container">
        <ItemCard 
          v-for="item in newArrivalItems" 
          :key="item.id" 
          :item="item"
          :show-sale-tag="true"
        />
      </div>

      <div v-else class="empty-state">
        <v-icon icon="mdi-package-variant" size="64" color="grey" />
        <p>No new arrivals available</p>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useItemsStore } from '../../../stores/modules/items';
import { ItemCard } from '../../shared/components';
import { Item } from '../../../stores/modules/items/items.interface';

const itemsStore = useItemsStore();

// Fetch new arrival items on component mount
onMounted(async () => {
  try {
    await fetchNewArrivals();
  } catch (error) {
    // Failed to fetch new arrivals
  }
});

// Fetch new arrival items
const fetchNewArrivals = async () => {
  try {
    await itemsStore.fetchNewArrivalItems();
  } catch (error) {
    // Failed to fetch new arrivals
  }
};

// Get new arrival items from store
const newArrivalItems = computed(() => itemsStore.items as unknown as Item[]);

// Loading state
const loading = computed(() => itemsStore.loading);

// Error state
const error = computed(() => itemsStore.error);
</script>

<style scoped>
.new-arrival-section {
  background: #fff;
  padding: 60px 0;
}

.section-header {
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.red-bar {
  width: 4px;
  height: 40px;
  background: #DB4444;
  border-radius: 2px;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;
  height: 600px;
}

.promo-block {
  position: relative;
  background: #000;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 40px;
  color: white;
}

.promo-block.large {
  grid-column: span 1;
  grid-row: span 2;
}

.promo-block.medium {
  grid-column: span 1;
  grid-row: span 1;
}

.promo-content {
  flex: 1;
  z-index: 2;
  position: relative;
}

.promo-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.promo-description {
  font-size: 14px;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.4;
}

.shop-now-btn {
  color: #000 !important;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 6px !important;
  text-transform: none;
}

.promo-image {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  opacity: 0.8;
}

.promo-image img {
  max-width: 200px;
  height: auto;
}

.promo-block.large .promo-image img {
  max-width: 250px;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 16px;
}

.loading-state p,
.error-state p,
.empty-state p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.error-state .v-btn {
  margin-top: 8px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .promo-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
    gap: 16px;
  }
  
  .promo-block {
    padding: 30px;
    min-height: 200px;
  }
  
  .promo-block.large {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .promo-image img {
    max-width: 150px;
  }
  
  .promo-block.large .promo-image img {
    max-width: 180px;
  }
}

@media (max-width: 600px) {
  .new-arrival-section {
    padding: 40px 0;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .promo-block {
    padding: 20px;
    min-height: 180px;
  }
  
  .promo-title {
    font-size: 20px;
  }
  
  .promo-description {
    font-size: 12px;
  }
  
  .shop-now-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .promo-image img {
    max-width: 120px;
  }
  
  .promo-block.large .promo-image img {
    max-width: 150px;
  }
}
</style>
