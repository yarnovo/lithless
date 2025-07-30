import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, within, userEvent } from '@storybook/test';
import '../src/components/data-display/lith-list.js';
import '../src/components/data-display/lith-list-item.js';
import type { LithList, ListItem } from '../src/components/data-display/lith-list.js';

const meta: Meta<LithList> = {
  title: 'Data Display/List',
  component: 'lith-list',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
列表组件，支持虚拟滚动。提供完整的列表功能，包括选择、禁用、自定义渲染等。

## 特性

- ✅ 虚拟滚动支持，高性能处理大数据
- ✅ 单选和多选模式
- ✅ 键盘导航支持 
- ✅ 禁用状态
- ✅ 自定义渲染
- ✅ 可访问性支持

## 注意事项

- 组件需要指定高度才能正常工作
- 虚拟滚动需要固定的项目高度以获得最佳性能
- 支持键盘导航：方向键、Home、End、Enter、Space
        `,
      },
    },
  },
  argTypes: {
    items: {
      description: '列表数据项',
      control: { type: 'object' },
    },
    itemHeight: {
      description: '单个项目的高度（像素）',
      control: { type: 'number', min: 20, max: 200, step: 1 },
    },
    bufferSize: {
      description: '缓冲区大小（上下各增加的项目数量）',
      control: { type: 'number', min: 0, max: 20, step: 1 },
    },
    overscan: {
      description: '额外渲染的项目数量（性能优化）',
      control: { type: 'number', min: 0, max: 10, step: 1 },
    },
    loading: {
      description: '是否显示加载状态',
      control: { type: 'boolean' },
    },
    emptyText: {
      description: '空状态文本',
      control: { type: 'text' },
    },
    selectionMode: {
      description: '选择模式',
      control: { type: 'select' },
      options: ['none', 'single', 'multiple'],
    },
    selectedItems: {
      description: '已选中的项目ID列表',
      control: { type: 'object' },
    },
    showSelectionIndicator: {
      description: '是否显示选择指示器',
      control: { type: 'boolean' },
    },
    'lith-selection-change': {
      action: 'selection-changed',
      description: '选择变化事件',
    },
    'lith-item-click': {
      action: 'item-clicked',
      description: '项目点击事件',
    },
    'lith-scroll': {
      action: 'scrolled',
      description: '滚动事件',
    },
  },
};

export default meta;
type Story = StoryObj<LithList>;

// 生成测试数据
const generateItems = (count: number): ListItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    content: `列表项 ${i + 1}`,
    disabled: i % 10 === 9, // 每10个项目中有1个禁用
  }));
};

const simpleItems: ListItem[] = [
  { id: 1, content: '苹果' },
  { id: 2, content: '香蕉' },
  { id: 3, content: '橙子' },
  { id: 4, content: '葡萄', disabled: true },
  { id: 5, content: '草莓' },
];

const complexItems: ListItem[] = [
  { id: 1, content: { title: '用户管理', description: '管理系统用户和权限' } },
  { id: 2, content: { title: '数据分析', description: '查看和分析业务数据' } },
  { id: 3, content: { title: '系统设置', description: '配置系统参数和选项' } },
  { id: 4, content: { title: '报表导出', description: '导出各种格式的报表', disabled: true } },
  { id: 5, content: { title: '消息通知', description: '管理系统消息和通知' } },
];

export const Default: Story = {
  args: {
    items: simpleItems,
    itemHeight: 48,
    bufferSize: 5,
    overscan: 2,
    loading: false,
    emptyText: '暂无数据',
    selectionMode: 'none',
    selectedItems: [],
    showSelectionIndicator: false,
  },
  render: (args) => html`
    <div style="width: 400px; height: 300px;">
      <lith-list
        .items=${args.items}
        .itemHeight=${args.itemHeight}
        .bufferSize=${args.bufferSize}
        .overscan=${args.overscan}
        .loading=${args.loading}
        .emptyText=${args.emptyText}
        .selectionMode=${args.selectionMode}
        .selectedItems=${args.selectedItems}
        .showSelectionIndicator=${args.showSelectionIndicator}
        @lith-selection-change=${args['lith-selection-change']}
        @lith-item-click=${args['lith-item-click']}
        @lith-scroll=${args['lith-scroll']}
      ></lith-list>
    </div>
  `,
};

export const SingleSelection: Story = {
  args: {
    ...Default.args,
    selectionMode: 'single',
    showSelectionIndicator: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvasElement.querySelector('lith-list') as LithList;

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 点击第一个项目
    const firstItem = canvas.getByText('苹果').closest('.list-item') as HTMLElement;
    await userEvent.click(firstItem);

    // 验证选择状态
    await expect(list.selectedItems).toEqual([1]);

    // 点击第二个项目
    const secondItem = canvas.getByText('香蕉').closest('.list-item') as HTMLElement;
    await userEvent.click(secondItem);

    // 验证只选中了第二个项目
    await expect(list.selectedItems).toEqual([2]);
  },
};

export const MultipleSelection: Story = {
  args: {
    ...Default.args,
    selectionMode: 'multiple',
    showSelectionIndicator: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvasElement.querySelector('lith-list') as LithList;

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 点击第一个项目
    const firstItem = canvas.getByText('苹果').closest('.list-item') as HTMLElement;
    await userEvent.click(firstItem);

    // 验证选择状态
    await expect(list.selectedItems).toEqual([1]);

    // Ctrl+点击第二个项目
    const secondItem = canvas.getByText('香蕉').closest('.list-item') as HTMLElement;
    await userEvent.click(secondItem, { ctrlKey: true });

    // 验证两个项目都被选中
    await expect(list.selectedItems).toEqual([1, 2]);

    // 再次点击第一个项目取消选择
    await userEvent.click(firstItem);

    // 验证只剩下第二个项目被选中
    await expect(list.selectedItems).toEqual([2]);
  },
};

export const LargeDataset: Story = {
  args: {
    ...Default.args,
    items: generateItems(10000),
    selectionMode: 'multiple',
    showSelectionIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: '演示虚拟滚动处理大量数据（10,000项）的能力。',
      },
    },
  },
  render: (args) => html`
    <div style="width: 400px; height: 400px;">
      <lith-list
        .items=${args.items}
        .itemHeight=${args.itemHeight}
        .bufferSize=${args.bufferSize}
        .overscan=${args.overscan}
        .loading=${args.loading}
        .emptyText=${args.emptyText}
        .selectionMode=${args.selectionMode}
        .selectedItems=${args.selectedItems}
        .showSelectionIndicator=${args.showSelectionIndicator}
        @lith-selection-change=${args['lith-selection-change']}
        @lith-item-click=${args['lith-item-click']}
        @lith-scroll=${args['lith-scroll']}
      ></lith-list>
      <p style="margin-top: 10px; color: #666; font-size: 14px;">
        总计 ${args.items.length} 个项目，虚拟滚动渲染
      </p>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('lith-list') as LithList;

    await new Promise((resolve) => setTimeout(resolve, 200));

    // 测试滚动到指定索引
    list.scrollToIndex(5000, 'auto');

    await new Promise((resolve) => setTimeout(resolve, 500));

    // 验证滚动位置
    const scrollContainer = list.shadowRoot?.querySelector('.scroll-container') as HTMLElement;
    await expect(scrollContainer.scrollTop).toBeGreaterThan(200000);
  },
};

