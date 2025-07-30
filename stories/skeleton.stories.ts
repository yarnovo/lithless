import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
// import { expect, within } from '@storybook/test';
import '../src/components/feedback/lith-skeleton';

const meta: Meta = {
  title: 'Components/Feedback/Skeleton',
  component: 'lith-skeleton',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Skeleton 组件用于在内容加载时显示占位符，提供良好的用户体验。对标 shadcn/ui 的 Skeleton 组件。

## 特性

- **多种变体** - 支持 default、text、circular、rounded 四种变体
- **自定义尺寸** - 支持通过 width 和 height 属性自定义尺寸
- **流畅动画** - 内置波浪式加载动画效果
- **可访问性** - 内置 ARIA 属性和语义化标签
- **主题适配** - 自动适配深色模式和高对比度模式
- **动画控制** - 支持禁用动画和响应用户动画偏好
- **灵活布局** - 可组合创建复杂的骨架屏布局

## CSS 自定义属性

可以通过 CSS 部件选择器自定义样式：
- \`::part(skeleton)\` - 骨架屏主体

## 可访问性

- 使用 \`role="status"\` 和 \`aria-live="polite"\` 为屏幕阅读器提供状态信息
- 支持自定义 \`aria-label\` 属性
- 响应 \`prefers-reduced-motion\` 用户偏好
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'text', 'circular', 'rounded'],
      description: '骨架屏变体',
    },
    width: {
      control: 'text',
      description: '自定义宽度（CSS 值）',
    },
    height: {
      control: 'text',
      description: '自定义高度（CSS 值）',
    },
    noAnimation: {
      control: 'boolean',
      description: '禁用动画效果',
    },
    respectMotionPreference: {
      control: 'boolean',
      description: '响应用户动画偏好设置',
    },
    ariaLabel: {
      control: 'text',
      description: '可访问性标签',
    },
  },
  args: {
    variant: 'default',
    width: '',
    height: '',
    noAnimation: false,
    respectMotionPreference: true,
    ariaLabel: 'Loading...',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <lith-skeleton
      variant=${args.variant}
      width=${args.width}
      height=${args.height}
      ?no-animation=${args.noAnimation}
      ?respect-motion-preference=${args.respectMotionPreference}
      aria-label=${args.ariaLabel}
    ></lith-skeleton>
  `,
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('lith-skeleton');
    expect(skeleton).toBeTruthy();

    const skeletonPart = skeleton?.shadowRoot?.querySelector('[part="skeleton"]');
    expect(skeletonPart).toBeTruthy();
    expect(skeletonPart?.getAttribute('role')).toBe('status');
    expect(skeletonPart?.getAttribute('aria-live')).toBe('polite');
  },
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      <div>
        <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
          Default
        </h3>
        <lith-skeleton variant="default"></lith-skeleton>
      </div>

      <div>
        <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
          Text
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <lith-skeleton variant="text" width="250px"></lith-skeleton>
          <lith-skeleton variant="text" width="200px"></lith-skeleton>
          <lith-skeleton variant="text" width="180px"></lith-skeleton>
        </div>
      </div>

      <div>
        <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
          Circular
        </h3>
        <div style="display: flex; gap: 0.5rem;">
          <lith-skeleton variant="circular"></lith-skeleton>
          <lith-skeleton variant="circular" width="3rem" height="3rem"></lith-skeleton>
          <lith-skeleton variant="circular" width="4rem" height="4rem"></lith-skeleton>
        </div>
      </div>

      <div>
        <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
          Rounded
        </h3>
        <lith-skeleton variant="rounded" width="200px" height="2rem"></lith-skeleton>
      </div>
    </div>
  `,
};

export const CustomSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      <div>
        <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
          Custom Width
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <lith-skeleton width="100px"></lith-skeleton>
          <lith-skeleton width="200px"></lith-skeleton>
          <lith-skeleton width="300px"></lith-skeleton>
        </div>
      </div>

      <div>
        <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
          Custom Height
        </h3>
        <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
          <lith-skeleton width="50px" height="1rem"></lith-skeleton>
          <lith-skeleton width="50px" height="2rem"></lith-skeleton>
          <lith-skeleton width="50px" height="3rem"></lith-skeleton>
        </div>
      </div>

      <div>
        <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
          Custom Dimensions
        </h3>
        <lith-skeleton width="150px" height="100px"></lith-skeleton>
      </div>
    </div>
  `,
};

