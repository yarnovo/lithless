import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-select';
import './lith-option';
import type { LithSelect, SelectChangeDetail } from './lith-select';
import type { LithOption } from './lith-option';

describe('LithSelect', () => {
  let element: LithSelect;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-select>
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2">Option 2</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-select>
    `);
  });

  it('应该创建select元素', () => {
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('lith-select');
  });

  it('应该正确设置初始属性', () => {
    expect(element.value).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.readonly).toBe(false);
    expect(element.required).toBe(false);
    expect(element.open).toBe(false);
    expect(element.placeholder).toBe('Select an option');
  });

  it('应该包含所有选项', () => {
    const options = element.querySelectorAll('lith-option');
    expect(options.length).toBe(3);
    expect(options[0].getAttribute('value')).toBe('option1');
    expect(options[1].getAttribute('value')).toBe('option2');
    expect(options[2].getAttribute('value')).toBe('option3');
  });

  it('应该显示占位符文本', () => {
    const trigger = element.shadowRoot?.querySelector('.trigger');
    const value = trigger?.querySelector('.value');
    expect(value?.textContent?.trim()).toBe('Select an option');
    expect(value?.classList.contains('placeholder')).toBe(true);
  });

  it('应该通过点击打开下拉列表', async () => {
    expect(element.open).toBe(false);

    const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  it('应该通过再次点击关闭下拉列表', async () => {
    element.open = true;
    await element.updateComplete;

    const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('应该选择选项并更新值', async () => {
    element.open = true;
    await element.updateComplete;

    let changeEventFired = false;
    let eventDetail: SelectChangeDetail | null = null;

    element.addEventListener('lith-change', (e: Event) => {
      changeEventFired = true;
      eventDetail = (e as CustomEvent<SelectChangeDetail>).detail;
    });

    const option = element.querySelector('lith-option[value="option2"]') as LithOption;
    option?.click();
    await element.updateComplete;
    // 等待一个额外的更新周期
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(element.value).toBe('option2');
    expect(element.open).toBe(false);
    expect(changeEventFired).toBe(true);
    expect(eventDetail!.value).toBe('option2');

    // 检查显示的文本
    const value = element.shadowRoot?.querySelector('.value');
    expect(value?.textContent?.trim()).toBe('Option 2');
    expect(value?.classList.contains('placeholder')).toBe(false);
  });

  it('应该在禁用状态下不响应交互', async () => {
    element.disabled = true;
    await element.updateComplete;

    const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('应该在只读状态下不响应交互', async () => {
    element.readonly = true;
    await element.updateComplete;

    const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it.skip('应该支持键盘导航', async () => {
    // 聚焦元素
    element.focus();

    // 空格键打开下拉列表
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    element.dispatchEvent(spaceEvent);
    await element.updateComplete;

    expect(element.open).toBe(true);

    // 方向键导航
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    element.dispatchEvent(arrowDownEvent);
    await element.updateComplete;

    // 等待高亮更新
    await new Promise((resolve) => setTimeout(resolve, 10));

    const options = element.querySelectorAll('lith-option');
    expect(options[0].classList.contains('highlighted')).toBe(true);

    // Enter键选择
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    element.dispatchEvent(enterEvent);
    await element.updateComplete;

    expect(element.value).toBe('option1');
    expect(element.open).toBe(false);
  });

  it('应该使用Escape键关闭下拉列表', async () => {
    element.open = true;
    await element.updateComplete;

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    element.dispatchEvent(escapeEvent);
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('应该支持必填验证', async () => {
    element.required = true;
    await element.updateComplete;

    // 初始状态应该无效
    expect(element.checkValidity()).toBe(false);

    // 选择值后应该有效
    element.value = 'option1';
    await element.updateComplete;

    expect(element.checkValidity()).toBe(true);
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

    const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;

    // 聚焦
    trigger?.dispatchEvent(new FocusEvent('focus'));
    expect(focusEventFired).toBe(true);

    // 失焦
    trigger?.dispatchEvent(new FocusEvent('blur'));
    expect(blurEventFired).toBe(true);
  });

  it('应该支持show、hide和toggle方法', async () => {
    // show方法
    element.show();
    await element.updateComplete;
    expect(element.open).toBe(true);

    // hide方法
    element.hide();
    await element.updateComplete;
    expect(element.open).toBe(false);

    // toggle方法
    element.toggle();
    await element.updateComplete;
    expect(element.open).toBe(true);

    element.toggle();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('应该正确处理表单重置', async () => {
    element.value = 'option2';
    await element.updateComplete;

    // 模拟表单重置
    element.formResetCallback();
    await element.updateComplete;

    expect(element.value).toBe('');
  });

  it('应该正确处理表单状态恢复', async () => {
    // 模拟表单状态恢复
    element.formStateRestoreCallback('option3');
    await element.updateComplete;

    expect(element.value).toBe('option3');
  });

  it('应该在点击外部时关闭下拉列表', async () => {
    element.open = true;
    await element.updateComplete;

    // 模拟点击外部
    document.body.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('应该触发open和close事件', async () => {
    let openEventFired = false;
    let closeEventFired = false;

    element.addEventListener('lith-open', () => {
      openEventFired = true;
    });

    element.addEventListener('lith-close', () => {
      closeEventFired = true;
    });

    // 打开
    element.open = true;
    await element.updateComplete;
    expect(openEventFired).toBe(true);

    // 关闭
    element.open = false;
    await element.updateComplete;
    expect(closeEventFired).toBe(true);
  });

  it('应该处理禁用的选项', async () => {
    const newElement = (await fixture(html`
      <lith-select>
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2" disabled>Option 2 (Disabled)</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-select>
    `)) as LithSelect;

    newElement.open = true;
    await newElement.updateComplete;

    const disabledOption = newElement.querySelector('lith-option[value="option2"]') as LithOption;
    disabledOption?.click();
    await newElement.updateComplete;

    // 不应该选中禁用的选项
    expect(newElement.value).toBe('');
    expect(newElement.open).toBe(true);
  });

  it('应该支持自定义占位符', async () => {
    element.placeholder = '请选择一个选项';
    await element.updateComplete;

    const value = element.shadowRoot?.querySelector('.value');
    expect(value?.textContent?.trim()).toBe('请选择一个选项');
  });

  it('应该正确处理选项的selected属性', async () => {
    const option = element.querySelector('lith-option[value="option2"]') as LithOption;
    option.setAttribute('selected', '');
    await element.updateComplete;

    // 等待 MutationObserver 触发
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(element.value).toBe('option2');
  });
});

describe('LithOption', () => {
  let element: LithOption;

  beforeEach(async () => {
    element = await fixture(html`<lith-option value="test">Test Option</lith-option>`);
  });

  it('应该创建option元素', () => {
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('lith-option');
  });

  it('应该正确设置初始属性', () => {
    expect(element.value).toBe('test');
    expect(element.disabled).toBe(false);
    expect(element.selected).toBe(false);
    expect(element.label).toBe('');
  });

  it('应该显示内容', async () => {
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    const assignedNodes = slot?.assignedNodes({ flatten: true }) || [];
    expect(assignedNodes[0]?.textContent?.trim()).toBe('Test Option');
  });

  it('应该支持禁用状态', async () => {
    element.disabled = true;
    await element.updateComplete;

    expect(element.disabled).toBe(true);
    expect(element.hasAttribute('tabindex')).toBe(false);
  });

  it('应该支持选中状态', async () => {
    element.selected = true;
    await element.updateComplete;

    expect(element.selected).toBe(true);
    const base = element.shadowRoot?.querySelector('.base');
    expect(base?.getAttribute('aria-selected')).toBe('true');
  });

  it('应该支持图标插槽', async () => {
    const newElement = (await fixture(html`
      <lith-option value="test">
        <span slot="icon">🔍</span>
        Search
      </lith-option>
    `)) as LithOption;

    const iconSlot = newElement.shadowRoot?.querySelector('slot[name="icon"]') as HTMLSlotElement;
    const assignedElements = iconSlot?.assignedElements() || [];
    expect(assignedElements.length).toBe(1);
    expect(assignedElements[0].textContent).toBe('🔍');
  });
});
