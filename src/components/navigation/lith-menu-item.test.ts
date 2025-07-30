import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-menu-item.js';
import type { LithMenuItem } from './lith-menu-item.js';

describe('LithMenuItem', () => {
  let element: LithMenuItem;

  beforeEach(async () => {
    element = await fixture(html` <lith-menu-item value="test-item">Test Item</lith-menu-item> `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.value).toBe('test-item');
      expect(element.href).toBe('');
      expect(element.target).toBe('');
      expect(element.disabled).toBe(false);
      expect(element.type).toBe('button');
    });

    it('should render as button by default', () => {
      const button = element.shadowRoot?.querySelector('button');
      const link = element.shadowRoot?.querySelector('a');

      expect(button).toBeDefined();
      expect(link).toBeNull();
    });

    it('should render as link when href is provided', async () => {
      element.href = '/test';
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      const link = element.shadowRoot?.querySelector('a');

      expect(button).toBeNull();
      expect(link).toBeDefined();
      expect(link?.getAttribute('href')).toBe('/test');
    });

    it('should render as button when href is provided but disabled', async () => {
      element.href = '/test';
      element.disabled = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      const link = element.shadowRoot?.querySelector('a');

      expect(button).toBeDefined();
      expect(link).toBeNull();
    });

    it('should set target attribute on link', async () => {
      element.href = '/test';
      element.target = '_blank';
      await element.updateComplete;

      const link = element.shadowRoot?.querySelector('a');
      expect(link?.getAttribute('target')).toBe('_blank');
    });
  });

  describe('Properties', () => {
    it('should reflect disabled property', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);
      const button = element.shadowRoot?.querySelector('button');
      expect(button?.disabled).toBe(true);
    });

    it('should update value property', async () => {
      element.value = 'new-value';
      await element.updateComplete;

      expect(element.value).toBe('new-value');
    });

    it('should update href property', async () => {
      element.href = 'https://example.com';
      await element.updateComplete;

      expect(element.href).toBe('https://example.com');
      const link = element.shadowRoot?.querySelector('a');
      expect(link?.getAttribute('href')).toBe('https://example.com');
    });

    it('should update target property', async () => {
      element.href = '/test';
      element.target = '_self';
      await element.updateComplete;

      expect(element.target).toBe('_self');
      const link = element.shadowRoot?.querySelector('a');
      expect(link?.getAttribute('target')).toBe('_self');
    });

    it('should update type property', async () => {
      element.type = 'link';
      await element.updateComplete;

      expect(element.type).toBe('link');
    });
  });

  describe('Interactions', () => {
    it('should emit click event when clicked', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('lith-menu-item-click', clickSpy);

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      button.click();

      expect(clickSpy).toHaveBeenCalledOnce();
      expect(clickSpy.mock.calls[0][0].detail).toEqual({
        value: 'test-item',
        href: '',
        target: '',
        item: element,
      });
    });

    it('should emit click event with href and target', async () => {
      element.href = '/test';
      element.target = '_blank';
      await element.updateComplete;

      const clickSpy = vi.fn();
      element.addEventListener('lith-menu-item-click', clickSpy);

      const link = element.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      link.click();

      expect(clickSpy).toHaveBeenCalledOnce();
      expect(clickSpy.mock.calls[0][0].detail).toEqual({
        value: 'test-item',
        href: '/test',
        target: '_blank',
        item: element,
      });
    });

    it('should not emit click event when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const clickSpy = vi.fn();
      element.addEventListener('lith-menu-item-click', clickSpy);

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      button.click();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it.skip('should prevent default when disabled and clicked', async () => {
      element.disabled = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

      button.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalledOnce();
      expect(stopPropagationSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should emit click event on Enter key', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('lith-menu-item-click', clickSpy);

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(clickSpy).toHaveBeenCalledOnce();
    });

    it('should emit click event on Space key', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('lith-menu-item-click', clickSpy);

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(clickSpy).toHaveBeenCalledOnce();
    });

    it('should not emit click event on other keys', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('lith-menu-item-click', clickSpy);

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not handle keyboard events when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const clickSpy = vi.fn();
      element.addEventListener('lith-menu-item-click', clickSpy);

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should focus internal button when element.focus() is called', () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      const focusSpy = vi.spyOn(button, 'focus');

      element.focus();

      expect(focusSpy).toHaveBeenCalledOnce();
    });

    it('should focus internal link when element.focus() is called and rendered as link', async () => {
      element.href = '/test';
      await element.updateComplete;

      const link = element.shadowRoot?.querySelector('a') as HTMLAnchorElement;
      const focusSpy = vi.spyOn(link, 'focus');

      element.focus();

      expect(focusSpy).toHaveBeenCalledOnce();
    });

    it('should blur internal button when element.blur() is called', () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      const blurSpy = vi.spyOn(button, 'blur');

      element.blur();

      expect(blurSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Programmatic Click', () => {
    it('should trigger click when element.click() is called', () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      const clickSpy = vi.spyOn(button, 'click');

      element.click();

      expect(clickSpy).toHaveBeenCalledOnce();
    });

    it('should not trigger click when disabled and element.click() is called', async () => {
      element.disabled = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      const clickSpy = vi.spyOn(button, 'click');

      element.click();

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should set proper ARIA attributes on connection', () => {
      expect(element.getAttribute('role')).toBe('menuitem');
      expect(element.getAttribute('tabindex')).toBe('-1');
    });

    it('should render with proper button attributes', () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(button.type).toBe('button');
    });
  });

  describe('Slots', () => {
    it('should render icon slot', async () => {
      const elementWithIcon = await fixture(html`
        <lith-menu-item value="test">
          <span slot="icon">🔥</span>
          Test Item
        </lith-menu-item>
      `);

      const iconSlot = elementWithIcon.shadowRoot?.querySelector('slot[name="icon"]');
      expect(iconSlot).toBeDefined();
    });

    it('should render suffix slot', async () => {
      const elementWithSuffix = await fixture(html`
        <lith-menu-item value="test">
          Test Item
          <span slot="suffix">→</span>
        </lith-menu-item>
      `);

      const suffixSlot = elementWithSuffix.shadowRoot?.querySelector('slot[name="suffix"]');
      expect(suffixSlot).toBeDefined();
    });

    it('should render default slot for content', () => {
      const defaultSlot = element.shadowRoot?.querySelector('slot:not([name])');
      expect(defaultSlot).toBeDefined();
    });
  });

  describe('CSS Parts', () => {
    it('should expose CSS parts', () => {
      const button = element.shadowRoot?.querySelector('[part="base"]');
      const icon = element.shadowRoot?.querySelector('[part="icon"]');
      const content = element.shadowRoot?.querySelector('[part="content"]');
      const label = element.shadowRoot?.querySelector('[part="label"]');
      const suffix = element.shadowRoot?.querySelector('[part="suffix"]');

      expect(button).toBeDefined();
      expect(icon).toBeDefined();
      expect(content).toBeDefined();
      expect(label).toBeDefined();
      expect(suffix).toBeDefined();
    });
  });
});
