import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, userEvent, fn } from '@storybook/test';
import '../src/components/data-display/lith-tree.js';
import '../src/components/data-display/lith-tree-item.js';
import type { LithTree, TreeNode } from '../src/components/data-display/lith-tree.js';

const meta: Meta<LithTree> = {
  title: 'Components/Tree',
  component: 'lith-tree',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A headless tree component that provides hierarchical data display functionality with complete interaction logic without any predefined styles.

## Features

- **Multiple Selection Modes**: Single, multiple, and checkbox selection with cascading
- **Keyboard Navigation**: Full keyboard support with arrow keys, Enter, Space, Home, End
- **Lazy Loading**: Support for dynamic loading of tree nodes
- **Accessibility**: Full ARIA support for screen readers
- **Expandable Items**: Collapsible tree nodes with custom icons
- **Form Integration**: Selected values can be used in forms
- **Customizable**: Style with CSS custom properties

## Usage

### Basic Usage
\`\`\`html
<lith-tree>
  <lith-tree-item value="1" label="Item 1">
    <lith-tree-item value="1-1" label="Item 1.1"></lith-tree-item>
    <lith-tree-item value="1-2" label="Item 1.2"></lith-tree-item>
  </lith-tree-item>
  <lith-tree-item value="2" label="Item 2">
    <lith-tree-item value="2-1" label="Item 2.1"></lith-tree-item>
  </lith-tree-item>
</lith-tree>
\`\`\`

### With Data
\`\`\`javascript
const treeData = [
  {
    value: '1',
    label: 'Documents',
    children: [
      { value: '1-1', label: 'Work' },
      { value: '1-2', label: 'Personal' }
    ]
  }
];

document.querySelector('lith-tree').data = treeData;
\`\`\`

## CSS Custom Properties

- \`--lith-tree-padding\`: Padding for the tree container
- \`--lith-tree-gap\`: Gap between tree items  
- \`--lith-tree-focus-ring-width\`: Focus ring width
- \`--lith-tree-focus-ring-offset\`: Focus ring offset
- \`--lith-tree-max-height\`: Maximum height of the tree
- \`--lith-tree-item-indent\`: Indentation per level
- \`--lith-tree-item-padding\`: Padding for item content
- \`--lith-tree-item-gap\`: Gap between expand button and content
- \`--lith-tree-item-transition-duration\`: Transition duration

## Events

- \`lith-selection-change\`: Fired when selection changes
- \`lith-toggle\`: Fired when a tree item is expanded/collapsed
- \`lith-lazy-load\`: Fired when lazy loading is needed
        `,
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Tree data as an array of TreeNode objects',
    },
    selectedValues: {
      control: 'object',
      description: 'Array of selected item values',
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple', 'checkbox'],
      description: 'Selection mode for tree items',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tree is disabled',
    },
    lazyLoading: {
      control: 'boolean',
      description: 'Whether to enable lazy loading',
    },
    expandOnClick: {
      control: 'boolean',
      description: 'Whether to expand items on click',
    },
    emptyText: {
      control: 'text',
      description: 'Text to show when tree is empty',
    },
    'lith-selection-change': {
      action: 'selection-changed',
      description: 'Fired when the selection changes',
    },
    'lith-toggle': {
      action: 'item-toggled',
      description: 'Fired when a tree item is expanded/collapsed',
    },
    'lith-lazy-load': {
      action: 'lazy-load',
      description: 'Fired when lazy loading is needed',
    },
  },
  args: {
    data: [],
    selectedValues: [],
    selectionMode: 'single',
    disabled: false,
    lazyLoading: false,
    expandOnClick: false,
    emptyText: 'No data available',
  },
};

export default meta;
type Story = StoryObj<LithTree>;

