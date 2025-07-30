import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Custom event detail for select change events
 */
export interface SelectChangeDetail {
  value: string;
  selectedOption: HTMLElement | null;
}

/**
 * Custom event detail for select input events
 */
export interface SelectInputDetail {
  value: string;
}

/**
 * A headless select component that provides complete interaction logic
 * without any predefined styles.
 *
 * @element lith-select
 *
 * @fires {CustomEvent<SelectChangeDetail>} lith-change - Fired when the selected value changes
 * @fires {CustomEvent<SelectInputDetail>} lith-input - Fired when the user interacts with the select
 * @fires {FocusEvent} lith-focus - Fired when the select gains focus
 * @fires {FocusEvent} lith-blur - Fired when the select loses focus
 * @fires {CustomEvent} lith-open - Fired when the dropdown opens
 * @fires {CustomEvent} lith-close - Fired when the dropdown closes
 *
 * @slot - The select options (lith-option elements)
 * @slot placeholder - The placeholder content when no option is selected
 * @slot trigger-icon - The icon to display in the trigger button
 *
 * @csspart base - The component's root element
 * @csspart trigger - The trigger button that opens the dropdown
 * @csspart value - The displayed value container
 * @csspart icon - The dropdown icon container
 * @csspart listbox - The dropdown options container
 * @csspart option - Individual option elements
 *
 * @cssprop [--lith-select-trigger-padding=8px 12px] - Padding for the trigger button
 * @cssprop [--lith-select-trigger-gap=8px] - Gap between value and icon
 * @cssprop [--lith-select-listbox-max-height=300px] - Maximum height of the dropdown
 * @cssprop [--lith-select-listbox-offset=4px] - Offset between trigger and dropdown
 * @cssprop [--lith-select-option-padding=8px 12px] - Padding for options
 * @cssprop [--lith-select-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-select-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-select-transition-duration=200ms] - Transition duration
 */
