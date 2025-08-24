<template>
  <div class="dashboard-page">
    <v-container class="py-8">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold mb-6">Dashboard</h1>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="dashboard-card pa-6 text-center">
            <v-icon size="64" color="primary" class="mb-4">mdi-shopping-cart</v-icon>
            <h2 class="text-h4 font-weight-bold mb-2">Orders</h2>
            <p class="text-h5 text-medium-emphasis">{{ orderCount }}</p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="dashboard-card pa-6 text-center">
            <v-icon size="64" color="success" class="mb-4">mdi-heart</v-icon>
            <h2 class="text-h4 font-weight-bold mb-2">Favorites</h2>
            <p class="text-h5 text-medium-emphasis">{{ favoriteCount }}</p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="dashboard-card pa-6 text-center">
            <v-icon size="64" color="info" class="mb-4">mdi-account</v-icon>
            <h2 class="text-h4 font-weight-bold mb-2">Profile</h2>
            <p class="text-h5 text-medium-emphasis">Complete</p>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-8">
        <v-col cols="12">
          <v-card class="dashboard-card pa-6">
            <h2 class="text-h4 font-weight-bold mb-4">Recent Orders</h2>
            <v-table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.date }}</td>
                  <td>
                    <v-chip :color="getStatusColor(order.status)" size="small">
                      {{ order.status }}
                    </v-chip>
                  </td>
                  <td>${{ order.total }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const orderCount = ref(0);
const favoriteCount = ref(0);
const recentOrders = ref([
  { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', total: 299.99 },
  { id: 'ORD-002', date: '2024-01-10', status: 'Processing', total: 149.99 },
  { id: 'ORD-003', date: '2024-01-05', status: 'Shipped', total: 89.99 }
]);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'success';
    case 'shipped':
      return 'info';
    case 'processing':
      return 'warning';
    default:
      return 'default';
  }
};

onMounted(() => {
  // Simulate loading data
  orderCount.value = 12;
  favoriteCount.value = 8;
});
</script>

<style scoped>
.dashboard-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.dashboard-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
}
</style>
