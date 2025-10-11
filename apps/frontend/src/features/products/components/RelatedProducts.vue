<template>
  <div class="related-products-section mt-8">
    <h2 class="section-title">Related Products</h2>
    <v-row>
      <v-col v-for="relatedProduct in products" :key="relatedProduct.id" cols="12" sm="6" md="4" lg="3">
        <ProductCard :product="relatedProduct" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '../../../components/ProductCard.vue';


interface Product {
  id: string;
  name: string;
  [key: string]: any;
}

interface Props {
  products: Product[];
}

defineProps<Props>();
</script>

<style scoped>
.related-products-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
  text-align: center;
}
</style>
