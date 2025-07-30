import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/form/lith-radio-group';
import '../src/components/form/lith-radio';
import type { LithRadioGroup } from '../src/components/form/lith-radio-group';

const meta = {
  title: 'Form/RadioGroup',
  tags: ['autodocs'],
  render: (args) => html`
    <lith-radio-group
      value=${args.value || ''}
      name=${args.name || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      label=${args.label || ''}
      orientation=${args.orientation || 'vertical'}
      validation-message=${args.validationMessage || ''}
      @lith-change=${(e: CustomEvent) => console.log('lith-change:', e.detail)}
    >
      <lith-radio value="option1" label="选项 1"></lith-radio>
      <lith-radio value="option2" label="选项 2"></lith-radio>
      <lith-radio value="option3" label="选项 3"></lith-radio>
    </lith-radio-group>
  `,
  argTypes: {
    value: {
      control: 'text',
      description: '当前选中的值',
      table: {
        type: { summary: 'string | null' },
        defaultValue: { summary: 'null' },
      },
    },
    name: {
      control: 'text',
      description: '表单字段名称',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用整个组',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: '是否为只读状态',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: '是否为必选项',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: '组标题标签',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
      description: '布局方向',
      table: {
        type: { summary: '"horizontal" | "vertical"' },
        defaultValue: { summary: '"vertical"' },
      },
    },
    validationMessage: {
      control: 'text',
      description: '自定义验证消息',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
  },
} satisfies Meta<LithRadioGroup>;

export default meta;
type Story = StoryObj<LithRadioGroup>;

export const Default: Story = {
  args: {
    label: '选择一个选项',
  },
};

export const Selected: Story = {
  args: {
    label: '已选择选项',
    value: 'option2',
  },
};

export const Disabled: Story = {
  args: {
    label: '禁用状态',
    disabled: true,
    value: 'option1',
  },
};

export const Readonly: Story = {
  args: {
    label: '只读状态',
    readonly: true,
    value: 'option2',
  },
};

export const Required: Story = {
  args: {
    label: '必选项',
    required: true,
  },
};

export const Horizontal: Story = {
  args: {
    label: '水平布局',
    orientation: 'horizontal',
    value: 'option1',
  },
};

export const WithFormIntegration: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        console.log('表单提交:', Object.fromEntries(formData));
        alert('表单已提交！请查看控制台了解数据。');
      }}
    >
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 500px;">
        <lith-radio-group name="size" label="选择尺寸" required validation-message="请选择一个尺寸">
          <lith-radio value="small">小号</lith-radio>
          <lith-radio value="medium">中号</lith-radio>
          <lith-radio value="large">大号</lith-radio>
        </lith-radio-group>

        <lith-radio-group name="color" label="选择颜色" value="blue">
          <lith-radio value="red">红色</lith-radio>
          <lith-radio value="blue">蓝色</lith-radio>
          <lith-radio value="green">绿色</lith-radio>
        </lith-radio-group>

        <lith-radio-group name="delivery" label="配送方式" orientation="horizontal">
          <lith-radio value="standard">标准配送</lith-radio>
          <lith-radio value="express">快速配送</lith-radio>
          <lith-radio value="pickup">自提</lith-radio>
        </lith-radio-group>

        <div style="display: flex; gap: 8px;">
          <button type="submit">提交</button>
          <button type="reset">重置</button>
        </div>
      </div>
    </form>
  `,
};

export const KeyboardNavigation: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3 style="margin-top: 0;">键盘导航演示</h3>
        <p style="color: #666; margin-bottom: 0;">
          使用方向键、Home、End 键来导航单选框。<br />
          空格键选择当前焦点的单选框。
        </p>
      </div>

      <lith-radio-group label="键盘导航示例" value="option2">
        <lith-radio value="option1">选项 1</lith-radio>
        <lith-radio value="option2">选项 2（已选中）</lith-radio>
        <lith-radio value="option3">选项 3</lith-radio>
        <lith-radio value="option4" disabled>选项 4（禁用）</lith-radio>
        <lith-radio value="option5">选项 5</lith-radio>
      </lith-radio-group>
    </div>
  `,
};

