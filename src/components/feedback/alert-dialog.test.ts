import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '../lith-alert-dialog';
import type { LithAlertDialog } from '../lith-alert-dialog';

describe('lith-alert-dialog', () => {
  let element: LithAlertDialog;

  beforeEach(async () => {
    element = await fixture(html`<lith-alert-dialog></lith-alert-dialog>`);
  });

  describe('基本功能', () => {
    it('应该正确渲染', () => {
      expect(element).toBeDefined();
      expect(element.tagName.toLowerCase()).toBe('lith-alert-dialog');
    });

    it('初始状态应该是关闭的', () => {
      expect(element.open).toBe(false);
    });

    it('应该有正确的默认属性值', () => {
      expect(element.title).toBe('');
      expect(element.description).toBe('');
      expect(element.cancelText).toBe('Cancel');
      expect(element.actionText).toBe('Continue');
      expect(element.actionVariant).toBe('destructive');
      expect(element.closeOnBackdrop).toBe(false);
      expect(element.closeOnEsc).toBe(true);
    });
  });

  describe('打开和关闭', () => {
    it('应该正确打开对话框', async () => {
      element.open = true;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('[part="backdrop"]');
      const dialog = element.shadowRoot?.querySelector('[part="dialog"]');

      expect(backdrop).toBeTruthy();
      expect(dialog).toBeTruthy();
      expect(dialog?.getAttribute('role')).toBe('alertdialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('应该正确关闭对话框', async () => {
      element.open = true;
      await element.updateComplete;

      element.open = false;
      await element.updateComplete;
      // 等待关闭动画
      await new Promise((resolve) => setTimeout(resolve, 250));

      const backdrop = element.shadowRoot?.querySelector('[part="backdrop"]');
      expect(backdrop).toBeFalsy();
    });

    it('show() 方法应该打开对话框', async () => {
      element.show();
      await element.updateComplete;

      expect(element.open).toBe(true);
    });

    it('hide() 方法应该关闭对话框', async () => {
      element.open = true;
      await element.updateComplete;

      element.hide();
      expect(element.open).toBe(false);
    });
  });

  describe('内容渲染', () => {
    it('应该正确渲染标题和描述', async () => {
      element.title = 'Test Title';
      element.description = 'Test Description';
      element.open = true;
      await element.updateComplete;

      const title = element.shadowRoot?.querySelector('[part="title"]');
      const description = element.shadowRoot?.querySelector('[part="description"]');

      expect(title?.textContent).toBe('Test Title');
      expect(description?.textContent).toBe('Test Description');
    });

    it('应该正确渲染按钮文本', async () => {
      element.cancelText = 'Custom Cancel';
      element.actionText = 'Custom Action';
      element.open = true;
      await element.updateComplete;

      const cancelButton = element.shadowRoot?.querySelector('[part="cancel-button"]');
      const actionButton = element.shadowRoot?.querySelector('[part="action-button"]');

      expect(cancelButton?.textContent).toBe('Custom Cancel');
      expect(actionButton?.textContent).toBe('Custom Action');
    });

    it('应该正确设置确认按钮的变体', async () => {
      element.actionVariant = 'default';
      element.open = true;
      await element.updateComplete;

      const actionButton = element.shadowRoot?.querySelector('[part="action-button"]');
      expect(actionButton?.getAttribute('data-variant')).toBe('default');
    });
  });

  describe('可访问性', () => {
    it('应该有正确的 ARIA 属性', async () => {
      element.title = 'Test Title';
      element.description = 'Test Description';
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('[part="dialog"]');
      expect(dialog?.getAttribute('role')).toBe('alertdialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
      expect(dialog?.getAttribute('aria-labelledby')).toBe('alert-dialog-title');
      expect(dialog?.getAttribute('aria-describedby')).toBe('alert-dialog-description');
    });

    it('应该支持自定义 aria-label', async () => {
      element.ariaLabel = 'Custom Label';
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('[part="dialog"]');
      expect(dialog?.getAttribute('aria-label')).toBe('Custom Label');
    });

    it('应该支持自定义 aria-labelledby 和 aria-describedby', async () => {
      element.ariaLabelledby = 'custom-title';
      element.ariaDescribedby = 'custom-description';
      element.open = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('[part="dialog"]');
      expect(dialog?.getAttribute('aria-labelledby')).toBe('custom-title');
      expect(dialog?.getAttribute('aria-describedby')).toBe('custom-description');
    });
  });

  describe('事件处理', () => {
    it('应该在打开时触发 lith-open 事件', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-open', openSpy);

      element.open = true;
      await element.updateComplete;

      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('应该在关闭时触发 lith-close 事件', async () => {
      const closeSpy = vi.fn();
      element.addEventListener('lith-close', closeSpy);

      element.open = true;
      await element.updateComplete;

      element.open = false;
      await element.updateComplete;
      // 等待关闭动画和事件触发
      await new Promise((resolve) => setTimeout(resolve, 250));

      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('点击取消按钮应该触发 lith-cancel 事件', async () => {
      const cancelSpy = vi.fn();
      element.addEventListener('lith-cancel', cancelSpy);

      element.open = true;
      await element.updateComplete;

      const cancelButton = element.shadowRoot?.querySelector(
        '[part="cancel-button"]'
      ) as HTMLButtonElement;
      cancelButton?.click();

      expect(cancelSpy).toHaveBeenCalledOnce();
      expect(element.open).toBe(false);
    });

    it('点击确认按钮应该触发 lith-action 事件', async () => {
      const actionSpy = vi.fn();
      element.addEventListener('lith-action', actionSpy);

      element.open = true;
      await element.updateComplete;

      const actionButton = element.shadowRoot?.querySelector(
        '[part="action-button"]'
      ) as HTMLButtonElement;
      actionButton?.click();

      expect(actionSpy).toHaveBeenCalledOnce();
      expect(element.open).toBe(false);
    });

    it('应该支持阻止默认的关闭行为', async () => {
      element.addEventListener('lith-cancel', (e) => {
        e.preventDefault();
      });

      element.open = true;
      await element.updateComplete;

      const cancelButton = element.shadowRoot?.querySelector(
        '[part="cancel-button"]'
      ) as HTMLButtonElement;
      cancelButton?.click();

      expect(element.open).toBe(true); // 应该仍然打开
    });
  });

  describe('键盘交互', () => {
    it('按 Escape 键应该关闭对话框', async () => {
      element.open = true;
      await element.updateComplete;

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      element.dispatchEvent(escapeEvent);

      expect(element.open).toBe(false);
    });

    it('当 closeOnEsc 为 false 时，Escape 键不应该关闭对话框', async () => {
      element.closeOnEsc = false;
      element.open = true;
      await element.updateComplete;

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      element.dispatchEvent(escapeEvent);

      expect(element.open).toBe(true);
    });

    it('应该支持 Tab 键的焦点陷阱', async () => {
      element.open = true;
      await element.updateComplete;

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      element.dispatchEvent(tabEvent);

      // 基本的 Tab 键处理测试
      expect(element.open).toBe(true);
    });
  });

  describe('背景点击', () => {
    it('默认情况下点击背景不应该关闭对话框', async () => {
      element.open = true;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('[part="backdrop"]') as HTMLElement;
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: backdrop });
      Object.defineProperty(clickEvent, 'currentTarget', { value: backdrop });
      backdrop?.dispatchEvent(clickEvent);

      expect(element.open).toBe(true);
    });

    it('当 closeOnBackdrop 为 true 时，点击背景应该关闭对话框', async () => {
      element.closeOnBackdrop = true;
      element.open = true;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('[part="backdrop"]') as HTMLElement;
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: backdrop });
      Object.defineProperty(clickEvent, 'currentTarget', { value: backdrop });
      backdrop?.dispatchEvent(clickEvent);

      expect(element.open).toBe(false);
    });
  });

  describe('槽位内容', () => {
    it('应该支持自定义标题槽位', async () => {
      const elementWithSlot = await fixture(html`
        <lith-alert-dialog open>
          <div slot="title">Custom Title</div>
        </lith-alert-dialog>
      `);

      await elementWithSlot.updateComplete;

      const titleSlot = elementWithSlot.shadowRoot?.querySelector('slot[name="title"]');
      expect(titleSlot).toBeTruthy();
    });

    it('应该支持自定义描述槽位', async () => {
      const elementWithSlot = await fixture(html`
        <lith-alert-dialog open>
          <div slot="description">Custom Description</div>
        </lith-alert-dialog>
      `);

      await elementWithSlot.updateComplete;

      const descriptionSlot = elementWithSlot.shadowRoot?.querySelector('slot[name="description"]');
      expect(descriptionSlot).toBeTruthy();
    });

    it('应该支持默认内容槽位', async () => {
      const elementWithSlot = await fixture(html`
        <lith-alert-dialog open>
          <div>Default content</div>
        </lith-alert-dialog>
      `);

      await elementWithSlot.updateComplete;

      const defaultSlot = elementWithSlot.shadowRoot?.querySelector('slot:not([name])');
      expect(defaultSlot).toBeTruthy();
    });
  });
});