export const ProfileCardSkeleton: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 300px;">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
        Profile Card Loading
      </h3>

      <div
        style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white;"
      >
        <!-- Header with avatar and name -->
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <lith-skeleton variant="circular" width="3rem" height="3rem"></lith-skeleton>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
            <lith-skeleton variant="text" width="120px"></lith-skeleton>
            <lith-skeleton variant="text" width="80px"></lith-skeleton>
          </div>
        </div>

        <!-- Bio text -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
          <lith-skeleton variant="text" width="100%"></lith-skeleton>
          <lith-skeleton variant="text" width="90%"></lith-skeleton>
          <lith-skeleton variant="text" width="75%"></lith-skeleton>
        </div>

        <!-- Action buttons -->
        <div style="display: flex; gap: 0.5rem;">
          <lith-skeleton variant="rounded" width="80px" height="2rem"></lith-skeleton>
          <lith-skeleton variant="rounded" width="80px" height="2rem"></lith-skeleton>
        </div>
      </div>
    </div>
  `,
};

export const ArticleListSkeleton: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px;">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
        Article List Loading
      </h3>

      ${Array.from(
        { length: 3 },
        () => html`
          <div
            style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white;"
          >
            <!-- Article title -->
            <lith-skeleton
              variant="text"
              width="80%"
              height="1.25rem"
              style="margin-bottom: 0.75rem;"
            ></lith-skeleton>

            <!-- Article excerpt -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
              <lith-skeleton variant="text" width="100%"></lith-skeleton>
              <lith-skeleton variant="text" width="95%"></lith-skeleton>
              <lith-skeleton variant="text" width="60%"></lith-skeleton>
            </div>

            <!-- Meta info -->
            <div style="display: flex; align-items: center; gap: 1rem;">
              <lith-skeleton variant="circular" width="1.5rem" height="1.5rem"></lith-skeleton>
              <lith-skeleton variant="text" width="80px"></lith-skeleton>
              <lith-skeleton variant="text" width="60px"></lith-skeleton>
            </div>
          </div>
        `
      )}
    </div>
  `,
};

