import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-switch';
import type { LithSwitch } from './lith-switch';

describe('LithSwitch', () => {
  let element: LithSwitch;

  beforeEach(async () => {
    element = await fixture(html`<lith-switch>Switch Label</lith-switch>`);
  });

  it('应该创建switch元素', () => {
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('lith-switch');
  });

  it('应该正确设置初始属性', () => {
    expect(element.checked).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.readonly).toBe(false);
    expect(element.required).toBe(false);
    expect(element.value).toBe('on');
    expect(element.labelPosition).toBe('after');
    expect(element.size).toBe('medium');
  });

  it('应该正确渲染标签内容', () => {
    const slot = element.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    expect(slot).toBeDefined();
    const assignedNodes = slot?.assignedNodes() || [];
    expect(assignedNodes[0]?.textContent).toBe('Switch Label');
  });

  it('应该正确处理选中状态', async () => {
    element.checked = true;
    await element.updateComplete;

    expect(element.checked).toBe(true);

    const input = element.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input?.checked).toBe(true);
  });

  it('应该正确处理禁用状态', async () => {
    element.disabled = true;
    await element.updateComplete;

    expect(element.disabled).toBe(true);

    const input = element.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input?.disabled).toBe(true);
  });

  it('应该正确处理只读状态', async () => {
    element.readonly = true;
    await element.updateComplete;

    expect(element.readonly).toBe(true);

    const input = element.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input?.readOnly).toBe(true);
  });

  it('应该正确处理必填状态', async () => {
    element.required = true;
    await element.updateComplete;

    expect(element.required).toBe(true);

    const input = element.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input?.required).toBe(true);
  });

  it('应该支持不同的标签位置', async () => {
    element.labelPosition = 'before';
    await element.updateComplete;

    const base = element.shadowRoot?.querySelector('.base');
    expect(base?.classList.contains('label-before')).toBe(true);
  });

  it('应该正确处理toggle方法', async () => {
    element.toggle();
    await element.updateComplete;

    expect(element.checked).toBe(true);

    element.toggle();
    await element.updateComplete;

    expect(element.checked).toBe(false);
  });

  it('应该在禁用时不能toggle', async () => {
    element.disabled = true;
    await element.updateComplete;

    element.toggle();
    await element.updateComplete;

    expect(element.checked).toBe(false);
  });

  it('应该在只读时不能toggle', async () => {
    element.readonly = true;
    await element.updateComplete;

    element.toggle();
    await element.updateComplete;

    expect(element.checked).toBe(false);
  });

  it.skip('应该正确处理必填验证', async () => {
    // 使用 element-internals-polyfill，但在测试环境中可能仍有限制

    // 测试初始状态（非必填）
    expect(element.checkValidity()).toBe(true);

    // 设置为必填
    element.required = true;
    await element.updateComplete;

    expect(element.checkValidity()).toBe(false);

    element.checked = true;
    await element.updateComplete;

    expect(element.checkValidity()).toBe(true);
  });

  it('应该触发change事件', async () => {
    let changeEventFired = false;
    let eventDetail: { checked: boolean } | null = null;

    element.addEventListener('lith-change', (e: Event) => {
      changeEventFired = true;
      eventDetail = (e as CustomEvent).detail;
    });

    // 模拟点击控制区域
    const control = element.shadowRoot?.querySelector('.control') as HTMLElement;
    control?.click();
    await element.updateComplete;

    expect(changeEventFired).toBe(true);
    expect(eventDetail).not.toBeNull();
    expect(eventDetail!.checked).toBe(true);
  });

  it('应该触发input事件', async () => {
    let inputEventFired = false;
    let eventDetail: { checked: boolean } | null = null;

    element.addEventListener('lith-input', (e: Event) => {
      inputEventFired = true;
      eventDetail = (e as CustomEvent).detail;
    });

    // 模拟点击控制区域
    const control = element.shadowRoot?.querySelector('.control') as HTMLElement;
    control?.click();
    await element.updateComplete;

    expect(inputEventFired).toBe(true);
    expect(eventDetail).not.toBeNull();
    expect(eventDetail!.checked).toBe(true);
  });

  it('应该在禁用时不响应交互', async () => {
    element.disabled = true;
    await element.updateComplete;

    let changeEventFired = false;
    element.addEventListener('lith-change', () => {
      changeEventFired = true;
    });

    // 尝试点击控制区域
    const control = element.shadowRoot?.querySelector('.control') as HTMLElement;
    control?.click();
    await element.updateComplete;

    expect(element.checked).toBe(false);
    expect(changeEventFired).toBe(false);
  });

  it('应该在只读时不响应交互', async () => {
    element.readonly = true;
    await element.updateComplete;

    let changeEventFired = false;
    element.addEventListener('lith-change', () => {
      changeEventFired = true;
    });

    // 尝试点击控制区域
    const control = element.shadowRoot?.querySelector('.control') as HTMLElement;
    control?.click();
    await element.updateComplete;

    expect(element.checked).toBe(false);
    expect(changeEventFired).toBe(false);
  });

  it('应该显示正确的图标slot', async () => {
    // 未选中时显示 off-icon
    let offIconSlot = element.shadowRoot?.querySelector('slot[name="off-icon"]');
    let onIconSlot = element.shadowRoot?.querySelector('slot[name="on-icon"]');
    expect(offIconSlot).toBeDefined();
    expect(onIconSlot).toBeNull();

    // 选中后显示 on-icon
    element.checked = true;
    await element.updateComplete;

    offIconSlot = element.shadowRoot?.querySelector('slot[name="off-icon"]');
    onIconSlot = element.shadowRoot?.querySelector('slot[name="on-icon"]');
    expect(offIconSlot).toBeNull();
    expect(onIconSlot).toBeDefined();
  });

  it('应该正确处理键盘交互', async () => {
    // 聚焦元素
    element.focus();

    let changeEventFired = false;
    element.addEventListener('lith-change', () => {
      changeEventFired = true;
    });

    // 模拟空格键
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    element.dispatchEvent(spaceEvent);
    await element.updateComplete;

    expect(element.checked).toBe(true);
    expect(changeEventFired).toBe(true);

    // 重置
    changeEventFired = false;

    // 模拟Enter键
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    element.dispatchEvent(enterEvent);
    await element.updateComplete;

    expect(element.checked).toBe(false);
    expect(changeEventFired).toBe(true);
  });

  it('应该正确处理表单重置', async () => {
    element.checked = true;
    await element.updateComplete;

    // 模拟表单重置
    element.formResetCallback();
    await element.updateComplete;

    expect(element.checked).toBe(false);
  });

  it('应该正确处理表单状态恢复', async () => {
    // 模拟表单状态恢复
    element.formStateRestoreCallback('on');
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });

  it('应该触发focus和blur事件', async () => {
    let focusEventFired = false;
    let blurEventFired = false;

    element.addEventListener('lith-focus', () => {
      focusEventFired = true;
    });

    element.addEventListener('lith-blur', () => {
      blurEventFired = true;
    });

    // 聚焦
    element.focus();
    element.dispatchEvent(new FocusEvent('focus'));
    expect(focusEventFired).toBe(true);

    // 失焦
    element.blur();
    element.dispatchEvent(new FocusEvent('blur'));
    expect(blurEventFired).toBe(true);
  });

  it('应该正确处理标签点击', async () => {
    let changeEventFired = false;
    element.addEventListener('lith-change', () => {
      changeEventFired = true;
    });

    // 点击标签
    const label = element.shadowRoot?.querySelector('.label') as HTMLElement;
    label?.click();
    await element.updateComplete;

    expect(element.checked).toBe(true);
    expect(changeEventFired).toBe(true);
  });
});
