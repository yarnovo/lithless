import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, userEvent, within } from 'storybook/test';
import '../src/components/navigation/lith-menu-bar.js';

const meta: Meta = {
  title: 'Components/MenuBar',
  component: 'lith-menu-bar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
MenuBar 是一个水平菜单栏组件，专门用于构建应用程序的主菜单栏。

## 特性

- 🔄 **水平布局** - 横向排列的菜单项布局
- 📱 **响应式设计** - 支持不同屏幕尺寸的适配
- 🖱️ **点击和悬停** - 支持点击和悬停交互模式
- ⌨️ **键盘导航** - 完整的键盘支持，包括方向键、Enter、Escape等
- 📥 **下拉菜单** - 支持下拉子菜单功能
- 🔗 **混合内容** - 支持按钮、链接和下拉菜单混合使用
- 🏷️ **丰富标识** - 支持图标、徽章和下拉箭头
- 🎨 **完全可定制** - Headless 设计，通过 CSS 自定义属性控制样式
- ♿ **可访问性** - 符合 ARIA 规范，支持屏幕阅读器

## 使用场景

- 应用程序主菜单栏
- 网站顶部导航栏
- 桌面应用程序菜单
- 工具栏菜单
- 任何需要水平菜单的界面
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: '菜单栏项数组，支持下拉子菜单',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用整个菜单栏',
    },
    closeOnSelect: {
      control: 'boolean',
      description: '选择菜单项后是否自动关闭下拉菜单',
    },
    dropdownPlacement: {
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
      description: '下拉菜单相对于菜单项的位置',
    },
  },
};

export default meta;
type Story = StoryObj;

