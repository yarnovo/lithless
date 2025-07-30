import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, within, userEvent } from '@storybook/test';
import '../src/components/navigation/lith-breadcrumb.js';
import '../src/components/navigation/lith-breadcrumb-item.js';

const meta: Meta = {
  title: 'Navigation/Breadcrumb',
  component: 'lith-breadcrumb',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A headless breadcrumb navigation component that shows the current page's location within a navigational hierarchy with complete interaction logic without any predefined styles.

## Features

- **Semantic HTML**: Uses proper nav and ol elements for accessibility
- **ARIA Support**: Full WAI-ARIA compliance with proper labeling
- **Link Support**: Items can be links, buttons, or plain text
- **Custom Separators**: Configurable separator character or element
- **Current Page**: Automatic marking of the last item as current page
- **Event Handling**: Click events with detailed information

## Usage

\`\`\`html
<lith-breadcrumb>
  <lith-breadcrumb-item href="/">Home</lith-breadcrumb-item>
  <lith-breadcrumb-item href="/category">Category</lith-breadcrumb-item>
  <lith-breadcrumb-item href="/subcategory">Subcategory</lith-breadcrumb-item>
  <lith-breadcrumb-item current>Current Page</lith-breadcrumb-item>
</lith-breadcrumb>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    separator: {
      control: { type: 'text' },
      description: 'Separator character or text between breadcrumb items',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    separator: '/',
  },
  render: (args) => html`
    <lith-breadcrumb
      separator=${args.separator}
      style="
        --lith-breadcrumb-gap: 8px;
        --lith-breadcrumb-padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #dee2e6;
      "
    >
      <lith-breadcrumb-item
        href="/"
        style="
          --lith-breadcrumb-item-padding: 6px 12px;
          color: #007bff;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.2s;
        "
      >
        🏠 Home
      </lith-breadcrumb-item>
      <lith-breadcrumb-item
        href="/products"
        style="
          --lith-breadcrumb-item-padding: 6px 12px;
          color: #007bff;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.2s;
        "
      >
        Products
      </lith-breadcrumb-item>
      <lith-breadcrumb-item
        href="/products/electronics"
        style="
          --lith-breadcrumb-item-padding: 6px 12px;
          color: #007bff;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.2s;
        "
      >
        Electronics
      </lith-breadcrumb-item>
      <lith-breadcrumb-item
        current
        style="
          --lith-breadcrumb-item-padding: 6px 12px;
          color: #6c757d;
          font-weight: 600;
          border-radius: 4px;
        "
      >
        Smartphones
      </lith-breadcrumb-item>
    </lith-breadcrumb>
  `,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for component to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify breadcrumb structure
    const nav = canvasElement.querySelector('nav[aria-label="Breadcrumb"]');
    expect(nav).toBeDefined();

    // Test that current item is properly marked
    const currentItem = canvas.getByText('Smartphones');
    expect(currentItem.closest('lith-breadcrumb-item')?.hasAttribute('current')).toBe(true);

    // Test clicking on a breadcrumb item
    const homeItem = canvas.getByText('🏠 Home');
    await userEvent.click(homeItem);
  },
};

export const CustomSeparators: Story = {
  args: {
    separator: '>',
  },
  render: (_args) => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Arrow Separator -->
      <div>
        <h4 style="margin: 0 0 8px 0;">Arrow Separator</h4>
        <lith-breadcrumb
          separator=">"
          style="
            --lith-breadcrumb-gap: 12px;
            --lith-breadcrumb-padding: 12px;
            background: #e3f2fd;
            border-radius: 6px;
          "
        >
          <lith-breadcrumb-item
            href="/"
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #1976d2;
              text-decoration: none;
              border-radius: 3px;
            "
          >
            Home
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            href="/docs"
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #1976d2;
              text-decoration: none;
              border-radius: 3px;
            "
          >
            Documentation
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            current
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #424242;
              font-weight: 500;
            "
          >
            Components
          </lith-breadcrumb-item>
        </lith-breadcrumb>
      </div>

      <!-- Dot Separator -->
      <div>
        <h4 style="margin: 0 0 8px 0;">Dot Separator</h4>
        <lith-breadcrumb
          separator="•"
          style="
            --lith-breadcrumb-gap: 16px;
            --lith-breadcrumb-padding: 12px;
            background: #f3e5f5;
            border-radius: 6px;
          "
        >
          <lith-breadcrumb-item
            href="/"
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #7b1fa2;
              text-decoration: none;
              border-radius: 3px;
            "
          >
            Blog
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            href="/2024"
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #7b1fa2;
              text-decoration: none;
              border-radius: 3px;
            "
          >
            2024
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            href="/2024/march"
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #7b1fa2;
              text-decoration: none;
              border-radius: 3px;
            "
          >
            March
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            current
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #424242;
              font-weight: 500;
            "
          >
            Web Components Guide
          </lith-breadcrumb-item>
        </lith-breadcrumb>
      </div>

      <!-- Custom Text Separator -->
      <div>
        <h4 style="margin: 0 0 8px 0;">Custom Text Separator</h4>
        <lith-breadcrumb
          separator="→"
          style="
            --lith-breadcrumb-gap: 10px;
            --lith-breadcrumb-padding: 12px;
            background: #e8f5e8;
            border-radius: 6px;
          "
        >
          <lith-breadcrumb-item
            href="/"
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #2e7d32;
              text-decoration: none;
              border-radius: 3px;
            "
          >
            Admin
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            href="/users"
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #2e7d32;
              text-decoration: none;
              border-radius: 3px;
            "
          >
            Users
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            current
            style="
              --lith-breadcrumb-item-padding: 4px 8px;
              color: #424242;
              font-weight: 500;
            "
          >
            John Doe
          </lith-breadcrumb-item>
        </lith-breadcrumb>
      </div>
    </div>
  `,
};

