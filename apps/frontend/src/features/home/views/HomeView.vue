<template>
  <div class="home-view">
    <!-- Hero Section with Categories -->
    <HeroSection />
    
    <!-- Flash Sales Section -->
    <FlashSalesSection />
    
    <!-- Browse By Category Section -->
    <BrowseCategorySection />
    
    <!-- Best Selling Products Section -->
    <BestSellingSection />
    
    <!-- Music Experience Banner -->
    <MusicExperienceBanner />
    
    <!-- Explore Our Products Section -->
    <ExploreProductsSection />
    
    <!-- New Arrival Section -->
    <NewArrivalSection />
    
    <!-- Service Highlights Section -->
    <ServiceHighlightsSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import FlashSalesSection from '../components/FlashSalesSection.vue';
import BrowseCategorySection from '../components/BrowseCategorySection.vue';
import BestSellingSection from '../components/BestSellingSection.vue';
import MusicExperienceBanner from '../components/MusicExperienceBanner.vue';
import ExploreProductsSection from '../components/ExploreProductsSection.vue';
import NewArrivalSection from '../components/NewArrivalSection.vue';
import ServiceHighlightsSection from '../components/ServiceHighlightsSection.vue';
import { usePageTitle } from '../../../composables/usePageTitle';

const { setHomeTitle } = usePageTitle();

onMounted(() => {
  setHomeTitle();
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #fff;
}

/* Ensure proper spacing between sections */
.home-view > * {
  margin-bottom: 0;
}

/* Add some breathing room between major sections */
.home-view > *:not(:last-child) {
  margin-bottom: 0;
}
</style>
