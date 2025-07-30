import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/navigation/lith-dropdown-menu.js';

const meta: Meta = {
  title: 'Components/DropdownMenu',
  component: 'lith-dropdown-menu',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
DropdownMenu 是一个基于 Popover 的下拉菜单组件，专门用于操作菜单和动作列表。

## 特性

- 🖱️ **点击触发** - 点击触发器显示下拉菜单
- ⌨️ **键盘导航** - 支持方向键、Enter、Escape、Home、End 等键盘操作
- 🎯 **智能定位** - 基于 Popover 的智能定位系统
- 🔗 **支持链接** - 菜单项可以是按钮或链接
- 📝 **丰富内容** - 支持图标、快捷键、分隔符和禁用状态
- 🎨 **完全可定制** - Headless 设计，通过 CSS 自定义属性控制样式
- ♿ **可访问性** - 符合 ARIA 规范，支持屏幕阅读器

## 使用场景

- 工具栏的操作按钮
- 表格行的更多操作菜单
- 应用程序的主菜单
- 任何需要下拉操作的界面元素
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: '菜单项数组',
    },
    open: {
      control: 'boolean',
      description: '控制菜单的显示状态',
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
      description: '菜单相对于触发器的位置',
    },
    closeOnSelect: {
      control: 'boolean',
      description: '选择菜单项后是否自动关闭菜单',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用整个菜单',
    },
  },
};

export default meta;
type Story = StoryObj;

const basicItems = [
  { id: 'new', label: 'New', shortcut: 'Ctrl+N', icon: '📄' },
  { id: 'open', label: 'Open', shortcut: 'Ctrl+O', icon: '📂' },
  { id: 'save', label: 'Save', shortcut: 'Ctrl+S', icon: '💾' },
  { id: 'separator1', label: '', separator: true },
  { id: 'print', label: 'Print', shortcut: 'Ctrl+P', icon: '🖨️' },
  { id: 'separator2', label: '', separator: true },
  { id: 'exit', label: 'Exit', shortcut: 'Ctrl+Q', icon: '🚪' },
];

