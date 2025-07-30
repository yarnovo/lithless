/**
 * 虚拟滚动核心逻辑类
 * 负责虚拟滚动的所有计算逻辑，不涉及DOM操作
 */

export interface VirtualScrollItem {
  id: string | number;
  data: unknown;
  height?: number; // 支持动态高度
}

export interface VirtualScrollConfig {
  itemHeight: number; // 默认项目高度
  containerHeight: number; // 容器高度
  bufferSize?: number; // 缓冲区大小（上下各增加的项目数量）
  overscan?: number; // 额外渲染的项目数量（性能优化）
}

export interface VirtualScrollRange {
  startIndex: number;
  endIndex: number;
  offsetTop: number;
  totalHeight: number;
  visibleCount: number;
}

export interface VirtualScrollUpdateInfo {
  range: VirtualScrollRange;
  scrollTop: number;
  scrollHeight: number;
  needsUpdate: boolean;
}

export class VirtualScrollCore {
  private config: Required<VirtualScrollConfig>;
  private items: VirtualScrollItem[] = [];
  private scrollTop = 0;
  private lastRange: VirtualScrollRange | null = null;

  // 动态高度支持
  private itemHeights = new Map<string | number, number>();
  private estimatedItemHeight: number;

  constructor(config: VirtualScrollConfig) {
    this.config = {
      bufferSize: 5,
      overscan: 2,
      ...config,
    };
    this.estimatedItemHeight = this.config.itemHeight;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<VirtualScrollConfig>): void {
    this.config = { ...this.config, ...config };
    this.lastRange = null; // 强制重新计算
  }

  /**
   * 设置数据源
   */
  setItems(items: VirtualScrollItem[]): void {
    this.items = items;
    this.lastRange = null; // 强制重新计算
  }

  /**
   * 更新滚动位置并计算需要渲染的范围
   */
  updateScrollTop(scrollTop: number): VirtualScrollUpdateInfo {
    this.scrollTop = Math.max(0, scrollTop);

    const range = this.calculateVisibleRange();
    const needsUpdate = this.shouldUpdateRange(range);

    if (needsUpdate) {
      this.lastRange = range;
    }

    return {
      range,
      scrollTop: this.scrollTop,
      scrollHeight: this.getTotalHeight(),
      needsUpdate,
    };
  }

  /**
   * 计算可见范围
   */
  private calculateVisibleRange(): VirtualScrollRange {
    const { containerHeight, bufferSize, overscan } = this.config;

    if (this.items.length === 0) {
      return {
        startIndex: 0,
        endIndex: 0,
        offsetTop: 0,
        totalHeight: 0,
        visibleCount: 0,
      };
    }

    // 基础计算
    const visibleCount = Math.ceil(containerHeight / this.estimatedItemHeight);
    const startIndex = Math.floor(this.scrollTop / this.estimatedItemHeight);

    // 添加缓冲区和overscan
    const bufferedStartIndex = Math.max(0, startIndex - bufferSize - overscan);
    const bufferedEndIndex = Math.min(
      this.items.length,
      startIndex + visibleCount + bufferSize + overscan
    );

    // 计算偏移量
    const offsetTop = this.getOffsetTop(bufferedStartIndex);
    const totalHeight = this.getTotalHeight();

    return {
      startIndex: bufferedStartIndex,
      endIndex: bufferedEndIndex,
      offsetTop,
      totalHeight,
      visibleCount,
    };
  }

  /**
   * 判断是否需要更新渲染
   */
  private shouldUpdateRange(newRange: VirtualScrollRange): boolean {
    if (!this.lastRange) return true;

    const { startIndex, endIndex } = newRange;
    const { startIndex: lastStart, endIndex: lastEnd } = this.lastRange;

    // 如果范围变化超过阈值，则需要更新
    const threshold = Math.max(1, Math.floor(newRange.visibleCount * 0.5));

    return (
      Math.abs(startIndex - lastStart) >= threshold || Math.abs(endIndex - lastEnd) >= threshold
    );
  }

  /**
   * 获取指定索引位置的顶部偏移量
   */
  private getOffsetTop(index: number): number {
    if (index === 0) return 0;

    let offset = 0;
    for (let i = 0; i < index && i < this.items.length; i++) {
      offset += this.getItemHeight(this.items[i]);
    }
    return offset;
  }

  /**
   * 获取总高度
   */
  private getTotalHeight(): number {
    if (this.items.length === 0) return 0;

    return this.items.reduce((total, item) => {
      return total + this.getItemHeight(item);
    }, 0);
  }

  /**
   * 获取单个项目的高度
   */
  private getItemHeight(item: VirtualScrollItem): number {
    // 如果有缓存的高度，使用缓存
    if (this.itemHeights.has(item.id)) {
      return this.itemHeights.get(item.id)!;
    }

    // 如果项目指定了高度，使用项目高度
    if (item.height !== undefined) {
      return item.height;
    }

    // 否则使用默认高度
    return this.config.itemHeight;
  }

  /**
   * 设置项目的实际高度（用于动态高度支持）
   */
  setItemHeight(itemId: string | number, height: number): void {
    this.itemHeights.set(itemId, height);

    // 更新平均高度估算
    if (this.itemHeights.size > 0) {
      const totalHeight = Array.from(this.itemHeights.values()).reduce((a, b) => a + b, 0);
      this.estimatedItemHeight = totalHeight / this.itemHeights.size;
    }

    this.lastRange = null; // 强制重新计算
  }

  /**
   * 获取当前可见的项目列表
   */
  getVisibleItems(): VirtualScrollItem[] {
    if (!this.lastRange) return [];

    const { startIndex, endIndex } = this.lastRange;
    return this.items.slice(startIndex, endIndex);
  }

  /**
   * 获取当前范围信息
   */
  getCurrentRange(): VirtualScrollRange | null {
    return this.lastRange;
  }

  /**
   * 滚动到指定索引
   */
  scrollToIndex(index: number): number {
    const targetIndex = Math.max(0, Math.min(index, this.items.length - 1));
    return this.getOffsetTop(targetIndex);
  }

  /**
   * 获取项目在列表中的位置信息
   */
  getItemPosition(index: number): { top: number; height: number } | null {
    if (index < 0 || index >= this.items.length) return null;

    const top = this.getOffsetTop(index);
    const height = this.getItemHeight(this.items[index]);

    return { top, height };
  }

  /**
   * 重置所有缓存状态
   */
  reset(): void {
    this.scrollTop = 0;
    this.lastRange = null;
    this.itemHeights.clear();
    this.estimatedItemHeight = this.config.itemHeight;
  }
}
