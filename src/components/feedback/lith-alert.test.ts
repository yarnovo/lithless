import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-alert.js';
import type { LithAlert } from './lith-alert.js';

describe('LithAlert', () => {
  let element: LithAlert;

  beforeEach(async () => {
    element = await fixture(html`<lith-alert></lith-alert>`);
  });

  describe('Basic functionality', () => {
    it('should render with default properties', () => {
      expect(element.variant).toBe('default');
      expect(element.title).toBe('');
      expect(element.closable).toBe(false);
    });

    it('should have correct role and aria attributes', () => {
      const container = element.shadowRoot?.querySelector('[role="alert"]');
      expect(container).toBeTruthy();
      expect(container?.getAttribute('aria-live')).toBe('polite');
    });

    it('should reflect variant attribute', async () => {
      element.variant = 'destructive';
      await element.updateComplete;
      expect(element.getAttribute('variant')).toBe('destructive');
    });

    it('should reflect closable attribute', async () => {
      element.closable = true;
      await element.updateComplete;
      expect(element.hasAttribute('closable')).toBe(true);
    });
  });

  describe('Content rendering', () => {
    it('should render title when provided', async () => {
      element.title = 'Test Title';
      await element.updateComplete;

      const titleElement = element.shadowRoot?.querySelector('[part="title"]');
      expect(titleElement?.textContent?.trim()).toBe('Test Title');
    });

    it('should render title from slot', async () => {
      element = await fixture(html`
        <lith-alert>
          <div slot="title">Slot Title</div>
        </lith-alert>
      `);

      const titleElement = element.shadowRoot?.querySelector('[part="title"]');
      expect(titleElement).toBeTruthy();
    });

    it('should render main content', async () => {
      element = await fixture(html` <lith-alert>Main content text</lith-alert> `);

      const descriptionElement = element.shadowRoot?.querySelector('[part="description"]');
      expect(descriptionElement).toBeTruthy();
    });

    it('should render icon slot', async () => {
      element = await fixture(html`
        <lith-alert>
          <div slot="icon">🔔</div>
          Content
        </lith-alert>
      `);

      const iconElement = element.shadowRoot?.querySelector('[part="icon"]');
      expect(iconElement).toBeTruthy();
    });

    it('should render default icon for variants', async () => {
      element.variant = 'destructive';
      await element.updateComplete;

      const iconElement = element.shadowRoot?.querySelector('[part="icon"]');
      expect(iconElement).toBeTruthy();

      // Should contain SVG for destructive variant
      const svg = iconElement?.querySelector('svg');
      expect(svg).toBeTruthy();
    });
  });

  describe('Closable functionality', () => {
    beforeEach(async () => {
      element.closable = true;
      await element.updateComplete;
    });

    it('should render close button when closable', () => {
      const closeButton = element.shadowRoot?.querySelector('[part="close"]');
      expect(closeButton).toBeTruthy();
      expect(closeButton?.getAttribute('aria-label')).toBe('Close alert');
      expect(closeButton?.getAttribute('title')).toBe('Close');
    });

    it('should not render close button when not closable', async () => {
      element.closable = false;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('[part="close"]');
      expect(closeButton).toBeFalsy();
    });

    it('should emit close event when close button clicked', async () => {
      let eventFired = false;
      element.addEventListener('lith-alert-close', () => {
        eventFired = true;
      });

      const closeButton = element.shadowRoot?.querySelector('[part="close"]') as HTMLButtonElement;
      closeButton?.click();

      expect(eventFired).toBe(true);
    });

    it('should have proper styling when closable', async () => {
      expect(element.hasAttribute('closable')).toBe(true);
    });
  });

  describe('Variants', () => {
    it('should apply default variant styling', async () => {
      element.variant = 'default';
      await element.updateComplete;

      expect(element.getAttribute('variant')).toBe('default');
    });

    it('should apply destructive variant styling', async () => {
      element.variant = 'destructive';
      await element.updateComplete;

      expect(element.getAttribute('variant')).toBe('destructive');
    });
  });

  describe('CSS Parts', () => {
    it('should expose container part', () => {
      const container = element.shadowRoot?.querySelector('[part="container"]');
      expect(container).toBeTruthy();
    });

    it('should expose content part', () => {
      const content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeTruthy();
    });

    it('should expose icon part when icon present', async () => {
      element = await fixture(html`
        <lith-alert>
          <div slot="icon">🔔</div>
        </lith-alert>
      `);

      const icon = element.shadowRoot?.querySelector('[part="icon"]');
      expect(icon).toBeTruthy();
    });

    it('should expose title part when title present', async () => {
      element.title = 'Test Title';
      await element.updateComplete;

      const title = element.shadowRoot?.querySelector('[part="title"]');
      expect(title).toBeTruthy();
    });

    it('should expose description part', async () => {
      element = await fixture(html`<lith-alert>Content</lith-alert>`);

      const description = element.shadowRoot?.querySelector('[part="description"]');
      expect(description).toBeTruthy();
    });

    it('should expose close part when closable', async () => {
      element.closable = true;
      await element.updateComplete;

      const close = element.shadowRoot?.querySelector('[part="close"]');
      expect(close).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have alert role', () => {
      const container = element.shadowRoot?.querySelector('[role="alert"]');
      expect(container).toBeTruthy();
    });

    it('should have aria-live attribute', () => {
      const container = element.shadowRoot?.querySelector('[aria-live="polite"]');
      expect(container).toBeTruthy();
    });

    it('should have proper close button accessibility', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('[part="close"]');
      expect(closeButton?.getAttribute('aria-label')).toBe('Close alert');
      expect(closeButton?.getAttribute('title')).toBe('Close');
    });
  });

  describe('Event handling', () => {
    it('should emit lith-alert-close event', async () => {
      element.closable = true;
      await element.updateComplete;

      let eventDetail: CustomEvent | null = null;
      element.addEventListener('lith-alert-close', (e) => {
        eventDetail = e;
      });

      const closeButton = element.shadowRoot?.querySelector('[part="close"]') as HTMLButtonElement;
      closeButton?.click();

      expect(eventDetail).toBeTruthy();
      expect(eventDetail.bubbles).toBe(true);
      expect(eventDetail.composed).toBe(true);
    });
  });

  describe('Slot detection', () => {
    it('should detect icon slot content', async () => {
      element = await fixture(html`
        <lith-alert>
          <div slot="icon">🔔</div>
          Content
        </lith-alert>
      `);

      const iconElement = element.shadowRoot?.querySelector('[part="icon"]');
      expect(iconElement).toBeTruthy();
    });

    it('should detect title slot content', async () => {
      element = await fixture(html`
        <lith-alert>
          <div slot="title">Title</div>
          Content
        </lith-alert>
      `);

      const titleElement = element.shadowRoot?.querySelector('[part="title"]');
      expect(titleElement).toBeTruthy();
    });

    it('should detect main content', async () => {
      element = await fixture(html` <lith-alert>Main content</lith-alert> `);

      const descriptionElement = element.shadowRoot?.querySelector('[part="description"]');
      expect(descriptionElement).toBeTruthy();
    });

    it('should not render empty slots', async () => {
      element = await fixture(html`
        <lith-alert title="Title">
          <div slot="icon"></div>
        </lith-alert>
      `);

      // Should not render icon part if slot is empty
      const iconElement = element.shadowRoot?.querySelector('[part="icon"]');
      expect(iconElement).toBeFalsy();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content gracefully', async () => {
      element = await fixture(html`<lith-alert></lith-alert>`);

      // Should still render basic structure
      const container = element.shadowRoot?.querySelector('[part="container"]');
      expect(container).toBeTruthy();
    });

    it('should handle both title prop and slot', async () => {
      element = await fixture(html`
        <lith-alert title="Prop Title">
          <div slot="title">Slot Title</div>
        </lith-alert>
      `);

      const titleElement = element.shadowRoot?.querySelector('[part="title"]');
      expect(titleElement).toBeTruthy();
      // Slot content should take precedence
      expect(titleElement?.textContent?.includes('Slot Title')).toBe(true);
    });
  });
});
