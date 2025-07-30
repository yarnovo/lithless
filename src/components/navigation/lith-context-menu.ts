import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../feedback/lith-popover.js';
import type { LithPopover } from '../feedback/lith-popover.js';

/**
 * Context menu item interface
 */
export interface ContextMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  separator?: boolean;
  icon?: string;
  shortcut?: string;
  submenu?: ContextMenuItem[];
}

/**
 * Context menu selection event detail
 */
export interface ContextMenuSelectDetail {
  item: ContextMenuItem;
  target: HTMLElement;
}

/**
 * A headless context menu component (right-click menu) built on top of lith-popover.
 * Provides complete interaction logic without any predefined styles.
 *
 * @element lith-context-menu
 *
 * @fires {CustomEvent<ContextMenuSelectDetail>} lith-context-menu-select - Fired when a menu item is selected
 * @fires {CustomEvent} lith-context-menu-open - Fired when the context menu opens
 * @fires {CustomEvent} lith-context-menu-close - Fired when the context menu closes
 *
 * @slot - The content that will trigger the context menu on right-click
 *
 * @csspart base - The component's root element
 * @csspart popover - The popover container
 * @csspart menu - The menu container
 * @csspart item - Menu item elements
 * @csspart item-content - Menu item content container
 * @csspart item-icon - Menu item icon container
 * @csspart item-label - Menu item label
 * @csspart item-shortcut - Menu item shortcut text
 * @csspart separator - Menu separator elements
 *
 * @cssprop [--lith-context-menu-min-width=180px] - Minimum width of the menu
 * @cssprop [--lith-context-menu-max-width=320px] - Maximum width of the menu
 * @cssprop [--lith-context-menu-max-height=400px] - Maximum height of the menu
 * @cssprop [--lith-context-menu-item-height=32px] - Height of menu items
 * @cssprop [--lith-context-menu-item-padding=8px 12px] - Padding for menu items
 * @cssprop [--lith-context-menu-separator-height=1px] - Height of separators
 * @cssprop [--lith-context-menu-z-index=2000] - Z-index for the menu
 */
@customElement('lith-context-menu')
export class LithContextMenu extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }

    .base {
      display: contents;
    }

    .trigger {
      display: contents;
    }

    .menu {
      min-width: var(--lith-context-menu-min-width, 180px);
      max-width: var(--lith-context-menu-max-width, 320px);
      max-height: var(--lith-context-menu-max-height, 400px);
      padding: 4px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .menu-item {
      display: flex;
      align-items: center;
      min-height: var(--lith-context-menu-item-height, 32px);
      padding: var(--lith-context-menu-item-padding, 8px 12px);
      cursor: pointer;
      user-select: none;
      transition: background-color 150ms ease;
      border-radius: 4px;
      margin: 1px 0;
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
      height: var(--lith-context-menu-separator-height, 1px);
      background-color: rgba(0, 0, 0, 0.1);
      margin: 4px 8px;
    }
  `;

  /**
   * Array of menu items to display
   */
  @property({ type: Array })
  items: ContextMenuItem[] = [];

  /**
   * Whether the context menu is open
   */
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  /**
   * Whether to prevent the default context menu from appearing
   */
  @property({ type: Boolean, attribute: 'prevent-default' })
  preventDefault: boolean = true;

  @state()
  private _currentMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  @state()
  private _highlightedIndex: number = -1;

  @query('lith-popover')
  private _popover!: LithPopover;

  @query('.trigger')
  private _triggerElement!: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('contextmenu', this._handleContextMenu);
    this.addEventListener('keydown', this._handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('contextmenu', this._handleContextMenu);
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
          trigger="manual"
          placement="bottom-start"
          shift
          flip
          close-on-outside-click
          close-on-escape
          style="--lith-popover-z-index: var(--lith-context-menu-z-index, 2000);"
          @lith-popover-open=${this._handlePopoverOpen}
          @lith-popover-close=${this._handlePopoverClose}
        >
          <div slot="trigger" class="trigger">
            <slot></slot>
          </div>

          <div part="menu" class="menu">
            ${this.items.map((item, index) => this._renderMenuItem(item, index))}
          </div>
        </lith-popover>
      </div>
    `;
  }

  private _renderMenuItem(item: ContextMenuItem, index: number) {
    if (item.separator) {
      return html`<div part="separator" class="separator"></div>`;
    }

    const classes = {
      'menu-item': true,
      disabled: item.disabled || false,
      highlighted: index === this._highlightedIndex,
    };

    return html`
      <div
        part="item"
        class=${classMap(classes)}
        role="menuitem"
        tabindex="-1"
        data-index=${index}
        data-item-id=${item.id}
        @click=${() => this._handleItemClick(item)}
        @mouseenter=${() => this._setHighlightedIndex(index)}
      >
        <div part="item-content" class="item-content">
          ${item.icon ? html` <div part="item-icon" class="item-icon">${item.icon}</div> ` : ''}
          <div part="item-label" class="item-label">${item.label}</div>
          ${item.shortcut
            ? html` <div part="item-shortcut" class="item-shortcut">${item.shortcut}</div> `
            : ''}
        </div>
      </div>
    `;
  }

  private _handleContextMenu = (event: MouseEvent): void => {
    if (this.preventDefault) {
      event.preventDefault();
    }

    // Store mouse position for positioning
    this._currentMousePosition = { x: event.clientX, y: event.clientY };

    // Position the popover at the mouse position
    this._positionAtMouse();

    // Open the menu
    this.open = true;
  };

  private _positionAtMouse(): void {
    if (this._popover && this._triggerElement) {
      // Create a temporary element at the mouse position
      const tempElement = document.createElement('div');
      tempElement.style.position = 'fixed';
      tempElement.style.left = `${this._currentMousePosition.x}px`;
      tempElement.style.top = `${this._currentMousePosition.y}px`;
      tempElement.style.width = '1px';
      tempElement.style.height = '1px';
      tempElement.style.pointerEvents = 'none';
      tempElement.style.visibility = 'hidden';

      document.body.appendChild(tempElement);

      // Update popover position manually
      this._popover['_position'] = {
        top: this._currentMousePosition.y,
        left: this._currentMousePosition.x,
        placement: 'bottom-start' as const,
      };

      // Clean up temp element
      setTimeout(() => {
        document.body.removeChild(tempElement);
      }, 0);
    }
  }

  private _handleItemClick(item: ContextMenuItem): void {
    if (item.disabled) return;

    this.dispatchEvent(
      new CustomEvent('lith-context-menu-select', {
        detail: {
          item,
          target: this._triggerElement,
        },
        bubbles: true,
        composed: true,
      })
    );

    this.close();
  }

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.open) return;

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
            this._handleItemClick(item);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  };

  private _setHighlightedIndex(index: number): void {
    const item = this.items[index];
    if (!item.disabled && !item.separator) {
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

  private _handlePopoverOpen = (): void => {
    // Handled by _onOpen
  };

  private _handlePopoverClose = (): void => {
    this.open = false;
  };

  private _onOpen(): void {
    this._highlightedIndex = -1;

    this.dispatchEvent(
      new CustomEvent('lith-context-menu-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onClose(): void {
    this._highlightedIndex = -1;

    this.dispatchEvent(
      new CustomEvent('lith-context-menu-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Opens the context menu at the current mouse position
   */
  show(): void {
    this.open = true;
  }

  /**
   * Closes the context menu
   */
  close(): void {
    this.open = false;
  }

  /**
   * Opens the context menu at a specific position
   */
  showAt(x: number, y: number): void {
    this._currentMousePosition = { x, y };
    this._positionAtMouse();
    this.open = true;
  }
}
