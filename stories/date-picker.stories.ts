import type { Meta, StoryObj } from '@storybook/web-components';
import { html, css } from 'lit';
import { expect, userEvent } from '@storybook/test';
import '../src/components/form/lith-date-picker.js';

const meta: Meta = {
  title: 'Form/DatePicker',
  component: 'lith-date-picker',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
一个 Headless 日期选择器组件，提供完整的日期选择功能，无预定义样式。

## 特性

- **表单集成**: 支持原生表单验证和提交
- **键盘导航**: 完整的键盘支持和可访问性
- **日期范围**: 支持最小和最大日期限制
- **多视图**: 日期、月份、年份三种视图切换
- **自定义格式**: 支持日期格式化和本地化
- **事件丰富**: 提供详细的事件反馈
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: '选中的日期值（ISO 格式 YYYY-MM-DD）',
    },
    placeholder: {
      control: 'text',
      description: '输入框占位文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    readonly: {
      control: 'boolean',
      description: '是否只读',
    },
    required: {
      control: 'boolean',
      description: '是否必填',
    },
    min: {
      control: 'text',
      description: '最小日期（ISO 格式）',
    },
    max: {
      control: 'text',
      description: '最大日期（ISO 格式）',
    },
    format: {
      control: 'text',
      description: '日期格式',
    },
    locale: {
      control: 'text',
      description: '本地化语言',
    },
    name: {
      control: 'text',
      description: '表单字段名称',
    },
  },
  args: {
    placeholder: 'Select a date...',
    disabled: false,
    readonly: false,
    required: false,
    format: 'YYYY-MM-DD',
    locale: 'en',
  },
};

export default meta;
type Story = StoryObj;

// 基础样式
const basicStyles = css`
  lith-date-picker {
    --lith-date-picker-input-padding: 12px 16px;
    --lith-date-picker-input-gap: 8px;
    --lith-date-picker-calendar-width: 320px;
    --lith-date-picker-cell-size: 40px;
    --lith-date-picker-focus-ring-width: 2px;
    --lith-date-picker-transition-duration: 200ms;

    width: 280px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    color: #1a202c;
  }

  lith-date-picker:focus-within {
    border-color: #3b82f6;
  }

  lith-date-picker[disabled] {
    opacity: 0.6;
    background: #f7fafc;
  }

  lith-date-picker::part(input) {
    background: transparent;
    font-size: 14px;
    line-height: 1.5;
  }

  lith-date-picker::part(icon) {
    color: #6b7280;
    font-size: 16px;
  }

  lith-date-picker::part(calendar) {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  lith-date-picker::part(header) {
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  lith-date-picker::part(title) {
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
  }

  lith-date-picker::part(prev-button),
  lith-date-picker::part(next-button) {
    color: #6b7280;
    font-size: 18px;
    font-weight: bold;
  }

  lith-date-picker::part(prev-button):hover,
  lith-date-picker::part(next-button):hover {
    background: #e2e8f0;
    color: #374151;
  }

  lith-date-picker::part(weekday) {
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
  }

  lith-date-picker::part(day),
  lith-date-picker::part(month),
  lith-date-picker::part(year) {
    color: #374151;
    font-size: 14px;
    border-radius: 6px;
    transition: all 150ms ease;
  }

  lith-date-picker ::part(day):hover,
  lith-date-picker ::part(month):hover,
  lith-date-picker ::part(year):hover {
    background: #f3f4f6;
  }

  lith-date-picker ::part(day).other-month {
    color: #9ca3af;
  }

  lith-date-picker ::part(day).selected,
  lith-date-picker ::part(month).selected,
  lith-date-picker ::part(year).selected {
    background: #3b82f6 !important;
    color: white;
  }

  lith-date-picker ::part(day).today {
    font-weight: 700;
    color: #3b82f6;
  }

  lith-date-picker ::part(day).selected.today {
    color: white;
  }
`;

export const Default: Story = {
  render: (args) => html`
    <style>
      ${basicStyles}
    </style>
    <lith-date-picker
      .value=${args.value || ''}
      .placeholder=${args.placeholder}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .min=${args.min}
      .max=${args.max}
      .format=${args.format}
      .locale=${args.locale}
      .name=${args.name}
    ></lith-date-picker>
  `,
  play: async ({ canvasElement }) => {
    const datePicker = canvasElement.querySelector('lith-date-picker') as HTMLElement & {
      shadowRoot: ShadowRoot;
    };

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 测试输入框点击打开日历
    const input = datePicker.shadowRoot.querySelector('.input');
    expect(input).toBeTruthy();

    await userEvent.click(input);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 验证日历是否打开
    const calendar = datePicker.shadowRoot.querySelector('.calendar.open');
    expect(calendar).toBeTruthy();
  },
};

