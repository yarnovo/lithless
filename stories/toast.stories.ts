import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { toast } from '../src/core/toast-manager.js';
import '../src/components/feedback/lith-toast-container.js';
import '../src/components/feedback/lith-toast.js';

const meta: Meta = {
  title: 'Components/Toast',
  component: 'lith-toast',
  decorators: [
    (story) => html`
      <lith-toast-container></lith-toast-container>
      ${story()}
    `,
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Toast 是一个轻量级的通知组件，用于显示简短的、临时的反馈信息。

## 特性

- 🎯 **自动消失** - 默认 3 秒后自动关闭
- 📍 **灵活定位** - 支持 6 个位置
- 🎨 **多种类型** - success、error、warning、info
- 🔧 **命令式 API** - 简单易用的函数调用
- 📦 **队列管理** - 自动管理多个 toast
- 🎬 **平滑动画** - 优雅的进入和退出动画
- ♿ **可访问性** - 完整的 ARIA 支持

## 使用方式

### 基本用法

\`\`\`javascript
import { toast } from 'lithless';

// 简单调用
toast.success('操作成功！');
toast.error('出错了！');
toast.warning('请注意！');
toast.info('提示信息');

// 高级选项
toast.add({
  type: 'success',
  title: '上传成功',
  description: '文件已成功上传到服务器',
  duration: 5000,
  action: {
    label: '查看',
    onClick: () => console.log('查看文件')
  }
});
\`\`\`

### Promise 集成

\`\`\`javascript
// 自动处理 Promise 状态
const result = await toast.promise(
  uploadFile(file),
  {
    loading: '上传中...',
    success: '上传成功！',
    error: (err) => \`上传失败: \${err.message}\`
  }
);
\`\`\`

### 容器配置

\`\`\`html
<lith-toast-container
  max-count="5"
  default-position="top-right"
  use-portal
></lith-toast-container>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'Toast 类型',
    },
    title: {
      control: 'text',
      description: '标题文本',
    },
    description: {
      control: 'text',
      description: '描述文本',
    },
    closable: {
      control: 'boolean',
      description: '是否可关闭',
    },
    icon: {
      control: 'text',
      description: '自定义图标',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
      <h3 style="margin: 0 0 16px 0;">Toast 演示</h3>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
        <button
          @click=${() => toast.success('操作成功完成！')}
          style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Success Toast
        </button>

        <button
          @click=${() => toast.error('发生错误，请重试')}
          style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Error Toast
        </button>

        <button
          @click=${() => toast.warning('请注意系统维护')}
          style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Warning Toast
        </button>

        <button
          @click=${() => toast.info('这是一条提示信息')}
          style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Info Toast
        </button>
      </div>

      <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
        <p style="margin: 0; text-align: center; color: #6b7280;">
          点击上面的按钮显示不同类型的 Toast
        </p>
      </div>
    </div>
  `,
};

export const Types: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <h3 style="margin: 0 0 16px 0;">Toast 类型</h3>

      <lith-toast type="success" title="Success" description="操作成功完成"></lith-toast>
      <lith-toast type="error" title="Error" description="发生错误，请重试"></lith-toast>
      <lith-toast type="warning" title="Warning" description="请注意系统维护"></lith-toast>
      <lith-toast type="info" title="Info" description="这是一条提示信息"></lith-toast>
      <lith-toast type="default" title="Default" description="默认样式的 Toast"></lith-toast>
    </div>
  `,
};

export const WithDescription: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <button
        @click=${() =>
          toast.add({
            type: 'success',
            title: '文件上传成功',
            description: '您的文件已成功上传到服务器，可以开始使用了。',
            duration: 5000,
          })}
        style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;"
      >
        显示带描述的 Toast
      </button>
    </div>
  `,
};

export const WithAction: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <button
        @click=${() =>
          toast.add({
            type: 'success',
            title: '消息已发送',
            description: '您的消息已成功发送给收件人。',
            action: {
              label: '撤回',
              onClick: () => {
                toast.info('消息已撤回');
              },
            },
            duration: 10000,
          })}
        style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;"
      >
        显示带操作的 Toast
      </button>
    </div>
  `,
};

export const Positions: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 400px;">
      <button
        @click=${() => toast.add({ title: '左上角', position: 'top-left' })}
        style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        Top Left
      </button>

      <button
        @click=${() => toast.add({ title: '顶部居中', position: 'top-center' })}
        style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        Top Center
      </button>

      <button
        @click=${() => toast.add({ title: '右上角', position: 'top-right' })}
        style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        Top Right
      </button>

      <button
        @click=${() => toast.add({ title: '左下角', position: 'bottom-left' })}
        style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        Bottom Left
      </button>

      <button
        @click=${() => toast.add({ title: '底部居中', position: 'bottom-center' })}
        style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        Bottom Center
      </button>

      <button
        @click=${() => toast.add({ title: '右下角', position: 'bottom-right' })}
        style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        Bottom Right
      </button>
    </div>
  `,
};

