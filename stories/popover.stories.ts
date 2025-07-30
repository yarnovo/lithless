import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/feedback/lith-popover.js';

const meta: Meta = {
  title: 'Components/Popover',
  component: 'lith-popover',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Popover 是一个 Headless 弹出框组件，提供灵活的浮动内容定位和完整的交互逻辑。

## 特性

- 🎯 **智能定位** - 支持12种位置，自动翻转和偏移调整
- 🖱️ **多种触发** - 支持点击、悬停、聚焦和手动触发模式
- ⌨️ **键盘导航** - 支持 Escape 键关闭和焦点陷阱
- 🎨 **完全可定制** - Headless 设计，通过 CSS 自定义属性控制样式
- ♿ **可访问性** - 符合 ARIA 规范，支持屏幕阅读器

## 使用场景

- 作为其他组件的基础（如 Tooltip、DropdownMenu、Select 等）
- 显示额外信息或操作面板
- 构建自定义的浮动 UI 元素
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: '控制弹出框的显示状态',
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
      description: '弹出框的位置',
    },
    trigger: {
      control: 'select',
      options: ['click', 'hover', 'focus', 'manual'],
      description: '触发弹出框的方式',
    },
    showArrow: {
      control: 'boolean',
      description: '是否显示箭头指示器',
    },
    offset: {
      control: 'number',
      description: '弹出框与触发器的距离（像素）',
    },
    flip: {
      control: 'boolean',
      description: '当空间不足时是否自动翻转位置',
    },
    shift: {
      control: 'boolean',
      description: '当位置超出视窗时是否自动调整',
    },
    hoverDelay: {
      control: 'number',
      description: '悬停触发的延迟时间（毫秒）',
    },
    focusTrap: {
      control: 'boolean',
      description: '是否启用焦点陷阱',
    },
    closeOnEscape: {
      control: 'boolean',
      description: '是否支持 Escape 键关闭',
    },
    closeOnOutsideClick: {
      control: 'boolean',
      description: '是否支持点击外部关闭',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
    showArrow: false,
    offset: 8,
    flip: true,
    shift: true,
    hoverDelay: 100,
    focusTrap: false,
    closeOnEscape: true,
    closeOnOutsideClick: true,
  },
  render: (args) => html`
    <lith-popover
      ?open=${args.open}
      placement=${args.placement}
      trigger=${args.trigger}
      ?show-arrow=${args.showArrow}
      offset=${args.offset}
      ?flip=${args.flip}
      ?shift=${args.shift}
      hover-delay=${args.hoverDelay}
      ?focus-trap=${args.focusTrap}
      ?close-on-escape=${args.closeOnEscape}
      ?close-on-outside-click=${args.closeOnOutsideClick}
      style="--lith-popover-max-width: 200px;"
    >
      <button slot="trigger" style="padding: 8px 16px; cursor: pointer;">点击我</button>
      <div
        style="
        padding: 12px;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      "
      >
        这是弹出框的内容！
      </div>
    </lith-popover>
  `,
};

export const WithArrow: Story = {
  args: {
    ...Default.args,
    showArrow: true,
  },
  render: (args) => html`
    <lith-popover
      ?open=${args.open}
      placement=${args.placement}
      trigger=${args.trigger}
      ?show-arrow=${args.showArrow}
      offset=${args.offset}
      ?flip=${args.flip}
      ?shift=${args.shift}
      hover-delay=${args.hoverDelay}
      ?focus-trap=${args.focusTrap}
      ?close-on-escape=${args.closeOnEscape}
      ?close-on-outside-click=${args.closeOnOutsideClick}
      style="--lith-popover-max-width: 200px;"
    >
      <button slot="trigger" style="padding: 8px 16px; cursor: pointer;">带箭头</button>
      <div
        style="
        padding: 12px;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 6px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      "
      >
        这个弹出框有一个箭头指示器！
      </div>
    </lith-popover>
  `,
};

