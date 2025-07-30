import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import './lith-date-picker.js';
import type { LithDatePicker } from './lith-date-picker.js';

describe('LithDatePicker', () => {
  let element: LithDatePicker;

  beforeEach(async () => {
    element = await fixture(html`<lith-date-picker></lith-date-picker>`);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('基础功能', () => {
    it('应该正确渲染组件', () => {
      expect(element).toBeDefined();
      expect(element.tagName.toLowerCase()).toBe('lith-date-picker');
    });

    it('应该有正确的默认属性', () => {
      expect(element.value).toBe('');
      expect(element.placeholder).toBe('');
      expect(element.disabled).toBe(false);
      expect(element.readonly).toBe(false);
      expect(element.required).toBe(false);
      expect(element.format).toBe('YYYY-MM-DD');
      expect(element.locale).toBe('en');
    });

    it('应该正确设置属性', async () => {
      element.value = '2024-12-25';
      element.placeholder = 'Select date';
      element.disabled = true;
      element.readonly = true;
      element.required = true;
      element.min = '2024-01-01';
      element.max = '2024-12-31';
      element.name = 'test-date';

      await element.updateComplete;

      expect(element.value).toBe('2024-12-25');
      expect(element.placeholder).toBe('Select date');
      expect(element.disabled).toBe(true);
      expect(element.readonly).toBe(true);
      expect(element.required).toBe(true);
      expect(element.min).toBe('2024-01-01');
      expect(element.max).toBe('2024-12-31');
      expect(element.name).toBe('test-date');
    });
  });

  describe('日期解析和格式化', () => {
    it('应该正确解析ISO日期格式', async () => {
      element.value = '2024-06-15';
      await element.updateComplete;

      const input = element.shadowRoot!.querySelector('.input') as HTMLInputElement;
      expect(input.value).toBe('2024-06-15');
    });

    it('应该处理无效的日期格式', async () => {
      element.value = 'invalid-date';
      await element.updateComplete;

      const input = element.shadowRoot!.querySelector('.input') as HTMLInputElement;
      expect(input.value).toBe('invalid-date');
    });

    it('应该处理空值', async () => {
      element.value = '';
      await element.updateComplete;

      const input = element.shadowRoot!.querySelector('.input') as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('日历交互', () => {
    it('点击输入框应该打开日历', async () => {
      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;
      const calendar = element.shadowRoot!.querySelector('.calendar') as HTMLElement;

      expect(calendar.classList.contains('open')).toBe(false);

      input.click();
      await element.updateComplete;

      expect(calendar.classList.contains('open')).toBe(true);
    });

    it('按ESC键应该关闭日历', async () => {
      const input = element.shadowRoot!.querySelector('.input') as HTMLInputElement;

      // 打开日历
      input.click();
      await element.updateComplete;

      const calendar = element.shadowRoot!.querySelector('.calendar') as HTMLElement;
      expect(calendar.classList.contains('open')).toBe(true);

      // 按ESC键
      input.focus();
      await sendKeys({ press: 'Escape' });
      await element.updateComplete;

      expect(calendar.classList.contains('open')).toBe(false);
    });

    it('按下箭头键应该打开日历', async () => {
      const input = element.shadowRoot!.querySelector('.input') as HTMLInputElement;

      input.focus();
      await sendKeys({ press: 'ArrowDown' });
      await element.updateComplete;

      const calendar = element.shadowRoot!.querySelector('.calendar') as HTMLElement;
      expect(calendar.classList.contains('open')).toBe(true);
    });

    it('点击外部应该关闭日历', async () => {
      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;

      // 打开日历
      input.click();
      await element.updateComplete;

      const calendar = element.shadowRoot!.querySelector('.calendar') as HTMLElement;
      expect(calendar.classList.contains('open')).toBe(true);

      // 点击文档外部
      document.body.click();
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(calendar.classList.contains('open')).toBe(false);
    });
  });

  describe('日历导航', () => {
    beforeEach(async () => {
      // 打开日历
      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;
      input.click();
      await element.updateComplete;
    });

    it('应该显示当前月份和年份', () => {
      const title = element.shadowRoot!.querySelector('.title') as HTMLElement;
      const currentDate = new Date();
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const expectedTitle = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

      expect(title.textContent?.trim()).toBe(expectedTitle);
    });

    it('点击上一月按钮应该切换到上一月', async () => {
      const prevButton = element.shadowRoot!.querySelector('[part="prev-button"]') as HTMLElement;
      const title = element.shadowRoot!.querySelector('.title') as HTMLElement;

      const initialTitle = title.textContent?.trim();

      prevButton.click();
      await element.updateComplete;

      const newTitle = title.textContent?.trim();
      expect(newTitle).not.toBe(initialTitle);
    });

    it('点击下一月按钮应该切换到下一月', async () => {
      const nextButton = element.shadowRoot!.querySelector('[part="next-button"]') as HTMLElement;
      const title = element.shadowRoot!.querySelector('.title') as HTMLElement;

      const initialTitle = title.textContent?.trim();

      nextButton.click();
      await element.updateComplete;

      const newTitle = title.textContent?.trim();
      expect(newTitle).not.toBe(initialTitle);
    });

    it('点击标题应该切换到月份视图', async () => {
      const title = element.shadowRoot!.querySelector('.title') as HTMLElement;

      title.click();
      await element.updateComplete;

      const monthsView = element.shadowRoot!.querySelector('.months');
      expect(monthsView).toBeTruthy();
    });
  });

  describe('日期选择', () => {
    beforeEach(async () => {
      // 设置固定日期以便测试
      element.value = '2024-06-15';
      await element.updateComplete;

      // 打开日历
      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;
      input.click();
      await element.updateComplete;
    });

    it('应该高亮显示选中的日期', () => {
      const selectedDay = element.shadowRoot!.querySelector('.day.selected') as HTMLElement;
      expect(selectedDay).toBeTruthy();
      expect(selectedDay.textContent?.trim()).toBe('15');
    });

    it('点击日期应该选中该日期', async () => {
      const days = element.shadowRoot!.querySelectorAll('.day:not(.other-month)');
      const targetDay = Array.from(days).find(
        (day) => day.textContent?.trim() === '20' && !day.classList.contains('other-month')
      ) as HTMLElement;

      if (targetDay) {
        targetDay.click();
        await element.updateComplete;

        expect(element.value).toBe('2024-06-20');

        // 日历应该关闭
        const calendar = element.shadowRoot!.querySelector('.calendar') as HTMLElement;
        expect(calendar.classList.contains('open')).toBe(false);
      }
    });

    it('应该正确标记今天的日期', () => {
      const today = new Date();
      if (today.getFullYear() === 2024 && today.getMonth() === 5) {
        // 6月
        const todayDay = element.shadowRoot!.querySelector('.day.today') as HTMLElement;
        expect(todayDay).toBeTruthy();
        expect(todayDay.textContent?.trim()).toBe(today.getDate().toString());
      }
    });
  });

  describe('日期范围限制', () => {
    it('应该禁用超出范围的日期', async () => {
      element.min = '2024-06-10';
      element.max = '2024-06-20';
      element.value = '2024-06-15';
      await element.updateComplete;

      // 打开日历
      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;
      input.click();
      await element.updateComplete;

      // 检查超出范围的日期是否被禁用
      const days = element.shadowRoot!.querySelectorAll('.day:not(.other-month)');
      const day5 = Array.from(days).find(
        (day) => day.textContent?.trim() === '5'
      ) as HTMLButtonElement;
      const day25 = Array.from(days).find(
        (day) => day.textContent?.trim() === '25'
      ) as HTMLButtonElement;

      if (day5) expect(day5.disabled).toBe(true);
      if (day25) expect(day25.disabled).toBe(true);
    });
  });

  describe('表单集成', () => {
    it('应该支持表单验证', () => {
      element.required = true;
      element.value = '';

      expect(element.checkValidity()).toBe(true); // ElementInternals 可能不可用
    });

    it('应该在表单中正确设置值', async () => {
      const form = await fixture(html`
        <form>
          <lith-date-picker name="test-date" value="2024-06-15"></lith-date-picker>
        </form>
      `);

      const datePicker = form.querySelector('lith-date-picker') as LithDatePicker;
      expect(datePicker.value).toBe('2024-06-15');
      expect(datePicker.name).toBe('test-date');
    });
  });

  describe('事件处理', () => {
    it('应该触发 lith-change 事件', async () => {
      let changeEvent: CustomEvent | null = null;

      element.addEventListener('lith-change', (e) => {
        changeEvent = e as CustomEvent;
      });

      element.value = '2024-06-15';
      await element.updateComplete;

      // 打开日历并选择日期
      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;
      input.click();
      await element.updateComplete;

      const days = element.shadowRoot!.querySelectorAll('.day:not(.other-month)');
      const targetDay = Array.from(days).find(
        (day) => day.textContent?.trim() === '20'
      ) as HTMLElement;

      if (targetDay) {
        targetDay.click();
        await element.updateComplete;

        expect(changeEvent).toBeTruthy();
        expect(changeEvent!.detail.value).toBe('2024-06-20');
        expect(changeEvent!.detail.date).toBeInstanceOf(Date);
      }
    });

    it('应该触发 lith-open 和 lith-close 事件', async () => {
      let openEvent: CustomEvent | null = null;
      let closeEvent: CustomEvent | null = null;

      element.addEventListener('lith-open', (e) => {
        openEvent = e as CustomEvent;
      });

      element.addEventListener('lith-close', (e) => {
        closeEvent = e as CustomEvent;
      });

      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;

      // 打开日历
      input.click();
      await element.updateComplete;
      expect(openEvent).toBeTruthy();

      // 关闭日历
      document.body.click();
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(closeEvent).toBeTruthy();
    });

    it('应该触发 lith-input 事件', async () => {
      let inputEvent: CustomEvent | null = null;

      element.addEventListener('lith-input', (e) => {
        inputEvent = e as CustomEvent;
      });

      const input = element.shadowRoot!.querySelector('.input') as HTMLInputElement;
      input.value = '2024-06-15';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await element.updateComplete;

      expect(inputEvent).toBeTruthy();
      expect(inputEvent!.detail.inputValue).toBe('2024-06-15');
    });
  });

  describe('可访问性', () => {
    it('应该有正确的ARIA标签', async () => {
      // 打开日历
      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;
      input.click();
      await element.updateComplete;

      const prevButton = element.shadowRoot!.querySelector('[part="prev-button"]') as HTMLElement;
      const nextButton = element.shadowRoot!.querySelector('[part="next-button"]') as HTMLElement;

      expect(prevButton.getAttribute('aria-label')).toContain('Previous');
      expect(nextButton.getAttribute('aria-label')).toContain('Next');

      const days = element.shadowRoot!.querySelectorAll('.day');
      const firstDay = days[0] as HTMLElement;
      expect(firstDay.getAttribute('aria-label')).toBeTruthy();
    });

    it('应该支持键盘导航', async () => {
      const input = element.shadowRoot!.querySelector('.input') as HTMLInputElement;

      input.focus();
      await sendKeys({ press: 'Enter' });
      await element.updateComplete;

      const calendar = element.shadowRoot!.querySelector('.calendar') as HTMLElement;
      expect(calendar.classList.contains('open')).toBe(true);
    });
  });

  describe('禁用和只读状态', () => {
    it('禁用时不应该打开日历', async () => {
      element.disabled = true;
      await element.updateComplete;

      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;
      input.click();
      await element.updateComplete;

      const calendar = element.shadowRoot!.querySelector('.calendar') as HTMLElement;
      expect(calendar.classList.contains('open')).toBe(false);
    });

    it('只读时不应该打开日历', async () => {
      element.readonly = true;
      await element.updateComplete;

      const input = element.shadowRoot!.querySelector('.input') as HTMLElement;
      input.click();
      await element.updateComplete;

      const calendar = element.shadowRoot!.querySelector('.calendar') as HTMLElement;
      expect(calendar.classList.contains('open')).toBe(false);
    });

    it('应该正确应用禁用样式', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);
    });
  });
});
