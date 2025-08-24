import { INotifications } from ".";

export function createNotification(message: string, type: INotifications.Notification['type'], timeout?: number): INotifications.Notification {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    message,
    type,
    timeout,
    createdAt: new Date(),
  };
}

export function removeNotification(id: string): void {
  // This is handled in the store, but we keep the action for consistency
}

export function clearAllNotifications(): void {
  // This is handled in the store, but we keep the action for consistency
}
