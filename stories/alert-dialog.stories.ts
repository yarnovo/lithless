import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, within, userEvent, fn } from '@storybook/test';
import '../src/components/feedback/lith-alert-dialog';

const meta: Meta = {
  title: 'Components/Feedback/AlertDialog',
  component: 'lith-alert-dialog',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Alert Dialog 组件用于显示需要用户确认的重要消息。与普通对话框不同，Alert Dialog 专门用于中断用户操作并要求明确的响应。

## 特性

- **中断性设计** - 要求用户做出明确响应
- **可访问性** - 使用 alertdialog 角色和适当的 ARIA 属性
- **键盘导航** - 支持 Tab 和 Escape 键
- **动画效果** - 平滑的打开和关闭动画
- **可定制** - 支持自定义标题、描述和按钮文本
- **事件处理** - 提供取消和确认事件

## CSS 自定义属性

可以通过 CSS 部件选择器自定义样式：
- \`::part(backdrop)\` - 背景遮罩
- \`::part(dialog)\` - 对话框容器
- \`::part(header)\` - 头部区域
- \`::part(title)\` - 标题
- \`::part(description)\` - 描述文本
- \`::part(content)\` - 内容区域
- \`::part(footer)\` - 底部按钮区域
- \`::part(cancel-button)\` - 取消按钮
- \`::part(action-button)\` - 确认按钮
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: '对话框是否打开',
    },
    title: {
      control: 'text',
      description: '对话框标题',
    },
    description: {
      control: 'text',
      description: '对话框描述',
    },
    cancelText: {
      control: 'text',
      description: '取消按钮文本',
    },
    actionText: {
      control: 'text',
      description: '确认按钮文本',
    },
    actionVariant: {
      control: 'select',
      options: ['destructive', 'default'],
      description: '确认按钮样式变体',
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: '点击背景是否关闭对话框',
    },
    closeOnEsc: {
      control: 'boolean',
      description: '按 Escape 键是否关闭对话框',
    },
    'lith-open': { action: 'lith-open' },
    'lith-close': { action: 'lith-close' },
    'lith-cancel': { action: 'lith-cancel' },
    'lith-action': { action: 'lith-action' },
  },
  args: {
    open: false,
    title: 'Are you absolutely sure?',
    description:
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    cancelText: 'Cancel',
    actionText: 'Yes, delete account',
    actionVariant: 'destructive',
    closeOnBackdrop: false,
    closeOnEsc: true,
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div>
      <button
        id="trigger-button"
        @click=${() => {
          const dialog = document.querySelector('lith-alert-dialog');
          if (dialog) {
            (dialog as any).open = true;
          }
        }}
      >
        Delete account
      </button>

      <lith-alert-dialog
        ?open=${args.open}
        title=${args.title}
        description=${args.description}
        cancel-text=${args.cancelText}
        action-text=${args.actionText}
        action-variant=${args.actionVariant}
        ?close-on-backdrop=${args.closeOnBackdrop}
        ?close-on-esc=${args.closeOnEsc}
        @lith-open=${args['lith-open']}
        @lith-close=${args['lith-close']}
        @lith-cancel=${args['lith-cancel']}
        @lith-action=${args['lith-action']}
      ></lith-alert-dialog>
    </div>
  `,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const triggerButton = canvas.getByText('Delete account');

    // 点击触发按钮打开对话框
    await userEvent.click(triggerButton);

    // 等待对话框渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    const dialog = canvasElement.querySelector('lith-alert-dialog');
    expect(dialog).toBeTruthy();
    expect(dialog?.open).toBe(true);

    // 检查对话框内容
    const shadowRoot = dialog?.shadowRoot;
    if (shadowRoot) {
      const title = shadowRoot.querySelector('[part="title"]');
      const description = shadowRoot.querySelector('[part="description"]');
      const cancelButton = shadowRoot.querySelector('[part="cancel-button"]');
      const actionButton = shadowRoot.querySelector('[part="action-button"]');

      expect(title?.textContent).toBe(args.title);
      expect(description?.textContent).toBe(args.description);
      expect(cancelButton?.textContent).toBe(args.cancelText);
      expect(actionButton?.textContent).toBe(args.actionText);

      // 点击取消按钮
      await userEvent.click(cancelButton as Element);

      // 等待关闭动画
      await new Promise((resolve) => setTimeout(resolve, 250));

      expect(dialog?.open).toBe(false);
    }
  },
};