export const CustomContent: Story = {
  args: {
    ...Default.args,
    items: complexItems,
    itemHeight: 64,
  },
  render: (args) => html`
    <div style="width: 500px; height: 350px;">
      <lith-list
        .items=${args.items}
        .itemHeight=${args.itemHeight}
        .bufferSize=${args.bufferSize}
        .overscan=${args.overscan}
        .loading=${args.loading}
        .emptyText=${args.emptyText}
        .selectionMode=${args.selectionMode}
        .selectedItems=${args.selectedItems}
        .showSelectionIndicator=${args.showSelectionIndicator}
        @lith-selection-change=${args['lith-selection-change']}
        @lith-item-click=${args['lith-item-click']}
        @lith-scroll=${args['lith-scroll']}
      >
        <template slot="item" data-slot-scope="item,index">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="font-weight: 500; color: #333;">
              ${typeof item.content === 'object' && item.content
                ? item.content.title
                : item.content}
            </div>
            <div style="font-size: 14px; color: #666; line-height: 1.3;">
              ${typeof item.content === 'object' && item.content ? item.content.description : ''}
            </div>
          </div>
        </template>
      </lith-list>
    </div>
  `,
};

export const WithListItems: Story = {
  args: {
    items: [],
    selectionMode: 'single',
    showSelectionIndicator: true,
  },
  render: (args) => html`
    <div style="width: 400px; height: 300px;">
      <lith-list
        .selectionMode=${args.selectionMode}
        .showSelectionIndicator=${args.showSelectionIndicator}
        @lith-selection-change=${args['lith-selection-change']}
        @lith-item-click=${args['lith-item-click']}
      >
        <lith-list-item value="item1" title="用户管理" description="管理系统用户和权限">
          <span slot="prefix">👤</span>
        </lith-list-item>
        <lith-list-item value="item2" title="数据分析" description="查看和分析业务数据">
          <span slot="prefix">📊</span>
        </lith-list-item>
        <lith-list-item value="item3" title="系统设置" description="配置系统参数和选项">
          <span slot="prefix">⚙️</span>
        </lith-list-item>
        <lith-list-item value="item4" title="报表导出" description="导出各种格式的报表" disabled>
          <span slot="prefix">📄</span>
          <span slot="suffix" style="color: #ff9800;">禁用</span>
        </lith-list-item>
      </lith-list>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: '使用 lith-list-item 组件自定义列表项内容。',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    ...Default.args,
    items: [],
    loading: true,
  },
  render: (args) => html`
    <div style="width: 400px; height: 300px;">
      <lith-list .items=${args.items} .loading=${args.loading} .emptyText=${args.emptyText}>
        <div slot="loading" style="display: flex; align-items: center; gap: 8px;">
          <div
            style="width: 16px; height: 16px; border: 2px solid #e0e0e0; border-top: 2px solid #1976d2; border-radius: 50%; animation: spin 1s linear infinite;"
          ></div>
          正在加载数据...
        </div>
      </lith-list>
    </div>
    <style>
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    </style>
  `,
};

export const EmptyState: Story = {
  args: {
    ...Default.args,
    items: [],
    emptyText: '没有找到任何数据',
  },
  render: (args) => html`
    <div style="width: 400px; height: 300px;">
      <lith-list .items=${args.items} .loading=${args.loading} .emptyText=${args.emptyText}>
        <div
          slot="empty"
          style="display: flex; flex-direction: column; align-items: center; gap: 12px; color: #999;"
        >
          <div style="font-size: 48px;">📭</div>
          <div>暂无数据</div>
          <button
            style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;"
          >
            重新加载
          </button>
        </div>
      </lith-list>
    </div>
  `,
};

export const KeyboardNavigation: Story = {
  args: {
    ...Default.args,
    selectionMode: 'single',
    showSelectionIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
键盘导航支持：
- **方向键**: 上下移动焦点
- **Home**: 跳转到第一项
- **End**: 跳转到最后一项  
- **Enter/Space**: 选择当前焦点项
- **Tab**: 进入/离开列表
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('lith-list') as LithList;

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 聚焦列表
    const scrollContainer = list.shadowRoot?.querySelector('.scroll-container') as HTMLElement;
    scrollContainer.focus();

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 使用键盘导航
    await userEvent.keyboard('{ArrowDown}'); // 移动到第一项
    await new Promise((resolve) => setTimeout(resolve, 100));

    await userEvent.keyboard('{ArrowDown}'); // 移动到第二项
    await new Promise((resolve) => setTimeout(resolve, 100));

    await userEvent.keyboard('{Enter}'); // 选择当前项
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 验证选择状态
    await expect(list.selectedItems).toEqual([2]);
  },
};
