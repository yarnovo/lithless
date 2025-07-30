import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../feedback/lith-popover.js';
import type { PopoverPlacement } from '../feedback/lith-popover.js';

/**
 * Menu bar item interface
 */
export interface MenuBarItem {
  id: string;
  label: string;
  disabled?: boolean;
  href?: string;
  target?: string;
  icon?: string;
  badge?: string;
  children?: MenuBarItem[];
}

/**
 * Menu bar selection event detail
 */
export interface MenuBarSelectDetail {
  item: MenuBarItem;
  originalEvent: MouseEvent | KeyboardEvent;
}

/**
 * A headless menu bar component that provides horizontal menu functionality.
 * Supports both simple menu items and dropdown menus with nested items.
 *
 * @element lith-menu-bar
 *
 * @fires {CustomEvent<MenuBarSelectDetail>} lith-menu-bar-select - Fired when a menu item is selected
 * @fires {CustomEvent} lith-menu-bar-open - Fired when a dropdown opens
 * @fires {CustomEvent} lith-menu-bar-close - Fired when a dropdown closes
 *
 * @slot - The fallback content when no items are provided
 *
 * @csspart base - The component's root element
 * @csspart menu-bar - The menu bar container
 * @csspart menu-item - Menu item elements
 * @csspart menu-item-content - Menu item content container
 * @csspart menu-item-icon - Menu item icon container
 * @csspart menu-item-label - Menu item label
 * @csspart menu-item-badge - Menu item badge
 * @csspart menu-item-arrow - Menu item dropdown arrow
 * @csspart dropdown - Dropdown menu containers
 * @csspart dropdown-item - Dropdown menu item elements
 *
 * @cssprop [--lith-menu-bar-height=48px] - Height of the menu bar
 * @cssprop [--lith-menu-bar-item-padding=12px 20px] - Padding for menu bar items
 * @cssprop [--lith-menu-bar-item-gap=4px] - Gap between menu bar items
 * @cssprop [--lith-menu-bar-dropdown-min-width=180px] - Minimum width of dropdowns
 * @cssprop [--lith-menu-bar-dropdown-max-width=300px] - Maximum width of dropdowns
 * @cssprop [--lith-menu-bar-dropdown-max-height=400px] - Maximum height of dropdowns
 * @cssprop [--lith-menu-bar-z-index=1000] - Z-index for dropdowns
 */
