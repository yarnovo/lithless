import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { LithRadio } from './lith-radio.js';

/**
 * Custom event detail for radio group change events
 */
export interface RadioGroupChangeDetail {
  value: string | null;
  previousValue: string | null;
}

/**
 * A headless radio group component that manages a collection of radio buttons
 * and provides keyboard navigation.
 *
 * @element lith-radio-group
 *
 * @fires {CustomEvent<RadioGroupChangeDetail>} lith-change - Fired when the selected value changes
 * @fires {FocusEvent} lith-focus - Fired when the radio group gains focus
 * @fires {FocusEvent} lith-blur - Fired when the radio group loses focus
 *
 * @slot - The radio buttons
 *
 * @csspart base - The component's root element
 * @csspart fieldset - The fieldset element
 * @csspart legend - The legend element (if label is provided)
 *
 * @cssprop [--lith-radio-group-gap=8px] - The gap between radio buttons
 * @cssprop [--lith-radio-group-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-radio-group-focus-ring-offset=2px] - Focus ring offset
 */
@customElement('lith-radio-group')
export class LithRadioGroup extends LitElement {
  static formAssociated = true;

  static override styles = css`
    :host {
      display: block;
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    .base {
      border: none;
      margin: 0;
      padding: 0;
      min-width: 0;
    }

    .base:focus-within {
      outline: var(--lith-radio-group-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-radio-group-focus-ring-offset, 2px);
    }

    .legend {
      padding: 0;
      margin: 0 0 8px 0;
      font-weight: bold;
    }

    .radio-container {
      display: flex;
      gap: var(--lith-radio-group-gap, 8px);
    }

    .radio-container.vertical {
      flex-direction: column;
    }

    .radio-container.horizontal {
      flex-direction: row;
      flex-wrap: wrap;
    }

    ::slotted(lith-radio) {
      display: block;
    }
  `;

  private _internals: ElementInternals;
  private _defaultValue: string | null = null;

  @property({ type: String, reflect: true })
  value: string | null = null;

