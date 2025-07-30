import { describe, it, expect, vi } from 'vitest';
import { fixture, html, waitUntil } from '@open-wc/testing';
import './lith-notification.js';
import type { LithNotification } from './lith-notification.js';

describe('LithNotification', () => {
  let element: LithNotification;

  describe('Rendering', () => {
    it('should render with default properties', async () => {
      element = await fixture<LithNotification>(html`<lith-notification></lith-notification>`);

      expect(element).toBeDefined();
      expect(element.type).toBe('default');
      expect(element.title).toBe('');
      expect(element.closable).toBe(true);
      expect(element.animated).toBe(true);
    });

    it('should render with custom properties', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification type="error" title="Error Notification"></lith-notification>
      `);
      element.closable = false;
      element.animated = false;
      await element.updateComplete;

      expect(element.type).toBe('error');
      expect(element.title).toBe('Error Notification');
      expect(element.closable).toBe(false);
      expect(element.animated).toBe(false);
    });

    it('should render title when provided', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification title="Test Title"></lith-notification>
      `);

      const title = element.shadowRoot!.querySelector('.notification-title');
      expect(title?.textContent).toBe('Test Title');
    });

    it('should not render title when not provided', async () => {
      element = await fixture<LithNotification>(html`<lith-notification></lith-notification>`);

      const title = element.shadowRoot!.querySelector('.notification-title');
      expect(title).toBeNull();
    });

    it('should show type-specific styling', async () => {
      const types = ['success', 'error', 'warning', 'info'] as const;

      for (const type of types) {
        element = await fixture<LithNotification>(html`
          <lith-notification type=${type}></lith-notification>
        `);

        expect(element.getAttribute('type')).toBe(type);

        const icon = element.shadowRoot!.querySelector('.notification-icon');
        expect(icon).toBeDefined();
      }
    });

    it('should render custom icon via slot', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification>
          <span slot="icon">🚀</span>
        </lith-notification>
      `);

      const iconSlot = element.shadowRoot!.querySelector('slot[name="icon"]');
      const assignedNodes = (iconSlot as HTMLSlotElement).assignedNodes();

      expect(assignedNodes.length).toBeGreaterThan(0);
    });

    it('should render content via default slot', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification>
          <p>This is the notification content</p>
        </lith-notification>
      `);

      const content = element.querySelector('p');
      expect(content?.textContent).toBe('This is the notification content');
    });

    it('should render actions via slot', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification>
          <div slot="actions">
            <button>Action 1</button>
            <button>Action 2</button>
          </div>
        </lith-notification>
      `);

      const actionsSlot = element.shadowRoot!.querySelector('slot[name="actions"]');
      const assignedNodes = (actionsSlot as HTMLSlotElement).assignedNodes();

      expect(assignedNodes.length).toBeGreaterThan(0);

      const buttons = element.querySelectorAll('button');
      expect(buttons.length).toBe(2);
    });
  });

  describe('Close functionality', () => {
    it('should show close button when closable', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification closable></lith-notification>
      `);

      const closeButton = element.shadowRoot!.querySelector('.notification-close');
      expect(closeButton).toBeDefined();
    });

    it('should hide close button when not closable', async () => {
      element = await fixture<LithNotification>(html`<lith-notification></lith-notification>`);
      element.closable = false;
      await element.updateComplete;

      const closeButton = element.shadowRoot!.querySelector('.notification-close');
      expect(closeButton).toBeNull();
    });

    it('should emit close event when close button clicked', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification closable></lith-notification>
      `);

      const closeSpy = vi.fn();
      element.addEventListener('lith-notification-close', closeSpy);

      const closeButton = element.shadowRoot!.querySelector(
        '.notification-close'
      ) as HTMLButtonElement;
      closeButton.click();

      // Wait for animation
      await waitUntil(() => element.hasAttribute('data-closing'));
      await new Promise((resolve) => setTimeout(resolve, 250));

      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should add closing attribute during close animation', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification closable></lith-notification>
      `);

      const closeButton = element.shadowRoot!.querySelector(
        '.notification-close'
      ) as HTMLButtonElement;
      closeButton.click();

      expect(element.hasAttribute('data-closing')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification type="error" title="Error"></lith-notification>
      `);

      const container = element.shadowRoot!.querySelector('.notification-container');
      expect(container?.getAttribute('role')).toBe('alert');
      expect(container?.getAttribute('aria-live')).toBe('assertive');
    });

    it('should use polite aria-live for non-error types', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification type="info" title="Info"></lith-notification>
      `);

      const container = element.shadowRoot!.querySelector('.notification-container');
      expect(container?.getAttribute('aria-live')).toBe('polite');
    });

    it('should have accessible close button', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification closable></lith-notification>
      `);

      const closeButton = element.shadowRoot!.querySelector(
        '.notification-close'
      ) as HTMLButtonElement;
      expect(closeButton.getAttribute('aria-label')).toBe('Close notification');
      expect(closeButton.getAttribute('title')).toBe('Close');
    });
  });

  describe('Animation', () => {
    it('should apply animation class when animated is true', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification animated></lith-notification>
      `);

      expect(element.hasAttribute('animated')).toBe(true);
    });

    it('should not apply animation class when animated is false', async () => {
      element = await fixture<LithNotification>(html`<lith-notification></lith-notification>`);
      element.animated = false;
      await element.updateComplete;

      expect(element.hasAttribute('animated')).toBe(false);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle notification with all features', async () => {
      element = await fixture<LithNotification>(html`
        <lith-notification type="warning" title="System Update" icon="⚠️">
          <p>A system update is available. Please save your work before updating.</p>
          <div slot="actions">
            <button id="update-now">Update Now</button>
            <button id="remind-later">Remind Me Later</button>
          </div>
        </lith-notification>
      `);

      // Check title
      const title = element.shadowRoot!.querySelector('.notification-title');
      expect(title?.textContent).toBe('System Update');

      // Check content
      const content = element.querySelector('p');
      expect(content?.textContent).toContain('system update is available');

      // Check actions
      const updateButton = element.querySelector('#update-now') as HTMLButtonElement;
      const remindButton = element.querySelector('#remind-later') as HTMLButtonElement;
      expect(updateButton).toBeDefined();
      expect(remindButton).toBeDefined();

      // Check type styling
      expect(element.getAttribute('type')).toBe('warning');
    });

    it('should work as a standalone component', async () => {
      const container = await fixture(html`
        <div>
          <lith-notification type="success" title="Upload Complete">
            Your file has been uploaded successfully.
          </lith-notification>
        </div>
      `);

      const notification = container.querySelector('lith-notification');
      expect(notification).toBeDefined();
      expect(notification?.title).toBe('Upload Complete');
    });
  });
});
