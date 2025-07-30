import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html, oneEvent } from '@open-wc/testing';
import { LithAccordion } from './lith-accordion.js';
import { LithAccordionItem } from './lith-accordion-item.js';
import './lith-accordion.js';
import './lith-accordion-item.js';

describe('LithAccordion', () => {
  let accordion: LithAccordion;

  beforeEach(async () => {
    accordion = await fixture(html`
      <lith-accordion>
        <lith-accordion-item value="item-1">
          <span slot="trigger">Item 1</span>
          <p>Content 1</p>
        </lith-accordion-item>
        <lith-accordion-item value="item-2">
          <span slot="trigger">Item 2</span>
          <p>Content 2</p>
        </lith-accordion-item>
        <lith-accordion-item value="item-3">
          <span slot="trigger">Item 3</span>
          <p>Content 3</p>
        </lith-accordion-item>
      </lith-accordion>
    `);
    await accordion.updateComplete;
  });

  describe('Properties', () => {
    it('should have default properties', () => {
      expect(accordion.type).toBe('single');
      expect(accordion.collapsible).toBe('false');
      expect(accordion.defaultValue).toBeUndefined();
      expect(accordion.value).toBeUndefined();
    });

    it('should reflect type property', async () => {
      accordion.type = 'multiple';
      await accordion.updateComplete;
      expect(accordion.type).toBe('multiple');
    });

    it('should handle collapsible property', async () => {
      accordion.collapsible = 'true';
      await accordion.updateComplete;
      expect(accordion.collapsible).toBe('true');
    });
  });

  describe('Single Mode', () => {
    beforeEach(async () => {
      accordion.type = 'single';
      await accordion.updateComplete;
    });

    it('should open only one item at a time', async () => {
      const items = accordion.querySelectorAll('lith-accordion-item');

      // 打开第一个项目
      accordion.openItem('item-1');
      await accordion.updateComplete;

      expect(items[0].open).toBe(true);
      expect(items[1].open).toBe(false);
      expect(items[2].open).toBe(false);

      // 打开第二个项目，应该关闭第一个
      accordion.openItem('item-2');
      await accordion.updateComplete;

      expect(items[0].open).toBe(false);
      expect(items[1].open).toBe(true);
      expect(items[2].open).toBe(false);
    });

    it('should not allow closing in non-collapsible mode', async () => {
      accordion.collapsible = 'false';
      await accordion.updateComplete;

      // 打开一个项目
      accordion.openItem('item-1');
      await accordion.updateComplete;

      const items = accordion.querySelectorAll('lith-accordion-item');
      expect(items[0].open).toBe(true);

      // 尝试关闭，应该不生效
      accordion.closeItem('item-1');
      await accordion.updateComplete;

      expect(items[0].open).toBe(true);
    });

    it('should allow closing in collapsible mode', async () => {
      accordion.collapsible = 'true';
      await accordion.updateComplete;

      // 打开一个项目
      accordion.openItem('item-1');
      await accordion.updateComplete;

      const items = accordion.querySelectorAll('lith-accordion-item');
      expect(items[0].open).toBe(true);

      // 关闭项目
      accordion.closeItem('item-1');
      await accordion.updateComplete;

      expect(items[0].open).toBe(false);
    });
  });

  describe('Multiple Mode', () => {
    beforeEach(async () => {
      accordion.type = 'multiple';
      await accordion.updateComplete;
    });

    it('should allow multiple items to be open', async () => {
      const items = accordion.querySelectorAll('lith-accordion-item');

      // 打开多个项目
      accordion.openItem('item-1');
      accordion.openItem('item-2');
      await accordion.updateComplete;

      expect(items[0].open).toBe(true);
      expect(items[1].open).toBe(true);
      expect(items[2].open).toBe(false);
    });

    it('should allow closing items independently', async () => {
      const items = accordion.querySelectorAll('lith-accordion-item');

      // 打开多个项目
      accordion.openItem('item-1');
      accordion.openItem('item-2');
      accordion.openItem('item-3');
      await accordion.updateComplete;

      expect(items[0].open).toBe(true);
      expect(items[1].open).toBe(true);
      expect(items[2].open).toBe(true);

      // 关闭其中一个
      accordion.closeItem('item-2');
      await accordion.updateComplete;

      expect(items[0].open).toBe(true);
      expect(items[1].open).toBe(false);
      expect(items[2].open).toBe(true);
    });
  });

  describe('Default Value', () => {
    it('should open default item on initialization', async () => {
      const accordionWithDefault = await fixture(html`
        <lith-accordion default-value="item-2">
          <lith-accordion-item value="item-1">
            <span slot="trigger">Item 1</span>
            <p>Content 1</p>
          </lith-accordion-item>
          <lith-accordion-item value="item-2">
            <span slot="trigger">Item 2</span>
            <p>Content 2</p>
          </lith-accordion-item>
        </lith-accordion>
      `);
      await (accordionWithDefault as LithAccordion).updateComplete;

      const items = accordionWithDefault.querySelectorAll('lith-accordion-item');
      expect(items[0].open).toBe(false);
      expect(items[1].open).toBe(true);
    });
  });

  describe('Controlled Mode', () => {
    it('should respond to value changes', async () => {
      const items = accordion.querySelectorAll('lith-accordion-item');

      // 设置 value
      accordion.value = 'item-2';
      await accordion.updateComplete;

      expect(items[0].open).toBe(false);
      expect(items[1].open).toBe(true);
      expect(items[2].open).toBe(false);

      // 改变 value
      accordion.value = 'item-3';
      await accordion.updateComplete;

      expect(items[0].open).toBe(false);
      expect(items[1].open).toBe(false);
      expect(items[2].open).toBe(true);
    });
  });

  describe('Events', () => {
    it('should dispatch lith-change event when item is opened', async () => {
      const eventPromise = oneEvent(accordion, 'lith-change');

      accordion.openItem('item-1');

      const event = await eventPromise;
      expect(event.detail.openItems).toEqual(['item-1']);
      expect(event.detail.changedItem).toBe('item-1');
      expect(event.detail.action).toBe('open');
    });

    it('should dispatch lith-change event when item is closed', async () => {
      accordion.type = 'multiple';
      accordion.openItem('item-1');
      await accordion.updateComplete;

      const eventPromise = oneEvent(accordion, 'lith-change');

      accordion.closeItem('item-1');

      const event = await eventPromise;
      expect(event.detail.openItems).toEqual([]);
      expect(event.detail.changedItem).toBe('item-1');
      expect(event.detail.action).toBe('close');
    });
  });

  describe('API Methods', () => {
    it('should toggle item state', async () => {
      const items = accordion.querySelectorAll('lith-accordion-item');

      // 切换关闭的项目
      accordion.toggleItem('item-1');
      await accordion.updateComplete;
      expect(items[0].open).toBe(true);

      // 再次切换
      accordion.type = 'multiple'; // 允许关闭
      accordion.toggleItem('item-1');
      await accordion.updateComplete;
      expect(items[0].open).toBe(false);
    });

    it('should return open items', async () => {
      accordion.type = 'multiple';

      accordion.openItem('item-1');
      accordion.openItem('item-3');
      await accordion.updateComplete;

      const openItems = accordion.getOpenItems();
      expect(openItems).toEqual(['item-1', 'item-3']);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on items', async () => {
      const items = accordion.querySelectorAll('lith-accordion-item');

      items.forEach((item) => {
        const button = item.shadowRoot?.querySelector('button');
        const content = item.shadowRoot?.querySelector('[role="region"]');

        expect(button).toBeTruthy();
        expect(content).toBeTruthy();
        expect(button?.getAttribute('aria-expanded')).toBe('false');
        expect(content?.getAttribute('aria-hidden')).toBe('true');
      });

      // 打开一个项目
      accordion.openItem('item-1');
      await accordion.updateComplete;

      const firstItem = items[0];
      const firstButton = firstItem.shadowRoot?.querySelector('button');
      const firstContent = firstItem.shadowRoot?.querySelector('[role="region"]');

      expect(firstButton?.getAttribute('aria-expanded')).toBe('true');
      expect(firstContent?.getAttribute('aria-hidden')).toBe('false');
    });
  });
});

