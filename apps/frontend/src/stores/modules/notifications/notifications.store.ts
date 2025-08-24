import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { INotifications, NotificationsActions } from '.';

export const useNotificationsStore = defineStore('notifications', () => {
  // ****** State ******
  const notifications = ref<INotifications.Notification[]>([]);

  // ****** Getters ******
  const notificationsCount = computed(() => notifications.value.length);
  const hasNotifications = computed(() => notifications.value.length > 0);

  // ****** Actions ******
  const addNotification = (notification: Omit<INotifications.Notification, 'id' | 'createdAt'>): string => {
    const newNotification = NotificationsActions.createNotification(
      notification.message,
      notification.type,
      notification.timeout
    );
    
    notifications.value.push(newNotification);

    // Auto-remove notification after timeout
    if (notification.timeout) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.timeout);
    }

    return newNotification.id;
  };

  const removeNotification = (id: string): void => {
    notifications.value = notifications.value.filter(notification => notification.id !== id);
  };

  const clearAllNotifications = (): void => {
    notifications.value = [];
  };

  // Convenience methods
  const showSuccess = (message: string, timeout: number = 5000): string => {
    return addNotification({ message, type: 'success', timeout });
  };

  const showError = (message: string, timeout: number = 7000): string => {
    return addNotification({ message, type: 'error', timeout });
  };

  const showWarning = (message: string, timeout: number = 5000): string => {
    return addNotification({ message, type: 'warning', timeout });
  };

  const showInfo = (message: string, timeout: number = 4000): string => {
    return addNotification({ message, type: 'info', timeout });
  };

  // Legacy method for backward compatibility
  const showNotification = (message: string, type: INotifications.Notification['type'] = 'info'): string => {
    return addNotification({ message, type });
  };

  return {
    // ****** State ******
    notifications,

    // ****** Getters ******
    notificationsCount,
    hasNotifications,

    // ****** Actions ******
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
  };
});
