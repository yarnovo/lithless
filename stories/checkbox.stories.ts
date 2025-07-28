import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/form/lith-checkbox';
import type { LithCheckbox } from '../src/components/form/lith-checkbox';

const meta = {
  title: 'Form/Checkbox',
  tags: ['autodocs'],
  render: (args) => html`
    <lith-checkbox
      ?checked=${args.checked}
      ?indeterminate=${args.indeterminate}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${args.name || ''}
      value=${args.value || 'on'}
      label=${args.label || ''}
      label-position=${args.labelPosition || 'after'}
      validation-message=${args.validationMessage || ''}
      size=${args.size || 'medium'}
      @lith-change=${(e: CustomEvent) => console.log('lith-change:', e.detail)}
      @lith-input=${(e: CustomEvent) => console.log('lith-input:', e.detail)}
    >
      ${args.slotContent || ''}
    </lith-checkbox>
  `,
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in an indeterminate state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the checkbox is readonly',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: 'text',
      description: 'The name of the checkbox for form submission',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    value: {
      control: 'text',
      description: 'The value of the checkbox for form submission',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"on"' },
      },
    },
    label: {
      control: 'text',
      description: 'The label text (used if no slot content is provided)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    labelPosition: {
      control: { type: 'radio' },
      options: ['before', 'after'],
      description: 'Position of the label relative to the checkbox',
      table: {
        type: { summary: '"before" | "after"' },
        defaultValue: { summary: '"after"' },
      },
    },
    validationMessage: {
      control: 'text',
      description: 'Custom validation message',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
      description: 'Size hint for styling (CSS hook only)',
      table: {
        type: { summary: '"small" | "medium" | "large"' },
        defaultValue: { summary: '"medium"' },
      },
    },
    slotContent: {
      control: 'text',
      description: 'Content for the default slot (label)',
      table: {
        type: { summary: 'string | TemplateResult' },
      },
    },
  },
} satisfies Meta<LithCheckbox & { slotContent?: string }>;

export default meta;
type Story = StoryObj<LithCheckbox & { slotContent?: string }>;

export const Default: Story = {
  args: {
    slotContent: 'Default checkbox',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    slotContent: 'Checked checkbox',
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    slotContent: 'Indeterminate checkbox',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    slotContent: 'Disabled checkbox',
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    slotContent: 'Disabled checked checkbox',
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    checked: true,
    slotContent: 'Readonly checkbox',
  },
};

export const Required: Story = {
  args: {
    required: true,
    slotContent: 'Required checkbox',
  },
};

export const LabelBefore: Story = {
  args: {
    labelPosition: 'before',
    slotContent: 'Label before checkbox',
  },
};

