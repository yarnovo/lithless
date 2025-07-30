import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

/**
 * Custom event detail for slider change events
 */
export interface SliderChangeDetail {
  value: number;
}

/**
 * Custom event detail for slider input events
 */
export interface SliderInputDetail {
  value: number;
}

/**
 * A headless slider component that provides complete interaction logic
 * without any predefined styles.
 *
 * @element lith-slider
 *
 * @fires {CustomEvent<SliderChangeDetail>} lith-change - Fired when the slider value changes
 * @fires {CustomEvent<SliderInputDetail>} lith-input - Fired when the user interacts with the slider
 * @fires {FocusEvent} lith-focus - Fired when the slider gains focus
 * @fires {FocusEvent} lith-blur - Fired when the slider loses focus
 *
 * @slot - The slider label content
 * @slot thumb - Custom content for the slider thumb
 *
 * @csspart base - The component's root element
 * @csspart input - The hidden native input element
 * @csspart track - The slider track container
 * @csspart track-inactive - The inactive portion of the track
 * @csspart track-active - The active portion of the track
 * @csspart thumb - The slider thumb/handle
 * @csspart label - The label container
 * @csspart value-display - The value display container
 *
 * @cssprop [--lith-slider-height=4px] - The height of the slider track
 * @cssprop [--lith-slider-thumb-size=20px] - The size of the slider thumb
 * @cssprop [--lith-slider-label-gap=8px] - The gap between slider and label
 * @cssprop [--lith-slider-hover-scale=1.1] - Scale factor on hover
 * @cssprop [--lith-slider-active-scale=1.2] - Scale factor when active
 * @cssprop [--lith-slider-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-slider-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-slider-transition-duration=200ms] - Transition duration
 */
@customElement('lith-slider')
export class LithSlider extends LitElement {
  static formAssociated = true;

  static override styles = css`
    :host {
      display: block;
      width: 100%;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.6;
    }

    :host([readonly]) {
      cursor: default;
    }

    .base {
      display: flex;
      flex-direction: column;
      gap: var(--lith-slider-label-gap, 8px);
    }

    .base.horizontal {
      flex-direction: row;
      align-items: center;
    }

    .base.vertical {
      height: 200px;
    }

    .input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
      margin: 0;
    }

    .slider-container {
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      flex: 1;
    }

    .track {
      position: relative;
      width: 100%;
      height: var(--lith-slider-height, 4px);
      border-radius: calc(var(--lith-slider-height, 4px) / 2);
      overflow: hidden;
    }

    .base.vertical .track {
      width: var(--lith-slider-height, 4px);
      height: 100%;
    }

    .track-inactive {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }

    .track-active {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: inherit;
      transition: width var(--lith-slider-transition-duration, 200ms) ease;
    }

    .base.vertical .track-active {
      width: 100%;
      bottom: 0;
      top: auto;
      transition: height var(--lith-slider-transition-duration, 200ms) ease;
    }

    .thumb {
      position: absolute;
      top: 50%;
      width: var(--lith-slider-thumb-size, 20px);
      height: var(--lith-slider-thumb-size, 20px);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      transition: transform var(--lith-slider-transition-duration, 200ms) ease;
    }

    .base.vertical .thumb {
      left: 50%;
      top: auto;
      transform: translate(-50%, 50%);
    }

    .thumb:hover {
      transform: translate(-50%, -50%) scale(var(--lith-slider-hover-scale, 1.1));
    }

    .base.vertical .thumb:hover {
      transform: translate(-50%, 50%) scale(var(--lith-slider-hover-scale, 1.1));
    }

    .thumb:active,
    .thumb.dragging {
      transform: translate(-50%, -50%) scale(var(--lith-slider-active-scale, 1.2));
      cursor: grabbing;
    }

    .base.vertical .thumb:active,
    .base.vertical .thumb.dragging {
      transform: translate(-50%, 50%) scale(var(--lith-slider-active-scale, 1.2));
    }

    :host(:focus-within) .thumb {
      outline: var(--lith-slider-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-slider-focus-ring-offset, 2px);
    }

    .label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .value-display {
      font-weight: 500;
      min-width: 3ch;
      text-align: right;
    }

    .ticks {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 0.875em;
      opacity: 0.7;
    }

    .base.vertical .ticks {
      top: 0;
      left: 100%;
      right: auto;
      bottom: 0;
      flex-direction: column-reverse;
      margin-top: 0;
      margin-left: 8px;
      width: auto;
    }

    .tick {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ::slotted(*) {
      margin: 0;
    }
  `;

