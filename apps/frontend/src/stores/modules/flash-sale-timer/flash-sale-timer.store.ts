import { defineStore } from 'pinia';
import { ref, computed, onUnmounted } from 'vue';
import { IFlashSaleTimer, FlashSaleTimerActions } from '.';

export const useFlashSaleTimerStore = defineStore('flashSaleTimer', () => {
  // ****** State ******
  const timeLeft = ref<IFlashSaleTimer.TimeLeft>({
    days: 3,
    hours: 12,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = ref<Date>(FlashSaleTimerActions.createTargetDate());
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  let timerInterval: ReturnType<typeof setInterval> | null = null;

  // ****** Getters ******
  const formattedTime = computed(() =>
    FlashSaleTimerActions.formatTime(timeLeft.value)
  );

  const safeTimeLeft = computed(() => ({
    days: timeLeft.value?.days ?? 3,
    hours: timeLeft.value?.hours ?? 12,
    minutes: timeLeft.value?.minutes ?? 0,
    seconds: timeLeft.value?.seconds ?? 0,
  }));

  const isExpired = computed(() =>
    FlashSaleTimerActions.checkIfExpired(timeLeft.value)
  );

  // ****** Actions ******
  const updateTimer = (): void => {
    try {
      const newTimeLeft = FlashSaleTimerActions.calculateTimeLeft(
        targetDate.value
      );
      timeLeft.value = newTimeLeft;

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        stopTimer();
      }
    } catch (err) {
      // Error updating timer
    }
  };

  const startTimer = (): void => {
    if (!timerInterval) {
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    }
  };

  const stopTimer = (): void => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const resetTimer = (): void => {
    stopTimer();
    targetDate.value = FlashSaleTimerActions.createTargetDate();
    timeLeft.value = {
      days: 3,
      hours: 12,
      minutes: 0,
      seconds: 0,
    };
    startTimer();
  };

  const clearError = (): void => {
    error.value = null;
  };

  const reset = (): void => {
    stopTimer();
    targetDate.value = FlashSaleTimerActions.createTargetDate();
    timeLeft.value = {
      days: 3,
      hours: 12,
      minutes: 0,
      seconds: 0,
    };
    loading.value = false;
    error.value = null;
  };

  // Cleanup timer on component unmount
  onUnmounted(() => {
    stopTimer();
  });

  return {
    // ****** State ******
    timeLeft,
    targetDate,
    loading,
    error,

    // ****** Getters ******
    formattedTime,
    safeTimeLeft,
    isExpired,

    // ****** Actions ******
    startTimer,
    stopTimer,
    resetTimer,
    updateTimer,
    clearError,
    reset,
  };
});
