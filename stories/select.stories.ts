import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/form/lith-select';
import '../src/components/form/lith-option';
import type { LithSelect } from '../src/components/form/lith-select';

const meta: Meta<LithSelect> = {
  title: 'Form/Select',
  component: 'lith-select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A headless select component that provides complete dropdown functionality without any predefined styles.

## Features

- **Form Integration**: Full support for HTML forms with \`name\` and \`value\` attributes
- **Accessibility**: ARIA attributes, keyboard navigation, and screen reader support
- **Validation**: Built-in validation with custom messages
- **Flexible**: No default styles, fully customizable
- **Events**: Rich event system for handling user interactions

## Usage

\`\`\`html
<lith-select name="country" required>
  <lith-option value="us">United States</lith-option>
  <lith-option value="uk">United Kingdom</lith-option>
  <lith-option value="ca">Canada</lith-option>
</lith-select>
\`\`\`

## Styling

The component provides several CSS parts and custom properties for styling:

\`\`\`css
lith-select {
  /* Custom properties */
  --lith-select-trigger-padding: 12px 16px;
  --lith-select-trigger-gap: 12px;
  --lith-select-listbox-max-height: 300px;
  --lith-select-listbox-offset: 4px;
}

lith-select::part(trigger) {
  /* Style the trigger button */
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

lith-select::part(listbox) {
  /* Style the dropdown */
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

lith-option:hover {
  /* Style option hover state */
  background: #f5f5f5;
}

lith-option.highlighted {
  /* Style keyboard navigation highlight */
  background: #e3f2fd;
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the select is read-only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required',
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
    placeholder: {
      control: 'text',
      description: 'The placeholder text when no option is selected',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"Select an option"' },
      },
    },
    open: {
      control: 'boolean',
      description: 'Whether the dropdown is open',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'The size of the select',
      table: {
        type: { summary: '"small" | "medium" | "large"' },
        defaultValue: { summary: '"medium"' },
      },
    },
  },
  args: {
    value: '',
    disabled: false,
    readonly: false,
    required: false,
    name: '',
    placeholder: 'Select an option',
    open: false,
    size: 'medium',
  },
  decorators: [
    (Story) => html`
      <style>
        lith-select {
          --lith-select-trigger-padding: 8px 12px;
          --lith-select-trigger-gap: 8px;
          --lith-select-listbox-offset: 4px;
          --lith-select-listbox-max-height: 240px;
          width: 250px;
        }

        lith-select::part(trigger) {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          min-height: 40px;
          transition:
            border-color 200ms,
            box-shadow 200ms;
        }

        lith-select::part(trigger):hover {
          border-color: #9ca3af;
        }

        lith-select:focus-within::part(trigger) {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        lith-select[disabled]::part(trigger) {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        lith-select::part(value) {
          color: #111827;
        }

        lith-select::part(value).placeholder {
          color: #9ca3af;
        }

        lith-select::part(icon) {
          color: #6b7280;
        }

        lith-select::part(listbox) {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin-top: 4px;
        }

        lith-option {
          transition: background-color 150ms;
        }

        lith-option:hover:not([disabled]) {
          background-color: #f3f4f6;
        }

        lith-option[selected] {
          background-color: #eff6ff;
          color: #2563eb;
        }

        lith-option.highlighted {
          background-color: #e0e7ff;
          outline: none;
        }

        lith-option[disabled] {
          color: #9ca3af;
        }

        lith-select[size='small'] {
          --lith-select-trigger-padding: 6px 10px;
          font-size: 14px;
        }

        lith-select[size='small']::part(trigger) {
          min-height: 32px;
        }

        lith-select[size='large'] {
          --lith-select-trigger-padding: 10px 14px;
          font-size: 16px;
        }

        lith-select[size='large']::part(trigger) {
          min-height: 48px;
        }

        .story-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 16px;
          max-width: 400px;
        }
      </style>
      ${Story()}
    `,
  ],
};

export default meta;
type Story = StoryObj<LithSelect>;

export const Default: Story = {
  render: (args) => html`
    <lith-select
      value=${args.value || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      ?open=${args.open}
      size=${args.size}
    >
      <lith-option value="option1">Option 1</lith-option>
      <lith-option value="option2">Option 2</lith-option>
      <lith-option value="option3">Option 3</lith-option>
      <lith-option value="option4">Option 4</lith-option>
    </lith-select>
  `,
};

export const WithSelectedValue: Story = {
  args: {
    value: 'option2',
  },
  render: (args) => html`
    <lith-select
      value=${args.value || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      size=${args.size}
    >
      <lith-option value="option1">Option 1</lith-option>
      <lith-option value="option2">Option 2</lith-option>
      <lith-option value="option3">Option 3</lith-option>
      <lith-option value="option4">Option 4</lith-option>
    </lith-select>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'option1',
  },
  render: (args) => html`
    <lith-select
      value=${args.value || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      size=${args.size}
    >
      <lith-option value="option1">Option 1</lith-option>
      <lith-option value="option2">Option 2</lith-option>
      <lith-option value="option3">Option 3</lith-option>
    </lith-select>
  `,
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'option2',
  },
  render: (args) => html`
    <lith-select
      value=${args.value || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      size=${args.size}
    >
      <lith-option value="option1">Option 1</lith-option>
      <lith-option value="option2">Option 2</lith-option>
      <lith-option value="option3">Option 3</lith-option>
    </lith-select>
  `,
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Please select an option',
  },
  render: (args) => html`
    <lith-select
      value=${args.value || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      size=${args.size}
    >
      <lith-option value="option1">Option 1</lith-option>
      <lith-option value="option2">Option 2</lith-option>
      <lith-option value="option3">Option 3</lith-option>
    </lith-select>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <lith-select placeholder="Select a country">
      <lith-option value="us">
        <span slot="icon">🇺🇸</span>
        United States
      </lith-option>
      <lith-option value="uk">
        <span slot="icon">🇬🇧</span>
        United Kingdom
      </lith-option>
      <lith-option value="ca">
        <span slot="icon">🇨🇦</span>
        Canada
      </lith-option>
      <lith-option value="au">
        <span slot="icon">🇦🇺</span>
        Australia
      </lith-option>
      <lith-option value="jp">
        <span slot="icon">🇯🇵</span>
        Japan
      </lith-option>
    </lith-select>
  `,
};

