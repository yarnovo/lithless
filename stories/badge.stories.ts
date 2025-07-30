import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, userEvent } from '@storybook/test';
import '../src/components/data-display/lith-badge.js';

const meta: Meta = {
  title: 'Data Display/Badge',
  component: 'lith-badge',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Badge 组件

Badge 组件用于显示状态、标签或其他小段信息。它支持多种变体、尺寸和交互模式。

## 特性

- **多种变体**: default、secondary、destructive、outline
- **尺寸选项**: sm、default、lg
- **点状徽标**: 支持数字或最小化显示模式
- **交互支持**: 可点击的徽标
- **可访问性**: 完整的键盘导航和屏幕阅读器支持
- **可定制**: 支持 CSS 变量主题定制

## 使用场景

- 状态指示器
- 数量计数器
- 标签分类
- 通知徽标
- 用户角色标识
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: '徽标的视觉变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: '徽标的尺寸',
    },
    dot: {
      control: 'boolean',
      description: '是否显示为点状徽标（适合数字显示）',
    },
    interactive: {
      control: 'boolean',
      description: '是否可交互（可点击）',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用交互',
    },
  },
};

export default meta;
type Story = StoryObj;

// 基础示例
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    dot: false,
    interactive: false,
    disabled: false,
  },
  render: (args) => html`
    <lith-badge
      variant=${args.variant}
      size=${args.size}
      ?dot=${args.dot}
      ?interactive=${args.interactive}
      ?disabled=${args.disabled}
    >
      Badge
    </lith-badge>
  `,
};

// 所有变体
export const Variants: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <lith-badge variant="default">Default</lith-badge>
      <lith-badge variant="secondary">Secondary</lith-badge>
      <lith-badge variant="destructive">Destructive</lith-badge>
      <lith-badge variant="outline">Outline</lith-badge>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的徽标变体样式。',
      },
    },
  },
};

// 尺寸变化
export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <lith-badge size="sm">Small</lith-badge>
      <lith-badge size="default">Default</lith-badge>
      <lith-badge size="lg">Large</lith-badge>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '展示不同尺寸的徽标。',
      },
    },
  },
};

// 点状徽标
export const DotBadges: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <lith-badge dot variant="default">1</lith-badge>
      <lith-badge dot variant="secondary">5</lith-badge>
      <lith-badge dot variant="destructive">99</lith-badge>
      <lith-badge dot variant="outline">•</lith-badge>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '点状徽标适合显示数字或最小化内容，通常用作通知计数器。',
      },
    },
  },
};

// 交互式徽标
export const Interactive: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <lith-badge interactive variant="default">Clickable</lith-badge>
      <lith-badge interactive variant="secondary">Click me</lith-badge>
      <lith-badge interactive variant="outline">Interactive</lith-badge>
      <lith-badge interactive disabled>Disabled</lith-badge>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '交互式徽标可以响应点击和键盘事件，适合用作标签选择器或操作按钮。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // 找到第一个可交互的徽标
    const interactiveBadge = canvasElement.querySelector('lith-badge[interactive]:not([disabled])');
    expect(interactiveBadge).toBeTruthy();

    // 验证可交互徽标有正确的属性
    expect(interactiveBadge?.getAttribute('tabindex')).toBe('0');
    expect(interactiveBadge?.getAttribute('role')).toBe('button');

    // 测试点击交互
    if (interactiveBadge) {
      let clickEventFired = false;
      interactiveBadge.addEventListener('lith-badge-click', () => {
        clickEventFired = true;
      });

      await userEvent.click(interactiveBadge as HTMLElement);
      expect(clickEventFired).toBe(true);
    }
  },
};

// 带图标的徽标
export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <lith-badge variant="default">
        <span style="margin-right: 4px;">🟢</span>
        Online
      </lith-badge>
      <lith-badge variant="secondary">
        <span style="margin-right: 4px;">⭐</span>
        Featured
      </lith-badge>
      <lith-badge variant="destructive">
        <span style="margin-right: 4px;">❌</span>
        Error
      </lith-badge>
      <lith-badge variant="outline">
        <span style="margin-right: 4px;">🔒</span>
        Locked
      </lith-badge>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '徽标可以包含图标和文本，增强视觉表达力。',
      },
    },
  },
};