export const Default: Story = {
  args: {
    items: basicItems,
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
  },
  render: (args) => html`
    <lith-dropdown-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      @lith-dropdown-menu-select=${(e: CustomEvent) => {
        console.log('Menu item selected:', e.detail.item);
        alert(`Selected: ${e.detail.item.label}`);
      }}
      style="
        --lith-dropdown-menu-min-width: 200px;
        --lith-dropdown-menu-item-height: 36px;
      "
    >
      <button
        slot="trigger"
        style="
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        "
      >
        File ▼
      </button>
    </lith-dropdown-menu>
  `,
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', icon: '↶' },
      { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', icon: '↷', disabled: true },
      { id: 'separator1', label: '', separator: true },
      { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', icon: '✂️' },
      { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', icon: '📋' },
      { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', icon: '📌', disabled: true },
      { id: 'separator2', label: '', separator: true },
      { id: 'select-all', label: 'Select All', shortcut: 'Ctrl+A', icon: '🔘' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
  },
  render: (args) => html`
    <lith-dropdown-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      @lith-dropdown-menu-select=${(e: CustomEvent) => {
        console.log('Edit action:', e.detail.item);
        alert(`Edit action: ${e.detail.item.label}`);
      }}
    >
      <button
        slot="trigger"
        style="
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        "
      >
        Edit ▼
      </button>
    </lith-dropdown-menu>
  `,
};

export const WithLinks: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '/', icon: '🏠' },
      { id: 'about', label: 'About', href: '/about', icon: 'ℹ️' },
      { id: 'docs', label: 'Documentation', href: '/docs', target: '_blank', icon: '📖' },
      { id: 'separator1', label: '', separator: true },
      { id: 'github', label: 'GitHub', href: 'https://github.com', target: '_blank', icon: '🐙' },
      { id: 'npm', label: 'NPM', href: 'https://npmjs.com', target: '_blank', icon: '📦' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
  },
  render: (args) => html`
    <lith-dropdown-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      @lith-dropdown-menu-select=${(e: CustomEvent) => {
        console.log('Navigation:', e.detail.item);
      }}
      style="--lith-dropdown-menu-min-width: 180px;"
    >
      <button
        slot="trigger"
        style="
          padding: 8px 16px;
          background: #6f42c1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        "
      >
        Links ▼
      </button>
    </lith-dropdown-menu>
  `,
};

export const DifferentPlacements: Story = {
  args: {
    items: [
      { id: 'item1', label: 'Item 1', icon: '1️⃣' },
      { id: 'item2', label: 'Item 2', icon: '2️⃣' },
      { id: 'item3', label: 'Item 3', icon: '3️⃣' },
    ],
    closeOnSelect: true,
    disabled: false,
  },
  render: (args) => html`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding: 100px;">
      ${[
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
      ].map(
        (placement) => html`
          <lith-dropdown-menu
            .items=${args.items}
            .placement=${placement}
            ?close-on-select=${args.closeOnSelect}
            ?disabled=${args.disabled}
            @lith-dropdown-menu-select=${(e: CustomEvent) => {
              console.log(`${placement}:`, e.detail.item);
              alert(`${placement}: ${e.detail.item.label}`);
            }}
          >
            <button
              slot="trigger"
              style="
                padding: 8px 12px;
                background: #17a2b8;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
              "
            >
              ${placement}
            </button>
          </lith-dropdown-menu>
        `
      )}
    </div>
  `,
};

export const TableActions: Story = {
  args: {
    closeOnSelect: true,
    disabled: false,
  },
  render: (args) => {
    const users = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Inactive' },
      { id: 3, name: 'Carol Davis', email: 'carol@example.com', status: 'Active' },
    ];

    return html`
      <div style="padding: 20px;">
        <h3 style="margin-bottom: 16px;">User Management Table</h3>
        <table
          style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
        >
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">
                Name
              </th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">
                Email
              </th>
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">
                Status
              </th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            ${users.map(
              (user) => html`
                <tr style="border-bottom: 1px solid #f1f3f4;">
                  <td style="padding: 12px;">${user.name}</td>
                  <td style="padding: 12px;">${user.email}</td>
                  <td style="padding: 12px;">
                    <span
                      style="
                      padding: 4px 8px;
                      border-radius: 12px;
                      font-size: 12px;
                      font-weight: 500;
                      background: ${user.status === 'Active' ? '#d4edda' : '#f8d7da'};
                      color: ${user.status === 'Active' ? '#155724' : '#721c24'};
                    "
                    >
                      ${user.status}
                    </span>
                  </td>
                  <td style="padding: 12px; text-align: center;">
                    <lith-dropdown-menu
                      .items=${[
                        { id: 'view', label: 'View Profile', icon: '👤' },
                        { id: 'edit', label: 'Edit User', icon: '✏️' },
                        { id: 'separator1', label: '', separator: true },
                        {
                          id: 'activate',
                          label: user.status === 'Active' ? 'Deactivate' : 'Activate',
                          icon: user.status === 'Active' ? '⏸️' : '▶️',
                        },
                        { id: 'separator2', label: '', separator: true },
                        { id: 'delete', label: 'Delete User', icon: '🗑️' },
                      ]}
                      placement="bottom-end"
                      ?close-on-select=${args.closeOnSelect}
                      ?disabled=${args.disabled}
                      @lith-dropdown-menu-select=${(e: CustomEvent) => {
                        console.log(`${e.detail.item.label} for ${user.name}`);
                        alert(`${e.detail.item.label} for ${user.name}`);
                      }}
                    >
                      <button
                        slot="trigger"
                        style="
                          padding: 4px 8px;
                          background: transparent;
                          border: 1px solid #ddd;
                          border-radius: 4px;
                          cursor: pointer;
                          display: flex;
                          align-items: center;
                          gap: 4px;
                        "
                      >
                        ⋯
                      </button>
                    </lith-dropdown-menu>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  },
};

export const CustomStyling: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'reports', label: 'Reports', icon: '📋' },
      { id: 'separator1', label: '', separator: true },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'help', label: 'Help', icon: '❓' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
  },
  render: (args) => html`
    <lith-dropdown-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      @lith-dropdown-menu-select=${(e: CustomEvent) => {
        console.log('Custom styled menu:', e.detail.item);
        alert(`Custom styled menu: ${e.detail.item.label}`);
      }}
      style="
        --lith-dropdown-menu-min-width: 220px;
        --lith-dropdown-menu-max-width: 280px;
        --lith-dropdown-menu-item-height: 40px;
        --lith-dropdown-menu-item-padding: 12px 16px;
        --lith-dropdown-menu-separator-height: 2px;
        --lith-dropdown-menu-z-index: 2000;
      "
    >
      <button
        slot="trigger"
        style="
          padding: 12px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          transition: transform 150ms ease, box-shadow 150ms ease;
        "
        onmouseenter="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(102, 126, 234, 0.4)'"
        onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)'"
      >
        🎨 Custom Menu ▼
      </button>
    </lith-dropdown-menu>
  `,
};

