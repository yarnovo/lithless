/**
 * Toast Manager - Manages toast instances globally
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  closable?: boolean;
  position?: ToastPosition;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: string | HTMLElement;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
}

export interface Toast
  extends Required<Omit<ToastOptions, 'action' | 'icon' | 'className' | 'style' | 'onClose'>> {
  action?: ToastOptions['action'];
  icon?: ToastOptions['icon'];
  className?: ToastOptions['className'];
  style?: ToastOptions['style'];
  onClose?: ToastOptions['onClose'];
  createdAt: number;
}

type ToastListener = (toasts: Toast[]) => void;

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: Set<ToastListener> = new Set();
  private idCounter = 0;

  /**
   * Subscribe to toast changes
   */
  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.toasts);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of toast changes
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  /**
   * Generate unique toast ID
   */
  private generateId(): string {
    return `lith-toast-${++this.idCounter}`;
  }

  /**
   * Add a new toast
   */
  add(options: ToastOptions): string {
    const toast: Toast = {
      id: options.id || this.generateId(),
      type: options.type || 'default',
      title: options.title || '',
      description: options.description || '',
      duration: options.duration ?? 3000,
      closable: options.closable ?? true,
      position: options.position || 'top-right',
      action: options.action,
      icon: options.icon,
      className: options.className,
      style: options.style,
      onClose: options.onClose,
      createdAt: Date.now(),
    };

    // Remove existing toast with same ID if any
    this.toasts = this.toasts.filter((t) => t.id !== toast.id);

    // Add new toast
    this.toasts.push(toast);
    this.notify();

    // Auto remove if duration is set
    if (toast.duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, toast.duration);
    }

    return toast.id;
  }

  /**
   * Remove a toast by ID
   */
  remove(id: string): void {
    const toast = this.toasts.find((t) => t.id === id);
    if (toast?.onClose) {
      toast.onClose();
    }

    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notify();
  }

  /**
   * Remove all toasts
   */
  clear(): void {
    this.toasts.forEach((toast) => {
      if (toast.onClose) {
        toast.onClose();
      }
    });

    this.toasts = [];
    this.notify();
  }

  /**
   * Update a toast
   */
  update(id: string, options: Partial<ToastOptions>): void {
    const index = this.toasts.findIndex((toast) => toast.id === id);
    if (index !== -1) {
      this.toasts[index] = {
        ...this.toasts[index],
        ...options,
      };
      this.notify();
    }
  }

  /**
   * Get toasts by position
   */
  getToastsByPosition(position: ToastPosition): Toast[] {
    return this.toasts.filter((toast) => toast.position === position);
  }

  /**
   * Success toast shorthand
   */
  success(title: string, options?: Omit<ToastOptions, 'type' | 'title'>): string {
    return this.add({ ...options, type: 'success', title });
  }

  /**
   * Error toast shorthand
   */
  error(title: string, options?: Omit<ToastOptions, 'type' | 'title'>): string {
    return this.add({ ...options, type: 'error', title });
  }

  /**
   * Warning toast shorthand
   */
  warning(title: string, options?: Omit<ToastOptions, 'type' | 'title'>): string {
    return this.add({ ...options, type: 'warning', title });
  }

  /**
   * Info toast shorthand
   */
  info(title: string, options?: Omit<ToastOptions, 'type' | 'title'>): string {
    return this.add({ ...options, type: 'info', title });
  }

  /**
   * Promise-based toast
   */
  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: Omit<ToastOptions, 'type' | 'title'>
  ): Promise<T> {
    const id = this.add({
      ...options,
      type: 'default',
      title: messages.loading,
      duration: 0, // Don't auto-dismiss loading toast
    });

    try {
      const result = await promise;
      this.update(id, {
        type: 'success',
        title: typeof messages.success === 'function' ? messages.success(result) : messages.success,
        duration: options?.duration ?? 3000,
      });
      return result;
    } catch (error) {
      this.update(id, {
        type: 'error',
        title:
          typeof messages.error === 'function' ? messages.error(error as Error) : messages.error,
        duration: options?.duration ?? 3000,
      });
      throw error;
    }
  }
}

// Create singleton instance
export const toastManager = new ToastManager();

// Export convenience methods
export const toast = {
  add: toastManager.add.bind(toastManager),
  remove: toastManager.remove.bind(toastManager),
  clear: toastManager.clear.bind(toastManager),
  update: toastManager.update.bind(toastManager),
  success: toastManager.success.bind(toastManager),
  error: toastManager.error.bind(toastManager),
  warning: toastManager.warning.bind(toastManager),
  info: toastManager.info.bind(toastManager),
  promise: toastManager.promise.bind(toastManager),
};
