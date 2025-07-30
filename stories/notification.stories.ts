import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/feedback/lith-notification.js';
import '../src/components/feedback/lith-portal.js';

const meta: Meta = {
  title: 'Components/Notification',
  component: 'lith-notification',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Notification 是一个持久性的通知组件，用于显示重要的系统消息或需要用户响应的信息。

## 特性

- 🔔 **持久显示** - 不会自动消失，需要用户手动关闭
- 🎨 **丰富内容** - 支持标题、正文和操作按钮
- 🎯 **多种类型** - success、error、warning、info
- 📱 **响应式设计** - 适配不同屏幕尺寸
- 🎬 **平滑动画** - 优雅的进入和退出动画
- ♿ **可访问性** - 完整的 ARIA 支持

## 与 Toast 的区别

- **Toast**: 临时的、非关键的反馈信息，自动消失
- **Notification**: 重要的、需要用户注意的信息，手动关闭

## 使用场景

- 系统级通知（如：版本更新、维护通知）
- 需要用户确认的重要信息
- 包含多个操作选项的通知
- 需要显示详细内容的消息

## 使用方式

\`\`\`html
<lith-notification
  type="warning"
  title="系统维护通知"
  closable
>
  <p>系统将在今晚 10:00 进行维护，预计持续 2 小时。</p>
  <div slot="actions">
    <button>了解详情</button>
    <button>稍后提醒</button>
  </div>
</lith-notification>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: '通知类型',
    },
    title: {
      control: 'text',
      description: '标题文本',
    },
    closable: {
      control: 'boolean',
      description: '是否可关闭',
    },
    animated: {
      control: 'boolean',
      description: '是否启用动画',
    },
    icon: {
      control: 'text',
      description: '自定义图标',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    type: 'info',
    title: '系统通知',
    closable: true,
    animated: true,
  },
  render: (args) => html`
    <lith-notification
      type=${args.type}
      title=${args.title}
      ?closable=${args.closable}
      ?animated=${args.animated}
    >
      <p>这是一条系统通知消息，包含了一些重要信息需要您注意。</p>
    </lith-notification>
  `,
};

export const Types: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <lith-notification type="success" title="操作成功">
        <p>您的更改已成功保存到服务器。</p>
      </lith-notification>

      <lith-notification type="error" title="错误提示">
        <p>无法连接到服务器，请检查网络连接后重试。</p>
      </lith-notification>

      <lith-notification type="warning" title="警告信息">
        <p>您的账户将在 7 天后过期，请及时续费。</p>
      </lith-notification>

      <lith-notification type="info" title="提示信息">
        <p>新版本已发布，包含多项功能改进和错误修复。</p>
      </lith-notification>
    </div>
  `,
};

export const WithActions: Story = {
  render: () => html`
    <lith-notification type="warning" title="系统更新">
      <p>发现新版本 v2.0.0，包含重要的安全更新。建议立即更新以确保系统安全。</p>
      <div slot="actions">
        <button
          style="padding: 6px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;"
          @click=${() => alert('开始更新')}
        >
          立即更新
        </button>
        <button
          style="padding: 6px 16px; background: transparent; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
          @click=${() => alert('稍后提醒')}
        >
          稍后提醒
        </button>
      </div>
    </lith-notification>
  `,
};

export const ComplexContent: Story = {
  render: () => html`
    <lith-notification type="info" title="新功能介绍">
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="margin: 0;">我们很高兴地推出以下新功能：</p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>🚀 性能提升 - 页面加载速度提升 50%</li>
          <li>🎨 全新 UI - 更现代化的界面设计</li>
          <li>🔒 增强安全 - 支持双因素认证</li>
          <li>📱 移动优化 - 更好的移动端体验</li>
        </ul>
        <p style="margin: 0; font-size: 14px; opacity: 0.8;">更多详情请查看更新日志。</p>
      </div>
      <div slot="actions">
        <button
          style="padding: 6px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          查看详情
        </button>
        <button
          style="padding: 6px 16px; background: transparent; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
        >
          知道了
        </button>
      </div>
    </lith-notification>
  `,
};