export const DifferentStates: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 32px;">
      <lith-radio-group label="正常状态" value="option1">
        <lith-radio value="option1">已选中</lith-radio>
        <lith-radio value="option2">未选中</lith-radio>
      </lith-radio-group>

      <lith-radio-group label="部分禁用" value="option1">
        <lith-radio value="option1">可用选项</lith-radio>
        <lith-radio value="option2" disabled>禁用选项</lith-radio>
        <lith-radio value="option3">另一个可用选项</lith-radio>
      </lith-radio-group>

      <lith-radio-group label="全部禁用" disabled value="option2">
        <lith-radio value="option1">选项 1</lith-radio>
        <lith-radio value="option2">选项 2（已选中）</lith-radio>
        <lith-radio value="option3">选项 3</lith-radio>
      </lith-radio-group>

      <lith-radio-group label="只读状态" readonly value="option1">
        <lith-radio value="option1">选项 1（已选中）</lith-radio>
        <lith-radio value="option2">选项 2</lith-radio>
        <lith-radio value="option3">选项 3</lith-radio>
      </lith-radio-group>
    </div>
  `,
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-radio-group {
        --lith-radio-group-gap: 16px;
        --lith-radio-group-focus-ring-width: 3px;
        font-family: system-ui, sans-serif;
        font-size: 16px;
        color: #1f2937;
      }

      .custom-radio-group::part(legend) {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 12px;
      }

      .custom-radio {
        --lith-radio-size: 20px;
        --lith-radio-label-gap: 12px;
        --lith-radio-hover-scale: 1.1;
        --lith-radio-active-scale: 0.95;
        --lith-radio-transition-duration: 200ms;
        padding: 8px 12px;
        border-radius: 8px;
        transition: background-color 200ms ease;
      }

      .custom-radio:hover {
        background-color: #f3f4f6;
      }

      .custom-radio::part(control) {
        border: 2px solid #d1d5db;
        background: white;
        transition: all 200ms ease;
      }

      .custom-radio[checked]::part(control) {
        border-color: #3b82f6;
        background: #3b82f6;
      }

      .custom-radio[checked]::part(control)::after {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
      }

      .custom-radio[disabled] {
        opacity: 0.5;
      }

      .custom-radio:focus-within::part(control) {
        outline-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }
    </style>

    <div style="display: flex; flex-direction: column; gap: 24px;">
      <lith-radio-group class="custom-radio-group" label="自定义样式" value="medium">
        <lith-radio class="custom-radio" value="small">小号</lith-radio>
        <lith-radio class="custom-radio" value="medium">中号</lith-radio>
        <lith-radio class="custom-radio" value="large">大号</lith-radio>
      </lith-radio-group>

      <lith-radio-group
        class="custom-radio-group"
        label="水平布局"
        orientation="horizontal"
        value="blue"
      >
        <lith-radio class="custom-radio" value="red">红色</lith-radio>
        <lith-radio class="custom-radio" value="blue">蓝色</lith-radio>
        <lith-radio class="custom-radio" value="green">绿色</lith-radio>
      </lith-radio-group>
    </div>
  `,
};

