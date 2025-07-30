import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/navigation/lith-menu.js';
import '../src/components/navigation/lith-menu-item.js';

const meta: Meta = {
  title: 'Components/Menu',
  component: 'lith-menu',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Menu组件

一个无样式的下拉菜单组件，提供完整的交互逻辑和可访问性支持。

### 特性

- **Headless设计** - 无预定义样式，完全可定制
- **键盘导航** - 支持方向键、Enter、Space、Escape等键盘操作
- **可访问性** - 遵循WCAG标准，支持屏幕阅读器
- **事件系统** - 丰富的事件支持，便于集成
- **灵活配置** - 支持多种配置选项

### 键盘交互

- **Enter/Space** - 打开菜单或激活高亮项
- **Escape** - 关闭菜单并返回焦点到触发器
- **ArrowDown/ArrowUp** - 导航菜单项
- **Home/End** - 跳转到第一个/最后一个菜单项

### 事件

- \`lith-menu-item-click\` - 菜单项被点击时触发
- \`lith-open\` - 菜单打开时触发
- \`lith-close\` - 菜单关闭时触发
- \`lith-focus\` - 触发器获得焦点时触发
- \`lith-blur\` - 触发器失去焦点时触发
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: '菜单是否打开',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用菜单',
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      description: '菜单显示位置',
    },
    closeOnSelect: {
      control: 'boolean',
      description: '选择项目后是否自动关闭菜单',
    },
  },
  args: {
    open: false,
    disabled: false,
    placement: 'bottom-start',
    closeOnSelect: true,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <lith-menu
      ?open=${args.open}
      ?disabled=${args.disabled}
      placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      style="
        --lith-menu-trigger-padding: 12px 16px;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: white;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --lith-menu-max-height: 200px;
        --lith-menu-z-index: 1000;
      "
    >
      <span slot="trigger">Actions</span>
      <span slot="trigger-icon">▼</span>

      <lith-menu-item
        value="edit"
        style="
          --lith-menu-item-padding: 8px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        Edit
      </lith-menu-item>
      <lith-menu-item
        value="copy"
        style="
          --lith-menu-item-padding: 8px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        Copy
      </lith-menu-item>
      <lith-menu-item
        value="delete"
        style="
          --lith-menu-item-padding: 8px 16px;
          background: white;
          color: #dc3545;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        Delete
      </lith-menu-item>
    </lith-menu>
  `,
};

export const WithIcons: Story = {
  render: (args) => html`
    <lith-menu
      ?open=${args.open}
      ?disabled=${args.disabled}
      placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      style="
        --lith-menu-trigger-padding: 12px 16px;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: white;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --lith-menu-max-height: 250px;
      "
    >
      <span slot="trigger">More Actions</span>
      <span slot="trigger-icon">⋮</span>

      <lith-menu-item
        value="share"
        style="
          --lith-menu-item-padding: 10px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        <span slot="icon">📤</span>
        Share
      </lith-menu-item>
      <lith-menu-item
        value="download"
        style="
          --lith-menu-item-padding: 10px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        <span slot="icon">⬇️</span>
        Download
      </lith-menu-item>
      <lith-menu-item
        value="favorite"
        style="
          --lith-menu-item-padding: 10px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        <span slot="icon">⭐</span>
        Add to Favorites
      </lith-menu-item>
      <lith-menu-item
        value="settings"
        style="
          --lith-menu-item-padding: 10px 16px;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        <span slot="icon">⚙️</span>
        Settings
      </lith-menu-item>
    </lith-menu>
  `,
};