  @property({ type: String })
  name: string = '';

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, reflect: true })
  readonly: boolean = false;

  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: String })
  label: string = '';

  @property({ type: String })
  orientation: 'horizontal' | 'vertical' = 'vertical';

  @property({ type: String, attribute: 'validation-message' })
  validationMessage: string = '';

  @queryAssignedElements({ selector: 'lith-radio' })
  private _radios!: LithRadio[];

  constructor() {
    super();
    this._internals = this.attachInternals();

    // Only set role if the environment supports it (not in JSDOM)
    try {
      this._internals.role = 'radiogroup';
    } catch {
      // Fallback for testing environments
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._defaultValue = this.value;
    this._updateFormValue();
    this._updateValidity();
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('value')) {
      this._updateRadios();
      this._updateFormValue();
      this._updateValidity();
      this._updateAriaActivedescendant();
    }

    if (changedProperties.has('disabled')) {
      try {
        this._internals.ariaDisabled = this.disabled ? 'true' : 'false';
      } catch {
        // Fallback for testing environments
      }
      this._updateRadioDisabledState();
    }

    if (changedProperties.has('readonly')) {
      this._updateRadioReadonlyState();
    }

    if (changedProperties.has('required')) {
      try {
        this._internals.ariaRequired = this.required ? 'true' : 'false';
      } catch {
        // Fallback for testing environments
      }
      this._updateValidity();
    }

    if (changedProperties.has('name')) {
      this._updateRadioNames();
    }

    if (changedProperties.has('orientation')) {
      try {
        this._internals.ariaOrientation = this.orientation;
      } catch {
        // Fallback for testing environments
      }
    }

    if (changedProperties.has('validationMessage')) {
      this._updateValidity();
    }
  }

  override render() {
    const containerClasses = {
      'radio-container': true,
      vertical: this.orientation === 'vertical',
      horizontal: this.orientation === 'horizontal',
    };

    return html`
      <fieldset part="base" class="base">
        ${this.label ? html`<legend part="legend" class="legend">${this.label}</legend>` : ''}
        <div class=${classMap(containerClasses)} role="presentation">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </fieldset>
    `;
  }

  private _handleSlotChange(): void {
    this._updateRadios();
    this._updateRadioNames();
    this._updateRadioDisabledState();
    this._updateRadioReadonlyState();
    this._setupRadioEventListeners();
    this._updateAriaActivedescendant();
  }

  private _updateRadios(): void {
    this._radios.forEach((radio) => {
      radio.checked = radio.value === this.value;
    });
  }

  private _updateRadioNames(): void {
    if (this.name) {
      this._radios.forEach((radio) => {
        radio.name = this.name;
      });
    }
  }

  private _updateRadioDisabledState(): void {
    this._radios.forEach((radio) => {
      if (this.disabled) {
        radio.disabled = true;
      }
    });
  }

  private _updateRadioReadonlyState(): void {
    this._radios.forEach((radio) => {
      radio.readonly = this.readonly;
    });
  }

  private _setupRadioEventListeners(): void {
    this._radios.forEach((radio) => {
      radio.addEventListener('lith-change', this._handleRadioChange as EventListener);
      radio.addEventListener('keydown', this._handleRadioKeyDown);
    });
  }

  private _handleRadioChange = (event: Event): void => {
    event.stopPropagation();
    const radio = event.target as LithRadio;
    if (radio.checked && radio.value !== this.value) {
      const previousValue = this.value;
      this.value = radio.value;
      this._emitChangeEvent(previousValue);
    }
  };

  private _handleRadioKeyDown = (event: KeyboardEvent): void => {
    const currentRadio = event.target as LithRadio;
    const currentIndex = this._radios.indexOf(currentRadio);
    let nextIndex = -1;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = this._getNextEnabledRadioIndex(currentIndex, 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = this._getNextEnabledRadioIndex(currentIndex, -1);
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = this._getFirstEnabledRadioIndex();
        break;
      case 'End':
        event.preventDefault();
        nextIndex = this._getLastEnabledRadioIndex();
        break;
    }

    if (nextIndex !== -1 && nextIndex !== currentIndex) {
      const nextRadio = this._radios[nextIndex];
      nextRadio.focus();
      const previousValue = this.value;
      this.value = nextRadio.value;
      this._emitChangeEvent(previousValue);
    }
  };

  private _getNextEnabledRadioIndex(currentIndex: number, direction: number): number {
    const length = this._radios.length;
    let nextIndex = currentIndex;

    for (let i = 0; i < length; i++) {
      nextIndex = (nextIndex + direction + length) % length;
      const radio = this._radios[nextIndex];
      if (!radio.disabled) {
        return nextIndex;
      }
    }

    return currentIndex;
  }

  private _getFirstEnabledRadioIndex(): number {
    return this._radios.findIndex((radio) => !radio.disabled);
  }

  private _getLastEnabledRadioIndex(): number {
    for (let i = this._radios.length - 1; i >= 0; i--) {
      if (!this._radios[i].disabled) {
        return i;
      }
    }
    return -1;
  }

  private _updateAriaActivedescendant(): void {
    try {
      const selectedRadio = this._radios.find((radio) => radio.value === this.value);
      // TypeScript doesn't recognize ariaActiveDescendant on ElementInternals yet
      const internals = this._internals as ElementInternals & {
        ariaActiveDescendant: string | null;
      };
      if (selectedRadio && selectedRadio.id) {
        internals.ariaActiveDescendant = selectedRadio.id;
      } else {
        internals.ariaActiveDescendant = null;
      }
    } catch {
      // Fallback for testing environments
    }
  }

  private _updateFormValue(): void {
    // Check if setFormValue is available (not in JSDOM)
    if (typeof this._internals.setFormValue === 'function') {
      if (this.value !== null) {
        this._internals.setFormValue(this.value);
      } else {
        this._internals.setFormValue(null);
      }
    }
  }

  private _updateValidity(): void {
    // Check if setValidity is available (not in JSDOM)
    if (typeof this._internals.setValidity === 'function') {
      if (this.required && this.value === null) {
        const message = this.validationMessage || 'Please select an option.';
        this._internals.setValidity({ valueMissing: true }, message);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  private _emitChangeEvent(previousValue: string | null): void {
    const detail: RadioGroupChangeDetail = {
      value: this.value,
      previousValue,
    };
    this.dispatchEvent(
      new CustomEvent('lith-change', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Selects a radio button by value
   */
  selectValue(value: string): void {
    const radio = this._radios.find((r) => r.value === value);
    if (radio && !radio.disabled) {
      const previousValue = this.value;
      this.value = value;
      this._emitChangeEvent(previousValue);
    }
  }

  /**
   * Clears the selection
   */
  clearSelection(): void {
    const previousValue = this.value;
    this.value = null;
    this._emitChangeEvent(previousValue);
  }

  /**
   * Gets all radio button values
   */
  getRadioValues(): string[] {
    return this._radios.map((radio) => radio.value);
  }

  /**
   * Gets all enabled radio button values
   */
  getEnabledRadioValues(): string[] {
    return this._radios.filter((radio) => !radio.disabled).map((radio) => radio.value);
  }

  /**
   * Checks the validity of the radio group
   */
  checkValidity(): boolean {
    if (typeof this._internals.checkValidity === 'function') {
      return this._internals.checkValidity();
    }
    return true;
  }

  /**
   * Reports the validity of the radio group
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
   * Focuses the selected radio button or the first enabled radio button
   */
  override focus(): void {
    const selectedRadio = this._radios.find((radio) => radio.value === this.value);
    const targetRadio = selectedRadio || this._radios.find((radio) => !radio.disabled);

    if (targetRadio) {
      targetRadio.focus();
    } else {
      super.focus();
    }
  }

  /**
   * Form-associated lifecycle: called when the form is reset
   */
  formResetCallback(): void {
    this.value = this._defaultValue;
  }

  /**
   * Form-associated lifecycle: called when the element's form state is restored
   */
  formStateRestoreCallback(state: string): void {
    this.value = state;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._radios.forEach((radio) => {
      radio.removeEventListener('lith-change', this._handleRadioChange as EventListener);
      radio.removeEventListener('keydown', this._handleRadioKeyDown);
    });
  }
}