export const DefaultAction: Story = {
  args: {
    ...Default.args,
    title: 'Save changes?',
    description: 'Your changes will be saved to your profile.',
    actionText: 'Save changes',
    actionVariant: 'default',
  },
  render: (args) => html`
    <div>
      <button
        id="trigger-button"
        @click=${() => {
          const dialog = document.querySelector('lith-alert-dialog');
          if (dialog) {
            (dialog as any).open = true;
          }
        }}
      >
        Save changes
      </button>

      <lith-alert-dialog
        ?open=${args.open}
        title=${args.title}
        description=${args.description}
        cancel-text=${args.cancelText}
        action-text=${args.actionText}
        action-variant=${args.actionVariant}
        ?close-on-backdrop=${args.closeOnBackdrop}
        ?close-on-esc=${args.closeOnEsc}
        @lith-open=${args['lith-open']}
        @lith-close=${args['lith-close']}
        @lith-cancel=${args['lith-cancel']}
        @lith-action=${args['lith-action']}
      ></lith-alert-dialog>
    </div>
  `,
};

export const WithSlots: Story = {
  args: {
    ...Default.args,
    title: '',
    description: '',
  },
  render: (args) => html`
    <div>
      <button
        id="trigger-button"
        @click=${() => {
          const dialog = document.querySelector('lith-alert-dialog');
          if (dialog) {
            (dialog as any).open = true;
          }
        }}
      >
        Open custom dialog
      </button>

      <lith-alert-dialog
        ?open=${args.open}
        cancel-text=${args.cancelText}
        action-text="Confirm"
        action-variant="default"
        ?close-on-backdrop=${args.closeOnBackdrop}
        ?close-on-esc=${args.closeOnEsc}
        @lith-open=${args['lith-open']}
        @lith-close=${args['lith-close']}
        @lith-cancel=${args['lith-cancel']}
        @lith-action=${args['lith-action']}
      >
        <div
          slot="title"
          style="font-size: 1.125rem; font-weight: 600; margin: 0 0 0.5rem 0; color: #111827;"
        >
          Custom Title with HTML
        </div>
        <div
          slot="description"
          style="font-size: 0.875rem; color: #6b7280; margin: 0; line-height: 1.5;"
        >
          This is a <strong>custom description</strong> with <em>HTML formatting</em> and a
          <a href="#" style="color: #3b82f6; text-decoration: underline;">link</a>.
        </div>

        <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 0.375rem;">
          <p style="margin: 0; font-size: 0.875rem;">
            Additional content can be placed in the default slot.
          </p>
        </div>
      </lith-alert-dialog>
    </div>
  `,
};

