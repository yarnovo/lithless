/**
 * 二维虚拟滚动核心逻辑类
 * 专为表格等二维数据结构设计，支持行和列的虚拟滚动
 */

export interface VirtualScroll2DItem {
  id: string | number;
  data: unknown;
  height?: number; // 行高
}

export interface VirtualScroll2DColumn {
  id: string | number;
  width?: number; // 列宽
  minWidth?: number;
  maxWidth?: number;
  fixed?: 'left' | 'right'; // 固定列
}

export interface VirtualScroll2DConfig {
  rowHeight: number; // 默认行高
  columnWidth: number; // 默认列宽
  containerWidth: number; // 容器宽度
  containerHeight: number; // 容器高度
  bufferSize?: number; // 缓冲区大小
  overscan?: number; // 额外渲染数量
  fixedRowsTop?: number; // 顶部固定行数
  fixedRowsBottom?: number; // 底部固定行数
  fixedColumnsLeft?: number; // 左侧固定列数
  fixedColumnsRight?: number; // 右侧固定列数
}

export interface VirtualScroll2DRange {
  // 行范围
  startRowIndex: number;
  endRowIndex: number;
  rowOffsetTop: number;
  totalRowHeight: number;
  visibleRowCount: number;

  // 列范围
  startColumnIndex: number;
  endColumnIndex: number;
  columnOffsetLeft: number;
  totalColumnWidth: number;
  visibleColumnCount: number;

  // 固定区域
  fixedRows: {
    top: VirtualScroll2DItem[];
    bottom: VirtualScroll2DItem[];
  };
  fixedColumns: {
    left: VirtualScroll2DColumn[];
    right: VirtualScroll2DColumn[];
  };
}

export interface VirtualScroll2DUpdateInfo {
  range: VirtualScroll2DRange;
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  needsUpdate: boolean;
}

export class VirtualScroll2DCore {
  private config: Required<VirtualScroll2DConfig>;
  private rows: VirtualScroll2DItem[] = [];
  private columns: VirtualScroll2DColumn[] = [];
  private scrollTop = 0;
  private scrollLeft = 0;
  private lastRange: VirtualScroll2DRange | null = null;

  // 动态尺寸支持
  private rowHeights = new Map<string | number, number>();
  private columnWidths = new Map<string | number, number>();
  private estimatedRowHeight: number;
  private estimatedColumnWidth: number;

  constructor(config: VirtualScroll2DConfig) {
    this.config = {
      bufferSize: 5,
      overscan: 2,
      fixedRowsTop: 0,
      fixedRowsBottom: 0,
      fixedColumnsLeft: 0,
      fixedColumnsRight: 0,
      ...config,
    };
    this.estimatedRowHeight = this.config.rowHeight;
    this.estimatedColumnWidth = this.config.columnWidth;
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<VirtualScroll2DConfig>): void {
    this.config = { ...this.config, ...config };
    this.lastRange = null;
  }

  /**
   * 设置行数据
   */
  setRows(rows: VirtualScroll2DItem[]): void {
    this.rows = rows;
    this.lastRange = null;
  }

  /**
   * 设置列数据
   */
  setColumns(columns: VirtualScroll2DColumn[]): void {
    this.columns = columns;
    this.lastRange = null;
  }

  /**
   * 更新滚动位置
   */
  updateScrollPosition(scrollTop: number, scrollLeft: number): VirtualScroll2DUpdateInfo {
    this.scrollTop = Math.max(0, scrollTop);
    this.scrollLeft = Math.max(0, scrollLeft);

    const range = this.calculateVisibleRange();
    const needsUpdate = this.shouldUpdateRange(range);

    if (needsUpdate) {
      this.lastRange = range;
    }

    return {
      range,
      scrollTop: this.scrollTop,
      scrollLeft: this.scrollLeft,
      scrollHeight: this.getTotalRowHeight(),
      scrollWidth: this.getTotalColumnWidth(),
      needsUpdate,
    };
  }

