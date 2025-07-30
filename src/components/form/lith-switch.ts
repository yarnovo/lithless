import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

/**
 * Custom event detail for switch change events
 */
export interface SwitchChangeDetail {
  checked: boolean;
}

/**
 * Custom event detail for switch input events
 */
export interface SwitchInputDetail {
  checked: boolean;
}

/**
 * A headless switch component that provides complete interaction logic
 * without any predefined styles.
 *
 * @element lith-switch
 *
 * @fires {CustomEvent<SwitchChangeDetail>} lith-change - Fired when the switch state changes
 * @fires {CustomEvent<SwitchInputDetail>} lith-input - Fired when the user interacts with the switch
 * @fires {FocusEvent} lith-focus - Fired when the switch gains focus
 * @fires {FocusEvent} lith-blur - Fired when the switch loses focus
 *
 * @slot - The switch label content
 * @slot on-icon - The icon to display when on
 * @slot off-icon - The icon to display when off
 *
 * @csspart base - The component's root element
 * @csspart input - The hidden native input element
 * @csspart control - The switch track container
 * @csspart thumb - The switch thumb/handle
 * @csspart label - The label container
 *
 * @cssprop [--lith-switch-width=44px] - The width of the switch track
 * @cssprop [--lith-switch-height=24px] - The height of the switch track
 * @cssprop [--lith-switch-thumb-size=20px] - The size of the switch thumb
 * @cssprop [--lith-switch-gap=2px] - The gap between thumb and track
 * @cssprop [--lith-switch-label-gap=8px] - The gap between switch and label
 * @cssprop [--lith-switch-hover-scale=1.05] - Scale factor on hover
 * @cssprop [--lith-switch-active-scale=0.95] - Scale factor when active
 * @cssprop [--lith-switch-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-switch-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-switch-transition-duration=200ms] - Transition duration
 */
@customElement('lith-switch')
export class LithSwitch extends LitElement {
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
      gap: var(--lith-switch-label-gap, 8px);
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
      width: var(--lith-switch-width, 44px);
      height: var(--lith-switch-height, 24px);
      flex-shrink: 0;
      border-radius: calc(var(--lith-switch-height, 24px) / 2);
      transition: transform var(--lith-switch-transition-duration, 200ms) ease;
    }

    :host(:hover) .control {
      transform: scale(var(--lith-switch-hover-scale, 1.05));
    }

    :host(:active) .control {
      transform: scale(var(--lith-switch-active-scale, 0.95));
    }

    :host(:focus-within) .control {
      outline: var(--lith-switch-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-switch-focus-ring-offset, 2px);
    }

    .thumb {
      position: absolute;
      top: var(--lith-switch-gap, 2px);
      left: var(--lith-switch-gap, 2px);
      width: var(--lith-switch-thumb-size, 20px);
      height: var(--lith-switch-thumb-size, 20px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--lith-switch-transition-duration, 200ms) ease;
    }

    :host([checked]) .thumb {
      transform: translateX(
        calc(
          var(--lith-switch-width, 44px) - var(--lith-switch-thumb-size, 20px) - var(
              --lith-switch-gap,
              2px
            ) *
            2
        )
      );
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

    // Only set role if the environment supports it (not in JSDOM)
    try {
      this._internals.role = 'switch';
    } catch {
      // Fallback for testing environments
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
      try {
        this._internals.ariaDisabled = this.disabled ? 'true' : 'false';
      } catch {
        // Fallback for testing environments
      }
    }

    if (changedProperties.has('required')) {
      try {
        this._internals.ariaRequired = this.required ? 'true' : 'false';
      } catch {
        // Fallback for testing environments
      }
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
          role="switch"
          part="input"
          class="input"
          .checked=${live(this.checked)}
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
          <div part="thumb" class="thumb">
            ${this.checked
              ? html`<slot name="on-icon"></slot>`
              : html`<slot name="off-icon"></slot>`}
          </div>
        </div>
        <label part="label" class="label" @click=${this._handleLabelClick}>
          <slot>${this.label}</slot>
        </label>
      </div>
    `;
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
      this._toggle();
      this._emitInputEvent();
      this._emitChangeEvent();
    }
  }

  private _handleLabelClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled && !this.readonly) {
      this._toggle();
      this._emitInputEvent();
      this._emitChangeEvent();
    }
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!this.disabled && !this.readonly) {
        this._toggle();
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

  private _toggle(): void {
    this.checked = !this.checked;
  }

  private _updateAriaChecked(): void {
    try {
      this._internals.ariaChecked = this.checked ? 'true' : 'false';
    } catch {
      // Fallback for testing environments
    }
  }

  private _updateFormValue(): void {
    // Check if setFormValue is available (not in JSDOM)
    if (typeof this._internals.setFormValue === 'function') {
      if (this.checked) {
        this._internals.setFormValue(this.value);
      } else {
        this._internals.setFormValue(null);
      }
    }
  }

  private _updateValidity(): void {
    // Check if setValidity is available (not in JSDOM)
    if (typeof this._internals.setValidity === 'function') {
      if (this.required && !this.checked) {
        const message = this.validationMessage || 'Please toggle this switch.';
        this._internals.setValidity({ valueMissing: true }, message);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  private _emitChangeEvent(): void {
    const detail: SwitchChangeDetail = {
      checked: this.checked,
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
    const detail: SwitchInputDetail = {
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
   * Toggles the switch state
   */
  toggle(): void {
    if (!this.disabled && !this.readonly) {
      this._toggle();
      this._emitChangeEvent();
    }
  }

  /**
   * Checks the validity of the switch
   */
  checkValidity(): boolean {
    if (typeof this._internals.checkValidity === 'function') {
      return this._internals.checkValidity();
    }
    return true;
  }

  /**
   * Reports the validity of the switch
   */
  reportValidity(): boolean {
    if (typeof this._internals.reportValidity === 'function') {
      return this._internals.reportValidity();
    }
    return true;
  }

  /**
   * Sets a custom validation message
   */
  setCustomValidity(message: string): void {
    this.validationMessage = message;
    this._updateValidity();
  }

  /**
   * Focuses the switch
   */
  override focus(): void {
    this._input?.focus();
    super.focus();
  }

  /**
   * Removes focus from the switch
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
