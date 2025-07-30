import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, userEvent, fn } from '@storybook/test';
import '../src/components/data-display/lith-collapsible.js';

const meta: Meta = {
  title: 'Data Display/Collapsible',
  component: 'lith-collapsible',
  parameters: {
    docs: {
      description: {
        component: `
The Collapsible component provides a collapsible content area with a trigger element.

## Features

- **Simple API**: Easy to use with trigger and content slots
- **Keyboard Navigation**: Full keyboard support with Enter and Space keys
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **Smooth Animations**: CSS transitions with reduced motion support
- **Customizable**: CSS custom properties for styling
- **Form Integration**: Works well in forms and complex layouts

## CSS Custom Properties

- \`--lith-collapsible-focus-color\`: Focus outline color (default: #3b82f6)
- \`--lith-collapsible-transition-duration\`: Animation duration (default: 0.2s)
- \`--lith-collapsible-transition-timing\`: Animation timing function (default: ease)
- \`--lith-collapsible-content-padding\`: Content padding (default: 0)

## Usage

\`\`\`html
<lith-collapsible>
  <button slot="trigger">Toggle Content</button>
  <div>This content can be collapsed</div>
</lith-collapsible>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the collapsible is open',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the collapsible is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultOpen: {
      control: 'select',
      options: ['false', 'true'],
      description: 'Default open state (only affects initial render)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    open: false,
    disabled: false,
    defaultOpen: 'false',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <lith-collapsible
      ?open=${args.open}
      ?disabled=${args.disabled}
      default-open=${args.defaultOpen}
    >
      <button
        slot="trigger"
        style="
        padding: 0.75rem 1rem;
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        justify-content: space-between;
      "
      >
        <span>Is it accessible?</span>
        <svg width="16" height="16" viewBox="0 0 24 24" style="transition: transform 0.2s ease;">
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      <div
        style="
        padding: 1rem;
        border: 1px solid #d1d5db;
        border-top: none;
        border-radius: 0 0 0.375rem 0.375rem;
        background: #ffffff;
      "
      >
        Yes. It adheres to the WAI-ARIA design pattern and is tested with screen readers.
      </div>
    </lith-collapsible>
  `,
  play: async ({ canvasElement }) => {
    const collapsible = canvasElement.querySelector('lith-collapsible');
    const trigger = canvasElement.querySelector('[slot="trigger"]') as HTMLElement;

    // Initial state should be closed
    expect(collapsible?.open).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    // Click to open
    await userEvent.click(trigger);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(collapsible?.open).toBe(true);
  },
};

export const DefaultOpen: Story = {
  args: {
    defaultOpen: 'true',
  },
  render: (args) => html`
    <lith-collapsible default-open=${args.defaultOpen}>
      <button
        slot="trigger"
        style="
        padding: 0.75rem 1rem;
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        justify-content: space-between;
      "
      >
        <span>Can it be styled?</span>
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      <div
        style="
        padding: 1rem;
        border: 1px solid #d1d5db;
        border-top: none;
        border-radius: 0 0 0.375rem 0.375rem;
        background: #ffffff;
      "
      >
        Yes. It's completely unstyled by default, giving you full control over the appearance.
      </div>
    </lith-collapsible>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => html`
    <lith-collapsible ?disabled=${args.disabled}>
      <button
        slot="trigger"
        style="
        padding: 0.75rem 1rem;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        cursor: not-allowed;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        justify-content: space-between;
        opacity: 0.5;
      "
      >
        <span>Is it disabled?</span>
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      <div
        style="
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-top: none;
        border-radius: 0 0 0.375rem 0.375rem;
        background: #f9fafb;
      "
      >
        This collapsible is disabled and cannot be toggled.
      </div>
    </lith-collapsible>
  `,
  play: async ({ canvasElement }) => {
    const collapsible = canvasElement.querySelector('lith-collapsible');
    const trigger = canvasElement.querySelector('[slot="trigger"]') as HTMLElement;

    // Should be disabled
    expect(collapsible?.disabled).toBe(true);
    expect(trigger.getAttribute('aria-disabled')).toBe('true');

    // Click should not work
    const initialOpen = collapsible?.open;
    await userEvent.click(trigger);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(collapsible?.open).toBe(initialOpen);
  },
};

export const CustomTrigger: Story = {
  render: () => html`
    <lith-collapsible>
      <div
        slot="trigger"
        style="
        padding: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 600;
        text-align: center;
        transition: transform 0.2s ease;
      "
      >
        🎨 Custom Trigger Design
      </div>
      <div
        style="
        padding: 1.5rem;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 0.5rem;
        margin-top: 0.5rem;
      "
      >
        <h3 style="margin: 0 0 1rem 0; color: #1a202c;">Custom Styling</h3>
        <p style="margin: 0; color: #4a5568; line-height: 1.6;">
          You can completely customize the trigger appearance. This example uses a gradient
          background and custom styling to create a unique look.
        </p>
      </div>
    </lith-collapsible>
  `,
};

export const MultipleCollapsibles: Story = {
  render: () => html`
    <div style="space-y: 1rem;">
      <lith-collapsible>
        <button
          slot="trigger"
          style="
          padding: 0.75rem 1rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
          text-align: left;
          margin-bottom: 0.5rem;
        "
        >
          📋 Project Requirements
        </button>
        <div
          style="
          padding: 1rem;
          background: #fffbeb;
          border: 1px solid #f59e0b;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
        "
        >
          <ul style="margin: 0; padding-left: 1.5rem;">
            <li>Responsive design</li>
            <li>Cross-browser compatibility</li>
            <li>Accessibility compliance</li>
            <li>Performance optimization</li>
          </ul>
        </div>
      </lith-collapsible>

      <lith-collapsible>
        <button
          slot="trigger"
          style="
          padding: 0.75rem 1rem;
          background: #dbeafe;
          border: 1px solid #3b82f6;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
          text-align: left;
          margin-bottom: 0.5rem;
        "
        >
          🔧 Technical Stack
        </button>
        <div
          style="
          padding: 1rem;
          background: #eff6ff;
          border: 1px solid #3b82f6;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
        "
        >
          <ul style="margin: 0; padding-left: 1.5rem;">
            <li>Lit 3.0 (Web Components)</li>
            <li>TypeScript</li>
            <li>Vite (Build tool)</li>
            <li>Storybook (Documentation)</li>
          </ul>
        </div>
      </lith-collapsible>

      <lith-collapsible default-open="true">
        <button
          slot="trigger"
          style="
          padding: 0.75rem 1rem;
          background: #dcfce7;
          border: 1px solid #16a34a;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
          text-align: left;
          margin-bottom: 0.5rem;
        "
        >
          ✅ Features (Default Open)
        </button>
        <div
          style="
          padding: 1rem;
          background: #f0fdf4;
          border: 1px solid #16a34a;
          border-radius: 0.375rem;
        "
        >
          <ul style="margin: 0; padding-left: 1.5rem;">
            <li>Headless design</li>
            <li>Full keyboard navigation</li>
            <li>Screen reader support</li>
            <li>Smooth animations</li>
          </ul>
        </div>
      </lith-collapsible>
    </div>
  `,
};

export const WithEvents: Story = {
  render: () => {
    const handleChange = fn();
    return html`
      <div>
        <lith-collapsible @lith-change=${handleChange}>
          <button
            slot="trigger"
            style="
            padding: 0.75rem 1rem;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            justify-content: space-between;
          "
          >
            <span>Toggle with Events</span>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          <div
            style="
            padding: 1rem;
            border: 1px solid #d1d5db;
            border-top: none;
            border-radius: 0 0 0.375rem 0.375rem;
            background: #ffffff;
          "
          >
            This collapsible fires events when its state changes. Check the Actions panel to see the
            events.
          </div>
        </lith-collapsible>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
          Click the trigger to see the <code>lith-change</code> event in the Actions panel.
        </p>
      </div>
    `;
  },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[slot="trigger"]') as HTMLElement;

    // Test clicking
    await userEvent.click(trigger);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test keyboard interaction
    trigger.focus();
    await userEvent.keyboard('[Space]');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await userEvent.keyboard('[Enter]');
    await new Promise((resolve) => setTimeout(resolve, 100));
  },
};

export const KeyboardInteraction: Story = {
  render: () => html`
    <div>
      <p style="margin-bottom: 1rem; font-size: 0.875rem; color: #374151;">
        Focus the trigger and use <kbd>Enter</kbd> or <kbd>Space</kbd> to toggle.
      </p>
      <lith-collapsible>
        <button
          slot="trigger"
          style="
          padding: 0.75rem 1rem;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
          text-align: left;
          transition: all 0.2s ease;
        "
        >
          Keyboard Accessible Trigger (Try Tab, Enter, Space)
        </button>
        <div
          style="
          padding: 1rem;
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
          background: #ffffff;
        "
        >
          <p style="margin: 0;">This collapsible is fully keyboard accessible. You can:</p>
          <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
            <li>Tab to focus the trigger</li>
            <li>Press Enter or Space to toggle</li>
            <li>Screen readers announce the state changes</li>
          </ul>
        </div>
      </lith-collapsible>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[slot="trigger"]') as HTMLElement;

    // Focus the trigger
    trigger.focus();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test Enter key
    await userEvent.keyboard('[Enter]');
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Test Space key
    await userEvent.keyboard('[Space]');
    await new Promise((resolve) => setTimeout(resolve, 200));
  },
};
