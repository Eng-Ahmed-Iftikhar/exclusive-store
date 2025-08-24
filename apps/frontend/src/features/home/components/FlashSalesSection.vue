<template>
  <section class="flash-sales-section">
    <v-container>
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <div class="red-bar"></div>
          <h2 class="section-title">Today's Flash Sales</h2>
        </div>
        <div class="countdown-timer">
          <div class="timer-item">
            <span class="timer-number">{{ flashSaleTimer.safeTimeLeft.days.toString().padStart(2, '0') }}</span>
            <span class="timer-label">Days</span>
          </div>
          <div class="timer-separator">:</div>
          <div class="timer-item">
            <span class="timer-number">{{ flashSaleTimer.safeTimeLeft.hours.toString().padStart(2, '0') }}</span>
            <span class="timer-label">Hours</span>
          </div>
          <div class="timer-separator">:</div>
          <div class="timer-item">
            <span class="timer-number">{{ flashSaleTimer.safeTimeLeft.minutes.toString().padStart(2, '0') }}</span>
            <span class="timer-label">Minutes</span>
          </div>
          <div class="timer-separator">:</div>
          <div class="timer-item">
            <span class="timer-number">{{ flashSaleTimer.safeTimeLeft.seconds.toString().padStart(2, '0') }}</span>
            <span class="timer-label">Seconds</span>
          </div>
        </div>
      </div>

      <!-- Products Carousel -->
      <div class="products-carousel">
        <v-btn 
          icon="mdi-chevron-left" 
          variant="outlined" 
          class="carousel-nav-btn prev-btn"
          size="large"
        />
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <v-progress-circular indeterminate color="primary" size="64" />
          <p>Loading flash sales...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <v-icon icon="mdi-alert-circle" size="64" color="error" />
          <p>{{ error }}</p>
          <v-btn @click="handleRetry" color="primary" variant="outlined">
            Retry
          </v-btn>
        </div>

        <!-- Products Container -->
        <div v-else-if="flashSaleItems?.length > 0" class="products-container">
      
          <ItemCard 
            v-for="item in flashSaleItems" 
            :key="item.id" 
            :item="item"
            :show-sale-tag="true"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <v-icon icon="mdi-flash-off" size="64" color="grey" />
          <p>No flash sales available at the moment</p>
        </div>

        <v-btn 
          icon="mdi-chevron-right" 
          variant="outlined" 
          class="carousel-nav-btn next-btn"
          size="large"
        />
      </div>

      <!-- View All Button -->
      <div class="view-all-container">
        <v-btn 
          color="error" 
          variant="flat" 
          size="large"
          class="view-all-btn"
          to="/products"
        >
          View All Products
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { ItemCard } from '../../shared/components';
import { useFlashSaleTimerStore } from '../../../stores';
import { IFlashSales } from '../../../stores/modules/flash-sales';
import { useFlashSalesStore } from '../../../stores/modules/flash-sales/flash-sales.store';

const flashSalesStore = useFlashSalesStore();
const flashSaleTimer = useFlashSaleTimerStore();


// Fetch flash sales on component mount
onMounted(async () => {
  try {
    await flashSalesStore.fetchActiveFlashSales();
  } catch (error) {
    // Handle error silently
  }
});

const handleRetry = () => {
  flashSalesStore.fetchActiveFlashSales();
};

// Get flash sale items
const flashSales = computed(() => flashSalesStore.flashSales as unknown as IFlashSales.FlashSale[]);
const flashSaleItems= computed(() => flashSales?.value[0]?.items as unknown as IFlashSales.FlashSaleItem[]);

// Loading and error states
const loading = computed(() => flashSalesStore.loading);
const error = computed(() => flashSalesStore.error);



</script>

<style scoped>
.flash-sales-section {
  background: #fff;
  padding: 60px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.countdown-timer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F5F5F5;
  padding: 16px 12px;
  border-radius: 8px;
  min-width: 60px;
}

.timer-number {
  font-size: 24px;
  font-weight: 700;
  color: #000;
  line-height: 1;
}

.timer-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.timer-separator {
  font-size: 24px;
  font-weight: 700;
  color: #000;
}

.products-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.carousel-nav-btn {
  border-color: transparent;
  color: #666;
  flex-shrink: 0;
  border-radius: 6px !important;
}

.carousel-nav-btn:hover {
  border-color: transparent;
  color: #000;
}

.products-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 24px;
  flex-grow: 1;
}



.view-all-container {
  text-align: center;
}

.view-all-btn {
  padding: 14px 32px;
  font-weight: 600;
  text-transform: none;
  border-radius: 6px !important;
}

/* Loading, Error, and Empty States */
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
  font-size: 16px;
  color: #666;
  margin: 0;
}

.error-state .v-btn {
  margin-top: 8px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .section-header {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .countdown-timer {
    justify-content: center;
  }
  
  .products-container {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 600px) {
  .flash-sales-section {
    padding: 40px 0;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .timer-item {
    min-width: 50px;
    padding: 12px 8px;
  }
  
  .timer-number {
    font-size: 20px;
  }
  
  .products-container {
    grid-template-columns: 1fr;
  }
  
  .carousel-nav-btn {
    display: none;
  }
}
</style>