export const HoverTrigger: Story = {
  args: {
    ...Default.args,
    trigger: 'hover',
    showArrow: true,
  },
  render: (args) => html`
    <lith-popover
      ?open=${args.open}
      placement=${args.placement}
      trigger=${args.trigger}
      ?show-arrow=${args.showArrow}
      offset=${args.offset}
      ?flip=${args.flip}
      ?shift=${args.shift}
      hover-delay=${args.hoverDelay}
      ?focus-trap=${args.focusTrap}
      ?close-on-escape=${args.closeOnEscape}
      ?close-on-outside-click=${args.closeOnOutsideClick}
      style="--lith-popover-max-width: 250px;"
    >
      <button slot="trigger" style="padding: 8px 16px; cursor: pointer;">悬停我</button>
      <div
        style="
        padding: 12px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      "
      >
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">悬停提示</h4>
        <p style="margin: 0; font-size: 12px; color: #6c757d;">
          当鼠标悬停在触发器上时显示此内容。
        </p>
      </div>
    </lith-popover>
  `,
};

export const FocusTrigger: Story = {
  args: {
    ...Default.args,
    trigger: 'focus',
    showArrow: true,
  },
  render: (args) => html`
    <lith-popover
      ?open=${args.open}
      placement=${args.placement}
      trigger=${args.trigger}
      ?show-arrow=${args.showArrow}
      offset=${args.offset}
      ?flip=${args.flip}
      ?shift=${args.shift}
      hover-delay=${args.hoverDelay}
      ?focus-trap=${args.focusTrap}
      ?close-on-escape=${args.closeOnEscape}
      ?close-on-outside-click=${args.closeOnOutsideClick}
      style="--lith-popover-max-width: 200px;"
    >
      <input
        slot="trigger"
        placeholder="聚焦我"
        style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
      />
      <div
        style="
        padding: 12px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      "
      >
        当输入框获得焦点时显示此帮助信息。
      </div>
    </lith-popover>
  `,
};

