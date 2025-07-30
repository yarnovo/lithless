import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '../lith-skeleton';
import type { LithSkeleton } from '../lith-skeleton';

describe('lith-skeleton', () => {
  let element: LithSkeleton;

  beforeEach(async () => {
    element = await fixture(html`<lith-skeleton></lith-skeleton>`);
  });

  describe('基本功能', () => {
    it('应该正确渲染', () => {
      expect(element).toBeDefined();
      expect(element.tagName.toLowerCase()).toBe('lith-skeleton');
    });

    it('应该有正确的默认属性值', () => {
      expect(element.variant).toBe('default');
      expect(element.width).toBe('');
      expect(element.height).toBe('');
      expect(element.noAnimation).toBe(false);
      expect(element.respectMotionPreference).toBe(true);
      expect(element.ariaLabel).toBe('Loading...');
    });

    it('应该渲染骨架屏部件', async () => {
      await element.updateComplete;

      const skeleton = element.shadowRoot?.querySelector('[part="skeleton"]');
      expect(skeleton).toBeTruthy();
      expect(skeleton?.getAttribute('role')).toBe('status');
      expect(skeleton?.getAttribute('aria-live')).toBe('polite');
      expect(skeleton?.getAttribute('aria-label')).toBe('Loading...');
    });
  });

  describe('变体支持', () => {
    it('应该支持 default 变体', async () => {
      element.variant = 'default';
      await element.updateComplete;

      expect(element.getAttribute('variant')).toBe('default');
    });

    it('应该支持 text 变体', async () => {
      element.variant = 'text';
      await element.updateComplete;

      expect(element.getAttribute('variant')).toBe('text');
    });

    it('应该支持 circular 变体', async () => {
      element.variant = 'circular';
      await element.updateComplete;

      expect(element.getAttribute('variant')).toBe('circular');
    });

    it('应该支持 rounded 变体', async () => {
      element.variant = 'rounded';
      await element.updateComplete;

      expect(element.getAttribute('variant')).toBe('rounded');
    });
  });

  describe('自定义尺寸', () => {
    it('应该支持自定义宽度', async () => {
      element.width = '200px';
      await element.updateComplete;

      const computedStyle = getComputedStyle(element);
      expect(computedStyle.getPropertyValue('--lith-skeleton-width')).toBe('200px');
    });

    it('应该支持自定义高度', async () => {
      element.height = '50px';
      await element.updateComplete;

      const computedStyle = getComputedStyle(element);
      expect(computedStyle.getPropertyValue('--lith-skeleton-height')).toBe('50px');
    });

    it('应该支持同时设置宽度和高度', async () => {
      element.width = '150px';
      element.height = '100px';
      await element.updateComplete;

      const computedStyle = getComputedStyle(element);
      expect(computedStyle.getPropertyValue('--lith-skeleton-width')).toBe('150px');
      expect(computedStyle.getPropertyValue('--lith-skeleton-height')).toBe('100px');
    });
  });

  describe('动画控制', () => {
    it('应该支持禁用动画', async () => {
      element.noAnimation = true;
      await element.updateComplete;

      expect(element.hasAttribute('no-animation')).toBe(true);
    });

    it('应该支持动画偏好设置', async () => {
      element.respectMotionPreference = false;
      await element.updateComplete;

      expect(element.hasAttribute('respect-motion-preference')).toBe(false);
    });
  });

  describe('可访问性', () => {
    it('应该有正确的 ARIA 属性', async () => {
      await element.updateComplete;

      const skeleton = element.shadowRoot?.querySelector('[part="skeleton"]');
      expect(skeleton?.getAttribute('role')).toBe('status');
      expect(skeleton?.getAttribute('aria-live')).toBe('polite');
      expect(skeleton?.getAttribute('aria-label')).toBe('Loading...');
    });

    it('应该支持自定义 aria-label', async () => {
      element.ariaLabel = 'Custom loading message';
      await element.updateComplete;

      const skeleton = element.shadowRoot?.querySelector('[part="skeleton"]');
      expect(skeleton?.getAttribute('aria-label')).toBe('Custom loading message');
    });
  });

  describe('属性反映', () => {
    it('variant 属性应该反映到 DOM', async () => {
      element.variant = 'circular';
      await element.updateComplete;

      expect(element.getAttribute('variant')).toBe('circular');
    });

    it('noAnimation 属性应该反映到 DOM', async () => {
      element.noAnimation = true;
      await element.updateComplete;

      expect(element.hasAttribute('no-animation')).toBe(true);
    });

    it('respectMotionPreference 属性应该反映到 DOM', async () => {
      element.respectMotionPreference = false;
      await element.updateComplete;

      expect(element.hasAttribute('respect-motion-preference')).toBe(false);
    });
  });

  describe('CSS 自定义属性更新', () => {
    it('连接到 DOM 时应该设置自定义属性', async () => {
      const elementWithProps = await fixture(html`
        <lith-skeleton width="100px" height="50px"></lith-skeleton>
      `);

      const computedStyle = getComputedStyle(elementWithProps);
      expect(computedStyle.getPropertyValue('--lith-skeleton-width')).toBe('100px');
      expect(computedStyle.getPropertyValue('--lith-skeleton-height')).toBe('50px');
    });

    it('属性更新时应该更新自定义属性', async () => {
      element.width = '300px';
      element.height = '200px';
      await element.updateComplete;

      const computedStyle = getComputedStyle(element);
      expect(computedStyle.getPropertyValue('--lith-skeleton-width')).toBe('300px');
      expect(computedStyle.getPropertyValue('--lith-skeleton-height')).toBe('200px');
    });
  });

  describe('类型定义', () => {
    it('应该有正确的变体类型', async () => {
      // 测试所有支持的变体
      const variants: Array<'default' | 'text' | 'circular' | 'rounded'> = [
        'default',
        'text',
        'circular',
        'rounded',
      ];

      for (const variant of variants) {
        element.variant = variant;
        await element.updateComplete;
        expect(element.variant).toBe(variant);
      }
    });
  });

  describe('边界情况', () => {
    it('应该处理空的宽度和高度值', async () => {
      element.width = '';
      element.height = '';
      await element.updateComplete;

      // 空值不应该设置 CSS 自定义属性
      const computedStyle = getComputedStyle(element);
      expect(computedStyle.getPropertyValue('--lith-skeleton-width')).toBe('');
      expect(computedStyle.getPropertyValue('--lith-skeleton-height')).toBe('');
    });

    it('应该处理无效的变体值', async () => {
      // TypeScript 会阻止这种情况，但在运行时可能发生
      (element as any).variant = 'invalid';
      await element.updateComplete;

      expect(element.getAttribute('variant')).toBe('invalid');
    });
  });

  describe('样式和布局', () => {
    it('应该有正确的显示类型', () => {
      const computedStyle = getComputedStyle(element);
      expect(computedStyle.display).toBe('inline-block');
    });

    it('应该有相对定位', () => {
      const computedStyle = getComputedStyle(element);
      expect(computedStyle.position).toBe('relative');
    });

    it('应该隐藏溢出内容', () => {
      const computedStyle = getComputedStyle(element);
      expect(computedStyle.overflow).toBe('hidden');
    });
  });
});
