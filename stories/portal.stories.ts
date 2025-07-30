import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, userEvent, within } from 'storybook/test';
import '../src/components/feedback/lith-portal.js';
import type { LithPortal } from '../src/components/feedback/lith-portal.js';

const meta: Meta = {
  title: 'Components/Portal',
  component: 'lith-portal',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Portal 是一个传送门组件，将内容渲染到 DOM 树的其他位置。

## 特性

- 🎯 **灵活定位** - 可以将内容渲染到任意 DOM 节点
- 📦 **默认容器** - 提供默认的 fixed 定位容器
- 🔄 **动态控制** - 支持动态激活/停用传送功能
- 🏠 **原地渲染** - 支持 SSR 和禁用传送的场景
- 🎨 **样式隔离** - 保持原有样式上下文
- ♿ **无障碍友好** - 保持正确的 DOM 结构和事件传播

## 使用场景

- 模态框、对话框等需要脱离文档流的组件
- 工具提示、下拉菜单等需要避免 z-index 问题的组件
- 通知、Toast 等需要固定定位的组件
- 任何需要将内容渲染到特定容器的场景
        `,
      },
    },
  },
  argTypes: {
    target: {
      control: 'text',
      description: '目标容器的选择器，不指定则使用默认容器',
    },
    renderInPlace: {
      control: 'boolean',
      description: '是否原地渲染（不使用传送门）',
    },
    active: {
      control: 'boolean',
      description: '是否激活传送门',
    },
    containerId: {
      control: 'text',
      description: '默认容器的 ID',
    },
  },
};

export default meta;
type Story = StoryObj<LithPortal>;

export const Default: Story = {
  args: {
    renderInPlace: false,
    active: true,
    containerId: 'lith-portal-container',
  },
  render: (args) => html`
    <div style="position: relative; padding: 20px; border: 2px dashed #ccc; border-radius: 8px;">
      <h3 style="margin: 0 0 16px 0;">原始位置</h3>
      <p style="margin: 0 0 16px 0;">下面的内容会被传送到页面底部的默认容器中：</p>

      <lith-portal
        ?render-in-place=${args.renderInPlace}
        ?active=${args.active}
        container-id=${args.containerId}
      >
        <div
          style="
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        "
        >
          <h4 style="margin: 0 0 8px 0;">🚀 传送的内容</h4>
          <p style="margin: 0;">这个内容被传送到了默认的 Portal 容器中！</p>
        </div>
      </lith-portal>

      <p style="margin: 16px 0 0 0; color: #666; font-size: 14px;">
        💡 提示：打开开发者工具查看 DOM 结构，内容实际在 body 末尾的容器中
      </p>
    </div>
  `,
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 检查 Portal 组件存在
    const portal = canvasElement.querySelector('lith-portal') as LithPortal;
    expect(portal).toBeInTheDocument();

    // 检查内容被传送到默认容器
    const defaultContainer = document.getElementById('lith-portal-container');
    expect(defaultContainer).toBeInTheDocument();

    const portalContent = defaultContainer?.querySelector('h4');
    expect(portalContent?.textContent).toContain('传送的内容');
  },
};

export const CustomTarget: Story = {
  render: () => html`
    <div style="display: flex; gap: 40px;">
      <div style="flex: 1; padding: 20px; border: 2px dashed #ccc; border-radius: 8px;">
        <h3 style="margin: 0 0 16px 0;">源位置</h3>
        <lith-portal target="#custom-portal-target">
          <div
            style="
            padding: 16px;
            background: #4CAF50;
            color: white;
            border-radius: 6px;
          "
          >
            📍 这个内容会被传送到右边的容器中
          </div>
        </lith-portal>
      </div>

      <div style="flex: 1; padding: 20px; border: 2px solid #4CAF50; border-radius: 8px;">
        <h3 style="margin: 0 0 16px 0;">目标容器</h3>
        <div
          id="custom-portal-target"
          style="
          min-height: 100px;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 4px;
        "
        >
          <!-- Portal 内容会被渲染到这里 -->
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const targetContainer = canvasElement.querySelector('#custom-portal-target');
    expect(targetContainer).toBeInTheDocument();

    const content = targetContainer?.querySelector('div');
    expect(content?.textContent).toContain('这个内容会被传送到右边的容器中');
  },
};