export const WithLinks: Story = {
  render: (args) => html`
    <lith-menu
      ?open=${args.open}
      ?disabled=${args.disabled}
      placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      style="
        --lith-menu-trigger-padding: 12px 16px;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: white;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --lith-menu-max-height: 200px;
      "
    >
      <span slot="trigger">Navigation</span>
      <span slot="trigger-icon">▼</span>

      <lith-menu-item
        value="home"
        href="/"
        style="
          --lith-menu-item-padding: 10px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        Home
      </lith-menu-item>
      <lith-menu-item
        value="about"
        href="/about"
        style="
          --lith-menu-item-padding: 10px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        About
      </lith-menu-item>
      <lith-menu-item
        value="contact"
        href="/contact"
        style="
          --lith-menu-item-padding: 10px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        Contact
      </lith-menu-item>
      <lith-menu-item
        value="external"
        href="https://example.com"
        target="_blank"
        style="
          --lith-menu-item-padding: 10px 16px;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        External Link
        <span slot="suffix">↗</span>
      </lith-menu-item>
    </lith-menu>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => html`
    <lith-menu
      ?open=${args.open}
      ?disabled=${args.disabled}
      placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      style="
        --lith-menu-trigger-padding: 12px 16px;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: #f5f5f5;
        color: #999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      "
    >
      <span slot="trigger">Disabled Menu</span>
      <span slot="trigger-icon">▼</span>

      <lith-menu-item value="item1">Item 1</lith-menu-item>
      <lith-menu-item value="item2">Item 2</lith-menu-item>
    </lith-menu>
  `,
};

export const WithDisabledItems: Story = {
  render: (args) => html`
    <lith-menu
      ?open=${args.open}
      ?disabled=${args.disabled}
      placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      style="
        --lith-menu-trigger-padding: 12px 16px;
        border: 1px solid #ccc;
        border-radius: 6px;
        background: white;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      "
    >
      <span slot="trigger">Mixed Menu</span>
      <span slot="trigger-icon">▼</span>

      <lith-menu-item
        value="available"
        style="
          --lith-menu-item-padding: 10px 16px;
          border-bottom: 1px solid #eee;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        Available Item
      </lith-menu-item>
      <lith-menu-item
        value="disabled"
        disabled
        style="
          --lith-menu-item-padding: 10px 16px;
          border-bottom: 1px solid #eee;
          background: white;
          opacity: 0.5;
        "
      >
        Disabled Item
      </lith-menu-item>
      <lith-menu-item
        value="another"
        style="
          --lith-menu-item-padding: 10px 16px;
          background: white;
        "
        @mouseover="${(e) => (e.target.style.background = '#f5f5f5')}"
        @mouseout="${(e) => (e.target.style.background = 'white')}"
      >
        Another Item
      </lith-menu-item>
    </lith-menu>
  `,
};

export const Interactive: Story = {
  render: (args) => {
    const handleMenuItemClick = (e: CustomEvent) => {
      console.log('Menu item clicked:', e.detail);
      alert(`Clicked: ${e.detail.value}`);
    };

    const handleOpen = () => {
      console.log('Menu opened');
    };

    const handleClose = () => {
      console.log('Menu closed');
    };

    return html`
      <lith-menu
        ?open=${args.open}
        ?disabled=${args.disabled}
        placement=${args.placement}
        ?close-on-select=${args.closeOnSelect}
        @lith-menu-item-click=${handleMenuItemClick}
        @lith-open=${handleOpen}
        @lith-close=${handleClose}
        style="
          --lith-menu-trigger-padding: 12px 16px;
          border: 1px solid #007bff;
          border-radius: 6px;
          background: white;
          color: #007bff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          cursor: pointer;
        "
      >
        <span slot="trigger">Interactive Menu</span>
        <span slot="trigger-icon">▼</span>

        <lith-menu-item
          value="action1"
          style="
            --lith-menu-item-padding: 10px 16px;
            border-bottom: 1px solid #eee;
            background: white;
          "
          @mouseover="${(e) => (e.target.style.background = '#e7f3ff')}"
          @mouseout="${(e) => (e.target.style.background = 'white')}"
        >
          Action 1
        </lith-menu-item>
        <lith-menu-item
          value="action2"
          style="
            --lith-menu-item-padding: 10px 16px;
            border-bottom: 1px solid #eee;
            background: white;
          "
          @mouseover="${(e) => (e.target.style.background = '#e7f3ff')}"
          @mouseout="${(e) => (e.target.style.background = 'white')}"
        >
          Action 2
        </lith-menu-item>
        <lith-menu-item
          value="action3"
          style="
            --lith-menu-item-padding: 10px 16px;
            background: white;
          "
          @mouseover="${(e) => (e.target.style.background = '#e7f3ff')}"
          @mouseout="${(e) => (e.target.style.background = 'white')}"
        >
          Action 3
        </lith-menu-item>
      </lith-menu>
      <p style="margin-top: 20px; font-size: 14px; color: #666;">
        点击菜单项会显示弹窗，并在控制台输出详细信息。
      </p>
    `;
  },
};