export const KeyboardNavigation: Story = {
  render: (args) => html`
    <div>
      <button
        id="trigger-button"
        @click=${() => {
          const dialog = document.querySelector('lith-alert-dialog');
          if (dialog) {
            (dialog as any).open = true;
          }
        }}
      >
        Test keyboard navigation
      </button>

      <lith-alert-dialog
        ?open=${args.open}
        title="Keyboard Navigation Test"
        description="Use Tab to navigate between buttons, Enter to activate, and Escape to close."
        cancel-text="Cancel"
        action-text="Confirm"
        action-variant="default"
        ?close-on-backdrop=${args.closeOnBackdrop}
        ?close-on-esc=${args.closeOnEsc}
        @lith-open=${args['lith-open']}
        @lith-close=${args['lith-close']}
        @lith-cancel=${args['lith-cancel']}
        @lith-action=${args['lith-action']}
      ></lith-alert-dialog>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const triggerButton = canvas.getByText('Test keyboard navigation');

    // 点击触发按钮打开对话框
    await userEvent.click(triggerButton);

    // 等待对话框渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    const dialog = canvasElement.querySelector('lith-alert-dialog');
    expect(dialog?.open).toBe(true);

    // 测试 Escape 键关闭
    await userEvent.keyboard('{Escape}');

    // 等待关闭动画
    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(dialog?.open).toBe(false);
  },
};

export const EventHandling: Story = {
  render: (args) => {
    const handleCancel = fn();
    const handleAction = fn();

    return html`
      <div>
        <button
          id="trigger-button"
          @click=${() => {
            const dialog = document.querySelector('lith-alert-dialog');
            if (dialog) {
              (dialog as any).open = true;
            }
          }}
        >
          Test events
        </button>

        <lith-alert-dialog
          ?open=${args.open}
          title="Event Handling Test"
          description="Click buttons to trigger events."
          cancel-text="Cancel"
          action-text="Confirm"
          action-variant="default"
          ?close-on-backdrop=${args.closeOnBackdrop}
          ?close-on-esc=${args.closeOnEsc}
          @lith-cancel=${handleCancel}
          @lith-action=${handleAction}
        ></lith-alert-dialog>

        <div style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
          Cancel events: <span id="cancel-count">0</span><br />
          Action events: <span id="action-count">0</span>
        </div>
      </div>
    `;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const triggerButton = canvas.getByText('Test events');

    // 打开对话框
    await userEvent.click(triggerButton);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const dialog = canvasElement.querySelector('lith-alert-dialog');
    const shadowRoot = dialog?.shadowRoot;

    if (shadowRoot) {
      const cancelButton = shadowRoot.querySelector('[part="cancel-button"]');

      // 点击取消按钮
      await userEvent.click(cancelButton as Element);
      await new Promise((resolve) => setTimeout(resolve, 250));

      // 重新打开对话框测试确认按钮
      await userEvent.click(triggerButton);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const actionButton = shadowRoot.querySelector('[part="action-button"]');

      // 点击确认按钮
      await userEvent.click(actionButton as Element);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  },
};

export const CustomStyling: Story = {
  render: (args) => html`
    <style>
      .custom-alert-dialog::part(dialog) {
        border: 2px solid #3b82f6;
        border-radius: 1rem;
      }

      .custom-alert-dialog::part(title) {
        color: #3b82f6;
        font-size: 1.25rem;
      }

      .custom-alert-dialog::part(description) {
        color: #1f2937;
      }

      .custom-alert-dialog::part(cancel-button) {
        background: #f3f4f6;
        color: #374151;
        border: none;
        border-radius: 0.5rem;
      }

      .custom-alert-dialog::part(cancel-button):hover {
        background: #e5e7eb;
      }

      .custom-alert-dialog::part(action-button) {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border: none;
        border-radius: 0.5rem;
      }

      .custom-alert-dialog::part(action-button):hover {
        background: linear-gradient(135deg, #2563eb, #1e40af);
      }
    </style>

    <div>
      <button
        id="trigger-button"
        @click=${() => {
          const dialog = document.querySelector('lith-alert-dialog');
          if (dialog) {
            (dialog as any).open = true;
          }
        }}
      >
        Open styled dialog
      </button>

      <lith-alert-dialog
        class="custom-alert-dialog"
        ?open=${args.open}
        title="Custom Styled Dialog"
        description="This dialog has custom styling applied through CSS parts."
        cancel-text="Cancel"
        action-text="Confirm"
        action-variant="default"
        ?close-on-backdrop=${args.closeOnBackdrop}
        ?close-on-esc=${args.closeOnEsc}
        @lith-open=${args['lith-open']}
        @lith-close=${args['lith-close']}
        @lith-cancel=${args['lith-cancel']}
        @lith-action=${args['lith-action']}
      ></lith-alert-dialog>
    </div>
  `,
};