export const RenderInPlace: Story = {
  args: {
    renderInPlace: true,
  },
  render: (args) => html`
    <div style="padding: 20px; border: 2px dashed #ccc; border-radius: 8px;">
      <h3 style="margin: 0 0 16px 0;">原地渲染模式</h3>
      <p style="margin: 0 0 16px 0;">当 renderInPlace 为 true 时，内容不会被传送：</p>

      <lith-portal ?render-in-place=${args.renderInPlace}>
        <div
          style="
          padding: 20px;
          background: #FF6B6B;
          color: white;
          border-radius: 8px;
        "
        >
          🏠 这个内容保持在原始位置，没有被传送
        </div>
      </lith-portal>

      <p style="margin: 16px 0 0 0; color: #666; font-size: 14px;">
        💡 适用于 SSR 或需要禁用传送功能的场景
      </p>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const portal = canvasElement.querySelector('lith-portal') as LithPortal;

    // 内容应该在原始位置
    const content = portal.querySelector('div');
    expect(content).toBeInTheDocument();
    expect(content?.textContent).toContain('这个内容保持在原始位置');

    // 不应该被挂载到其他地方
    expect(portal.isMounted()).toBe(false);
  },
};

export const DynamicActivation: Story = {
  render: () => html`
    <div style="padding: 20px;">
      <div style="margin-bottom: 20px;">
        <button
          id="activate-btn"
          style="padding: 8px 16px; margin-right: 8px;"
          disabled
          onclick="
            const portal = document.querySelector('#dynamic-portal');
            portal.active = true;
            this.disabled = true;
            document.getElementById('deactivate-btn').disabled = false;
          "
        >
          激活传送门
        </button>
        <button
          id="deactivate-btn"
          style="padding: 8px 16px;"
          onclick="
            const portal = document.querySelector('#dynamic-portal');
            portal.active = false;
            this.disabled = true;
            document.getElementById('activate-btn').disabled = false;
          "
        >
          停用传送门
        </button>
      </div>

      <div style="padding: 20px; border: 2px dashed #ccc; border-radius: 8px;">
        <h3 style="margin: 0 0 16px 0;">动态控制传送门</h3>

        <lith-portal
          id="dynamic-portal"
          active
          @lith-portal-mount=${(e: CustomEvent) => console.log('Portal mounted:', e.detail)}
          @lith-portal-unmount=${() => console.log('Portal unmounted')}
        >
          <div
            style="
            padding: 20px;
            background: #FFA500;
            color: white;
            border-radius: 8px;
          "
          >
            🔄 点击按钮切换传送状态
          </div>
        </lith-portal>
      </div>

      <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 4px;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          状态：<span id="status">已激活（内容在默认容器中）</span>
        </p>
      </div>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('初始状态应该是激活的', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const portal = canvasElement.querySelector('#dynamic-portal') as LithPortal;
      expect(portal.active).toBe(true);
      // 等待组件初始化完成
      await portal.updateComplete;
      expect(portal.isMounted()).toBe(true);
    });

    await step('点击停用按钮应该停用传送门', async () => {
      const deactivateBtn = canvas.getByText('停用传送门');
      const portal = canvasElement.querySelector('#dynamic-portal') as LithPortal;

      await userEvent.click(deactivateBtn);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await portal.updateComplete;

      expect(portal.active).toBe(false);
      expect(portal.isMounted()).toBe(false);
    });

    await step('点击激活按钮应该重新激活传送门', async () => {
      const activateBtn = canvas.getByText('激活传送门');
      await userEvent.click(activateBtn);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const portal = canvasElement.querySelector('#dynamic-portal') as LithPortal;
      await portal.updateComplete;
      expect(portal.active).toBe(true);
      expect(portal.isMounted()).toBe(true);
    });
  },
};

export const MultiplePortals: Story = {
  render: () => html`
    <div style="padding: 20px;">
      <h3 style="margin: 0 0 20px 0;">多个 Portal 实例</h3>

      <div
        style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;"
      >
        <lith-portal>
          <div
            style="
            padding: 16px;
            background: #E91E63;
            color: white;
            border-radius: 6px;
          "
          >
            Portal 1
          </div>
        </lith-portal>

        <lith-portal>
          <div
            style="
            padding: 16px;
            background: #9C27B0;
            color: white;
            border-radius: 6px;
          "
          >
            Portal 2
          </div>
        </lith-portal>

        <lith-portal>
          <div
            style="
            padding: 16px;
            background: #3F51B5;
            color: white;
            border-radius: 6px;
          "
          >
            Portal 3
          </div>
        </lith-portal>
      </div>

      <p style="color: #666; font-size: 14px;">
        💡 多个 Portal 可以共享同一个默认容器，内容会按顺序排列
      </p>
    </div>
  `,
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const defaultContainer = document.getElementById('lith-portal-container');
    expect(defaultContainer).toBeInTheDocument();

    // 等待所有 portal 组件完成初始化
    const portals = document.querySelectorAll('lith-portal');
    await Promise.all(Array.from(portals).map((portal) => (portal as LithPortal).updateComplete));

    // 应该有多个子元素（可能包含其他测试的 portal 内容）
    const children = defaultContainer?.children;
    expect(children?.length).toBeGreaterThanOrEqual(3);

    // 检查是否包含我们的 portal 内容
    const allText = defaultContainer?.textContent || '';
    expect(allText).toContain('Portal 1');
    expect(allText).toContain('Portal 2');
    expect(allText).toContain('Portal 3');
  },
};

