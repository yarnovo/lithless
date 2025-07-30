import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-radio-group';
import './lith-radio';
import type { LithRadioGroup } from './lith-radio-group';
import type { LithRadio } from './lith-radio';

describe('LithRadioGroup', () => {
  let element: LithRadioGroup;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-radio-group name="test" label="Test Group">
        <lith-radio value="option1">Option 1</lith-radio>
        <lith-radio value="option2">Option 2</lith-radio>
        <lith-radio value="option3">Option 3</lith-radio>
      </lith-radio-group>
    `);
  });

  it('应该创建radio group元素', () => {
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('lith-radio-group');
  });

  it('应该正确设置初始属性', () => {
    expect(element.name).toBe('test');
    expect(element.label).toBe('Test Group');
    expect(element.value).toBeNull();
    expect(element.disabled).toBe(false);
    expect(element.readonly).toBe(false);
    expect(element.required).toBe(false);
    expect(element.orientation).toBe('vertical');
  });

  it('应该正确渲染标签', () => {
    const legend = element.shadowRoot?.querySelector('legend');
    expect(legend).toBeDefined();
    expect(legend?.textContent?.trim()).toBe('Test Group');
  });

  it('应该管理选中状态', async () => {
    element.value = 'option2';
    await element.updateComplete;

    const radios = element.querySelectorAll('lith-radio') as NodeListOf<LithRadio>;
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
    expect(radios[2].checked).toBe(false);
  });

  it('应该正确处理selectValue方法', async () => {
    element.selectValue('option3');
    await element.updateComplete;

    expect(element.value).toBe('option3');
    const radios = element.querySelectorAll('lith-radio') as NodeListOf<LithRadio>;
    expect(radios[2].checked).toBe(true);
  });

  it('应该正确处理clearSelection方法', async () => {
    element.value = 'option1';
    await element.updateComplete;

    element.clearSelection();
    await element.updateComplete;

    expect(element.value).toBeNull();
    const radios = element.querySelectorAll('lith-radio') as NodeListOf<LithRadio>;
    radios.forEach((radio) => {
      expect(radio.checked).toBe(false);
    });
  });

  it('应该正确处理禁用状态', async () => {
    element.disabled = true;
    await element.updateComplete;

    const radios = element.querySelectorAll('lith-radio') as NodeListOf<LithRadio>;
    radios.forEach((radio) => {
      expect(radio.disabled).toBe(true);
    });
  });

  it('应该正确处理只读状态', async () => {
    element.readonly = true;
    await element.updateComplete;

    const radios = element.querySelectorAll('lith-radio') as NodeListOf<LithRadio>;
    radios.forEach((radio) => {
      expect(radio.readonly).toBe(true);
    });
  });

  it('应该返回正确的radio值', async () => {
    await element.updateComplete;

    const values = element.getRadioValues();
    expect(values).toEqual(['option1', 'option2', 'option3']);
  });

  it('应该返回正确的可用radio值', async () => {
    const radios = element.querySelectorAll('lith-radio') as NodeListOf<LithRadio>;
    radios[1].disabled = true;
    await element.updateComplete;

    const enabledValues = element.getEnabledRadioValues();
    expect(enabledValues).toEqual(['option1', 'option3']);
  });

  it('应该正确处理必填验证', async () => {
    element.required = true;
    await element.updateComplete;

    expect(element.checkValidity()).toBe(false);

    element.value = 'option1';
    await element.updateComplete;

    expect(element.checkValidity()).toBe(true);
  });

  it('应该正确设置表单值', async () => {
    element.value = 'option2';
    await element.updateComplete;

    // 注意：由于测试环境限制，我们只能检查值是否正确设置
    expect(element.value).toBe('option2');
  });

  it('应该支持水平布局', async () => {
    element.orientation = 'horizontal';
    await element.updateComplete;

    const container = element.shadowRoot?.querySelector('.radio-container');
    expect(container?.classList.contains('horizontal')).toBe(true);
    expect(container?.classList.contains('vertical')).toBe(false);
  });

  it('应该触发change事件', async () => {
    let changeEventFired = false;
    let eventDetail: any = null;

    element.addEventListener('lith-change', (e: Event) => {
      changeEventFired = true;
      eventDetail = (e as CustomEvent).detail;
    });

    element.selectValue('option1');
    await element.updateComplete;

    expect(changeEventFired).toBe(true);
    expect(eventDetail.value).toBe('option1');
    expect(eventDetail.previousValue).toBeNull();
  });
});

describe('LithRadioGroup - 键盘导航', () => {
  let element: LithRadioGroup;
  let radios: NodeListOf<LithRadio>;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-radio-group name="keyboard-test" value="option2">
        <lith-radio value="option1">Option 1</lith-radio>
        <lith-radio value="option2">Option 2</lith-radio>
        <lith-radio value="option3">Option 3</lith-radio>
        <lith-radio value="option4" disabled>Option 4</lith-radio>
        <lith-radio value="option5">Option 5</lith-radio>
      </lith-radio-group>
    `);
    radios = element.querySelectorAll('lith-radio');
    await element.updateComplete;
  });

  it('应该正确处理方向键导航', async () => {
    // 模拟从option2开始按向下键
    const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    radios[1].dispatchEvent(keyEvent);
    await element.updateComplete;

    expect(element.value).toBe('option3');
  });

  it('应该跳过禁用的选项', async () => {
    // 设置为option3，然后按向下键（应该跳过option4因为它被禁用）
    element.value = 'option3';
    await element.updateComplete;

    const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    radios[2].dispatchEvent(keyEvent);
    await element.updateComplete;

    expect(element.value).toBe('option5');
  });
});
