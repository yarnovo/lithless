import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * Custom event detail for combobox change events
 */
export interface ComboboxChangeDetail {
  value: string;
  displayValue: string;
  selectedOption: HTMLElement | null;
}

/**
 * Custom event detail for combobox input events
 */
export interface ComboboxInputDetail {
  value: string;
  inputValue: string;
}

/**
 * Custom event detail for combobox filter events
 */
export interface ComboboxFilterDetail {
  query: string;
  filteredOptions: HTMLElement[];
}

/**
 * A headless combobox component that provides complete search and selection functionality
 * without any predefined styles.
 *
 * @element lith-combobox
 *
 * @fires {CustomEvent<ComboboxChangeDetail>} lith-change - Fired when the selected value changes
 * @fires {CustomEvent<ComboboxInputDetail>} lith-input - Fired when the user types in the input
 * @fires {CustomEvent<ComboboxFilterDetail>} lith-filter - Fired when options are filtered
 * @fires {FocusEvent} lith-focus - Fired when the combobox gains focus
 * @fires {FocusEvent} lith-blur - Fired when the combobox loses focus
 * @fires {CustomEvent} lith-open - Fired when the dropdown opens
 * @fires {CustomEvent} lith-close - Fired when the dropdown closes
 *
 * @slot - The combobox options (lith-option elements)
 * @slot trigger-icon - The icon to display in the input field
 *
 * @csspart base - The component's root element
 * @csspart input - The input field
 * @csspart icon - The dropdown icon container
 * @csspart listbox - The dropdown options container
 * @csspart option - Individual option elements
 *
 * @cssprop [--lith-combobox-input-padding=8px 12px] - Padding for the input field
 * @cssprop [--lith-combobox-input-gap=8px] - Gap between input and icon
 * @cssprop [--lith-combobox-listbox-max-height=300px] - Maximum height of the dropdown
 * @cssprop [--lith-combobox-listbox-offset=4px] - Offset between input and dropdown
 * @cssprop [--lith-combobox-option-padding=8px 12px] - Padding for options
 * @cssprop [--lith-combobox-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-combobox-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-combobox-transition-duration=200ms] - Transition duration
 */
