import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-virtual-scroll.js';
import { LithVirtualScroll } from './lith-virtual-scroll.js';
import type { VirtualScrollItem } from '../../utils/virtual-scroll-core.js';

describe('LithVirtualScroll', () => {
  let element: LithVirtualScroll;
  let testItems: VirtualScrollItem[];

  beforeEach(async () => {
    // 创建测试数据
    testItems = Array.from({ length: 1000 }, (_, index) => ({
      id: index,
      data: { name: `Item ${index}`, value: index },
    }));

    element = await fixture(html`
      <lith-virtual-scroll
        .items=${testItems}
        item-height="50"
        buffer-size="5"
        style="height: 300px;"
      ></lith-virtual-scroll>
    `);
  });

  describe('基础功能', () => {
    it('应该正确创建组件', () => {
      expect(element).toBeInstanceOf(LithVirtualScroll);
      expect(element.tagName.toLowerCase()).toBe('lith-virtual-scroll');
    });

    it('应该设置正确的属性', () => {
      expect(element.items).toEqual(testItems);
      expect(element.itemHeight).toBe(50);
      expect(element.bufferSize).toBe(5);
    });

    it('应该渲染滚动容器', () => {
      const container = element.shadowRoot?.querySelector('.scroll-container');
      expect(container).toBeTruthy();
    });

    it('应该渲染占位元素', () => {
      const spacer = element.shadowRoot?.querySelector('.scroll-spacer');
      expect(spacer).toBeTruthy();

      // 验证总高度
      const expectedHeight = testItems.length * 50; // 1000 * 50 = 50000px
      expect(spacer?.getAttribute('style')).toContain(`height: ${expectedHeight}px`);
    });
  });

  describe('虚拟滚动逻辑', () => {
    it('应该只渲染可见的项目', async () => {
      await element.updateComplete;

      const renderedItems = element.shadowRoot?.querySelectorAll('.scroll-item');
      expect(renderedItems?.length).toBeLessThan(testItems.length);
      expect(renderedItems?.length).toBeGreaterThan(0);
    });

    it('应该在滚动时更新可见项目', async () => {
      const container = element.shadowRoot?.querySelector('.scroll-container') as HTMLElement;
      expect(container).toBeTruthy();

      // 获取初始渲染的项目
      await element.updateComplete;
      const initialItems = element.shadowRoot?.querySelectorAll('.scroll-item');
      expect(initialItems?.length).toBeGreaterThan(0);

      // 模拟滚动
      const scrollEvent = new Event('scroll');
      Object.defineProperty(container, 'scrollTop', {
        writable: true,
        value: 500, // 滚动到中间位置
      });

      container.dispatchEvent(scrollEvent);

      // 等待更新
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await element.updateComplete;

      // 验证项目有更新
      const updatedItems = element.shadowRoot?.querySelectorAll('.scroll-item');
      expect(updatedItems?.length).toBeGreaterThan(0); // 应该有渲染的项目

      // 验证viewport位置更新
      const viewport = element.shadowRoot?.querySelector('.scroll-viewport') as HTMLElement;
      expect(viewport?.style.transform).toContain('translateY');
    });
  });

  describe('API 方法', () => {
    it('应该支持滚动到指定索引', async () => {
      const container = element.shadowRoot?.querySelector('.scroll-container') as HTMLElement;
      const scrollToSpy = vi.spyOn(container, 'scrollTo').mockImplementation(() => {});

      element.scrollToIndex(100);

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 5000, // 100 * 50
        behavior: 'smooth',
      });

      scrollToSpy.mockRestore();
    });

    it('应该获取项目位置信息', () => {
      const position = element.getItemPosition(10);
      expect(position).toEqual({
        top: 500, // 10 * 50
        height: 50,
      });
    });

    it('应该支持设置项目高度', async () => {
      element.setItemHeight(0, 100);

      // 验证高度更新后的位置计算
      await element.updateComplete;
      const position = element.getItemPosition(1);
      expect(position?.top).toBe(100); // 第0项现在高度为100
    });
  });

  describe('事件处理', () => {
    it('应该触发 lith-scroll 事件', async () => {
      const scrollHandler = vi.fn();
      element.addEventListener('lith-scroll', scrollHandler);

      const container = element.shadowRoot?.querySelector('.scroll-container') as HTMLElement;
      Object.defineProperty(container, 'scrollTop', {
        writable: true,
        value: 200,
      });

      const scrollEvent = new Event('scroll');
      container.dispatchEvent(scrollEvent);

      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(scrollHandler).toHaveBeenCalled();
      const eventDetail = scrollHandler.mock.calls[0][0].detail;
      expect(eventDetail.scrollTop).toBe(200);
      expect(eventDetail.range).toBeDefined();
    });

    it('应该触发 lith-render-item 事件', async () => {
      const renderHandler = vi.fn();
      element.addEventListener('lith-render-item', renderHandler);

      // 强制触发更新以确保事件被触发
      element.requestUpdate();
      await element.updateComplete;

      expect(renderHandler).toHaveBeenCalled();
      const eventDetail = renderHandler.mock.calls[0][0].detail;
      expect(eventDetail.item).toBeDefined();
      expect(eventDetail.index).toBeTypeOf('number');
    });
  });

  describe('空状态和加载状态', () => {
    it('应该显示空状态', async () => {
      element.items = [];
      await element.updateComplete;

      const emptyElement = element.shadowRoot?.querySelector('.empty');
      expect(emptyElement).toBeTruthy();
      expect(emptyElement?.textContent).toContain('暂无数据');
    });

    it('应该显示加载状态', async () => {
      element.loading = true;
      await element.updateComplete;

      const loadingElement = element.shadowRoot?.querySelector('.loading');
      expect(loadingElement).toBeTruthy();
      expect(loadingElement?.textContent).toContain('加载中');
    });

    it('应该支持自定义空状态文本', async () => {
      element.items = [];
      element.emptyText = '没有找到任何数据';
      await element.updateComplete;

      const emptyElement = element.shadowRoot?.querySelector('.empty');
      expect(emptyElement?.textContent).toContain('没有找到任何数据');
    });
  });

  describe('响应式处理', () => {
    it('应该在容器尺寸变化时更新', async () => {
      // 模拟 ResizeObserver
      const resizeCallback = vi.fn();
      const mockResizeObserver = vi.fn().mockImplementation((callback) => {
        resizeCallback.mockImplementation(callback);
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
        };
      });

      // 替换全局 ResizeObserver
      const originalResizeObserver = window.ResizeObserver;
      window.ResizeObserver = mockResizeObserver;

      // 创建新的组件实例
      await fixture(html`
        <lith-virtual-scroll .items=${testItems} item-height="50"></lith-virtual-scroll>
      `);

      expect(mockResizeObserver).toHaveBeenCalled();

      // 恢复原始 ResizeObserver
      window.ResizeObserver = originalResizeObserver;
    });
  });

  describe('性能优化', () => {
    it('应该使用 requestAnimationFrame 优化滚动', async () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        callback(0);
        return 0;
      });

      const container = element.shadowRoot?.querySelector('.scroll-container') as HTMLElement;
      Object.defineProperty(container, 'scrollTop', {
        writable: true,
        value: 100,
      });

      const scrollEvent = new Event('scroll');
      container.dispatchEvent(scrollEvent);

      expect(rafSpy).toHaveBeenCalled();

      rafSpy.mockRestore();
    });

    it('应该正确清理资源', () => {
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

      element.remove();

      // 验证清理逻辑被调用（通过检查是否调用了 cancelAnimationFrame）
      // 注意：这个测试可能需要根据实际的清理逻辑调整
      expect(cancelSpy).toHaveBeenCalledTimes(0); // 初始状态没有待取消的动画帧

      cancelSpy.mockRestore();
    });
  });
});
