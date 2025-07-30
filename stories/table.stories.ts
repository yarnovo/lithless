import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, within, userEvent, fn } from '@storybook/test';
import '../src/components/data-display/lith-table.js';
import type { TableColumn, TableRow } from '../src/components/data-display/lith-table.js';

interface TableArgs {
  columns: TableColumn[];
  data: TableRow[];
  rowHeight: number;
  headerHeight: number;
  loading: boolean;
  emptyText: string;
  rowSelection: boolean;
  selectedKeys: (string | number)[];
  virtualScroll: boolean;
  height: number;
  'sort-info': { column: string; direction: 'asc' | 'desc' } | null;
  onSelectionChange: (event: CustomEvent) => void;
  onSortChange: (event: CustomEvent) => void;
  onRowClick: (event: CustomEvent) => void;
  onCellClick: (event: CustomEvent) => void;
}

const basicColumns: TableColumn[] = [
  { key: 'name', title: '姓名', width: 120, sortable: true },
  { key: 'age', title: '年龄', width: 80, sortable: true, align: 'center' },
  { key: 'city', title: '城市', width: 100 },
  { key: 'email', title: '邮箱', width: 200, ellipsis: true },
  {
    key: 'status',
    title: '状态',
    width: 100,
    align: 'center',
    render: (value) => {
      const status = value as string;
      const color = status === 'active' ? '#10b981' : '#ef4444';
      const text = status === 'active' ? '激活' : '禁用';
      return html`<span style="color: ${color}; font-weight: 500;">${text}</span>`;
    },
  },
];

const basicData: TableRow[] = [
  { key: 1, name: '张三', age: 28, city: '北京', email: 'zhangsan@example.com', status: 'active' },
  { key: 2, name: '李四', age: 32, city: '上海', email: 'lisi@example.com', status: 'inactive' },
  { key: 3, name: '王五', age: 25, city: '广州', email: 'wangwu@example.com', status: 'active' },
  { key: 4, name: '赵六', age: 35, city: '深圳', email: 'zhaoliu@example.com', status: 'active' },
  { key: 5, name: '钱七', age: 29, city: '杭州', email: 'qianqi@example.com', status: 'inactive' },
];

const generateLargeData = (count: number): TableRow[] => {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆'];
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑一', '陈二'];
  const statuses = ['active', 'inactive'];

  return Array.from({ length: count }, (_, index) => ({
    key: index + 1,
    name: `${names[index % names.length]}${Math.floor(index / names.length) + 1}`,
    age: 20 + (index % 40),
    city: cities[index % cities.length],
    email: `user${index + 1}@example.com`,
    status: statuses[index % statuses.length],
  }));
};

