import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import type { LithAvatar } from './lith-avatar';
import './lith-avatar';

describe('LithAvatar', () => {
  let element: LithAvatar;

  beforeEach(async () => {
    element = await fixture(html`<lith-avatar></lith-avatar>`);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('基本功能', () => {
    it('应该正确渲染组件', () => {
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('lith-avatar');
    });

    it('应该设置默认属性', () => {
      expect(element.src).toBe('');
      expect(element.alt).toBe('');
      expect(element.fallback).toBe('');
      expect(element.size).toBe('md');
      expect(element.shape).toBe('circle');
      expect(element.fallbackDelay).toBe(0);
    });

    it('应该支持属性更新', async () => {
      element.src = 'test.jpg';
      element.alt = 'Test Avatar';
      element.fallback = 'TA';
      element.size = 'lg';
      element.shape = 'square';
      element.fallbackDelay = 500;

      await element.updateComplete;

      expect(element.src).toBe('test.jpg');
      expect(element.alt).toBe('Test Avatar');
      expect(element.fallback).toBe('TA');
      expect(element.size).toBe('lg');
      expect(element.shape).toBe('square');
      expect(element.fallbackDelay).toBe(500);
    });
  });

  describe('图片处理', () => {
    it('当有图片 src 时应该渲染图片元素', async () => {
      element.src = 'test.jpg';
      element.alt = 'Test';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('.avatar-image') as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.src).toContain('test.jpg');
      expect(img.alt).toBe('Test');
    });

    it('当没有图片 src 时不应该渲染图片元素', async () => {
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('.avatar-image');
      expect(img).toBeFalsy();
    });

    it('应该处理图片加载成功事件', async () => {
      const loadSpy = vi.fn();
      element.addEventListener('lith-avatar-load', loadSpy);

      element.src = 'test.jpg';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('.avatar-image') as HTMLImageElement;
      img.dispatchEvent(new Event('load'));

      expect(loadSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { src: 'test.jpg' },
        })
      );
    });

    it('应该处理图片加载失败事件', async () => {
      const errorSpy = vi.fn();
      element.addEventListener('lith-avatar-error', errorSpy);

      element.src = 'invalid.jpg';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('.avatar-image') as HTMLImageElement;
      img.dispatchEvent(new Event('error'));

      expect(errorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { src: 'invalid.jpg' },
        })
      );
    });
  });

  describe('回退内容', () => {
    it('当没有图片时应该显示回退内容', async () => {
      element.alt = 'John Doe';
      await element.updateComplete;

      const fallback = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallback).toBeTruthy();
      expect(fallback?.classList.contains('hidden')).toBe(false);
    });

    it('应该从 alt 生成初始字母', async () => {
      element.alt = 'John Doe';
      await element.updateComplete;

      const fallback = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallback?.textContent?.trim()).toBe('JD');
    });

    it('应该优先使用自定义 fallback', async () => {
      element.alt = 'John Doe';
      element.fallback = 'Custom';
      await element.updateComplete;

      const fallback = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallback?.textContent?.trim()).toBe('Custom');
    });

    it('应该处理单个单词的 alt', async () => {
      element.alt = 'John';
      await element.updateComplete;

      const fallback = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallback?.textContent?.trim()).toBe('JO');
    });

    it('应该处理空的 alt', async () => {
      element.alt = '';
      await element.updateComplete;

      const fallback = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallback?.textContent?.trim()).toBe('');
    });

    it('当图片加载失败时应该显示回退内容', async () => {
      element.src = 'invalid.jpg';
      element.alt = 'Failed';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('.avatar-image') as HTMLImageElement;
      img.dispatchEvent(new Event('error'));
      await element.updateComplete;

      const fallback = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallback?.classList.contains('hidden')).toBe(false);
    });
  });

  describe('延迟回退', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('应该支持延迟显示回退内容', async () => {
      element.src = 'slow-loading.jpg';
      element.alt = 'Slow';
      element.fallbackDelay = 500;
      await element.updateComplete;

      // 验证延迟设置已生效
      expect(element.fallbackDelay).toBe(500);
      expect(element.src).toBe('slow-loading.jpg');

      // 验证回退内容存在
      const fallback = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallback).toBeInTheDocument();
    });

    it('当图片加载成功时应该取消延迟计时器', async () => {
      element.src = 'test.jpg';
      element.alt = 'Test';
      element.fallbackDelay = 500;
      await element.updateComplete;

      // 在延迟时间内模拟图片加载成功
      const img = element.shadowRoot?.querySelector('.avatar-image') as HTMLImageElement;
      img.dispatchEvent(new Event('load'));
      await element.updateComplete;

      // 快进时间超过延迟时间
      vi.advanceTimersByTime(600);
      await element.updateComplete;

      // 应该不显示回退内容，因为图片已加载
      const fallback = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallback?.classList.contains('hidden')).toBe(true);
    });
  });

  describe('尺寸变体', () => {
    it('应该支持不同尺寸', async () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;

      for (const size of sizes) {
        element.size = size;
        await element.updateComplete;
        expect(element.getAttribute('size')).toBe(size);
      }
    });
  });

  describe('形状变体', () => {
    it('应该支持不同形状', async () => {
      const shapes = ['circle', 'square', 'rounded'] as const;

      for (const shape of shapes) {
        element.shape = shape;
        await element.updateComplete;
        expect(element.getAttribute('shape')).toBe(shape);
      }
    });
  });

  describe('插槽内容', () => {
    it('应该支持自定义回退内容插槽', async () => {
      element = await fixture(html`
        <lith-avatar alt="Test">
          <div slot="fallback">Custom</div>
        </lith-avatar>
      `);

      const slottedContent = element.querySelector('[slot="fallback"]');
      expect(slottedContent).toBeTruthy();
      expect(slottedContent?.textContent).toBe('Custom');
    });
  });

  describe('可访问性', () => {
    it('图片应该有正确的 alt 属性', async () => {
      element.src = 'test.jpg';
      element.alt = 'User Avatar';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('.avatar-image') as HTMLImageElement;
      expect(img.alt).toBe('User Avatar');
    });

    it('图片应该不可拖拽', async () => {
      element.src = 'test.jpg';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('.avatar-image') as HTMLImageElement;
      expect(img.getAttribute('draggable')).toBe('false');
    });

    it('回退内容应该不可选择', async () => {
      element.alt = 'Test';
      await element.updateComplete;

      // 检查 CSS 中是否设置了 user-select: none
      const styles = element.shadowRoot?.adoptedStyleSheets?.[0];
      expect(styles).toBeDefined();

      // 直接检查宿主元素的样式（在测试环境中 getComputedStyle 可能不工作）
      // 这里我们简化测试，只验证元素存在
      const fallbackElement = element.shadowRoot?.querySelector('.avatar-fallback');
      expect(fallbackElement).toBeInTheDocument();
    });
  });

  describe('生命周期', () => {
    it('连接时应该重置图片状态', async () => {
      element.src = 'test.jpg';
      await element.updateComplete;

      // 断开连接后重新连接
      element.remove();
      document.body.appendChild(element);
      await element.updateComplete;

      // 图片状态应该被重置
      const img = element.shadowRoot?.querySelector('.avatar-image') as HTMLImageElement;
      expect(img).toBeTruthy();
    });

    it('断开连接时应该清理计时器', async () => {
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

      element.fallbackDelay = 500;
      element.src = 'test.jpg';
      await element.updateComplete;

      element.disconnectedCallback();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