// Sample tree data
const sampleTreeData: TreeNode[] = [
  {
    value: 'documents',
    label: '📁 Documents',
    expanded: true,
    children: [
      {
        value: 'work',
        label: '💼 Work',
        children: [
          { value: 'reports', label: '📊 Reports' },
          { value: 'presentations', label: '📽️ Presentations' },
          { value: 'spreadsheets', label: '📈 Spreadsheets' },
        ],
      },
      {
        value: 'personal',
        label: '👤 Personal',
        children: [
          { value: 'photos', label: '🖼️ Photos' },
          { value: 'videos', label: '🎥 Videos' },
        ],
      },
    ],
  },
  {
    value: 'downloads',
    label: '📥 Downloads',
    children: [
      { value: 'software', label: '💿 Software' },
      { value: 'archives', label: '🗜️ Archives' },
    ],
  },
  {
    value: 'music',
    label: '🎵 Music',
    children: [
      { value: 'rock', label: '🎸 Rock' },
      { value: 'classical', label: '🎼 Classical' },
      { value: 'jazz', label: '🎺 Jazz' },
    ],
  },
];

export const Default: Story = {
  render: (args) => html`
    <div style="width: 300px; height: 400px; border: 1px solid #ccc; border-radius: 4px;">
      <lith-tree
        .data=${args.data}
        .selectedValues=${args.selectedValues}
        .selectionMode=${args.selectionMode}
        ?disabled=${args.disabled}
        ?lazy-loading=${args.lazyLoading}
        ?expand-on-click=${args.expandOnClick}
        empty-text=${args.emptyText}
        @lith-selection-change=${args['lith-selection-change']}
        @lith-toggle=${args['lith-toggle']}
        @lith-lazy-load=${args['lith-lazy-load']}
        style="
          --lith-tree-padding: 8px;
          --lith-tree-max-height: 380px;
          --lith-tree-item-padding: 8px 12px;
          --lith-tree-item-indent: 20px;
          --lith-tree-item-gap: 8px;
        "
      ></lith-tree>
    </div>
  `,
  args: {
    data: sampleTreeData,
  },
};

