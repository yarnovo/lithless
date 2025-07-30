import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, userEvent } from '@storybook/test';
import '../src/components/feedback/lith-alert.js';

const meta: Meta = {
  title: 'Components/Alert',
  component: 'lith-alert',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Alert 是一个警告提示组件，用于显示引起用户注意的重要信息。

## 特性

- 🚨 **引起注意** - 专为用户关注设计的提示组件
- 🎨 **多种变体** - 支持 default 和 destructive 两种变体
- 🔧 **灵活内容** - 支持图标、标题和描述内容
- 🔒 **可关闭** - 可选的关闭功能
- 🎯 **语义化** - 正确的 ARIA 角色和属性
- ♿ **可访问性** - 完整的键盘导航和屏幕阅读器支持

## 与其他反馈组件的区别

- **Alert**: 静态的警告提示，通常嵌入页面内容中
- **Toast**: 临时的反馈消息，自动消失，通常浮动显示  
- **Notification**: 持久的通知消息，需要用户手动关闭

## 使用场景

- 表单验证错误提示
- 系统状态变更通知
- 操作结果反馈
- 重要信息提醒

## 使用方式

\`\`\`html
<!-- 基础用法 -->
<lith-alert variant="default">
  <div slot="icon">🔔</div>
  <div slot="title">系统提示</div>
  <p>这是一条重要的系统消息。</p>
</lith-alert>

<!-- 错误提示 -->
<lith-alert variant="destructive" closable>
  <div slot="title">操作失败</div>
  <p>请检查输入信息后重试。</p>
</lith-alert>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: '警告提示变体',
    },
    title: {
      control: 'text',
      description: '标题文本',
    },
    closable: {
      control: 'boolean',
      description: '是否可关闭',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Heads up!',
    closable: false,
  },
  render: (args) => html`
    <lith-alert variant=${args.variant} title=${args.title} ?closable=${args.closable}>
      <div slot="icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="4,17 10,11 4,5"></polyline>
          <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
      </div>
      You can add components and dependencies to your app using the cli.
    </lith-alert>
  `,
  play: async ({ canvasElement, args }) => {
    // Wait for component to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    const alert = canvasElement.querySelector('lith-alert');
    expect(alert).toBeTruthy();
    expect(alert?.getAttribute('variant')).toBe(args.variant);

    // Check role and ARIA attributes
    const container = alert?.shadowRoot?.querySelector('[role="alert"]');
    expect(container).toBeTruthy();
    expect(container?.getAttribute('aria-live')).toBe('polite');
  },
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <lith-alert variant="default">
        <div slot="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="4,17 10,11 4,5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
        </div>
        <div slot="title">Default Alert</div>
        This is a default alert with icon and title.
      </lith-alert>

      <lith-alert variant="destructive">
        <div slot="title">Destructive Alert</div>
        This is a destructive alert to indicate errors or dangerous actions.
      </lith-alert>
    </div>
  `,
};

export const WithTitleOnly: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <lith-alert variant="default">
        <div slot="icon">🎉</div>
        <div slot="title">This Alert has a title and an icon. No description.</div>
      </lith-alert>

      <lith-alert variant="destructive">
        <div slot="title">Error: Something went wrong!</div>
      </lith-alert>
    </div>
  `,
};

export const WithoutIcon: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <lith-alert variant="default">
        <div slot="title">Information</div>
        This alert doesn't have an icon, just title and description.
      </lith-alert>

      <lith-alert variant="destructive">
        <div slot="title">Payment Failed</div>
        <p>
          Your payment could not be processed. Please verify your billing information and try again.
        </p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </lith-alert>
    </div>
  `,
};

