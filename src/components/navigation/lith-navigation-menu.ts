import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../feedback/lith-popover.js';
import type { PopoverPlacement } from '../feedback/lith-popover.js';

/**
 * Navigation menu item interface
 */
export interface NavigationMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  href?: string;
  target?: string;
  icon?: string;
  badge?: string;
  children?: NavigationMenuItem[];
}

/**
 * Navigation menu selection event detail
 */
export interface NavigationMenuSelectDetail {
  item: NavigationMenuItem;
  originalEvent: MouseEvent | KeyboardEvent;
}

/**
 * A headless navigation menu component built on top of lith-popover.
 * Provides complete interaction logic for hierarchical navigation menus without any predefined styles.
 *
 * @element lith-navigation-menu
 *
 * @fires {CustomEvent<NavigationMenuSelectDetail>} lith-navigation-menu-select - Fired when a menu item is selected
 * @fires {CustomEvent} lith-navigation-menu-open - Fired when a submenu opens
 * @fires {CustomEvent} lith-navigation-menu-close - Fired when a submenu closes
 *
 * @slot trigger - The trigger element (usually a nav item or button)
 * @slot - The fallback content when no items are provided
 *
 * @csspart base - The component's root element
 * @csspart trigger - The trigger container
 * @csspart popover - The popover container
 * @csspart menu - The menu container
 * @csspart item - Menu item elements
 * @csspart item-content - Menu item content container
 * @csspart item-icon - Menu item icon container
 * @csspart item-label - Menu item label
 * @csspart item-badge - Menu item badge
 * @csspart item-arrow - Menu item expand arrow for submenus
 * @csspart submenu - Submenu containers
 *
 * @cssprop [--lith-navigation-menu-min-width=200px] - Minimum width of the menu
 * @cssprop [--lith-navigation-menu-max-width=400px] - Maximum width of the menu
 * @cssprop [--lith-navigation-menu-max-height=500px] - Maximum height of the menu
 * @cssprop [--lith-navigation-menu-item-height=40px] - Height of menu items
 * @cssprop [--lith-navigation-menu-item-padding=12px 16px] - Padding for menu items
 * @cssprop [--lith-navigation-menu-z-index=1000] - Z-index for the menu
 * @cssprop [--lith-navigation-menu-submenu-offset=8px] - Offset for submenus
 */
@customElement('lith-navigation-menu')
export class LithNavigationMenu extends LitElement {
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
      min-width: var(--lith-navigation-menu-min-width, 200px);
      max-width: var(--lith-navigation-menu-max-width, 400px);
      max-height: var(--lith-navigation-menu-max-height, 500px);
      padding: 8px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .menu-item {
      display: flex;
      align-items: center;
      min-height: var(--lith-navigation-menu-item-height, 40px);
      padding: var(--lith-navigation-menu-item-padding, 12px 16px);
      cursor: pointer;
      user-select: none;
      transition: background-color 150ms ease;
      border-radius: 6px;
      margin: 2px 0;
      text-decoration: none;
      color: inherit;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      width: 100%;
      position: relative;
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

    .menu-item.has-submenu {
      padding-right: 36px;
    }

    .item-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
    }

    .item-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
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
      right: 12px;
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

    .submenu-container {
      position: relative;
    }

    .submenu {
      position: absolute;
      left: 100%;
      top: var(--lith-navigation-menu-submenu-offset, 8px);
      min-width: var(--lith-navigation-menu-min-width, 200px);
      max-width: var(--lith-navigation-menu-max-width, 400px);
      max-height: var(--lith-navigation-menu-max-height, 500px);
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 8px;
      z-index: calc(var(--lith-navigation-menu-z-index, 1000) + 1);
      opacity: 0;
      visibility: hidden;
      transform: translateX(-8px);
      transition:
        opacity 150ms ease,
        visibility 150ms ease,
        transform 150ms ease;
    }