export const WithDisabledOptions: Story = {
  render: () => html`
    <lith-select placeholder="Select availability">
      <lith-option value="available">Available</lith-option>
      <lith-option value="busy" disabled>Busy (Unavailable)</lith-option>
      <lith-option value="away">Away</lith-option>
      <lith-option value="offline" disabled>Offline (Unavailable)</lith-option>
    </lith-select>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div class="story-container">
      <lith-select size="small" placeholder="Small select">
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2">Option 2</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-select>
      <lith-select size="medium" placeholder="Medium select">
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2">Option 2</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-select>
      <lith-select size="large" placeholder="Large select">
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2">Option 2</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-select>
    </div>
  `,
};

export const LongOptionText: Story = {
  render: () => html`
    <lith-select placeholder="Select a description" style="width: 300px;">
      <lith-option value="short">Short text</lith-option>
      <lith-option value="medium">This is a medium length option text</lith-option>
      <lith-option value="long">
        This is a very long option text that might overflow the select width and should be handled
        properly
      </lith-option>
      <lith-option value="extra-long">
        This is an extremely long option text that definitely exceeds the normal width of a select
        component and demonstrates how overflow is handled in the component
      </lith-option>
    </lith-select>
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
        <lith-select name="country" required placeholder="Select your country">
          <lith-option value="us">United States</lith-option>
          <lith-option value="uk">United Kingdom</lith-option>
          <lith-option value="ca">Canada</lith-option>
          <lith-option value="au">Australia</lith-option>
        </lith-select>

        <lith-select name="language" placeholder="Select language">
          <lith-option value="en">English</lith-option>
          <lith-option value="es">Spanish</lith-option>
          <lith-option value="fr">French</lith-option>
          <lith-option value="de">German</lith-option>
        </lith-select>

        <lith-select name="timezone" value="utc" placeholder="Select timezone">
          <lith-option value="utc">UTC</lith-option>
          <lith-option value="est">Eastern Time</lith-option>
          <lith-option value="cst">Central Time</lith-option>
          <lith-option value="pst">Pacific Time</lith-option>
        </lith-select>

        <div style="display: flex; gap: 8px;">
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </div>
    </form>
  `,
};

