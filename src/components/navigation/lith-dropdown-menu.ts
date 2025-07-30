import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../feedback/lith-popover.js';
import type { PopoverPlacement } from '../feedback/lith-popover.js';

/**
 * Dropdown menu item interface
 */
export interface DropdownMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  separator?: boolean;
  icon?: string;
  shortcut?: string;
  href?: string;
  target?: string;
}

/**
 * Dropdown menu selection event detail
 */
export interface DropdownMenuSelectDetail {
  item: DropdownMenuItem;
  originalEvent: MouseEvent | KeyboardEvent;
}

/**
 * A headless dropdown menu component built on top of lith-popover.
 * Provides complete interaction logic for action menus without any predefined styles.
 *
 * @element lith-dropdown-menu
 *
 * @fires {CustomEvent<DropdownMenuSelectDetail>} lith-dropdown-menu-select - Fired when a menu item is selected
 * @fires {CustomEvent} lith-dropdown-menu-open - Fired when the dropdown menu opens
 * @fires {CustomEvent} lith-dropdown-menu-close - Fired when the dropdown menu closes
 *
 * @slot trigger - The trigger element (usually a button)
 * @slot - The fallback content when no items are provided
 *
 * @csspart base - The component's root element
 * @csspart trigger - The trigger button container
 * @csspart popover - The popover container
 * @csspart menu - The menu container
 * @csspart item - Menu item elements
 * @csspart item-content - Menu item content container
 * @csspart item-icon - Menu item icon container
 * @csspart item-label - Menu item label
 * @csspart item-shortcut - Menu item shortcut text
 * @csspart separator - Menu separator elements
 *
 * @cssprop [--lith-dropdown-menu-min-width=160px] - Minimum width of the menu
 * @cssprop [--lith-dropdown-menu-max-width=300px] - Maximum width of the menu
 * @cssprop [--lith-dropdown-menu-max-height=400px] - Maximum height of the menu
 * @cssprop [--lith-dropdown-menu-item-height=32px] - Height of menu items
 * @cssprop [--lith-dropdown-menu-item-padding=8px 12px] - Padding for menu items
 * @cssprop [--lith-dropdown-menu-separator-height=1px] - Height of separators
 * @cssprop [--lith-dropdown-menu-z-index=1000] - Z-index for the menu
 */
