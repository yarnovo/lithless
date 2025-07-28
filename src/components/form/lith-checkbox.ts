import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

/**
 * Custom event detail for checkbox change events
 */
export interface CheckboxChangeDetail {
  checked: boolean;
  indeterminate: boolean;
}

/**
 * Custom event detail for checkbox input events
 */
export interface CheckboxInputDetail {
  checked: boolean;
}

/**
 * A headless checkbox component that provides complete interaction logic
 * without any predefined styles.
 *
 * @element lith-checkbox
 *
 * @fires {CustomEvent<CheckboxChangeDetail>} lith-change - Fired when the checkbox state changes
 * @fires {CustomEvent<CheckboxInputDetail>} lith-input - Fired when the user interacts with the checkbox
 * @fires {FocusEvent} lith-focus - Fired when the checkbox gains focus
 * @fires {FocusEvent} lith-blur - Fired when the checkbox loses focus
 *
 * @slot - The checkbox label content
 * @slot icon - The icon to display when checked
 * @slot indeterminate-icon - The icon to display when indeterminate
 *
 * @csspart base - The component's root element
 * @csspart input - The hidden native input element
 * @csspart control - The visual checkbox container
 * @csspart label - The label container
 *
 * @cssprop [--lith-checkbox-size=20px] - The size of the checkbox
 * @cssprop [--lith-checkbox-label-gap=8px] - The gap between checkbox and label
 * @cssprop [--lith-checkbox-hover-scale=1.1] - Scale factor on hover
 * @cssprop [--lith-checkbox-active-scale=0.95] - Scale factor when active
 * @cssprop [--lith-checkbox-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-checkbox-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-checkbox-transition-duration=200ms] - Transition duration
 */
