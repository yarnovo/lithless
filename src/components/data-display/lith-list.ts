import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import {
  VirtualScrollCore,
  VirtualScrollItem,
  VirtualScrollRange,
} from '../../utils/virtual-scroll-core.js';

export interface ListItem {
  id: string | number;
  content: unknown;
  disabled?: boolean;
  selected?: boolean;
  data?: unknown; // 额外的数据
}

export interface ListSelectEvent {
  selectedItems: ListItem[];
  selectedIndexes: number[];
  item: ListItem;
  index: number;
}

/**
 * 列表组件，支持虚拟滚动
 * 提供完整的列表功能，包括选择、禁用、自定义渲染等
 */
@customElement('lith-list')
export class LithList extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 300px;
      position: relative;
      border: 1px solid var(--lith-list-border-color, #e0e0e0);
      border-radius: var(--lith-list-border-radius, 4px);
      background: var(--lith-list-background, #ffffff);
      overflow: hidden;
    }

    .scroll-container {
      height: 100%;
      overflow: auto;
      scrollbar-width: thin;
    }

    .scroll-spacer {
      position: relative;
      width: 100%;
    }

    .scroll-viewport {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      will-change: transform;
    }

    .list-item {
      position: relative;
      display: flex;
      align-items: center;
      padding: var(--lith-list-item-padding, 12px 16px);
      border-bottom: 1px solid var(--lith-list-item-border-color, #f0f0f0);
      cursor: pointer;
      transition: background-color 0.15s ease;
      user-select: none;
    }

    .list-item:last-child {
      border-bottom: none;
    }

    .list-item:hover:not(.disabled) {
      background: var(--lith-list-item-hover-background, #f5f5f5);
    }

    .list-item.selected {
      background: var(--lith-list-item-selected-background, #e3f2fd);
      color: var(--lith-list-item-selected-color, #1976d2);
    }

    .list-item.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      color: var(--lith-list-item-disabled-color, #999999);
    }

    .list-item.focused {
      outline: 2px solid var(--lith-list-focus-color, #1976d2);
      outline-offset: -2px;
    }

    .item-content {
      flex: 1;
      overflow: hidden;
    }

    .selection-indicator {
      width: var(--lith-list-selection-indicator-size, 16px);
      height: var(--lith-list-selection-indicator-size, 16px);
      margin-right: var(--lith-list-selection-indicator-margin, 8px);
      border: 2px solid var(--lith-list-selection-indicator-border, #d0d0d0);
      border-radius: 2px;
      background: var(--lith-list-selection-indicator-background, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .selection-indicator.selected {
      background: var(--lith-list-selection-indicator-selected-background, #1976d2);
      border-color: var(--lith-list-selection-indicator-selected-border, #1976d2);
      color: white;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: var(--lith-list-loading-color, #666666);
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: var(--lith-list-empty-color, #999999);
    }
  `;

  @property({ type: Array }) items: ListItem[] = [];
  @property({ type: Number, attribute: 'item-height' }) itemHeight = 48;
  @property({ type: Number, attribute: 'buffer-size' }) bufferSize = 5;
  @property({ type: Number, attribute: 'overscan' }) overscan = 2;
  @property({ type: Boolean }) loading = false;
  @property({ type: String, attribute: 'empty-text' }) emptyText = '暂无数据';
  @property({ type: String, attribute: 'selection-mode' }) selectionMode:
    | 'none'
    | 'single'
    | 'multiple' = 'none';
  @property({ type: Array, attribute: 'selected-items' }) selectedItems: (string | number)[] = [];
  @property({ type: Boolean, attribute: 'show-selection-indicator' }) showSelectionIndicator =
    false;

  @state() private virtualScrollCore?: VirtualScrollCore;
  @state() private currentRange?: VirtualScrollRange;
  @state() private visibleItems: VirtualScrollItem[] = [];
  @state() private focusedIndex = -1;

  @query('.scroll-container') private scrollContainer!: HTMLElement;
  @query('.scroll-viewport') private viewport!: HTMLElement;

  private resizeObserver?: ResizeObserver;
  private scrollRAF?: number;
  private measureRAF?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this.setupResizeObserver();
    this.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  protected firstUpdated(): void {
    this.initializeVirtualScroll();
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('items')) {
      this.handleItemsChange();
    }

    if (
      changedProperties.has('itemHeight') ||
      changedProperties.has('bufferSize') ||
      changedProperties.has('overscan')
    ) {
      this.updateVirtualScrollConfig();
    }

    if (changedProperties.has('selectedItems')) {
      this.requestUpdate();
    }
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this);
    }
  }

  private cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.scrollRAF) {
      cancelAnimationFrame(this.scrollRAF);
    }
    if (this.measureRAF) {
      cancelAnimationFrame(this.measureRAF);
    }
  }

  private initializeVirtualScroll(): void {
    const containerHeight = this.offsetHeight || 300;

    this.virtualScrollCore = new VirtualScrollCore({
      itemHeight: this.itemHeight,
      containerHeight,
      bufferSize: this.bufferSize,
      overscan: this.overscan,
    });

    this.virtualScrollCore.setItems(this.convertToVirtualItems());
    this.updateVisibleItems();
  }

  private convertToVirtualItems(): VirtualScrollItem[] {
    return this.items.map((item) => ({
      id: item.id,
      data: item,
      height: this.itemHeight,
    }));
  }

  private updateVirtualScrollConfig(): void {
    if (!this.virtualScrollCore) return;

    this.virtualScrollCore.updateConfig({
      itemHeight: this.itemHeight,
      containerHeight: this.offsetHeight || 300,
      bufferSize: this.bufferSize,
      overscan: this.overscan,
    });

    this.updateVisibleItems();
  }

  private handleItemsChange(): void {
    if (!this.virtualScrollCore) return;

    this.virtualScrollCore.setItems(this.convertToVirtualItems());
    this.updateVisibleItems();
  }

  private handleResize(): void {
    if (this.measureRAF) {
      cancelAnimationFrame(this.measureRAF);
    }

    this.measureRAF = requestAnimationFrame(() => {
      if (!this.virtualScrollCore) return;

      this.virtualScrollCore.updateConfig({
        containerHeight: this.offsetHeight || 300,
      });

      this.updateVisibleItems();
    });
  }

  private handleScroll = (event: Event): void => {
    if (this.scrollRAF) {
      cancelAnimationFrame(this.scrollRAF);
    }

    this.scrollRAF = requestAnimationFrame(() => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const scrollTop = target.scrollTop || 0;
      this.updateScrollPosition(scrollTop);
    });
  };

  private updateScrollPosition(scrollTop: number): void {
    if (!this.virtualScrollCore) return;

    const updateInfo = this.virtualScrollCore.updateScrollTop(scrollTop);

    if (updateInfo.needsUpdate) {
      this.currentRange = updateInfo.range;
      this.visibleItems = this.virtualScrollCore.getVisibleItems();
      this.updateViewport();
    }

    this.dispatchEvent(
      new CustomEvent('lith-scroll', {
        detail: {
          scrollTop,
          scrollHeight: updateInfo.scrollHeight,
          range: updateInfo.range,
        },
        bubbles: true,
      })
    );
  }

  private updateVisibleItems(): void {
    if (!this.virtualScrollCore || !this.scrollContainer) return;

    const scrollTop = this.scrollContainer.scrollTop || 0;
    const updateInfo = this.virtualScrollCore.updateScrollTop(scrollTop);

    this.currentRange = updateInfo.range;
    this.visibleItems = this.virtualScrollCore.getVisibleItems();
    this.updateViewport();
  }

  private updateViewport(): void {
    if (!this.viewport || !this.currentRange) return;

    this.viewport.style.transform = `translateY(${this.currentRange.offsetTop}px)`;
  }

  handleItemClick = (event: Event, item: ListItem, index: number): void => {
    event.preventDefault();
    event.stopPropagation();

    if (item.disabled) return;

    this.focusedIndex = index;

    if (this.selectionMode !== 'none') {
      this.toggleSelection(item, index, event as MouseEvent);
    }

    // 触发点击事件
    this.dispatchEvent(
      new CustomEvent('lith-item-click', {
        detail: { item, index },
        bubbles: true,
      })
    );
  };

  toggleSelection(item: ListItem, index: number, event?: MouseEvent): void {
    const isSelected = this.selectedItems.includes(item.id);
    let newSelectedItems = [...this.selectedItems];

    if (this.selectionMode === 'single') {
      newSelectedItems = isSelected ? [] : [item.id];
    } else if (this.selectionMode === 'multiple') {
      if (event?.ctrlKey || event?.metaKey) {
        // Ctrl/Cmd + Click: 切换单个项目选择状态
        if (isSelected) {
          newSelectedItems = newSelectedItems.filter((id) => id !== item.id);
        } else {
          newSelectedItems.push(item.id);
        }
      } else if (event?.shiftKey && this.focusedIndex !== -1) {
        // Shift + Click: 选择范围
        const start = Math.min(this.focusedIndex, index);
        const end = Math.max(this.focusedIndex, index);
        const rangeIds = this.items.slice(start, end + 1).map((i) => i.id);
        newSelectedItems = [...new Set([...newSelectedItems, ...rangeIds])];
      } else {
        // 普通点击：切换单个项目选择状态
        if (isSelected) {
          newSelectedItems = newSelectedItems.filter((id) => id !== item.id);
        } else {
          newSelectedItems.push(item.id);
        }
      }
    }

    this.selectedItems = newSelectedItems;

    // 触发选择变化事件
    const selectedItemsData = this.items.filter((item) => this.selectedItems.includes(item.id));
    const selectedIndexes = selectedItemsData.map((item) => this.items.indexOf(item));

    this.dispatchEvent(
      new CustomEvent('lith-selection-change', {
        detail: {
          selectedItems: selectedItemsData,
          selectedIndexes,
          item,
          index,
        } as ListSelectEvent,
        bubbles: true,
      })
    );
  }

  handleKeyDown = (event: KeyboardEvent): void => {
    if (this.items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.setFocus(0);
        break;
      case 'End':
        event.preventDefault();
        this.setFocus(this.items.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < this.items.length) {
          const item = this.items[this.focusedIndex];
          this.handleItemClick(event, item, this.focusedIndex);
        }
        break;
    }
  };

  private moveFocus(direction: number): void {
    const newIndex = this.focusedIndex + direction;
    if (newIndex >= 0 && newIndex < this.items.length) {
      this.setFocus(newIndex);
    }
  }

  private setFocus(index: number): void {
    this.focusedIndex = index;
    this.scrollToIndex(index);
    this.requestUpdate();
  }

  /**
   * 滚动到指定索引
   */
  scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth'): void {
    if (!this.virtualScrollCore || !this.scrollContainer) return;

    const scrollTop = this.virtualScrollCore.scrollToIndex(index);
    this.scrollContainer.scrollTo({
      top: scrollTop,
      behavior,
    });
  }

  /**
   * 获取选中的项目
   */
  getSelectedItems(): ListItem[] {
    return this.items.filter((item) => this.selectedItems.includes(item.id));
  }

  /**
   * 设置选中的项目
   */
  setSelectedItems(ids: (string | number)[]): void {
    this.selectedItems = [...ids];
  }

  /**
   * 清空选择
   */
  clearSelection(): void {
    this.selectedItems = [];
  }

  /**
   * 全选
   */
  selectAll(): void {
    if (this.selectionMode === 'multiple') {
      this.selectedItems = this.items.filter((item) => !item.disabled).map((item) => item.id);
    }
  }

  /**
   * 获取焦点索引 (测试用)
   */
  getFocusedIndex(): number {
    return this.focusedIndex;
  }

  /**
   * 获取虚拟滚动核心 (测试用)
   */
  getVirtualScrollCore(): VirtualScrollCore | undefined {
    return this.virtualScrollCore;
  }

  protected renderItem(item: ListItem, index: number): unknown {
    const isSelected = this.selectedItems.includes(item.id);
    const isFocused = this.focusedIndex === index;
    const actualIndex =
      (this.currentRange?.startIndex || 0) + (index - (this.currentRange?.startIndex || 0));

    const classes = [
      'list-item',
      isSelected && 'selected',
      item.disabled && 'disabled',
      isFocused && 'focused',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div
        class="${classes}"
        data-index="${actualIndex}"
        data-id="${item.id}"
        @click=${(e: Event) => this.handleItemClick(e, item, actualIndex)}
        role="option"
        aria-selected="${isSelected}"
        aria-disabled="${item.disabled || false}"
        tabindex="${isFocused ? 0 : -1}"
      >
        ${this.showSelectionIndicator && this.selectionMode !== 'none'
          ? html`
              <div class="selection-indicator ${isSelected ? 'selected' : ''}">
                ${isSelected ? '✓' : ''}
              </div>
            `
          : ''}
        <div class="item-content">
          <slot name="item" .item=${item} .index=${actualIndex}>
            ${typeof item.content === 'string' ? item.content : JSON.stringify(item.content)}
          </slot>
        </div>
      </div>
    `;
  }

  protected renderLoading(): unknown {
    return html`
      <div class="loading">
        <slot name="loading">加载中...</slot>
      </div>
    `;
  }

  protected renderEmpty(): unknown {
    return html`
      <div class="empty">
        <slot name="empty">${this.emptyText}</slot>
      </div>
    `;
  }

  protected render(): unknown {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.items.length === 0) {
      return this.renderEmpty();
    }

    const totalHeight = this.currentRange?.totalHeight || 0;

    return html`
      <div
        class="scroll-container"
        @scroll=${this.handleScroll}
        role="listbox"
        aria-multiselectable="${this.selectionMode === 'multiple'}"
        tabindex="0"
      >
        <div class="scroll-spacer" style="height: ${totalHeight}px;">
          <div class="scroll-viewport">
            ${this.visibleItems.map((virtualItem, index) => {
              const item = virtualItem.data as ListItem;
              const actualIndex = (this.currentRange?.startIndex || 0) + index;
              return this.renderItem(item, actualIndex);
            })}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-list': LithList;
  }
}
