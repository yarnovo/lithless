import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { LithTreeItem, TreeItemSelectDetail, TreeItemToggleDetail } from './lith-tree-item.js';

/**
 * Tree node data structure
 */
export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  hasChildren?: boolean;
  loading?: boolean;
  [key: string]: unknown;
}

/**
 * Custom event detail for tree selection change events
 */
export interface TreeSelectionChangeDetail {
  selectedValues: string[];
  selectedItems: LithTreeItem[];
  lastSelectedValue: string | null;
  action: 'select' | 'deselect';
}

/**
 * Custom event detail for tree lazy load events
 */
export interface TreeLazyLoadDetail {
  value: string;
  level: number;
  node?: TreeNode;
}

/**
 * A headless tree component that provides hierarchical data display
 * functionality with complete interaction logic without any predefined styles.
 *
 * @element lith-tree
 *
 * @fires {CustomEvent<TreeSelectionChangeDetail>} lith-selection-change - Fired when the selection changes
 * @fires {CustomEvent<TreeItemToggleDetail>} lith-toggle - Fired when a tree item is expanded/collapsed
 * @fires {CustomEvent<TreeLazyLoadDetail>} lith-lazy-load - Fired when lazy loading is needed
 * @fires {FocusEvent} lith-focus - Fired when the tree gains focus
 * @fires {FocusEvent} lith-blur - Fired when the tree loses focus
 *
 * @slot - The tree items (lith-tree-item elements)
 * @slot empty - Content to show when the tree is empty
 *
 * @csspart base - The component's root element
 * @csspart tree - The tree container
 * @csspart empty - The empty state container
 *
 * @cssprop [--lith-tree-padding=8px] - Padding for the tree container
 * @cssprop [--lith-tree-gap=0px] - Gap between tree items
 * @cssprop [--lith-tree-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-tree-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-tree-max-height=400px] - Maximum height of the tree
 */
@customElement('lith-tree')
export class LithTree extends LitElement {
  static override styles = css`
    :host {
      display: block;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    .base {
      display: block;
      position: relative;
    }

    :host(:focus-within) .base {
      outline: var(--lith-tree-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-tree-focus-ring-offset, 2px);
      border-radius: 4px;
    }

    .tree {
      display: block;
      padding: var(--lith-tree-padding, 8px);
      max-height: var(--lith-tree-max-height, 400px);
      overflow-y: auto;
      overflow-x: hidden;
      gap: var(--lith-tree-gap, 0px);
    }

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--lith-tree-padding, 8px);
      color: rgba(128, 128, 128, 0.8);
      font-style: italic;
    }

    ::slotted(lith-tree-item) {
      --level: 0;
    }
  `;

  @property({ type: Array })
  data: TreeNode[] = [];

  @property({ type: Array, attribute: 'selected-values' })
  selectedValues: string[] = [];