export const InteractiveExample: Story = {
  render: () => {
    const handleChange = (e: CustomEvent) => {
      const output = document.getElementById('select-output');
      if (output) {
        output.textContent = `Selected value: ${e.detail.value}`;
      }
    };

    const handleOpen = () => {
      const status = document.getElementById('select-status');
      if (status) {
        status.textContent = 'Status: Open';
      }
    };

    const handleClose = () => {
      const status = document.getElementById('select-status');
      if (status) {
        status.textContent = 'Status: Closed';
      }
    };

    return html`
      <div class="story-container">
        <lith-select
          placeholder="Select an option"
          @lith-change=${handleChange}
          @lith-open=${handleOpen}
          @lith-close=${handleClose}
        >
          <lith-option value="option1">Option 1</lith-option>
          <lith-option value="option2">Option 2</lith-option>
          <lith-option value="option3">Option 3</lith-option>
          <lith-option value="option4">Option 4</lith-option>
        </lith-select>
        <div id="select-output" style="margin-top: 16px;">Selected value: (none)</div>
        <div id="select-status" style="margin-top: 8px;">Status: Closed</div>
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
        const select = form.querySelector('lith-select');
        if (select && !select.checkValidity()) {
          select.reportValidity();
        } else {
          alert('Form is valid!');
        }
      }}
    >
      <div class="story-container">
        <lith-select
          name="priority"
          required
          validation-message="Please select a priority level"
          placeholder="Select priority"
        >
          <lith-option value="low">Low Priority</lith-option>
          <lith-option value="medium">Medium Priority</lith-option>
          <lith-option value="high">High Priority</lith-option>
          <lith-option value="urgent">Urgent</lith-option>
        </lith-select>
        <button type="submit">Submit</button>
      </div>
    </form>
  `,
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-select {
        width: 280px;
        font-family: 'Segoe UI', sans-serif;
      }

      .custom-select::part(trigger) {
        background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
        border: 2px solid #495057;
        border-radius: 8px;
        font-weight: 500;
        padding: 12px 16px;
      }

      .custom-select::part(trigger):hover {
        background: linear-gradient(to bottom, #e9ecef, #dee2e6);
        border-color: #212529;
      }

      .custom-select:focus-within::part(trigger) {
        background: white;
        border-color: #0066cc;
        box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.25);
      }

      .custom-select::part(icon) {
        color: #0066cc;
        font-weight: bold;
      }

      .custom-select::part(listbox) {
        background: #f8f9fa;
        border: 2px solid #495057;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }

      .custom-select lith-option {
        padding: 10px 16px;
        font-weight: 500;
      }

      .custom-select lith-option:hover {
        background: #0066cc;
        color: white;
      }

      .custom-select lith-option[selected] {
        background: #e9ecef;
        color: #0066cc;
      }

      .custom-select lith-option.highlighted {
        background: #0066cc;
        color: white;
      }
    </style>
    <lith-select class="custom-select" placeholder="Choose your option">
      <lith-option value="design">Design</lith-option>
      <lith-option value="development">Development</lith-option>
      <lith-option value="marketing">Marketing</lith-option>
      <lith-option value="sales">Sales</lith-option>
    </lith-select>
  `,
};