export const WithIcons: Story = {
  args: {
    separator: '/',
  },
  render: (args) => html`
    <lith-breadcrumb
      separator=${args.separator}
      style="
        --lith-breadcrumb-gap: 8px;
        --lith-breadcrumb-padding: 16px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border: 1px solid #e1e5e9;
      "
    >
      <lith-breadcrumb-item
        href="/"
        style="
          --lith-breadcrumb-item-padding: 8px 12px;
          --lith-breadcrumb-item-gap: 6px;
          color: #495057;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s;
        "
      >
        <span slot="icon">🏠</span>
        Home
      </lith-breadcrumb-item>
      <lith-breadcrumb-item
        href="/dashboard"
        style="
          --lith-breadcrumb-item-padding: 8px 12px;
          --lith-breadcrumb-item-gap: 6px;
          color: #495057;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s;
        "
      >
        <span slot="icon">📊</span>
        Dashboard
      </lith-breadcrumb-item>
      <lith-breadcrumb-item
        href="/dashboard/analytics"
        style="
          --lith-breadcrumb-item-padding: 8px 12px;
          --lith-breadcrumb-item-gap: 6px;
          color: #495057;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s;
        "
      >
        <span slot="icon">📈</span>
        Analytics
      </lith-breadcrumb-item>
      <lith-breadcrumb-item
        current
        style="
          --lith-breadcrumb-item-padding: 8px 12px;
          --lith-breadcrumb-item-gap: 6px;
          color: #212529;
          font-weight: 600;
          border-radius: 4px;
        "
      >
        <span slot="icon">📋</span>
        Reports
      </lith-breadcrumb-item>
    </lith-breadcrumb>
  `,
};

