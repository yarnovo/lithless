import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-radio';
import type { LithRadio } from './lith-radio';

// Skip tests in JSDOM environment due to ElementInternals limitations
// const skipInJSDOM = typeof window !== 'undefined' && !window.ElementInternals;

describe('LithRadio', () => {
  let element: LithRadio;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-radio value="test-value" name="test-group">Test Radio</lith-radio>
    `);
  });

  it('应该创建radio元素', () => {
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('lith-radio');
  });

  it('应该正确设置初始属性', () => {
    expect(element.value).toBe('test-value');
    expect(element.name).toBe('test-group');
    expect(element.checked).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.readonly).toBe(false);
    expect(element.required).toBe(false);
    expect(element.labelPosition).toBe('after');
    expect(element.size).toBe('medium');
  });

  it('应该正确渲染标签内容', () => {
    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeDefined();
  });

  it('应该正确处理选中状态', async () => {
    element.checked = true;
    await element.updateComplete;

    expect(element.checked).toBe(true);

    const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input?.checked).toBe(true);
  });

  it('应该正确处理禁用状态', async () => {
    element.disabled = true;
    await element.updateComplete;

    expect(element.disabled).toBe(true);

    const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input?.disabled).toBe(true);
  });

  it('应该正确处理只读状态', async () => {
    element.readonly = true;
    await element.updateComplete;

    expect(element.readonly).toBe(true);

    const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input?.readOnly).toBe(true);
  });

  it('应该正确处理必填状态', async () => {
    element.required = true;
    await element.updateComplete;

    expect(element.required).toBe(true);

    const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input?.required).toBe(true);
  });

  it('应该支持不同的标签位置', async () => {
    element.labelPosition = 'before';
    await element.updateComplete;

    const base = element.shadowRoot?.querySelector('.base');
    expect(base?.classList.contains('label-before')).toBe(true);
  });

  it('应该正确处理select方法', async () => {
    element.select();
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });

  it('应该正确处理deselect方法', async () => {
    element.checked = true;
    await element.updateComplete;

    element.deselect();
    await element.updateComplete;

    expect(element.checked).toBe(false);
  });

  it('应该正确处理必填验证', async () => {
    // 使用 element-internals-polyfill，现在应该可以工作了

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
    let eventDetail: { checked: boolean; value: string | null } | null = null;

    element.addEventListener('lith-change', (e: Event) => {
      changeEventFired = true;
      eventDetail = (e as CustomEvent).detail;
    });

    element.select();
    await element.updateComplete;

    expect(changeEventFired).toBe(true);
    expect(eventDetail).not.toBeNull();
    expect(eventDetail!.checked).toBe(true);
    expect(eventDetail!.value).toBe('test-value');
  });

  it('应该触发input事件', async () => {
    let inputEventFired = false;
    let eventDetail: { checked: boolean; value: string | null } | null = null;

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
    expect(eventDetail!.value).toBe('test-value');
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

  it('应该显示图标当选中时', async () => {
    element.checked = true;
    await element.updateComplete;

    const iconSlot = element.shadowRoot?.querySelector('slot[name="icon"]');
    expect(iconSlot).toBeDefined();
  });

  it('应该不显示图标当未选中时', async () => {
    element.checked = false;
    await element.updateComplete;

    // 检查control元素中是否没有渲染图标slot
    const control = element.shadowRoot?.querySelector('.control');
    const iconSlot = control?.querySelector('slot[name="icon"]');
    expect(iconSlot).toBeNull();
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
    element.formStateRestoreCallback('test-value');
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });
});

describe('LithRadio - 组内互斥', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    container = await fixture(html`
      <div>
        <lith-radio name="group1" value="option1">Option 1</lith-radio>
        <lith-radio name="group1" value="option2">Option 2</lith-radio>
        <lith-radio name="group1" value="option3">Option 3</lith-radio>
      </div>
    `);
  });

  it('应该确保同组中只有一个radio被选中', async () => {
    const radios = container.querySelectorAll('lith-radio') as NodeListOf<LithRadio>;

    // 选中第一个
    radios[0].select();
    await Promise.all([...radios].map((radio) => radio.updateComplete));

    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(false);

    // 选中第二个
    radios[1].select();
    await Promise.all([...radios].map((radio) => radio.updateComplete));

    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
    expect(radios[2].checked).toBe(false);
  });
});
