import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import {
  VirtualScrollCore,
  VirtualScrollItem,
  VirtualScrollRange,
} from '../../utils/virtual-scroll-core.js';

/**
 * 虚拟滚动容器组件
 * 提供基础的虚拟滚动功能，可以被其他组件继承或组合使用
 */
@customElement('lith-virtual-scroll')
export class LithVirtualScroll extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 300px;
      overflow: hidden;
      position: relative;
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

    .scroll-item {
      position: relative;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #666;
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #999;
    }
  `;

  @property({ type: Array }) items: VirtualScrollItem[] = [];
  @property({ type: Number, attribute: 'item-height' }) itemHeight = 50;
  @property({ type: Number, attribute: 'buffer-size' }) bufferSize = 5;
  @property({ type: Number, attribute: 'overscan' }) overscan = 2;
  @property({ type: Boolean }) loading = false;
  @property({ type: String, attribute: 'empty-text' }) emptyText = '暂无数据';

  @state() private virtualScrollCore?: VirtualScrollCore;
  @state() private currentRange?: VirtualScrollRange;
  @state() private visibleItems: VirtualScrollItem[] = [];

  @query('.scroll-container') private scrollContainer!: HTMLElement;
  @query('.scroll-viewport') private viewport!: HTMLElement;

  private resizeObserver?: ResizeObserver;
  private scrollRAF?: number;
  private measureRAF?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this.setupResizeObserver();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
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

    this.virtualScrollCore.setItems(this.items);
    this.updateVisibleItems();
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

    this.virtualScrollCore.setItems(this.items);
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

    // 触发滚动事件
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
   * 获取指定项目的位置信息
   */
  getItemPosition(index: number): { top: number; height: number } | null {
    return this.virtualScrollCore?.getItemPosition(index) || null;
  }

  /**
   * 设置项目的实际高度（用于动态高度支持）
   */
  setItemHeight(itemId: string | number, height: number): void {
    this.virtualScrollCore?.setItemHeight(itemId, height);
  }

  /**
   * 渲染单个项目，子类可以重写此方法
   */
  protected renderItem(item: VirtualScrollItem, index: number): unknown {
    // 触发自定义渲染事件
    const renderEvent = new CustomEvent('lith-render-item', {
      detail: { item, index },
      bubbles: true,
    });
    this.dispatchEvent(renderEvent);

    // 默认渲染
    return html`
      <div class="scroll-item" data-index="${index}" data-id="${item.id}">
        <slot name="item" .item=${item} .index=${index}> ${JSON.stringify(item.data)} </slot>
      </div>
    `;
  }

  /**
   * 渲染加载状态
   */
  protected renderLoading(): unknown {
    return html`
      <div class="loading">
        <slot name="loading">加载中...</slot>
      </div>
    `;
  }

  /**
   * 渲染空状态
   */
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
      <div class="scroll-container" @scroll=${this.handleScroll}>
        <div class="scroll-spacer" style="height: ${totalHeight}px;">
          <div class="scroll-viewport">
            ${this.visibleItems.map((item, index) => {
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
    'lith-virtual-scroll': LithVirtualScroll;
  }
}
