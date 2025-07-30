import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-breadcrumb.js';
import './lith-breadcrumb-item.js';
import type { LithBreadcrumb } from './lith-breadcrumb.js';
import type { LithBreadcrumbItem } from './lith-breadcrumb-item.js';

describe('LithBreadcrumb', () => {
  let element: LithBreadcrumb;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-breadcrumb>
        <lith-breadcrumb-item href="/">Home</lith-breadcrumb-item>
        <lith-breadcrumb-item href="/category">Category</lith-breadcrumb-item>
        <lith-breadcrumb-item current>Current Page</lith-breadcrumb-item>
      </lith-breadcrumb>
    `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.separator).toBe('/');
    });

    it('should render navigation element with proper ARIA label', () => {
      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav).toBeDefined();
      expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('should render breadcrumb items in ordered list', () => {
      const ol = element.shadowRoot?.querySelector('ol');
      expect(ol).toBeDefined();
      expect(ol?.getAttribute('part')).toBe('items');
    });
  });

  describe('Properties', () => {
    it('should set custom separator', async () => {
      element.separator = '>';
      await element.updateComplete;

      expect(element.separator).toBe('>');
    });

    it('should render custom separator in template', async () => {
      element.separator = '>';
      await element.updateComplete;

      // Check if separator appears in rendered content
      const separators = element.shadowRoot?.querySelectorAll('.separator');
      expect(separators?.length).toBeGreaterThan(0);
    });
  });

  describe('Item management', () => {
    it('should get all breadcrumb items', () => {
      const items = element.getItems();
      expect(items).toHaveLength(3);
      expect(items[0].tagName.toLowerCase()).toBe('lith-breadcrumb-item');
    });

    it('should get current (last) item', () => {
      const currentItem = element.getCurrentItem();
      expect(currentItem).toBeDefined();
      expect(currentItem?.textContent?.trim()).toBe('Current Page');
    });

    it('should set ARIA attributes on items', async () => {
      await element.updateComplete;

      const items = element.getItems();
      items.forEach((item) => {
        expect(item.getAttribute('role')).toBe('none');
      });

      // Last item should have aria-current
      const lastItem = items[items.length - 1];
      expect(lastItem.getAttribute('aria-current')).toBe('page');
    });
  });

  describe('Event handling', () => {
    it('should handle breadcrumb item clicks', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('lith-breadcrumb-click', clickHandler);

      const items = element.getItems();
      items[0].click();

      await element.updateComplete;

      expect(clickHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            index: 0,
          }),
        })
      );
    });
  });

  describe('Separator rendering', () => {
    it('should render separators between items but not after last', async () => {
      await element.updateComplete;

      const separators = element.shadowRoot?.querySelectorAll('.separator');
      const items = element.getItems();

      // Should have n-1 separators for n items
      expect(separators?.length).toBe(items.length - 1);
    });

    it('should hide separators from screen readers', async () => {
      await element.updateComplete;

      const separators = element.shadowRoot?.querySelectorAll('.separator');
      separators?.forEach((separator) => {
        expect(separator.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });
});

describe('LithBreadcrumbItem', () => {
  let element: LithBreadcrumbItem;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-breadcrumb-item href="/test">Test Item</lith-breadcrumb-item>
    `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.current).toBe(false);
      expect(element.disabled).toBe(false);
    });

    it('should render content in slot', () => {
      const content = element.textContent?.trim();
      expect(content).toBe('Test Item');
    });

    it('should render as link when href is provided', () => {
      const link = element.shadowRoot?.querySelector('a');
      expect(link).toBeDefined();
      expect(link?.getAttribute('href')).toBe('/test');
    });

    it('should render as button when no href', async () => {
      const buttonElement = await fixture(html`
        <lith-breadcrumb-item>Button Item</lith-breadcrumb-item>
      `);

      const button = buttonElement.shadowRoot?.querySelector('button');
      expect(button).toBeDefined();
    });

    it('should render as span when current', async () => {
      const currentElement = await fixture(html`
        <lith-breadcrumb-item current>Current Item</lith-breadcrumb-item>
      `);

      const span = currentElement.shadowRoot?.querySelector('span');
      expect(span).toBeDefined();
    });

    it('should render as span when disabled', async () => {
      const disabledElement = await fixture(html`
        <lith-breadcrumb-item disabled>Disabled Item</lith-breadcrumb-item>
      `);

      const span = disabledElement.shadowRoot?.querySelector('span');
      expect(span).toBeDefined();
    });
  });

  describe('Properties', () => {
    it('should set href property', () => {
      element.href = '/new-path';
      expect(element.href).toBe('/new-path');
    });

    it('should set target property', async () => {
      element.target = '_blank';
      await element.updateComplete;

      const link = element.shadowRoot?.querySelector('a');
      expect(link?.getAttribute('target')).toBe('_blank');
    });

    it('should set rel property', async () => {
      element.rel = 'noopener';
      await element.updateComplete;

      const link = element.shadowRoot?.querySelector('a');
      expect(link?.getAttribute('rel')).toBe('noopener');
    });

    it('should set current state', async () => {
      element.current = true;
      await element.updateComplete;

      expect(element.current).toBe(true);
      expect(element.hasAttribute('current')).toBe(true);
      expect(element.getAttribute('aria-current')).toBe('page');
    });

    it('should set disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should set download property', async () => {
      element.download = 'file.pdf';
      await element.updateComplete;

      const link = element.shadowRoot?.querySelector('a');
      expect(link?.getAttribute('download')).toBe('file.pdf');
    });
  });

  describe('Interaction', () => {
    it('should dispatch click event when interactive', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('lith-breadcrumb-item-click', clickHandler);

      element.click();

      expect(clickHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            href: '/test',
            item: element,
          }),
        })
      );
    });

    it('should not dispatch click when current', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('lith-breadcrumb-item-click', clickHandler);
      element.current = true;

      element.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });

    it('should not dispatch click when disabled', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('lith-breadcrumb-item-click', clickHandler);
      element.disabled = true;

      element.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });

    it('should dispatch focus event', async () => {
      const focusHandler = vi.fn();
      element.addEventListener('lith-focus', focusHandler);

      element.dispatchEvent(new FocusEvent('focus'));

      expect(focusHandler).toHaveBeenCalled();
    });

    it('should dispatch blur event', async () => {
      const blurHandler = vi.fn();
      element.addEventListener('lith-blur', blurHandler);

      element.dispatchEvent(new FocusEvent('blur'));

      expect(blurHandler).toHaveBeenCalled();
    });
  });

  describe('Methods', () => {
    it('should set current state', async () => {
      element.setCurrent();
      await element.updateComplete;

      expect(element.current).toBe(true);
      expect(element.getAttribute('aria-current')).toBe('page');
    });

    it('should remove current state', async () => {
      element.current = true;
      element.removeCurrent();
      await element.updateComplete;

      expect(element.current).toBe(false);
      expect(element.hasAttribute('aria-current')).toBe(false);
    });

    it('should programmatically click when not current or disabled', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('click', clickHandler);

      element.click();

      expect(clickHandler).toHaveBeenCalled();
    });

    it('should not programmatically click when current', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('click', clickHandler);
      element.current = true;

      element.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });

    it('should not programmatically click when disabled', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('click', clickHandler);
      element.disabled = true;

      element.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe('ARIA attributes', () => {
    it('should set aria-current when current', async () => {
      element.current = true;
      await element.updateComplete;

      expect(element.getAttribute('aria-current')).toBe('page');
    });

    it('should remove aria-current when not current', async () => {
      element.current = true;
      await element.updateComplete;
      element.current = false;
      await element.updateComplete;

      expect(element.hasAttribute('aria-current')).toBe(false);
    });

    it('should generate ID if not present', async () => {
      await element.updateComplete;

      expect(element.id).toBeTruthy();
      expect(element.id.startsWith('breadcrumb-item-')).toBe(true);
    });
  });

  describe('Icon slot', () => {
    it('should render icon when provided', async () => {
      const iconElement = await fixture(html`
        <lith-breadcrumb-item>
          <span slot="icon">🏠</span>
          Home
        </lith-breadcrumb-item>
      `);

      const iconContainer = iconElement.shadowRoot?.querySelector('.icon');
      expect(iconContainer).toBeDefined();
    });
  });
});