  @property({ type: Boolean, attribute: 'multiple-selection' })
  multipleSelection: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, attribute: 'lazy-loading' })
  lazyLoading: boolean = false;

  @property({ type: String, attribute: 'selection-mode' })
  selectionMode: 'single' | 'multiple' | 'checkbox' = 'single';

  @property({ type: Boolean, attribute: 'expand-on-click' })
  expandOnClick: boolean = false;

  @property({ type: String, attribute: 'empty-text' })
  emptyText: string = 'No data available';

  @state()
  private _focusedItem: LithTreeItem | null = null;

  @queryAssignedElements({ selector: 'lith-tree-item' })
  private _treeItems!: LithTreeItem[];

  private _selectedItems: Set<LithTreeItem> = new Set();

  override connectedCallback(): void {
    super.connectedCallback();
    this.tabIndex = 0;
    this.setAttribute('role', 'tree');

    // Add event listeners
    this.addEventListener('lith-select', this._handleItemSelect as EventListener);
    this.addEventListener('lith-toggle', this._handleItemToggle as EventListener);
    this.addEventListener('lith-lazy-load', this._handleLazyLoad as EventListener);
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('focus', this._handleFocus);
    this.addEventListener('blur', this._handleBlur);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('lith-select', this._handleItemSelect as EventListener);
    this.removeEventListener('lith-toggle', this._handleItemToggle as EventListener);
    this.removeEventListener('lith-lazy-load', this._handleLazyLoad as EventListener);
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('focus', this._handleFocus);
    this.removeEventListener('blur', this._handleBlur);
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('data')) {
      this._updateTreeFromData();
    }

    if (changedProperties.has('selectedValues')) {
      this._updateSelectedItems();
    }

    if (changedProperties.has('disabled')) {
      this._updateItemsDisabledState();
    }

    if (changedProperties.has('selectionMode')) {
      this._updateSelectionMode();
    }
  }

  override render() {
    const baseClasses = {
      base: true,
    };

    const hasItems = this._treeItems && this._treeItems.length > 0;

    return html`
      <div part="base" class=${classMap(baseClasses)}>
        ${hasItems
          ? html`
              <div part="tree" class="tree" role="tree">
                <slot @slotchange=${this._handleSlotChange}></slot>
              </div>
            `
          : html`
              <div part="empty" class="empty">
                <slot name="empty">${this.emptyText}</slot>
              </div>
            `}
      </div>
    `;
  }

  private _handleSlotChange(): void {
    this._updateTreeItems();
    this._updateSelectedItems();
    this._setupTreeItemsAttributes();
  }

  private _updateTreeItems(): void {
    // 获取所有的树节点项
    this._treeItems = Array.from(this.querySelectorAll('lith-tree-item')) as LithTreeItem[];
  }

  private _setupTreeItemsAttributes(): void {
    this._treeItems.forEach((item, index) => {
      // 设置基本属性
      item.setAttribute('role', 'treeitem');
      item.tabIndex = -1;

      // 设置层级
      const level = this._calculateItemLevel(item);
      item.level = level;

      // 设置唯一 ID
      if (!item.id) {
        item.id = `tree-item-${index}`;
      }
    });

    // 如果没有聚焦的项目，聚焦第一个可用项目
    if (this._treeItems.length > 0 && !this._focusedItem) {
      const firstEnabledItem = this._treeItems.find((item) => !item.disabled);
      if (firstEnabledItem) {
        this._setFocusedItem(firstEnabledItem);
      }
    }
  }

  private _calculateItemLevel(item: LithTreeItem): number {
    let level = 0;
    let parent = item.parentElement;

    while (parent && parent !== this) {
      if (parent.tagName.toLowerCase() === 'lith-tree-item') {
        level++;
      }
      parent = parent.parentElement;
    }

    return level;
  }

  private _updateTreeFromData(): void {
    if (this.data.length === 0) {
      this.innerHTML = '';
      return;
    }

    const fragment = document.createDocumentFragment();
    this.data.forEach((node) => {
      const item = this._createTreeItemFromNode(node);
      fragment.appendChild(item);
    });

    this.innerHTML = '';
    this.appendChild(fragment);
  }

  private _createTreeItemFromNode(node: TreeNode): LithTreeItem {
    const item = document.createElement('lith-tree-item') as LithTreeItem;

    item.value = node.value;
    item.label = node.label;
    item.expanded = node.expanded || false;
    item.selected = node.selected || false;
    item.disabled = node.disabled || false;
    item.hasChildren = node.hasChildren || (node.children && node.children.length > 0) || false;
    item.lazyLoading = this.lazyLoading;
    item.loading = node.loading || false;

    // 添加子节点
    if (node.children && node.children.length > 0) {
      node.children.forEach((childNode) => {
        const childItem = this._createTreeItemFromNode(childNode);
        item.appendChild(childItem);
      });
    }

    return item;
  }

  private _updateSelectedItems(): void {
    this._selectedItems.clear();

    this._treeItems.forEach((item) => {
      const isSelected = this.selectedValues.includes(item.value);
      item.selected = isSelected;

      if (isSelected) {
        this._selectedItems.add(item);
      }
    });
  }

  private _updateItemsDisabledState(): void {
    this._treeItems.forEach((item) => {
      if (this.disabled) {
        item.disabled = true;
      }
    });
  }

  private _updateSelectionMode(): void {
    // 根据选择模式更新树项的属性
    this._treeItems.forEach((item) => {
      switch (this.selectionMode) {
        case 'single':
          item.setAttribute('aria-multiselectable', 'false');
          break;
        case 'multiple':
        case 'checkbox':
          item.setAttribute('aria-multiselectable', 'true');
          break;
      }
    });
  }

  private _handleItemSelect = (event: CustomEvent<TreeItemSelectDetail>): void => {
    event.stopPropagation();

    const { item, selected, value } = event.detail;

    if (this.disabled) return;

    // 处理不同的选择模式
    switch (this.selectionMode) {
      case 'single':
        this._handleSingleSelection(item, selected, value);
        break;
      case 'multiple':
        this._handleMultipleSelection(item, selected, value);
        break;
      case 'checkbox':
        this._handleCheckboxSelection(item, selected, value);
        break;
    }
  };

  private _handleSingleSelection(item: LithTreeItem, selected: boolean, value: string): void {
    // 单选模式：取消所有其他选择
    this._treeItems.forEach((treeItem) => {
      if (treeItem !== item) {
        treeItem.selected = false;
        this._selectedItems.delete(treeItem);
      }
    });

    if (selected) {
      this._selectedItems.add(item);
    } else {
      this._selectedItems.delete(item);
    }

    this._updateSelectedValues();
    this._emitSelectionChange(value, selected ? 'select' : 'deselect');
  }

  private _handleMultipleSelection(item: LithTreeItem, selected: boolean, value: string): void {
    // 多选模式：直接添加或移除
    if (selected) {
      this._selectedItems.add(item);
    } else {
      this._selectedItems.delete(item);
    }

    this._updateSelectedValues();
    this._emitSelectionChange(value, selected ? 'select' : 'deselect');
  }

  private _handleCheckboxSelection(item: LithTreeItem, selected: boolean, value: string): void {
    // 复选框模式：包含级联选择逻辑
    if (selected) {
      this._selectedItems.add(item);
      // 选择所有子项
      this._selectAllChildren(item, true);
      // 检查父项状态
      this._updateParentSelection(item);
    } else {
      this._selectedItems.delete(item);
      // 取消选择所有子项
      this._selectAllChildren(item, false);
      // 检查父项状态
      this._updateParentSelection(item);
    }

    this._updateSelectedValues();
    this._emitSelectionChange(value, selected ? 'select' : 'deselect');
  }

  private _selectAllChildren(item: LithTreeItem, selected: boolean): void {
    const children = item.querySelectorAll('lith-tree-item') as NodeListOf<LithTreeItem>;
    children.forEach((child) => {
      child.selected = selected;
      if (selected) {
        this._selectedItems.add(child);
      } else {
        this._selectedItems.delete(child);
      }
    });
  }

  private _updateParentSelection(item: LithTreeItem): void {
    const parent = item.closest('lith-tree-item:not(:scope)') as LithTreeItem;
    if (!parent) return;

    const siblings = Array.from(
      parent.querySelectorAll(':scope > lith-tree-item')
    ) as LithTreeItem[];
    const selectedSiblings = siblings.filter((sibling) => sibling.selected);

    if (selectedSiblings.length === siblings.length) {
      // 所有兄弟节点都选中，选中父节点
      parent.selected = true;
      this._selectedItems.add(parent);
    } else if (selectedSiblings.length === 0) {
      // 没有兄弟节点选中，取消选中父节点
      parent.selected = false;
      this._selectedItems.delete(parent);
    }

    // 递归更新更上级的父节点
    this._updateParentSelection(parent);
  }

  private _updateSelectedValues(): void {
    this.selectedValues = Array.from(this._selectedItems).map((item) => item.value);
  }

  private _emitSelectionChange(lastSelectedValue: string, action: 'select' | 'deselect'): void {
    const detail: TreeSelectionChangeDetail = {
      selectedValues: this.selectedValues,
      selectedItems: Array.from(this._selectedItems),
      lastSelectedValue,
      action,
    };

    this.dispatchEvent(
      new CustomEvent('lith-selection-change', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleItemToggle = (event: CustomEvent<TreeItemToggleDetail>): void => {
    // 直接转发事件
    this.dispatchEvent(
      new CustomEvent('lith-toggle', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );
  };

  private _handleLazyLoad = (event: CustomEvent<TreeLazyLoadDetail>): void => {
    // 转发懒加载事件
    this.dispatchEvent(
      new CustomEvent('lith-lazy-load', {
        detail: event.detail,
        bubbles: true,
        composed: true,
      })
    );
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    // 如果事件来自树项目，让它们处理
    if ((event.target as HTMLElement).tagName.toLowerCase() === 'lith-tree-item') {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this._focusFirstItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this._focusLastItem();
        break;
      case 'Home':
        event.preventDefault();
        this._focusFirstItem();
        break;
      case 'End':
        event.preventDefault();
        this._focusLastItem();
        break;
    }
  };

  private _focusFirstItem(): void {
    const firstItem = this._treeItems.find((item) => !item.disabled);
    if (firstItem) {
      this._setFocusedItem(firstItem);
      firstItem.focus();
    }
  }

  private _focusLastItem(): void {
    const lastItem = [...this._treeItems].reverse().find((item) => !item.disabled);
    if (lastItem) {
      this._setFocusedItem(lastItem);
      lastItem.focus();
    }
  }

  private _setFocusedItem(item: LithTreeItem | null): void {
    if (this._focusedItem) {
      this._focusedItem.tabIndex = -1;
    }

    this._focusedItem = item;

    if (this._focusedItem) {
      this._focusedItem.tabIndex = 0;
    }
  }

  private _handleFocus = (): void => {
    this.dispatchEvent(new FocusEvent('lith-focus', { bubbles: true, composed: true }));
  };

  private _handleBlur = (): void => {
    this.dispatchEvent(new FocusEvent('lith-blur', { bubbles: true, composed: true }));
  };

  /**
   * Gets all selected tree items
   */
  getSelectedItems(): LithTreeItem[] {
    return Array.from(this._selectedItems);
  }

  /**
   * Gets all selected values
   */
  getSelectedValues(): string[] {
    return this.selectedValues;
  }

  /**
   * Selects a tree item by value
   */
  selectItem(value: string): void {
    const item = this._treeItems.find((item) => item.value === value);
    if (item && !item.disabled) {
      item.select();
    }
  }

  /**
   * Deselects a tree item by value
   */
  deselectItem(value: string): void {
    const item = this._treeItems.find((item) => item.value === value);
    if (item) {
      item.deselect();
    }
  }

  /**
   * Selects multiple tree items by values
   */
  selectItems(values: string[]): void {
    values.forEach((value) => this.selectItem(value));
  }

  /**
   * Clears all selections
   */
  clearSelection(): void {
    this._selectedItems.forEach((item) => {
      item.deselect();
    });
    this._selectedItems.clear();
    this.selectedValues = [];
    this._emitSelectionChange('', 'deselect');
  }

  /**
   * Expands all tree items
   */
  expandAll(): void {
    this._treeItems.forEach((item) => {
      if (item.hasChildren || item.lazyLoading) {
        item.expand();
      }
    });
  }

  /**
   * Collapses all tree items
   */
  collapseAll(): void {
    this._treeItems.forEach((item) => {
      item.collapse();
    });
  }

  /**
   * Expands a tree item by value
   */
  expandItem(value: string): void {
    const item = this._treeItems.find((item) => item.value === value);
    if (item) {
      item.expand();
    }
  }

  /**
   * Collapses a tree item by value
   */
  collapseItem(value: string): void {
    const item = this._treeItems.find((item) => item.value === value);
    if (item) {
      item.collapse();
    }
  }

  /**
   * Gets a tree item by value
   */
  getItem(value: string): LithTreeItem | undefined {
    return this._treeItems.find((item) => item.value === value);
  }

  /**
   * Gets all tree items
   */
  getAllItems(): LithTreeItem[] {
    return [...this._treeItems];
  }

  /**
   * Updates the tree data
   */
  updateData(data: TreeNode[]): void {
    this.data = data;
  }

  /**
   * Adds a tree item
   */
  addItem(node: TreeNode, parentValue?: string): void {
    const newItem = this._createTreeItemFromNode(node);

    if (parentValue) {
      const parent = this._treeItems.find((item) => item.value === parentValue);
      if (parent) {
        parent.appendChild(newItem);
        parent.hasChildren = true;
      }
    } else {
      this.appendChild(newItem);
    }

    this._updateTreeItems();
    this._setupTreeItemsAttributes();
  }

  /**
   * Removes a tree item by value
   */
  removeItem(value: string): void {
    const item = this._treeItems.find((item) => item.value === value);
    if (item) {
      // 从选择集合中移除
      this._selectedItems.delete(item);
      // 从 DOM 中移除
      item.remove();
      // 更新树项列表
      this._updateTreeItems();
      this._updateSelectedValues();
    }
  }

  /**
   * Focuses the tree
   */
  override focus(): void {
    if (this._focusedItem) {
      this._focusedItem.focus();
    } else {
      this._focusFirstItem();
    }
  }
}