export const TableSkeleton: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px;">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
        Table Loading
      </h3>

      <div
        style="border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; background: white;"
      >
        <!-- Table header -->
        <div
          style="display: grid; grid-template-columns: 1fr 1fr 1fr 100px; gap: 1rem; padding: 1rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb;"
        >
          <lith-skeleton variant="text" width="80px"></lith-skeleton>
          <lith-skeleton variant="text" width="60px"></lith-skeleton>
          <lith-skeleton variant="text" width="70px"></lith-skeleton>
          <lith-skeleton variant="text" width="50px"></lith-skeleton>
        </div>

        <!-- Table rows -->
        ${Array.from(
          { length: 5 },
          () => html`
            <div
              style="display: grid; grid-template-columns: 1fr 1fr 1fr 100px; gap: 1rem; padding: 1rem; border-bottom: 1px solid #e5e7eb;"
            >
              <lith-skeleton variant="text" width="120px"></lith-skeleton>
              <lith-skeleton variant="text" width="90px"></lith-skeleton>
              <lith-skeleton variant="text" width="100px"></lith-skeleton>
              <lith-skeleton variant="rounded" width="60px" height="1.5rem"></lith-skeleton>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

export const NoAnimation: Story = {
  args: {
    noAnimation: true,
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
        Without Animation
      </h3>

      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <lith-skeleton variant="default" ?no-animation=${args.noAnimation}></lith-skeleton>
        <lith-skeleton
          variant="text"
          width="200px"
          ?no-animation=${args.noAnimation}
        ></lith-skeleton>
        <lith-skeleton variant="circular" ?no-animation=${args.noAnimation}></lith-skeleton>
        <lith-skeleton
          variant="rounded"
          width="150px"
          ?no-animation=${args.noAnimation}
        ></lith-skeleton>
      </div>

      <p style="margin: 1rem 0 0 0; font-size: 0.75rem; color: #6b7280;">
        Animation is disabled. This is useful for users who prefer reduced motion.
      </p>
    </div>
  `,
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-skeleton::part(skeleton) {
        background: linear-gradient(90deg, #fef3c7 25%, #fbbf24 50%, #fef3c7 75%);
        background-size: 200% 100%;
        animation: custom-loading 2s infinite;
      }

      @keyframes custom-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      .gradient-skeleton::part(skeleton) {
        background: linear-gradient(45deg, #ec4899 25%, #8b5cf6 50%, #06b6d4 75%);
        background-size: 200% 100%;
        animation: gradient-loading 1s infinite;
      }

      @keyframes gradient-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    </style>

    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
        Custom Styling
      </h3>

      <div>
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.75rem; font-weight: 500; color: #6b7280;">
          Golden Theme
        </h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <lith-skeleton class="custom-skeleton" width="200px"></lith-skeleton>
          <lith-skeleton class="custom-skeleton" width="150px"></lith-skeleton>
          <lith-skeleton class="custom-skeleton" variant="circular"></lith-skeleton>
        </div>
      </div>

      <div>
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.75rem; font-weight: 500; color: #6b7280;">
          Gradient Theme
        </h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <lith-skeleton class="gradient-skeleton" width="200px"></lith-skeleton>
          <lith-skeleton class="gradient-skeleton" width="150px"></lith-skeleton>
          <lith-skeleton class="gradient-skeleton" variant="circular"></lith-skeleton>
        </div>
      </div>
    </div>
  `,
};

export const ResponsiveLayout: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 100%;">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600; color: #374151;">
        Responsive Layout
      </h3>

      <!-- Desktop layout simulation -->
      <div
        style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white;"
      >
        <h4 style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #6b7280;">Desktop View</h4>
        <div
          style="display: grid; grid-template-columns: 200px 1fr 150px; gap: 1rem; align-items: start;"
        >
          <!-- Sidebar -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <lith-skeleton variant="text" width="100%"></lith-skeleton>
            <lith-skeleton variant="text" width="80%"></lith-skeleton>
            <lith-skeleton variant="text" width="90%"></lith-skeleton>
          </div>

          <!-- Main content -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <lith-skeleton variant="text" width="60%" height="1.5rem"></lith-skeleton>
            <lith-skeleton variant="text" width="100%"></lith-skeleton>
            <lith-skeleton variant="text" width="95%"></lith-skeleton>
            <lith-skeleton variant="text" width="80%"></lith-skeleton>
            <lith-skeleton variant="rounded" width="200px" height="3rem"></lith-skeleton>
          </div>

          <!-- Right sidebar -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <lith-skeleton variant="circular" width="2rem" height="2rem"></lith-skeleton>
            <lith-skeleton variant="text" width="100%"></lith-skeleton>
            <lith-skeleton variant="text" width="70%"></lith-skeleton>
          </div>
        </div>
      </div>

      <!-- Mobile layout simulation -->
      <div
        style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white; max-width: 320px;"
      >
        <h4 style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #6b7280;">Mobile View</h4>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- Header -->
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <lith-skeleton variant="circular" width="2rem" height="2rem"></lith-skeleton>
            <lith-skeleton variant="text" width="120px"></lith-skeleton>
          </div>

          <!-- Content -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <lith-skeleton variant="text" width="100%"></lith-skeleton>
            <lith-skeleton variant="text" width="90%"></lith-skeleton>
            <lith-skeleton variant="text" width="75%"></lith-skeleton>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 0.5rem;">
            <lith-skeleton variant="rounded" width="80px" height="2rem"></lith-skeleton>
            <lith-skeleton variant="rounded" width="60px" height="2rem"></lith-skeleton>
          </div>
        </div>
      </div>
    </div>
  `,
};
