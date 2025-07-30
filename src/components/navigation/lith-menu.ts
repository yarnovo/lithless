import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Custom event detail for menu item click events
 */
export interface MenuItemClickDetail {
  value: string;
  href?: string;
  target?: string;
  item: HTMLElement;
}

/**
 * A headless dropdown menu component that provides navigation functionality
 * with complete interaction logic without any predefined styles.
 *
 * @element lith-menu
 *
 * @fires {CustomEvent<MenuItemClickDetail>} lith-menu-item-click - Fired when a menu item is clicked
 * @fires {CustomEvent} lith-open - Fired when the menu opens
 * @fires {CustomEvent} lith-close - Fired when the menu closes
 * @fires {FocusEvent} lith-focus - Fired when the menu trigger gains focus
 * @fires {FocusEvent} lith-blur - Fired when the menu trigger loses focus
 *
 * @slot - The menu items (lith-menu-item elements)
 * @slot trigger - The trigger content (button content)
 * @slot trigger-icon - The icon to display in the trigger button
 *
 * @csspart base - The component's root element
 * @csspart trigger - The trigger button that opens the menu
 * @csspart content - The trigger content container
 * @csspart icon - The dropdown icon container
 * @csspart menu - The dropdown menu container
 * @csspart menu-items - The menu items container
 *
 * @cssprop [--lith-menu-trigger-padding=8px 12px] - Padding for the trigger button
 * @cssprop [--lith-menu-trigger-gap=8px] - Gap between content and icon
 * @cssprop [--lith-menu-max-height=300px] - Maximum height of the dropdown
 * @cssprop [--lith-menu-offset=4px] - Offset between trigger and dropdown
 * @cssprop [--lith-menu-item-padding=8px 12px] - Padding for menu items
 * @cssprop [--lith-menu-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-menu-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-menu-transition-duration=200ms] - Transition duration
 * @cssprop [--lith-menu-z-index=1000] - Z-index for the dropdown
 */