export const WithValue: Story = {
  args: {
    value: '2024-12-25',
  },
  render: (args) => html`
    <style>
      ${basicStyles}
    </style>
    <lith-date-picker
      .value=${args.value}
      .placeholder=${args.placeholder}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .min=${args.min}
      .max=${args.max}
      .format=${args.format}
      .locale=${args.locale}
      .name=${args.name}
    ></lith-date-picker>
  `,
  play: async ({ canvasElement }) => {
    const datePicker = canvasElement.querySelector('lith-date-picker') as HTMLElement & {
      shadowRoot: ShadowRoot;
    };

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 验证输入框显示正确的日期
    const input = datePicker.shadowRoot.querySelector('.input');
    expect(input.value).toBe('2024-12-25');
  },
};

export const DateRange: Story = {
  args: {
    min: '2024-01-01',
    max: '2024-12-31',
    placeholder: 'Select date (2024 only)',
  },
  render: (args) => html`
    <style>
      ${basicStyles}
    </style>
    <lith-date-picker
      .value=${args.value || ''}
      .placeholder=${args.placeholder}
      .min=${args.min}
      .max=${args.max}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .format=${args.format}
      .locale=${args.locale}
      .name=${args.name}
    ></lith-date-picker>
  `,
};

export const Disabled: Story = {
  args: {
    value: '2024-06-15',
    disabled: true,
  },
  render: (args) => html`
    <style>
      ${basicStyles}
    </style>
    <lith-date-picker
      .value=${args.value}
      .placeholder=${args.placeholder}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .min=${args.min}
      .max=${args.max}
      .format=${args.format}
      .locale=${args.locale}
      .name=${args.name}
    ></lith-date-picker>
  `,
};

export const ReadOnly: Story = {
  args: {
    value: '2024-06-15',
    readonly: true,
  },
  render: (args) => html`
    <style>
      ${basicStyles}
    </style>
    <lith-date-picker
      .value=${args.value}
      .placeholder=${args.placeholder}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .min=${args.min}
      .max=${args.max}
      .format=${args.format}
      .locale=${args.locale}
      .name=${args.name}
    ></lith-date-picker>
  `,
};

export const WithCustomIcon: Story = {
  render: (args) => html`
    <style>
      ${basicStyles}
    </style>
    <lith-date-picker
      .value=${args.value || ''}
      .placeholder=${args.placeholder}
      .disabled=${args.disabled}
      .readonly=${args.readonly}
      .required=${args.required}
      .min=${args.min}
      .max=${args.max}
      .format=${args.format}
      .locale=${args.locale}
      .name=${args.name}
    >
      <svg slot="trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
        />
      </svg>
    </lith-date-picker>
  `,
};