export const ManualStructure: Story = {
  render: (args) => html`
    <div style="width: 300px; height: 400px; border: 1px solid #ccc; border-radius: 4px;">
      <lith-tree
        .selectedValues=${args.selectedValues}
        .selectionMode=${args.selectionMode}
        ?disabled=${args.disabled}
        ?lazy-loading=${args.lazyLoading}
        ?expand-on-click=${args.expandOnClick}
        @lith-selection-change=${args['lith-selection-change']}
        @lith-toggle=${args['lith-toggle']}
        @lith-lazy-load=${args['lith-lazy-load']}
        style="
          --lith-tree-padding: 8px;
          --lith-tree-max-height: 380px;
          --lith-tree-item-padding: 8px 12px;
          --lith-tree-item-indent: 20px;
          --lith-tree-item-gap: 8px;
        "
      >
        <lith-tree-item value="documents" label="📁 Documents" expanded>
          <lith-tree-item value="work" label="💼 Work">
            <lith-tree-item value="reports" label="📊 Reports"></lith-tree-item>
            <lith-tree-item value="presentations" label="📽️ Presentations"></lith-tree-item>
            <lith-tree-item value="spreadsheets" label="📈 Spreadsheets"></lith-tree-item>
          </lith-tree-item>
          <lith-tree-item value="personal" label="👤 Personal">
            <lith-tree-item value="photos" label="🖼️ Photos"></lith-tree-item>
            <lith-tree-item value="videos" label="🎥 Videos"></lith-tree-item>
          </lith-tree-item>
        </lith-tree-item>
        <lith-tree-item value="downloads" label="📥 Downloads">
          <lith-tree-item value="software" label="💿 Software"></lith-tree-item>
          <lith-tree-item value="archives" label="🗜️ Archives"></lith-tree-item>
        </lith-tree-item>
        <lith-tree-item value="music" label="🎵 Music">
          <lith-tree-item value="rock" label="🎸 Rock"></lith-tree-item>
          <lith-tree-item value="classical" label="🎼 Classical"></lith-tree-item>
          <lith-tree-item value="jazz" label="🎺 Jazz"></lith-tree-item>
        </lith-tree-item>
      </lith-tree>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Tree created with manual HTML structure using lith-tree-item elements.',
      },
    },
  },
};

export const MultipleSelection: Story = {
  render: (args) => html`
    <div style="width: 300px; height: 400px; border: 1px solid #ccc; border-radius: 4px;">
      <lith-tree
        .data=${args.data}
        .selectedValues=${args.selectedValues}
        selection-mode="multiple"
        @lith-selection-change=${args['lith-selection-change']}
        @lith-toggle=${args['lith-toggle']}
        style="
          --lith-tree-padding: 8px;
          --lith-tree-max-height: 380px;
          --lith-tree-item-padding: 8px 12px;
          --lith-tree-item-indent: 20px;
          --lith-tree-item-gap: 8px;
        "
      ></lith-tree>
    </div>
  `,
  args: {
    data: sampleTreeData,
    selectedValues: ['reports', 'photos'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Tree with multiple selection enabled. Use Ctrl+Click to select multiple items.',
      },
    },
  },
};

export const CheckboxSelection: Story = {
  render: (args) => html`
    <div style="width: 300px; height: 400px; border: 1px solid #ccc; border-radius: 4px;">
      <lith-tree
        .data=${args.data}
        .selectedValues=${args.selectedValues}
        selection-mode="checkbox"
        @lith-selection-change=${args['lith-selection-change']}
        @lith-toggle=${args['lith-toggle']}
        style="
          --lith-tree-padding: 8px;
          --lith-tree-max-height: 380px;
          --lith-tree-item-padding: 8px 12px;
          --lith-tree-item-indent: 20px;
          --lith-tree-item-gap: 8px;
        "
      ></lith-tree>
    </div>
  `,
  args: {
    data: sampleTreeData,
    selectedValues: ['work'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Tree with checkbox-style selection that includes cascading selection behavior.',
      },
    },
  },
};

export const LazyLoading: Story = {
  render: (args) => {
    const handleLazyLoad = async (event: CustomEvent) => {
      const { value } = event.detail;
      const tree = event.target as LithTree;
      const item = tree.getItem(value);

      if (item) {
        // Simulate async loading
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add children based on value
        const childrenData = [
          { value: `${value}-1`, label: `${value} Child 1` },
          { value: `${value}-2`, label: `${value} Child 2` },
          { value: `${value}-3`, label: `${value} Child 3` },
        ];

        childrenData.forEach((childData) => {
          tree.addItem(childData, value);
        });

        item.setLoading(false);
      }

      args['lith-lazy-load']?.(event);
    };

    return html`
      <div style="width: 300px; height: 400px; border: 1px solid #ccc; border-radius: 4px;">
        <lith-tree
          lazy-loading
          @lith-selection-change=${args['lith-selection-change']}
          @lith-toggle=${args['lith-toggle']}
          @lith-lazy-load=${handleLazyLoad}
          style="
            --lith-tree-padding: 8px;
            --lith-tree-max-height: 380px;
            --lith-tree-item-padding: 8px 12px;
            --lith-tree-item-indent: 20px;
            --lith-tree-item-gap: 8px;
          "
        >
          <lith-tree-item value="lazy-1" label="🔄 Lazy Item 1" lazy-loading></lith-tree-item>
          <lith-tree-item value="lazy-2" label="🔄 Lazy Item 2" lazy-loading></lith-tree-item>
          <lith-tree-item value="lazy-3" label="🔄 Lazy Item 3" lazy-loading></lith-tree-item>
        </lith-tree>
      </div>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: 'Tree with lazy loading enabled. Children are loaded when items are expanded.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => html`
    <div style="width: 300px; height: 200px; border: 1px solid #ccc; border-radius: 4px;">
      <lith-tree
        .data=${[]}
        empty-text="No files found"
        style="
          --lith-tree-padding: 16px;
        "
      ></lith-tree>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Tree showing empty state when no data is provided.',
      },
    },
  },
};