@customElement('lith-combobox')
export class LithCombobox extends LitElement {
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

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--lith-combobox-input-gap, 8px);
    }

    .input {
      flex: 1;
      padding: var(--lith-combobox-input-padding, 8px 12px);
      min-height: 40px;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      outline: none;
      box-sizing: border-box;
    }

    .input::placeholder {
      opacity: 0.5;
    }

    :host(:focus-within) .input-container {
      outline: var(--lith-combobox-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-combobox-focus-ring-offset, 2px);
    }

    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform var(--lith-combobox-transition-duration, 200ms) ease;
    }

    :host([open]) .icon {
      transform: rotate(180deg);
    }

    .listbox {
      position: absolute;
      top: calc(100% + var(--lith-combobox-listbox-offset, 4px));
      left: 0;
      right: 0;
      max-height: var(--lith-combobox-listbox-max-height, 300px);
      overflow-y: auto;
      overflow-x: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition:
        opacity var(--lith-combobox-transition-duration, 200ms) ease,
        transform var(--lith-combobox-transition-duration, 200ms) ease,
        visibility var(--lith-combobox-transition-duration, 200ms) ease;
      z-index: 1000;
    }

    :host([open]) .listbox {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    ::slotted(lith-option) {
      display: block;
      padding: var(--lith-combobox-option-padding, 8px 12px);
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

    ::slotted(lith-option[hidden]) {
      display: none !important;
    }
  `;

  private _internals: ElementInternals;
  private _defaultValue: string = '';
  private _mutationObserver?: MutationObserver;
  private _allOptions: HTMLElement[] = [];

  @property({ type: String, reflect: true })
  value: string = '';

  @property({ type: String })
  inputValue: string = '';

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, reflect: true })
  readonly: boolean = false;

  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: String })
  name: string = '';

  @property({ type: String })
  placeholder: string = 'Type to search...';

  @property({ type: String, attribute: 'validation-message' })
  validationMessage: string = '';

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: Boolean })
  multiple: boolean = false;

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: Boolean, attribute: 'auto-complete' })
  autoComplete: boolean = true;

  @property({ type: Boolean, attribute: 'allow-custom' })
  allowCustom: boolean = false;

  @property({ type: String, attribute: 'filter-mode' })
  filterMode: 'contains' | 'starts-with' | 'custom' = 'contains';

  @state()
  private _selectedOption: HTMLElement | null = null;

  @state()
  private _highlightedIndex: number = -1;

  @state()
  private _filteredOptions: HTMLElement[] = [];

  @query('.input')
  private _input!: HTMLInputElement;

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

    // Add event listeners
    this.addEventListener('keydown', this._handleKeyDown);
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
      this._updateInputValue();
      this._updateFormValue();
      this._updateValidity();
    }

    if (changedProperties.has('inputValue')) {
      this._filterOptions();
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

    return html`
      <div part="base" class=${classMap(classes)}>
        <div class="input-container" part="input-container">
          <input
            type="text"
            part="input"
            class="input"
            .value=${this.inputValue}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            name=${ifDefined(this.name || undefined)}
            placeholder=${this.placeholder}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded=${this.open ? 'true' : 'false'}
            aria-controls="listbox"
            aria-autocomplete=${this.autoComplete ? 'list' : 'none'}
            autocomplete="off"
            @input=${this._handleInput}
            @focus=${this._handleInputFocus}
            @blur=${this._handleInputBlur}
            @click=${this._handleInputClick}
          />
          <div part="icon" class="icon" @click=${this._handleIconClick}>
            <slot name="trigger-icon">▼</slot>
          </div>
        </div>
        <div id="listbox" part="listbox" class="listbox" role="listbox" aria-label="Options">
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
    // Use setTimeout to ensure DOM is fully updated
    setTimeout(() => {
      this._getAllOptions();
      this._updateSelectedOption();
      this._updateOptionsAttributes();
      this._filterOptions();
    }, 0);
  }

  private _getAllOptions(): void {
    if (!this._slot) return;
    const nodes = this._slot.assignedNodes({ flatten: true });
    this._allOptions = nodes.filter(
      (node): node is HTMLElement =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName.toLowerCase() === 'lith-option'
    );
  }

  private _updateSelectedOption(): void {
    this._selectedOption =
      this._allOptions.find((option) => option.getAttribute('value') === this.value) || null;

    // Update selected attribute on options
    this._allOptions.forEach((option) => {
      const isSelected = option.getAttribute('value') === this.value;
      option.toggleAttribute('selected', isSelected);
    });
  }

  private _updateInputValue(): void {
    if (this._selectedOption && this.autoComplete) {
      this.inputValue = this._selectedOption.textContent?.trim() || '';
    }
  }

  private _updateOptionsAttributes(): void {
    this._allOptions.forEach((option, index) => {
      option.setAttribute('role', 'option');
      option.setAttribute('tabindex', '-1');
      option.id = option.id || `option-${index}`;
    });
  }

  private _filterOptions(): void {
    if (!this.inputValue.trim()) {
      // Show all options when input is empty
      this._filteredOptions = [...this._allOptions];
    } else {
      this._filteredOptions = this._allOptions.filter((option) => {
        const text = option.textContent?.toLowerCase() || '';
        const query = this.inputValue.toLowerCase();

        switch (this.filterMode) {
          case 'starts-with':
            return text.startsWith(query);
          case 'contains':
            return text.includes(query);
          case 'custom':
            // Allow custom filtering via event
            return true; // Will be handled by the filter event
          default:
            return text.includes(query);
        }
      });
    }

    // Hide/show options based on filter
    this._allOptions.forEach((option) => {
      const isVisible = this._filteredOptions.includes(option);
      option.toggleAttribute('hidden', !isVisible);
    });

    // Reset highlight to first visible option
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1;
    this._updateHighlight();

    this._emitFilterEvent();
  }

  private _handleInput(event: InputEvent): void {
    if (this.readonly || this.disabled) return;

    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;

    // Open dropdown when typing
    if (!this.open && this.inputValue) {
      this.open = true;
    }

    this._emitInputEvent();
  }

  private _handleInputFocus(): void {
    this.dispatchEvent(new FocusEvent('lith-focus', { bubbles: true, composed: true }));
  }

  private _handleInputBlur(): void {
    // Delay blur to allow option clicks
    setTimeout(() => {
      if (!this.matches(':focus-within')) {
        this.open = false;
        this.dispatchEvent(new FocusEvent('lith-blur', { bubbles: true, composed: true }));
      }
    }, 150);
  }

  private _handleInputClick(): void {
    if (!this.disabled && !this.readonly) {
      this.open = true;
    }
  }

  private _handleIconClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled && !this.readonly) {
      this.open = !this.open;
      this._input?.focus();
    }
  }

  private _handleOptionClick = (event: CustomEvent): void => {
    if (this.disabled || this.readonly) return;

    const value = event.detail.value;
    this._selectOption(value);
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled || this.readonly) return;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (this.open && this._highlightedIndex >= 0) {
          const option = this._filteredOptions[this._highlightedIndex];
          if (option) {
            const value = option.getAttribute('value') || '';
            this._selectOption(value);
          }
        } else if (!this.open) {
          this.open = true;
        } else if (this.allowCustom && this.inputValue) {
          // Allow custom values
          this._selectCustomValue(this.inputValue);
        }
        break;

      case 'Escape':
        event.preventDefault();
        if (this.open) {
          this.open = false;
          this._input?.focus();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
        } else {
          this._highlightedIndex = Math.min(
            this._highlightedIndex + 1,
            this._filteredOptions.length - 1
          );
          this._updateHighlight();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
        } else {
          this._highlightedIndex = Math.max(this._highlightedIndex - 1, 0);
          this._updateHighlight();
        }
        break;

      case 'Home':
        if (this.open) {
          event.preventDefault();
          this._highlightedIndex = 0;
          this._updateHighlight();
        }
        break;

      case 'End':
        if (this.open) {
          event.preventDefault();
          this._highlightedIndex = this._filteredOptions.length - 1;
          this._updateHighlight();
        }
        break;

      case 'Tab':
        if (this.open) {
          this.open = false;
        }
        break;
    }
  };

  private _updateHighlight(): void {
    this._filteredOptions.forEach((option, index) => {
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
      // Update input value immediately for selected option
      if (this.autoComplete) {
        const selectedOption = this._allOptions.find((opt) => opt.getAttribute('value') === value);
        if (selectedOption) {
          this.inputValue = selectedOption.textContent?.trim() || '';
        }
      }
      this._emitInputEvent();
      this._emitChangeEvent();
    }
    this.open = false;
    this._input?.focus();
  }

  private _selectCustomValue(customValue: string): void {
    this.value = customValue;
    this.inputValue = customValue;
    this._emitInputEvent();
    this._emitChangeEvent();
    this.open = false;
  }

  private _updateFromOptions(): void {
    const selectedOption = this._allOptions.find((option) => option.hasAttribute('selected'));

    if (selectedOption) {
      const value = selectedOption.getAttribute('value') || '';
      if (this.value !== value) {
        this.value = value;
      }
    }
  }

  private _onOpen(): void {
    this._filterOptions();
    // Set initial highlight to selected option if exists
    const selectedIndex = this._filteredOptions.findIndex(
      (opt) => opt.getAttribute('value') === this.value
    );
    this._highlightedIndex =
      selectedIndex >= 0 ? selectedIndex : this._filteredOptions.length > 0 ? 0 : -1;
    this._updateHighlight();

    this.dispatchEvent(
      new CustomEvent('lith-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onClose(): void {
    this._highlightedIndex = -1;
    this._filteredOptions.forEach((option) => option.classList.remove('highlighted'));

    this.dispatchEvent(
      new CustomEvent('lith-close', {
        bubbles: true,
        composed: true,
      })
    );
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
        const message = this.validationMessage || 'Please select or enter an option.';
        this._internals.setValidity({ valueMissing: true }, message);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  private _emitChangeEvent(): void {
    const detail: ComboboxChangeDetail = {
      value: this.value,
      displayValue: this.inputValue,
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
    const detail: ComboboxInputDetail = {
      value: this.value,
      inputValue: this.inputValue,
    };
    this.dispatchEvent(
      new CustomEvent('lith-input', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _emitFilterEvent(): void {
    const detail: ComboboxFilterDetail = {
      query: this.inputValue,
      filteredOptions: this._filteredOptions,
    };
    this.dispatchEvent(
      new CustomEvent('lith-filter', {
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
   * Clears the input and selection
   */
  clear(): void {
    this.value = '';
    this.inputValue = '';
    this._emitInputEvent();
    this._emitChangeEvent();
  }

  /**
   * Filters options based on a custom function
   */
  filterOptions(filterFn: (option: HTMLElement, query: string) => boolean): void {
    this._filteredOptions = this._allOptions.filter((option) => filterFn(option, this.inputValue));

    // Hide/show options based on filter
    this._allOptions.forEach((option) => {
      const isVisible = this._filteredOptions.includes(option);
      option.toggleAttribute('hidden', !isVisible);
    });

    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1;
    this._updateHighlight();
    this._emitFilterEvent();
  }

  /**
   * Checks the validity of the combobox
   */
  checkValidity(): boolean {
    if (typeof this._internals.checkValidity === 'function') {
      return this._internals.checkValidity();
    }
    return true;
  }

  /**
   * Reports the validity of the combobox
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
   * Focuses the combobox
   */
  override focus(): void {
    this._input?.focus();
    super.focus();
  }

  /**
   * Removes focus from the combobox
   */
  override blur(): void {
    this._input?.blur();
    super.blur();
  }

  /**
   * Form-associated lifecycle: called when the form is reset
   */
  formResetCallback(): void {
    this.value = this._defaultValue;
    this.inputValue = '';
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

    // Initialize options after first render
    this._getAllOptions();
    this._updateOptionsAttributes();
    this._filterOptions();
  }
}
