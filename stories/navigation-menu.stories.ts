import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/navigation/lith-navigation-menu.js';

const meta: Meta = {
  title: 'Components/NavigationMenu',
  component: 'lith-navigation-menu',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
NavigationMenu 是一个基于 Popover 的导航菜单组件，专门用于构建层级化的导航结构。

## 特性

- 🌲 **层级结构** - 支持多层级嵌套菜单
- 🖱️ **点击和悬停** - 支持点击触发和悬停展开子菜单
- ⌨️ **键盘导航** - 完整的键盘支持，包括方向键、Enter、Escape等
- 🎯 **智能定位** - 基于 Popover 的智能定位系统
- 🔗 **混合内容** - 支持链接、按钮和子菜单项混合使用
- 🏷️ **丰富标识** - 支持图标、徽章和展开箭头
- 🎨 **完全可定制** - Headless 设计，通过 CSS 自定义属性控制样式
- ♿ **可访问性** - 符合 ARIA 规范，支持屏幕阅读器

## 使用场景

- 网站主导航菜单
- 管理后台导航
- 产品分类菜单
- 多级功能菜单
- 任何需要层级化导航的界面
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: '导航菜单项数组，支持嵌套结构',
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
      description: '选择叶子菜单项后是否自动关闭菜单',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用整个菜单',
    },
    hoverDelay: {
      control: 'number',
      description: '悬停打开子菜单的延迟时间（毫秒）',
    },
  },
};

export default meta;
type Story = StoryObj;

