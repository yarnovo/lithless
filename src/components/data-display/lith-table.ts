import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  VirtualScroll2DCore,
  VirtualScroll2DItem,
  VirtualScroll2DColumn,
  VirtualScroll2DRange,
} from '../../utils/virtual-scroll-2d-core.js';

export interface TableColumn {
  key: string;
  title: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  fixed?: 'left' | 'right';
  sortable?: boolean;
  resizable?: boolean;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  render?: (value: unknown, record: TableRow, index: number) => unknown;
}

export interface TableRow {
  key: string | number;
  [columnKey: string]: unknown;
}

export interface SortInfo {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TableSelectionChangeEvent {
  selectedKeys: (string | number)[];
  selectedRows: TableRow[];
}

export interface TableSortChangeEvent {
  column: string;
  direction: 'asc' | 'desc' | null;
}

export interface TableCellClickEvent {
  row: TableRow;
  column: TableColumn;
  rowIndex: number;
  columnIndex: number;
}

@customElement('lith-table')
export class LithTable extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 1px solid var(--lith-table-border-color, #e1e5e9);
      border-radius: var(--lith-table-border-radius, 8px);
      overflow: hidden;
      background: var(--lith-table-bg, #ffffff);
      font-family: var(--lith-table-font-family, system-ui, -apple-system, sans-serif);
    }

    .table-container {
      position: relative;
      height: 100%;
      overflow: hidden;
    }

    .table-header {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--lith-table-header-bg, #f8fafc);
      border-bottom: 1px solid var(--lith-table-border-color, #e1e5e9);
    }

    .table-body {
      position: relative;
      overflow: auto;
      scrollbar-width: thin;
    }

    .table-row {
      display: flex;
      border-bottom: 1px solid var(--lith-table-border-color, #e1e5e9);
      min-height: var(--lith-table-row-height, 48px);
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background: var(--lith-table-row-hover-bg, #f1f5f9);
    }

    .table-row.selected {
      background: var(--lith-table-row-selected-bg, #eff6ff);
    }

    .table-cell {
      display: flex;
      align-items: center;
      padding: var(--lith-table-cell-padding, 12px 16px);
      border-right: 1px solid var(--lith-table-border-color, #e1e5e9);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: var(--lith-table-font-size, 14px);
      line-height: var(--lith-table-line-height, 1.5);
    }

    .table-cell:last-child {
      border-right: none;
    }

    .table-cell.align-center {
      justify-content: center;
    }

    .table-cell.align-right {
      justify-content: flex-end;
    }

    .table-header .table-cell {
      font-weight: var(--lith-table-header-font-weight, 600);
      color: var(--lith-table-header-color, #374151);
      background: var(--lith-table-header-bg, #f8fafc);
      cursor: default;
    }

    .table-header .table-cell.sortable {
      cursor: pointer;
      user-select: none;
    }

    .table-header .table-cell.sortable:hover {
      background: var(--lith-table-header-hover-bg, #e2e8f0);
    }

    .sort-indicator {
      margin-left: 8px;
      font-size: 12px;
      opacity: 0.6;
    }

    .sort-indicator.active {
      opacity: 1;
    }

    .checkbox-cell {
      width: 48px;
      min-width: 48px;
      max-width: 48px;
      padding: 8px 16px;
      justify-content: center;
    }

    .checkbox-cell input[type='checkbox'] {
      margin: 0;
      cursor: pointer;
    }

    .fixed-column {
      position: sticky;
      z-index: 5;
      background: inherit;
    }

    .fixed-column.fixed-left {
      left: 0;
    }

    .fixed-column.fixed-right {
      right: 0;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: var(--lith-table-loading-color, #64748b);
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: var(--lith-table-empty-color, #9ca3af);
    }

    .virtual-scroll-viewport {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      will-change: transform;
    }

    .scroll-spacer {
      position: relative;
      width: 100%;
    }
  `;

  @property({ type: Array }) columns: TableColumn[] = [];
  @property({ type: Array }) data: TableRow[] = [];
  @property({ type: Number, attribute: 'row-height' }) rowHeight = 48;
  @property({ type: Number, attribute: 'header-height' }) headerHeight = 48;
  @property({ type: Boolean }) loading = false;
  @property({ type: String, attribute: 'empty-text' }) emptyText = '暂无数据';
  @property({ type: Boolean, attribute: 'row-selection' }) rowSelection = false;
  @property({ type: Array, attribute: 'selected-keys' }) selectedKeys: (string | number)[] = [];
  @property({ type: Boolean, attribute: 'virtual-scroll' }) virtualScroll = true;
  @property({ type: Number, attribute: 'height' }) height = 400;
  @property({ type: Object }) sortInfo: SortInfo | null = null;

  @state() private virtualCore?: VirtualScroll2DCore;
  @state() private currentRange?: VirtualScroll2DRange;
  @state() private visibleRows: TableRow[] = [];
  @state() private visibleColumns: TableColumn[] = [];

  @query('.table-body') private tableBody!: HTMLElement;
  @query('.virtual-scroll-viewport') private viewport?: HTMLElement;

  private resizeObserver?: ResizeObserver;
  private scrollRAF?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this.setupResizeObserver();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
  }

  protected firstUpdated(): void {
    if (this.virtualScroll) {
      this.initializeVirtualScroll();
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('data') || changedProperties.has('columns')) {
      this.handleDataChange();
    }

    if (
      changedProperties.has('rowHeight') ||
      changedProperties.has('height') ||
      changedProperties.has('virtualScroll')
    ) {
      this.updateVirtualScrollConfig();
    }

    if (changedProperties.has('selectedKeys')) {
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
  }

  private initializeVirtualScroll(): void {
    if (!this.virtualScroll) return;

    const containerWidth = this.offsetWidth || 800;
    const containerHeight = this.height - this.headerHeight;

    this.virtualCore = new VirtualScroll2DCore({
      rowHeight: this.rowHeight,
      columnWidth: 120,
      containerWidth,
      containerHeight,
      bufferSize: 5,
      overscan: 2,
    });

    this.updateVirtualScrollData();
  }

  private updateVirtualScrollConfig(): void {
    if (!this.virtualCore || !this.virtualScroll) return;

    const containerWidth = this.offsetWidth || 800;
    const containerHeight = this.height - this.headerHeight;

    this.virtualCore.updateConfig({
      rowHeight: this.rowHeight,
      containerWidth,
      containerHeight,
    });

    this.updateVisibleItems();
  }

  private handleDataChange(): void {
    if (this.virtualScroll && this.virtualCore) {
      this.updateVirtualScrollData();
    } else {
      this.visibleRows = this.data;
      this.visibleColumns = this.columns;
    }
  }

  private updateVirtualScrollData(): void {
    if (!this.virtualCore) return;

    const rows: VirtualScroll2DItem[] = this.data.map((row) => ({
      id: row.key,
      data: row,
      height: this.rowHeight,
    }));

    const columns: VirtualScroll2DColumn[] = this.columns.map((column) => ({
      id: column.key,
      width: column.width || 120,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      fixed: column.fixed,
    }));

    this.virtualCore.setRows(rows);
    this.virtualCore.setColumns(columns);
    this.updateVisibleItems();
  }

  private handleResize(): void {
    if (!this.virtualCore || !this.virtualScroll) return;

    const containerWidth = this.offsetWidth || 800;
    const containerHeight = this.height - this.headerHeight;

    this.virtualCore.updateConfig({
      containerWidth,
      containerHeight,
    });

    this.updateVisibleItems();
  }

  private handleScroll = (event: Event): void => {
    if (!this.virtualScroll || !this.virtualCore) return;

    if (this.scrollRAF) {
      cancelAnimationFrame(this.scrollRAF);
    }

    this.scrollRAF = requestAnimationFrame(() => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const scrollTop = target.scrollTop || 0;
      const scrollLeft = target.scrollLeft || 0;
      this.updateScrollPosition(scrollTop, scrollLeft);
    });
  };

  private updateScrollPosition(scrollTop: number, scrollLeft: number): void {
    if (!this.virtualCore) return;

    const updateInfo = this.virtualCore.updateScrollPosition(scrollTop, scrollLeft);

    if (updateInfo.needsUpdate) {
      this.currentRange = updateInfo.range;
      this.visibleRows = this.virtualCore.getVisibleRows().map((item) => item.data as TableRow);
      this.visibleColumns = this.virtualCore.getVisibleColumns().map((col) => {
        return this.columns.find((column) => column.key === col.id) as TableColumn;
      });
      this.updateViewport();
    }
  }

  private updateVisibleItems(): void {
    if (!this.virtualCore || !this.tableBody) return;

    const scrollTop = this.tableBody.scrollTop || 0;
    const scrollLeft = this.tableBody.scrollLeft || 0;
    this.updateScrollPosition(scrollTop, scrollLeft);
  }

  private updateViewport(): void {
    if (!this.viewport || !this.currentRange || !this.virtualScroll) return;

    this.viewport.style.transform = `translate(${this.currentRange.columnOffsetLeft}px, ${this.currentRange.rowOffsetTop}px)`;
  }

  private handleHeaderClick(column: TableColumn): void {
    if (!column.sortable) return;

    let direction: 'asc' | 'desc' | null = 'asc';

    if (this.sortInfo?.column === column.key) {
      if (this.sortInfo.direction === 'asc') {
        direction = 'desc';
      } else if (this.sortInfo.direction === 'desc') {
        direction = null;
      }
    }

    const sortInfo = direction ? { column: column.key, direction } : null;
    this.sortInfo = sortInfo;

    this.dispatchEvent(
      new CustomEvent('lith-sort-change', {
        detail: { column: column.key, direction },
        bubbles: true,
      })
    );
  }

  private handleRowClick(row: TableRow, rowIndex: number): void {
    this.dispatchEvent(
      new CustomEvent('lith-row-click', {
        detail: { row, rowIndex },
        bubbles: true,
      })
    );
  }

  private handleCellClick(
    row: TableRow,
    column: TableColumn,
    rowIndex: number,
    columnIndex: number
  ): void {
    this.dispatchEvent(
      new CustomEvent('lith-cell-click', {
        detail: { row, column, rowIndex, columnIndex },
        bubbles: true,
      })
    );
  }

  private handleRowSelectionChange(key: string | number, checked: boolean): void {
    let newSelectedKeys = [...this.selectedKeys];

    if (checked) {
      if (!newSelectedKeys.includes(key)) {
        newSelectedKeys.push(key);
      }
    } else {
      newSelectedKeys = newSelectedKeys.filter((k) => k !== key);
    }

    this.selectedKeys = newSelectedKeys;

    const selectedRows = this.data.filter((row) => newSelectedKeys.includes(row.key));

    this.dispatchEvent(
      new CustomEvent('lith-selection-change', {
        detail: { selectedKeys: newSelectedKeys, selectedRows },
        bubbles: true,
      })
    );
  }

  private handleSelectAll(checked: boolean): void {
    const newSelectedKeys = checked ? this.data.map((row) => row.key) : [];
    this.selectedKeys = newSelectedKeys;

    const selectedRows = checked ? [...this.data] : [];

    this.dispatchEvent(
      new CustomEvent('lith-selection-change', {
        detail: { selectedKeys: newSelectedKeys, selectedRows },
        bubbles: true,
      })
    );
  }

  private renderCell(
    row: TableRow,
    column: TableColumn,
    rowIndex: number,
    _columnIndex: number
  ): unknown {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row, rowIndex);
    }

    return value;
  }

  private renderSortIndicator(column: TableColumn): unknown {
    if (!column.sortable) return '';

    const isActive = this.sortInfo?.column === column.key;
    const direction = isActive ? this.sortInfo?.direction : null;

    return html`
      <span class="sort-indicator ${classMap({ active: isActive })}">
        ${direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'}
      </span>
    `;
  }

  private renderHeader(): unknown {
    const columns = this.virtualScroll ? this.visibleColumns : this.columns;

    return html`
      <div class="table-header">
        <div class="table-row">
          ${this.rowSelection
            ? html`
                <div class="table-cell checkbox-cell">
                  <input
                    type="checkbox"
                    .checked=${this.selectedKeys.length === this.data.length &&
                    this.data.length > 0}
                    .indeterminate=${this.selectedKeys.length > 0 &&
                    this.selectedKeys.length < this.data.length}
                    @change=${(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      this.handleSelectAll(target.checked);
                    }}
                  />
                </div>
              `
            : ''}
          ${columns.map(
            (column) => html`
              <div
                class="table-cell ${classMap({
                  sortable: !!column.sortable,
                  [`align-${column.align || 'left'}`]: true,
                  'fixed-column': !!column.fixed,
                  [`fixed-${column.fixed}`]: !!column.fixed,
                })}"
                style=${styleMap({
                  width: `${column.width || 120}px`,
                  minWidth: `${column.minWidth || column.width || 120}px`,
                  maxWidth: column.maxWidth ? `${column.maxWidth}px` : 'none',
                })}
                @click=${() => this.handleHeaderClick(column)}
              >
                ${column.title} ${this.renderSortIndicator(column)}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private renderBody(): unknown {
    if (this.loading) {
      return html`
        <div class="loading">
          <slot name="loading">加载中...</slot>
        </div>
      `;
    }

    if (this.data.length === 0) {
      return html`
        <div class="empty">
          <slot name="empty">${this.emptyText}</slot>
        </div>
      `;
    }

    const rows = this.virtualScroll ? this.visibleRows : this.data;
    const columns = this.virtualScroll ? this.visibleColumns : this.columns;

    if (this.virtualScroll && this.currentRange) {
      const totalHeight = this.currentRange.totalRowHeight;
      const totalWidth = this.currentRange.totalColumnWidth;

      return html`
        <div
          class="table-body"
          style="height: ${this.height - this.headerHeight}px"
          @scroll=${this.handleScroll}
        >
          <div class="scroll-spacer" style="height: ${totalHeight}px; width: ${totalWidth}px;">
            <div class="virtual-scroll-viewport">
              ${rows.map((row, index) => this.renderRow(row, columns, index))}
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div class="table-body" style="height: ${this.height - this.headerHeight}px">
        ${rows.map((row, index) => this.renderRow(row, columns, index))}
      </div>
    `;
  }

  private renderRow(row: TableRow, columns: TableColumn[], index: number): unknown {
    const isSelected = this.selectedKeys.includes(row.key);

    return html`
      <div
        class="table-row ${classMap({ selected: isSelected })}"
        @click=${() => this.handleRowClick(row, index)}
      >
        ${this.rowSelection
          ? html`
              <div class="table-cell checkbox-cell">
                <input
                  type="checkbox"
                  .checked=${isSelected}
                  @change=${(e: Event) => {
                    const target = e.target as HTMLInputElement;
                    this.handleRowSelectionChange(row.key, target.checked);
                  }}
                  @click=${(e: Event) => e.stopPropagation()}
                />
              </div>
            `
          : ''}
        ${columns.map(
          (column, columnIndex) => html`
            <div
              class="table-cell ${classMap({
                [`align-${column.align || 'left'}`]: true,
                'fixed-column': !!column.fixed,
                [`fixed-${column.fixed}`]: !!column.fixed,
              })}"
              style=${styleMap({
                width: `${column.width || 120}px`,
                minWidth: `${column.minWidth || column.width || 120}px`,
                maxWidth: column.maxWidth ? `${column.maxWidth}px` : 'none',
              })}
              @click=${(e: Event) => {
                e.stopPropagation();
                this.handleCellClick(row, column, index, columnIndex);
              }}
            >
              ${this.renderCell(row, column, index, columnIndex)}
            </div>
          `
        )}
      </div>
    `;
  }

  protected render(): unknown {
    return html`
      <div class="table-container" style="height: ${this.height}px">
        ${this.renderHeader()} ${this.renderBody()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-table': LithTable;
  }
}
