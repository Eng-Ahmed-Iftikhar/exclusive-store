export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface FormattedTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface FlashSaleTimerState {
  timeLeft: TimeLeft;
  targetDate: Date;
  isExpired: boolean;
  loading: boolean;
  error: string | null;
}
