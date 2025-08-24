import { IFlashSaleTimer } from ".";

export function createTargetDate(): Date {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  targetDate.setHours(targetDate.getHours() + 12);
  return targetDate;
}

export function calculateTimeLeft(targetDate: Date): IFlashSaleTimer.TimeLeft {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance > 0) {
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  } else {
    // Timer expired
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
}

export function formatTime(timeLeft: IFlashSaleTimer.TimeLeft): IFlashSaleTimer.FormattedTime {
  return {
    days: timeLeft.days.toString().padStart(2, '0'),
    hours: timeLeft.hours.toString().padStart(2, '0'),
    minutes: timeLeft.minutes.toString().padStart(2, '0'),
    seconds: timeLeft.seconds.toString().padStart(2, '0')
  };
}

export function checkIfExpired(timeLeft: IFlashSaleTimer.TimeLeft): boolean {
  return timeLeft.days === 0 && 
         timeLeft.hours === 0 && 
         timeLeft.minutes === 0 && 
         timeLeft.seconds === 0;
}