const meta: Meta<TableArgs> = {
  title: 'Data Display/Table',
  component: 'lith-table',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
表格组件提供数据的结构化展示，支持排序、选择、虚拟滚动等功能。

## 功能特性

- **基础功能**: 数据展示、列配置、行选择、排序
- **虚拟滚动**: 支持大数据量的高性能渲染
- **自定义渲染**: 支持列内容自定义渲染
- **固定列**: 支持左右固定列（开发中）
- **响应式**: 自适应容器大小

## 使用场景

- 数据列表展示
- 管理后台表格
- 数据统计报表
- 大数据量展示
        `,
      },
    },
  },
  argTypes: {
    columns: {
      control: 'object',
      description: '表格列配置',
    },
    data: {
      control: 'object',
      description: '表格数据',
    },
    rowHeight: {
      control: { type: 'number', min: 24, max: 100, step: 4 },
      description: '行高',
    },
    headerHeight: {
      control: { type: 'number', min: 24, max: 100, step: 4 },
      description: '表头高度',
    },
    height: {
      control: { type: 'number', min: 200, max: 800, step: 50 },
      description: '表格高度',
    },
    loading: {
      control: 'boolean',
      description: '加载状态',
    },
    emptyText: {
      control: 'text',
      description: '空数据提示文本',
    },
    rowSelection: {
      control: 'boolean',
      description: '是否显示行选择',
    },
    selectedKeys: {
      control: 'object',
      description: '选中的行键值',
    },
    virtualScroll: {
      control: 'boolean',
      description: '是否启用虚拟滚动',
    },
    onSelectionChange: { action: 'selection-changed' },
    onSortChange: { action: 'sort-changed' },
    onRowClick: { action: 'row-clicked' },
    onCellClick: { action: 'cell-clicked' },
  },
  args: {
    columns: basicColumns,
    data: basicData,
    rowHeight: 48,
    headerHeight: 48,
    height: 400,
    loading: false,
    emptyText: '暂无数据',
    rowSelection: false,
    selectedKeys: [],
    virtualScroll: false,
    'sort-info': null,
    onSelectionChange: fn(),
    onSortChange: fn(),
    onRowClick: fn(),
    onCellClick: fn(),
  },
};

export default meta;
type Story = StoryObj<TableArgs>;

export const Default: Story = {
  name: '基础表格',
  args: {},
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // 等待组件渲染完成
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 检查表格是否正确渲染
    const tableContainer =
      canvas.getByRole('table', { name: '' }) || canvasElement.querySelector('.table-container');
    expect(tableContainer).toBeInTheDocument();

    // 检查表头
    const headers = canvasElement.querySelectorAll('.table-header .table-cell');
    expect(headers.length).toBe(5); // 5个列

    // 检查数据行
    const rows = canvasElement.querySelectorAll('.table-body .table-row');
    expect(rows.length).toBe(5); // 5行数据

    // 测试排序功能
    const sortableHeader = canvasElement.querySelector('.table-cell.sortable') as HTMLElement;
    if (sortableHeader) {
      await userEvent.click(sortableHeader);
      expect(args.onSortChange).toHaveBeenCalled();
    }

    // 测试行点击
    const firstRow = canvasElement.querySelector('.table-body .table-row') as HTMLElement;
    if (firstRow) {
      await userEvent.click(firstRow);
      expect(args.onRowClick).toHaveBeenCalled();
    }
  },
};

export const WithSelection: Story = {
  name: '行选择',
  args: {
    rowSelection: true,
    selectedKeys: [1, 3],
  },
  play: async ({ canvasElement, args }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 检查选择框
    const checkboxes = canvasElement.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(6); // 1个全选 + 5个行选择

    // 检查已选中状态
    const selectedRows = canvasElement.querySelectorAll('.table-row.selected');
    expect(selectedRows.length).toBe(2);

    // 测试全选
    const selectAllCheckbox = checkboxes[0] as HTMLInputElement;
    await userEvent.click(selectAllCheckbox);
    expect(args.onSelectionChange).toHaveBeenCalled();

    // 测试单行选择
    const firstRowCheckbox = checkboxes[1] as HTMLInputElement;
    await userEvent.click(firstRowCheckbox);
    expect(args.onSelectionChange).toHaveBeenCalledTimes(2);
  },
};

export const WithSorting: Story = {
  name: '排序功能',
  args: {
    'sort-info': { column: 'name', direction: 'asc' },
  },
  play: async ({ canvasElement, args }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 检查排序指示器
    const sortIndicators = canvasElement.querySelectorAll('.sort-indicator');
    expect(sortIndicators.length).toBeGreaterThan(0);

    // 检查激活的排序指示器
    const activeSortIndicator = canvasElement.querySelector('.sort-indicator.active');
    expect(activeSortIndicator).toBeInTheDocument();

    // 测试排序切换
    const nameHeader = canvasElement.querySelector('.table-cell.sortable') as HTMLElement;
    await userEvent.click(nameHeader);
    expect(args.onSortChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          column: 'name',
          direction: 'desc',
        }),
      })
    );
  },
};

export const Loading: Story = {
  name: '加载状态',
  args: {
    loading: true,
    data: [],
  },
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const loadingElement = canvasElement.querySelector('.loading');
    expect(loadingElement).toBeInTheDocument();
    expect(loadingElement).toHaveTextContent('加载中');
  },
};

export const Empty: Story = {
  name: '空数据',
  args: {
    data: [],
    emptyText: '没有找到相关数据',
  },
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const emptyElement = canvasElement.querySelector('.empty');
    expect(emptyElement).toBeInTheDocument();
    expect(emptyElement).toHaveTextContent('没有找到相关数据');
  },
};

export const VirtualScroll: Story = {
  name: '虚拟滚动',
  args: {
    data: generateLargeData(1000),
    virtualScroll: true,
    height: 400,
  },
  parameters: {
    docs: {
      description: {
        story: '启用虚拟滚动后，可以高性能渲染大量数据。这个示例包含1000行数据。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 检查虚拟滚动容器
    const virtualContainer = canvasElement.querySelector('.virtual-scroll-viewport');
    expect(virtualContainer).toBeInTheDocument();

    // 检查滚动区域
    const scrollSpacer = canvasElement.querySelector('.scroll-spacer');
    expect(scrollSpacer).toBeInTheDocument();

    // 验证只渲染了可见的行（而不是全部1000行）
    const visibleRows = canvasElement.querySelectorAll('.table-body .table-row');
    expect(visibleRows.length).toBeLessThan(50); // 应该远少于1000行
  },
};

export const CustomRender: Story = {
  name: '自定义渲染',
  args: {
    columns: [
      { key: 'name', title: '姓名', width: 120 },
      { key: 'age', title: '年龄', width: 80, align: 'center' },
      {
        key: 'avatar',
        title: '头像',
        width: 80,
        align: 'center',
        render: (_, row) => html`
          <div
            style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;"
          >
            ${(row.name as string).charAt(0)}
          </div>
        `,
      },
      {
        key: 'email',
        title: '联系方式',
        width: 200,
        render: (value, _row) => html`
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="font-weight: 500;">${value}</div>
            <div style="font-size: 12px; color: #6b7280;">
              手机: 138****${Math.floor(Math.random() * 9000) + 1000}
            </div>
          </div>
        `,
      },
      {
        key: 'actions',
        title: '操作',
        width: 120,
        align: 'center',
        render: () => html`
          <div style="display: flex; gap: 8px;">
            <button
              style="padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer; font-size: 12px;"
            >
              编辑
            </button>
            <button
              style="padding: 4px 8px; border: 1px solid #ef4444; border-radius: 4px; background: white; color: #ef4444; cursor: pointer; font-size: 12px;"
            >
              删除
            </button>
          </div>
        `,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 检查自定义渲染的头像
    const avatars = canvasElement.querySelectorAll('[style*="border-radius: 50%"]');
    expect(avatars.length).toBe(5);

    // 检查操作按钮
    const actionButtons = canvasElement.querySelectorAll('button');
    expect(actionButtons.length).toBe(10); // 5行 × 2个按钮

    // 测试操作按钮点击
    const editButton = actionButtons[0] as HTMLButtonElement;
    await userEvent.click(editButton);
  },
};

export const Playground: Story = {
  name: '交互演示',
  args: {
    rowSelection: true,
    virtualScroll: false,
    height: 350,
  },
  parameters: {
    docs: {
      description: {
        story: '这是一个完整的交互演示，包含所有主要功能。你可以尝试选择行、排序、点击等操作。',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 演示排序功能
    const nameHeader = canvasElement.querySelector('.table-cell.sortable') as HTMLElement;
    if (nameHeader) {
      await userEvent.click(nameHeader);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 再次点击切换为降序
      await userEvent.click(nameHeader);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // 演示行选择
    const checkboxes = canvasElement.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length > 1) {
      // 选择第一行
      await userEvent.click(checkboxes[1] as HTMLInputElement);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 选择第二行
      await userEvent.click(checkboxes[2] as HTMLInputElement);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    expect(args.onSortChange).toHaveBeenCalled();
    expect(args.onSelectionChange).toHaveBeenCalled();
  },
};
