<template>
  <section class="music-experience-banner">
    <v-container class="py-0">
      <div class="banner-container">
        <div class="banner-content">
          <h2 class="banner-title">Flash Sale</h2>
          <h3 class="banner-subtitle">Enhance Your Music Experience</h3>
          <div class="countdown-timer">
            <div class="timer-item">
              <span class="timer-number">{{ flashSaleTimer.safeTimeLeft.days }}</span>
              <span class="timer-label">Days</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-item">
              <span class="timer-number">{{ flashSaleTimer.safeTimeLeft.hours }}</span>
              <span class="timer-label">Hours</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-item">
              <span class="timer-number">{{ flashSaleTimer.safeTimeLeft.minutes }}</span>
              <span class="timer-label">Minutes</span>
            </div>
            <div class="timer-separator">:</div>
            <div class="timer-item">
              <span class="timer-number">{{ flashSaleTimer.safeTimeLeft.seconds }}</span>
              <span class="timer-label">Seconds</span>
            </div>
          </div>
          <v-btn 
            color="success" 
            variant="flat" 
            size="large"
            class="buy-now-btn"
            to="/products"
          >
            Buy Now
          </v-btn>
        </div>
        <div class="banner-image">
          <!-- <img :src="jblBoombox" alt="JBL Boombox" /> -->
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useFlashSaleTimerStore } from '../../../stores';

const flashSaleTimer = useFlashSaleTimerStore();

onMounted(() => {
  flashSaleTimer.startTimer();
});

onUnmounted(() => {
  flashSaleTimer.stopTimer();
});
</script>

<style scoped>
.music-experience-banner {
  background: #000;
  padding: 60px 0;
  color: white;
}

.banner-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.banner-content {
  flex: 1;
  max-width: 500px;
}

.banner-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  opacity: 0.8;
}

.banner-subtitle {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 32px 0;
  line-height: 1.1;
}

.countdown-timer {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.timer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 16px;
  border-radius: 0px;
  min-width: 80px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.timer-number {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  color: #DB4444;
  margin-bottom: 4px;
}

.timer-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timer-separator {
  font-size: 28px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  margin-top: -8px;
}

.buy-now-btn {
  padding: 14px 32px;
  font-weight: 700;
  text-transform: none;
  border-radius: 6px !important;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.buy-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(76, 175, 80, 0.4);
}

.banner-image {
  flex-shrink: 0;
}

.banner-image img {
  max-width: 400px;
  height: auto;
}

/* Responsive Design */
@media (max-width: 960px) {
  .banner-container {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .banner-content {
    max-width: 100%;
  }
  
  .banner-subtitle {
    font-size: 36px;
  }
  
  .banner-image img {
    max-width: 300px;
  }
}

@media (max-width: 600px) {
  .music-experience-banner {
    padding: 40px 0;
  }
  
  .banner-subtitle {
    font-size: 28px;
  }
  
  .timer-item {
    min-width: 50px;
    padding: 12px 8px;
  }
  
  .timer-number {
    font-size: 20px;
  }
  
  .buy-now-btn {
    padding: 12px 24px;
  }
}
</style>
