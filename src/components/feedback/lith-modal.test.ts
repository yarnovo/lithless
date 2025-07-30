import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fixture, html, aTimeout } from '@open-wc/testing';
import '../../../src/components/feedback/lith-modal';
import type { LithModal } from '../../../src/components/feedback/lith-modal';

describe('LithModal', () => {
  let element: LithModal;

  beforeEach(async () => {
    element = await fixture<LithModal>(html`<lith-modal></lith-modal>`);
  });

  describe('基本功能', () => {
    it('应该正确渲染', () => {
      expect(element).toBeTruthy();
      expect(element.tagName.toLowerCase()).toBe('lith-modal');
    });

    it('默认应该是关闭状态', () => {
      expect(element.open).toBe(false);
      expect(element.shadowRoot?.querySelector('[part="backdrop"]')).toBeNull();
      expect(element.shadowRoot?.querySelector('[part="modal"]')).toBeNull();
    });

    it('设置 open=true 应该显示模态框', async () => {
      element.open = true;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('[part="backdrop"]');
      const modal = element.shadowRoot?.querySelector('[part="modal"]');

      expect(backdrop).toBeTruthy();
      expect(modal).toBeTruthy();
      expect(modal?.getAttribute('role')).toBe('dialog');
      expect(modal?.getAttribute('aria-modal')).toBe('true');
    });

    it('应该正确显示插槽内容', async () => {
      const content = 'Test Content';
      element = await fixture<LithModal>(html`
        <lith-modal open>
          <div id="test-content">${content}</div>
        </lith-modal>
      `);

      await element.updateComplete;
      const slotContent = element.querySelector('#test-content');
      expect(slotContent?.textContent).toBe(content);
    });
  });

  describe('关闭功能', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('点击背景应该关闭模态框（默认）', async () => {
      const backdrop = element.shadowRoot?.querySelector('[part="backdrop"]') as HTMLElement;
      backdrop.click();
      await element.updateComplete;

      expect(element.open).toBe(false);
    });

    it('closeOnBackdrop=false 时点击背景不应该关闭', async () => {
      element.closeOnBackdrop = false;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('[part="backdrop"]') as HTMLElement;
      backdrop.click();
      await element.updateComplete;

      expect(element.open).toBe(true);
    });

    it('按 ESC 键应该关闭模态框（默认）', async () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      element.dispatchEvent(event);
      await element.updateComplete;

      expect(element.open).toBe(false);
    });

    it('closeOnEsc=false 时按 ESC 不应该关闭', async () => {
      element.closeOnEsc = false;
      await element.updateComplete;

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      element.dispatchEvent(event);
      await element.updateComplete;

      expect(element.open).toBe(true);
    });

    it('点击模态框内容不应该关闭', async () => {
      const modal = element.shadowRoot?.querySelector('[part="modal"]') as HTMLElement;
      modal.click();
      await element.updateComplete;

      expect(element.open).toBe(true);
    });
  });

  describe('API 方法', () => {
    it('show() 应该打开模态框', async () => {
      element.show();
      await element.updateComplete;

      expect(element.open).toBe(true);
    });

    it('hide() 应该关闭模态框', async () => {
      element.open = true;
      await element.updateComplete;

      element.hide();
      await element.updateComplete;

      expect(element.open).toBe(false);
    });
  });

  describe('事件', () => {
    it('打开时应该触发 lith-open 事件', async () => {
      const openHandler = vi.fn();
      element.addEventListener('lith-open', openHandler);

      element.open = true;
      await element.updateComplete;

      expect(openHandler).toHaveBeenCalledOnce();
    });

    it('关闭时应该触发 lith-close 事件', async () => {
      element.open = true;
      await element.updateComplete;

      const closeHandler = vi.fn();
      element.addEventListener('lith-close', closeHandler);

      element.open = false;
      await element.updateComplete;
      await aTimeout(250); // 等待关闭动画

      expect(closeHandler).toHaveBeenCalledOnce();
    });
  });

  describe('ARIA 属性', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('应该设置正确的 ARIA 属性', () => {
      const modal = element.shadowRoot?.querySelector('[part="modal"]');
      expect(modal?.getAttribute('role')).toBe('dialog');
      expect(modal?.getAttribute('aria-modal')).toBe('true');
    });

    it('应该支持 aria-label', async () => {
      element.ariaLabel = 'Test Modal';
      await element.updateComplete;

      const modal = element.shadowRoot?.querySelector('[part="modal"]');
      expect(modal?.getAttribute('aria-label')).toBe('Test Modal');
    });

    it('应该支持 aria-labelledby', async () => {
      element.ariaLabelledby = 'title-id';
      await element.updateComplete;

      const modal = element.shadowRoot?.querySelector('[part="modal"]');
      expect(modal?.getAttribute('aria-labelledby')).toBe('title-id');
    });

    it('应该支持 aria-describedby', async () => {
      element.ariaDescribedby = 'desc-id';
      await element.updateComplete;

      const modal = element.shadowRoot?.querySelector('[part="modal"]');
      expect(modal?.getAttribute('aria-describedby')).toBe('desc-id');
    });
  });

  describe('焦点管理', () => {
    it('打开时应该将焦点移到模态框内', async () => {
      const button = document.createElement('button');
      button.textContent = 'Focus me';
      element.appendChild(button);

      element.open = true;
      await element.updateComplete;
      await aTimeout(100); // 等待 requestAnimationFrame

      expect(document.activeElement).toBe(element);
      expect(element.shadowRoot?.activeElement).toBeTruthy();
    });

    it('关闭时应该恢复之前的焦点', async () => {
      const outsideButton = document.createElement('button');
      document.body.appendChild(outsideButton);
      outsideButton.focus();

      element.open = true;
      await element.updateComplete;

      element.open = false;
      await element.updateComplete;
      await aTimeout(250); // 等待关闭动画

      expect(document.activeElement).toBe(outsideButton);
      document.body.removeChild(outsideButton);
    });
  });

  describe('Tab 键导航', () => {
    it('应该在模态框内循环 Tab 焦点', async () => {
      element = await fixture<LithModal>(html`
        <lith-modal open>
          <button id="btn1">Button 1</button>
          <button id="btn2">Button 2</button>
          <button id="btn3">Button 3</button>
        </lith-modal>
      `);

      await element.updateComplete;
      await aTimeout(100);

      const btn1 = element.querySelector('#btn1') as HTMLButtonElement;
      const btn3 = element.querySelector('#btn3') as HTMLButtonElement;

      // 聚焦到最后一个按钮
      btn3.focus();

      // 模拟 Tab 键
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
      });
      element.dispatchEvent(tabEvent);

      // 应该循环到第一个按钮
      expect(document.activeElement).toBe(btn1);
    });

    it('应该支持 Shift+Tab 反向导航', async () => {
      element = await fixture<LithModal>(html`
        <lith-modal open>
          <button id="btn1">Button 1</button>
          <button id="btn2">Button 2</button>
          <button id="btn3">Button 3</button>
        </lith-modal>
      `);

      await element.updateComplete;
      await aTimeout(100);

      const btn1 = element.querySelector('#btn1') as HTMLButtonElement;
      const btn3 = element.querySelector('#btn3') as HTMLButtonElement;

      // 聚焦到第一个按钮
      btn1.focus();

      // 模拟 Shift+Tab 键
      const shiftTabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
      });
      element.dispatchEvent(shiftTabEvent);

      // 应该循环到最后一个按钮
      expect(document.activeElement).toBe(btn3);
    });
  });

  describe('body 滚动控制', () => {
    it('打开时应该禁用 body 滚动', async () => {
      element.open = true;
      await element.updateComplete;

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('关闭时应该恢复 body 滚动', async () => {
      element.open = true;
      await element.updateComplete;

      element.open = false;
      await element.updateComplete;
      await aTimeout(250); // 等待关闭动画

      expect(document.body.style.overflow).toBe('');
    });
  });
});
