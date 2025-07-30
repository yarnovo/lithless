import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html, waitUntil } from '@open-wc/testing';
import { toastManager, type Toast } from '../../core/toast-manager.js';
import './lith-toast.js';
import './lith-toast-container.js';
import type { LithToast } from './lith-toast.js';
import type { LithToastContainer } from './lith-toast-container.js';

describe('LithToast', () => {
  afterEach(() => {
    // Clear all toasts after each test
    toastManager.clear();
  });

  describe('Standalone Toast Component', () => {
    let element: LithToast;

    it('should render with default properties', async () => {
      element = await fixture(html`<lith-toast></lith-toast>`);

      expect(element).toBeDefined();
      expect(element.type).toBe('default');
      expect(element.title).toBe('');
      expect(element.description).toBe('');
      expect(element.closable).toBe(true);
    });

    it('should render with custom properties', async () => {
      element = await fixture(html`
        <lith-toast
          data-type="success"
          title="Success!"
          description="Operation completed"
        ></lith-toast>
      `);
      element.closable = false;
      await element.updateComplete;

      expect(element.type).toBe('success');
      expect(element.title).toBe('Success!');
      expect(element.description).toBe('Operation completed');
      expect(element.closable).toBe(false);
    });

    it('should render title and description', async () => {
      element = await fixture(html`
        <lith-toast title="Test Title" description="Test Description"></lith-toast>
      `);

      const title = element.shadowRoot!.querySelector('.toast-title');
      const description = element.shadowRoot!.querySelector('.toast-description');

      expect(title?.textContent).toBe('Test Title');
      expect(description?.textContent).toBe('Test Description');
    });

    it('should show type-specific icon', async () => {
      const types = ['success', 'error', 'warning', 'info'] as const;

      for (const type of types) {
        element = await fixture(html`<lith-toast data-type=${type}></lith-toast>`);

        const icon = element.shadowRoot!.querySelector('.toast-icon');
        expect(icon).toBeDefined();
        expect(element.getAttribute('data-type')).toBe(type);
      }
    });

    it('should show close button when closable', async () => {
      element = await fixture(html`<lith-toast closable></lith-toast>`);

      const closeButton = element.shadowRoot!.querySelector('.toast-close');
      expect(closeButton).toBeDefined();
    });

    it('should hide close button when not closable', async () => {
      element = await fixture(html`<lith-toast></lith-toast>`);
      element.closable = false;
      await element.updateComplete;

      const closeButton = element.shadowRoot!.querySelector('.toast-close');
      expect(closeButton).toBeNull();
    });

    it('should emit close event when close button clicked', async () => {
      element = await fixture(html`<lith-toast closable></lith-toast>`);

      const closeSpy = vi.fn();
      element.addEventListener('lith-toast-close', closeSpy);

      const closeButton = element.shadowRoot!.querySelector('.toast-close') as HTMLButtonElement;
      closeButton.click();

      await waitUntil(() => closeSpy.mock.calls.length > 0);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should support custom content via slot', async () => {
      element = await fixture(html`
        <lith-toast>
          <div id="custom-content">Custom Toast Content</div>
        </lith-toast>
      `);

      const slot = element.shadowRoot!.querySelector('slot:not([name])');
      const assignedNodes = (slot as HTMLSlotElement).assignedNodes();

      expect(assignedNodes.length).toBeGreaterThan(0);
      expect(element.querySelector('#custom-content')?.textContent).toBe('Custom Toast Content');
    });

    it('should support custom icon via slot', async () => {
      element = await fixture(html`
        <lith-toast>
          <span slot="icon">🚀</span>
        </lith-toast>
      `);

      const iconSlot = element.shadowRoot!.querySelector('slot[name="icon"]');
      const assignedNodes = (iconSlot as HTMLSlotElement).assignedNodes();

      expect(assignedNodes.length).toBeGreaterThan(0);
    });
  });

  describe('Toast with Manager', () => {
    let element: LithToast;

    it('should render from toast object', async () => {
      const toast: Toast = {
        id: 'test-1',
        type: 'info',
        title: 'Info Toast',
        description: 'This is an info toast',
        duration: 5000,
        closable: true,
        position: 'top-right',
        createdAt: Date.now(),
      };

      element = await fixture(html`<lith-toast .toast=${toast}></lith-toast>`);

      expect(element.type).toBe('info');
      expect(element.title).toBe('Info Toast');
      expect(element.description).toBe('This is an info toast');
    });

    it('should handle action button', async () => {
      const actionSpy = vi.fn();
      const toast: Toast = {
        id: 'test-2',
        type: 'default',
        title: 'Toast with Action',
        description: '',
        duration: 0,
        closable: true,
        position: 'top-right',
        action: {
          label: 'Undo',
          onClick: actionSpy,
        },
        createdAt: Date.now(),
      };

      element = await fixture(html`<lith-toast .toast=${toast}></lith-toast>`);

      const actionButton = element.shadowRoot!.querySelector(
        '.toast-action button'
      ) as HTMLButtonElement;
      expect(actionButton).toBeDefined();
      expect(actionButton.textContent).toBe('Undo');

      actionButton.click();
      expect(actionSpy).toHaveBeenCalledOnce();
    });

    it('should emit action event', async () => {
      const actionSpy = vi.fn();
      const eventSpy = vi.fn();

      const toast: Toast = {
        id: 'test-3',
        type: 'default',
        title: 'Toast',
        description: '',
        duration: 0,
        closable: true,
        position: 'top-right',
        action: {
          label: 'Action',
          onClick: actionSpy,
        },
        createdAt: Date.now(),
      };

      element = await fixture(html`<lith-toast .toast=${toast}></lith-toast>`);
      element.addEventListener('lith-toast-action', eventSpy);

      const actionButton = element.shadowRoot!.querySelector(
        '.toast-action button'
      ) as HTMLButtonElement;
      actionButton.click();

      expect(eventSpy).toHaveBeenCalledOnce();
      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.id).toBe('test-3');
      expect(event.detail.action).toBe(toast.action);
    });
  });

  describe('Toast Container', () => {
    let container: LithToastContainer;

    beforeEach(async () => {
      container = await fixture(html`<lith-toast-container></lith-toast-container>`);
    });

    it('should render with default properties', () => {
      expect(container).toBeDefined();
      expect(container.maxCount).toBe(5);
      expect(container.defaultPosition).toBe('top-right');
      expect(container.usePortal).toBe(true);
    });

    it('should display toasts from manager', async () => {
      toastManager.success('Success message');

      await container.updateComplete;
      await waitUntil(() => {
        const toasts = container.shadowRoot!.querySelectorAll('lith-toast');
        return toasts.length > 0;
      });

      const toasts = container.shadowRoot!.querySelectorAll('lith-toast');
      expect(toasts.length).toBe(1);
    });

    it('should group toasts by position', async () => {
      toastManager.add({ title: 'Top Left', position: 'top-left' });
      toastManager.add({ title: 'Top Right', position: 'top-right' });
      toastManager.add({ title: 'Bottom Center', position: 'bottom-center' });

      await container.updateComplete;
      await waitUntil(() => {
        const toasts = container.shadowRoot!.querySelectorAll('lith-toast');
        return toasts.length === 3;
      });

      const groups = container.shadowRoot!.querySelectorAll('.toast-group');
      const visibleGroups = Array.from(groups).filter((g) => g.querySelector('lith-toast'));

      expect(visibleGroups.length).toBe(3);
    });

    it('should limit number of toasts per position', async () => {
      container.maxCount = 3;

      // Add 5 toasts to same position
      for (let i = 0; i < 5; i++) {
        toastManager.add({ title: `Toast ${i + 1}`, position: 'top-right' });
      }

      await container.updateComplete;
      await waitUntil(() => {
        const toasts = container.shadowRoot!.querySelectorAll('lith-toast');
        return toasts.length > 0;
      });

      const toasts = container.shadowRoot!.querySelectorAll(
        '[data-position="top-right"] lith-toast'
      );
      expect(toasts.length).toBe(3); // Should only show last 3
    });

    it('should emit open event for new toasts', async () => {
      const openSpy = vi.fn();
      container.addEventListener('lith-toast-open', openSpy);

      toastManager.info('New toast');

      await container.updateComplete;
      await waitUntil(() => openSpy.mock.calls.length > 0);

      expect(openSpy).toHaveBeenCalledOnce();
      const event = openSpy.mock.calls[0][0];
      expect(event.detail.toast.title).toBe('New toast');
    });

    it('should emit close event when toast closes', async () => {
      const closeSpy = vi.fn();
      container.addEventListener('lith-toast-close', closeSpy);

      const id = toastManager.add({ title: 'Closable toast' });

      await container.updateComplete;
      await waitUntil(() => {
        const toasts = container.shadowRoot!.querySelectorAll('lith-toast');
        return toasts.length > 0;
      });

      const toast = container.shadowRoot!.querySelector('lith-toast');
      const closeButton = toast!.shadowRoot!.querySelector('.toast-close') as HTMLButtonElement;
      closeButton.click();

      await waitUntil(() => closeSpy.mock.calls.length > 0);
      expect(closeSpy).toHaveBeenCalledOnce();
      expect(closeSpy.mock.calls[0][0].detail.id).toBe(id);
    });

    it('should work without portal', async () => {
      container = await fixture(html`
        <lith-toast-container ?use-portal=${false}></lith-toast-container>
      `);

      toastManager.add({ title: 'No portal toast' });

      await container.updateComplete;
      await waitUntil(() => {
        const toasts = container.shadowRoot!.querySelectorAll('lith-toast');
        return toasts.length > 0;
      });

      const portal = container.shadowRoot!.querySelector('lith-portal');
      expect(portal).toBeNull();

      const toast = container.shadowRoot!.querySelector('lith-toast');
      expect(toast).toBeDefined();
    });
  });

  describe('Toast Manager API', () => {
    it('should auto-dismiss toast after duration', async () => {
      toastManager.add({
        title: 'Auto dismiss',
        duration: 100, // 100ms for quick test
      });

      expect(toastManager['toasts'].length).toBe(1);

      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(toastManager['toasts'].length).toBe(0);
    });

    it('should handle promise-based toasts', async () => {
      const successPromise = Promise.resolve('Success data');

      await toastManager.promise(successPromise, {
        loading: 'Loading...',
        success: (data) => `Success: ${data}`,
        error: 'Error occurred',
      });

      await waitUntil(() => {
        const toasts = toastManager['toasts'];
        return toasts.length > 0 && toasts[0].type === 'success';
      });

      const toast = toastManager['toasts'][0];
      expect(toast.title).toBe('Success: Success data');
    });

    it('should handle promise rejection', async () => {
      const errorPromise = Promise.reject(new Error('Test error'));

      try {
        await toastManager.promise(errorPromise, {
          loading: 'Loading...',
          success: 'Success',
          error: (err) => `Error: ${err.message}`,
        });
      } catch {
        // Expected to throw
      }

      await waitUntil(() => {
        const toasts = toastManager['toasts'];
        return toasts.length > 0 && toasts[0].type === 'error';
      });

      const toast = toastManager['toasts'][0];
      expect(toast.title).toBe('Error: Test error');
    });
  });
});
