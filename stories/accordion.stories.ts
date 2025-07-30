import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, userEvent, fn } from '@storybook/test';
import '../src/components/data-display/lith-accordion.js';
import '../src/components/data-display/lith-accordion-item.js';

const meta: Meta = {
  title: 'Components/Data Display/Accordion',
  component: 'lith-accordion',
  parameters: {
    docs: {
      description: {
        component: `
# Accordion

折叠面板组件，用于展示可折叠的内容区域。支持单选和多选模式。

## 特性

- 🎯 **灵活的模式**：支持单选（single）和多选（multiple）模式
- 🔧 **可折叠控制**：可控制单选模式下是否允许全部折叠
- ♿ **可访问性**：完整的键盘导航和屏幕阅读器支持
- 🎨 **可定制样式**：通过 CSS 自定义属性进行样式定制
- 📱 **响应式设计**：适配不同屏幕尺寸

## CSS 自定义属性

| 属性 | 默认值 | 描述 |
|------|-------|------|
| \`--lith-accordion-border-color\` | \`#e5e7eb\` | 边框颜色 |
| \`--lith-accordion-border-radius\` | \`0.375rem\` | 边框圆角 |
| \`--lith-accordion-header-padding\` | \`1rem\` | 头部内边距 |
| \`--lith-accordion-header-bg\` | \`transparent\` | 头部背景色 |
| \`--lith-accordion-header-hover-bg\` | \`#f9fafb\` | 头部悬停背景色 |
| \`--lith-accordion-content-padding\` | \`0 1rem 1rem 1rem\` | 内容区内边距 |
| \`--lith-accordion-focus-color\` | \`#3b82f6\` | 焦点颜色 |
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
      description: '折叠面板类型：single（单选）或 multiple（多选）',
    },
    collapsible: {
      control: { type: 'boolean' },
      description: '单选模式下是否允许全部折叠',
      if: { arg: 'type', eq: 'single' },
    },
    'default-value': {
      control: { type: 'text' },
      description: '默认打开的项目（仅在初始化时生效）',
    },
    value: {
      control: { type: 'text' },
      description: '当前打开的项目（受控模式）',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: false,
  },
  render: (args) => html`
    <lith-accordion
      type=${args.type}
      collapsible=${args.collapsible}
      default-value=${args['default-value'] || ''}
      value=${args.value || ''}
    >
      <lith-accordion-item value="item-1">
        <span slot="trigger">What is Lithless?</span>
        <p>
          Lithless is a headless UI component library built with Web Components, providing unstyled,
          accessible components that work across all frameworks.
        </p>
      </lith-accordion-item>

      <lith-accordion-item value="item-2">
        <span slot="trigger">How to install?</span>
        <p>You can install Lithless via npm:</p>
        <pre><code>npm install lithless</code></pre>
      </lith-accordion-item>

      <lith-accordion-item value="item-3">
        <span slot="trigger">Is it accessible?</span>
        <p>
          Yes! All components follow WCAG 2.1 AA guidelines and include proper ARIA attributes,
          keyboard navigation, and screen reader support.
        </p>
      </lith-accordion-item>
    </lith-accordion>
  `,
  play: async ({ canvasElement }) => {
    // 等待组件渲染完成
    await new Promise((resolve) => setTimeout(resolve, 100));

    const accordion = canvasElement.querySelector('lith-accordion');
    const items = canvasElement.querySelectorAll('lith-accordion-item');

    // 验证初始状态
    expect(accordion).toBeTruthy();
    expect(items).toHaveLength(3);

    // 测试第一个项目点击
    const firstButton = items[0].shadowRoot?.querySelector('button');
    expect(firstButton).toBeTruthy();

    if (firstButton) {
      await userEvent.click(firstButton);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 验证第一个项目被打开
      expect(items[0].open).toBe(true);
      expect(firstButton.getAttribute('aria-expanded')).toBe('true');
    }
  },
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: (args) => html`
    <lith-accordion type=${args.type}>
      <lith-accordion-item value="features">
        <span slot="trigger">🚀 Features</span>
        <ul>
          <li>Headless design for maximum flexibility</li>
          <li>Built with modern Web Components</li>
          <li>TypeScript support out of the box</li>
          <li>Framework agnostic</li>
        </ul>
      </lith-accordion-item>

      <lith-accordion-item value="components">
        <span slot="trigger">🧩 Components</span>
        <ul>
          <li>Form components (Button, Checkbox, etc.)</li>
          <li>Navigation components (Menu, Tabs, etc.)</li>
          <li>Feedback components (Modal, Toast, etc.)</li>
          <li>Data display components (Table, List, etc.)</li>
        </ul>
      </lith-accordion-item>

      <lith-accordion-item value="usage">
        <span slot="trigger">📖 Usage</span>
        <p>Import the components you need and use them in your HTML:</p>
        <pre><code>&lt;lith-button&gt;Click me&lt;/lith-button&gt;</code></pre>
      </lith-accordion-item>
    </lith-accordion>
  `,
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const items = canvasElement.querySelectorAll('lith-accordion-item');

    // 打开多个项目
    const firstButton = items[0].shadowRoot?.querySelector('button');
    const secondButton = items[1].shadowRoot?.querySelector('button');

    if (firstButton && secondButton) {
      await userEvent.click(firstButton);
      await userEvent.click(secondButton);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 验证多个项目可以同时打开
      expect(items[0].open).toBe(true);
      expect(items[1].open).toBe(true);
    }
  },
};

export const Collapsible: Story = {
  args: {
    type: 'single',
    collapsible: true,
    'default-value': 'item-1',
  },
  render: (args) => html`
    <lith-accordion
      type=${args.type}
      collapsible=${args.collapsible}
      default-value=${args['default-value']}
    >
      <lith-accordion-item value="item-1">
        <span slot="trigger">Collapsible Item 1</span>
        <p>In collapsible mode, you can close the currently open item, leaving all items closed.</p>
      </lith-accordion-item>

      <lith-accordion-item value="item-2">
        <span slot="trigger">Collapsible Item 2</span>
        <p>This is useful when you want to give users the option to hide all content.</p>
      </lith-accordion-item>
    </lith-accordion>
  `,
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const items = canvasElement.querySelectorAll('lith-accordion-item');
    const firstButton = items[0].shadowRoot?.querySelector('button');

    // 验证默认打开状态
    expect(items[0].open).toBe(true);

    if (firstButton) {
      // 点击已打开的项目，应该能够关闭
      await userEvent.click(firstButton);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(items[0].open).toBe(false);
    }
  },
};

export const Disabled: Story = {
  render: () => html`
    <lith-accordion type="single">
      <lith-accordion-item value="item-1">
        <span slot="trigger">Normal Item</span>
        <p>This item can be toggled normally.</p>
      </lith-accordion-item>

      <lith-accordion-item value="item-2" disabled>
        <span slot="trigger">Disabled Item</span>
        <p>This content cannot be accessed because the item is disabled.</p>
      </lith-accordion-item>

      <lith-accordion-item value="item-3">
        <span slot="trigger">Another Normal Item</span>
        <p>This item works normally as well.</p>
      </lith-accordion-item>
    </lith-accordion>
  `,
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const items = canvasElement.querySelectorAll('lith-accordion-item');
    const disabledButton = items[1].shadowRoot?.querySelector('button');

    // 验证禁用状态
    expect(items[1].disabled).toBe(true);
    expect(disabledButton?.getAttribute('aria-disabled')).toBe('true');

    if (disabledButton) {
      // 尝试点击禁用的项目
      await userEvent.click(disabledButton);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 验证禁用项目不会打开
      expect(items[1].open).toBe(false);
    }
  },
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-accordion {
        --lith-accordion-border-color: #dc2626;
        --lith-accordion-border-radius: 0.75rem;
        --lith-accordion-header-bg: #fef2f2;
        --lith-accordion-header-hover-bg: #fee2e2;
        --lith-accordion-header-font-weight: 600;
        --lith-accordion-content-padding: 1.5rem;
        --lith-accordion-focus-color: #dc2626;
        max-width: 600px;
        margin: 0 auto;
      }

      .custom-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
      }

      .custom-content {
        background: #fef2f2;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-top: 0.5rem;
      }
    </style>

    <lith-accordion type="single" class="custom-accordion">
      <lith-accordion-item value="design">
        <div slot="trigger" class="custom-trigger">🎨 Custom Styling</div>
        <div class="custom-content">
          <p>This accordion demonstrates custom styling using CSS custom properties.</p>
          <p>You can customize colors, spacing, fonts, and more to match your design system.</p>
        </div>
      </lith-accordion-item>

      <lith-accordion-item value="theme">
        <div slot="trigger" class="custom-trigger">🌈 Theming Support</div>
        <div class="custom-content">
          <p>The component provides extensive theming support through CSS custom properties.</p>
          <p>This makes it easy to integrate with any design system or brand guidelines.</p>
        </div>
      </lith-accordion-item>
    </lith-accordion>
  `,
};

export const Events: Story = {
  render: () => {
    const handleChange = fn();

    setTimeout(() => {
      const accordion = document.querySelector('#events-accordion');
      if (accordion) {
        accordion.addEventListener('lith-change', handleChange);
      }
    }, 100);

    return html`
      <lith-accordion id="events-accordion" type="multiple">
        <lith-accordion-item value="event-1">
          <span slot="trigger">Event Handling</span>
          <p>Open the browser console or Storybook actions panel to see events.</p>
        </lith-accordion-item>

        <lith-accordion-item value="event-2">
          <span slot="trigger">Event Details</span>
          <p>Each event includes information about which item changed and the current state.</p>
        </lith-accordion-item>
      </lith-accordion>
    `;
  },
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const items = canvasElement.querySelectorAll('lith-accordion-item');
    const firstButton = items[0].shadowRoot?.querySelector('button');

    if (firstButton) {
      await userEvent.click(firstButton);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 验证事件处理 - 在实际应用中，事件会被监听器捕获
      expect(items[0].open).toBe(true);
    }
  },
};

export const KeyboardNavigation: Story = {
  render: () => html`
    <div>
      <p>
        Use <kbd>Tab</kbd> to navigate between items, <kbd>Enter</kbd> or <kbd>Space</kbd> to
        toggle.
      </p>

      <lith-accordion type="single" collapsible="true">
        <lith-accordion-item value="keyboard-1">
          <span slot="trigger">Keyboard Navigation</span>
          <p>
            All accordion items are keyboard accessible. Use Tab to move between triggers and
            Enter/Space to toggle.
          </p>
        </lith-accordion-item>

        <lith-accordion-item value="keyboard-2">
          <span slot="trigger">Focus Management</span>
          <p>
            Focus is properly managed when items are opened and closed, ensuring a smooth keyboard
            experience.
          </p>
        </lith-accordion-item>

        <lith-accordion-item value="keyboard-3">
          <span slot="trigger">Screen Reader Support</span>
          <p>
            ARIA attributes are used to communicate the state of each item to assistive
            technologies.
          </p>
        </lith-accordion-item>
      </lith-accordion>
    </div>
  `,
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const items = canvasElement.querySelectorAll('lith-accordion-item');
    const firstButton = items[0].shadowRoot?.querySelector('button');

    if (firstButton) {
      // 测试键盘导航
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // 测试 Enter 键
      await userEvent.keyboard('{Enter}');
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(items[0].open).toBe(true);

      // 测试 Space 键
      await userEvent.keyboard(' ');
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(items[0].open).toBe(false);
    }
  },
};