export const CustomIcon: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <lith-notification type="success" title="下载完成" icon="⬇️">
        <p>文件已成功下载到您的设备。</p>
      </lith-notification>

      <lith-notification type="warning" title="存储空间不足" icon="💾">
        <p>您的存储空间即将用完，请清理不需要的文件。</p>
      </lith-notification>

      <lith-notification type="info" title="新消息" icon="💬">
        <p>您有 3 条未读消息。</p>
      </lith-notification>
    </div>
  `,
};

export const NoClose: Story = {
  render: () => html`
    <lith-notification type="error" title="必须处理的错误" ?closable=${false}>
      <p>检测到严重错误，必须立即处理。此通知无法关闭，直到问题解决。</p>
      <div slot="actions">
        <button
          style="padding: 6px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;"
          @click=${() => alert('开始修复')}
        >
          立即修复
        </button>
      </div>
    </lith-notification>
  `,
};

export const WithProgress: Story = {
  render: () => html`
    <lith-notification type="info" title="正在同步数据">
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="margin: 0;">正在同步您的数据到云端，请勿关闭应用。</p>
        <div
          style="width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;"
        >
          <div
            style="width: 65%; height: 100%; background: #3b82f6; transition: width 300ms ease;"
          ></div>
        </div>
        <p style="margin: 0; font-size: 14px; opacity: 0.8;">已完成 65%</p>
      </div>
    </lith-notification>
  `,
};

export const LongContent: Story = {
  render: () => html`
    <lith-notification type="info" title="服务条款更新">
      <div style="max-height: 200px; overflow-y: auto;">
        <p>尊敬的用户，</p>
        <p>
          我们更新了服务条款和隐私政策，主要变更包括：数据收集和使用方式的调整、
          用户权利的增强、第三方服务集成的说明等。这些更改将于 2024 年 1 月 1 日生效。
        </p>
        <p>
          请仔细阅读更新后的条款，继续使用我们的服务即表示您同意这些更改。
          如果您不同意新的条款，可以在生效日期前关闭您的账户。
        </p>
        <p>如有任何疑问，请联系我们的客服团队。感谢您的理解与支持。</p>
      </div>
      <div slot="actions">
        <button
          style="padding: 6px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          阅读完整条款
        </button>
        <button
          style="padding: 6px 16px; background: transparent; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
        >
          我已了解
        </button>
      </div>
    </lith-notification>
  `,
};

export const MultipleActions: Story = {
  render: () => html`
    <lith-notification type="warning" title="账户安全提醒">
      <p>检测到您的账户在新设备上登录。如果这不是您本人操作，请立即采取行动。</p>
      <div slot="actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button
          style="padding: 6px 16px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          是我本人
        </button>
        <button
          style="padding: 6px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          不是我
        </button>
        <button
          style="padding: 6px 16px; background: transparent; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
        >
          查看详情
        </button>
      </div>
    </lith-notification>
  `,
};

export const NoAnimation: Story = {
  render: () => html`
    <lith-notification type="info" title="无动画通知" ?animated=${false}>
      <p>这个通知没有进入动画效果，直接显示。</p>
    </lith-notification>
  `,
};

export const InContainer: Story = {
  render: () => html`
    <div
      style="width: 400px; height: 600px; border: 1px solid #e5e7eb; border-radius: 8px; position: relative; overflow: hidden;"
    >
      <div style="padding: 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
        <h3 style="margin: 0;">应用容器</h3>
      </div>

      <div style="position: absolute; top: 60px; left: 0; right: 0; padding: 16px;">
        <lith-notification type="success" title="操作成功">
          <p>您的设置已保存。</p>
        </lith-notification>
      </div>

      <div style="padding: 150px 16px 16px;">
        <p>这是应用的主要内容区域。通知显示在顶部。</p>
      </div>
    </div>
  `,
};

export const Stacked: Story = {
  render: () => html`
    <lith-portal>
      <div
        style="position: fixed; top: 16px; right: 16px; display: flex; flex-direction: column; gap: 8px; z-index: 9999;"
      >
        <lith-notification type="error" title="错误 1">
          <p>第一个错误通知</p>
        </lith-notification>

        <lith-notification type="warning" title="警告">
          <p>这是一个警告通知</p>
        </lith-notification>

        <lith-notification type="info" title="提示">
          <p>这是一个提示通知</p>
        </lith-notification>
      </div>
    </lith-portal>

    <div style="padding: 20px; text-align: center;">
      <p>多个通知可以堆叠显示在页面的角落。</p>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => {
    let notification: HTMLElement | null = null;

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
        <button
          @click=${() => {
            if (!notification) {
              notification = document.createElement('lith-notification');
              notification.setAttribute('type', 'info');
              notification.setAttribute('title', '动态通知');
              notification.innerHTML = `
                <p id="notification-content">点击下面的按钮更新内容</p>
                <div slot="actions">
                  <button onclick="this.closest('lith-notification').remove()">关闭</button>
                </div>
              `;
              document.body.appendChild(notification);

              // 使用 Portal 定位
              const portal = document.createElement('lith-portal');
              portal.style.position = 'fixed';
              portal.style.top = '20px';
              portal.style.right = '20px';
              portal.style.zIndex = '9999';
              portal.appendChild(notification);
              document.body.appendChild(portal);
            }
          }}
          style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          显示通知
        </button>

        <button
          @click=${() => {
            if (notification) {
              const content = notification.querySelector('#notification-content');
              if (content) {
                content.textContent = `更新时间: ${new Date().toLocaleTimeString()}`;
              }
              notification.setAttribute('type', 'success');
              notification.setAttribute('title', '内容已更新');
            }
          }}
          style="padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          更新通知内容
        </button>

        <p style="margin: 0; color: #6b7280; text-align: center;">
          点击"显示通知"后，通知会出现在页面右上角
        </p>
      </div>
    `;
  },
};
