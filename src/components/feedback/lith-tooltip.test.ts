import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fixture, html, aTimeout } from '@open-wc/testing';
import { sendMouse, sendKeys } from '@web/test-runner-commands';
import '../../../src/components/feedback/lith-tooltip';
import type { LithTooltip } from '../../../src/components/feedback/lith-tooltip';

describe('LithTooltip', () => {
  let element: LithTooltip;

  beforeEach(async () => {
    element = await fixture<LithTooltip>(html`
      <lith-tooltip content="Test tooltip">
        <button>Trigger</button>
      </lith-tooltip>
    `);
  });

  afterEach(() => {
    // 清理任何可能存在的 tooltip
    document.querySelectorAll('lith-tooltip').forEach((el) => el.remove());
  });

  describe('基本功能', () => {
    it('应该正确渲染', () => {
      expect(element).toBeTruthy();
      expect(element.tagName.toLowerCase()).toBe('lith-tooltip');
    });

    it('应该渲染触发元素', () => {
      const trigger = element.querySelector('button');
      expect(trigger).toBeTruthy();
      expect(trigger?.textContent).toBe('Trigger');
    });

    it('默认不应该显示 tooltip 内容', () => {
      const content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeFalsy();
    });

    it('应该有正确的默认属性', () => {
      expect(element.content).toBe('Test tooltip');
      expect(element.placement).toBe('top');
      expect(element.offset).toBe(8);
      expect(element.showDelay).toBe(600);
      expect(element.hideDelay).toBe(0);
      expect(element.disabled).toBe(false);
      expect(element.arrow).toBe(true);
    });
  });

  describe('显示和隐藏', () => {
    it('鼠标悬停应该显示 tooltip', async () => {
      const button = element.querySelector('button')!;
      const rect = button.getBoundingClientRect();

      // 模拟鼠标悬停
      await sendMouse({
        type: 'move',
        position: [rect.x + rect.width / 2, rect.y + rect.height / 2],
      });

      // 等待显示延迟
      await aTimeout(700);

      const content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeTruthy();
      expect(content?.textContent?.trim()).toBe('Test tooltip');
    });

    it('鼠标移开应该隐藏 tooltip', async () => {
      const button = element.querySelector('button')!;
      const rect = button.getBoundingClientRect();

      // 先显示
      await sendMouse({
        type: 'move',
        position: [rect.x + rect.width / 2, rect.y + rect.height / 2],
      });
      await aTimeout(700);

      // 移开鼠标
      await sendMouse({ type: 'move', position: [0, 0] });
      await aTimeout(100);

      const content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeFalsy();
    });

    it('聚焦应该显示 tooltip', async () => {
      const button = element.querySelector('button')!;
      button.focus();

      // 等待显示延迟
      await aTimeout(700);

      const content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeTruthy();
    });

    it('失焦应该隐藏 tooltip', async () => {
      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(700);

      button.blur();
      await aTimeout(100);

      const content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeFalsy();
    });
  });

  describe('延迟功能', () => {
    it('应该遵守显示延迟', async () => {
      element.showDelay = 300;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      const rect = button.getBoundingClientRect();

      await sendMouse({
        type: 'move',
        position: [rect.x + rect.width / 2, rect.y + rect.height / 2],
      });

      // 在延迟时间之前不应该显示
      await aTimeout(200);
      let content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeFalsy();

      // 延迟时间后应该显示
      await aTimeout(200);
      content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeTruthy();
    });

    it('应该遵守隐藏延迟', async () => {
      element.hideDelay = 300;
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      const rect = button.getBoundingClientRect();

      // 显示 tooltip
      await sendMouse({
        type: 'move',
        position: [rect.x + rect.width / 2, rect.y + rect.height / 2],
      });
      await aTimeout(100);

      // 移开鼠标
      await sendMouse({ type: 'move', position: [0, 0] });

      // 在延迟时间之前应该仍然显示
      await aTimeout(200);
      let content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeTruthy();

      // 延迟时间后应该隐藏
      await aTimeout(200);
      content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeFalsy();
    });
  });

  describe('全局延迟管理', () => {
    it('第二个 tooltip 应该立即显示', async () => {
      // 创建第二个 tooltip
      const tooltip2 = await fixture<LithTooltip>(html`
        <lith-tooltip content="Second tooltip">
          <button>Second</button>
        </lith-tooltip>
      `);

      // 显示第一个 tooltip
      const button1 = element.querySelector('button')!;
      const rect1 = button1.getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [rect1.x + rect1.width / 2, rect1.y + rect1.height / 2],
      });
      await aTimeout(700);

      // 快速切换到第二个 tooltip
      const button2 = tooltip2.querySelector('button')!;
      const rect2 = button2.getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [rect2.x + rect2.width / 2, rect2.y + rect2.height / 2],
      });

      // 应该立即显示，无需等待
      await aTimeout(50);
      const content = tooltip2.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeTruthy();

      tooltip2.remove();
    });
  });

  describe('位置和箭头', () => {
    it('应该正确设置位置属性', async () => {
      element.placement = 'bottom';
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      expect(element.getAttribute('data-placement')).toContain('bottom');
    });

    it('应该可以隐藏箭头', async () => {
      element.arrow = false;
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      const arrow = element.shadowRoot?.querySelector('[part="arrow"]');
      expect(arrow).toBeFalsy();
    });

    it('应该显示箭头（默认）', async () => {
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      const arrow = element.shadowRoot?.querySelector('[part="arrow"]');
      expect(arrow).toBeTruthy();
    });
  });

  describe('禁用状态', () => {
    it('禁用时不应该显示 tooltip', async () => {
      element.disabled = true;
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      const rect = button.getBoundingClientRect();

      await sendMouse({
        type: 'move',
        position: [rect.x + rect.width / 2, rect.y + rect.height / 2],
      });
      await aTimeout(100);

      const content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeFalsy();
    });
  });

  describe('键盘交互', () => {
    it('ESC 键应该隐藏 tooltip', async () => {
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      // 验证 tooltip 显示
      let content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeTruthy();

      // 按 ESC 键
      await sendKeys({ press: 'Escape' });
      await aTimeout(100);

      // 验证 tooltip 隐藏
      content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content).toBeFalsy();
    });
  });

  describe('事件', () => {
    it('显示时应该触发 lith-tooltip-show 事件', async () => {
      const showHandler = vi.fn();
      element.addEventListener('lith-tooltip-show', showHandler);
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      expect(showHandler).toHaveBeenCalledOnce();
    });

    it('隐藏时应该触发 lith-tooltip-hide 事件', async () => {
      const hideHandler = vi.fn();
      element.addEventListener('lith-tooltip-hide', hideHandler);
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      button.blur();
      await aTimeout(100);

      expect(hideHandler).toHaveBeenCalledOnce();
    });
  });

  describe('可访问性', () => {
    it('显示时应该设置 aria-describedby', async () => {
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      const trigger = element.shadowRoot?.querySelector('[part="trigger"]');
      expect(trigger?.getAttribute('aria-describedby')).toBe('tooltip-content');
    });

    it('隐藏时应该移除 aria-describedby', async () => {
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      button.blur();
      await aTimeout(100);

      const trigger = element.shadowRoot?.querySelector('[part="trigger"]');
      expect(trigger?.hasAttribute('aria-describedby')).toBe(false);
    });

    it('tooltip 内容应该有正确的 role', async () => {
      element.showDelay = 0;
      await element.updateComplete;

      const button = element.querySelector('button')!;
      button.focus();
      await aTimeout(100);

      const content = element.shadowRoot?.querySelector('[part="content"]');
      expect(content?.getAttribute('role')).toBe('tooltip');
    });

    it('应该为非聚焦元素添加 tabindex', async () => {
      element = await fixture<LithTooltip>(html`
        <lith-tooltip content="Test">
          <span>Non-focusable</span>
        </lith-tooltip>
      `);

      await element.updateComplete;
      const span = element.querySelector('span');
      expect(span?.getAttribute('tabindex')).toBe('0');
    });

    it('不应该为已经可聚焦的元素添加 tabindex', async () => {
      element = await fixture<LithTooltip>(html`
        <lith-tooltip content="Test">
          <a href="#">Link</a>
        </lith-tooltip>
      `);

      await element.updateComplete;
      const link = element.querySelector('a');
      expect(link?.hasAttribute('tabindex')).toBe(false);
    });
  });
});