const basicItems = [
  {
    id: 'products',
    label: 'Products',
    icon: '📦',
    children: [
      { id: 'web', label: 'Web Applications', icon: '🌐' },
      { id: 'mobile', label: 'Mobile Apps', icon: '📱' },
      {
        id: 'desktop',
        label: 'Desktop Software',
        icon: '💻',
        children: [
          { id: 'windows', label: 'Windows Apps', icon: '🪟' },
          { id: 'macos', label: 'macOS Apps', icon: '🍎' },
          { id: 'linux', label: 'Linux Apps', icon: '🐧' },
        ],
      },
      { id: 'api', label: 'APIs & SDKs', icon: '🔌' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: '🛠️',
    badge: 'New',
    children: [
      { id: 'consulting', label: 'Consulting', icon: '💼' },
      { id: 'training', label: 'Training', icon: '🎓' },
      { id: 'support', label: 'Technical Support', icon: '🆘' },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: '📚',
    children: [
      { id: 'docs', label: 'Documentation', href: '/docs', icon: '📖' },
      { id: 'tutorials', label: 'Tutorials', href: '/tutorials', icon: '🎯' },
      { id: 'blog', label: 'Blog', href: '/blog', target: '_blank', icon: '📝' },
      { id: 'community', label: 'Community', href: '/community', icon: '👥' },
    ],
  },
  { id: 'pricing', label: 'Pricing', href: '/pricing', icon: '💰' },
  { id: 'about', label: 'About Us', href: '/about', icon: 'ℹ️' },
  { id: 'contact', label: 'Contact', href: '/contact', target: '_blank', icon: '📧' },
];

export const Default: Story = {
  args: {
    items: basicItems,
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
    hoverDelay: 300,
  },
  render: (args) => html`
    <lith-navigation-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      .hoverDelay=${args.hoverDelay}
      @lith-navigation-menu-select=${(e: CustomEvent) => {
        console.log('Navigation item selected:', e.detail.item);
        alert(`Selected: ${e.detail.item.label}`);
      }}
      style="
        --lith-navigation-menu-min-width: 220px;
        --lith-navigation-menu-item-height: 44px;
      "
    >
      <button
        slot="trigger"
        style="
          padding: 12px 20px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        "
      >
        🧭 Navigation ▼
      </button>
    </lith-navigation-menu>
  `,
};

export const CompanyWebsite: Story = {
  args: {
    items: [
      {
        id: 'company',
        label: 'Company',
        icon: '🏢',
        children: [
          { id: 'about', label: 'About Us', href: '/about', icon: 'ℹ️' },
          { id: 'team', label: 'Our Team', href: '/team', icon: '👥' },
          { id: 'careers', label: 'Careers', href: '/careers', badge: '5', icon: '💼' },
          { id: 'news', label: 'News & Press', href: '/news', icon: '📰' },
        ],
      },
      {
        id: 'solutions',
        label: 'Solutions',
        icon: '💡',
        children: [
          {
            id: 'enterprise',
            label: 'Enterprise',
            icon: '🏭',
            children: [
              { id: 'erp', label: 'ERP Systems', href: '/solutions/erp' },
              { id: 'crm', label: 'CRM Solutions', href: '/solutions/crm' },
              { id: 'hr', label: 'HR Management', href: '/solutions/hr' },
            ],
          },
          {
            id: 'startups',
            label: 'Startups',
            icon: '🚀',
            children: [
              { id: 'mvp', label: 'MVP Development', href: '/solutions/mvp' },
              { id: 'scaling', label: 'Scaling Solutions', href: '/solutions/scaling' },
              { id: 'funding', label: 'Funding Support', href: '/solutions/funding' },
            ],
          },
        ],
      },
      { id: 'contact', label: 'Contact', href: '/contact', icon: '📞' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
    hoverDelay: 200,
  },
  render: (args) => html`
    <lith-navigation-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      .hoverDelay=${args.hoverDelay}
      @lith-navigation-menu-select=${(e: CustomEvent) => {
        console.log('Company nav:', e.detail.item);
      }}
    >
      <button
        slot="trigger"
        style="
          padding: 10px 16px;
          background: #059669;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        "
      >
        Company Menu
      </button>
    </lith-navigation-menu>
  `,
};

export const ECommerceCategories: Story = {
  args: {
    items: [
      {
        id: 'electronics',
        label: 'Electronics',
        icon: '⚡',
        children: [
          {
            id: 'computers',
            label: 'Computers',
            icon: '💻',
            children: [
              { id: 'laptops', label: 'Laptops', href: '/category/laptops' },
              { id: 'desktops', label: 'Desktops', href: '/category/desktops' },
              { id: 'accessories', label: 'Accessories', href: '/category/accessories' },
            ],
          },
          {
            id: 'mobile',
            label: 'Mobile Devices',
            icon: '📱',
            children: [
              { id: 'smartphones', label: 'Smartphones', href: '/category/smartphones' },
              { id: 'tablets', label: 'Tablets', href: '/category/tablets' },
              { id: 'wearables', label: 'Wearables', href: '/category/wearables', badge: 'Hot' },
            ],
          },
          { id: 'audio', label: 'Audio Equipment', href: '/category/audio', icon: '🎵' },
        ],
      },
      {
        id: 'clothing',
        label: 'Clothing',
        icon: '👕',
        children: [
          { id: 'mens', label: "Men's Clothing", href: '/category/mens', icon: '👔' },
          { id: 'womens', label: "Women's Clothing", href: '/category/womens', icon: '👗' },
          { id: 'kids', label: "Kids' Clothing", href: '/category/kids', icon: '👶' },
          { id: 'shoes', label: 'Shoes', href: '/category/shoes', icon: '👟' },
        ],
      },
      { id: 'sale', label: 'Sale', href: '/sale', icon: '🏷️', badge: '50%' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
    hoverDelay: 250,
  },
  render: (args) => html`
    <lith-navigation-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      .hoverDelay=${args.hoverDelay}
      @lith-navigation-menu-select=${(e: CustomEvent) => {
        console.log('Category selected:', e.detail.item);
        alert(`Shop: ${e.detail.item.label}`);
      }}
      style="
        --lith-navigation-menu-min-width: 200px;
        --lith-navigation-menu-item-height: 38px;
        --lith-navigation-menu-item-padding: 10px 14px;
      "
    >
      <button
        slot="trigger"
        style="
          padding: 8px 16px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        "
      >
        🛍️ Shop Categories ▼
      </button>
    </lith-navigation-menu>
  `,
};

export const AdminDashboard: Story = {
  args: {
    items: [
      {
        id: 'users',
        label: 'User Management',
        icon: '👥',
        children: [
          { id: 'user-list', label: 'All Users', href: '/admin/users', icon: '📋' },
          { id: 'user-roles', label: 'Roles & Permissions', href: '/admin/roles', icon: '🔐' },
          { id: 'user-activity', label: 'Activity Logs', href: '/admin/activity', icon: '📊' },
        ],
      },
      {
        id: 'content',
        label: 'Content Management',
        icon: '📝',
        children: [
          { id: 'posts', label: 'Posts', href: '/admin/posts', icon: '📄' },
          { id: 'pages', label: 'Pages', href: '/admin/pages', icon: '📋' },
          { id: 'media', label: 'Media Library', href: '/admin/media', icon: '🖼️' },
          { id: 'comments', label: 'Comments', href: '/admin/comments', badge: '12', icon: '💬' },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: '⚙️',
        children: [
          { id: 'general', label: 'General Settings', href: '/admin/settings', icon: '🔧' },
          { id: 'security', label: 'Security', href: '/admin/security', icon: '🔒' },
          { id: 'backup', label: 'Backup & Restore', href: '/admin/backup', icon: '💾' },
        ],
      },
      { id: 'analytics', label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
    hoverDelay: 200,
  },
  render: (args) => html`
    <lith-navigation-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      .hoverDelay=${args.hoverDelay}
      @lith-navigation-menu-select=${(e: CustomEvent) => {
        console.log('Admin action:', e.detail.item);
        alert(`Admin: ${e.detail.item.label}`);
      }}
      style="
        --lith-navigation-menu-min-width: 240px;
        --lith-navigation-menu-item-height: 42px;
      "
    >
      <button
        slot="trigger"
        style="
          padding: 10px 18px;
          background: #7c3aed;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        "
      >
        🎛️ Admin Menu ▼
      </button>
    </lith-navigation-menu>
  `,
};

export const DifferentPlacements: Story = {
  args: {
    items: [
      { id: 'item1', label: 'Menu Item 1', icon: '1️⃣' },
      {
        id: 'item2',
        label: 'Menu Item 2',
        icon: '2️⃣',
        children: [
          { id: 'sub1', label: 'Submenu 1' },
          { id: 'sub2', label: 'Submenu 2' },
        ],
      },
      { id: 'item3', label: 'Menu Item 3', icon: '3️⃣' },
    ],
    closeOnSelect: true,
    disabled: false,
    hoverDelay: 200,
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
          <lith-navigation-menu
            .items=${args.items}
            .placement=${placement}
            ?close-on-select=${args.closeOnSelect}
            ?disabled=${args.disabled}
            .hoverDelay=${args.hoverDelay}
            @lith-navigation-menu-select=${(e: CustomEvent) => {
              console.log(`${placement}:`, e.detail.item);
              alert(`${placement}: ${e.detail.item.label}`);
            }}
          >
            <button
              slot="trigger"
              style="
                padding: 8px 12px;
                background: #0891b2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-size: 12px;
              "
            >
              ${placement}
            </button>
          </lith-navigation-menu>
        `
      )}
    </div>
  `,
};

export const CustomStyling: Story = {
  args: {
    items: [
      {
        id: 'design',
        label: 'Design',
        icon: '🎨',
        children: [
          { id: 'ui', label: 'UI Design', icon: '🖼️' },
          { id: 'ux', label: 'UX Research', icon: '🔍' },
          { id: 'branding', label: 'Branding', icon: '🏷️' },
        ],
      },
      {
        id: 'development',
        label: 'Development',
        icon: '💻',
        badge: 'Pro',
        children: [
          { id: 'frontend', label: 'Frontend', icon: '🌐' },
          { id: 'backend', label: 'Backend', icon: '⚙️' },
          { id: 'mobile', label: 'Mobile', icon: '📱' },
        ],
      },
      { id: 'consulting', label: 'Consulting', href: '/consulting', icon: '💼' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
    hoverDelay: 300,
  },
  render: (args) => html`
    <lith-navigation-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      .hoverDelay=${args.hoverDelay}
      @lith-navigation-menu-select=${(e: CustomEvent) => {
        console.log('Custom styled nav:', e.detail.item);
        alert(`Custom: ${e.detail.item.label}`);
      }}
      style="
        --lith-navigation-menu-min-width: 260px;
        --lith-navigation-menu-max-width: 320px;
        --lith-navigation-menu-item-height: 48px;
        --lith-navigation-menu-item-padding: 14px 18px;
        --lith-navigation-menu-z-index: 2000;
        --lith-navigation-menu-submenu-offset: 12px;
      "
    >
      <button
        slot="trigger"
        style="
          padding: 14px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
          transition: transform 150ms ease, box-shadow 150ms ease;
        "
        onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.4)'"
        onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.3)'"
      >
        ✨ Premium Services ▼
      </button>
    </lith-navigation-menu>
  `,
};

export const NoCloseOnSelect: Story = {
  args: {
    items: [
      {
        id: 'filters',
        label: 'Filters',
        icon: '🔍',
        children: [
          { id: 'price', label: 'Price Range', icon: '💰' },
          { id: 'brand', label: 'Brand', icon: '🏷️' },
          { id: 'rating', label: 'Rating', icon: '⭐' },
        ],
      },
      {
        id: 'sort',
        label: 'Sort By',
        icon: '📊',
        children: [
          { id: 'newest', label: 'Newest First', icon: '🆕' },
          { id: 'price-low', label: 'Price: Low to High', icon: '⬆️' },
          { id: 'price-high', label: 'Price: High to Low', icon: '⬇️' },
          { id: 'rating-high', label: 'Highest Rated', icon: '⭐' },
        ],
      },
      { id: 'reset', label: 'Reset All', icon: '🔄' },
    ],
    placement: 'bottom-start',
    closeOnSelect: false,
    disabled: false,
    hoverDelay: 300,
  },
  render: (args) => html`
    <lith-navigation-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      .hoverDelay=${args.hoverDelay}
      @lith-navigation-menu-select=${(e: CustomEvent) => {
        console.log('Filter action:', e.detail.item);
        // Don't show alert as menu stays open
      }}
      style="--lith-navigation-menu-min-width: 200px;"
    >
      <button
        slot="trigger"
        style="
          padding: 10px 16px;
          background: #f59e0b;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        "
      >
        🎛️ Product Options ▼
      </button>
    </lith-navigation-menu>
    <p style="margin-top: 16px; font-size: 14px; color: #666;">
      💡 提示：选择菜单项后菜单不会自动关闭，可以连续进行多个操作。
    </p>
  `,
};

export const DisabledMenu: Story = {
  args: {
    items: basicItems,
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: true,
    hoverDelay: 300,
  },
  render: (args) => html`
    <lith-navigation-menu
      .items=${args.items}
      .placement=${args.placement}
      ?close-on-select=${args.closeOnSelect}
      ?disabled=${args.disabled}
      .hoverDelay=${args.hoverDelay}
      @lith-navigation-menu-select=${(e: CustomEvent) => {
        console.log('This should not fire:', e.detail.item);
      }}
    >
      <button
        slot="trigger"
        style="
          padding: 12px 20px;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: not-allowed;
          opacity: 0.6;
          display: flex;
          align-items: center;
          gap: 8px;
        "
        disabled
      >
        🚫 Disabled Navigation ▼
      </button>
    </lith-navigation-menu>
  `,
};

export const ProgrammaticControl: Story = {
  args: {
    items: [
      {
        id: 'account',
        label: 'Account',
        icon: '👤',
        children: [
          { id: 'profile', label: 'Profile Settings', icon: '⚙️' },
          { id: 'billing', label: 'Billing', icon: '💳' },
          { id: 'security', label: 'Security', icon: '🔐' },
        ],
      },
      { id: 'help', label: 'Help Center', href: '/help', icon: '❓' },
      { id: 'logout', label: 'Sign Out', icon: '🚪' },
    ],
    placement: 'bottom-start',
    closeOnSelect: true,
    disabled: false,
    hoverDelay: 300,
  },
  render: (args) => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <lith-navigation-menu
        id="programmatic-nav"
        .items=${args.items}
        .placement=${args.placement}
        ?close-on-select=${args.closeOnSelect}
        ?disabled=${args.disabled}
        .hoverDelay=${args.hoverDelay}
        @lith-navigation-menu-select=${(e: CustomEvent) => {
          console.log('Programmatic nav:', e.detail.item);
          alert(`Programmatic: ${e.detail.item.label}`);
        }}
      >
        <button
          slot="trigger"
          style="
            padding: 10px 16px;
            background: #ec4899;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
          "
        >
          User Menu ▼
        </button>
      </lith-navigation-menu>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button
          style="padding: 6px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-nav').show()"
        >
          Show
        </button>
        <button
          style="padding: 6px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-nav').close()"
        >
          Close
        </button>
        <button
          style="padding: 6px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white;"
          onclick="document.getElementById('programmatic-nav').toggle()"
        >
          Toggle
        </button>
      </div>
    </div>
  `,
};