export const InteractiveExample: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 700px;">
      <div>
        <h3 style="margin-top: 0;">交互式单选框组演示</h3>
        <p style="color: #666;">与下面的单选框组交互，事件将记录到控制台。</p>
      </div>

      <lith-radio-group
        id="interactive-radio-group"
        label="交互式单选框组"
        value="option2"
        @lith-change=${(e: CustomEvent) => {
          const output = document.getElementById('radio-event-output');
          if (output) {
            output.innerHTML += `<div>lith-change: value=${e.detail.value}, previousValue=${e.detail.previousValue}</div>`;
          }
          console.log('RadioGroup change:', e.detail);
        }}
      >
        <lith-radio
          value="option1"
          @lith-change=${(e: CustomEvent) => {
            const output = document.getElementById('radio-event-output');
            if (output) {
              output.innerHTML += `<div>Radio lith-change: value=${e.detail.value}, checked=${e.detail.checked}</div>`;
            }
          }}
          >选项 1</lith-radio
        >
        <lith-radio value="option2">选项 2（初始选中）</lith-radio>
        <lith-radio value="option3">选项 3</lith-radio>
        <lith-radio value="option4">选项 4</lith-radio>
      </lith-radio-group>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button
          @click=${() => {
            const rg = document.getElementById('interactive-radio-group') as LithRadioGroup;
            rg.selectValue('option1');
          }}
        >
          选择选项 1
        </button>

        <button
          @click=${() => {
            const rg = document.getElementById('interactive-radio-group') as LithRadioGroup;
            rg.selectValue('option3');
          }}
        >
          选择选项 3
        </button>

        <button
          @click=${() => {
            const rg = document.getElementById('interactive-radio-group') as LithRadioGroup;
            rg.clearSelection();
          }}
        >
          清除选择
        </button>

        <button
          @click=${() => {
            const rg = document.getElementById('interactive-radio-group') as LithRadioGroup;
            rg.disabled = !rg.disabled;
          }}
        >
          切换禁用状态
        </button>

        <button
          @click=${() => {
            const rg = document.getElementById('interactive-radio-group') as LithRadioGroup;
            rg.readonly = !rg.readonly;
          }}
        >
          切换只读状态
        </button>

        <button
          @click=${() => {
            const rg = document.getElementById('interactive-radio-group') as LithRadioGroup;
            rg.orientation = rg.orientation === 'vertical' ? 'horizontal' : 'vertical';
          }}
        >
          切换布局方向
        </button>

        <button
          @click=${() => {
            const rg = document.getElementById('interactive-radio-group') as LithRadioGroup;
            console.log('当前值:', rg.value);
            console.log('所有选项值:', rg.getRadioValues());
            console.log('可用选项值:', rg.getEnabledRadioValues());
            console.log('验证状态:', rg.checkValidity());
          }}
        >
          记录状态
        </button>

        <button
          @click=${() => {
            const output = document.getElementById('radio-event-output');
            if (output) {
              output.innerHTML = '';
            }
          }}
        >
          清除日志
        </button>
      </div>

      <div
        style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; background: #f9fafb;"
      >
        <h4 style="margin-top: 0;">事件日志</h4>
        <div
          id="radio-event-output"
          style="font-family: monospace; font-size: 14px; color: #374151; min-height: 60px;"
        ></div>
      </div>
    </div>
  `,
};

export const ValidationExample: Story = {
  render: () => html`
    <form
      style="max-width: 500px;"
      @submit=${(e: Event) => {
        e.preventDefault();
        const rg = (e.target as HTMLFormElement)?.querySelector(
          'lith-radio-group'
        ) as LithRadioGroup;
        if (rg.checkValidity()) {
          alert('表单验证通过！');
        } else {
          rg.reportValidity();
        }
      }}
    >
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-top: 0;">表单验证示例</h3>
          <p style="color: #666;">此单选框组是必填项。尝试在未选择的情况下提交表单。</p>
        </div>

        <lith-radio-group
          name="required-option"
          label="必填选项"
          required
          validation-message="请选择一个选项才能继续"
        >
          <lith-radio value="yes">是</lith-radio>
          <lith-radio value="no">否</lith-radio>
          <lith-radio value="maybe">也许</lith-radio>
        </lith-radio-group>

        <div style="display: flex; gap: 8px;">
          <button type="submit">提交</button>
          <button type="reset">重置</button>
          <button
            type="button"
            @click=${(e: Event) => {
              const form = (e.target as HTMLElement)?.closest('form');
              const rg = form?.querySelector('lith-radio-group') as LithRadioGroup;
              rg.setCustomValidity('这是一个自定义验证错误消息');
              rg.reportValidity();
            }}
          >
            显示自定义错误
          </button>
          <button
            type="button"
            @click=${(e: Event) => {
              const form = (e.target as HTMLElement)?.closest('form');
              const rg = form?.querySelector('lith-radio-group') as LithRadioGroup;
              rg.setCustomValidity('');
            }}
          >
            清除自定义错误
          </button>
        </div>
      </div>
    </form>
  `,
};
