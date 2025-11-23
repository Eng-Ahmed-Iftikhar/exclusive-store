<template>
  <div class="categories-sidebar">
    <div class="categories-container">


      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular indeterminate color="primary" size="32" />
        <p>Loading categories...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <v-icon icon="mdi-alert-circle" size="32" color="error" />
        <p>{{ error }}</p>
        <v-btn @click="categoriesStore.fetchCategories({ isActive: true })" color="primary" variant="outlined"
          size="small">
          Retry
        </v-btn>
      </div>

      <!-- Categories List -->
      <ul v-else-if="categories.length > 0" class="categories-list">
        <li v-for="category in categories" :key="category.id" class="category-item">
          <div 
            :ref="el => setCategoryRef(category.id, el)"
            class="category-header"
            @mouseenter="updateDropdownPosition(category.id)"
          >
            <span class="category-name" @click="selectCategory(category.id)">
              {{ category.name }}
            </span>
            <v-icon :icon="category.isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="16"
              class="category-arrow" :class="{ 'rotated': category.isExpanded }" @click="toggleCategory(category.id)" />
          </div>

          <!-- Subcategories Dropdown -->
          <transition name="subcategory-dropdown">
            <div 
              v-if="category.isExpanded && category.subcategories.length > 0" 
              class="subcategories-dropdown"
              :style="getDropdownStyle(category.id)"
            >
              <ul class="subcategories-list">
                <li v-for="subcategory in category.subcategories" :key="subcategory.id" class="subcategory-item"
                  @click="selectSubcategory(category.id, subcategory.id)">
                  <span class="subcategory-name">{{ subcategory.name }}</span>
                </li>
              </ul>
            </div>
          </transition>
        </li>
      </ul>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <v-icon icon="mdi-folder-outline" size="32" color="grey" />
        <p>No categories available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoriesStore } from '../../../stores/modules/categories/categories.store';

const router = useRouter();
const categoriesStore = useCategoriesStore();

// Track expanded state separately
const expandedCategories = ref<Set<string>>(new Set());

// Track category header refs and positions
const categoryRefs = ref<Map<string, HTMLElement>>(new Map());
const dropdownPositions = ref<Map<string, { top: number; left: number }>>(new Map());

// Set category ref
const setCategoryRef = (categoryId: string, el: any) => {
  if (el) {
    categoryRefs.value.set(categoryId, el);
  }
};

// Update dropdown position
const updateDropdownPosition = (categoryId: string) => {
  const el = categoryRefs.value.get(categoryId);
  if (el) {
    const rect = el.getBoundingClientRect();
    dropdownPositions.value.set(categoryId, {
      top: rect.top,
      left: rect.right
    });
  }
};

// Update all expanded dropdown positions on scroll
const updateAllDropdownPositions = () => {
  expandedCategories.value.forEach(categoryId => {
    updateDropdownPosition(categoryId);
  });
};

// Get dropdown style
const getDropdownStyle = (categoryId: string) => {
  const position = dropdownPositions.value.get(categoryId);
  if (position) {
    return {
      top: `${position.top}px`,
      left: `${position.left}px`
    };
  }
  return {};
};

// Close all dropdowns on page scroll (but not sidebar or dropdown scroll)
const handlePageScroll = (event: Event) => {
  const sidebar = document.querySelector('.categories-sidebar');
  const target = event.target as HTMLElement;
  
  // Check if scroll is from sidebar or subcategories dropdown
  const isFromSidebar = target === sidebar;
  const isFromDropdown = target?.classList?.contains('subcategories-dropdown');
  
  // Only close if the scroll is not from the sidebar or dropdown itself
  if (!isFromSidebar && !isFromDropdown && expandedCategories.value.size > 0) {
    expandedCategories.value.clear();
  }
};

// Fetch categories on component mount
onMounted(async () => {
  try {
    await categoriesStore.fetchCategories({ isActive: true });
    
    // Listen for scroll events on the sidebar to update dropdown positions
    const sidebar = document.querySelector('.categories-sidebar');
    if (sidebar) {
      sidebar.addEventListener('scroll', updateAllDropdownPositions);
    }
    
    // Listen for page scroll to close dropdowns
    window.addEventListener('scroll', handlePageScroll, true);
  } catch (error) {
    // Handle error silently or emit an event
  }
});

// Clean up event listeners
onUnmounted(() => {
  const sidebar = document.querySelector('.categories-sidebar');
  if (sidebar) {
    sidebar.removeEventListener('scroll', updateAllDropdownPositions);
  }
  window.removeEventListener('scroll', handlePageScroll, true);
});

