import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/form/lith-switch';
import type { LithSwitch } from '../src/components/form/lith-switch';

const meta: Meta<LithSwitch & { slotContent?: string }> = {
  title: 'Form/Switch',
  component: 'lith-switch',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A headless switch component that provides complete interaction logic without any predefined styles.

## Features

- **Form Integration**: Full support for HTML forms with \`name\` and \`value\` attributes
- **Accessibility**: ARIA attributes and keyboard navigation
- **Validation**: Built-in validation with custom messages
- **Flexible**: No default styles, fully customizable
- **Events**: Rich event system for handling user interactions

## Usage

\`\`\`html
<lith-switch name="notifications" value="enabled">
  Enable notifications
</lith-switch>
\`\`\`

## Styling

The component provides several CSS parts and custom properties for styling:

\`\`\`css
lith-switch {
  /* Custom properties */
  --lith-switch-width: 48px;
  --lith-switch-height: 24px;
  --lith-switch-thumb-size: 20px;
  --lith-switch-transition-duration: 200ms;
}

lith-switch::part(control) {
  /* Style the switch track */
  background: #ddd;
}

lith-switch[checked]::part(control) {
  /* Style the checked state */
  background: #4caf50;
}

lith-switch::part(thumb) {
  /* Style the thumb */
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is on or off',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the switch is read-only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the switch is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: 'text',
      description: 'The name attribute for form submission',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    value: {
      control: 'text',
      description: 'The value attribute for form submission',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"on"' },
      },
    },
    label: {
      control: 'text',
      description: 'The label text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    labelPosition: {
      control: 'radio',
      options: ['before', 'after'],
      description: 'Position of the label relative to the switch',
      table: {
        type: { summary: '"before" | "after"' },
        defaultValue: { summary: '"after"' },
      },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'The size of the switch',
      table: {
        type: { summary: '"small" | "medium" | "large"' },
        defaultValue: { summary: '"medium"' },
      },
    },
    slotContent: {
      control: 'text',
      description: 'Content for the default slot (label)',
      table: {
        category: 'Slots',
      },
    },
  },
  args: {
    checked: false,
    disabled: false,
    readonly: false,
    required: false,
    name: '',
    value: 'on',
    label: '',
    labelPosition: 'after',
    size: 'medium',
  },
  decorators: [
    (Story) => html`
      <style>
        lith-switch {
          --lith-switch-width: 44px;
          --lith-switch-height: 24px;
          --lith-switch-thumb-size: 20px;
          --lith-switch-gap: 2px;
          --lith-switch-transition-duration: 200ms;
        }

        lith-switch::part(control) {
          background-color: #ccc;
          border-radius: 12px;
          transition: background-color var(--lith-switch-transition-duration);
        }

        lith-switch[checked]::part(control) {
          background-color: #2196f3;
        }

        lith-switch::part(thumb) {
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border-radius: 50%;
        }

        lith-switch[disabled]::part(control) {
          opacity: 0.5;
        }

        lith-switch[disabled]::part(label) {
          opacity: 0.5;
        }

        lith-switch[size='small'] {
          --lith-switch-width: 36px;
          --lith-switch-height: 20px;
          --lith-switch-thumb-size: 16px;
        }

        lith-switch[size='large'] {
          --lith-switch-width: 52px;
          --lith-switch-height: 28px;
          --lith-switch-thumb-size: 24px;
        }

        .story-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          max-width: 400px;
        }
      </style>
      ${Story()}
    `,
  ],
};

export default meta;
type Story = StoryObj<LithSwitch & { slotContent?: string }>;

export const Default: Story = {
  args: {
    slotContent: 'Default switch',
  },
  render: (args) => html`
    <lith-switch
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      value=${args.value || ''}
      label=${args.label || ''}
      label-position=${args.labelPosition}
      size=${args.size}
    >
      ${args.slotContent}
    </lith-switch>
  `,
};

export const Checked: Story = {
  args: {
    checked: true,
    slotContent: 'Notifications enabled',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    slotContent: 'Disabled switch',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    slotContent: 'Disabled checked switch',
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    checked: true,
    slotContent: 'Read-only switch',
  },
};

export const Required: Story = {
  args: {
    required: true,
    slotContent: 'Required switch',
  },
};

export const LabelBefore: Story = {
  args: {
    labelPosition: 'before',
    slotContent: 'Label before switch',
  },
};

export const Sizes: Story = {
  render: () => html`
    <div class="story-container">
      <lith-switch size="small">Small switch</lith-switch>
      <lith-switch size="medium">Medium switch</lith-switch>
      <lith-switch size="large">Large switch</lith-switch>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <style>
      .icon {
        width: 12px;
        height: 12px;
        fill: currentColor;
      }
    </style>
    <lith-switch>
      <span slot="on-icon">✓</span>
      <span slot="off-icon">✗</span>
      Switch with icons
    </lith-switch>
  `,
};

export const FormIntegration: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        alert(JSON.stringify(data, null, 2));
      }}
    >
      <div class="story-container">
        <lith-switch name="notifications" value="enabled" required>
          Enable notifications
        </lith-switch>
        <lith-switch name="darkMode" value="on">Dark mode</lith-switch>
        <lith-switch name="autoSave" value="yes" checked> Auto-save </lith-switch>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
};

export const DifferentStates: Story = {
  render: () => html`
    <div class="story-container">
      <lith-switch>Normal</lith-switch>
      <lith-switch checked>Checked</lith-switch>
      <lith-switch disabled>Disabled</lith-switch>
      <lith-switch disabled checked>Disabled Checked</lith-switch>
      <lith-switch readonly>Readonly</lith-switch>
      <lith-switch readonly checked>Readonly Checked</lith-switch>
    </div>
  `,
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-switch {
        --lith-switch-width: 60px;
        --lith-switch-height: 30px;
        --lith-switch-thumb-size: 26px;
        --lith-switch-gap: 2px;
        font-family: Arial, sans-serif;
        font-size: 16px;
      }

      .custom-switch::part(control) {
        background: linear-gradient(to right, #ff4458, #ff6767);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .custom-switch[checked]::part(control) {
        background: linear-gradient(to right, #44d362, #56e879);
      }

      .custom-switch::part(thumb) {
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .custom-switch::part(label) {
        font-weight: 500;
        color: #333;
      }
    </style>
    <lith-switch class="custom-switch">Custom styled switch</lith-switch>
  `,
};

export const InteractiveExample: Story = {
  render: () => {
    const handleChange = (e: CustomEvent) => {
      const output = document.getElementById('switch-output');
      if (output) {
        output.textContent = `Switch is ${e.detail.checked ? 'ON' : 'OFF'}`;
      }
    };

    return html`
      <div class="story-container">
        <lith-switch @lith-change=${handleChange}>Toggle me!</lith-switch>
        <div id="switch-output" style="margin-top: 16px; font-weight: bold;">Switch is OFF</div>
      </div>
    `;
  },
};

export const ValidationExample: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const switches = form.querySelectorAll('lith-switch');
        let allValid = true;

        switches.forEach((sw) => {
          if (!sw.checkValidity()) {
            sw.reportValidity();
            allValid = false;
          }
        });

        if (allValid) {
          alert('Form is valid!');
        }
      }}
    >
      <div class="story-container">
        <lith-switch name="terms" required validation-message="You must accept the terms">
          I accept the terms and conditions
        </lith-switch>
        <lith-switch name="newsletter">Subscribe to newsletter</lith-switch>
        <button type="submit">Submit</button>
      </div>
    </form>
  `,
};