// 使用场景示例
export const UseCases: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- 状态指示器 -->
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">状态指示器</h4>
        <div style="display: flex; gap: 8px; align-items: center;">
          <lith-badge variant="default">Active</lith-badge>
          <lith-badge variant="secondary">Pending</lith-badge>
          <lith-badge variant="destructive">Failed</lith-badge>
          <lith-badge variant="outline">Draft</lith-badge>
        </div>
      </div>

      <!-- 数量计数器 -->
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">数量计数器</h4>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span>Messages</span>
          <lith-badge dot variant="destructive">3</lith-badge>
          <span>Notifications</span>
          <lith-badge dot variant="default">12</lith-badge>
          <span>Updates</span>
          <lith-badge dot variant="secondary">99+</lith-badge>
        </div>
      </div>

      <!-- 标签分类 -->
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">标签分类</h4>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <lith-badge interactive variant="outline">React</lith-badge>
          <lith-badge interactive variant="outline">TypeScript</lith-badge>
          <lith-badge interactive variant="outline">Web Components</lith-badge>
          <lith-badge interactive variant="outline">CSS</lith-badge>
        </div>
      </div>

      <!-- 用户角色 -->
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">用户角色</h4>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span>John Doe</span>
          <lith-badge size="sm" variant="default">Admin</lith-badge>
          <span>Jane Smith</span>
          <lith-badge size="sm" variant="secondary">Editor</lith-badge>
          <span>Bob Wilson</span>
          <lith-badge size="sm" variant="outline">Viewer</lith-badge>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '展示 Badge 组件在不同场景下的实际应用。',
      },
    },
  },
};

// 自定义样式
export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-badge {
        --lith-badge-default-bg: #6366f1;
        --lith-badge-default-hover-bg: #5b21b6;
        --lith-badge-border-radius: 16px;
        --lith-badge-font-weight: 700;
      }

      .gradient-badge {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        --lith-badge-border-radius: 20px;
      }

      .rounded-badge {
        --lith-badge-border-radius: 20px;
        --lith-badge-padding-x: 16px;
      }
    </style>

    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <lith-badge class="custom-badge">Custom Colors</lith-badge>
      <lith-badge class="gradient-badge" variant="outline">Gradient</lith-badge>
      <lith-badge class="rounded-badge" variant="secondary">Rounded</lith-badge>
      <lith-badge style="--lith-badge-default-bg: #f59e0b; --lith-badge-default-color: #1f2937;">
        CSS Variables
      </lith-badge>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '通过 CSS 变量和自定义类名实现个性化样式。',
      },
    },
  },
};

// 可访问性测试
export const Accessibility: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <h4>键盘导航测试</h4>
        <div style="display: flex; gap: 8px;">
          <lith-badge interactive>Tab 1</lith-badge>
          <lith-badge interactive>Tab 2</lith-badge>
          <lith-badge interactive disabled>Disabled</lith-badge>
          <lith-badge interactive>Tab 3</lith-badge>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 8px;">
          使用 Tab 键导航，Enter 或空格键激活
        </p>
      </div>

      <div>
        <h4>屏幕阅读器支持</h4>
        <div style="display: flex; gap: 8px;">
          <lith-badge role="status" aria-label="新消息通知">
            <span aria-hidden="true">📧</span>
            <span>5 new messages</span>
          </lith-badge>
          <lith-badge variant="destructive" role="alert" aria-label="错误状态"> Error </lith-badge>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '展示 Badge 组件的可访问性功能，包括键盘导航和屏幕阅读器支持。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // 查找所有可交互的徽标
    const interactiveBadges = canvasElement.querySelectorAll(
      'lith-badge[interactive]:not([disabled])'
    );

    // 验证每个交互式徽标都有正确的 ARIA 属性
    interactiveBadges.forEach((badge) => {
      expect(badge.getAttribute('role')).toBe('button');
      expect(badge.getAttribute('tabindex')).toBe('0');
    });

    // 测试第一个徽标的键盘交互
    if (interactiveBadges.length > 0) {
      const firstBadge = interactiveBadges[0] as HTMLElement;

      let keyboardEventFired = false;
      firstBadge.addEventListener('lith-badge-click', () => {
        keyboardEventFired = true;
      });

      // 先聚焦元素
      firstBadge.focus();

      // 然后测试 Enter 键
      await userEvent.keyboard('{Enter}');
      expect(keyboardEventFired).toBe(true);
    }
  },
};