export const NestedContent: Story = {
  render: () => html`
    <div style="padding: 20px;">
      <h3 style="margin: 0 0 20px 0;">嵌套内容传送</h3>

      <lith-portal target="#nested-target">
        <div
          style="
          padding: 20px;
          background: #00BCD4;
          color: white;
          border-radius: 8px;
        "
        >
          <h4 style="margin: 0 0 12px 0;">父级内容</h4>
          <div
            style="
            padding: 12px;
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
          "
          >
            <p style="margin: 0 0 8px 0;">嵌套的子内容 1</p>
            <p style="margin: 0;">嵌套的子内容 2</p>
          </div>
          <button
            style="
            margin-top: 12px;
            padding: 8px 16px;
            background: white;
            color: #00BCD4;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          "
          >
            交互按钮
          </button>
        </div>
      </lith-portal>

      <div
        id="nested-target"
        style="
        margin-top: 20px;
        padding: 20px;
        border: 2px solid #00BCD4;
        border-radius: 8px;
        min-height: 150px;
      "
      >
        <p style="margin: 0 0 16px 0; color: #666;">目标容器：</p>
      </div>
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('嵌套内容应该完整传送', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const target = canvasElement.querySelector('#nested-target');
      expect(target).toBeInTheDocument();

      const parentContent = target?.querySelector('h4');
      expect(parentContent?.textContent).toBe('父级内容');

      const childContent = target?.querySelectorAll('p');
      expect(childContent?.length).toBeGreaterThan(2);
    });

    await step('交互元素应该正常工作', async () => {
      const button = canvas.getByText('交互按钮');
      await userEvent.click(button);
      // 按钮应该可以正常点击
      expect(button).toBeInTheDocument();
    });
  },
};

export const ZIndexHandling: Story = {
  render: () => html`
    <div style="padding: 20px;">
      <h3 style="margin: 0 0 20px 0;">Z-Index 层级处理</h3>

      <div style="position: relative; z-index: 1;">
        <div
          style="
          position: relative;
          padding: 20px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px;
          z-index: 10;
        "
        >
          <p style="margin: 0 0 16px 0;">这是一个 z-index: 10 的容器</p>

          <lith-portal>
            <div
              style="
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              padding: 30px;
              background: #F44336;
              color: white;
              border-radius: 8px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.3);
              z-index: 9999;
            "
            >
              <h4 style="margin: 0 0 8px 0;">🎯 高层级内容</h4>
              <p style="margin: 0;">Portal 确保内容在最高层级，避免被遮挡</p>
            </div>
          </lith-portal>
        </div>

        <div
          style="
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 16px;
          background: #2196F3;
          color: white;
          border-radius: 4px;
          z-index: 100;
        "
        >
          z-index: 100 的元素
        </div>
      </div>

      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        💡 Portal 默认使用 z-index: 9999，可通过 CSS 变量自定义
      </p>
    </div>
  `,
};

export const SSRSupport: Story = {
  render: () => html`
    <div style="padding: 20px;">
      <h3 style="margin: 0 0 20px 0;">SSR 支持示例</h3>

      <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin-bottom: 16px;">
        <code style="font-size: 14px;"> &lt;lith-portal render-in-place&gt; </code>
      </div>

      <lith-portal render-in-place>
        <div
          style="
          padding: 20px;
          background: #009688;
          color: white;
          border-radius: 8px;
        "
        >
          <h4 style="margin: 0 0 8px 0;">SSR 友好的内容</h4>
          <p style="margin: 0;">
            使用 render-in-place 属性，内容在服务端渲染时保持原位， 避免客户端激活时的内容跳动。
          </p>
        </div>
      </lith-portal>

      <div style="margin-top: 20px; padding: 16px; background: #e8f5e9; border-radius: 8px;">
        <p style="margin: 0; color: #2e7d32; font-size: 14px;">
          ✅ 适合 SSR/SSG 场景，内容在原始位置渲染，无需 JavaScript 即可显示
        </p>
      </div>
    </div>
  `,
};
