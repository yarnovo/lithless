import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

/**
 * Custom event detail for radio change events
 */
export interface RadioChangeDetail {
  checked: boolean;
  value: string;
}

/**
 * Custom event detail for radio input events
 */
export interface RadioInputDetail {
  checked: boolean;
  value: string;
}

/**
 * A headless radio button component that provides complete interaction logic
 * without any predefined styles.
 *
 * @element lith-radio
 *
 * @fires {CustomEvent<RadioChangeDetail>} lith-change - Fired when the radio state changes
 * @fires {CustomEvent<RadioInputDetail>} lith-input - Fired when the user interacts with the radio
 * @fires {FocusEvent} lith-focus - Fired when the radio gains focus
 * @fires {FocusEvent} lith-blur - Fired when the radio loses focus
 *
 * @slot - The radio label content
 * @slot icon - The icon to display when checked
 *
 * @csspart base - The component's root element
 * @csspart input - The hidden native input element
 * @csspart control - The visual radio container
 * @csspart label - The label container
 *
 * @cssprop [--lith-radio-size=20px] - The size of the radio button
 * @cssprop [--lith-radio-label-gap=8px] - The gap between radio and label
 * @cssprop [--lith-radio-hover-scale=1.1] - Scale factor on hover
 * @cssprop [--lith-radio-active-scale=0.95] - Scale factor when active
 * @cssprop [--lith-radio-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-radio-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-radio-transition-duration=200ms] - Transition duration
 */
@customElement('lith-radio')
export class LithRadio extends LitElement {
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
      gap: var(--lith-radio-label-gap, 8px);
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
      width: var(--lith-radio-size, 20px);
      height: var(--lith-radio-size, 20px);
      border-radius: 50%;
      flex-shrink: 0;
      transition: transform var(--lith-radio-transition-duration, 200ms) ease;
    }

    :host(:hover) .control {
      transform: scale(var(--lith-radio-hover-scale, 1.1));
    }

    :host(:active) .control {
      transform: scale(var(--lith-radio-active-scale, 0.95));
    }

    :host(:focus-within) .control {
      outline: var(--lith-radio-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-radio-focus-ring-offset, 2px);
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
  disabled: boolean = false;

  @property({ type: Boolean, reflect: true })
  readonly: boolean = false;

  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: String })
  name: string = '';

  @property({ type: String })
  value: string = '';

  @property({ type: String })
  id: string = '';

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
    this._internals.role = 'radio';

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = `lith-radio-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._defaultChecked = this.checked;
    this._updateFormValue();
    this._updateValidity();
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('checked')) {
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

    if (changedProperties.has('value') && this.checked) {
      this._updateFormValue();
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
          type="radio"
          part="input"
          class="input"
          .checked=${live(this.checked)}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          name=${ifDefined(this.name || undefined)}
          value=${ifDefined(this.value || undefined)}
          id=${ifDefined(this.id || undefined)}
          aria-hidden="true"
          tabindex="-1"
          @change=${this._handleChange}
          @click=${this._handleClick}
        />
        <div part="control" class="control" @click=${this._handleControlClick}>
          ${this._renderIcon()}
        </div>
        <label
          part="label"
          class="label"
          for=${ifDefined(this.id || undefined)}
          @click=${this._handleLabelClick}
        >
          <slot>${this.label}</slot>
        </label>
      </div>
    `;
  }

  private _renderIcon() {
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
    if (!this.disabled && !this.readonly && !this.checked) {
      this._setChecked(true);
      this._emitInputEvent();
      this._emitChangeEvent();
    }
  }

  private _handleLabelClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled && !this.readonly && !this.checked) {
      this._setChecked(true);
      this._emitInputEvent();
      this._emitChangeEvent();
    }
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
      if (!this.disabled && !this.readonly && !this.checked) {
        this._setChecked(true);
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

  private _setChecked(value: boolean): void {
    if (this.checked !== value) {
      this.checked = value;

      // When a radio button is checked, uncheck other radios in the same group
      if (value && this.name) {
        this._uncheckOtherRadiosInGroup();
      }
    }
  }

  private _uncheckOtherRadiosInGroup(): void {
    if (!this.name) return;

    const form = this.closest('form') || this.getRootNode();
    if (form && 'querySelectorAll' in form) {
      const otherRadios = (form as Document | Element).querySelectorAll(
        `lith-radio[name="${this.name}"]`
      ) as NodeListOf<LithRadio>;
      otherRadios.forEach((radio) => {
        if (radio !== this && radio.checked) {
          radio.checked = false;
        }
      });
    }
  }

  private _updateAriaChecked(): void {
    this._internals.ariaChecked = this.checked ? 'true' : 'false';
  }

  private _updateFormValue(): void {
    if (this.checked && this.value) {
      this._internals.setFormValue(this.value);
    } else {
      this._internals.setFormValue(null);
    }
  }

  private _updateValidity(): void {
    if (this.required && !this.checked) {
      const message = this.validationMessage || 'Please select this option.';
      this._internals.setValidity({ valueMissing: true }, message);
    } else {
      this._internals.setValidity({});
    }
  }

  private _emitChangeEvent(): void {
    const detail: RadioChangeDetail = {
      checked: this.checked,
      value: this.value,
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
    const detail: RadioInputDetail = {
      checked: this.checked,
      value: this.value,
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
   * Selects this radio button
   */
  select(): void {
    if (!this.disabled && !this.readonly) {
      this._setChecked(true);
      this._emitChangeEvent();
    }
  }

  /**
   * Deselects this radio button (used internally by radio group)
   */
  deselect(): void {
    if (this.checked) {
      this.checked = false;
      this._emitChangeEvent();
    }
  }

  /**
   * Checks the validity of the radio button
   */
  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  /**
   * Reports the validity of the radio button
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
   * Focuses the radio button
   */
  override focus(): void {
    this._input?.focus();
    super.focus();
  }

  /**
   * Removes focus from the radio button
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
      this.tabIndex = this.checked ? 0 : -1;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('focus', this._handleFocus);
    this.removeEventListener('blur', this._handleBlur);
  }
}