@customElement('lith-dropdown-menu')
export class LithDropdownMenu extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .base {
      display: contents;
    }

    .trigger {
      display: contents;
    }

    .menu {
      min-width: var(--lith-dropdown-menu-min-width, 160px);
      max-width: var(--lith-dropdown-menu-max-width, 300px);
      max-height: var(--lith-dropdown-menu-max-height, 400px);
      padding: 4px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .menu-item {
      display: flex;
      align-items: center;
      min-height: var(--lith-dropdown-menu-item-height, 32px);
      padding: var(--lith-dropdown-menu-item-padding, 8px 12px);
      cursor: pointer;
      user-select: none;
      transition: background-color 150ms ease;
      border-radius: 4px;
      margin: 1px 0;
      text-decoration: none;
      color: inherit;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      width: 100%;
    }

    .menu-item:hover:not(.disabled) {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .menu-item:focus {
      outline: none;
      background-color: rgba(0, 0, 0, 0.04);
    }

    .menu-item.disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    .menu-item.highlighted {
      background-color: rgba(0, 0, 0, 0.08);
    }

    .item-content {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }

    .item-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-label {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-shortcut {
      flex-shrink: 0;
      font-size: 0.85em;
      opacity: 0.7;
      margin-left: 16px;
    }

    .separator {
      height: var(--lith-dropdown-menu-separator-height, 1px);
      background-color: rgba(0, 0, 0, 0.1);
      margin: 4px 8px;
    }
  `;

  /**
   * Array of menu items to display
   */
  @property({ type: Array })
  items: DropdownMenuItem[] = [];

  /**
   * Whether the dropdown menu is open
   */
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  /**
   * Placement of the dropdown menu relative to the trigger
   */
  @property({ type: String })
  placement: PopoverPlacement = 'bottom-start';

  /**
   * Whether to close the menu when an item is selected
   */
  @property({ type: Boolean, attribute: 'close-on-select' })
  closeOnSelect: boolean = true;

  /**
   * Whether the trigger is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @state()
  private _highlightedIndex: number = -1;

  @query('slot[name="trigger"]')
  private _triggerSlot!: HTMLSlotElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('open')) {
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
        <lith-popover
          part="popover"
          .open=${this.open}
          .placement=${this.placement}
          trigger="click"
          shift
          flip
          close-on-outside-click
          close-on-escape
          style="--lith-popover-z-index: var(--lith-dropdown-menu-z-index, 1000);"
          @lith-popover-open=${this._handlePopoverOpen}
          @lith-popover-close=${this._handlePopoverClose}
        >
          <div slot="trigger" part="trigger" class="trigger">
            <slot name="trigger"></slot>
          </div>

          <div part="menu" class="menu" role="menu">
            ${this.items.length > 0
              ? this.items.map((item, index) => this._renderMenuItem(item, index))
              : html`<slot></slot>`}
          </div>
        </lith-popover>
      </div>
    `;
  }

  private _renderMenuItem(item: DropdownMenuItem, index: number) {
    if (item.separator) {
      return html`<div part="separator" class="separator"></div>`;
    }

    const classes = {
      'menu-item': true,
      disabled: item.disabled || false,
      highlighted: index === this._highlightedIndex,
    };

    const isLink = item.href && !item.disabled;

    // Use separate templates for button and link elements
    if (isLink) {
      return html`
        <a
          part="item"
          class=${classMap(classes)}
          role="menuitem"
          tabindex="-1"
          data-index=${index}
          data-item-id=${item.id}
          href=${item.href}
          target=${item.target || undefined}
          @click=${(e: MouseEvent) => this._handleItemClick(item, e)}
          @mouseenter=${() => this._setHighlightedIndex(index)}
        >
          <div part="item-content" class="item-content">
            ${item.icon ? html` <div part="item-icon" class="item-icon">${item.icon}</div> ` : ''}
            <div part="item-label" class="item-label">${item.label}</div>
            ${item.shortcut
              ? html` <div part="item-shortcut" class="item-shortcut">${item.shortcut}</div> `
              : ''}
          </div>
        </a>
      `;
    } else {
      return html`
        <button
          part="item"
          class=${classMap(classes)}
          role="menuitem"
          tabindex="-1"
          data-index=${index}
          data-item-id=${item.id}
          type="button"
          ?disabled=${item.disabled}
          @click=${(e: MouseEvent) => this._handleItemClick(item, e)}
          @mouseenter=${() => this._setHighlightedIndex(index)}
        >
          <div part="item-content" class="item-content">
            ${item.icon ? html` <div part="item-icon" class="item-icon">${item.icon}</div> ` : ''}
            <div part="item-label" class="item-label">${item.label}</div>
            ${item.shortcut
              ? html` <div part="item-shortcut" class="item-shortcut">${item.shortcut}</div> `
              : ''}
          </div>
        </button>
      `;
    }
  }

  private _handleItemClick(item: DropdownMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('lith-dropdown-menu-select', {
        detail: {
          item,
          originalEvent: event,
        },
        bubbles: true,
        composed: true,
      })
    );

    if (this.closeOnSelect) {
      this.close();
    }
  }

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.open || this.disabled) return;

    const enabledItems = this.items.filter((item) => !item.disabled && !item.separator);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this._highlightedIndex = Math.min(this._highlightedIndex + 1, enabledItems.length - 1);
        this._updateHighlight();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this._highlightedIndex = Math.max(this._highlightedIndex - 1, 0);
        this._updateHighlight();
        break;

      case 'Home':
        event.preventDefault();
        this._highlightedIndex = 0;
        this._updateHighlight();
        break;

      case 'End':
        event.preventDefault();
        this._highlightedIndex = enabledItems.length - 1;
        this._updateHighlight();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this._highlightedIndex >= 0) {
          const item = enabledItems[this._highlightedIndex];
          if (item) {
            this._handleItemClick(item, event as unknown as MouseEvent);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        this._focusTrigger();
        break;
    }
  };

  private _setHighlightedIndex(index: number): void {
    const item = this.items[index];
    if (!item.disabled && !item.separator) {
      // Convert absolute index to enabled items index
      this._highlightedIndex =
        this.items.filter((item, i) => i <= index && !item.disabled && !item.separator).length - 1;
      this._updateHighlight();
    }
  }

  private _updateHighlight(): void {
    const menuItems = this.shadowRoot?.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>;

    menuItems?.forEach((item, index) => {
      const isHighlighted = index === this._highlightedIndex;
      item.classList.toggle('highlighted', isHighlighted);

      if (isHighlighted) {
        item.scrollIntoView({ block: 'nearest' });
        item.focus();
      }
    });
  }

  private _focusTrigger(): void {
    const triggerElements = this._triggerSlot?.assignedElements();
    const focusableElement = triggerElements?.[0] as HTMLElement;
    focusableElement?.focus();
  }

  private _handlePopoverOpen = (): void => {
    // Handled by _onOpen
  };

  private _handlePopoverClose = (): void => {
    this.open = false;
  };

  private _onOpen(): void {
    this._highlightedIndex = -1;

    this.dispatchEvent(
      new CustomEvent('lith-dropdown-menu-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onClose(): void {
    this._highlightedIndex = -1;

    this.dispatchEvent(
      new CustomEvent('lith-dropdown-menu-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Opens the dropdown menu
   */
  show(): void {
    if (!this.disabled) {
      this.open = true;
    }
  }

  /**
   * Closes the dropdown menu
   */
  close(): void {
    this.open = false;
  }

  /**
   * Toggles the dropdown menu
   */
  toggle(): void {
    if (!this.disabled) {
      this.open = !this.open;
    }
  }

  /**
   * Focuses the trigger element
   */
  override focus(): void {
    this._focusTrigger();
  }
}