export const CustomStyling: Story = {
  render: (args) => html`
    <div
      style="width: 350px; height: 400px; border: 2px solid #2563eb; border-radius: 8px; overflow: hidden;"
    >
      <lith-tree
        .data=${args.data}
        .selectedValues=${args.selectedValues}
        selection-mode="multiple"
        @lith-selection-change=${args['lith-selection-change']}
        @lith-toggle=${args['lith-toggle']}
        style="
          --lith-tree-padding: 12px;
          --lith-tree-max-height: 380px;
          --lith-tree-item-padding: 12px 16px;
          --lith-tree-item-indent: 24px;
          --lith-tree-item-gap: 12px;
          --lith-tree-focus-ring-width: 3px;
          --lith-tree-focus-ring-offset: 2px;
          --lith-tree-item-transition-duration: 300ms;
          background-color: #f8fafc;
          font-family: system-ui, -apple-system, sans-serif;
        "
      ></lith-tree>
    </div>
  `,
  args: {
    data: sampleTreeData,
    selectedValues: ['work', 'photos'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Tree with custom styling using CSS custom properties.',
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => html`
    <div style="width: 300px; height: 400px; border: 1px solid #ccc; border-radius: 4px;">
      <lith-tree
        .data=${args.data}
        disabled
        style="
          --lith-tree-padding: 8px;
          --lith-tree-max-height: 380px;
          --lith-tree-item-padding: 8px 12px;
          --lith-tree-item-indent: 20px;
          --lith-tree-item-gap: 8px;
        "
      ></lith-tree>
    </div>
  `,
  args: {
    data: sampleTreeData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled tree that cannot be interacted with.',
      },
    },
  },
};

// Interactive test story
export const InteractionTests: Story = {
  render: (args) => html`
    <div style="width: 300px; height: 400px; border: 1px solid #ccc; border-radius: 4px;">
      <lith-tree
        .data=${args.data}
        selection-mode="single"
        @lith-selection-change=${args['lith-selection-change']}
        @lith-toggle=${args['lith-toggle']}
        style="
          --lith-tree-padding: 8px;
          --lith-tree-max-height: 380px;
          --lith-tree-item-padding: 8px 12px;
          --lith-tree-item-indent: 20px;
          --lith-tree-item-gap: 8px;
        "
      ></lith-tree>
    </div>
  `,
  args: {
    data: sampleTreeData,
    'lith-selection-change': fn(),
    'lith-toggle': fn(),
  },
  play: async ({ canvasElement, args }) => {
    // Wait for component to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    const tree = canvasElement.querySelector('lith-tree') as LithTree;
    expect(tree).toBeInTheDocument();

    // Test that tree items are rendered
    const treeItems = tree.querySelectorAll('lith-tree-item');
    expect(treeItems.length).toBeGreaterThan(0);

    // Test expand functionality
    const documentsItem = tree.getItem('documents');
    expect(documentsItem).toBeTruthy();
    expect(documentsItem!.expanded).toBe(true);

    // Test collapsing
    documentsItem!.collapse();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(documentsItem!.expanded).toBe(false);

    // Test expanding
    documentsItem!.expand();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(documentsItem!.expanded).toBe(true);

    // Test selection
    const workItem = tree.getItem('work');
    expect(workItem).toBeTruthy();

    workItem!.select();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(args['lith-selection-change']).toHaveBeenCalled();
    expect(tree.selectedValues).toContain('work');

    // Test keyboard navigation
    tree.focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    // Test API methods
    tree.selectItem('reports');
    expect(tree.selectedValues).toContain('reports');

    tree.clearSelection();
    expect(tree.selectedValues).toHaveLength(0);

    tree.expandAll();
    const allItems = tree.getAllItems();
    const expandableItems = allItems.filter((item) => item.hasChildren);
    expandableItems.forEach((item) => {
      expect(item.expanded).toBe(true);
    });

    tree.collapseAll();
    expandableItems.forEach((item) => {
      expect(item.expanded).toBe(false);
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Automated interaction tests for the tree component.',
      },
    },
  },
};