export const FormIntegration: Story = {
  render: () => html`
    <style>
      ${basicStyles} .form-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 24px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: white;
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
      }

      .form-button {
        width: 100%;
        padding: 12px 16px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 150ms ease;
      }

      .form-button:hover {
        background: #2563eb;
      }

      .form-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .output {
        margin-top: 16px;
        padding: 12px;
        background: #f8fafc;
        border-radius: 6px;
        font-size: 12px;
        color: #6b7280;
      }
    </style>
    <form class="form-container" id="date-form">
      <div class="form-group">
        <label class="form-label" for="start-date">Start Date</label>
        <lith-date-picker
          name="startDate"
          id="start-date"
          placeholder="Select start date"
          required
        ></lith-date-picker>
      </div>

      <div class="form-group">
        <label class="form-label" for="end-date">End Date</label>
        <lith-date-picker
          name="endDate"
          id="end-date"
          placeholder="Select end date"
        ></lith-date-picker>
      </div>

      <button type="submit" class="form-button">Submit</button>

      <div class="output" id="form-output">Fill out the form to see the submitted data</div>
    </form>
  `,
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('#date-form') as HTMLFormElement;
    const output = canvasElement.querySelector('#form-output') as HTMLElement;
    const startDatePicker = canvasElement.querySelector('#start-date') as HTMLElement;

    // 添加表单提交处理
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      output.textContent = `Submitted data: ${JSON.stringify(data, null, 2)}`;
    });

    // 添加值变化监听
    startDatePicker.addEventListener('lith-change', (e: CustomEvent) => {
      console.log('Start date changed:', e.detail);
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};

export const EventHandling: Story = {
  render: () => html`
    <style>
      ${basicStyles} .demo-container {
        max-width: 500px;
        margin: 0 auto;
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
      }

      .event-log {
        margin-top: 20px;
        padding: 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        max-height: 200px;
        overflow-y: auto;
      }

      .event-item {
        padding: 4px 0;
        font-size: 12px;
        color: #6b7280;
        border-bottom: 1px solid #e2e8f0;
      }

      .event-item:last-child {
        border-bottom: none;
      }

      .event-type {
        font-weight: 600;
        color: #3b82f6;
      }
    </style>
    <div class="demo-container">
      <lith-date-picker
        id="event-picker"
        placeholder="Select a date to see events"
      ></lith-date-picker>

      <div class="event-log" id="event-log">
        <div class="event-item">Events will appear here...</div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const datePicker = canvasElement.querySelector('#event-picker') as HTMLElement;
    const eventLog = canvasElement.querySelector('#event-log') as HTMLElement;

    const logEvent = (eventType: string, detail?: unknown) => {
      const timestamp = new Date().toLocaleTimeString();
      const eventItem = document.createElement('div');
      eventItem.className = 'event-item';
      eventItem.innerHTML = `
        <span class="event-type">${eventType}</span> - ${timestamp}
        ${detail ? `<br/>Detail: ${JSON.stringify(detail)}` : ''}
      `;
      eventLog.insertBefore(eventItem, eventLog.firstChild);

      // 保持最多 10 个事件
      while (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild!);
      }
    };

    // 监听所有日期选择器事件
    ['lith-change', 'lith-input', 'lith-focus', 'lith-blur', 'lith-open', 'lith-close'].forEach(
      (eventType) => {
        datePicker.addEventListener(eventType, (e: CustomEvent) => {
          logEvent(eventType, e.detail);
        });
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};

export const StyleCustomization: Story = {
  render: (args) => html`
    <style>
      .custom-date-picker {
        --lith-date-picker-input-padding: 16px 20px;
        --lith-date-picker-input-gap: 12px;
        --lith-date-picker-calendar-width: 360px;
        --lith-date-picker-cell-size: 44px;
        --lith-date-picker-focus-ring-width: 3px;
        --lith-date-picker-transition-duration: 300ms;

        width: 320px;
        border: 3px solid #8b5cf6;
        border-radius: 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
        font-family: 'Georgia', serif;
        color: white;
      }

      .custom-date-picker:focus-within {
        border-color: #a855f7;
        box-shadow: 0 8px 32px rgba(168, 85, 247, 0.5);
      }

      .custom-date-picker::part(input) {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-size: 16px;
        font-weight: 500;
        border-radius: 8px;
      }

      .custom-date-picker::part(input)::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }

      .custom-date-picker::part(icon) {
        color: rgba(255, 255, 255, 0.9);
        font-size: 20px;
      }

      .custom-date-picker::part(calendar) {
        border: 2px solid #8b5cf6;
        border-radius: 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        color: white;
      }

      .custom-date-picker::part(header) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
      }

      .custom-date-picker::part(title) {
        color: white;
        font-size: 18px;
        font-weight: 700;
      }

      .custom-date-picker::part(prev-button),
      .custom-date-picker::part(next-button) {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }

      .custom-date-picker::part(prev-button):hover,
      .custom-date-picker::part(next-button):hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .custom-date-picker::part(weekday) {
        color: rgba(255, 255, 255, 0.8);
        font-weight: 700;
      }

      .custom-date-picker::part(day),
      .custom-date-picker::part(month),
      .custom-date-picker::part(year) {
        color: white;
        font-weight: 600;
        border-radius: 8px;
      }

      .custom-date-picker ::part(day):hover,
      .custom-date-picker ::part(month):hover,
      .custom-date-picker ::part(year):hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .custom-date-picker ::part(day).other-month {
        color: rgba(255, 255, 255, 0.4);
      }

      .custom-date-picker ::part(day).selected,
      .custom-date-picker ::part(month).selected,
      .custom-date-picker ::part(year).selected {
        background: rgba(255, 255, 255, 0.9) !important;
        color: #6366f1;
        font-weight: 700;
      }

      .custom-date-picker ::part(day).today {
        background: rgba(255, 255, 255, 0.3);
        font-weight: 700;
      }
    </style>
    <lith-date-picker
      class="custom-date-picker"
      placeholder="Choose your special date"
      .value=${args.value || ''}
    >
      <svg slot="trigger-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        />
      </svg>
    </lith-date-picker>
  `,
};