describe('LithAccordionItem', () => {
  let item: LithAccordionItem;

  beforeEach(async () => {
    item = await fixture(html`
      <lith-accordion-item value="test-item">
        <span slot="trigger">Test Item</span>
        <p>Test content</p>
      </lith-accordion-item>
    `);
    await item.updateComplete;
  });

  describe('Properties', () => {
    it('should have required value property', () => {
      expect(item.value).toBe('test-item');
    });

    it('should have default properties', () => {
      expect(item.open).toBe(false);
      expect(item.disabled).toBe(false);
    });

    it('should reflect open state', async () => {
      item.open = true;
      await item.updateComplete;
      expect(item.hasAttribute('open')).toBe(true);
    });

    it('should reflect disabled state', async () => {
      item.disabled = true;
      await item.updateComplete;
      expect(item.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('User Interaction', () => {
    it('should dispatch toggle event when clicked', async () => {
      const button = item.shadowRoot?.querySelector('button');
      expect(button).toBeTruthy();

      const eventPromise = oneEvent(item, 'lith-accordion-item-toggle');

      button?.click();

      const event = await eventPromise;
      expect(event.detail.value).toBe('test-item');
      expect(event.detail.open).toBe(true);
    });

    it('should handle keyboard events', async () => {
      const button = item.shadowRoot?.querySelector('button');
      expect(button).toBeTruthy();

      const eventPromise = oneEvent(item, 'lith-accordion-item-toggle');

      // 模拟 Enter 键
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      button?.dispatchEvent(enterEvent);

      const event = await eventPromise;
      expect(event.detail.value).toBe('test-item');
      expect(event.detail.open).toBe(true);
    });

    it('should handle space key', async () => {
      const button = item.shadowRoot?.querySelector('button');
      expect(button).toBeTruthy();

      const eventPromise = oneEvent(item, 'lith-accordion-item-toggle');

      // 模拟空格键
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      button?.dispatchEvent(spaceEvent);

      const event = await eventPromise;
      expect(event.detail.value).toBe('test-item');
      expect(event.detail.open).toBe(true);
    });

    it('should not respond when disabled', async () => {
      item.disabled = true;
      await item.updateComplete;

      const button = item.shadowRoot?.querySelector('button');

      let eventFired = false;
      item.addEventListener('lith-accordion-item-toggle', () => {
        eventFired = true;
      });

      button?.click();

      // 等待一下看是否触发事件
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(eventFired).toBe(false);
    });
  });

  describe('Content Animation', () => {
    it('should have proper content classes', async () => {
      const content = item.shadowRoot?.querySelector('.content');
      expect(content).toBeTruthy();
      expect(content?.classList.contains('closed')).toBe(true);
      expect(content?.classList.contains('open')).toBe(false);

      item.open = true;
      await item.updateComplete;

      expect(content?.classList.contains('closed')).toBe(false);
      expect(content?.classList.contains('open')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const button = item.shadowRoot?.querySelector('button');
      const content = item.shadowRoot?.querySelector('[role="region"]');

      expect(button?.getAttribute('aria-expanded')).toBe('false');
      expect(button?.getAttribute('aria-disabled')).toBe('false');
      expect(content?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should update ARIA attributes when state changes', async () => {
      const button = item.shadowRoot?.querySelector('button');
      const content = item.shadowRoot?.querySelector('[role="region"]');

      item.open = true;
      item.disabled = true;
      await item.updateComplete;

      expect(button?.getAttribute('aria-expanded')).toBe('true');
      expect(button?.getAttribute('aria-disabled')).toBe('true');
      expect(content?.getAttribute('aria-hidden')).toBe('false');
    });
  });

  describe('Warning for missing value', () => {
    it('should warn when value is not provided', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await fixture(html`
        <lith-accordion-item>
          <span slot="trigger">No Value</span>
          <p>Content</p>
        </lith-accordion-item>
      `);

      expect(consoleSpy).toHaveBeenCalledWith('lith-accordion-item: value property is required');

      consoleSpy.mockRestore();
    });
  });
});
