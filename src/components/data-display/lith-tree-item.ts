import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Custom event detail for tree item toggle events
 */
export interface TreeItemToggleDetail {
  expanded: boolean;
  value: string;
  level: number;
}

/**
 * Custom event detail for tree item select events
 */
export interface TreeItemSelectDetail {
  selected: boolean;
  value: string;
  level: number;
  item: LithTreeItem;
}

/**
 * A headless tree item component that provides hierarchical data display
 * functionality with complete interaction logic without any predefined styles.
 *
 * @element lith-tree-item
 *
 * @fires {CustomEvent<TreeItemToggleDetail>} lith-toggle - Fired when the item is expanded/collapsed
 * @fires {CustomEvent<TreeItemSelectDetail>} lith-select - Fired when the item is selected
 * @fires {FocusEvent} lith-focus - Fired when the item gains focus
 * @fires {FocusEvent} lith-blur - Fired when the item loses focus
 *
 * @slot - The child tree items
 * @slot content - The item content
 * @slot expand-icon - The expand/collapse icon
 * @slot loading-icon - The loading icon when lazy loading
 *
 * @csspart base - The component's root element
 * @csspart content - The item content container
 * @csspart expand-button - The expand/collapse button
 * @csspart expand-icon - The expand/collapse icon container
 * @csspart label - The item label container
 * @csspart children - The children container
 *
 * @cssprop [--lith-tree-item-indent=16px] - Indentation per level
 * @cssprop [--lith-tree-item-padding=8px] - Padding for the item content
 * @cssprop [--lith-tree-item-gap=8px] - Gap between expand button and content
 * @cssprop [--lith-tree-item-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-tree-item-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-tree-item-transition-duration=200ms] - Transition duration
 */
@customElement('lith-tree-item')
export class LithTreeItem extends LitElement {
  static override styles = css`
    :host {
      display: block;
      outline: none;
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    :host([hidden]) {
      display: none !important;
    }

    .base {
      display: block;
    }

    .content {
      display: flex;
      align-items: center;
      gap: var(--lith-tree-item-gap, 8px);
      padding: var(--lith-tree-item-padding, 8px);
      padding-left: calc(
        var(--lith-tree-item-padding, 8px) + var(--lith-tree-item-indent, 16px) * var(--level, 0)
      );
      cursor: pointer;
      user-select: none;
      position: relative;
      transition: background-color var(--lith-tree-item-transition-duration, 200ms) ease;
    }

    :host(:focus) .content {
      outline: var(--lith-tree-item-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-tree-item-focus-ring-offset, 2px);
    }

    :host([selected]) .content {
      font-weight: bold;
    }

    .expand-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 0;
      margin: 0;
      border-radius: 2px;
      transition: transform var(--lith-tree-item-transition-duration, 200ms) ease;
      flex-shrink: 0;
    }

    .expand-button:hover {
      background-color: rgba(128, 128, 128, 0.1);
    }

    .expand-button:focus {
      outline: var(--lith-tree-item-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-tree-item-focus-ring-offset, 2px);
    }

    .expand-button.expanded {
      transform: rotate(90deg);
    }

    .expand-button.hidden {
      visibility: hidden;
    }

    .expand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    .label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .children {
      overflow: hidden;
      transition: max-height var(--lith-tree-item-transition-duration, 200ms) ease;
    }

    .children.collapsed {
      max-height: 0;
    }

    .children.expanded {
      max-height: none;
    }

    ::slotted(lith-tree-item) {
      --level: calc(var(--level, 0) + 1);
    }
  `;

  @property({ type: String })
  value: string = '';

  @property({ type: String })
  label: string = '';

  @property({ type: Boolean, reflect: true })
  expanded: boolean = false;