@customElement('lith-select')
export class LithSelect extends LitElement {
  static formAssociated = true;

  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
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
      position: relative;
      display: inline-block;
      width: 100%;
    }

    .trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--lith-select-trigger-gap, 8px);
      padding: var(--lith-select-trigger-padding, 8px 12px);
      width: 100%;
      min-height: 40px;
      cursor: pointer;
      user-select: none;
      position: relative;
      background: transparent;
      border: none;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
    }

    :host(:focus-within) .trigger {
      outline: var(--lith-select-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-select-focus-ring-offset, 2px);
    }

    .value {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .value.placeholder {
      opacity: 0.5;
    }

    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--lith-select-transition-duration, 200ms) ease;
    }

    :host([open]) .icon {
      transform: rotate(180deg);
    }

    .listbox {
      position: absolute;
      top: calc(100% + var(--lith-select-listbox-offset, 4px));
      left: 0;
      right: 0;
      max-height: var(--lith-select-listbox-max-height, 300px);
      overflow-y: auto;
      overflow-x: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition:
        opacity var(--lith-select-transition-duration, 200ms) ease,
        transform var(--lith-select-transition-duration, 200ms) ease,
        visibility var(--lith-select-transition-duration, 200ms) ease;
      z-index: 1000;
    }

    :host([open]) .listbox {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    ::slotted(lith-option) {
      display: block;
      padding: var(--lith-select-option-padding, 8px 12px);
      cursor: pointer;
      user-select: none;
    }

    ::slotted(lith-option[selected]) {
      font-weight: 600;
    }

    ::slotted(lith-option[disabled]) {
      cursor: not-allowed;
      opacity: 0.5;
    }

    ::slotted(lith-option:focus) {
      outline: none;
    }
  `;

  private _internals: ElementInternals;
  private _defaultValue: string = '';
  private _mutationObserver?: MutationObserver;

  @property({ type: String, reflect: true })
  value: string = '';

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, reflect: true })
  readonly: boolean = false;

  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: String })
  name: string = '';

  @property({ type: String })
  placeholder: string = 'Select an option';

  @property({ type: String, attribute: 'validation-message' })
  validationMessage: string = '';

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: Boolean })
  multiple: boolean = false;

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  @state()
  private _selectedOption: HTMLElement | null = null;

  @state()
  private _highlightedIndex: number = -1;

  @query('.trigger')
  private _trigger!: HTMLButtonElement;

  @query('slot:not([name])')
  private _slot!: HTMLSlotElement;

  constructor() {
    super();
    this._internals = this.attachInternals();

    try {
      this._internals.role = 'combobox';
    } catch {
      // Fallback for testing environments
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._defaultValue = this.value;
    this._updateFormValue();
    this._updateValidity();
    this._setupMutationObserver();

    // Add keyboard event listeners
    this.addEventListener('keydown', this._handleKeyDown);

    // Add option click listener
    this.addEventListener('lith-option-click', this._handleOptionClick as EventListener);

    // Add click outside listener
    document.addEventListener('click', this._handleClickOutside);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mutationObserver?.disconnect();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('lith-option-click', this._handleOptionClick as EventListener);
    document.removeEventListener('click', this._handleClickOutside);
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('value')) {
      this._updateSelectedOption();
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

    if (changedProperties.has('open')) {
      this._updateAriaExpanded();
      if (this.open) {
        this._onOpen();
      } else {
        this._onClose();
      }
    }
  }

  override render() {
    const classes = {
      base: true,
    };

    const valueClasses = {
      value: true,
      placeholder: !this._selectedOption,
    };

    return html`
      <div part="base" class=${classMap(classes)}>
        <button
          type="button"
          part="trigger"
          class="trigger"
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          aria-haspopup="listbox"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="listbox"
          aria-labelledby="value"
          @click=${this._handleTriggerClick}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        >
          <span id="value" part="value" class=${classMap(valueClasses)}>
            ${this._selectedOption ? this._selectedOption.textContent : this.placeholder}
          </span>
          <span part="icon" class="icon">
            <slot name="trigger-icon">▼</slot>
          </span>
        </button>
        <div id="listbox" part="listbox" class="listbox" role="listbox" aria-labelledby="value">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private _setupMutationObserver(): void {
    this._mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'selected') {
          this._updateFromOptions();
        }
      }
    });

    this._mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['selected'],
    });
  }

  private _handleSlotChange(): void {
    this._updateSelectedOption();
    this._updateOptionsAttributes();
  }

  private _updateSelectedOption(): void {
    const options = this._getOptions();
    this._selectedOption =
      options.find((option) => option.getAttribute('value') === this.value) || null;

    // Update selected attribute on options
    options.forEach((option) => {
      const isSelected = option.getAttribute('value') === this.value;
      option.toggleAttribute('selected', isSelected);
    });
  }

  private _updateOptionsAttributes(): void {
    const options = this._getOptions();
    options.forEach((option, index) => {
      option.setAttribute('role', 'option');
      option.setAttribute('tabindex', '-1');
      option.id = option.id || `option-${index}`;
    });
  }

  private _getOptions(): HTMLElement[] {
    if (!this._slot) return [];
    const nodes = this._slot.assignedNodes({ flatten: true });
    return nodes.filter(
      (node): node is HTMLElement =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName.toLowerCase() === 'lith-option'
    );
  }

  private _handleTriggerClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled && !this.readonly) {
      this.open = !this.open;
    }
  }

  private _handleOptionClick = (event: CustomEvent): void => {
    if (this.disabled || this.readonly) return;

    const value = event.detail.value;
    this._selectOption(value);
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled || this.readonly) return;

    const options = this._getOptions().filter((opt) => !opt.hasAttribute('disabled'));

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
        } else if (this._highlightedIndex >= 0) {
          const option = options[this._highlightedIndex];
          if (option) {
            const value = option.getAttribute('value') || '';
            this._selectOption(value);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        if (this.open) {
          this.open = false;
          this._trigger?.focus();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
        } else {
          this._highlightedIndex = Math.min(this._highlightedIndex + 1, options.length - 1);
          this._updateHighlight(options);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
        } else {
          this._highlightedIndex = Math.max(this._highlightedIndex - 1, 0);
          this._updateHighlight(options);
        }
        break;

      case 'Home':
        if (this.open) {
          event.preventDefault();
          this._highlightedIndex = 0;
          this._updateHighlight(options);
        }
        break;

      case 'End':
        if (this.open) {
          event.preventDefault();
          this._highlightedIndex = options.length - 1;
          this._updateHighlight(options);
        }
        break;
    }
  };

  private _updateHighlight(options: HTMLElement[]): void {
    options.forEach((option, index) => {
      option.classList.toggle('highlighted', index === this._highlightedIndex);
      if (index === this._highlightedIndex) {
        option.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  private _handleClickOutside = (event: MouseEvent): void => {
    if (!this.contains(event.target as Node)) {
      this.open = false;
    }
  };

  private _selectOption(value: string): void {
    if (this.value !== value) {
      this.value = value;
      this._emitInputEvent();
      this._emitChangeEvent();
    }
    this.open = false;
    this._trigger?.focus();
  }

  private _updateFromOptions(): void {
    const options = this._getOptions();
    const selectedOption = options.find((option) => option.hasAttribute('selected'));

    if (selectedOption) {
      const value = selectedOption.getAttribute('value') || '';
      if (this.value !== value) {
        this.value = value;
      }
    }
  }

  private _onOpen(): void {
    const options = this._getOptions();
    const selectedIndex = options.findIndex((opt) => opt.getAttribute('value') === this.value);
    this._highlightedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    this._updateHighlight(options);

    this.dispatchEvent(
      new CustomEvent('lith-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onClose(): void {
    this._highlightedIndex = -1;
    const options = this._getOptions();
    options.forEach((option) => option.classList.remove('highlighted'));

    this.dispatchEvent(
      new CustomEvent('lith-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFocus(): void {
    this.dispatchEvent(new FocusEvent('lith-focus', { bubbles: true, composed: true }));
  }

  private _handleBlur(): void {
    this.dispatchEvent(new FocusEvent('lith-blur', { bubbles: true, composed: true }));
  }

  private _updateAriaExpanded(): void {
    try {
      this._internals.ariaExpanded = this.open ? 'true' : 'false';
    } catch {
      // Fallback for testing environments
    }
  }

  private _updateFormValue(): void {
    if (typeof this._internals.setFormValue === 'function') {
      if (this.value) {
        this._internals.setFormValue(this.value);
      } else {
        this._internals.setFormValue(null);
      }
    }
  }

  private _updateValidity(): void {
    if (typeof this._internals.setValidity === 'function') {
      if (this.required && !this.value) {
        const message = this.validationMessage || 'Please select an option.';
        this._internals.setValidity({ valueMissing: true }, message);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  private _emitChangeEvent(): void {
    const detail: SelectChangeDetail = {
      value: this.value,
      selectedOption: this._selectedOption,
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
    const detail: SelectInputDetail = {
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
   * Opens the dropdown
   */
  show(): void {
    if (!this.disabled && !this.readonly) {
      this.open = true;
    }
  }

  /**
   * Closes the dropdown
   */
  hide(): void {
    this.open = false;
  }

  /**
   * Toggles the dropdown
   */
  toggle(): void {
    if (!this.disabled && !this.readonly) {
      this.open = !this.open;
    }
  }

  /**
   * Checks the validity of the select
   */
  checkValidity(): boolean {
    if (typeof this._internals.checkValidity === 'function') {
      return this._internals.checkValidity();
    }
    return true;
  }

  /**
   * Reports the validity of the select
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
   * Focuses the select
   */
  override focus(): void {
    this._trigger?.focus();
    super.focus();
  }

  /**
   * Removes focus from the select
   */
  override blur(): void {
    this._trigger?.blur();
    super.blur();
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

  override firstUpdated(): void {
    // Set tabindex for keyboard navigation
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }
}
