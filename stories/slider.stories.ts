import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { expect, userEvent, fn } from '@storybook/test';
import '../src/components/form/lith-slider';
import type { LithSlider } from '../src/components/form/lith-slider';

const meta: Meta<LithSlider> = {
  title: 'Components/Form/Slider',
  component: 'lith-slider',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A headless slider component that provides complete interaction logic without any predefined styles.

## Features

- **Range Selection**: Supports custom min/max values and step increments
- **Keyboard Navigation**: Full keyboard support with arrow keys, Home/End, Page Up/Down
- **Mouse/Touch Support**: Click-to-set and drag-to-adjust functionality
- **Dual Orientation**: Supports both horizontal and vertical orientations
- **Form Integration**: Full form validation and submission support
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **Customizable Display**: Optional value display and tick marks
- **Responsive**: Works on all screen sizes and input methods

## Usage

\`\`\`html
<lith-slider
  min="0"
  max="100"
  step="1"
  value="50"
  label="Volume"
  show-value
></lith-slider>
\`\`\`

## Styling

The component provides several CSS custom properties and parts for styling:

\`\`\`css
lith-slider {
  --lith-slider-height: 6px;
  --lith-slider-thumb-size: 24px;
  --lith-slider-focus-ring-width: 2px;
  --lith-slider-transition-duration: 200ms;
}

lith-slider::part(track-active) {
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
}

lith-slider::part(thumb) {
  background: white;
  border: 2px solid #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'Current value of the slider',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value',
    },
    step: {
      control: { type: 'number' },
      description: 'Step increment for value changes',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the slider is disabled',
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Whether the slider is read-only',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the slider is required for form validation',
    },
    name: {
      control: { type: 'text' },
      description: 'Name attribute for form submission',
    },
    label: {
      control: { type: 'text' },
      description: 'Label text for the slider',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider',
    },
    showValue: {
      control: { type: 'boolean' },
      description: 'Whether to show the current value',
    },
    showTicks: {
      control: { type: 'boolean' },
      description: 'Whether to show tick marks',
    },
    tickStep: {
      control: { type: 'number' },
      description: 'Step increment for tick marks (defaults to step)',
    },
    validationMessage: {
      control: { type: 'text' },
      description: 'Custom validation message',
    },
    'lith-change': {
      action: 'lith-change',
      description: 'Fired when the slider value changes',
    },
    'lith-input': {
      action: 'lith-input',
      description: 'Fired when the user interacts with the slider',
    },
  },
  args: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    readonly: false,
    required: false,
    name: '',
    label: '',
    orientation: 'horizontal',
    showValue: false,
    showTicks: false,
    validationMessage: '',
    'lith-change': fn(),
    'lith-input': fn(),
  },
};

export default meta;
type Story = StoryObj<LithSlider>;

export const Default: Story = {
  render: (args) => html`
    <lith-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
  play: async ({ canvasElement, args }) => {
    const slider = canvasElement.querySelector('lith-slider') as LithSlider;

    await expect(slider).toBeInTheDocument();
    await expect(slider.value).toBe(args.value);
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Volume',
    value: 75,
    showValue: true,
  },
  render: (args) => html`
    <lith-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
};

export const WithTicks: Story = {
  args: {
    label: 'Rating',
    value: 3,
    min: 1,
    max: 5,
    step: 1,
    showValue: true,
    showTicks: true,
    tickStep: 1,
  },
  render: (args) => html`
    <lith-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    label: 'Temperature',
    value: 22,
    min: -10,
    max: 40,
    step: 1,
    showValue: true,
    showTicks: true,
    tickStep: 10,
  },
  render: (args) => html`
    <div style="height: 250px; display: flex; align-items: center;">
      <lith-slider
        .value=${args.value}
        .min=${args.min}
        .max=${args.max}
        .step=${args.step}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?required=${args.required}
        name=${ifDefined(args.name || undefined)}
        label=${ifDefined(args.label || undefined)}
        orientation=${args.orientation}
        ?show-value=${args.showValue}
        ?show-ticks=${args.showTicks}
        .tickStep=${args.tickStep}
        validation-message=${ifDefined(args.validationMessage || undefined)}
        @lith-change=${args['lith-change']}
        @lith-input=${args['lith-input']}
        style="height: 200px;"
      ></lith-slider>
    </div>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Slider',
    value: 30,
    showValue: true,
  },
  render: (args) => html`
    <lith-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
};

