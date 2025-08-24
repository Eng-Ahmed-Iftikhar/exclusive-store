<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div">
      <v-snackbar
        v-for="notification in notifications"
        :key="notification.id"
        :model-value="true"
        :timeout="notification.timeout"
        :color="getNotificationColor(notification.type)"
        location="top"
        class="notification-snackbar"
        @update:model-value="removeNotification(notification.id)"
      >
        <div class="notification-content">
          <v-icon :icon="getNotificationIcon(notification.type)" class="mr-2" />
          <span>{{ notification.message }}</span>
        </div>
        
        <template v-slot:actions>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="removeNotification(notification.id)"
          />
        </template>
      </v-snackbar>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationsStore } from '../stores/modules/notifications';
import type { Notification } from '../stores/modules/notifications';

const notificationsStore = useNotificationsStore();

const notifications = computed(() => notificationsStore.notifications);

const removeNotification = (id: string) => {
  notificationsStore.removeNotification(id);
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'primary';
  }
};

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'mdi-check-circle';
    case 'error':
      return 'mdi-alert-circle';
    case 'warning':
      return 'mdi-alert';
    case 'info':
      return 'mdi-information';
    default:
      return 'mdi-bell';
  }
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;

}

.notification-snackbar {
  pointer-events: none;

}

.notification-content {
  display: flex;
  align-items: center;
  font-weight: 500;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
