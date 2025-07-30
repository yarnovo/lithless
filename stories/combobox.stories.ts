import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/form/lith-combobox';
import '../src/components/form/lith-option';
import type { LithCombobox } from '../src/components/form/lith-combobox';

const meta: Meta<LithCombobox> = {
  title: 'Form/Combobox',
  component: 'lith-combobox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A headless combobox component that provides complete search and selection functionality without any predefined styles.

## Features

- **Search and Filter**: Type to search through options with customizable filter modes
- **Form Integration**: Full support for HTML forms with \`name\` and \`value\` attributes
- **Accessibility**: ARIA attributes, keyboard navigation, and screen reader support
- **Validation**: Built-in validation with custom messages
- **Flexible**: No default styles, fully customizable
- **Custom Values**: Optionally allow custom input values
- **Events**: Rich event system for handling user interactions

## Usage

\`\`\`html
<lith-combobox name="fruit" placeholder="Search fruits...">
  <lith-option value="apple">Apple</lith-option>
  <lith-option value="banana">Banana</lith-option>
  <lith-option value="cherry">Cherry</lith-option>
</lith-combobox>
\`\`\`

## Styling

The component provides several CSS parts and custom properties for styling:

\`\`\`css
lith-combobox {
  /* Custom properties */
  --lith-combobox-input-padding: 12px 16px;
  --lith-combobox-input-gap: 12px;
  --lith-combobox-listbox-max-height: 300px;
  --lith-combobox-listbox-offset: 4px;
}

lith-combobox::part(input-container) {
  /* Style the input container */
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

lith-combobox::part(input) {
  /* Style the input field */
  border: none;
  outline: none;
}

lith-combobox::part(listbox) {
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
    inputValue: {
      control: 'text',
      description: 'The current input text value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the combobox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the combobox is read-only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the combobox is required',
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
      description: 'The placeholder text for the input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"Type to search..."' },
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
    autoComplete: {
      control: 'boolean',
      description: 'Whether to auto-complete the input with selected value',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    allowCustom: {
      control: 'boolean',
      description: 'Whether to allow custom input values',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    filterMode: {
      control: 'select',
      options: ['contains', 'starts-with', 'custom'],
      description: 'The filtering mode for options',
      table: {
        type: { summary: '"contains" | "starts-with" | "custom"' },
        defaultValue: { summary: '"contains"' },
      },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: 'The size of the combobox',
      table: {
        type: { summary: '"small" | "medium" | "large"' },
        defaultValue: { summary: '"medium"' },
      },
    },
  },
  args: {
    value: '',
    inputValue: '',
    disabled: false,
    readonly: false,
    required: false,
    name: '',
    placeholder: 'Type to search...',
    open: false,
    autoComplete: true,
    allowCustom: false,
    filterMode: 'contains',
    size: 'medium',
  },
  decorators: [
    (Story) => html`
      <style>
        lith-combobox {
          --lith-combobox-input-padding: 8px 12px;
          --lith-combobox-input-gap: 8px;
          --lith-combobox-listbox-offset: 4px;
          --lith-combobox-listbox-max-height: 240px;
          width: 250px;
        }

        lith-combobox::part(input-container) {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          min-height: 40px;
          transition:
            border-color 200ms,
            box-shadow 200ms;
        }

        lith-combobox::part(input-container):hover {
          border-color: #9ca3af;
        }

        lith-combobox:focus-within::part(input-container) {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        lith-combobox[disabled]::part(input-container) {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        lith-combobox::part(input) {
          color: #111827;
        }

        lith-combobox::part(input)::placeholder {
          color: #9ca3af;
        }

        lith-combobox::part(icon) {
          color: #6b7280;
        }

        lith-combobox::part(listbox) {
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

        lith-combobox[size='small'] {
          --lith-combobox-input-padding: 6px 10px;
          font-size: 14px;
        }

        lith-combobox[size='small']::part(input-container) {
          min-height: 32px;
        }

        lith-combobox[size='large'] {
          --lith-combobox-input-padding: 10px 14px;
          font-size: 16px;
        }

        lith-combobox[size='large']::part(input-container) {
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
type Story = StoryObj<LithCombobox>;

export const Default: Story = {
  render: (args) => html`
    <lith-combobox
      value=${args.value || ''}
      input-value=${args.inputValue || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      ?open=${args.open}
      ?auto-complete=${args.autoComplete}
      ?allow-custom=${args.allowCustom}
      filter-mode=${args.filterMode}
      size=${args.size}
    >
      <lith-option value="apple">Apple</lith-option>
      <lith-option value="banana">Banana</lith-option>
      <lith-option value="cherry">Cherry</lith-option>
      <lith-option value="date">Date</lith-option>
      <lith-option value="elderberry">Elderberry</lith-option>
    </lith-combobox>
  `,
};

export const WithSelectedValue: Story = {
  args: {
    value: 'banana',
    inputValue: 'Banana',
  },
  render: (args) => html`
    <lith-combobox
      value=${args.value || ''}
      input-value=${args.inputValue || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      size=${args.size}
    >
      <lith-option value="apple">Apple</lith-option>
      <lith-option value="banana">Banana</lith-option>
      <lith-option value="cherry">Cherry</lith-option>
      <lith-option value="date">Date</lith-option>
    </lith-combobox>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'apple',
    inputValue: 'Apple',
  },
  render: (args) => html`
    <lith-combobox
      value=${args.value || ''}
      input-value=${args.inputValue || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      size=${args.size}
    >
      <lith-option value="apple">Apple</lith-option>
      <lith-option value="banana">Banana</lith-option>
      <lith-option value="cherry">Cherry</lith-option>
    </lith-combobox>
  `,
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'cherry',
    inputValue: 'Cherry',
  },
  render: (args) => html`
    <lith-combobox
      value=${args.value || ''}
      input-value=${args.inputValue || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      size=${args.size}
    >
      <lith-option value="apple">Apple</lith-option>
      <lith-option value="cherry">Cherry</lith-option>
      <lith-option value="date">Date</lith-option>
    </lith-combobox>
  `,
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Please select or type a fruit',
  },
  render: (args) => html`
    <lith-combobox
      value=${args.value || ''}
      input-value=${args.inputValue || ''}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      placeholder=${args.placeholder}
      size=${args.size}
    >
      <lith-option value="apple">Apple</lith-option>
      <lith-option value="banana">Banana</lith-option>
      <lith-option value="cherry">Cherry</lith-option>
    </lith-combobox>
  `,
};

export const AllowCustomValues: Story = {
  args: {
    allowCustom: true,
    placeholder: 'Type or select a programming language',
  },
  render: (args) => html`
    <lith-combobox
      value=""
      input-value=""
      ?allow-custom=${args.allowCustom}
      placeholder=${args.placeholder}
    >
      <lith-option value="javascript">JavaScript</lith-option>
      <lith-option value="python">Python</lith-option>
      <lith-option value="typescript">TypeScript</lith-option>
      <lith-option value="rust">Rust</lith-option>
      <lith-option value="go">Go</lith-option>
    </lith-combobox>
  `,
};

export const FilterModes: Story = {
  render: () => html`
    <div class="story-container">
      <div>
        <h4>Contains (default)</h4>
        <lith-combobox filter-mode="contains" placeholder="Type 'an' to see results">
          <lith-option value="apple">Apple</lith-option>
          <lith-option value="banana">Banana</lith-option>
          <lith-option value="orange">Orange</lith-option>
          <lith-option value="mango">Mango</lith-option>
        </lith-combobox>
      </div>
      <div>
        <h4>Starts With</h4>
        <lith-combobox filter-mode="starts-with" placeholder="Type 'a' to see results">
          <lith-option value="apple">Apple</lith-option>
          <lith-option value="apricot">Apricot</lith-option>
          <lith-option value="banana">Banana</lith-option>
          <lith-option value="avocado">Avocado</lith-option>
        </lith-combobox>
      </div>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <lith-combobox placeholder="Select a category">
      <lith-option value="design">
        <span slot="icon">🎨</span>
        Design
      </lith-option>
      <lith-option value="development">
        <span slot="icon">💻</span>
        Development
      </lith-option>
      <lith-option value="marketing">
        <span slot="icon">📈</span>
        Marketing
      </lith-option>
      <lith-option value="sales">
        <span slot="icon">💼</span>
        Sales
      </lith-option>
    </lith-combobox>
  `,
};

export const WithDisabledOptions: Story = {
  render: () => html`
    <lith-combobox placeholder="Select availability">
      <lith-option value="available">Available</lith-option>
      <lith-option value="busy" disabled>Busy (Unavailable)</lith-option>
      <lith-option value="away">Away</lith-option>
      <lith-option value="offline" disabled>Offline (Unavailable)</lith-option>
      <lith-option value="dnd">Do Not Disturb</lith-option>
    </lith-combobox>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div class="story-container">
      <lith-combobox size="small" placeholder="Small combobox">
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2">Option 2</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-combobox>
      <lith-combobox size="medium" placeholder="Medium combobox">
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2">Option 2</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-combobox>
      <lith-combobox size="large" placeholder="Large combobox">
        <lith-option value="option1">Option 1</lith-option>
        <lith-option value="option2">Option 2</lith-option>
        <lith-option value="option3">Option 3</lith-option>
      </lith-combobox>
    </div>
  `,
};

export const LargeDataset: Story = {
  render: () => {
    const countries = [
      'Afghanistan',
      'Albania',
      'Algeria',
      'Argentina',
      'Australia',
      'Austria',
      'Bangladesh',
      'Belgium',
      'Brazil',
      'Canada',
      'Chile',
      'China',
      'Colombia',
      'Denmark',
      'Egypt',
      'Finland',
      'France',
      'Germany',
      'Greece',
      'India',
      'Indonesia',
      'Iran',
      'Iraq',
      'Ireland',
      'Italy',
      'Japan',
      'Jordan',
      'Kenya',
      'Malaysia',
      'Mexico',
      'Netherlands',
      'New Zealand',
      'Norway',
      'Pakistan',
      'Philippines',
      'Poland',
      'Portugal',
      'Russia',
      'Saudi Arabia',
      'Singapore',
      'South Africa',
      'South Korea',
      'Spain',
      'Sweden',
      'Switzerland',
      'Thailand',
      'Turkey',
      'Ukraine',
      'United Kingdom',
      'United States',
      'Vietnam',
    ];

    return html`
      <lith-combobox placeholder="Search for a country" style="width: 300px;">
        ${countries.map(
          (country) => html`
            <lith-option value=${country.toLowerCase().replace(/\s+/g, '-')}
              >${country}</lith-option
            >
          `
        )}
      </lith-combobox>
    `;
  },
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
        <lith-combobox name="fruit" required placeholder="Select or type a fruit">
          <lith-option value="apple">Apple</lith-option>
          <lith-option value="banana">Banana</lith-option>
          <lith-option value="cherry">Cherry</lith-option>
          <lith-option value="date">Date</lith-option>
        </lith-combobox>

        <lith-combobox name="color" placeholder="Select a color" allow-custom>
          <lith-option value="red">Red</lith-option>
          <lith-option value="green">Green</lith-option>
          <lith-option value="blue">Blue</lith-option>
          <lith-option value="yellow">Yellow</lith-option>
        </lith-combobox>

        <lith-combobox name="programming-language" value="javascript" input-value="JavaScript">
          <lith-option value="javascript">JavaScript</lith-option>
          <lith-option value="python">Python</lith-option>
          <lith-option value="typescript">TypeScript</lith-option>
          <lith-option value="rust">Rust</lith-option>
        </lith-combobox>

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
      const output = document.getElementById('combobox-output');
      if (output) {
        output.textContent = `Selected: ${e.detail.value} (Display: ${e.detail.displayValue})`;
      }
    };

    const handleFilter = (e: CustomEvent) => {
      const status = document.getElementById('combobox-status');
      if (status) {
        status.textContent = `Filtered: ${e.detail.filteredOptions.length} options for "${e.detail.query}"`;
      }
    };

    return html`
      <div class="story-container">
        <lith-combobox
          placeholder="Search for a fruit"
          @lith-change=${handleChange}
          @lith-filter=${handleFilter}
        >
          <lith-option value="apple">Apple</lith-option>
          <lith-option value="apricot">Apricot</lith-option>
          <lith-option value="banana">Banana</lith-option>
          <lith-option value="blueberry">Blueberry</lith-option>
          <lith-option value="cherry">Cherry</lith-option>
          <lith-option value="date">Date</lith-option>
          <lith-option value="elderberry">Elderberry</lith-option>
        </lith-combobox>
        <div id="combobox-output" style="margin-top: 16px;">Selected: (none)</div>
        <div id="combobox-status" style="margin-top: 8px; color: #666;">
          Filtered: 7 options for ""
        </div>
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
        const combobox = form.querySelector('lith-combobox');
        if (combobox && !combobox.checkValidity()) {
          combobox.reportValidity();
        } else {
          alert('Form is valid!');
        }
      }}
    >
      <div class="story-container">
        <lith-combobox
          name="skill"
          required
          validation-message="Please select or enter a skill"
          placeholder="Select or type your primary skill"
          allow-custom
        >
          <lith-option value="javascript">JavaScript</lith-option>
          <lith-option value="python">Python</lith-option>
          <lith-option value="react">React</lith-option>
          <lith-option value="nodejs">Node.js</lith-option>
          <lith-option value="vue">Vue.js</lith-option>
        </lith-combobox>
        <button type="submit">Submit</button>
      </div>
    </form>
  `,
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-combobox {
        width: 300px;
        font-family: 'Segoe UI', sans-serif;
      }

      .custom-combobox::part(input-container) {
        background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
        border: 2px solid #495057;
        border-radius: 12px;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .custom-combobox::part(input-container):hover {
        background: linear-gradient(to bottom, #e9ecef, #dee2e6);
        border-color: #212529;
      }

      .custom-combobox:focus-within::part(input-container) {
        background: white;
        border-color: #0066cc;
        box-shadow:
          inset 0 2px 4px rgba(0, 0, 0, 0.05),
          0 0 0 4px rgba(0, 102, 204, 0.25);
      }

      .custom-combobox::part(input) {
        font-weight: 500;
        color: #212529;
      }

      .custom-combobox::part(icon) {
        color: #0066cc;
        font-weight: bold;
      }

      .custom-combobox::part(listbox) {
        background: #f8f9fa;
        border: 2px solid #495057;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        margin-top: 8px;
      }

      .custom-combobox lith-option {
        padding: 12px 16px;
        font-weight: 500;
        border-radius: 8px;
        margin: 4px;
      }

      .custom-combobox lith-option:hover {
        background: #0066cc;
        color: white;
      }

      .custom-combobox lith-option[selected] {
        background: #e9ecef;
        color: #0066cc;
      }

      .custom-combobox lith-option.highlighted {
        background: #0066cc;
        color: white;
      }
    </style>
    <lith-combobox class="custom-combobox" placeholder="Choose your technology">
      <lith-option value="frontend">Frontend Development</lith-option>
      <lith-option value="backend">Backend Development</lith-option>
      <lith-option value="fullstack">Full Stack Development</lith-option>
      <lith-option value="mobile">Mobile Development</lith-option>
      <lith-option value="devops">DevOps</lith-option>
    </lith-combobox>
  `,
};