// Get categories from store with subcategories already included
const categories = computed(() => {
  return categoriesStore.activeCategories.map(category => ({
    ...category,
    isExpanded: expandedCategories.value.has(category.id),
    subcategories: category.subcategories || []
  }));
});

// Loading state
const loading = computed(() => categoriesStore.loading);

// Error state
const error = computed(() => categoriesStore.error);

const toggleCategory = (categoryId: string) => {
  if (expandedCategories.value.has(categoryId)) {
    // If clicking the same category, close it
    expandedCategories.value.delete(categoryId);
  } else {
    // If clicking a different category, close all others and open this one
    expandedCategories.value.clear(); // Close all categories
    expandedCategories.value.add(categoryId); // Open only this category
    
    // Update position after a brief delay to ensure DOM is updated
    setTimeout(() => {
      updateDropdownPosition(categoryId);
    }, 10);
  }
};

const selectCategory = (categoryId: string) => {
  // Find the category to get its slug
  const category = categories.value.find(cat => cat.id === categoryId);

  if (category) {
    // Navigate to products page with category slug as query parameter
    router.push({
      name: 'products',
      query: {
        category: category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
      }
    });
  }
};

const selectSubcategory = (categoryId: string, subcategoryId: string) => {
  // Find the category and subcategory to get their slugs
  const category = categories.value.find(cat => cat.id === categoryId);
  const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);

  if (category && subcategory) {
    // Navigate to products page with category and subcategory slugs as query parameters
    router.push({
      name: 'products',
      query: {
        category: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
        subcategory: subcategory.slug || subcategory.name.toLowerCase().replace(/\s+/g, '-')
      }
    });
  }
};
</script>

<style scoped>
.categories-sidebar {
  background: #fff;
  border-right: 1px solid #f0f0f0;
  height: 400px;
  overflow-y: auto;
  overflow-x: clip;
  position: relative;
}

/* Custom scrollbar for sidebar */
.categories-sidebar::-webkit-scrollbar {
  width: 6px;
}

.categories-sidebar::-webkit-scrollbar-track {
  background: #f9f9f9;
}

.categories-sidebar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.categories-sidebar::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.categories-container {
  padding: 20px;
  padding-right: 10px;
  position: relative;
}

.categories-title {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.categories-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  border-bottom: 1px solid #f5f5f5;
  position: static;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-header:hover {
  background: #f8f8f8;
  padding-left: 8px;
}

.category-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  flex: 1;
}

.category-name:hover {
  color: #1976d2;
}

.category-arrow {
  color: #999;
  transition: transform 0.3s ease;
  cursor: pointer;
  margin-left: 8px;
}

.category-arrow:hover {
  color: #666;
}

.category-arrow.rotated {
  transform: rotate(90deg);
}

.subcategories-dropdown {
  position: fixed;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-width: 250px;
  max-height: 400px;
  z-index: 9999;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Custom scrollbar styling */
.subcategories-dropdown::-webkit-scrollbar {
  width: 6px;
}

.subcategories-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.subcategories-dropdown::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.subcategories-dropdown::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.subcategories-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
}

.subcategory-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
}

.subcategory-item:hover {
  background: #f8f8f8;
  padding-left: 20px;
}

.subcategory-item:last-child {
  border-bottom: none;
}

.subcategory-name {
  font-size: 14px;
  color: #333;
  font-weight: 400;
}

/* Transition animations */
.subcategory-dropdown-enter-active,
.subcategory-dropdown-leave-active {
  transition: all 0.2s ease;
}

.subcategory-dropdown-enter-from,
.subcategory-dropdown-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.subcategory-dropdown-enter-to,
.subcategory-dropdown-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* Loading, Error, and Empty States */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
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
  .categories-sidebar {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }

  .categories-container {
    padding: 16px;
  }

  .categories-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .subcategories-dropdown {
    position: static;
    left: auto;
    top: auto;
    margin-top: 8px;
    margin-left: 20px;
    box-shadow: none;
    border: 1px solid #e0e0e0;
    border-radius: 0px;
    min-width: auto;
  }
}

@media (max-width: 600px) {
  .categories-container {
    padding: 12px;
  }

  .category-header {
    padding: 10px 0;
  }

  .subcategory-item {
    padding: 6px 0 6px 16px;
  }

  .subcategory-item:hover {
    padding-left: 20px;
  }
}
</style>