    .submenu.open {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }
  `;

  /**
   * Array of navigation menu items to display
   */
  @property({ type: Array })
  items: NavigationMenuItem[] = [];

  /**
   * Whether the navigation menu is open
   */
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  /**
   * Placement of the navigation menu relative to the trigger
   */
  @property({ type: String })
  placement: PopoverPlacement = 'bottom-start';

  /**
   * Whether to close the menu when a leaf item is selected
   */
  @property({ type: Boolean, attribute: 'close-on-select' })
  closeOnSelect: boolean = true;

  /**
   * Whether the trigger is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  /**
   * Hover delay for opening submenus (in milliseconds)
   */
  @property({ type: Number, attribute: 'hover-delay' })
  hoverDelay: number = 300;

  @state()
  private _highlightedIndex: number = -1;

  @state()
  private _openSubmenus: Set<string> = new Set();

  @query('slot[name="trigger"]')
  private _triggerSlot!: HTMLSlotElement;

  private _hoverTimeout: number = 0;
  private _submenuTimeouts: Map<string, number> = new Map();

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('mouseleave', this._handleMouseLeave);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('mouseleave', this._handleMouseLeave);
    this._clearAllTimeouts();
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
          style="--lith-popover-z-index: var(--lith-navigation-menu-z-index, 1000);"
          @lith-popover-open=${this._handlePopoverOpen}
          @lith-popover-close=${this._handlePopoverClose}
        >
          <div slot="trigger" part="trigger" class="trigger">
            <slot name="trigger"></slot>
          </div>

          <div part="menu" class="menu" role="menubar">
            ${this.items.length > 0
              ? this.items.map((item, index) => this._renderMenuItem(item, index))
              : html`<slot></slot>`}
          </div>
        </lith-popover>
      </div>
    `;
  }

  private _renderMenuItem(item: NavigationMenuItem, index: number, level: number = 0): unknown {
    const classes = {
      'menu-item': true,
      disabled: item.disabled || false,
      highlighted: index === this._highlightedIndex && level === 0,
      'has-submenu': !!(item.children && item.children.length > 0),
    };

    const isLink = item.href && !item.disabled;
    const hasSubmenu = !!(item.children && item.children.length > 0);

    // Use separate templates for button and link elements
    if (isLink && !hasSubmenu) {
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
          @mouseenter=${() => this._handleItemMouseEnter(item, index, level)}
        >
          ${this._renderItemContent(item, hasSubmenu)}
        </a>
      `;
    } else {
      return html`
        <div class="submenu-container">
          <button
            part="item"
            class=${classMap(classes)}
            role="menuitem"
            tabindex="-1"
            data-index=${index}
            data-item-id=${item.id}
            type="button"
            ?disabled=${item.disabled || false}
            @click=${(e: MouseEvent) => this._handleItemClick(item, e)}
            @mouseenter=${() => this._handleItemMouseEnter(item, index, level)}
          >
            ${this._renderItemContent(item, hasSubmenu)}
          </button>
          ${hasSubmenu ? this._renderSubmenu(item) : ''}
        </div>
      `;
    }
  }

  private _renderItemContent(item: NavigationMenuItem, hasSubmenu: boolean): unknown {
    return html`
      <div part="item-content" class="item-content">
        ${item.icon ? html` <div part="item-icon" class="item-icon">${item.icon}</div> ` : ''}
        <div part="item-label" class="item-label">${item.label}</div>
        ${item.badge ? html` <div part="item-badge" class="item-badge">${item.badge}</div> ` : ''}
      </div>
      ${hasSubmenu ? html` <div part="item-arrow" class="item-arrow">▶</div> ` : ''}
    `;
  }

  private _renderSubmenu(parentItem: NavigationMenuItem): unknown {
    if (!parentItem.children || parentItem.children.length === 0) {
      return '';
    }

    const isOpen = this._openSubmenus.has(parentItem.id);
    const submenuClasses = {
      submenu: true,
      open: isOpen,
    };

    return html`
      <div part="submenu" class=${classMap(submenuClasses)} role="menu">
        ${parentItem.children.map((child, index) => this._renderMenuItem(child, index, 1))}
      </div>
    `;
  }

  private _handleItemClick(item: NavigationMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // If item has children, toggle submenu
    if (item.children && item.children.length > 0) {
      event.preventDefault();
      this._toggleSubmenu(item.id);
      return;
    }

    // For leaf items, emit select event
    this.dispatchEvent(
      new CustomEvent('lith-navigation-menu-select', {
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

  private _handleItemMouseEnter(item: NavigationMenuItem, index: number, level: number): void {
    if (item.disabled) return;

    // Update highlight for root level items
    if (level === 0) {
      this._highlightedIndex = index;
      this.requestUpdate();
    }

    // Handle submenu opening with delay
    if (item.children && item.children.length > 0) {
      this._clearSubmenuTimeout(item.id);

      this._submenuTimeouts.set(
        item.id,
        window.setTimeout(() => {
          this._openSubmenu(item.id);
        }, this.hoverDelay)
      );
    } else {
      // Close other submenus when hovering over leaf items
      this._closeAllSubmenus();
    }
  }

  private _handleMouseLeave = (): void => {
    this._clearAllTimeouts();
    // Don't close submenus immediately, let the user navigate
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.open || this.disabled) return;

    const enabledItems = this.items.filter((item) => !item.disabled);

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

      case 'ArrowRight':
        event.preventDefault();
        if (this._highlightedIndex >= 0) {
          const item = enabledItems[this._highlightedIndex];
          if (item?.children && item.children.length > 0) {
            this._openSubmenu(item.id);
          }
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this._closeAllSubmenus();
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

  private _openSubmenu(itemId: string): void {
    this._openSubmenus.add(itemId);
    this.requestUpdate();

    this.dispatchEvent(
      new CustomEvent('lith-navigation-menu-open', {
        detail: { itemId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _closeSubmenu(itemId: string): void {
    this._openSubmenus.delete(itemId);
    this.requestUpdate();
  }

  private _toggleSubmenu(itemId: string): void {
    if (this._openSubmenus.has(itemId)) {
      this._closeSubmenu(itemId);
    } else {
      this._openSubmenu(itemId);
    }
  }

  private _closeAllSubmenus(): void {
    this._openSubmenus.clear();
    this.requestUpdate();
  }

  private _clearSubmenuTimeout(itemId: string): void {
    const timeout = this._submenuTimeouts.get(itemId);
    if (timeout) {
      clearTimeout(timeout);
      this._submenuTimeouts.delete(itemId);
    }
  }

  private _clearAllTimeouts(): void {
    if (this._hoverTimeout) {
      clearTimeout(this._hoverTimeout);
      this._hoverTimeout = 0;
    }

    this._submenuTimeouts.forEach((timeout) => clearTimeout(timeout));
    this._submenuTimeouts.clear();
  }

  private _handlePopoverOpen = (): void => {
    // Handled by _onOpen
  };

  private _handlePopoverClose = (): void => {
    this.open = false;
  };

  private _onOpen(): void {
    this._highlightedIndex = -1;
    this._closeAllSubmenus();

    this.dispatchEvent(
      new CustomEvent('lith-navigation-menu-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onClose(): void {
    this._highlightedIndex = -1;
    this._closeAllSubmenus();
    this._clearAllTimeouts();

    this.dispatchEvent(
      new CustomEvent('lith-navigation-menu-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Opens the navigation menu
   */
  show(): void {
    if (!this.disabled) {
      this.open = true;
    }
  }

  /**
   * Closes the navigation menu
   */
  close(): void {
    this.open = false;
  }

  /**
   * Toggles the navigation menu
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
