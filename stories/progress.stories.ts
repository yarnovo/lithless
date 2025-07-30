import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, within } from '@storybook/test';
import '../src/components/feedback/lith-progress.ts';
import type { LithProgress } from '../src/components/feedback/lith-progress.ts';

const meta: Meta = {
  title: 'Components/Progress',
  component: 'lith-progress',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
进度条组件用于显示任务的完成进度，通常以进度条的形式呈现。

## 特性
- 支持确定和不确定状态
- 完整的可访问性支持 (ARIA)
- 自定义样式支持
- 平滑的过渡动画
- 自定义标签函数

## CSS 自定义属性
- \`--lith-progress-height\`: 进度条高度 (默认: 8px)
- \`--lith-progress-border-radius\`: 边框圆角 (默认: 9999px)
- \`--lith-progress-track-color\`: 轨道颜色 (默认: #e2e8f0)
- \`--lith-progress-indicator-color\`: 指示器颜色 (默认: #3b82f6)
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '当前进度值 (0-100)，不设置时为不确定状态',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: '最大值，默认为 100',
    },
    getValueLabel: {
      control: false,
      description: '自定义可访问性标签函数',
    },
  },
  args: {
    value: 50,
    max: 100,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="width: 300px;">
      <lith-progress .value=${args.value} .max=${args.max}></lith-progress>
    </div>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const progress = canvasElement.querySelector('lith-progress');

    // 检查组件渲染
    expect(progress).toBeInTheDocument();

    // 等待组件更新
    await progress?.updateComplete;

    // 检查可访问性属性
    const progressBar = progress?.shadowRoot?.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('role', 'progressbar');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');

    // 检查 data 属性
    expect(progress).toHaveAttribute('data-state', 'loading');
    expect(progress).toHaveAttribute('data-value', '50');
    expect(progress).toHaveAttribute('data-max', '100');
  },
};

export const Indeterminate: Story = {
  args: {
    value: undefined,
  },
  render: (args) => html`
    <div style="width: 300px;">
      <lith-progress .max=${args.max}></lith-progress>
    </div>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const progress = canvasElement.querySelector('lith-progress');

    // 等待组件更新
    await progress?.updateComplete;

    // 检查不确定状态
    expect(progress).toHaveAttribute('data-state', 'indeterminate');

    const progressBar = progress?.shadowRoot?.querySelector('[role="progressbar"]');
    expect(progressBar).not.toHaveAttribute('aria-valuenow');
    expect(progressBar).toHaveAttribute('aria-valuetext', 'Loading...');
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
  render: (args) => html`
    <div style="width: 300px;">
      <lith-progress .value=${args.value} .max=${args.max}></lith-progress>
    </div>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const progress = canvasElement.querySelector('lith-progress');

    // 等待组件更新
    await progress?.updateComplete;

    // 检查完成状态
    expect(progress).toHaveAttribute('data-state', 'complete');
    expect(progress).toHaveAttribute('data-value', '100');
  },
};

export const CustomMax: Story = {
  args: {
    value: 75,
    max: 150,
  },
  render: (args) => html`
    <div style="width: 300px;">
      <lith-progress .value=${args.value} .max=${args.max}></lith-progress>
    </div>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const progress = canvasElement.querySelector('lith-progress');

    // 等待组件更新
    await progress?.updateComplete;

    // 检查自定义最大值
    const progressBar = progress?.shadowRoot?.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuemax', '150');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progress).toHaveAttribute('data-max', '150');
  },
};

export const WithCustomLabel: Story = {
  args: {
    value: 25,
    max: 100,
  },
  render: (args) => html`
    <div style="width: 300px;">
      <lith-progress
        .value=${args.value}
        .max=${args.max}
        .getValueLabel=${(value: number, max: number) => `已完成 ${value} / ${max} 项任务`}
      ></lith-progress>
    </div>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const progress = canvasElement.querySelector('lith-progress');

    // 等待组件更新
    await progress?.updateComplete;

    // 检查自定义标签
    const progressBar = progress?.shadowRoot?.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuetext', '已完成 25 / 100 项任务');
  },
};

export const Animated: Story = {
  render: () => {
    let progress = 0;
    const updateProgress = () => {
      progress = (progress + 10) % 110;
      const element = document.querySelector('#animated-progress') as LithProgress;
      if (element) {
        element.value = progress === 100 ? undefined : progress;
      }
      setTimeout(updateProgress, 500);
    };

    setTimeout(updateProgress, 100);

    return html`
      <div style="width: 300px;">
        <lith-progress id="animated-progress" .value=${0}></lith-progress>
        <p style="margin-top: 16px; text-align: center; color: #666; font-size: 14px;">
          自动动画演示
        </p>
      </div>
    `;
  },
};

export const CustomStyling: Story = {
  args: {
    value: 60,
  },
  render: (args) => html`
    <div style="width: 300px;">
      <lith-progress
        .value=${args.value}
        style="
          --lith-progress-height: 12px;
          --lith-progress-border-radius: 6px;
          --lith-progress-track-color: #fef3c7;
          --lith-progress-indicator-color: #f59e0b;
        "
      ></lith-progress>
      <p style="margin-top: 16px; text-align: center; color: #666; font-size: 14px;">
        自定义样式：橙色主题，12px 高度
      </p>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="width: 300px; display: flex; flex-direction: column; gap: 16px;">
      <div>
        <p style="margin-bottom: 8px; font-size: 14px; color: #666;">小尺寸 (4px)</p>
        <lith-progress .value=${30} style="--lith-progress-height: 4px;"></lith-progress>
      </div>

      <div>
        <p style="margin-bottom: 8px; font-size: 14px; color: #666;">默认尺寸 (8px)</p>
        <lith-progress .value=${50}></lith-progress>
      </div>

      <div>
        <p style="margin-bottom: 8px; font-size: 14px; color: #666;">大尺寸 (16px)</p>
        <lith-progress .value=${70} style="--lith-progress-height: 16px;"></lith-progress>
      </div>
    </div>
  `,
};
