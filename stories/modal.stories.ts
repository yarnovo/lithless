import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { fn, expect, within, userEvent } from '@storybook/test';
import '../src/components/feedback/lith-modal';
import type { LithModal } from '../src/components/feedback/lith-modal';

const meta = {
  title: 'Feedback/Modal',
  tags: ['autodocs'],
  render: (args) => html`
    <div>
      <button
        id="open-modal"
        @click=${() => {
          const modal = document.querySelector('lith-modal') as LithModal;
          modal.open = true;
        }}
      >
        打开模态框
      </button>

      <lith-modal
        ?open=${args.open}
        ?closeOnBackdrop=${args.closeOnBackdrop}
        ?closeOnEsc=${args.closeOnEsc}
        aria-label=${args.ariaLabel || ''}
        aria-labelledby=${args.ariaLabelledby || ''}
        aria-describedby=${args.ariaDescribedby || ''}
        @lith-open=${args.onOpen}
        @lith-close=${args.onClose}
      >
        <div style="padding: 2rem;">
          <h2 id="modal-title" style="margin: 0 0 1rem 0;">模态框标题</h2>
          <p id="modal-desc" style="margin: 0 0 1.5rem 0;">
            这是模态框的内容。你可以在这里放置任何内容。
          </p>
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button
              @click=${() => {
                const modal = document.querySelector('lith-modal') as LithModal;
                modal.open = false;
              }}
            >
              取消
            </button>
            <button
              @click=${() => {
                const modal = document.querySelector('lith-modal') as LithModal;
                modal.open = false;
              }}
              style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem;"
            >
              确认
            </button>
          </div>
        </div>
      </lith-modal>
    </div>
  `,
  argTypes: {
    open: {
      control: 'boolean',
      description: '控制模态框的显示状态',
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: '点击背景是否关闭模态框',
    },
    closeOnEsc: {
      control: 'boolean',
      description: '按 ESC 键是否关闭模态框',
    },
    ariaLabel: {
      control: 'text',
      description: '模态框的 ARIA 标签',
    },
    ariaLabelledby: {
      control: 'text',
      description: '引用标题元素的 ID',
    },
    ariaDescribedby: {
      control: 'text',
      description: '引用描述元素的 ID',
    },
  },
  args: {
    open: false,
    closeOnBackdrop: true,
    closeOnEsc: true,
    ariaLabel: '',
    ariaLabelledby: 'modal-title',
    ariaDescribedby: 'modal-desc',
    onOpen: fn(),
    onClose: fn(),
  },
} satisfies Meta<LithModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认',
};

export const OpenByDefault: Story = {
  name: '默认打开',
  args: {
    open: true,
  },
};

export const NoBackdropClose: Story = {
  name: '禁用背景关闭',
  args: {
    closeOnBackdrop: false,
  },
};

export const NoEscClose: Story = {
  name: '禁用 ESC 关闭',
  args: {
    closeOnEsc: false,
  },
};

export const WithForm: Story = {
  name: '表单模态框',
  render: (args) => html`
    <div>
      <button
        id="form-modal-trigger"
        @click=${() => {
          const modal = document.querySelector('#form-modal') as LithModal;
          modal.open = true;
        }}
      >
        打开表单
      </button>

      <lith-modal
        id="form-modal"
        ?open=${args.open}
        ?closeOnBackdrop=${args.closeOnBackdrop}
        ?closeOnEsc=${args.closeOnEsc}
        aria-labelledby="form-title"
        @lith-open=${args.onOpen}
        @lith-close=${args.onClose}
      >
        <div style="padding: 2rem; min-width: 400px;">
          <h2 id="form-title" style="margin: 0 0 1.5rem 0;">用户信息</h2>
          <form>
            <div style="margin-bottom: 1rem;">
              <label for="name" style="display: block; margin-bottom: 0.25rem;">姓名</label>
              <input
                id="name"
                type="text"
                autofocus
                style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 0.25rem;"
              />
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label for="email" style="display: block; margin-bottom: 0.25rem;">邮箱</label>
              <input
                id="email"
                type="email"
                style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 0.25rem;"
              />
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
              <button
                type="button"
                @click=${() => {
                  const modal = document.querySelector('#form-modal') as LithModal;
                  modal.open = false;
                }}
              >
                取消
              </button>
              <button
                type="submit"
                @click=${(e: Event) => {
                  e.preventDefault();
                  const modal = document.querySelector('#form-modal') as LithModal;
                  modal.open = false;
                }}
                style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem;"
              >
                提交
              </button>
            </div>
          </form>
        </div>
      </lith-modal>
    </div>
  `,
};