@customElement('lith-menu')
export class LithMenu extends LitElement {
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
      opacity: 0.5;
    }

    .base {
      position: relative;
      display: inline-block;
    }

    .trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--lith-menu-trigger-gap, 8px);
      padding: var(--lith-menu-trigger-padding, 8px 12px);
      cursor: pointer;
      user-select: none;
      position: relative;
      background: transparent;
      border: none;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      width: 100%;
    }

    :host(:focus-within) .trigger {
      outline: var(--lith-menu-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-menu-focus-ring-offset, 2px);
    }

    .content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--lith-menu-transition-duration, 200ms) ease;
    }

    :host([open]) .icon {
      transform: rotate(180deg);
    }

    .menu {
      position: absolute;
      top: calc(100% + var(--lith-menu-offset, 4px));
      left: 0;
      min-width: 100%;
      max-height: var(--lith-menu-max-height, 300px);
      overflow-y: auto;
      overflow-x: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition:
        opacity var(--lith-menu-transition-duration, 200ms) ease,
        transform var(--lith-menu-transition-duration, 200ms) ease,
        visibility var(--lith-menu-transition-duration, 200ms) ease;
      z-index: var(--lith-menu-z-index, 1000);
    }

    :host([open]) .menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .menu-items {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    ::slotted(lith-menu-item) {
      display: block;
      padding: var(--lith-menu-item-padding, 8px 12px);
      cursor: pointer;
      user-select: none;
      text-decoration: none;
      color: inherit;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      width: 100%;
    }

    ::slotted(lith-menu-item[disabled]) {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    ::slotted(lith-menu-item:focus) {
      outline: none;
    }
  `;

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: String })
  placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start';

  @property({ type: Boolean, attribute: 'close-on-select' })
  closeOnSelect: boolean = true;

  @state()
  private _highlightedIndex: number = -1;

  @query('.trigger')
  private _trigger!: HTMLButtonElement;

  @query('slot:not([name])')
  private _slot!: HTMLSlotElement;

  override connectedCallback(): void {
    super.connectedCallback();

    // Add keyboard event listeners
    this.addEventListener('keydown', this._handleKeyDown);

    // Add menu item click listener
    this.addEventListener('lith-menu-item-click', this._handleMenuItemClick as EventListener);

    // Add click outside listener
    document.addEventListener('click', this._handleClickOutside);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('lith-menu-item-click', this._handleMenuItemClick as EventListener);
    document.removeEventListener('click', this._handleClickOutside);
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('open')) {
      this._updateAriaExpanded();
      if (this.open) {
        this._onOpen();
      } else {
        this._onClose();
      }
    }

    if (changedProperties.has('disabled')) {
      this._updateAriaDisabled();
    }
  }

  override render() {
    const classes = {
      base: true,
    };

    return html`
      <div part="base" class=${classMap(classes)}>
        <button
          type="button"
          part="trigger"
          class="trigger"
          ?disabled=${this.disabled}
          aria-haspopup="true"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="menu"
          @click=${this._handleTriggerClick}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        >
          <span part="content" class="content">
            <slot name="trigger">Menu</slot>
          </span>
          <span part="icon" class="icon">
            <slot name="trigger-icon">▼</slot>
          </span>
        </button>
        <div id="menu" part="menu" class="menu" role="menu" aria-labelledby="trigger">
          <div part="menu-items" class="menu-items">
            <slot @slotchange=${this._handleSlotChange}></slot>
          </div>
        </div>
      </div>
    `;
  }

  private _handleSlotChange(): void {
    this._updateMenuItemsAttributes();
  }

  private _updateMenuItemsAttributes(): void {
    const items = this._getMenuItems();
    items.forEach((item, index) => {
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', '-1');
      item.id = item.id || `menu-item-${index}`;
    });
  }

  private _getMenuItems(): HTMLElement[] {
    if (!this._slot) return [];
    const nodes = this._slot.assignedNodes({ flatten: true });
    return nodes.filter(
      (node): node is HTMLElement =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName.toLowerCase() === 'lith-menu-item'
    );
  }

  private _handleTriggerClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.open = !this.open;
    }
  }

  private _handleMenuItemClick = (event: CustomEvent): void => {
    if (this.disabled) return;

    // 只处理来自菜单项的事件，避免无限循环
    const target = event.target as HTMLElement;
    if (!target || target.tagName.toLowerCase() !== 'lith-menu-item') {
      return;
    }

    // 阻止事件进一步冒泡，避免重复处理
    event.stopPropagation();

    // 重新派发事件，允许外部监听
    this.dispatchEvent(
      new CustomEvent('lith-menu-item-click', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );

    // 根据设置决定是否关闭菜单
    if (this.closeOnSelect) {
      this.open = false;
      this._trigger?.focus();
    }
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    const items = this._getMenuItems().filter((item) => !item.hasAttribute('disabled'));

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
        } else if (this._highlightedIndex >= 0) {
          const item = items[this._highlightedIndex];
          if (item) {
            // 直接触发菜单项点击事件，避免递归
            const menuItem = item as unknown as { value?: string; href?: string; target?: string };
            item.dispatchEvent(
              new CustomEvent('lith-menu-item-click', {
                detail: {
                  value: menuItem.value || '',
                  href: menuItem.href || '',
                  target: menuItem.target || '',
                  item: item,
                },
                bubbles: true,
                composed: true,
              })
            );
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
          this._highlightedIndex = Math.min(this._highlightedIndex + 1, items.length - 1);
          this._updateHighlight(items);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.open) {
          this.open = true;
        } else {
          this._highlightedIndex = Math.max(this._highlightedIndex - 1, 0);
          this._updateHighlight(items);
        }
        break;

      case 'Home':
        if (this.open) {
          event.preventDefault();
          this._highlightedIndex = 0;
          this._updateHighlight(items);
        }
        break;

      case 'End':
        if (this.open) {
          event.preventDefault();
          this._highlightedIndex = items.length - 1;
          this._updateHighlight(items);
        }
        break;
    }
  };

  private _updateHighlight(items: HTMLElement[]): void {
    items.forEach((item, index) => {
      item.classList.toggle('highlighted', index === this._highlightedIndex);
      if (index === this._highlightedIndex) {
        item.scrollIntoView({ block: 'nearest' });
        item.focus();
      }
    });
  }

  private _handleClickOutside = (event: MouseEvent): void => {
    if (!this.contains(event.target as Node)) {
      this.open = false;
    }
  };

  private _onOpen(): void {
    this._highlightedIndex = -1;

    this.dispatchEvent(
      new CustomEvent('lith-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onClose(): void {
    this._highlightedIndex = -1;
    const items = this._getMenuItems();
    items.forEach((item) => {
      item.classList.remove('highlighted');
      item.blur();
    });

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
    // ARIA 属性在渲染中已设置
  }

  private _updateAriaDisabled(): void {
    // 禁用状态通过 disabled 属性和样式处理
  }

  /**
   * Opens the menu
   */
  show(): void {
    if (!this.disabled) {
      this.open = true;
    }
  }

  /**
   * Closes the menu
   */
  hide(): void {
    this.open = false;
  }

  /**
   * Toggles the menu
   */
  toggle(): void {
    if (!this.disabled) {
      this.open = !this.open;
    }
  }

  /**
   * Focuses the menu trigger
   */
  override focus(): void {
    this._trigger?.focus();
    super.focus();
  }

  /**
   * Removes focus from the menu trigger
   */
  override blur(): void {
    this._trigger?.blur();
    super.blur();
  }

  override firstUpdated(): void {
    // Set tabindex for keyboard navigation
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }
}