export const NoCloseOnSelect: Story = {
  args: {
    items: [
      { id: 'bold', label: 'Bold', shortcut: 'Ctrl+B', icon: '𝐁' },
      { id: 'italic', label: 'Italic', shortcut: 'Ctrl+I', icon: '𝐼' },
      { id: 'underline', label: 'Underline', shortcut: 'Ctrl+U', icon: '𝐔' },
      { id: 'separator1', label: '', separator: true },
      { id: 'strikethrough', label: 'Strikethrough', icon: '𝐒' },
      { id: 'code', label: 'Code', shortcut: 'Ctrl+`', icon: '⌨️' },
    ],
    placement: 'bottom-start',
    closeOnSelect: false,
    disabled: false,
  },
  render: (args) => html`
    <lith-dropdown-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      @lith-dropdown-menu-select=${(e: CustomEvent) => {
        console.log('Formatting:', e.detail.item);
        // Don't show alert as menu stays open
      }}
      style="--lith-dropdown-menu-min-width: 180px;"
    >
      <button
        slot="trigger"
        style="
          padding: 8px 16px;
          background: #fd7e14;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        "
      >
        Format ▼
      </button>
    </lith-dropdown-menu>
    <p style="margin-top: 16px; font-size: 14px; color: #666;">
      💡 提示：选择菜单项后菜单不会自动关闭，可以连续选择多个选项。
    </p>
  `,
};

export const DisabledMenu: Story = {
  args: {
    items: basicItems,
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: true,
  },
  render: (args) => html`
    <lith-dropdown-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      @lith-dropdown-menu-select=${(e: CustomEvent) => {
        console.log('This should not fire:', e.detail.item);
      }}
    >
      <button
        slot="trigger"
        style="
          padding: 8px 16px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: not-allowed;
          opacity: 0.6;
          display: flex;
          align-items: center;
          gap: 8px;
        "
        disabled
      >
        Disabled Menu ▼
      </button>
    </lith-dropdown-menu>
  `,
};

export const ProgrammaticControl: Story = {
  args: {
    items: [
      { id: 'action1', label: 'Action 1', icon: '1️⃣' },
      { id: 'action2', label: 'Action 2', icon: '2️⃣' },
      { id: 'action3', label: 'Action 3', icon: '3️⃣' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
  },
  render: (args) => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <lith-dropdown-menu
        id="programmatic-dropdown"
        .items=${args.items}
        .placement=${args.placement}
        ?close-on-select=${args.closeOnSelect}
        ?disabled=${args.disabled}
        @lith-dropdown-menu-select=${(e: CustomEvent) => {
          console.log('Programmatic menu:', e.detail.item);
          alert(`Programmatic menu: ${e.detail.item.label}`);
        }}
      >
        <button
          slot="trigger"
          style="
            padding: 8px 16px;
            background: #e83e8c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
          "
        >
          Actions ▼
        </button>
      </lith-dropdown-menu>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button
          style="padding: 6px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-dropdown').show()"
        >
          Show
        </button>
        <button
          style="padding: 6px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-dropdown').close()"
        >
          Close
        </button>
        <button
          style="padding: 6px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-dropdown').toggle()"
        >
          Toggle
        </button>
      </div>
    </div>
  `,
};
