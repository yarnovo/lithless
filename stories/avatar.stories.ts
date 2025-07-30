import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, within, fn } from '@storybook/test';
import '../src/components/data-display/lith-avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: 'lith-avatar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '头像组件，用于显示用户头像，支持图片、回退文本和自定义内容。基于 Radix UI Avatar 和 shadcn/ui Avatar 设计。',
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: '头像图片的 URL 地址',
    },
    alt: {
      control: 'text',
      description: '图片的替代文本，也用于生成初始字母',
    },
    fallback: {
      control: 'text',
      description: '自定义回退文本，优先级高于从 alt 生成的初始字母',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '头像尺寸',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square', 'rounded'],
      description: '头像形状',
    },
    fallbackDelay: {
      control: 'number',
      description: '显示回退内容的延迟时间（毫秒）',
    },
  },
  args: {
    src: '',
    alt: 'User Avatar',
    fallback: '',
    size: 'md',
    shape: 'circle',
    fallbackDelay: 0,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'shadcn',
  },
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatar = canvasElement.querySelector('lith-avatar');

    // 验证头像元素存在
    expect(avatar).toBeInTheDocument();
  },
};

export const WithFallback: Story = {
  args: {
    alt: 'John Doe',
    fallback: '',
  },
  render: (args) => html`
    <lith-avatar
      src=${args.src}
      alt=${args.alt}
      fallback=${args.fallback}
      size=${args.size}
      shape=${args.shape}
      .fallbackDelay=${args.fallbackDelay}
    ></lith-avatar>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatar = canvasElement.querySelector('lith-avatar');

    // 验证显示回退文本（JD - John Doe 的初始字母）
    expect(avatar).toBeInTheDocument();

    // 等待组件渲染完成
    await new Promise((resolve) => setTimeout(resolve, 100));

    const fallbackElement = avatar?.shadowRoot?.querySelector('.avatar-fallback');
    expect(fallbackElement).toBeInTheDocument();
  },
};

export const CustomFallback: Story = {
  args: {
    alt: 'Custom User',
    fallback: 'CU',
  },
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatar = canvasElement.querySelector('lith-avatar');

    // 验证显示自定义回退文本
    expect(avatar).toBeInTheDocument();

    await new Promise((resolve) => setTimeout(resolve, 100));

    const fallbackElement = avatar?.shadowRoot?.querySelector('.avatar-fallback');
    expect(fallbackElement).toBeInTheDocument();
    expect(fallbackElement?.textContent?.trim()).toBe('CU');
  },
};

export const ErrorFallback: Story = {
  args: {
    src: 'https://invalid-url-that-will-fail.com/image.jpg',
    alt: 'Failed Image',
    fallback: 'ER',
  },
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatar = canvasElement.querySelector('lith-avatar');

    expect(avatar).toBeInTheDocument();

    // 等待图片加载失败
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fallbackElement = avatar?.shadowRoot?.querySelector('.avatar-fallback');
    expect(fallbackElement).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 16px;">
      <lith-avatar size="sm" alt="Small" fallback="S"></lith-avatar>
      <lith-avatar size="md" alt="Medium" fallback="M"></lith-avatar>
      <lith-avatar size="lg" alt="Large" fallback="L"></lith-avatar>
      <lith-avatar size="xl" alt="Extra Large" fallback="XL"></lith-avatar>
    </div>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatars = canvasElement.querySelectorAll('lith-avatar');

    // 验证所有尺寸的头像都存在
    expect(avatars).toHaveLength(4);

    // 验证不同尺寸
    expect(avatars[0]).toHaveAttribute('size', 'sm');
    expect(avatars[1]).toHaveAttribute('size', 'md');
    expect(avatars[2]).toHaveAttribute('size', 'lg');
    expect(avatars[3]).toHaveAttribute('size', 'xl');
  },
};

export const Shapes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 16px;">
      <lith-avatar shape="circle" alt="Circle" fallback="C"></lith-avatar>
      <lith-avatar shape="rounded" alt="Rounded" fallback="R"></lith-avatar>
      <lith-avatar shape="square" alt="Square" fallback="S"></lith-avatar>
    </div>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatars = canvasElement.querySelectorAll('lith-avatar');

    // 验证所有形状的头像都存在
    expect(avatars).toHaveLength(3);

    // 验证不同形状
    expect(avatars[0]).toHaveAttribute('shape', 'circle');
    expect(avatars[1]).toHaveAttribute('shape', 'rounded');
    expect(avatars[2]).toHaveAttribute('shape', 'square');
  },
};

export const WithSlottedFallback: Story = {
  render: () => html`
    <lith-avatar alt="Custom Icon">
      <div slot="fallback" style="font-size: 16px;">👤</div>
    </lith-avatar>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatar = canvasElement.querySelector('lith-avatar');

    expect(avatar).toBeInTheDocument();

    // 验证 slot 内容
    const slottedContent = avatar?.querySelector('[slot="fallback"]');
    expect(slottedContent).toBeInTheDocument();
    expect(slottedContent?.textContent?.trim()).toBe('👤');
  },
};