export const AllPlacements: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 100px;">
      ${[
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ].map(
        (placement) => html`
          <lith-popover
            placement=${placement}
            show-arrow
            trigger="hover"
            style="--lith-popover-max-width: 120px;"
          >
            <button slot="trigger" style="padding: 8px 12px; cursor: pointer; width: 100%;">
              ${placement}
            </button>
            <div
              style="
            padding: 8px;
            background: white;
            border: 1px solid #e1e5e9;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            font-size: 12px;
          "
            >
              ${placement}
            </div>
          </lith-popover>
        `
      )}
    </div>
  `,
};

export const CustomStyling: Story = {
  args: {
    ...Default.args,
    showArrow: true,
    placement: 'bottom-start',
  },
  render: (args) => html`
    <lith-popover
      ?open=${args.open}
      placement=${args.placement}
      trigger=${args.trigger}
      ?show-arrow=${args.showArrow}
      offset=${args.offset}
      ?flip=${args.flip}
      ?shift=${args.shift}
      hover-delay=${args.hoverDelay}
      ?focus-trap=${args.focusTrap}
      ?close-on-escape=${args.closeOnEscape}
      ?close-on-outside-click=${args.closeOnOutsideClick}
      style="
        --lith-popover-max-width: 300px;
        --lith-popover-offset: 12px;
        --lith-popover-z-index: 2000;
        --lith-popover-transition-duration: 300ms;
        --lith-popover-arrow-size: 12px;
      "
    >
      <button
        slot="trigger"
        style="
        padding: 12px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
      "
      >
        自定义样式
      </button>
      <div
        style="
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
      "
      >
        <h3 style="margin: 0 0 12px 0; font-size: 16px;">自定义弹出框</h3>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">
          这个弹出框使用了自定义的 CSS 属性来控制样式，包括偏移量、过渡时间和箭头大小。
        </p>
      </div>
    </lith-popover>
  `,
};

export const WithFocusTrap: Story = {
  args: {
    ...Default.args,
    focusTrap: true,
    showArrow: true,
  },
  render: (args) => html`
    <lith-popover
      ?open=${args.open}
      placement=${args.placement}
      trigger=${args.trigger}
      ?show-arrow=${args.showArrow}
      offset=${args.offset}
      ?flip=${args.flip}
      ?shift=${args.shift}
      hover-delay=${args.hoverDelay}
      ?focus-trap=${args.focusTrap}
      ?close-on-escape=${args.closeOnEscape}
      ?close-on-outside-click=${args.closeOnOutsideClick}
      style="--lith-popover-max-width: 280px;"
    >
      <button slot="trigger" style="padding: 8px 16px; cursor: pointer;">焦点陷阱示例</button>
      <div
        style="
        padding: 16px;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      "
      >
        <h4 style="margin: 0 0 12px 0; font-size: 14px;">表单示例</h4>
        <form style="display: flex; flex-direction: column; gap: 8px;">
          <input
            placeholder="姓名"
            style="padding: 6px; border: 1px solid #ccc; border-radius: 4px;"
          />
          <input
            placeholder="邮箱"
            type="email"
            style="padding: 6px; border: 1px solid #ccc; border-radius: 4px;"
          />
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button
              type="submit"
              style="flex: 1; padding: 6px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              提交
            </button>
            <button
              type="button"
              style="flex: 1; padding: 6px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </lith-popover>
  `,
};

export const Manual: Story = {
  args: {
    ...Default.args,
    trigger: 'manual',
    showArrow: true,
  },
  render: (args) => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <lith-popover
        id="manual-popover"
        ?open=${args.open}
        placement=${args.placement}
        trigger=${args.trigger}
        ?show-arrow=${args.showArrow}
        offset=${args.offset}
        ?flip=${args.flip}
        ?shift=${args.shift}
        hover-delay=${args.hoverDelay}
        ?focus-trap=${args.focusTrap}
        ?close-on-escape=${args.closeOnEscape}
        ?close-on-outside-click=${args.closeOnOutsideClick}
        style="--lith-popover-max-width: 200px;"
      >
        <span
          slot="trigger"
          style="
          padding: 8px 12px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
        "
        >
          目标元素
        </span>
        <div
          style="
          padding: 12px;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        "
        >
          这是通过编程方式控制的弹出框！
        </div>
      </lith-popover>

      <button
        style="padding: 8px 16px; cursor: pointer;"
        onclick="document.getElementById('manual-popover').show()"
      >
        显示
      </button>
      <button
        style="padding: 8px 16px; cursor: pointer;"
        onclick="document.getElementById('manual-popover').hide()"
      >
        隐藏
      </button>
      <button
        style="padding: 8px 16px; cursor: pointer;"
        onclick="document.getElementById('manual-popover').toggle()"
      >
        切换
      </button>
    </div>
  `,
};

export const LongContent: Story = {
  args: {
    ...Default.args,
    showArrow: true,
    placement: 'right',
  },
  render: (args) => html`
    <lith-popover
      ?open=${args.open}
      placement=${args.placement}
      trigger=${args.trigger}
      ?show-arrow=${args.showArrow}
      offset=${args.offset}
      ?flip=${args.flip}
      ?shift=${args.shift}
      hover-delay=${args.hoverDelay}
      ?focus-trap=${args.focusTrap}
      ?close-on-escape=${args.closeOnEscape}
      ?close-on-outside-click=${args.closeOnOutsideClick}
      style="--lith-popover-max-width: 320px; --lith-popover-max-height: 200px;"
    >
      <button slot="trigger" style="padding: 8px 16px; cursor: pointer;">长内容示例</button>
      <div
        style="
        padding: 16px;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
      "
      >
        <h4 style="margin: 0 0 12px 0; font-size: 14px;">长内容演示</h4>
        <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.4;">
          这是一个包含长内容的弹出框示例。当内容超过最大高度时，会自动显示滚动条。
        </p>
        <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.4;">
          弹出框会根据可用空间自动调整位置，确保内容始终可见。
        </p>
        <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.4;">
          你可以通过 CSS 自定义属性来控制弹出框的最大宽度和高度。
        </p>
        <p style="margin: 0; font-size: 13px; line-height: 1.4;">
          这样可以确保弹出框在各种屏幕尺寸下都能正常工作。
        </p>
      </div>
    </lith-popover>
  `,
};