  /**
   * 计算可见范围
   */
  private calculateVisibleRange(): VirtualScroll2DRange {
    const {
      containerHeight,
      containerWidth,
      bufferSize,
      overscan,
      fixedRowsTop,
      fixedRowsBottom,
      fixedColumnsLeft,
      fixedColumnsRight,
    } = this.config;

    // 计算可见行范围
    const availableHeight =
      containerHeight - this.getFixedRowsHeight('top') - this.getFixedRowsHeight('bottom');

    const visibleRowCount = Math.ceil(availableHeight / this.estimatedRowHeight);
    const startRowIndex = Math.max(
      fixedRowsTop,
      Math.floor((this.scrollTop - this.getFixedRowsHeight('top')) / this.estimatedRowHeight)
    );

    const bufferedStartRowIndex = Math.max(fixedRowsTop, startRowIndex - bufferSize - overscan);
    const bufferedEndRowIndex = Math.min(
      this.rows.length - fixedRowsBottom,
      startRowIndex + visibleRowCount + bufferSize + overscan
    );

    // 计算可见列范围
    const availableWidth =
      containerWidth - this.getFixedColumnsWidth('left') - this.getFixedColumnsWidth('right');

    const visibleColumnCount = Math.ceil(availableWidth / this.estimatedColumnWidth);
    const startColumnIndex = Math.max(
      fixedColumnsLeft,
      Math.floor((this.scrollLeft - this.getFixedColumnsWidth('left')) / this.estimatedColumnWidth)
    );

    const bufferedStartColumnIndex = Math.max(
      fixedColumnsLeft,
      startColumnIndex - bufferSize - overscan
    );
    const bufferedEndColumnIndex = Math.min(
      this.columns.length - fixedColumnsRight,
      startColumnIndex + visibleColumnCount + bufferSize + overscan
    );

    // 获取固定区域数据
    const fixedRows = {
      top: this.rows.slice(0, fixedRowsTop),
      bottom: this.rows.slice(-fixedRowsBottom),
    };

    const fixedColumns = {
      left: this.columns.slice(0, fixedColumnsLeft),
      right: this.columns.slice(-fixedColumnsRight),
    };

    return {
      startRowIndex: bufferedStartRowIndex,
      endRowIndex: bufferedEndRowIndex,
      rowOffsetTop: this.getRowOffsetTop(bufferedStartRowIndex),
      totalRowHeight: this.getTotalRowHeight(),
      visibleRowCount,

      startColumnIndex: bufferedStartColumnIndex,
      endColumnIndex: bufferedEndColumnIndex,
      columnOffsetLeft: this.getColumnOffsetLeft(bufferedStartColumnIndex),
      totalColumnWidth: this.getTotalColumnWidth(),
      visibleColumnCount,

      fixedRows,
      fixedColumns,
    };
  }

  /**
   * 判断是否需要更新
   */
  private shouldUpdateRange(newRange: VirtualScroll2DRange): boolean {
    if (!this.lastRange) return true;

    const rowThreshold = Math.max(1, Math.floor(newRange.visibleRowCount * 0.5));
    const columnThreshold = Math.max(1, Math.floor(newRange.visibleColumnCount * 0.5));

    const rowChanged =
      Math.abs(newRange.startRowIndex - this.lastRange.startRowIndex) >= rowThreshold ||
      Math.abs(newRange.endRowIndex - this.lastRange.endRowIndex) >= rowThreshold;

    const columnChanged =
      Math.abs(newRange.startColumnIndex - this.lastRange.startColumnIndex) >= columnThreshold ||
      Math.abs(newRange.endColumnIndex - this.lastRange.endColumnIndex) >= columnThreshold;

    return rowChanged || columnChanged;
  }

  /**
   * 获取行的顶部偏移量
   */
  private getRowOffsetTop(index: number): number {
    if (index === 0) return 0;

    let offset = 0;
    for (let i = 0; i < index && i < this.rows.length; i++) {
      offset += this.getRowHeight(this.rows[i]);
    }
    return offset;
  }

  /**
   * 获取列的左侧偏移量
   */
  private getColumnOffsetLeft(index: number): number {
    if (index === 0) return 0;

    let offset = 0;
    for (let i = 0; i < index && i < this.columns.length; i++) {
      offset += this.getColumnWidth(this.columns[i]);
    }
    return offset;
  }

