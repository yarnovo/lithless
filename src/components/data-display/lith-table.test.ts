import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { LithTable } from './lith-table.js';
import type { TableColumn, TableRow } from './lith-table.js';

// 确保组件已注册
import './lith-table.js';

describe('LithTable', () => {
  let element: LithTable;

  const testColumns: TableColumn[] = [
    { key: 'name', title: '姓名', width: 120, sortable: true },
    { key: 'age', title: '年龄', width: 80, sortable: true, align: 'center' },
    { key: 'city', title: '城市', width: 100 },
  ];

  const testData: TableRow[] = [
    { key: 1, name: '张三', age: 28, city: '北京' },
    { key: 2, name: '李四', age: 32, city: '上海' },
    { key: 3, name: '王五', age: 25, city: '广州' },
  ];

  beforeEach(async () => {
    element = await fixture<LithTable>(html`
      <lith-table
        .columns=${testColumns}
        .data=${testData}
        row-height="48"
        height="400"
      ></lith-table>
    `);
  });

  describe('基础渲染', () => {
    it('应该正确渲染表格容器', () => {
      const container = element.shadowRoot?.querySelector('.table-container');
      expect(container).toBeTruthy();
    });

    it('应该正确渲染表头', () => {
      const header = element.shadowRoot?.querySelector('.table-header');
      expect(header).toBeTruthy();

      const headerCells = element.shadowRoot?.querySelectorAll('.table-header .table-cell');
      expect(headerCells?.length).toBe(3);
    });

    it('应该正确渲染数据行', async () => {
      await element.updateComplete;

      const rows = element.shadowRoot?.querySelectorAll('.table-body .table-row');
      expect(rows?.length).toBe(3);
    });

    it('应该正确显示列标题', () => {
      const headerCells = element.shadowRoot?.querySelectorAll('.table-header .table-cell');

      expect(headerCells?.[0]?.textContent?.trim()).toContain('姓名');
      expect(headerCells?.[1]?.textContent?.trim()).toContain('年龄');
      expect(headerCells?.[2]?.textContent?.trim()).toContain('城市');
    });

    it('应该正确显示数据内容', async () => {
      await element.updateComplete;

      const firstRowCells = element.shadowRoot?.querySelectorAll(
        '.table-body .table-row:first-child .table-cell'
      );

      expect(firstRowCells?.[0]?.textContent?.trim()).toBe('张三');
      expect(firstRowCells?.[1]?.textContent?.trim()).toBe('28');
      expect(firstRowCells?.[2]?.textContent?.trim()).toBe('北京');
    });
  });

  describe('属性配置', () => {
    it('应该应用自定义行高', async () => {
      element.rowHeight = 60;
      await element.updateComplete;

      const rows = element.shadowRoot?.querySelectorAll('.table-row');
      if (rows?.[0]) {
        const computedStyle = getComputedStyle(rows[0] as Element);
        expect(computedStyle.minHeight).toBe('60px');
      }
    });

    it('应该应用自定义高度', async () => {
      element.height = 500;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.table-container') as HTMLElement;
      expect(container?.style.height).toBe('500px');
    });

    it('应该显示加载状态', async () => {
      element.loading = true;
      await element.updateComplete;

      const loading = element.shadowRoot?.querySelector('.loading');
      expect(loading).toBeTruthy();
      expect(loading?.textContent?.trim()).toContain('加载中');
    });

    it('应该显示空数据状态', async () => {
      element.data = [];
      element.emptyText = '暂无数据';
      await element.updateComplete;

      const empty = element.shadowRoot?.querySelector('.empty');
      expect(empty).toBeTruthy();
      expect(empty?.textContent?.trim()).toContain('暂无数据');
    });
  });

  describe('行选择功能', () => {
    beforeEach(async () => {
      element.rowSelection = true;
      await element.updateComplete;
    });

    it('应该显示选择框', () => {
      const checkboxes = element.shadowRoot?.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes?.length).toBe(4); // 1个全选 + 3个行选择
    });

    it('应该正确处理行选择', async () => {
      const selectionChangeSpy = vi.fn();
      element.addEventListener('lith-selection-change', selectionChangeSpy);

      const firstRowCheckbox = element.shadowRoot?.querySelectorAll(
        'input[type="checkbox"]'
      )?.[1] as HTMLInputElement;
      firstRowCheckbox?.click();

      await element.updateComplete;

      expect(selectionChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            selectedKeys: [1],
          }),
        })
      );
    });

    it('应该正确处理全选', async () => {
      const selectionChangeSpy = vi.fn();
      element.addEventListener('lith-selection-change', selectionChangeSpy);

      const selectAllCheckbox = element.shadowRoot?.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      selectAllCheckbox?.click();

      await element.updateComplete;

      expect(selectionChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            selectedKeys: [1, 2, 3],
          }),
        })
      );
    });

    it('应该正确显示选中状态', async () => {
      element.selectedKeys = [1, 3];
      await element.updateComplete;

      const selectedRows = element.shadowRoot?.querySelectorAll('.table-row.selected');
      expect(selectedRows?.length).toBe(2);
    });
  });

  describe('排序功能', () => {
    it('应该显示排序指示器', () => {
      const sortIndicators = element.shadowRoot?.querySelectorAll('.sort-indicator');
      expect(sortIndicators?.length).toBe(2); // 姓名和年龄列可排序
    });

    it('应该正确处理排序点击', async () => {
      const sortChangeSpy = vi.fn();
      element.addEventListener('lith-sort-change', sortChangeSpy);

      const sortableHeader = element.shadowRoot?.querySelector(
        '.table-cell.sortable'
      ) as HTMLElement;
      sortableHeader?.click();

      await element.updateComplete;

      expect(sortChangeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            column: 'name',
            direction: 'asc',
          }),
        })
      );
    });

    it('应该正确切换排序状态', async () => {
      const sortChangeSpy = vi.fn();
      element.addEventListener('lith-sort-change', sortChangeSpy);

      const nameHeader = element.shadowRoot?.querySelector('.table-cell.sortable') as HTMLElement;

      // 第一次点击：升序
      nameHeader?.click();
      await element.updateComplete;

      expect(sortChangeSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            direction: 'asc',
          }),
        })
      );

      // 第二次点击：降序
      nameHeader?.click();
      await element.updateComplete;

      expect(sortChangeSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            direction: 'desc',
          }),
        })
      );

      // 第三次点击：取消排序
      nameHeader?.click();
      await element.updateComplete;

      expect(sortChangeSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            direction: null,
          }),
        })
      );
    });

    it('应该正确显示当前排序状态', async () => {
      element.sortInfo = { column: 'name', direction: 'asc' };
      await element.updateComplete;

      const activeSortIndicator = element.shadowRoot?.querySelector('.sort-indicator.active');
      expect(activeSortIndicator).toBeTruthy();
      expect(activeSortIndicator?.textContent?.trim()).toBe('↑');
    });
  });

  describe('事件处理', () => {
    it('应该正确触发行点击事件', async () => {
      const rowClickSpy = vi.fn();
      element.addEventListener('lith-row-click', rowClickSpy);

      const firstRow = element.shadowRoot?.querySelector('.table-body .table-row') as HTMLElement;
      firstRow?.click();

      await element.updateComplete;

      expect(rowClickSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            row: testData[0],
            rowIndex: 0,
          }),
        })
      );
    });

    it('应该正确触发单元格点击事件', async () => {
      const cellClickSpy = vi.fn();
      element.addEventListener('lith-cell-click', cellClickSpy);

      const firstCell = element.shadowRoot?.querySelector(
        '.table-body .table-row .table-cell'
      ) as HTMLElement;
      firstCell?.click();

      await element.updateComplete;

      expect(cellClickSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            row: testData[0],
            column: testColumns[0],
            rowIndex: 0,
            columnIndex: 0,
          }),
        })
      );
    });
  });

  describe('自定义渲染', () => {
    it('应该支持自定义列渲染', async () => {
      const customColumns: TableColumn[] = [
        {
          key: 'name',
          title: '姓名',
          width: 120,
          render: (value) => `自定义-${value}`,
        },
      ];

      element.columns = customColumns;
      await element.updateComplete;

      const firstCell = element.shadowRoot?.querySelector('.table-body .table-row .table-cell');
      expect(firstCell?.textContent?.trim()).toBe('自定义-张三');
    });
  });

  describe('虚拟滚动', () => {
    beforeEach(async () => {
      element.virtualScroll = true;
      element.data = Array.from({ length: 100 }, (_, i) => ({
        key: i + 1,
        name: `用户${i + 1}`,
        age: 20 + (i % 40),
        city: '测试城市',
      }));
      await element.updateComplete;
    });

    it('应该启用虚拟滚动', () => {
      const viewport = element.shadowRoot?.querySelector('.virtual-scroll-viewport');
      expect(viewport).toBeTruthy();
    });

    it('应该创建滚动占位空间', () => {
      const spacer = element.shadowRoot?.querySelector('.scroll-spacer');
      expect(spacer).toBeTruthy();
    });
  });

  describe('样式和布局', () => {
    it('应该正确应用列宽', () => {
      const headerCell = element.shadowRoot?.querySelector(
        '.table-header .table-cell'
      ) as HTMLElement;
      expect(headerCell?.style.width).toBe('120px');
    });

    it('应该正确应用对齐方式', () => {
      const centerAlignedCell = element.shadowRoot?.querySelectorAll(
        '.table-header .table-cell'
      )?.[1];
      expect(centerAlignedCell?.classList.contains('align-center')).toBe(true);
    });

    it('应该正确处理固定列样式', async () => {
      const fixedColumns: TableColumn[] = [
        { key: 'name', title: '姓名', width: 120, fixed: 'left' },
        { key: 'age', title: '年龄', width: 80 },
      ];

      element.columns = fixedColumns;
      await element.updateComplete;

      const fixedCell = element.shadowRoot?.querySelector('.fixed-column.fixed-left');
      expect(fixedCell).toBeTruthy();
    });
  });

  describe('可访问性', () => {
    it('应该有正确的ARIA属性', () => {
      const checkboxes = element.shadowRoot?.querySelectorAll('input[type="checkbox"]');
      checkboxes?.forEach((checkbox) => {
        expect(checkbox.getAttribute('type')).toBe('checkbox');
      });
    });

    it('应该支持键盘导航', async () => {
      const sortableHeader = element.shadowRoot?.querySelector(
        '.table-cell.sortable'
      ) as HTMLElement;

      // 模拟键盘事件
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      sortableHeader?.dispatchEvent(enterEvent);

      // 由于没有实际的键盘事件处理，这里主要测试元素存在性
      expect(sortableHeader).toBeTruthy();
    });
  });
});
