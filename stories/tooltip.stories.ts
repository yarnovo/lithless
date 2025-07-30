import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
// import { expect, within, userEvent, fn } from '@storybook/test';
import '../src/components/feedback/lith-tooltip';
import type { LithTooltip } from '../src/components/feedback/lith-tooltip';

const meta = {
  title: 'Feedback/Tooltip',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="padding: 100px; display: flex; justify-content: center;">
      <lith-tooltip
        content=${args.content}
        placement=${args.placement}
        offset=${args.offset}
        show-delay=${args.showDelay}
        hide-delay=${args.hideDelay}
        ?disabled=${args.disabled}
        ?arrow=${args.arrow}
      >
        <button style="padding: 8px 16px; cursor: pointer;">
          ${args.triggerText || 'Hover me'}
        </button>
      </lith-tooltip>
    </div>
  `,
  argTypes: {
    content: {
      control: 'text',
      description: 'Tooltip 内容',
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
      description: 'Tooltip 位置',
    },
    offset: {
      control: 'number',
      description: '距离触发元素的偏移量',
    },
    showDelay: {
      control: 'number',
      description: '显示延迟时间（毫秒）',
    },
    hideDelay: {
      control: 'number',
      description: '隐藏延迟时间（毫秒）',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    arrow: {
      control: 'boolean',
      description: '是否显示箭头',
    },
  },
  args: {
    content: '这是一个 Tooltip',
    placement: 'top',
    offset: 8,
    showDelay: 600,
    hideDelay: 0,
    disabled: false,
    arrow: true,
  },
} satisfies Meta<LithTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认',
};

export const Placements: Story = {
  name: '位置展示',
  render: () => html`
    <div
      style="padding: 200px; display: grid; gap: 20px; grid-template-columns: repeat(3, 1fr); max-width: 600px; margin: 0 auto;"
    >
      <div style="grid-column: 2;">
        <lith-tooltip content="top-start" placement="top-start">
          <button style="width: 100%; padding: 8px;">top-start</button>
        </lith-tooltip>
      </div>
      <div style="grid-column: 2;">
        <lith-tooltip content="top" placement="top">
          <button style="width: 100%; padding: 8px;">top</button>
        </lith-tooltip>
      </div>
      <div style="grid-column: 2;">
        <lith-tooltip content="top-end" placement="top-end">
          <button style="width: 100%; padding: 8px;">top-end</button>
        </lith-tooltip>
      </div>

      <div>
        <lith-tooltip content="left-start" placement="left-start">
          <button style="width: 100%; padding: 8px;">left-start</button>
        </lith-tooltip>
      </div>
      <div style="grid-column: 3;">
        <lith-tooltip content="right-start" placement="right-start">
          <button style="width: 100%; padding: 8px;">right-start</button>
        </lith-tooltip>
      </div>

      <div>
        <lith-tooltip content="left" placement="left">
          <button style="width: 100%; padding: 8px;">left</button>
        </lith-tooltip>
      </div>
      <div style="grid-column: 3;">
        <lith-tooltip content="right" placement="right">
          <button style="width: 100%; padding: 8px;">right</button>
        </lith-tooltip>
      </div>

      <div>
        <lith-tooltip content="left-end" placement="left-end">
          <button style="width: 100%; padding: 8px;">left-end</button>
        </lith-tooltip>
      </div>
      <div style="grid-column: 3;">
        <lith-tooltip content="right-end" placement="right-end">
          <button style="width: 100%; padding: 8px;">right-end</button>
        </lith-tooltip>
      </div>

      <div style="grid-column: 2;">
        <lith-tooltip content="bottom-start" placement="bottom-start">
          <button style="width: 100%; padding: 8px;">bottom-start</button>
        </lith-tooltip>
      </div>
      <div style="grid-column: 2;">
        <lith-tooltip content="bottom" placement="bottom">
          <button style="width: 100%; padding: 8px;">bottom</button>
        </lith-tooltip>
      </div>
      <div style="grid-column: 2;">
        <lith-tooltip content="bottom-end" placement="bottom-end">
          <button style="width: 100%; padding: 8px;">bottom-end</button>
        </lith-tooltip>
      </div>
    </div>
  `,
};

export const LongContent: Story = {
  name: '长文本内容',
  render: () => html`
    <div style="padding: 100px; display: flex; gap: 20px; justify-content: center;">
      <lith-tooltip
        content="这是一段很长的 Tooltip 内容，它会自动换行以适应最大宽度的限制。你可以通过 CSS 变量来自定义最大宽度。"
      >
        <button style="padding: 8px 16px;">长文本 Tooltip</button>
      </lith-tooltip>

      <lith-tooltip content="短文本">
        <button style="padding: 8px 16px;">短文本 Tooltip</button>
      </lith-tooltip>
    </div>
  `,
};

export const CustomDelay: Story = {
  name: '自定义延迟',
  render: () => html`
    <div style="padding: 100px; display: flex; gap: 20px; justify-content: center;">
      <lith-tooltip content="立即显示" show-delay="0">
        <button style="padding: 8px 16px;">无延迟</button>
      </lith-tooltip>

      <lith-tooltip content="延迟 1 秒显示" show-delay="1000">
        <button style="padding: 8px 16px;">延迟 1 秒</button>
      </lith-tooltip>

      <lith-tooltip content="延迟隐藏" hide-delay="500">
        <button style="padding: 8px 16px;">延迟隐藏</button>
      </lith-tooltip>
    </div>
  `,
};

export const WithoutArrow: Story = {
  name: '无箭头',
  render: () => html`
    <div style="padding: 100px; display: flex; gap: 20px; justify-content: center;">
      <lith-tooltip content="有箭头的 Tooltip" arrow>
        <button style="padding: 8px 16px;">有箭头</button>
      </lith-tooltip>

      <lith-tooltip content="无箭头的 Tooltip" ?arrow=${false}>
        <button style="padding: 8px 16px;">无箭头</button>
      </lith-tooltip>
    </div>
  `,
};

export const Disabled: Story = {
  name: '禁用状态',
  render: () => html`
    <div style="padding: 100px; display: flex; gap: 20px; justify-content: center;">
      <lith-tooltip content="正常的 Tooltip">
        <button style="padding: 8px 16px;">正常</button>
      </lith-tooltip>

      <lith-tooltip content="这个 Tooltip 被禁用了" disabled>
        <button style="padding: 8px 16px;">禁用的 Tooltip</button>
      </lith-tooltip>
    </div>
  `,
};

export const DifferentTriggers: Story = {
  name: '不同触发元素',
  render: () => html`
    <div
      style="padding: 100px; display: flex; gap: 20px; justify-content: center; align-items: center;"
    >
      <lith-tooltip content="按钮 Tooltip">
        <button style="padding: 8px 16px;">按钮</button>
      </lith-tooltip>

      <lith-tooltip content="链接 Tooltip">
        <a href="#" style="color: #007bff;">链接</a>
      </lith-tooltip>

      <lith-tooltip content="文本 Tooltip">
        <span style="text-decoration: underline; cursor: help;">文本</span>
      </lith-tooltip>

      <lith-tooltip content="图标 Tooltip">
        <span style="font-size: 24px; cursor: help;">ℹ️</span>
      </lith-tooltip>

      <lith-tooltip content="输入框 Tooltip">
        <input type="text" placeholder="聚焦显示 Tooltip" style="padding: 8px;" />
      </lith-tooltip>
    </div>
  `,
};

export const CustomStyles: Story = {
  name: '自定义样式',
  render: () => html`
    <style>
      .custom-tooltip {
        --lith-tooltip-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --lith-tooltip-color: white;
        --lith-tooltip-padding: 12px 20px;
        --lith-tooltip-radius: 8px;
        --lith-tooltip-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }

      .dark-tooltip {
        --lith-tooltip-bg: #1a1a1a;
        --lith-tooltip-color: #ffffff;
        --lith-tooltip-font-size: 12px;
      }

      .light-tooltip {
        --lith-tooltip-bg: #ffffff;
        --lith-tooltip-color: #333333;
        --lith-tooltip-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    </style>

    <div style="padding: 100px; display: flex; gap: 20px; justify-content: center;">
      <lith-tooltip content="渐变背景 Tooltip" class="custom-tooltip">
        <button style="padding: 8px 16px;">渐变样式</button>
      </lith-tooltip>

      <lith-tooltip content="深色主题 Tooltip" class="dark-tooltip">
        <button style="padding: 8px 16px;">深色主题</button>
      </lith-tooltip>

      <lith-tooltip content="浅色主题 Tooltip" class="light-tooltip">
        <button style="padding: 8px 16px;">浅色主题</button>
      </lith-tooltip>
    </div>
  `,
};

export const GlobalDelayDemo: Story = {
  name: '全局延迟演示',
  render: () => html`
    <div style="padding: 100px;">
      <h3 style="margin-bottom: 20px;">首次悬停有延迟，后续悬停无延迟</h3>
      <div style="display: flex; gap: 20px;">
        <lith-tooltip content="Tooltip 1">
          <button style="padding: 8px 16px;">按钮 1</button>
        </lith-tooltip>

        <lith-tooltip content="Tooltip 2">
          <button style="padding: 8px 16px;">按钮 2</button>
        </lith-tooltip>

        <lith-tooltip content="Tooltip 3">
          <button style="padding: 8px 16px;">按钮 3</button>
        </lith-tooltip>

        <lith-tooltip content="Tooltip 4">
          <button style="padding: 8px 16px;">按钮 4</button>
        </lith-tooltip>
      </div>
      <p style="margin-top: 20px; color: #666;">
        提示：首次悬停任意按钮会有 600ms 延迟，之后快速切换到其他按钮将立即显示 Tooltip
      </p>
    </div>
  `,
};

export const EdgeDetection: Story = {
  name: '边缘检测',
  render: () => html`
    <div style="padding: 20px; height: 400px; position: relative; border: 1px solid #ccc;">
      <div style="position: absolute; top: 10px; left: 10px;">
        <lith-tooltip content="这个 Tooltip 会自动调整位置以避免超出视口" placement="top">
          <button style="padding: 8px 16px;">左上角</button>
        </lith-tooltip>
      </div>

      <div style="position: absolute; top: 10px; right: 10px;">
        <lith-tooltip content="这个 Tooltip 会自动调整位置以避免超出视口" placement="top">
          <button style="padding: 8px 16px;">右上角</button>
        </lith-tooltip>
      </div>

      <div style="position: absolute; bottom: 10px; left: 10px;">
        <lith-tooltip content="这个 Tooltip 会自动调整位置以避免超出视口" placement="bottom">
          <button style="padding: 8px 16px;">左下角</button>
        </lith-tooltip>
      </div>

      <div style="position: absolute; bottom: 10px; right: 10px;">
        <lith-tooltip content="这个 Tooltip 会自动调整位置以避免超出视口" placement="bottom">
          <button style="padding: 8px 16px;">右下角</button>
        </lith-tooltip>
      </div>
    </div>
  `,
};

export const InteractionTest: Story = {
  name: '交互测试',
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);

  //   // 等待组件渲染
  //   await new Promise((resolve) => setTimeout(resolve, 100));

  //   // 获取按钮
  //   const button = canvas.getByText('Hover me');

  //   // 鼠标悬停
  //   await userEvent.hover(button);

  //   // 等待 tooltip 显示（包含延迟）
  //   await new Promise((resolve) => setTimeout(resolve, 700));

  //   // 验证 tooltip 显示
  //   const tooltip = canvasElement.querySelector('[part="content"]');
  //   expect(tooltip).toBeTruthy();
  //   expect(tooltip?.textContent).toBe('这是一个 Tooltip');

  //   // 鼠标移开
  //   await userEvent.unhover(button);

  //   // 等待 tooltip 隐藏
  //   await new Promise((resolve) => setTimeout(resolve, 100));

  //   // 验证 tooltip 隐藏
  //   const hiddenTooltip = canvasElement.querySelector('[part="content"]');
  //   expect(hiddenTooltip).toBeFalsy();
  // },
};