export const Duration: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button
        @click=${() =>
          toast.add({
            title: '快速消失 (1秒)',
            duration: 1000,
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        1 秒后消失
      </button>

      <button
        @click=${() =>
          toast.add({
            title: '标准时长 (3秒)',
            duration: 3000,
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        3 秒后消失
      </button>

      <button
        @click=${() =>
          toast.add({
            title: '较长时间 (10秒)',
            duration: 10000,
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        10 秒后消失
      </button>

      <button
        @click=${() =>
          toast.add({
            title: '不自动消失',
            description: '需要手动关闭',
            duration: 0,
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        不自动消失
      </button>
    </div>
  `,
};

export const PromiseIntegration: Story = {
  render: () => {
    const simulateUpload = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve('file-id-123');
          } else {
            reject(new Error('Network error'));
          }
        }, 2000);
      });
    };

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
        <button
          @click=${async () => {
            try {
              const result = await toast.promise(simulateUpload(), {
                loading: '上传中...',
                success: '文件上传成功！',
                error: (err) => `上传失败: ${err.message}`,
              });
              console.log('Upload result:', result);
            } catch (error) {
              console.error('Upload failed:', error);
            }
          }}
          style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          模拟文件上传 (50% 成功率)
        </button>

        <p style="margin: 0; color: #6b7280; text-align: center;">
          点击按钮模拟文件上传，Toast 会自动显示加载、成功或失败状态
        </p>
      </div>
    `;
  },
};

export const Multiple: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <button
        @click=${() => {
          toast.success('第一条消息');
          setTimeout(() => toast.info('第二条消息'), 500);
          setTimeout(() => toast.warning('第三条消息'), 1000);
          setTimeout(() => toast.error('第四条消息'), 1500);
        }}
        style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;"
      >
        显示多个 Toast
      </button>

      <button
        @click=${() => toast.clear()}
        style="padding: 12px 24px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;"
      >
        清除所有 Toast
      </button>
    </div>
  `,
};

export const CustomIcon: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button
        @click=${() =>
          toast.add({
            title: '自定义图标',
            icon: '🚀',
            type: 'success',
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        火箭图标
      </button>

      <button
        @click=${() =>
          toast.add({
            title: '保存成功',
            icon: '💾',
            type: 'success',
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        保存图标
      </button>

      <button
        @click=${() =>
          toast.add({
            title: '新消息',
            icon: '📧',
            type: 'info',
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        邮件图标
      </button>
    </div>
  `,
};

export const Closable: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button
        @click=${() =>
          toast.add({
            title: '可关闭的 Toast',
            description: '点击右上角的 X 按钮关闭',
            closable: true,
            duration: 0,
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        可关闭
      </button>

      <button
        @click=${() =>
          toast.add({
            title: '不可关闭的 Toast',
            description: '没有关闭按钮，3秒后自动消失',
            closable: false,
            duration: 3000,
          })}
        style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer;"
      >
        不可关闭
      </button>
    </div>
  `,
};

export const CustomContent: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lith-toast>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img
            src="https://via.placeholder.com/40"
            alt="Avatar"
            style="width: 40px; height: 40px; border-radius: 50%;"
          />
          <div>
            <div style="font-weight: 600;">John Doe</div>
            <div style="font-size: 14px; opacity: 0.8;">刚刚发送了一条消息</div>
          </div>
        </div>
      </lith-toast>

      <button
        @click=${() => {
          const toastEl = document.createElement('lith-toast');
          toastEl.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="font-weight: 600;">下载进度</div>
              <div style="width: 100%; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                <div style="width: 60%; height: 100%; background: #3b82f6; transition: width 300ms;"></div>
              </div>
              <div style="font-size: 12px; opacity: 0.8;">60% 完成</div>
            </div>
          `;
          toast.add({
            title: '',
            duration: 5000,
          });
        }}
        style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;"
      >
        显示自定义内容
      </button>
    </div>
  `,
};

export const UpdateToast: Story = {
  render: () => {
    let toastId: string;

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <button
          @click=${() => {
            toastId = toast.add({
              title: '初始标题',
              description: '点击下面的按钮更新此 Toast',
              duration: 0,
            });
          }}
          style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          创建 Toast
        </button>

        <button
          @click=${() => {
            if (toastId) {
              toast.update(toastId, {
                type: 'success',
                title: '更新后的标题',
                description: 'Toast 内容已更新！',
              });
            }
          }}
          style="padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          更新 Toast
        </button>
      </div>
    `;
  },
};
