/**
 * Notification Manager - Manages notification instances
 */

import type { ToastType } from './toast-manager.js';

export interface NotificationOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message?: string;
  closable?: boolean;
  duration?: number; // 0 means no auto-dismiss
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    primary?: boolean;
  }>;
  icon?: string | HTMLElement;
  position?: 'top' | 'bottom' | 'center';
}

export interface Notification
  extends Required<Omit<NotificationOptions, 'actions' | 'icon' | 'onClose'>> {
  actions?: NotificationOptions['actions'];
  icon?: NotificationOptions['icon'];
  onClose?: NotificationOptions['onClose'];
  createdAt: number;
}

type NotificationListener = (notifications: Notification[]) => void;

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private idCounter = 0;
  private container?: HTMLElement;

  /**
   * Subscribe to notification changes
   */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.notifications);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of notification changes
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  /**
   * Generate unique notification ID
   */
  private generateId(): string {
    return `lith-notification-${++this.idCounter}`;
  }

  /**
   * Set the container element for notifications
   */
  setContainer(container: HTMLElement): void {
    this.container = container;
  }

  /**
   * Show a notification
   */
  show(options: NotificationOptions): string {
    const notification: Notification = {
      id: options.id || this.generateId(),
      type: options.type || 'default',
      title: options.title || '',
      message: options.message || '',
      closable: options.closable ?? true,
      duration: options.duration ?? 0, // No auto-dismiss by default
      position: options.position || 'top',
      actions: options.actions,
      icon: options.icon,
      onClose: options.onClose,
      createdAt: Date.now(),
    };

    // Remove existing notification with same ID if any
    this.notifications = this.notifications.filter((n) => n.id !== notification.id);

    // Add new notification
    this.notifications.push(notification);
    this.notify();

    // Auto remove if duration is set
    if (notification.duration > 0) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }

  /**
   * Dismiss a notification by ID
   */
  dismiss(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification?.onClose) {
      notification.onClose();
    }

    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  /**
   * Dismiss all notifications
   */
  clear(): void {
    this.notifications.forEach((notification) => {
      if (notification.onClose) {
        notification.onClose();
      }
    });

    this.notifications = [];
    this.notify();
  }

  /**
   * Update a notification
   */
  update(id: string, options: Partial<NotificationOptions>): void {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications[index] = {
        ...this.notifications[index],
        ...options,
      };
      this.notify();
    }
  }

  /**
   * Success notification shorthand
   */
  success(title: string, options?: Omit<NotificationOptions, 'type' | 'title'>): string {
    return this.show({ ...options, type: 'success', title });
  }

  /**
   * Error notification shorthand
   */
  error(title: string, options?: Omit<NotificationOptions, 'type' | 'title'>): string {
    return this.show({ ...options, type: 'error', title });
  }

  /**
   * Warning notification shorthand
   */
  warning(title: string, options?: Omit<NotificationOptions, 'type' | 'title'>): string {
    return this.show({ ...options, type: 'warning', title });
  }

  /**
   * Info notification shorthand
   */
  info(title: string, options?: Omit<NotificationOptions, 'type' | 'title'>): string {
    return this.show({ ...options, type: 'info', title });
  }

  /**
   * Show notification in container element
   */
  showInContainer(container: HTMLElement, options: NotificationOptions): string {
    const previousContainer = this.container;
    this.setContainer(container);
    const id = this.show(options);
    this.setContainer(previousContainer!);
    return id;
  }
}

// Create singleton instance
export const notificationManager = new NotificationManager();

// Export convenience methods
export const notification = {
  show: notificationManager.show.bind(notificationManager),
  dismiss: notificationManager.dismiss.bind(notificationManager),
  clear: notificationManager.clear.bind(notificationManager),
  update: notificationManager.update.bind(notificationManager),
  success: notificationManager.success.bind(notificationManager),
  error: notificationManager.error.bind(notificationManager),
  warning: notificationManager.warning.bind(notificationManager),
  info: notificationManager.info.bind(notificationManager),
  setContainer: notificationManager.setContainer.bind(notificationManager),
  showInContainer: notificationManager.showInContainer.bind(notificationManager),
};