@customElement('lith-checkbox')
export class LithCheckbox extends LitElement {
  static formAssociated = true;

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      vertical-align: middle;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
    }

    :host([readonly]) {
      cursor: default;
    }

    .base {
      display: inline-flex;
      align-items: center;
      gap: var(--lith-checkbox-label-gap, 8px);
    }

    .base.label-before {
      flex-direction: row-reverse;
    }

    .input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
      margin: 0;
    }

    .control {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--lith-checkbox-size, 20px);
      height: var(--lith-checkbox-size, 20px);
      flex-shrink: 0;
      transition: transform var(--lith-checkbox-transition-duration, 200ms) ease;
    }

    :host(:hover) .control {
      transform: scale(var(--lith-checkbox-hover-scale, 1.1));
    }

    :host(:active) .control {
      transform: scale(var(--lith-checkbox-active-scale, 0.95));
    }

    :host(:focus-within) .control {
      outline: var(--lith-checkbox-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-checkbox-focus-ring-offset, 2px);
    }

    .label {
      display: inline-block;
    }

    ::slotted(*) {
      margin: 0;
    }
  `;

  private _internals: ElementInternals;
  private _defaultChecked: boolean = false;

  @property({ type: Boolean, reflect: true })
  checked: boolean = false;

  @property({ type: Boolean, reflect: true })
  indeterminate: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, reflect: true })
  readonly: boolean = false;

  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: String })
  name: string = '';

  @property({ type: String })
  value: string = 'on';

  @property({ type: String })
  label: string = '';

  @property({ type: String, attribute: 'label-position' })
  labelPosition: 'before' | 'after' = 'after';

  @property({ type: String, attribute: 'validation-message' })
  validationMessage: string = '';

  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  @query('.input')
  private _input!: HTMLInputElement;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._internals.role = 'checkbox';
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._defaultChecked = this.checked;
    this._updateFormValue();
    this._updateValidity();
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('checked') || changedProperties.has('indeterminate')) {
      this._updateAriaChecked();
      this._updateFormValue();
      this._updateValidity();
    }

    if (changedProperties.has('disabled')) {
      this._internals.ariaDisabled = this.disabled ? 'true' : 'false';
    }

    if (changedProperties.has('required')) {
      this._internals.ariaRequired = this.required ? 'true' : 'false';
      this._updateValidity();
    }

    if (changedProperties.has('validationMessage')) {
      this._updateValidity();
    }
  }

  override render() {
    const classes = {
      base: true,
      'label-before': this.labelPosition === 'before',
    };

    return html`
      <div part="base" class=${classMap(classes)}>
        <input
          type="checkbox"
          part="input"
          class="input"
          .checked=${live(this.checked)}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          name=${ifDefined(this.name || undefined)}
          value=${ifDefined(this.value || undefined)}
          aria-hidden="true"
          tabindex="-1"
          @change=${this._handleChange}
          @click=${this._handleClick}
        />
        <div part="control" class="control" @click=${this._handleControlClick}>
          ${this._renderIcon()}
        </div>
        <label part="label" class="label" @click=${this._handleLabelClick}>
          <slot>${this.label}</slot>
        </label>
      </div>
    `;
  }

  private _renderIcon() {
    if (this.indeterminate) {
      return html`<slot name="indeterminate-icon"></slot>`;
    }
    if (this.checked) {
      return html`<slot name="icon"></slot>`;
    }
    return null;
  }

  private _handleChange(event: Event): void {
    event.stopPropagation();
  }

  private _handleClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  private _handleControlClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled && !this.readonly) {
      this._toggleChecked();
      this._emitInputEvent();
      this._emitChangeEvent();
    }
  }

  private _handleLabelClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled && !this.readonly) {
      this._toggleChecked();
      this._emitInputEvent();
      this._emitChangeEvent();
    }
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
      if (!this.disabled && !this.readonly) {
        this._toggleChecked();
        this._emitInputEvent();
        this._emitChangeEvent();
      }
    }
  }

  private _handleFocus(): void {
    this.dispatchEvent(new FocusEvent('lith-focus', { bubbles: true, composed: true }));
  }

  private _handleBlur(): void {
    this.dispatchEvent(new FocusEvent('lith-blur', { bubbles: true, composed: true }));
  }

  private _toggleChecked(): void {
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
  }

  private _updateAriaChecked(): void {
    if (this.indeterminate) {
      this._internals.ariaChecked = 'mixed';
    } else {
      this._internals.ariaChecked = this.checked ? 'true' : 'false';
    }
  }

  private _updateFormValue(): void {
    if (this.checked) {
      this._internals.setFormValue(this.value);
    } else {
      this._internals.setFormValue(null);
    }
  }

  private _updateValidity(): void {
    if (this.required && !this.checked) {
      const message = this.validationMessage || 'Please check this box if you want to proceed.';
      this._internals.setValidity({ valueMissing: true }, message);
    } else {
      this._internals.setValidity({});
    }
  }

  private _emitChangeEvent(): void {
    const detail: CheckboxChangeDetail = {
      checked: this.checked,
      indeterminate: this.indeterminate,
    };
    this.dispatchEvent(
      new CustomEvent('lith-change', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _emitInputEvent(): void {
    const detail: CheckboxInputDetail = {
      checked: this.checked,
    };
    this.dispatchEvent(
      new CustomEvent('lith-input', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Toggles the checkbox checked state
   */
  toggle(): void {
    this._toggleChecked();
    this._emitChangeEvent();
  }

  /**
   * Sets the checkbox to checked state
   */
  check(): void {
    if (!this.checked) {
      this.checked = true;
      this.indeterminate = false;
      this._emitChangeEvent();
    }
  }

  /**
   * Sets the checkbox to unchecked state
   */
  uncheck(): void {
    if (this.checked) {
      this.checked = false;
      this.indeterminate = false;
      this._emitChangeEvent();
    }
  }

  /**
   * Sets the indeterminate state
   */
  setIndeterminate(value: boolean): void {
    if (this.indeterminate !== value) {
      this.indeterminate = value;
      this._emitChangeEvent();
    }
  }

  /**
   * Checks the validity of the checkbox
   */
  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  /**
   * Reports the validity of the checkbox
   */
  reportValidity(): boolean {
    return this._internals.reportValidity();
  }

  /**
   * Sets a custom validation message
   */
  setCustomValidity(message: string): void {
    this.validationMessage = message;
    this._updateValidity();
  }

  /**
   * Focuses the checkbox
   */
  override focus(): void {
    this._input?.focus();
    super.focus();
  }

  /**
   * Removes focus from the checkbox
   */
  override blur(): void {
    this._input?.blur();
    super.blur();
  }

  /**
   * Form-associated lifecycle: called when the form is reset
   */
  formResetCallback(): void {
    this.checked = this._defaultChecked;
    this.indeterminate = false;
  }

  /**
   * Form-associated lifecycle: called when the element's form state is restored
   */
  formStateRestoreCallback(state: string): void {
    this.checked = state === this.value;
  }

  override firstUpdated(): void {
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('focus', this._handleFocus);
    this.addEventListener('blur', this._handleBlur);

    // Set tabindex for keyboard navigation
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('focus', this._handleFocus);
    this.removeEventListener('blur', this._handleBlur);
  }
}