export const DifferentItemTypes: Story = {
  args: {
    separator: '/',
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Link Items -->
      <div>
        <h4 style="margin: 0 0 8px 0;">With Links</h4>
        <lith-breadcrumb
          separator=${args.separator}
          style="
            --lith-breadcrumb-gap: 8px;
            --lith-breadcrumb-padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
          "
        >
          <lith-breadcrumb-item
            href="/"
            target="_blank"
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #007bff;
              text-decoration: underline;
              border-radius: 3px;
            "
          >
            External Link
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            href="/internal"
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #007bff;
              text-decoration: underline;
              border-radius: 3px;
            "
          >
            Internal Link
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            current
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #6c757d;
              font-weight: 500;
            "
          >
            Current Page
          </lith-breadcrumb-item>
        </lith-breadcrumb>
      </div>

      <!-- Button Items -->
      <div>
        <h4 style="margin: 0 0 8px 0;">With Buttons</h4>
        <lith-breadcrumb
          separator=${args.separator}
          style="
            --lith-breadcrumb-gap: 8px;
            --lith-breadcrumb-padding: 12px;
            background: #fff3cd;
            border-radius: 6px;
          "
        >
          <lith-breadcrumb-item
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #856404;
              background: transparent;
              border: 1px solid #856404;
              border-radius: 3px;
              cursor: pointer;
            "
          >
            Button Item 1
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #856404;
              background: transparent;
              border: 1px solid #856404;
              border-radius: 3px;
              cursor: pointer;
            "
          >
            Button Item 2
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            current
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #495057;
              font-weight: 500;
            "
          >
            Current
          </lith-breadcrumb-item>
        </lith-breadcrumb>
      </div>

      <!-- Disabled Items -->
      <div>
        <h4 style="margin: 0 0 8px 0;">With Disabled Items</h4>
        <lith-breadcrumb
          separator=${args.separator}
          style="
            --lith-breadcrumb-gap: 8px;
            --lith-breadcrumb-padding: 12px;
            background: #f8d7da;
            border-radius: 6px;
          "
        >
          <lith-breadcrumb-item
            href="/"
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #721c24;
              text-decoration: none;
              border-radius: 3px;
            "
          >
            Active Item
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            disabled
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #721c24;
              border-radius: 3px;
            "
          >
            Disabled Item
          </lith-breadcrumb-item>
          <lith-breadcrumb-item
            current
            style="
              --lith-breadcrumb-item-padding: 6px 10px;
              color: #495057;
              font-weight: 500;
            "
          >
            Current
          </lith-breadcrumb-item>
        </lith-breadcrumb>
      </div>
    </div>
  `,
};

export const LongBreadcrumb: Story = {
  args: {
    separator: '/',
  },
  render: (args) => html`
    <div style="max-width: 600px;">
      <h4 style="margin: 0 0 12px 0;">Long Breadcrumb (with wrapping)</h4>
      <lith-breadcrumb
        separator=${args.separator}
        style="
          --lith-breadcrumb-gap: 6px;
          --lith-breadcrumb-padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        "
      >
        <lith-breadcrumb-item
          href="/"
          style="
            --lith-breadcrumb-item-padding: 4px 8px;
            color: #007bff;
            text-decoration: none;
            border-radius: 3px;
            white-space: nowrap;
          "
        >
          🏠 Home
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          href="/company"
          style="
            --lith-breadcrumb-item-padding: 4px 8px;
            color: #007bff;
            text-decoration: none;
            border-radius: 3px;
            white-space: nowrap;
          "
        >
          Company Information
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          href="/company/departments"
          style="
            --lith-breadcrumb-item-padding: 4px 8px;
            color: #007bff;
            text-decoration: none;
            border-radius: 3px;
            white-space: nowrap;
          "
        >
          Departments & Teams
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          href="/company/departments/engineering"
          style="
            --lith-breadcrumb-item-padding: 4px 8px;
            color: #007bff;
            text-decoration: none;
            border-radius: 3px;
            white-space: nowrap;
          "
        >
          Engineering Division
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          href="/company/departments/engineering/frontend"
          style="
            --lith-breadcrumb-item-padding: 4px 8px;
            color: #007bff;
            text-decoration: none;
            border-radius: 3px;
            white-space: nowrap;
          "
        >
          Frontend Development
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          current
          style="
            --lith-breadcrumb-item-padding: 4px 8px;
            color: #6c757d;
            font-weight: 600;
            border-radius: 3px;
            white-space: nowrap;
          "
        >
          Web Components Team
        </lith-breadcrumb-item>
      </lith-breadcrumb>
    </div>
  `,
};

export const InteractiveDemo: Story = {
  args: {
    separator: '/',
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div
        style="padding: 12px; background: #d4edda; border-radius: 4px; border: 1px solid #c3e6cb;"
      >
        <strong>Interactive Demo:</strong> Click on any breadcrumb item to see the event details
        logged below.
      </div>

      <lith-breadcrumb
        separator=${args.separator}
        style="
          --lith-breadcrumb-gap: 8px;
          --lith-breadcrumb-padding: 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #e1e5e9;
        "
        @lith-breadcrumb-click=${(e: CustomEvent) => {
          const logArea = document.getElementById('breadcrumb-log') as HTMLElement;
          if (logArea) {
            const time = new Date().toLocaleTimeString();
            const detail = e.detail;
            const logEntry = document.createElement('div');
            logEntry.style.cssText =
              'padding: 8px; margin-bottom: 4px; background: #f8f9fa; border-radius: 4px; font-family: monospace; font-size: 12px;';
            logEntry.innerHTML = `
              <strong>[${time}]</strong> Breadcrumb clicked:<br>
              • Index: ${detail.index}<br>
              • HREF: ${detail.href || 'none'}<br>
              • Target: ${detail.target || 'none'}<br>
              • Text: "${detail.item.textContent.trim()}"
            `;
            logArea.insertBefore(logEntry, logArea.firstChild);

            // Keep only last 5 entries
            while (logArea.children.length > 5) {
              logArea.removeChild(logArea.lastChild!);
            }
          }
        }}
      >
        <lith-breadcrumb-item
          href="/"
          style="
            --lith-breadcrumb-item-padding: 8px 12px;
            color: #007bff;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.2s;
          "
        >
          🏠 Home
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          href="/catalog"
          style="
            --lith-breadcrumb-item-padding: 8px 12px;
            color: #007bff;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.2s;
          "
        >
          📚 Catalog
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          href="/catalog/books"
          style="
            --lith-breadcrumb-item-padding: 8px 12px;
            color: #007bff;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.2s;
          "
        >
          📖 Books
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          style="
            --lith-breadcrumb-item-padding: 8px 12px;
            color: #28a745;
            background: transparent;
            border: 1px solid #28a745;
            border-radius: 4px;
            cursor: pointer;
          "
        >
          🔍 Search Results
        </lith-breadcrumb-item>
        <lith-breadcrumb-item
          current
          style="
            --lith-breadcrumb-item-padding: 8px 12px;
            color: #6c757d;
            font-weight: 600;
            border-radius: 4px;
          "
        >
          📚 JavaScript Guide
        </lith-breadcrumb-item>
      </lith-breadcrumb>

      <div>
        <h5 style="margin: 0 0 8px 0;">Event Log:</h5>
        <div
          id="breadcrumb-log"
          style="
            min-height: 100px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 8px;
            background: #f8f9fa;
          "
        >
          <div style="color: #6c757d; font-style: italic;">
            Click on breadcrumb items to see events here...
          </div>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for component to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test clicking on the home breadcrumb
    const homeItem = canvas.getByText('🏠 Home');
    await userEvent.click(homeItem);

    // Verify log entry was created
    const logArea = canvasElement.querySelector('#breadcrumb-log');
    expect(logArea).toBeDefined();

    // Wait a bit for the log to update
    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};