export const WithFormIntegration: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        console.log('Form submitted:', Object.fromEntries(formData));
        alert('Form submitted! Check console for data.');
      }}
    >
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <lith-checkbox name="terms" required validation-message="You must agree to the terms">
          I agree to the terms and conditions
        </lith-checkbox>

        <lith-checkbox name="newsletter" value="yes"> Subscribe to newsletter </lith-checkbox>

        <lith-checkbox name="notifications" value="enabled" checked>
          Enable notifications
        </lith-checkbox>

        <div style="display: flex; gap: 8px;">
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </div>
    </form>
  `,
};

export const CheckboxGroup: Story = {
  render: () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    let selectedAll = false;
    const selectedOptions = new Set(['Option 1']);

    const updateSelectAll = (container: HTMLElement) => {
      const selectAll = container.querySelector('#select-all') as LithCheckbox;
      const checkboxes = container.querySelectorAll('.option-checkbox') as NodeListOf<LithCheckbox>;
      const checkedCount = Array.from(checkboxes).filter((cb) => cb.checked).length;

      if (checkedCount === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
      } else if (checkedCount === options.length) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
      } else {
        selectAll.checked = false;
        selectAll.indeterminate = true;
      }
    };

    return html`
      <div
        @lith-change=${(e: Event) => {
          const target = e.target as LithCheckbox;
          const container = target.closest('div') as HTMLElement;

          if (target.id === 'select-all') {
            selectedAll = (e as CustomEvent).detail.checked;
            const checkboxes = container.querySelectorAll(
              '.option-checkbox'
            ) as NodeListOf<LithCheckbox>;
            checkboxes.forEach((cb) => {
              cb.checked = selectedAll;
            });
          } else {
            updateSelectAll(container);
          }
        }}
      >
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <lith-checkbox id="select-all" .indeterminate=${true}> Select All </lith-checkbox>
          <div style="margin-left: 24px; display: flex; flex-direction: column; gap: 8px;">
            ${options.map(
              (option) => html`
                <lith-checkbox class="option-checkbox" .checked=${selectedOptions.has(option)}>
                  ${option}
                </lith-checkbox>
              `
            )}
          </div>
        </div>
      </div>
    `;
  },
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-checkbox {
        --lit-checkbox-size: 24px;
        --lit-checkbox-label-gap: 12px;
        --lit-checkbox-focus-ring-width: 3px;
        --lit-checkbox-focus-ring-offset: 3px;
        --lit-checkbox-hover-scale: 1.15;
        --lit-checkbox-active-scale: 0.9;
        --lit-checkbox-transition-duration: 300ms;

        font-family: system-ui, sans-serif;
        font-size: 18px;
        color: #333;
      }

      .custom-checkbox::part(control) {
        border: 2px solid #6366f1;
        border-radius: 6px;
        background: white;
        transition: all var(--lit-checkbox-transition-duration) ease;
      }

      .custom-checkbox[checked]::part(control) {
        background: #6366f1;
        border-color: #6366f1;
      }

      .custom-checkbox[checked]::part(control)::after {
        content: '✓';
        color: white;
        font-size: 16px;
        font-weight: bold;
      }

      .custom-checkbox[indeterminate]::part(control) {
        background: #e5e7eb;
        border-color: #6366f1;
      }

      .custom-checkbox[indeterminate]::part(control)::after {
        content: '−';
        color: #6366f1;
        font-size: 20px;
        font-weight: bold;
      }

      .custom-checkbox[disabled] {
        opacity: 0.5;
      }

      .custom-checkbox:focus-within::part(control) {
        outline-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      }
    </style>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lith-checkbox class="custom-checkbox"> Custom styled checkbox </lith-checkbox>

      <lith-checkbox class="custom-checkbox" checked> Checked custom checkbox </lith-checkbox>

      <lith-checkbox class="custom-checkbox" indeterminate>
        Indeterminate custom checkbox
      </lith-checkbox>

      <lith-checkbox class="custom-checkbox" disabled> Disabled custom checkbox </lith-checkbox>
    </div>
  `,
};

export const InteractiveExample: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 600px;">
      <div>
        <h3 style="margin-top: 0;">Interactive Checkbox Demo</h3>
        <p style="color: #666;">
          Try interacting with the checkbox below. Events will be logged to the console.
        </p>
      </div>

      <lith-checkbox
        id="interactive-checkbox"
        @lith-change=${(e: CustomEvent) => {
          const output = document.getElementById('event-output');
          if (output) {
            output.innerHTML += `<div>lith-change: checked=${e.detail.checked}, indeterminate=${e.detail.indeterminate}</div>`;
          }
        }}
        @lith-input=${(e: CustomEvent) => {
          const output = document.getElementById('event-output');
          if (output) {
            output.innerHTML += `<div>lith-input: checked=${e.detail.checked}</div>`;
          }
        }}
        @lith-focus=${() => {
          const output = document.getElementById('event-output');
          if (output) {
            output.innerHTML += '<div>lith-focus</div>';
          }
        }}
        @lith-blur=${() => {
          const output = document.getElementById('event-output');
          if (output) {
            output.innerHTML += '<div>lith-blur</div>';
          }
        }}
      >
        Interactive checkbox
      </lith-checkbox>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button
          @click=${() => {
            const cb = document.getElementById('interactive-checkbox') as LithCheckbox;
            cb.toggle();
          }}
        >
          Toggle
        </button>

        <button
          @click=${() => {
            const cb = document.getElementById('interactive-checkbox') as LithCheckbox;
            cb.check();
          }}
        >
          Check
        </button>

        <button
          @click=${() => {
            const cb = document.getElementById('interactive-checkbox') as LithCheckbox;
            cb.uncheck();
          }}
        >
          Uncheck
        </button>

        <button
          @click=${() => {
            const cb = document.getElementById('interactive-checkbox') as LithCheckbox;
            cb.setIndeterminate(!cb.indeterminate);
          }}
        >
          Toggle Indeterminate
        </button>

        <button
          @click=${() => {
            const cb = document.getElementById('interactive-checkbox') as LithCheckbox;
            cb.disabled = !cb.disabled;
          }}
        >
          Toggle Disabled
        </button>

        <button
          @click=${() => {
            const output = document.getElementById('event-output');
            if (output) {
              output.innerHTML = '';
            }
          }}
        >
          Clear Log
        </button>
      </div>

      <div
        style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; background: #f9fafb;"
      >
        <h4 style="margin-top: 0;">Event Log</h4>
        <div
          id="event-output"
          style="font-family: monospace; font-size: 14px; color: #374151;"
        ></div>
      </div>
    </div>
  `,
};
