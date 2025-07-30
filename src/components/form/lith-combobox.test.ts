import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-combobox';
import './lith-option';
import type { LithCombobox, ComboboxChangeDetail } from './lith-combobox';
import type { LithOption } from './lith-option';

describe('LithCombobox', () => {
  let element: LithCombobox;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-combobox>
        <lith-option value="apple">Apple</lith-option>
        <lith-option value="banana">Banana</lith-option>
        <lith-option value="cherry">Cherry</lith-option>
        <lith-option value="date">Date</lith-option>
      </lith-combobox>
    `);
  });

  it('应该创建combobox元素', () => {
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('lith-combobox');
  });

  it('应该正确设置初始属性', () => {
    expect(element.value).toBe('');
    expect(element.inputValue).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.readonly).toBe(false);
    expect(element.required).toBe(false);
    expect(element.open).toBe(false);
    expect(element.placeholder).toBe('Type to search...');
    expect(element.autoComplete).toBe(true);
    expect(element.allowCustom).toBe(false);
    expect(element.filterMode).toBe('contains');
  });

  it('应该包含所有选项', () => {
    const options = element.querySelectorAll('lith-option');
    expect(options.length).toBe(4);
    expect(options[0].getAttribute('value')).toBe('apple');
    expect(options[1].getAttribute('value')).toBe('banana');
    expect(options[2].getAttribute('value')).toBe('cherry');
    expect(options[3].getAttribute('value')).toBe('date');
  });

  it('应该显示占位符文本', () => {
    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    expect(input?.placeholder).toBe('Type to search...');
  });

  it.skip('应该通过点击输入框打开下拉列表', async () => {
    expect(element.open).toBe(false);

    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    input?.click();
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(element.open).toBe(true);
  });

  it('应该通过点击图标打开下拉列表', async () => {
    expect(element.open).toBe(false);

    const icon = element.shadowRoot?.querySelector('.icon') as HTMLElement;
    icon?.click();
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  it('应该在输入时过滤选项', async () => {
    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;

    // 输入 "a" 应该显示 Apple 和 Banana
    input.value = 'a';
    input.dispatchEvent(new InputEvent('input'));
    await element.updateComplete;

    expect(element.inputValue).toBe('a');
    expect(element.open).toBe(true);

    const options = element.querySelectorAll('lith-option');
    expect(options[0].hasAttribute('hidden')).toBe(false); // Apple
    expect(options[1].hasAttribute('hidden')).toBe(false); // Banana
    expect(options[2].hasAttribute('hidden')).toBe(true); // Cherry
    expect(options[3].hasAttribute('hidden')).toBe(false); // Date (包含 'a')
  });

  it('应该支持starts-with过滤模式', async () => {
    element.filterMode = 'starts-with';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    input.value = 'b';
    input.dispatchEvent(new InputEvent('input'));
    await element.updateComplete;

    const options = element.querySelectorAll('lith-option');
    expect(options[0].hasAttribute('hidden')).toBe(true); // Apple
    expect(options[1].hasAttribute('hidden')).toBe(false); // Banana
    expect(options[2].hasAttribute('hidden')).toBe(true); // Cherry
    expect(options[3].hasAttribute('hidden')).toBe(true); // Date
  });

  it('应该选择选项并更新值', async () => {
    element.open = true;
    await element.updateComplete;

    let changeEventFired = false;
    let eventDetail: ComboboxChangeDetail | null = null;

    element.addEventListener('lith-change', (e: Event) => {
      changeEventFired = true;
      eventDetail = (e as CustomEvent<ComboboxChangeDetail>).detail;
    });

    const option = element.querySelector('lith-option[value="banana"]') as LithOption;
    option?.click();
    await element.updateComplete;
    // 等待一个额外的更新周期
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(element.value).toBe('banana');
    expect(element.inputValue).toBe('Banana');
    expect(element.open).toBe(false);
    expect(changeEventFired).toBe(true);
    expect(eventDetail!.value).toBe('banana');
    expect(eventDetail!.displayValue).toBe('Banana');
  });

  it('应该在禁用状态下不响应交互', async () => {
    element.disabled = true;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    input?.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('应该在只读状态下不响应交互', async () => {
    element.readonly = true;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    input?.click();
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it.skip('应该支持键盘导航', async () => {
    // 聚焦元素
    element.focus();

    // 方向键向下打开下拉列表
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    element.dispatchEvent(arrowDownEvent);
    await element.updateComplete;

    expect(element.open).toBe(true);

    // 再次方向键向下应该高亮第一个选项
    element.dispatchEvent(arrowDownEvent);
    await element.updateComplete;

    const options = element.querySelectorAll('lith-option');
    expect(options[0].classList.contains('highlighted')).toBe(true);
  });

  it('应该使用Escape键关闭下拉列表', async () => {
    element.open = true;
    await element.updateComplete;

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    element.dispatchEvent(escapeEvent);
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it.skip('应该使用Enter键选择高亮选项', async () => {
    element.open = true;
    await element.updateComplete;

    // 高亮第二个选项
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    element.dispatchEvent(arrowDownEvent); // 高亮第一个
    element.dispatchEvent(arrowDownEvent); // 高亮第二个
    await element.updateComplete;

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    element.dispatchEvent(enterEvent);
    await element.updateComplete;

    expect(element.value).toBe('banana');
    expect(element.open).toBe(false);
  });

  it('应该支持自定义值', async () => {
    element.allowCustom = true;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    input.value = 'custom value';
    input.dispatchEvent(new InputEvent('input'));
    await element.updateComplete;

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    element.dispatchEvent(enterEvent);
    await element.updateComplete;

    expect(element.value).toBe('custom value');
    expect(element.inputValue).toBe('custom value');
  });

  it('应该支持必填验证', async () => {
    element.required = true;
    await element.updateComplete;

    // 初始状态应该无效
    expect(element.checkValidity()).toBe(false);

    // 选择值后应该有效
    element.value = 'apple';
    await element.updateComplete;

    expect(element.checkValidity()).toBe(true);
  });

  it('应该触发filter事件', async () => {
    let filterEventFired = false;
    let filteredCount = 0;

    element.addEventListener('lith-filter', (e: Event) => {
      filterEventFired = true;
      filteredCount = (e as CustomEvent).detail.filteredOptions.length;
    });

    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new InputEvent('input'));
    await element.updateComplete;

    expect(filterEventFired).toBe(true);
    expect(filteredCount).toBe(3); // Apple, Banana, and Date (all contain 'a')
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

    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;

    // 聚焦
    input?.dispatchEvent(new FocusEvent('focus'));
    expect(focusEventFired).toBe(true);

    // 失焦
    input?.dispatchEvent(new FocusEvent('blur'));
    await new Promise((resolve) => setTimeout(resolve, 200)); // 等待延迟
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

  it('应该支持clear方法', async () => {
    element.value = 'apple';
    element.inputValue = 'Apple';
    await element.updateComplete;

    element.clear();
    await element.updateComplete;

    expect(element.value).toBe('');
    expect(element.inputValue).toBe('');
  });

  it('应该正确处理表单重置', async () => {
    element.value = 'banana';
    element.inputValue = 'Banana';
    await element.updateComplete;

    // 模拟表单重置
    element.formResetCallback();
    await element.updateComplete;

    expect(element.value).toBe('');
    expect(element.inputValue).toBe('');
  });

  it('应该正确处理表单状态恢复', async () => {
    // 模拟表单状态恢复
    element.formStateRestoreCallback('cherry');
    await element.updateComplete;

    expect(element.value).toBe('cherry');
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
      <lith-combobox>
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2" disabled>Option 2 (Disabled)</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-combobox>
    `)) as LithCombobox;

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
    element.placeholder = '请输入搜索内容';
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    expect(input?.placeholder).toBe('请输入搜索内容');
  });

  it('应该在autoComplete关闭时不自动填充', async () => {
    element.autoComplete = false;
    element.value = 'apple';
    await element.updateComplete;

    // 当autoComplete为false时，inputValue不应该自动填充
    expect(element.inputValue).toBe('');
  });

  it.skip('应该支持自定义过滤函数', async () => {
    // 自定义过滤：只显示包含特定字符的选项
    element.filterOptions((option, query) => {
      const text = option.textContent?.toLowerCase() || '';
      return text.includes(query.toLowerCase()) && text.length > 4;
    });

    await element.updateComplete;

    const options = element.querySelectorAll('lith-option');
    expect(options[0].hasAttribute('hidden')).toBe(true); // Apple (短于4个字符)
    expect(options[1].hasAttribute('hidden')).toBe(false); // Banana
    expect(options[2].hasAttribute('hidden')).toBe(false); // Cherry
    expect(options[3].hasAttribute('hidden')).toBe(true); // Date (短于4个字符)
  });

  it('应该正确处理选项的selected属性', async () => {
    const option = element.querySelector('lith-option[value="cherry"]') as LithOption;
    option.setAttribute('selected', '');
    await element.updateComplete;

    // 等待 MutationObserver 触发
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(element.value).toBe('cherry');
  });

  it('应该在输入为空时显示所有选项', async () => {
    // 先过滤选项
    const input = element.shadowRoot?.querySelector('.input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new InputEvent('input'));
    await element.updateComplete;

    // 清空输入
    input.value = '';
    input.dispatchEvent(new InputEvent('input'));
    await element.updateComplete;

    const options = element.querySelectorAll('lith-option');
    options.forEach((option) => {
      expect(option.hasAttribute('hidden')).toBe(false);
    });
  });
});