  /**
   * 获取总行高
   */
  private getTotalRowHeight(): number {
    return this.rows.reduce((total, row) => total + this.getRowHeight(row), 0);
  }

  /**
   * 获取总列宽
   */
  private getTotalColumnWidth(): number {
    return this.columns.reduce((total, column) => total + this.getColumnWidth(column), 0);
  }

  /**
   * 获取固定行的总高度
   */
  private getFixedRowsHeight(position: 'top' | 'bottom'): number {
    const count = position === 'top' ? this.config.fixedRowsTop : this.config.fixedRowsBottom;

    if (count === 0) return 0;

    const rows = position === 'top' ? this.rows.slice(0, count) : this.rows.slice(-count);

    return rows.reduce((total, row) => total + this.getRowHeight(row), 0);
  }

  /**
   * 获取固定列的总宽度
   */
  private getFixedColumnsWidth(position: 'left' | 'right'): number {
    const count =
      position === 'left' ? this.config.fixedColumnsLeft : this.config.fixedColumnsRight;

    if (count === 0) return 0;

    const columns = position === 'left' ? this.columns.slice(0, count) : this.columns.slice(-count);

    return columns.reduce((total, column) => total + this.getColumnWidth(column), 0);
  }

  /**
   * 获取行高
   */
  private getRowHeight(row: VirtualScroll2DItem): number {
    if (this.rowHeights.has(row.id)) {
      return this.rowHeights.get(row.id)!;
    }
    return row.height || this.config.rowHeight;
  }

  /**
   * 获取列宽
   */
  private getColumnWidth(column: VirtualScroll2DColumn): number {
    if (this.columnWidths.has(column.id)) {
      return this.columnWidths.get(column.id)!;
    }
    return column.width || this.config.columnWidth;
  }

  /**
   * 设置行高
   */
  setRowHeight(rowId: string | number, height: number): void {
    this.rowHeights.set(rowId, height);
    this.updateEstimatedRowHeight();
    this.lastRange = null;
  }

  /**
   * 设置列宽
   */
  setColumnWidth(columnId: string | number, width: number): void {
    this.columnWidths.set(columnId, width);
    this.updateEstimatedColumnWidth();
    this.lastRange = null;
  }

  /**
   * 更新预估行高
   */
  private updateEstimatedRowHeight(): void {
    if (this.rowHeights.size > 0) {
      const total = Array.from(this.rowHeights.values()).reduce((a, b) => a + b, 0);
      this.estimatedRowHeight = total / this.rowHeights.size;
    }
  }

  /**
   * 更新预估列宽
   */
  private updateEstimatedColumnWidth(): void {
    if (this.columnWidths.size > 0) {
      const total = Array.from(this.columnWidths.values()).reduce((a, b) => a + b, 0);
      this.estimatedColumnWidth = total / this.columnWidths.size;
    }
  }

  /**
   * 获取当前可见的行
   */
  getVisibleRows(): VirtualScroll2DItem[] {
    if (!this.lastRange) return [];

    const { startRowIndex, endRowIndex } = this.lastRange;
    return this.rows.slice(startRowIndex, endRowIndex);
  }

  /**
   * 获取当前可见的列
   */
  getVisibleColumns(): VirtualScroll2DColumn[] {
    if (!this.lastRange) return [];

    const { startColumnIndex, endColumnIndex } = this.lastRange;
    return this.columns.slice(startColumnIndex, endColumnIndex);
  }

  /**
   * 滚动到指定位置
   */
  scrollToCell(rowIndex: number, columnIndex: number): { scrollTop: number; scrollLeft: number } {
    const scrollTop = this.getRowOffsetTop(rowIndex);
    const scrollLeft = this.getColumnOffsetLeft(columnIndex);

    return { scrollTop, scrollLeft };
  }

  /**
   * 获取当前范围
   */
  getCurrentRange(): VirtualScroll2DRange | null {
    return this.lastRange;
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.lastRange = null;
    this.rowHeights.clear();
    this.columnWidths.clear();
    this.estimatedRowHeight = this.config.rowHeight;
    this.estimatedColumnWidth = this.config.columnWidth;
  }
}