  private _internals: ElementInternals;
  private _defaultValue: number = 0;
  private _isDragging: boolean = false;

  @property({ type: Number })
  get value(): number {
    return Math.max(this.min, Math.min(this.max, this._value));
  }
  set value(newValue: number) {
    const clampedValue = Math.max(this.min, Math.min(this.max, newValue));
    const oldValue = this._value;
    this._value = clampedValue;
    this.requestUpdate('value', oldValue);
  }
  private _value: number = 0;

  @property({ type: Number })
  min: number = 0;

  @property({ type: Number })
  max: number = 100;

  @property({ type: Number })
  step: number = 1;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, reflect: true })
  readonly: boolean = false;

  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: String })
  name: string = '';

  @property({ type: String })
  label: string = '';

  @property({ type: String, attribute: 'validation-message' })
  validationMessage: string = '';

  @property({ type: String })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  @property({ type: Boolean, attribute: 'show-value' })
  showValue: boolean = false;

  @property({ type: Boolean, attribute: 'show-ticks' })
  showTicks: boolean = false;

  @property({ type: Number, attribute: 'tick-step' })
  tickStep?: number;

  @state()
  private _thumbPosition: number = 0;

  @query('.input')
  private _input!: HTMLInputElement;

  @query('.slider-container')
  private _sliderContainer!: HTMLElement;

  @query('.thumb')
  private _thumb!: HTMLElement;

  constructor() {
    super();
    this._internals = this.attachInternals();

    // Set role attribute directly
    this.setAttribute('role', 'slider');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._defaultValue = this._value;
    this._updateThumbPosition();
    this._updateFormValue();
    this._updateValidity();
  }

  override updated(changedProperties: PropertyValues): void {
    if (
      changedProperties.has('value') ||
      changedProperties.has('min') ||
      changedProperties.has('max')
    ) {
      this._updateThumbPosition();
      this._updateAriaValue();
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

    if (changedProperties.has('min') || changedProperties.has('max')) {
      try {
        this._internals.ariaValueMin = this.min.toString();
        this._internals.ariaValueMax = this.max.toString();
      } catch {
        // Fallback for testing environments
      }
    }

    if (changedProperties.has('validationMessage')) {
      this._updateValidity();
    }
  }

  override render() {
    const classes = {
      base: true,
      [this.orientation]: true,
    };

    const thumbClasses = {
      thumb: true,
      dragging: this._isDragging,
    };

    const activeTrackStyle =
      this.orientation === 'horizontal'
        ? `width: ${this._thumbPosition}%`
        : `height: ${this._thumbPosition}%`;

    const thumbStyle =
      this.orientation === 'horizontal'
        ? `left: ${this._thumbPosition}%`
        : `bottom: ${this._thumbPosition}%`;

    return html`
      <div part="base" class=${classMap(classes)}>
        <input
          type="range"
          part="input"
          class="input"
          .value=${live(this._value.toString())}
          min=${this.min}
          max=${this.max}
          step=${this.step}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          name=${ifDefined(this.name || undefined)}
          aria-hidden="true"
          tabindex="-1"
          @input=${this._handleInput}
          @change=${this._handleChange}
        />

        ${this.label || this.showValue
          ? html`
              <div part="label" class="label">
                <span><slot>${this.label}</slot></span>
                ${this.showValue
                  ? html` <span part="value-display" class="value-display">${this._value}</span> `
                  : ''}
              </div>
            `
          : ''}

        <div
          class="slider-container"
          @pointerdown=${this._handlePointerDown}
          @click=${this._handleTrackClick}
        >
          <div part="track" class="track">
            <div part="track-inactive" class="track-inactive"></div>
            <div part="track-active" class="track-active" style=${activeTrackStyle}></div>
          </div>
          <div
            part="thumb"
            class=${classMap(thumbClasses)}
            style=${thumbStyle}
            @pointerdown=${this._handleThumbPointerDown}
          >
            <slot name="thumb"></slot>
          </div>

          ${this.showTicks ? this._renderTicks() : ''}
        </div>
      </div>
    `;
  }

  private _renderTicks() {
    const tickStep = this.tickStep || this.step;
    const ticks = [];

    for (let value = this.min; value <= this.max; value += tickStep) {
      ticks.push(html`<div class="tick">${value}</div>`);
    }

    return html`<div class="ticks">${ticks}</div>`;
  }

  private _handleInput(event: Event): void {
    event.stopPropagation();
  }

  private _handleChange(event: Event): void {
    event.stopPropagation();
  }

  private _handleTrackClick(event: PointerEvent): void {
    if (this.disabled || this.readonly || this._isDragging) return;

    event.preventDefault();
    const rect = this._sliderContainer.getBoundingClientRect();
    const newValue = this._calculateValueFromEvent(event, rect);
    this._setValue(newValue);
    this._emitInputEvent();
    this._emitChangeEvent();
  }

  private _handleThumbPointerDown(event: PointerEvent): void {
    if (this.disabled || this.readonly) return;

    event.preventDefault();
    event.stopPropagation();
    this._startDragging(event);
  }

  private _handlePointerDown(event: PointerEvent): void {
    if (this.disabled || this.readonly) return;

    // Only start dragging if clicking on the thumb
    if (event.target === this._thumb || this._thumb.contains(event.target as Node)) {
      this._startDragging(event);
    }
  }

  private _startDragging(event: PointerEvent): void {
    this._isDragging = true;
    this._thumb.setPointerCapture(event.pointerId);

    document.addEventListener('pointermove', this._handlePointerMove);
    document.addEventListener('pointerup', this._handlePointerUp);

    this.requestUpdate();
  }

  private _handlePointerMove = (event: PointerEvent): void => {
    if (!this._isDragging) return;

    const rect = this._sliderContainer.getBoundingClientRect();
    const newValue = this._calculateValueFromEvent(event, rect);
    this._setValue(newValue);
    this._emitInputEvent();
  };

  private _handlePointerUp = (event: PointerEvent): void => {
    if (!this._isDragging) return;

    this._isDragging = false;
    this._thumb.releasePointerCapture(event.pointerId);

    document.removeEventListener('pointermove', this._handlePointerMove);
    document.removeEventListener('pointerup', this._handlePointerUp);

    this._emitChangeEvent();
    this.requestUpdate();
  };

  private _calculateValueFromEvent(event: PointerEvent, rect: DOMRect): number {
    let percentage: number;

    if (this.orientation === 'horizontal') {
      percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    } else {
      percentage = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height));
    }

    const rawValue = this.min + percentage * (this.max - this.min);
    return this._snapToStep(rawValue);
  }

  private _snapToStep(value: number): number {
    const steps = Math.round((value - this.min) / this.step);
    return Math.max(this.min, Math.min(this.max, this.min + steps * this.step));
  }

  private _setValue(newValue: number): void {
    const clampedValue = Math.max(this.min, Math.min(this.max, newValue));
    if (clampedValue !== this._value) {
      this.value = clampedValue;
    }
  }

  private _updateThumbPosition(): void {
    const range = this.max - this.min;
    this._thumbPosition = range > 0 ? ((this._value - this.min) / range) * 100 : 0;
  }

  private _updateAriaValue(): void {
    try {
      this._internals.ariaValueNow = this._value.toString();
      this._internals.ariaValueText = this._value.toString();
    } catch {
      // Fallback for testing environments
    }
  }

  private _updateFormValue(): void {
    // Check if setFormValue is available (not in JSDOM)
    if (typeof this._internals.setFormValue === 'function') {
      this._internals.setFormValue(this._value.toString());
    }
  }

  private _updateValidity(): void {
    // Check if setValidity is available (not in JSDOM)
    if (typeof this._internals.setValidity === 'function') {
      if (this.required && this._value === this.min) {
        const message = this.validationMessage || 'Please select a value.';
        this._internals.setValidity({ valueMissing: true }, message);
      } else if (this._value < this.min || this._value > this.max) {
        const message =
          this.validationMessage || `Value must be between ${this.min} and ${this.max}.`;
        this._internals.setValidity(
          { rangeUnderflow: this._value < this.min, rangeOverflow: this._value > this.max },
          message
        );
      } else {
        this._internals.setValidity({});
      }
    }
  }

  private _emitChangeEvent(): void {
    const detail: SliderChangeDetail = {
      value: this._value,
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
    const detail: SliderInputDetail = {
      value: this._value,
    };
    this.dispatchEvent(
      new CustomEvent('lith-input', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) return;

    let handled = false;
    let newValue = this._value;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(this.min, this._value - this.step);
        handled = true;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(this.max, this._value + this.step);
        handled = true;
        break;
      case 'Home':
        newValue = this.min;
        handled = true;
        break;
      case 'End':
        newValue = this.max;
        handled = true;
        break;
      case 'PageDown':
        newValue = Math.max(this.min, this._value - this.step * 10);
        handled = true;
        break;
      case 'PageUp':
        newValue = Math.min(this.max, this._value + this.step * 10);
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      this._setValue(newValue);
      this._emitInputEvent();
      this._emitChangeEvent();
    }
  }

  private _handleFocus(): void {
    this.dispatchEvent(new FocusEvent('lith-focus', { bubbles: true, composed: true }));
  }

  private _handleBlur(): void {
    this.dispatchEvent(new FocusEvent('lith-blur', { bubbles: true, composed: true }));
  }

  /**
   * Checks the validity of the slider
   */
  checkValidity(): boolean {
    if (typeof this._internals.checkValidity === 'function') {
      return this._internals.checkValidity();
    }
    return true;
  }

  /**
   * Reports the validity of the slider
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
   * Focuses the slider
   */
  override focus(): void {
    this._input?.focus();
    super.focus();
  }

  /**
   * Removes focus from the slider
   */
  override blur(): void {
    this._input?.blur();
    super.blur();
  }

  /**
   * Form-associated lifecycle: called when the form is reset
   */
  formResetCallback(): void {
    this._value = this._defaultValue;
    this.requestUpdate();
  }

  /**
   * Form-associated lifecycle: called when the element's form state is restored
   */
  formStateRestoreCallback(state: string): void {
    this._value = parseFloat(state) || this._defaultValue;
    this.requestUpdate();
  }

  override firstUpdated(): void {
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('focus', this._handleFocus);
    this.addEventListener('blur', this._handleBlur);

    // Set tabindex for keyboard navigation
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }

    // Initialize ARIA attributes
    try {
      this._internals.ariaValueMin = this.min.toString();
      this._internals.ariaValueMax = this.max.toString();
      this._internals.ariaValueNow = this._value.toString();
      this._internals.ariaOrientation = this.orientation;
    } catch {
      // Fallback for testing environments
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('focus', this._handleFocus);
    this.removeEventListener('blur', this._handleBlur);

    // Clean up any remaining event listeners
    document.removeEventListener('pointermove', this._handlePointerMove);
    document.removeEventListener('pointerup', this._handlePointerUp);
  }
}
