<template>
  <div class="products-header">
    <v-container>
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb-nav mb-4" v-if="showBreadcrumbs">
        <v-breadcrumbs :items="breadcrumbItems" class="px-0">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right" size="small" />
          </template>
        </v-breadcrumbs>
      </nav>

      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">{{ title }}</h1>
          <p class="page-subtitle">{{ subtitle }}</p>
        </div>
        
        <!-- Quick Actions -->
        <div class="header-actions" v-if="!showBreadcrumbs">
          <v-btn 
            color="primary" 
            variant="outlined" 
            prepend-icon="mdi-view-grid"
            to="/products"
          >
            Grid View
          </v-btn>
          <v-btn 
            color="primary" 
            variant="outlined" 
            prepend-icon="mdi-view-list"
            to="/products?view=list"
          >
            List View
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface ProductsHeaderProps {
  title?: string;
  subtitle?: string;
}

const props = withDefaults(defineProps<ProductsHeaderProps>(), {
  title: 'All Products',
  subtitle: 'Discover our complete collection of products'
});

const route = useRoute();

// Computed properties for dynamic content
const showBreadcrumbs = computed(() => {
  return !!(route.query.category || route.query.subcategory);
});

const title = computed(() => {
  if (route.query.subcategory) {
    return route.query.subcategory as string;
  } else if (route.query.category) {
    return route.query.category as string;
  }
  return props.title;
});

const subtitle = computed(() => {
  if (route.query.subcategory) {
    return `Browse ${route.query.subcategory} in ${route.query.category}`;
  } else if (route.query.category) {
    return `Browse all products in ${route.query.category}`;
  }
  return props.subtitle;
});

const breadcrumbItems = computed(() => {
  const items = [
    {
      title: 'Home',
      to: '/',
      disabled: false
    },
    {
      title: 'Products',
      to: '/products',
      disabled: false
    }
  ];

  if (route.query.category) {
    items.push({
      title: route.query.category as string,
      to: `/products?category=${route.query.category}`,
      disabled: false
    });
  }

  if (route.query.subcategory) {
    items.push({
      title: route.query.subcategory as string,
      to: `/products?category=${route.query.category}&subcategory=${route.query.subcategory}`,
      disabled: true
    });
  }

  return items;
});
</script>

<style scoped>
.products-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
  color: white;
}

.breadcrumb-nav {
  margin-bottom: 24px;
}

.breadcrumb-nav :deep(.v-breadcrumbs) {
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb-nav :deep(.v-breadcrumbs-item) {
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb-nav :deep(.v-breadcrumbs-item--link:hover) {
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}

.header-text {
  flex: 1;
  min-width: 300px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.4;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.header-actions .v-btn {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.header-actions .v-btn:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 960px) {
  .products-header {
    padding: 32px 0;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    align-self: stretch;
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .products-header {
    padding: 24px 0;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-subtitle {
    font-size: 15px;
  }
  
  .header-text {
    min-width: auto;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .header-actions .v-btn {
    width: 100%;
  }
}
</style>