export const Readonly: Story = {
  args: {
    readonly: true,
    label: 'Read-only Slider',
    value: 65,
    showValue: true,
  },
  render: (args) => html`
    <lith-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
};

export const CustomRange: Story = {
  args: {
    label: 'Price Range',
    value: 250,
    min: 100,
    max: 500,
    step: 25,
    showValue: true,
    showTicks: true,
    tickStep: 100,
  },
  render: (args) => html`
    <lith-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
};

export const DecimalValues: Story = {
  args: {
    label: 'Precision Control',
    value: 2.5,
    min: 0,
    max: 5,
    step: 0.1,
    showValue: true,
    showTicks: true,
    tickStep: 0.5,
  },
  render: (args) => html`
    <lith-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
};

export const InForm: Story = {
  args: {
    name: 'volume',
    label: 'Volume Level',
    value: 50,
    required: true,
    showValue: true,
  },
  render: (args) => html`
    <form style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;">
      <lith-slider
        .value=${args.value}
        .min=${args.min}
        .max=${args.max}
        .step=${args.step}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?required=${args.required}
        name=${ifDefined(args.name || undefined)}
        label=${ifDefined(args.label || undefined)}
        orientation=${args.orientation}
        ?show-value=${args.showValue}
        ?show-ticks=${args.showTicks}
        .tickStep=${args.tickStep}
        validation-message=${ifDefined(args.validationMessage || undefined)}
        @lith-change=${args['lith-change']}
        @lith-input=${args['lith-input']}
      ></lith-slider>
      <div style="display: flex; gap: 8px;">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form') as HTMLFormElement;

    // Test form integration
    const formData = new FormData(form);
    await expect(formData.get('volume')).toBe('50');
  },
};

export const Styled: Story = {
  args: {
    label: 'Styled Slider',
    value: 60,
    showValue: true,
  },
  render: (args) => html`
    <style>
      .styled-slider {
        --lith-slider-height: 8px;
        --lith-slider-thumb-size: 24px;
        --lith-slider-hover-scale: 1.15;
        --lith-slider-active-scale: 1.25;
        --lith-slider-focus-ring-width: 3px;
        --lith-slider-transition-duration: 300ms;
      }

      .styled-slider::part(track-inactive) {
        background: linear-gradient(90deg, #e5e7eb, #d1d5db);
        border-radius: 4px;
      }

      .styled-slider::part(track-active) {
        background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        border-radius: 4px;
      }

      .styled-slider::part(thumb) {
        background: white;
        border: 3px solid #3b82f6;
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
      }

      .styled-slider::part(label) {
        font-weight: 600;
        color: #374151;
      }

      .styled-slider::part(value-display) {
        background: #3b82f6;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
      }
    </style>
    <lith-slider
      class="styled-slider"
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
};

export const InteractionTest: Story = {
  args: {
    label: 'Interactive Slider',
    value: 50,
    showValue: true,
  },
  render: (args) => html`
    <lith-slider
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      name=${ifDefined(args.name || undefined)}
      label=${ifDefined(args.label || undefined)}
      orientation=${args.orientation}
      ?show-value=${args.showValue}
      ?show-ticks=${args.showTicks}
      .tickStep=${args.tickStep}
      validation-message=${ifDefined(args.validationMessage || undefined)}
      @lith-change=${args['lith-change']}
      @lith-input=${args['lith-input']}
      style="width: 300px;"
    ></lith-slider>
  `,
  play: async ({ canvasElement, args }) => {
    const slider = canvasElement.querySelector('lith-slider') as LithSlider;

    // Wait for component to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test keyboard interaction
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await expect(slider.value).toBe(51);

    // Test arrow left
    await userEvent.keyboard('{ArrowLeft}');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await expect(slider.value).toBe(50);

    // Test Home key
    await userEvent.keyboard('{Home}');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await expect(slider.value).toBe(0);

    // Test End key
    await userEvent.keyboard('{End}');
    await new Promise((resolve) => setTimeout(resolve, 100));

    await expect(slider.value).toBe(100);

    // Verify events were called
    await expect(args['lith-input']).toHaveBeenCalled();
    await expect(args['lith-change']).toHaveBeenCalled();
  },
};