export const Nested: Story = {
  name: '嵌套模态框',
  render: () => html`
    <div>
      <button
        @click=${() => {
          const modal = document.querySelector('#modal1') as LithModal;
          modal.open = true;
        }}
      >
        打开第一个模态框
      </button>

      <lith-modal id="modal1" aria-labelledby="modal1-title">
        <div style="padding: 2rem;">
          <h2 id="modal1-title" style="margin: 0 0 1rem 0;">第一个模态框</h2>
          <p style="margin: 0 0 1.5rem 0;">这是第一个模态框的内容。</p>
          <div style="display: flex; gap: 0.5rem;">
            <button
              @click=${() => {
                const modal2 = document.querySelector('#modal2') as LithModal;
                modal2.open = true;
              }}
            >
              打开第二个模态框
            </button>
            <button
              @click=${() => {
                const modal1 = document.querySelector('#modal1') as LithModal;
                modal1.open = false;
              }}
            >
              关闭
            </button>
          </div>
        </div>
      </lith-modal>

      <lith-modal id="modal2" aria-labelledby="modal2-title">
        <div style="padding: 2rem;">
          <h2 id="modal2-title" style="margin: 0 0 1rem 0;">第二个模态框</h2>
          <p style="margin: 0 0 1.5rem 0;">这是第二个模态框的内容。</p>
          <button
            @click=${() => {
              const modal2 = document.querySelector('#modal2') as LithModal;
              modal2.open = false;
            }}
          >
            关闭
          </button>
        </div>
      </lith-modal>
    </div>
  `,
};

export const LongContent: Story = {
  name: '长内容滚动',
  render: (args) => html`
    <div>
      <button
        @click=${() => {
          const modal = document.querySelector('lith-modal') as LithModal;
          modal.open = true;
        }}
      >
        打开长内容模态框
      </button>

      <lith-modal
        ?open=${args.open}
        ?closeOnBackdrop=${args.closeOnBackdrop}
        ?closeOnEsc=${args.closeOnEsc}
        aria-labelledby="long-title"
      >
        <div style="padding: 2rem;">
          <h2 id="long-title" style="margin: 0 0 1rem 0;">长内容示例</h2>
          ${Array.from(
            { length: 50 },
            (_, i) => html`
              <p style="margin: 0 0 1rem 0;">
                这是第 ${i + 1} 段内容。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            `
          )}
          <button
            @click=${() => {
              const modal = document.querySelector('lith-modal') as LithModal;
              modal.open = false;
            }}
          >
            关闭
          </button>
        </div>
      </lith-modal>
    </div>
  `,
};

export const InteractionTest: Story = {
  name: '交互测试',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 点击打开按钮
    const openButton = canvas.getByText('打开模态框');
    await userEvent.click(openButton);

    // 等待模态框打开动画
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 验证打开事件被触发
    expect(args.onOpen).toHaveBeenCalled();

    // 验证模态框可见
    const modal = canvasElement.querySelector('lith-modal') as LithModal;
    expect(modal.open).toBe(true);

    // 测试 ESC 关闭
    await userEvent.keyboard('{Escape}');
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 验证关闭事件被触发
    expect(args.onClose).toHaveBeenCalled();
    expect(modal.open).toBe(false);

    // 再次打开
    await userEvent.click(openButton);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 点击取消按钮关闭
    const cancelButton = canvas.getByText('取消');
    await userEvent.click(cancelButton);
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(modal.open).toBe(false);
  },
};