const applicationMenuItems = [
  {
    id: 'file',
    label: 'File',
    icon: '📁',
    children: [
      { id: 'new', label: 'New', icon: '📄', shortcut: 'Ctrl+N' },
      { id: 'open', label: 'Open', icon: '📂', shortcut: 'Ctrl+O' },
      { id: 'recent', label: 'Recent Files', icon: '🕒' },
      { id: 'separator1', label: '', separator: true },
      { id: 'save', label: 'Save', icon: '💾', shortcut: 'Ctrl+S' },
      { id: 'save-as', label: 'Save As...', icon: '💾', shortcut: 'Ctrl+Shift+S' },
      { id: 'separator2', label: '', separator: true },
      { id: 'print', label: 'Print', icon: '🖨️', shortcut: 'Ctrl+P' },
      { id: 'separator3', label: '', separator: true },
      { id: 'exit', label: 'Exit', icon: '🚪', shortcut: 'Alt+F4' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: '✏️',
    children: [
      { id: 'undo', label: 'Undo', icon: '↶', shortcut: 'Ctrl+Z' },
      { id: 'redo', label: 'Redo', icon: '↷', shortcut: 'Ctrl+Y', disabled: true },
      { id: 'separator1', label: '', separator: true },
      { id: 'cut', label: 'Cut', icon: '✂️', shortcut: 'Ctrl+X' },
      { id: 'copy', label: 'Copy', icon: '📋', shortcut: 'Ctrl+C' },
      { id: 'paste', label: 'Paste', icon: '📌', shortcut: 'Ctrl+V' },
      { id: 'separator2', label: '', separator: true },
      { id: 'find', label: 'Find', icon: '🔍', shortcut: 'Ctrl+F' },
      { id: 'replace', label: 'Replace', icon: '🔄', shortcut: 'Ctrl+H' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    icon: '👁️',
    badge: 'New',
    children: [
      { id: 'zoom-in', label: 'Zoom In', icon: '🔍', shortcut: 'Ctrl+Plus' },
      { id: 'zoom-out', label: 'Zoom Out', icon: '🔍', shortcut: 'Ctrl+Minus' },
      { id: 'zoom-reset', label: 'Reset Zoom', icon: '🔍', shortcut: 'Ctrl+0' },
      { id: 'separator1', label: '', separator: true },
      { id: 'fullscreen', label: 'Fullscreen', icon: '⛶', shortcut: 'F11' },
      { id: 'sidebar', label: 'Toggle Sidebar', icon: '📋', shortcut: 'Ctrl+B' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: '🛠️',
    children: [
      { id: 'preferences', label: 'Preferences', icon: '⚙️', shortcut: 'Ctrl+,' },
      { id: 'plugins', label: 'Extensions', icon: '🧩', shortcut: 'Ctrl+Shift+X' },
      { id: 'terminal', label: 'Terminal', icon: '💻', shortcut: 'Ctrl+`' },
    ],
  },
  { id: 'help', label: 'Help', href: '/help', target: '_blank', icon: '❓' },
];

export const Default: Story = {
  args: {
    items: applicationMenuItems,
    disabled: false,
    closeOnSelect: true,
    dropdownPlacement: 'bottom-start',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('应该渲染菜单栏', async () => {
      const menuBar = canvas.getByRole('menubar');
      await expect(menuBar).toBeInTheDocument();

      const fileMenu = canvas.getByText('File');
      await expect(fileMenu).toBeInTheDocument();
    });

    await step('点击 File 菜单应该打开下拉菜单', async () => {
      const fileMenu = canvas.getByText('File');
      await userEvent.click(fileMenu);

      const newItem = canvas.getByText('New');
      await expect(newItem).toBeInTheDocument();
    });

    await step('点击 New 选项应该触发选择事件', async () => {
      const newItem = canvas.getByText('New');
      await userEvent.click(newItem);

      // 菜单应该关闭
      await expect(canvas.queryByText('New')).not.toBeInTheDocument();
    });
  },
  render: (args) => html`
    <div style="min-height: 400px; background: #f5f5f5;">
      <lith-menu-bar
        .items=${args.items}
        ?disabled=${args.disabled}
        ?close-on-select=${args.closeOnSelect}
        .dropdownPlacement=${args.dropdownPlacement}
        @lith-menu-bar-select=${(e: CustomEvent) => {
          console.log('Menu item selected:', e.detail.item);
          if (!e.detail.item.href) {
            alert(`Selected: ${e.detail.item.label}`);
          }
        }}
        style="
          --lith-menu-bar-height: 56px;
          --lith-menu-bar-item-padding: 16px 24px;
          --lith-menu-bar-item-gap: 2px;
        "
      >
      </lith-menu-bar>
    </div>
  `,
};

export const WebsiteNavigation: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '/', icon: '🏠' },
      {
        id: 'products',
        label: 'Products',
        icon: '📦',
        children: [
          { id: 'web-apps', label: 'Web Applications', href: '/products/web', icon: '🌐' },
          { id: 'mobile-apps', label: 'Mobile Apps', href: '/products/mobile', icon: '📱' },
          { id: 'desktop-apps', label: 'Desktop Apps', href: '/products/desktop', icon: '💻' },
          { id: 'separator1', label: '', separator: true },
          { id: 'api', label: 'API & SDKs', href: '/products/api', icon: '🔌' },
        ],
      },
      {
        id: 'solutions',
        label: 'Solutions',
        icon: '💡',
        children: [
          { id: 'enterprise', label: 'Enterprise', href: '/solutions/enterprise', icon: '🏢' },
          { id: 'startups', label: 'Startups', href: '/solutions/startups', icon: '🚀' },
          { id: 'education', label: 'Education', href: '/solutions/education', icon: '🎓' },
        ],
      },
      { id: 'pricing', label: 'Pricing', href: '/pricing', icon: '💰' },
      { id: 'about', label: 'About', href: '/about', icon: 'ℹ️' },
      { id: 'contact', label: 'Contact', href: '/contact', target: '_blank', icon: '📧' },
    ],
    disabled: false,
    closeOnSelect: true,
    dropdownPlacement: 'bottom-start',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('悬停 Products 菜单应该显示下拉选项', async () => {
      const productsMenu = canvas.getByText('Products');

      // 先点击打开菜单
      await userEvent.click(productsMenu);

      const webAppsItem = canvas.getByText('Web Applications');
      await expect(webAppsItem).toBeInTheDocument();
    });

    await step('键盘导航应该工作', async () => {
      const menuBar = canvas.getByRole('menubar');
      await userEvent.click(menuBar);

      // 使用右箭头键导航
      await userEvent.keyboard('{ArrowRight}');

      // 应该聚焦到 Solutions 菜单
      const solutionsMenu = canvas.getByText('Solutions');
      expect(solutionsMenu).toHaveFocus();
    });
  },
  render: (args) => html`
    <div style="min-height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <lith-menu-bar
        .items=${args.items}
        ?disabled=${args.disabled}
        ?close-on-select=${args.closeOnSelect}
        .dropdownPlacement=${args.dropdownPlacement}
        @lith-menu-bar-select=${(e: CustomEvent) => {
          console.log('Website navigation:', e.detail.item);
        }}
        style="
          --lith-menu-bar-height: 60px;
          --lith-menu-bar-item-padding: 18px 24px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          color: #333;
        "
      >
      </lith-menu-bar>
    </div>
  `,
};

export const SimpleToolbar: Story = {
  args: {
    items: [
      { id: 'save', label: 'Save', icon: '💾' },
      { id: 'undo', label: 'Undo', icon: '↶' },
      { id: 'redo', label: 'Redo', icon: '↷', disabled: true },
      {
        id: 'format',
        label: 'Format',
        icon: '🎨',
        children: [
          { id: 'bold', label: 'Bold', icon: '𝐁' },
          { id: 'italic', label: 'Italic', icon: '𝐼' },
          { id: 'underline', label: 'Underline', icon: '𝐔' },
        ],
      },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    disabled: false,
    closeOnSelect: true,
    dropdownPlacement: 'bottom-start',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('应该渲染简化的工具栏', async () => {
      const saveButton = canvas.getByText('Save');
      const formatButton = canvas.getByText('Format');

      await expect(saveButton).toBeInTheDocument();
      await expect(formatButton).toBeInTheDocument();
    });

    await step('禁用的按钮不应该响应点击', async () => {
      const redoButton = canvas.getByText('Redo');
      await expect(redoButton).toHaveClass('disabled');

      // 点击禁用按钮不应该有反应
      await userEvent.click(redoButton);
    });

    await step('Format 下拉菜单应该包含格式选项', async () => {
      const formatButton = canvas.getByText('Format');
      await userEvent.click(formatButton);

      const boldOption = canvas.getByText('Bold');
      await expect(boldOption).toBeInTheDocument();
    });
  },
  render: (args) => html`
    <div style="min-height: 300px; background: #f8f9fa;">
      <lith-menu-bar
        .items=${args.items}
        ?disabled=${args.disabled}
        ?close-on-select=${args.closeOnSelect}
        .dropdownPlacement=${args.dropdownPlacement}
        @lith-menu-bar-select=${(e: CustomEvent) => {
          console.log('Toolbar action:', e.detail.item);
          alert(`Toolbar: ${e.detail.item.label}`);
        }}
        style="
          --lith-menu-bar-height: 48px;
          --lith-menu-bar-item-padding: 12px 16px;
          --lith-menu-bar-item-gap: 1px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 20px;
        "
      >
      </lith-menu-bar>
    </div>
  `,
};

export const KeyboardNavigation: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      {
        id: 'reports',
        label: 'Reports',
        icon: '📈',
        children: [
          { id: 'sales', label: 'Sales Report', icon: '💰' },
          { id: 'analytics', label: 'Analytics', icon: '📊' },
          { id: 'traffic', label: 'Traffic Report', icon: '🚦' },
        ],
      },
      { id: 'users', label: 'Users', icon: '👥' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    disabled: false,
    closeOnSelect: true,
    dropdownPlacement: 'bottom-start',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('使用 Tab 键应该聚焦菜单栏', async () => {
      await userEvent.tab();

      const dashboardItem = canvas.getByText('Dashboard');
      expect(dashboardItem).toHaveFocus();
    });

    await step('右箭头键应该导航到下一个菜单项', async () => {
      await userEvent.keyboard('{ArrowRight}');

      const reportsItem = canvas.getByText('Reports');
      expect(reportsItem).toHaveFocus();
    });

    await step('下箭头键应该打开下拉菜单', async () => {
      await userEvent.keyboard('{ArrowDown}');

      const salesReport = canvas.getByText('Sales Report');
      await expect(salesReport).toBeInTheDocument();
    });

    await step('Escape 键应该关闭下拉菜单', async () => {
      await userEvent.keyboard('{Escape}');

      await expect(canvas.queryByText('Sales Report')).not.toBeInTheDocument();
    });

    await step('Home 键应该跳转到第一个菜单项', async () => {
      await userEvent.keyboard('{Home}');

      const dashboardItem = canvas.getByText('Dashboard');
      expect(dashboardItem).toHaveFocus();
    });

    await step('End 键应该跳转到最后一个菜单项', async () => {
      await userEvent.keyboard('{End}');

      const settingsItem = canvas.getByText('Settings');
      expect(settingsItem).toHaveFocus();
    });
  },
  render: (args) => html`
    <div style="min-height: 300px; background: #f0f2f5; padding: 20px;">
      <div style="margin-bottom: 16px; color: #666; font-size: 14px;">
        💡 使用键盘导航测试：Tab 聚焦，方向键导航，Enter/Space 选择，Escape 关闭
      </div>
      <lith-menu-bar
        .items=${args.items}
        ?disabled=${args.disabled}
        ?close-on-select=${args.closeOnSelect}
        .dropdownPlacement=${args.dropdownPlacement}
        @lith-menu-bar-select=${(e: CustomEvent) => {
          console.log('Keyboard selection:', e.detail.item);
        }}
        style="
          --lith-menu-bar-height: 44px;
          --lith-menu-bar-item-padding: 12px 20px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        "
      >
      </lith-menu-bar>
    </div>
  `,
};

export const NoCloseOnSelect: Story = {
  args: {
    items: [
      {
        id: 'options',
        label: 'Options',
        icon: '⚙️',
        children: [
          { id: 'auto-save', label: 'Auto Save', icon: '💾' },
          { id: 'notifications', label: 'Notifications', icon: '🔔' },
          { id: 'dark-mode', label: 'Dark Mode', icon: '🌙' },
        ],
      },
      {
        id: 'filters',
        label: 'Filters',
        icon: '🔍',
        children: [
          { id: 'show-all', label: 'Show All', icon: '👁️' },
          { id: 'show-active', label: 'Show Active', icon: '✅' },
          { id: 'show-inactive', label: 'Show Inactive', icon: '❌' },
        ],
      },
    ],
    disabled: false,
    closeOnSelect: false,
    dropdownPlacement: 'bottom-start',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('打开 Options 下拉菜单', async () => {
      const optionsMenu = canvas.getByText('Options');
      await userEvent.click(optionsMenu);

      const autoSave = canvas.getByText('Auto Save');
      await expect(autoSave).toBeInTheDocument();
    });

    await step('选择选项后菜单应该保持打开', async () => {
      const autoSave = canvas.getByText('Auto Save');
      await userEvent.click(autoSave);

      // 菜单应该仍然打开
      await expect(autoSave).toBeInTheDocument();
    });

    await step('可以连续选择多个选项', async () => {
      const notifications = canvas.getByText('Notifications');
      await userEvent.click(notifications);

      const darkMode = canvas.getByText('Dark Mode');
      await userEvent.click(darkMode);

      // 菜单仍然应该打开
      await expect(notifications).toBeInTheDocument();
      await expect(darkMode).toBeInTheDocument();
    });
  },
  render: (args) => html`
    <div style="min-height: 300px; background: #f8f9fa; padding: 20px;">
      <div style="margin-bottom: 16px; color: #666; font-size: 14px;">
        💡 提示：选择菜单项后下拉菜单不会自动关闭，可以连续选择多个选项
      </div>
      <lith-menu-bar
        .items=${args.items}
        ?disabled=${args.disabled}
        ?close-on-select=${args.closeOnSelect}
        .dropdownPlacement=${args.dropdownPlacement}
        @lith-menu-bar-select=${(e: CustomEvent) => {
          console.log('Multi-select:', e.detail.item);
          // 不显示 alert，因为菜单保持打开
        }}
        style="
          --lith-menu-bar-height: 44px;
          --lith-menu-bar-item-padding: 12px 18px;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
        "
      >
      </lith-menu-bar>
    </div>
  `,
};

export const DisabledMenuBar: Story = {
  args: {
    items: applicationMenuItems,
    disabled: true,
    closeOnSelect: true,
    dropdownPlacement: 'bottom-start',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('禁用的菜单栏不应该响应交互', async () => {
      const fileMenu = canvas.getByText('File');

      // 点击禁用的菜单不应该打开下拉菜单
      await userEvent.click(fileMenu);

      const newItem = canvas.queryByText('New');
      await expect(newItem).not.toBeInTheDocument();
    });

    await step('禁用状态应该在视觉上表现出来', async () => {
      const menuBar = canvas.getByRole('menubar').parentElement;
      expect(menuBar).toHaveAttribute('disabled');
    });
  },
  render: (args) => html`
    <div style="min-height: 300px; background: #f5f5f5; padding: 20px;">
      <div style="margin-bottom: 16px; color: #666; font-size: 14px;">
        🚫 菜单栏已禁用，不会响应任何交互
      </div>
      <lith-menu-bar
        .items=${args.items}
        ?disabled=${args.disabled}
        ?close-on-select=${args.closeOnSelect}
        .dropdownPlacement=${args.dropdownPlacement}
        @lith-menu-bar-select=${(e: CustomEvent) => {
          console.log('This should not fire:', e.detail.item);
        }}
        style="
          --lith-menu-bar-height: 48px;
          --lith-menu-bar-item-padding: 12px 20px;
          background: #e9ecef;
          opacity: 0.6;
          cursor: not-allowed;
          border-radius: 4px;
        "
      >
      </lith-menu-bar>
    </div>
  `,
};

export const ProgrammaticControl: Story = {
  args: {
    items: [
      {
        id: 'actions',
        label: 'Actions',
        icon: '⚡',
        children: [
          { id: 'action1', label: 'Action 1', icon: '1️⃣' },
          { id: 'action2', label: 'Action 2', icon: '2️⃣' },
          { id: 'action3', label: 'Action 3', icon: '3️⃣' },
        ],
      },
      { id: 'refresh', label: 'Refresh', icon: '🔄' },
    ],
    disabled: false,
    closeOnSelect: true,
    dropdownPlacement: 'bottom-start',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('测试程序化控制', async () => {
      const openButton = canvas.getByText('Open Actions');
      await userEvent.click(openButton);

      // 应该看到下拉菜单打开
      const action1 = canvas.getByText('Action 1');
      await expect(action1).toBeInTheDocument();
    });

    await step('测试关闭所有下拉菜单', async () => {
      const closeAllButton = canvas.getByText('Close All');
      await userEvent.click(closeAllButton);

      // 下拉菜单应该关闭
      await expect(canvas.queryByText('Action 1')).not.toBeInTheDocument();
    });
  },
  render: (args) => html`
    <div style="min-height: 300px; background: #f8f9fa; padding: 20px;">
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <lith-menu-bar
          id="programmatic-menu-bar"
          .items=${args.items}
          ?disabled=${args.disabled}
          ?close-on-select=${args.closeOnSelect}
          .dropdownPlacement=${args.dropdownPlacement}
          @lith-menu-bar-select=${(e: CustomEvent) => {
            console.log('Programmatic menu:', e.detail.item);
            alert(`Programmatic: ${e.detail.item.label}`);
          }}
          style="
            --lith-menu-bar-height: 44px;
            --lith-menu-bar-item-padding: 12px 18px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 6px;
            flex: 1;
          "
        >
        </lith-menu-bar>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button
            style="padding: 8px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
            onclick="document.getElementById('programmatic-menu-bar').openDropdown('actions')"
          >
            Open Actions
          </button>
          <button
            style="padding: 8px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
            onclick="document.getElementById('programmatic-menu-bar').closeDropdown('actions')"
          >
            Close Actions
          </button>
          <button
            style="padding: 8px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
            onclick="document.getElementById('programmatic-menu-bar').closeAllDropdowns()"
          >
            Close All
          </button>
          <button
            style="padding: 8px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
            onclick="document.getElementById('programmatic-menu-bar').focus()"
          >
            Focus Menu
          </button>
        </div>
      </div>
    </div>
  `,
};