  @property({ type: Boolean, reflect: true })
  selected: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, attribute: 'has-children' })
  hasChildren: boolean = false;

  @property({ type: Boolean, attribute: 'lazy-loading' })
  lazyLoading: boolean = false;

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  @property({ type: Number })
  level: number = 0;

  // Note: This was a measurement helper that's no longer needed
  // private _childrenHeight: number = 0;

  @query('.children')
  private _childrenElement!: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this.tabIndex = -1;
    this.setAttribute('role', 'treeitem');
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('click', this._handleClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('click', this._handleClick);
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('expanded')) {
      this._updateAriaExpanded();
      this._handleExpandedChange();
    }

    if (changedProperties.has('selected')) {
      this._updateAriaSelected();
    }

    if (changedProperties.has('disabled')) {
      this._updateAriaDisabled();
    }

    if (changedProperties.has('level')) {
      this.style.setProperty('--level', this.level.toString());
    }

    if (changedProperties.has('loading')) {
      this._updateAriaLoading();
    }
  }

  override render() {
    const contentClasses = {
      content: true,
    };

    const expandButtonClasses = {
      'expand-button': true,
      expanded: this.expanded,
      hidden: !this.hasChildren && !this.lazyLoading,
    };

    const childrenClasses = {
      children: true,
      expanded: this.expanded,
      collapsed: !this.expanded,
    };

    return html`
      <div part="base" class="base">
        <div part="content" class=${classMap(contentClasses)}>
          <button
            type="button"
            part="expand-button"
            class=${classMap(expandButtonClasses)}
            ?disabled=${this.disabled}
            @click=${this._handleExpandClick}
            aria-label=${this.expanded ? 'Collapse' : 'Expand'}
          >
            <span part="expand-icon" class="expand-icon">
              ${this.loading
                ? html`<slot name="loading-icon">⌛</slot>`
                : html`<slot name="expand-icon">▶</slot>`}
            </span>
          </button>
          <div part="label" class="label">
            <slot name="content">${this.label}</slot>
          </div>
        </div>
        <div part="children" class=${classMap(childrenClasses)} role="group">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private _handleSlotChange(): void {
    this._updateHasChildren();
  }

  private _updateHasChildren(): void {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    if (slot) {
      const nodes = slot.assignedNodes({ flatten: true });
      const hasChildElements = nodes.some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).tagName.toLowerCase() === 'lith-tree-item'
      );
      this.hasChildren = hasChildElements;
    }
  }

  private _handleClick = (event: MouseEvent): void => {
    // 如果点击在展开按钮上，不处理选择事件
    if ((event.target as HTMLElement).closest('.expand-button')) {
      return;
    }

    if (!this.disabled) {
      this._handleSelect();
    }
  };

  private _handleExpandClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (this.disabled || (!this.hasChildren && !this.lazyLoading)) {
      return;
    }

    this._handleToggle();
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this._handleSelect();
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (this.hasChildren || this.lazyLoading) {
          if (!this.expanded) {
            this._handleToggle();
          } else {
            // Focus first child
            const firstChild = this.querySelector('lith-tree-item:not([disabled])') as LithTreeItem;
            if (firstChild) {
              firstChild.focus();
            }
          }
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (this.expanded && (this.hasChildren || this.lazyLoading)) {
          this._handleToggle();
        } else {
          // Focus parent
          const parent = this.closest('lith-tree-item') as LithTreeItem;
          if (parent) {
            parent.focus();
          }
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        this._focusNext();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this._focusPrevious();
        break;

      case 'Home':
        event.preventDefault();
        this._focusFirst();
        break;

      case 'End':
        event.preventDefault();
        this._focusLast();
        break;

      case '*':
        event.preventDefault();
        this._expandAllSiblings();
        break;
    }
  };

  private _handleToggle(): void {
    if (this.lazyLoading && !this.expanded && !this.hasChildren) {
      this.loading = true;
      // 触发懒加载事件
      this.dispatchEvent(
        new CustomEvent('lith-lazy-load', {
          detail: { value: this.value, level: this.level },
          bubbles: true,
          composed: true,
        })
      );
    }

    this.expanded = !this.expanded;

    const detail: TreeItemToggleDetail = {
      expanded: this.expanded,
      value: this.value,
      level: this.level,
    };

    this.dispatchEvent(
      new CustomEvent('lith-toggle', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleSelect(): void {
    this.selected = !this.selected;

    const detail: TreeItemSelectDetail = {
      selected: this.selected,
      value: this.value,
      level: this.level,
      item: this,
    };

    this.dispatchEvent(
      new CustomEvent('lith-select', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleExpandedChange(): void {
    if (this.expanded) {
      this._measureChildren();
    }
  }

  private _measureChildren(): void {
    // This was a helper for measuring child heights
    // Currently not needed but could be useful for animations
    if (this._childrenElement) {
      // Implementation would go here if needed
    }
  }

  private _focusNext(): void {
    const treeItems = this._getAllTreeItems();
    const currentIndex = treeItems.indexOf(this);
    const nextIndex = currentIndex + 1;

    if (nextIndex < treeItems.length) {
      treeItems[nextIndex].focus();
    }
  }

  private _focusPrevious(): void {
    const treeItems = this._getAllTreeItems();
    const currentIndex = treeItems.indexOf(this);
    const previousIndex = currentIndex - 1;

    if (previousIndex >= 0) {
      treeItems[previousIndex].focus();
    }
  }

  private _focusFirst(): void {
    const treeItems = this._getAllTreeItems();
    if (treeItems.length > 0) {
      treeItems[0].focus();
    }
  }

  private _focusLast(): void {
    const treeItems = this._getAllTreeItems();
    if (treeItems.length > 0) {
      treeItems[treeItems.length - 1].focus();
    }
  }

  private _expandAllSiblings(): void {
    const parent = this.parentElement;
    if (parent) {
      const siblings = Array.from(
        parent.querySelectorAll(':scope > lith-tree-item')
      ) as LithTreeItem[];
      siblings.forEach((sibling) => {
        if (sibling.hasChildren || sibling.lazyLoading) {
          sibling.expanded = true;
        }
      });
    }
  }

  private _getAllTreeItems(): LithTreeItem[] {
    const tree = this.closest('lith-tree');
    if (tree) {
      return Array.from(tree.querySelectorAll('lith-tree-item:not([disabled])')) as LithTreeItem[];
    }
    return [];
  }

  private _updateAriaExpanded(): void {
    if (this.hasChildren || this.lazyLoading) {
      this.setAttribute('aria-expanded', this.expanded ? 'true' : 'false');
    } else {
      this.removeAttribute('aria-expanded');
    }
  }

  private _updateAriaSelected(): void {
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
  }

  private _updateAriaDisabled(): void {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
    }
  }

  private _updateAriaLoading(): void {
    if (this.loading) {
      this.setAttribute('aria-busy', 'true');
    } else {
      this.removeAttribute('aria-busy');
    }
  }

  /**
   * Expands the tree item
   */
  expand(): void {
    if (!this.disabled && (this.hasChildren || this.lazyLoading)) {
      this.expanded = true;
    }
  }

  /**
   * Collapses the tree item
   */
  collapse(): void {
    if (!this.disabled) {
      this.expanded = false;
    }
  }

  /**
   * Toggles the expanded state
   */
  toggle(): void {
    if (!this.disabled && (this.hasChildren || this.lazyLoading)) {
      this._handleToggle();
    }
  }

  /**
   * Selects the tree item
   */
  select(): void {
    if (!this.disabled) {
      this.selected = true;
      this._handleSelect();
    }
  }

  /**
   * Deselects the tree item
   */
  deselect(): void {
    if (!this.disabled) {
      this.selected = false;
    }
  }

  /**
   * Sets the loading state (used for lazy loading)
   */
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  /**
   * Focuses the tree item
   */
  override focus(): void {
    this.tabIndex = 0;
    super.focus();
  }

  /**
   * Removes focus from the tree item
   */
  override blur(): void {
    this.tabIndex = -1;
    super.blur();
  }
}
