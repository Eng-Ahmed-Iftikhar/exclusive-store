<template>
  <section class="service-highlights-section">
    <v-container>
      <div class="services-grid">
        <div 
          v-for="service in services" 
          :key="service.id" 
          class="service-item"
        >
          <div class="service-icon">
            <v-icon :icon="service.icon" size="48" color="#DB4444" />
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-description">{{ service.description }}</p>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
const services = [
  {
    id: 1,
    icon: "mdi-truck",
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140"
  },
  {
    id: 2,
    icon: "mdi-headset",
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer"
  },
  {
    id: 3,
    icon: "mdi-shield-check",
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days"
  }
];
</script>

<style scoped>
.service-highlights-section {
  background: #fff;
  padding: 60px 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  text-align: center;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.service-icon {
  width: 80px;
  height: 80px;
  border-radius: 0px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.service-item:hover .service-icon {
  background: #fff0f0;
  transform: scale(1.1);
}

.service-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0;
  line-height: 1.3;
}

.service-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 960px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

@media (max-width: 600px) {
  .service-highlights-section {
    padding: 40px 0;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .service-icon {
    width: 64px;
    height: 64px;
  }
  
  .service-title {
    font-size: 16px;
  }
  
  .service-description {
    font-size: 13px;
  }
}
</style>
