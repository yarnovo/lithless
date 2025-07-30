import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/form/lith-virtual-scroll.js';
import type { LithVirtualScroll } from '../src/components/form/lith-virtual-scroll.js';
import type { VirtualScrollItem } from '../src/utils/virtual-scroll-core.js';

// 生成测试数据
const generateItems = (count: number): VirtualScrollItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    data: {
      name: `项目 ${index + 1}`,
      description: `这是第 ${index + 1} 个项目的描述`,
      value: Math.floor(Math.random() * 1000),
      type: ['primary', 'secondary', 'success', 'warning', 'danger'][index % 5],
    },
  }));
};

const meta: Meta<LithVirtualScroll> = {
  title: '组件/VirtualScroll 虚拟滚动',
  component: 'lith-virtual-scroll',
  parameters: {
    docs: {
      description: {
        component: `
虚拟滚动组件提供高性能的大列表渲染能力。

**特性：**
- 支持大量数据的高性能渲染
- 动态高度支持
- 缓冲区和overscan优化
- 响应式设计
- 自定义渲染支持
- 键盘导航和可访问性
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: false,
      description: '数据源数组',
    },
    itemHeight: {
      control: { type: 'number', min: 20, max: 200, step: 10 },
      description: '单项默认高度（像素）',
    },
    bufferSize: {
      control: { type: 'number', min: 0, max: 20, step: 1 },
      description: '缓冲区大小（上下各增加的项目数量）',
    },
    overscan: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
      description: '额外渲染的项目数量（性能优化）',
    },
    loading: {
      control: 'boolean',
      description: '加载状态',
    },
    emptyText: {
      control: 'text',
      description: '空状态文本',
    },
  },
};

export default meta;
type Story = StoryObj<LithVirtualScroll>;

// 基础示例
export const Default: Story = {
  args: {
    items: generateItems(10000),
    itemHeight: 60,
    bufferSize: 5,
    overscan: 2,
    loading: false,
    emptyText: '暂无数据',
  },
  render: (args) => html`
    <style>
      .virtual-scroll-demo {
        height: 400px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #fff;
      }

      .demo-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
        background: #fff;
        transition: background-color 0.2s;
      }

      .demo-item:hover {
        background-color: #f5f5f5;
      }

      .demo-item:last-child {
        border-bottom: none;
      }

      .item-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--item-color, #007bff);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        margin-right: 12px;
        font-size: 14px;
      }

      .item-content {
        flex: 1;
      }

      .item-name {
        font-weight: 600;
        margin-bottom: 4px;
        color: #333;
      }

      .item-description {
        color: #666;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .item-meta {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: #999;
      }

      .item-badge {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .type-primary {
        background: #e3f2fd;
        color: #1976d2;
      }
      .type-secondary {
        background: #f3e5f5;
        color: #7b1fa2;
      }
      .type-success {
        background: #e8f5e8;
        color: #388e3c;
      }
      .type-warning {
        background: #fff3e0;
        color: #f57c00;
      }
      .type-danger {
        background: #ffebee;
        color: #d32f2f;
      }
    </style>

    <div class="virtual-scroll-demo">
      <lith-virtual-scroll
        .items=${args.items}
        item-height="${args.itemHeight}"
        buffer-size="${args.bufferSize}"
        overscan="${args.overscan}"
        ?loading=${args.loading}
        empty-text="${args.emptyText}"
        @lith-render-item=${() => {
          // 这里我们不能直接修改渲染结果，因为事件是在渲染之后触发的
          // 实际使用中应该通过slot或者继承组件来自定义渲染
        }}
      >
        <!-- 实际项目中可以通过slot或者继承组件来自定义渲染 -->
      </lith-virtual-scroll>
    </div>
  `,
};

// 加载状态
export const Loading: Story = {
  args: {
    items: [],
    itemHeight: 60,
    loading: true,
  },
  render: (args) => html`
    <div class="virtual-scroll-demo" style="height: 300px; border: 1px solid #ddd;">
      <lith-virtual-scroll
        .items=${args.items}
        item-height="${args.itemHeight}"
        ?loading=${args.loading}
      >
        <div
          slot="loading"
          style="display: flex; align-items: center; justify-content: center; gap: 8px;"
        >
          <div
            style="width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"
          ></div>
          正在加载数据...
        </div>
      </lith-virtual-scroll>
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

// 空状态
export const Empty: Story = {
  args: {
    items: [],
    itemHeight: 60,
    loading: false,
    emptyText: '没有找到任何数据',
  },
  render: (args) => html`
    <div class="virtual-scroll-demo" style="height: 300px; border: 1px solid #ddd;">
      <lith-virtual-scroll
        .items=${args.items}
        item-height="${args.itemHeight}"
        ?loading=${args.loading}
        empty-text="${args.emptyText}"
      >
        <div
          slot="empty"
          style="display: flex; flex-direction: column; align-items: center; gap: 16px; color: #999;"
        >
          <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path
              d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4H6V.5ZM5 4.5H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1v-.5a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 5 4ZM4 6.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-5Z"
            />
          </svg>
          <div style="text-align: center;">
            <div style="font-weight: 600; margin-bottom: 4px;">暂无数据</div>
            <div style="font-size: 14px;">请尝试添加一些内容或调整筛选条件</div>
          </div>
        </div>
      </lith-virtual-scroll>
    </div>
  `,
};

// 不同高度的项目
export const DynamicHeight: Story = {
  args: {
    items: Array.from({ length: 1000 }, (_, index) => ({
      id: index,
      data: {
        name: `动态高度项目 ${index + 1}`,
        content:
          index % 3 === 0
            ? '这是一个较短的内容。'
            : index % 3 === 1
              ? '这是一个中等长度的内容，包含更多的文字描述，用来测试动态高度的功能是否正常工作。'
              : '这是一个很长的内容描述，包含大量的文字信息。它用来测试虚拟滚动组件是否能够正确处理不同高度的项目，确保滚动位置计算的准确性，以及用户体验的流畅性。这种情况在实际应用中很常见，比如社交媒体的动态列表、评论系统等场景。',
        type: ['short', 'medium', 'long'][index % 3],
      },
      height: [60, 100, 160][index % 3], // 不同的高度
    })),
    itemHeight: 80, // 平均高度
    bufferSize: 3,
  },
  render: (args) => html`
    <style>
      .dynamic-item {
        padding: 16px;
        border-bottom: 1px solid #eee;
        background: #fff;
        min-height: 60px;
      }

      .dynamic-item.short {
        background: #f8f9ff;
      }
      .dynamic-item.medium {
        background: #fff8f0;
      }
      .dynamic-item.long {
        background: #f0fff8;
      }

      .dynamic-item h4 {
        margin: 0 0 8px 0;
        color: #333;
      }

      .dynamic-item p {
        margin: 0;
        color: #666;
        line-height: 1.5;
      }
    </style>

    <div class="virtual-scroll-demo" style="height: 400px; border: 1px solid #ddd;">
      <lith-virtual-scroll
        .items=${args.items}
        item-height="${args.itemHeight}"
        buffer-size="${args.bufferSize}"
      >
        <!-- 实际项目中可以通过slot或继承来实现自定义渲染 -->
      </lith-virtual-scroll>
    </div>
  `,
};

// 小数据集
export const SmallDataset: Story = {
  args: {
    items: generateItems(50),
    itemHeight: 80,
    bufferSize: 10,
  },
  render: (args) => html`
    <div class="virtual-scroll-demo" style="height: 300px; border: 1px solid #ddd;">
      <lith-virtual-scroll
        .items=${args.items}
        item-height="${args.itemHeight}"
        buffer-size="${args.bufferSize}"
      ></lith-virtual-scroll>
    </div>
  `,
};

// 性能测试 - 超大数据集
export const LargeDataset: Story = {
  args: {
    items: generateItems(100000),
    itemHeight: 50,
    bufferSize: 10,
    overscan: 5,
  },
  render: (args) => html`
    <div
      style="margin-bottom: 16px; padding: 12px; background: #f0f8ff; border-radius: 6px; font-size: 14px;"
    >
      <strong>性能测试:</strong> 此示例包含 ${args.items.length.toLocaleString()}
      个项目，测试虚拟滚动的性能表现。
    </div>

    <div class="virtual-scroll-demo" style="height: 500px; border: 1px solid #ddd;">
      <lith-virtual-scroll
        .items=${args.items}
        item-height="${args.itemHeight}"
        buffer-size="${args.bufferSize}"
        overscan="${args.overscan}"
      ></lith-virtual-scroll>
    </div>
  `,
};
