<template>
  <section class="hero-section">
    <v-container class="py-0">
      <div class="hero-layout">
        <!-- Categories Sidebar -->
        <div class="categories-sidebar-wrapper">
          <CategorySidebar />
        </div>

        <!-- Hero Banner -->
        <div class="hero-banner-wrapper">
          <HeroSlider />
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import CategorySidebar from './CategorySidebar.vue';
import HeroSlider from './HeroSlider.vue';
</script>

<style scoped>
.hero-section {
  background: #fff;
  padding: 40px 0;
}

.hero-layout {
  display: flex;
  gap: 0;
  align-items: flex-start;
}

.categories-sidebar-wrapper {
  flex: 0 0 25%;
  max-width: 300px;
}

.hero-banner-wrapper {
  flex: 1;
  height: 400px; /* Fixed height for hero slider */
  min-height: 400px;
  max-height: 400px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-section {
    padding: 30px 0;
  }
  
  .hero-layout {
    flex-direction: column;
  }
  
  .categories-sidebar-wrapper {
    flex: none;
    width: 100%;
    max-width: none;
  }
  
  .hero-banner-wrapper {
    width: 100%;
    height: 350px;
    min-height: 350px;
    max-height: 350px;
  }
}

@media (max-width: 600px) {
  .hero-section {
    padding: 20px 0;
  }
  
  .hero-banner-wrapper {
    height: 300px;
    min-height: 300px;
    max-height: 300px;
  }
}
</style>