export const Closable: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <lith-alert variant="default" closable>
        <div slot="icon">✅</div>
        <div slot="title">Success!</div>
        Your changes have been saved successfully. You can close this alert.
      </lith-alert>

      <lith-alert variant="destructive" closable>
        <div slot="title">Network Error</div>
        Unable to connect to the server. Please check your internet connection.
      </lith-alert>
    </div>
  `,
  play: async ({ canvasElement }) => {
    // Wait for component to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    const alerts = canvasElement.querySelectorAll('lith-alert[closable]');
    expect(alerts.length).toBe(2);

    // Test first alert's close button
    const firstAlert = alerts[0];
    const closeButton = firstAlert?.shadowRoot?.querySelector(
      '[part="close"]'
    ) as HTMLButtonElement;
    expect(closeButton).toBeTruthy();
    expect(closeButton?.getAttribute('aria-label')).toBe('Close alert');

    // Test close event
    let closeEventFired = false;
    firstAlert?.addEventListener('lith-alert-close', () => {
      closeEventFired = true;
    });

    if (closeButton) {
      await userEvent.click(closeButton);
      expect(closeEventFired).toBe(true);
    }
  },
};

export const CustomIcons: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <lith-alert variant="default" closable>
        <div slot="icon">⚠️</div>
        <div slot="title">Maintenance Notice</div>
        The system will be under maintenance tonight from 10 PM to 2 AM.
      </lith-alert>

      <lith-alert variant="destructive">
        <div slot="icon">🔥</div>
        <div slot="title">Critical Error</div>
        A critical error has occurred. Please contact support immediately.
      </lith-alert>

      <lith-alert variant="default">
        <div slot="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
        </div>
        <div slot="title">Update Complete</div>
        Your application has been updated to the latest version.
      </lith-alert>
    </div>
  `,
};

export const ComplexContent: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <lith-alert variant="default" closable>
        <div slot="icon">📋</div>
        <div slot="title">Form Validation</div>
        <div>
          <p style="margin: 0 0 8px 0;">Please fix the following errors:</p>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Email address is required</li>
            <li>Password must be at least 8 characters</li>
            <li>Please accept the terms and conditions</li>
          </ul>
        </div>
      </lith-alert>

      <lith-alert variant="destructive">
        <div slot="title">Server Error (500)</div>
        <div>
          <p style="margin: 0 0 8px 0;">An internal server error occurred:</p>
          <code
            style="background: rgba(0,0,0,0.1); padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 14px;"
          >
            Database connection timeout after 30 seconds
          </code>
          <p style="margin: 8px 0 0 0;">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </lith-alert>
    </div>
  `,
};

export const InlineUsage: Story = {
  render: () => html`
    <div style="max-width: 400px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h3 style="margin: 0 0 16px 0;">Contact Form</h3>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 4px; font-weight: 500;">Name</label>
        <input
          type="text"
          style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box;"
          placeholder="Enter your name"
        />
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 4px; font-weight: 500;">Email</label>
        <input
          type="email"
          style="width: 100%; padding: 8px; border: 1px solid #ef4444; border-radius: 4px; box-sizing: border-box;"
          placeholder="Enter your email"
        />
      </div>

      <lith-alert variant="destructive" style="margin-bottom: 16px;">
        <div slot="icon">❌</div>
        <div slot="title">Invalid Email</div>
        Please enter a valid email address.
      </lith-alert>

      <button
        style="width: 100%; padding: 10px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Submit
      </button>
    </div>
  `,
};

export const AccessibilityDemo: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <p style="margin: 0; color: #6b7280;">
        这些示例展示了 Alert 组件的可访问性特性。使用 Tab 键可以导航到关闭按钮。
      </p>

      <lith-alert variant="default" closable>
        <div slot="icon">ℹ️</div>
        <div slot="title">信息提示</div>
        这是一个可以用键盘导航的提示框。按 Tab 键可以聚焦到关闭按钮。
      </lith-alert>

      <lith-alert variant="destructive" closable>
        <div slot="title">错误警告</div>
        <p>这是一个错误提示，具有 <code>aria-live="polite"</code> 属性，屏幕阅读器会读出内容。</p>
      </lith-alert>
    </div>
  `,
  play: async ({ canvasElement }) => {
    // Wait for component to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check accessibility attributes
    const alerts = canvasElement.querySelectorAll('lith-alert');

    alerts.forEach((alert) => {
      const container = alert.shadowRoot?.querySelector('[role="alert"]');
      expect(container).toBeTruthy();
      expect(container?.getAttribute('aria-live')).toBe('polite');

      if (alert.hasAttribute('closable')) {
        const closeButton = alert.shadowRoot?.querySelector('[part="close"]');
        expect(closeButton?.getAttribute('aria-label')).toBe('Close alert');
        expect(closeButton?.getAttribute('title')).toBe('Close');
      }
    });
  },
};

export const ResponsiveLayout: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;"
    >
      <lith-alert variant="default">
        <div slot="icon">📱</div>
        <div slot="title">Responsive Design</div>
        This alert adapts to different screen sizes and container widths.
      </lith-alert>

      <lith-alert variant="destructive" closable>
        <div slot="title">Mobile Friendly</div>
        Alert components work well on both desktop and mobile devices.
      </lith-alert>
    </div>
  `,
};