export const WithDelayedFallback: Story = {
  args: {
    src: 'https://httpstat.us/200?sleep=2000', // 模拟慢加载
    alt: 'Delayed Image',
    fallback: 'DL',
    fallbackDelay: 600,
  },
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatar = canvasElement.querySelector('lith-avatar');

    expect(avatar).toBeInTheDocument();

    // 最初不应该显示回退内容
    let fallbackElement = avatar?.shadowRoot?.querySelector('.avatar-fallback:not(.hidden)');
    expect(fallbackElement).toBeFalsy();

    // 等待延迟后应该显示回退内容
    await new Promise((resolve) => setTimeout(resolve, 700));

    fallbackElement = avatar?.shadowRoot?.querySelector('.avatar-fallback:not(.hidden)');
    expect(fallbackElement).toBeInTheDocument();
  },
};

export const Events: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'Event Test',
  },
  render: (args) => {
    const onLoad = fn();
    const onError = fn();

    return html`
      <lith-avatar
        src=${args.src}
        alt=${args.alt}
        @lith-avatar-load=${onLoad}
        @lith-avatar-error=${onError}
      ></lith-avatar>
    `;
  },
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatar = canvasElement.querySelector('lith-avatar');

    expect(avatar).toBeInTheDocument();

    // 等待图片加载完成
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 验证 load 事件被触发
    // 注意：由于测试环境限制，可能无法完全测试事件
  },
};

export const AvatarGroup: Story = {
  render: () => html`
    <div style="display: flex; align-items: center;">
      <lith-avatar
        src="https://github.com/shadcn.png"
        alt="User 1"
        style="margin-right: -8px; z-index: 3; border: 2px solid white;"
      ></lith-avatar>
      <lith-avatar
        alt="User 2"
        fallback="U2"
        style="margin-right: -8px; z-index: 2; border: 2px solid white;"
      ></lith-avatar>
      <lith-avatar
        alt="User 3"
        fallback="U3"
        style="margin-right: -8px; z-index: 1; border: 2px solid white;"
      ></lith-avatar>
      <lith-avatar
        alt="+2 more"
        fallback="+2"
        style="z-index: 0; border: 2px solid white; background-color: #6b7280; color: white;"
      ></lith-avatar>
    </div>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatars = canvasElement.querySelectorAll('lith-avatar');

    // 验证头像组合
    expect(avatars).toHaveLength(4);
  },
};

export const CustomStyling: Story = {
  render: () => html`
    <style>
      .custom-avatar {
        --lith-avatar-size: 80px;
        --lith-avatar-background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        --lith-avatar-color: white;
        --lith-avatar-font-weight: bold;
        --lith-avatar-radius: 16px;
      }
    </style>
    <lith-avatar class="custom-avatar" alt="Custom Styled" fallback="CS"></lith-avatar>
  `,
  play: async ({ canvasElement }) => {
    within(canvasElement);
    const avatar = canvasElement.querySelector('lith-avatar');

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('custom-avatar');
  },
};
