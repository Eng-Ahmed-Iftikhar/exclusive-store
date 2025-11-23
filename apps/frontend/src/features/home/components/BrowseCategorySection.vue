<template>
  <section class="browse-category-section">
    <v-container>
      <!-- Section Header -->
      <div class="section-header">
        <div class="header-content">
          <div class="red-bar"></div>
          <h2 class="section-title">Categories Browse By Category</h2>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p>Loading categories...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <v-icon icon="mdi-alert-circle" size="64" color="error" />
        <p>{{ error }}</p>
        <v-btn @click="categoriesStore.fetchCategories({ isActive: true })" color="primary" variant="outlined">
          Retry
        </v-btn>
      </div>

      <!-- Categories Carousel -->
      <div v-else-if="categories.length > 0" class="categories-carousel">
        <v-btn 
          icon="mdi-chevron-left" 
          variant="outlined" 
          class="carousel-nav-btn prev-btn"
          size="large"
          @click="prevSlide"
        />
        
        <div class="categories-container">
          <div class="categories-slider" ref="sliderRef">
            <div 
              v-for="category in categories" 
              :key="category.id" 
              class="category-card"
              :class="{ 'active': category.isActive }"
              @click="navigateToCategory(category)"
            >
              <div class="category-icon">
                <img v-if="category.image" :src="category.image" alt="Category Icon" class="category-icon-img" />
               <div v-else class="no-image-placeholder">
                <v-icon icon="mdi-image" size="24" />
              </div>
              </div>
              <span class="category-name">{{ category.name }}</span>
            </div>
          </div>
        </div>

        <v-btn 
          icon="mdi-chevron-right" 
          variant="outlined" 
          class="carousel-nav-btn next-btn"
          size="large"
          @click="nextSlide"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <v-icon icon="mdi-folder-outline" size="64" color="grey" />
        <p>No categories available</p>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoriesStore } from '../../../stores/modules/categories';

const router = useRouter();
const categoriesStore = useCategoriesStore();

// Fetch categories on component mount
onMounted(async () => {
  try {
    await categoriesStore.fetchCategories({ isActive: true });
  } catch (error) {
    // Handle error silently
  }
});

// Get categories from store
const categories = computed(() => categoriesStore.activeCategories);

// Loading state
const loading = computed(() => categoriesStore.loading);

// Error state
const error = computed(() => categoriesStore.error);

// Navigation function
const navigateToCategory = (category: any) => {
  const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
  router.push({
    name: 'products',
    query: {
      category: categorySlug
    }
  });
};

// Slider functionality
const sliderRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);

const nextSlide = () => {
  if (sliderRef.value) {
    const container = sliderRef.value.parentElement;
    if (container) {
      const cardWidth = 160; // Fixed width of each category card
      const gap = 24; // Gap between cards
      const visibleWidth = container.clientWidth;
      const maxScroll = sliderRef.value.scrollWidth - visibleWidth;
      
      if (currentIndex.value * (cardWidth + gap) < maxScroll) {
        currentIndex.value++;
        sliderRef.value.style.transform = `translateX(-${currentIndex.value * (cardWidth + gap)}px)`;
      }
    }
  }
};

const prevSlide = () => {
  if (sliderRef.value) {
    const cardWidth = 160; // Fixed width of each category card
    const gap = 24; // Gap between cards
    
    if (currentIndex.value > 0) {
      currentIndex.value--;
      sliderRef.value.style.transform = `translateX(-${currentIndex.value * (cardWidth + gap)}px)`;
    }
  }
};
</script>

<style scoped>
.browse-category-section {
  background: white;
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

.categories-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
}

.carousel-nav-btn {
    background: #fff;
  border: none;
  color: #000;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 6px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-nav-btn:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.categories-container {
  flex-grow: 1;
  overflow: hidden;
  padding: 4px 0;
}

.categories-slider {
  display: flex;
  gap: 24px;
  transition: transform 0.3s ease;
  min-width: max-content;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 16px;
  border: 2px solid #333;
  border-radius: 6px !important;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  width: 160px;
  flex-shrink: 0;
  user-select: none;
}

.category-card:hover {
  border-color: #DB4444;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(219, 68, 68, 0.2);
}

.category-card:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(219, 68, 68, 0.3);
}

.category-card.active {
  border-color: gray;
 
  color: gray;
}

.category-card.active .category-name {
  color: gray;

}

.category-icon, .category-icon-img {
  width: 64px;
  height: 64px;
  border-radius: 6px !important;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.category-card.active .category-icon {
  background: rgba(255, 255, 255, 0.2);
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
  transition: all 0.3s ease;
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

.no-image-placeholder {
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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
  .categories-container {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }
  
  .category-card {
    padding: 20px 12px;
  }
  
  .category-icon {
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 600px) {
  .browse-category-section {
    padding: 40px 0;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .categories-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .category-card {
    padding: 16px 8px;
  }
  
  .category-icon {
    width: 48px;
    height: 48px;
  }
  
  .carousel-nav-btn {
    display: none;
  }
}
</style>