@customElement('lith-menu-bar')
export class LithMenuBar extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
    }

    .base {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .menu-bar {
      display: flex;
      align-items: center;
      min-height: var(--lith-menu-bar-height, 48px);
      gap: var(--lith-menu-bar-item-gap, 4px);
      width: 100%;
    }

    .menu-item {
      display: flex;
      align-items: center;
      min-height: var(--lith-menu-bar-height, 48px);
      padding: var(--lith-menu-bar-item-padding, 12px 20px);
      cursor: pointer;
      user-select: none;
      transition: background-color 150ms ease;
      border-radius: 4px;
      text-decoration: none;
      color: inherit;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      position: relative;
    }

    .menu-item:hover:not(.disabled):not(.open) {
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

    .menu-item.open {
      background-color: rgba(0, 0, 0, 0.08);
    }

    .menu-item.has-dropdown {
      padding-right: calc(var(--lith-menu-bar-item-padding, 12px 20px) + 20px);
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
      font-weight: 500;
    }

    .item-badge {
      flex-shrink: 0;
      font-size: 0.75em;
      background-color: rgba(0, 0, 0, 0.1);
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-arrow {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      flex-shrink: 0;
      width: 12px;
      height: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
    }

    .dropdown-container {
      position: relative;
      display: contents;
    }

    .dropdown {
      min-width: var(--lith-menu-bar-dropdown-min-width, 180px);
      max-width: var(--lith-menu-bar-dropdown-max-width, 300px);
      max-height: var(--lith-menu-bar-dropdown-max-height, 400px);
      padding: 8px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      min-height: 36px;
      padding: 8px 12px;
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

    .dropdown-item:hover:not(.disabled) {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .dropdown-item:focus {
      outline: none;
      background-color: rgba(0, 0, 0, 0.04);
    }

    .dropdown-item.disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    .separator {
      height: 1px;
      background-color: rgba(0, 0, 0, 0.1);
      margin: 4px 8px;
    }
  `;

  /**
   * Array of menu bar items to display
   */
  @property({ type: Array })
  items: MenuBarItem[] = [];

  /**
   * Whether the menu bar is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  /**
   * Whether to close dropdowns when an item is selected
   */
  @property({ type: Boolean, attribute: 'close-on-select' })
  closeOnSelect: boolean = true;

  /**
   * Placement of dropdown menus relative to menu items
   */
  @property({ type: String })
  dropdownPlacement: PopoverPlacement = 'bottom-start';

  @state()
  private _openDropdowns: Set<string> = new Set();

  @state()
  private _focusedIndex: number = -1;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('focusout', this._handleFocusOut);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('focusout', this._handleFocusOut);
  }

  override render() {
    const classes = {
      base: true,
    };

    return html`
      <div part="base" class=${classMap(classes)}>
        <div part="menu-bar" class="menu-bar" role="menubar">
          ${this.items.length > 0
            ? this.items.map((item, index) => this._renderMenuItem(item, index))
            : html`<slot></slot>`}
        </div>
      </div>
    `;
  }

  private _renderMenuItem(item: MenuBarItem, index: number): unknown {
    const hasDropdown = !!(item.children && item.children.length > 0);
    const isOpen = this._openDropdowns.has(item.id);
    const isFocused = index === this._focusedIndex;

    const classes = {
      'menu-item': true,
      disabled: item.disabled || false,
      open: isOpen,
      'has-dropdown': hasDropdown,
      focused: isFocused,
    };

    const isLink = item.href && !item.disabled && !hasDropdown;

    if (hasDropdown) {
      return html`
        <div class="dropdown-container">
          <button
            part="menu-item"
            class=${classMap(classes)}
            role="menuitem"
            tabindex=${isFocused ? '0' : '-1'}
            data-index=${index}
            data-item-id=${item.id}
            type="button"
            ?disabled=${item.disabled || false}
            @click=${(e: MouseEvent) => this._handleItemClick(item, e)}
            @mouseenter=${() => this._handleItemMouseEnter(item, index)}
            @focus=${() => this._handleItemFocus(index)}
          >
            ${this._renderItemContent(item, hasDropdown)}
          </button>
          ${this._renderDropdown(item, isOpen)}
        </div>
      `;
    } else if (isLink) {
      return html`
        <a
          part="menu-item"
          class=${classMap(classes)}
          role="menuitem"
          tabindex=${isFocused ? '0' : '-1'}
          data-index=${index}
          data-item-id=${item.id}
          href=${item.href}
          target=${item.target || undefined}
          @click=${(e: MouseEvent) => this._handleItemClick(item, e)}
          @mouseenter=${() => this._handleItemMouseEnter(item, index)}
          @focus=${() => this._handleItemFocus(index)}
        >
          ${this._renderItemContent(item, hasDropdown)}
        </a>
      `;
    } else {
      return html`
        <button
          part="menu-item"
          class=${classMap(classes)}
          role="menuitem"
          tabindex=${isFocused ? '0' : '-1'}
          data-index=${index}
          data-item-id=${item.id}
          type="button"
          ?disabled=${item.disabled || false}
          @click=${(e: MouseEvent) => this._handleItemClick(item, e)}
          @mouseenter=${() => this._handleItemMouseEnter(item, index)}
          @focus=${() => this._handleItemFocus(index)}
        >
          ${this._renderItemContent(item, hasDropdown)}
        </button>
      `;
    }
  }

  private _renderItemContent(item: MenuBarItem, hasDropdown: boolean): unknown {
    return html`
      <div part="menu-item-content" class="item-content">
        ${item.icon ? html` <div part="menu-item-icon" class="item-icon">${item.icon}</div> ` : ''}
        <div part="menu-item-label" class="item-label">${item.label}</div>
        ${item.badge
          ? html` <div part="menu-item-badge" class="item-badge">${item.badge}</div> `
          : ''}
      </div>
      ${hasDropdown ? html` <div part="menu-item-arrow" class="item-arrow">▼</div> ` : ''}
    `;
  }

  private _renderDropdown(parentItem: MenuBarItem, isOpen: boolean): unknown {
    if (!parentItem.children || parentItem.children.length === 0) {
      return '';
    }

    return html`
      <lith-popover
        part="dropdown"
        .open=${isOpen}
        .placement=${this.dropdownPlacement}
        trigger="manual"
        shift
        flip
        close-on-outside-click
        close-on-escape
        style="--lith-popover-z-index: var(--lith-menu-bar-z-index, 1000);"
        @lith-popover-close=${() => this._closeDropdown(parentItem.id)}
      >
        <div slot="trigger"></div>
        <div class="dropdown" role="menu">
          ${parentItem.children.map((child) => this._renderDropdownItem(child))}
        </div>
      </lith-popover>
    `;
  }

  private _renderDropdownItem(item: MenuBarItem): unknown {
    if (item.id === 'separator') {
      return html`<div class="separator"></div>`;
    }

    const classes = {
      'dropdown-item': true,
      disabled: item.disabled || false,
    };

    const isLink = item.href && !item.disabled;

    if (isLink) {
      return html`
        <a
          part="dropdown-item"
          class=${classMap(classes)}
          role="menuitem"
          tabindex="-1"
          data-item-id=${item.id}
          href=${item.href}
          target=${item.target || undefined}
          @click=${(e: MouseEvent) => this._handleDropdownItemClick(item, e)}
        >
          ${this._renderDropdownItemContent(item)}
        </a>
      `;
    } else {
      return html`
        <button
          part="dropdown-item"
          class=${classMap(classes)}
          role="menuitem"
          tabindex="-1"
          data-item-id=${item.id}
          type="button"
          ?disabled=${item.disabled || false}
          @click=${(e: MouseEvent) => this._handleDropdownItemClick(item, e)}
        >
          ${this._renderDropdownItemContent(item)}
        </button>
      `;
    }
  }

  private _renderDropdownItemContent(item: MenuBarItem): unknown {
    return html`
      <div class="item-content">
        ${item.icon ? html` <div class="item-icon">${item.icon}</div> ` : ''}
        <div class="item-label">${item.label}</div>
        ${item.badge ? html` <div class="item-badge">${item.badge}</div> ` : ''}
      </div>
    `;
  }

  private _handleItemClick(item: MenuBarItem, event: MouseEvent): void {
    if (item.disabled || this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // If item has children, toggle dropdown
    if (item.children && item.children.length > 0) {
      event.preventDefault();
      this._toggleDropdown(item.id);
      return;
    }

    // For leaf items, emit select event
    this.dispatchEvent(
      new CustomEvent('lith-menu-bar-select', {
        detail: {
          item,
          originalEvent: event,
        },
        bubbles: true,
        composed: true,
      })
    );

    if (this.closeOnSelect) {
      this._closeAllDropdowns();
    }
  }

  private _handleDropdownItemClick(item: MenuBarItem, event: MouseEvent): void {
    if (item.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('lith-menu-bar-select', {
        detail: {
          item,
          originalEvent: event,
        },
        bubbles: true,
        composed: true,
      })
    );

    if (this.closeOnSelect) {
      this._closeAllDropdowns();
    }
  }

  private _handleItemMouseEnter(item: MenuBarItem, index: number): void {
    if (item.disabled || this.disabled) return;

    this._focusedIndex = index;

    // If any dropdown is open and this item has dropdown, open it
    if (this._openDropdowns.size > 0 && item.children && item.children.length > 0) {
      this._closeAllDropdowns();
      this._openDropdown(item.id);
    }
  }

  private _handleItemFocus(index: number): void {
    this._focusedIndex = index;
  }

  private _handleFocusOut = (event: FocusEvent): void => {
    // Close dropdowns if focus moves outside the menu bar
    if (!this.contains(event.relatedTarget as Node)) {
      this._closeAllDropdowns();
      this._focusedIndex = -1;
    }
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    const enabledItems = this.items.filter((item) => !item.disabled);

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this._focusedIndex = Math.max(this._focusedIndex - 1, 0);
        this._updateFocus();
        break;

      case 'ArrowRight':
        event.preventDefault();
        this._focusedIndex = Math.min(this._focusedIndex + 1, enabledItems.length - 1);
        this._updateFocus();
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (this._focusedIndex >= 0) {
          const item = enabledItems[this._focusedIndex];
          if (item?.children && item.children.length > 0) {
            this._openDropdown(item.id);
          }
        }
        break;

      case 'Home':
        event.preventDefault();
        this._focusedIndex = 0;
        this._updateFocus();
        break;

      case 'End':
        event.preventDefault();
        this._focusedIndex = enabledItems.length - 1;
        this._updateFocus();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this._focusedIndex >= 0) {
          const item = enabledItems[this._focusedIndex];
          if (item) {
            this._handleItemClick(item, event as unknown as MouseEvent);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this._closeAllDropdowns();
        break;
    }
  };

  private _updateFocus(): void {
    const menuItems = this.shadowRoot?.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>;
    menuItems?.forEach((item, index) => {
      const isFocused = index === this._focusedIndex;
      item.tabIndex = isFocused ? 0 : -1;
      if (isFocused) {
        item.focus();
      }
    });
  }

  private _openDropdown(itemId: string): void {
    this._openDropdowns.add(itemId);
    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent('lith-menu-bar-open', {
        detail: { itemId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _closeDropdown(itemId: string): void {
    if (this._openDropdowns.has(itemId)) {
      this._openDropdowns.delete(itemId);
      this.requestUpdate();

      this.dispatchEvent(
        new CustomEvent('lith-menu-bar-close', {
          detail: { itemId },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _toggleDropdown(itemId: string): void {
    if (this._openDropdowns.has(itemId)) {
      this._closeDropdown(itemId);
    } else {
      // Close other dropdowns first
      this._closeAllDropdowns();
      this._openDropdown(itemId);
    }
  }

  private _closeAllDropdowns(): void {
    this._openDropdowns.clear();
    this.requestUpdate();
  }

  /**
   * Opens a dropdown menu by item ID
   */
  openDropdown(itemId: string): void {
    if (!this.disabled) {
      this._openDropdown(itemId);
    }
  }

  /**
   * Closes a dropdown menu by item ID
   */
  closeDropdown(itemId: string): void {
    this._closeDropdown(itemId);
  }

  /**
   * Closes all dropdown menus
   */
  closeAllDropdowns(): void {
    this._closeAllDropdowns();
  }

  /**
   * Focuses the menu bar
   */
  override focus(): void {
    if (this.items.length > 0) {
      this._focusedIndex = 0;
      this._updateFocus();
    }
  }
}
