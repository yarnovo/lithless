import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LithBadge } from './lith-badge.js';
import './lith-badge.js';

describe('LithBadge', () => {
  let element: LithBadge;

  beforeEach(() => {
    element = document.createElement('lith-badge') as LithBadge;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('基础功能', () => {
    it('应该正确创建 badge 元素', () => {
      expect(element).toBeInstanceOf(LithBadge);
      expect(element.tagName.toLowerCase()).toBe('lith-badge');
    });

    it('应该正确显示插槽内容', async () => {
      element.innerHTML = 'Test Badge';
      await element.updateComplete;

      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('应该有正确的默认属性值', () => {
      expect(element.variant).toBe('default');
      expect(element.size).toBe('default');
      expect(element.dot).toBe(false);
      expect(element.interactive).toBe(false);
      expect(element.disabled).toBe(false);
    });
  });

  describe('variant 属性', () => {
    it('应该正确设置 default variant', async () => {
      element.variant = 'default';
      await element.updateComplete;
      expect(element.getAttribute('variant')).toBe('default');
    });

    it('应该正确设置 secondary variant', async () => {
      element.variant = 'secondary';
      await element.updateComplete;
      expect(element.getAttribute('variant')).toBe('secondary');
    });

    it('应该正确设置 destructive variant', async () => {
      element.variant = 'destructive';
      await element.updateComplete;
      expect(element.getAttribute('variant')).toBe('destructive');
    });

    it('应该正确设置 outline variant', async () => {
      element.variant = 'outline';
      await element.updateComplete;
      expect(element.getAttribute('variant')).toBe('outline');
    });
  });

  describe('size 属性', () => {
    it('应该正确设置 sm size', async () => {
      element.size = 'sm';
      await element.updateComplete;
      expect(element.getAttribute('size')).toBe('sm');
    });

    it('应该正确设置 lg size', async () => {
      element.size = 'lg';
      await element.updateComplete;
      expect(element.getAttribute('size')).toBe('lg');
    });
  });

  describe('dot 属性', () => {
    it('应该正确设置 dot 属性', async () => {
      element.dot = true;
      await element.updateComplete;
      expect(element.hasAttribute('dot')).toBe(true);
    });

    it('应该正确移除 dot 属性', async () => {
      element.dot = true;
      await element.updateComplete;
      element.dot = false;
      await element.updateComplete;
      expect(element.hasAttribute('dot')).toBe(false);
    });
  });

  describe('interactive 属性', () => {
    it('应该在 interactive 为 true 时设置 tabindex 和 role', async () => {
      element.interactive = true;
      await element.updateComplete;

      expect(element.getAttribute('tabindex')).toBe('0');
      expect(element.getAttribute('role')).toBe('button');
    });

    it('应该在 interactive 为 false 时移除 tabindex 和 role', async () => {
      element.interactive = true;
      await element.updateComplete;
      element.interactive = false;
      await element.updateComplete;

      expect(element.hasAttribute('tabindex')).toBe(false);
      expect(element.hasAttribute('role')).toBe(false);
    });

    it('应该在点击时触发 lith-badge-click 事件', async () => {
      element.interactive = true;
      await element.updateComplete;

      let eventTriggered = false;
      let eventDetail: CustomEvent['detail'] | null = null;

      element.addEventListener('lith-badge-click', (event: Event) => {
        eventTriggered = true;
        eventDetail = (event as CustomEvent).detail;
      });

      const slot = element.shadowRoot?.querySelector('slot');
      slot?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(eventTriggered).toBe(true);
      expect(eventDetail).toEqual({
        variant: element.variant,
        size: element.size,
      });
    });

    it('应该在按 Enter 键时触发点击事件', async () => {
      element.interactive = true;
      await element.updateComplete;

      let eventTriggered = false;

      element.addEventListener('lith-badge-click', () => {
        eventTriggered = true;
      });

      const slot = element.shadowRoot?.querySelector('slot');
      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      slot?.dispatchEvent(keyEvent);

      expect(eventTriggered).toBe(true);
    });

    it('应该在按空格键时触发点击事件', async () => {
      element.interactive = true;
      await element.updateComplete;

      let eventTriggered = false;

      element.addEventListener('lith-badge-click', () => {
        eventTriggered = true;
      });

      const slot = element.shadowRoot?.querySelector('slot');
      const keyEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      slot?.dispatchEvent(keyEvent);

      expect(eventTriggered).toBe(true);
    });
  });

  describe('disabled 属性', () => {
    it('应该在 disabled 为 true 时设置 tabindex 为 -1', async () => {
      element.interactive = true;
      element.disabled = true;
      await element.updateComplete;

      expect(element.getAttribute('tabindex')).toBe('-1');
    });

    it('应该在 disabled 为 true 时阻止点击事件', async () => {
      element.interactive = true;
      element.disabled = true;
      await element.updateComplete;

      let eventTriggered = false;

      element.addEventListener('lith-badge-click', () => {
        eventTriggered = true;
      });

      const slot = element.shadowRoot?.querySelector('slot');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      slot?.dispatchEvent(clickEvent);

      expect(eventTriggered).toBe(false);
    });

    it('应该在 disabled 为 true 时阻止键盘事件', async () => {
      element.interactive = true;
      element.disabled = true;
      await element.updateComplete;

      let eventTriggered = false;

      element.addEventListener('lith-badge-click', () => {
        eventTriggered = true;
      });

      const slot = element.shadowRoot?.querySelector('slot');
      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      slot?.dispatchEvent(keyEvent);

      expect(eventTriggered).toBe(false);
    });
  });

  describe('样式和外观', () => {
    it('应该应用正确的 CSS 自定义属性', () => {
      expect(element.shadowRoot?.adoptedStyleSheets).toBeDefined();
    });

    it('应该支持不同的变体样式', async () => {
      const variants = ['default', 'secondary', 'destructive', 'outline'] as const;

      for (const variant of variants) {
        element.variant = variant;
        await element.updateComplete;
        expect(element.getAttribute('variant')).toBe(variant);
      }
    });

    it('应该支持不同的尺寸样式', async () => {
      const sizes = ['sm', 'default', 'lg'] as const;

      for (const size of sizes) {
        element.size = size;
        await element.updateComplete;
        expect(element.getAttribute('size')).toBe(size);
      }
    });
  });

  describe('可访问性', () => {
    it('应该在 interactive 模式下具有正确的角色', async () => {
      element.interactive = true;
      await element.updateComplete;

      expect(element.getAttribute('role')).toBe('button');
    });

    it('应该在 disabled 状态下具有正确的 tabindex', async () => {
      element.interactive = true;
      element.disabled = true;
      await element.updateComplete;

      expect(element.getAttribute('tabindex')).toBe('-1');
    });

    it('应该支持键盘导航', async () => {
      element.interactive = true;
      await element.updateComplete;

      expect(element.getAttribute('tabindex')).toBe('0');
    });
  });
});
