import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/navigation/lith-context-menu.js';

const meta: Meta = {
  title: 'Components/ContextMenu',
  component: 'lith-context-menu',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
ContextMenu 是一个基于 Popover 的右键菜单组件，提供完整的交互逻辑。

## 特性

- 🖱️ **右键触发** - 在指定区域右键点击显示菜单
- ⌨️ **键盘导航** - 支持方向键、Enter、Escape 等键盘操作
- 🎯 **智能定位** - 自动根据鼠标位置定位菜单
- 📝 **丰富内容** - 支持图标、快捷键、分隔符和禁用状态
- 🎨 **完全可定制** - Headless 设计，通过 CSS 自定义属性控制样式
- ♿ **可访问性** - 符合 ARIA 规范，支持屏幕阅读器

## 使用场景

- 文件管理器的右键菜单
- 文本编辑器的上下文菜单
- 数据表格的行操作菜单
- 任何需要上下文操作的界面元素
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
    preventDefault: {
      control: 'boolean',
      description: '是否阻止默认的右键菜单',
    },
  },
};

export default meta;
type Story = StoryObj;

const basicItems = [
  { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', icon: '✂️' },
  { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', icon: '📋' },
  { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', icon: '📌', disabled: true },
  { id: 'separator1', label: '', separator: true },
  { id: 'select-all', label: 'Select All', shortcut: 'Ctrl+A', icon: '🔘' },
  { id: 'separator2', label: '', separator: true },
  { id: 'properties', label: 'Properties', icon: '⚙️' },
];

export const Default: Story = {
  args: {
    items: basicItems,
    preventDefault: true,
  },
  render: (args) => html`
    <lith-context-menu
      .items=${args.items}
      ?prevent-default=${args.preventDefault}
      @lith-context-menu-select=${(e: CustomEvent) => {
        console.log('Menu item selected:', e.detail.item);
        alert(`Selected: ${e.detail.item.label}`);
      }}
      style="
        --lith-context-menu-min-width: 200px;
        --lith-context-menu-item-height: 36px;
      "
    >
      <div
        style="
        width: 300px;
        height: 200px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
      "
      >
        右键点击我显示菜单
      </div>
    </lith-context-menu>
  `,
};

export const FileManager: Story = {
  args: {
    items: [
      { id: 'open', label: 'Open', icon: '📂' },
      { id: 'open-with', label: 'Open with...', icon: '🔧' },
      { id: 'separator1', label: '', separator: true },
      { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', icon: '✂️' },
      { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', icon: '📋' },
      { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', icon: '📌' },
      { id: 'separator2', label: '', separator: true },
      { id: 'rename', label: 'Rename', shortcut: 'F2', icon: '✏️' },
      { id: 'delete', label: 'Delete', shortcut: 'Del', icon: '🗑️' },
      { id: 'separator3', label: '', separator: true },
      { id: 'properties', label: 'Properties', shortcut: 'Alt+Enter', icon: '⚙️' },
    ],
    preventDefault: true,
  },
  render: (args) => html`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 20px;">
      ${['Document.pdf', 'Image.jpg', 'Folder'].map(
        (name) => html`
          <lith-context-menu
            .items=${args.items}
            ?prevent-default=${args.preventDefault}
            @lith-context-menu-select=${(e: CustomEvent) => {
              console.log(`${e.detail.item.label} on ${name}`);
              alert(`${e.detail.item.label} on ${name}`);
            }}
          >
            <div
              style="
            width: 120px;
            height: 100px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 150ms ease;
          "
              onmouseenter="this.style.backgroundColor='#e9ecef'"
              onmouseleave="this.style.backgroundColor='#f8f9fa'"
            >
              <div style="font-size: 32px; margin-bottom: 8px;">
                ${name === 'Folder' ? '📁' : name.includes('pdf') ? '📄' : '🖼️'}
              </div>
              <div style="font-size: 12px; text-align: center; padding: 0 8px;">${name}</div>
            </div>
          </lith-context-menu>
        `
      )}
    </div>
  `,
};

export const TextEditor: Story = {
  args: {
    items: [
      { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', icon: '↶' },
      { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', icon: '↷' },
      { id: 'separator1', label: '', separator: true },
      { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', icon: '✂️' },
      { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', icon: '📋' },
      { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', icon: '📌' },
      { id: 'separator2', label: '', separator: true },
      { id: 'select-all', label: 'Select All', shortcut: 'Ctrl+A', icon: '🔘' },
      { id: 'find', label: 'Find', shortcut: 'Ctrl+F', icon: '🔍' },
      { id: 'replace', label: 'Replace', shortcut: 'Ctrl+H', icon: '🔄' },
    ],
    preventDefault: true,
  },
  render: (args) => html`
    <lith-context-menu
      .items=${args.items}
      ?prevent-default=${args.preventDefault}
      @lith-context-menu-select=${(e: CustomEvent) => {
        console.log('Editor action:', e.detail.item.label);
        alert(`Editor action: ${e.detail.item.label}`);
      }}
      style="
        --lith-context-menu-min-width: 180px;
        --lith-context-menu-item-padding: 10px 14px;
      "
    >
      <textarea
        style="
        width: 400px;
        height: 300px;
        padding: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 14px;
        line-height: 1.5;
        resize: none;
        outline: none;
      "
        placeholder="在这里输入一些文本，然后右键查看上下文菜单...

你可以尝试：
- 选择一些文本后右键
- 在空白区域右键
- 使用键盘导航（方向键、Enter、Escape）"
      ></textarea>
    </lith-context-menu>
  `,
};

export const DataTable: Story = {
  args: {
    preventDefault: true,
  },
  render: (args) => {
    const users = [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
      { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Editor' },
    ];

    return html`
      <div style="padding: 20px;">
        <h3 style="margin-bottom: 16px;">User Management</h3>
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
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            ${users.map(
              (user) => html`
                <lith-context-menu
                  .items=${[
                    { id: 'view', label: 'View Profile', icon: '👤' },
                    { id: 'edit', label: 'Edit User', icon: '✏️' },
                    { id: 'separator1', label: '', separator: true },
                    {
                      id: 'promote',
                      label: 'Promote to Admin',
                      icon: '⬆️',
                      disabled: user.role === 'Admin',
                    },
                    {
                      id: 'demote',
                      label: 'Demote to User',
                      icon: '⬇️',
                      disabled: user.role === 'User',
                    },
                    { id: 'separator2', label: '', separator: true },
                    { id: 'disable', label: 'Disable Account', icon: '🚫' },
                    { id: 'delete', label: 'Delete User', icon: '🗑️' },
                  ]}
                  ?prevent-default=${args.preventDefault}
                  @lith-context-menu-select=${(e: CustomEvent) => {
                    console.log(`${e.detail.item.label} for ${user.name}`);
                    alert(`${e.detail.item.label} for ${user.name}`);
                  }}
                >
                  <tr
                    style="
                  border-bottom: 1px solid #f1f3f4;
                  transition: background-color 150ms ease;
                  cursor: pointer;
                "
                    onmouseenter="this.style.backgroundColor='#f8f9fa'"
                    onmouseleave="this.style.backgroundColor='white'"
                  >
                    <td style="padding: 12px;">${user.name}</td>
                    <td style="padding: 12px;">${user.email}</td>
                    <td style="padding: 12px;">
                      <span
                        style="
                      padding: 4px 8px;
                      border-radius: 12px;
                      font-size: 12px;
                      font-weight: 500;
                      background: ${user.role === 'Admin'
                          ? '#d4edda'
                          : user.role === 'Editor'
                            ? '#fff3cd'
                            : '#f8d7da'};
                      color: ${user.role === 'Admin'
                          ? '#155724'
                          : user.role === 'Editor'
                            ? '#856404'
                            : '#721c24'};
                    "
                      >
                        ${user.role}
                      </span>
                    </td>
                  </tr>
                </lith-context-menu>
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
      { id: 'new', label: 'New Document', icon: '📄' },
      { id: 'open', label: 'Open File', icon: '📂' },
      { id: 'save', label: 'Save', shortcut: 'Ctrl+S', icon: '💾' },
      { id: 'separator1', label: '', separator: true },
      { id: 'print', label: 'Print', shortcut: 'Ctrl+P', icon: '🖨️' },
      { id: 'export', label: 'Export as PDF', icon: '📑' },
      { id: 'separator2', label: '', separator: true },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'help', label: 'Help', shortcut: 'F1', icon: '❓' },
    ],
    preventDefault: true,
  },
  render: (args) => html`
    <lith-context-menu
      .items=${args.items}
      ?prevent-default=${args.preventDefault}
      @lith-context-menu-select=${(e: CustomEvent) => {
        console.log('Custom styled menu:', e.detail.item.label);
        alert(`Custom styled menu: ${e.detail.item.label}`);
      }}
      style="
        --lith-context-menu-min-width: 240px;
        --lith-context-menu-max-width: 280px;
        --lith-context-menu-item-height: 40px;
        --lith-context-menu-item-padding: 12px 16px;
        --lith-context-menu-separator-height: 2px;
        --lith-context-menu-z-index: 3000;
      "
    >
      <div
        style="
        width: 320px;
        height: 180px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        position: relative;
        overflow: hidden;
      "
      >
        <div
          style="
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        "
        ></div>
        <div style="font-size: 24px; margin-bottom: 8px; z-index: 1;">🎨</div>
        <div style="font-size: 18px; font-weight: 600; z-index: 1;">Custom Styled Menu</div>
        <div style="font-size: 14px; opacity: 0.9; z-index: 1;">
          Right-click to see custom styling
        </div>
      </div>
    </lith-context-menu>
  `,
};

export const ProgrammaticControl: Story = {
  args: {
    items: [
      { id: 'action1', label: 'Action 1', icon: '1️⃣' },
      { id: 'action2', label: 'Action 2', icon: '2️⃣' },
      { id: 'action3', label: 'Action 3', icon: '3️⃣' },
    ],
    preventDefault: true,
  },
  render: (args) => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <lith-context-menu
        id="programmatic-menu"
        .items=${args.items}
        ?prevent-default=${args.preventDefault}
        @lith-context-menu-select=${(e: CustomEvent) => {
          console.log('Programmatic menu:', e.detail.item.label);
          alert(`Programmatic menu: ${e.detail.item.label}`);
        }}
      >
        <div
          style="
          width: 200px;
          height: 100px;
          background: #f8f9fa;
          border: 2px dashed #6c757d;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        "
        >
          Target Area
        </div>
      </lith-context-menu>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button
          style="padding: 8px 16px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-menu').show()"
        >
          Show Menu
        </button>
        <button
          style="padding: 8px 16px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-menu').showAt(300, 200)"
        >
          Show at (300, 200)
        </button>
        <button
          style="padding: 8px 16px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-menu').close()"
        >
          Close Menu
        </button>
      </div>
    </div>
  `,
};

export const NoDefaultPrevention: Story = {
  args: {
    items: basicItems,
    preventDefault: false,
  },
  render: (args) => html`
    <lith-context-menu
      .items=${args.items}
      ?prevent-default=${args.preventDefault}
      @lith-context-menu-select=${(e: CustomEvent) => {
        console.log('Menu item selected:', e.detail.item);
        alert(`Selected: ${e.detail.item.label}`);
      }}
    >
      <div
        style="
        width: 300px;
        height: 150px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
      "
      >
        <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">⚠️ 不阻止默认菜单</div>
        <div style="font-size: 14px; text-align: center; opacity: 0.8;">
          右键会同时显示自定义菜单<br />和浏览器默认菜单
        </div>
      </div>
    </lith-context-menu>
  `,
};
