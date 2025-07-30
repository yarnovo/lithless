import { expect, test, describe, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '@testing-library/jest-dom/vitest';
import './lith-tree.js';
import './lith-tree-item.js';
import type { LithTree, TreeNode } from './lith-tree.js';

describe('LithTree', () => {
  let tree: LithTree;

  beforeEach(async () => {
    tree = await fixture<LithTree>(html`<lith-tree></lith-tree>`);
  });

  test('should render with default properties', () => {
    expect(tree).toBeInTheDocument();
    expect(tree.data).toEqual([]);
    expect(tree.selectedValues).toEqual([]);
    expect(tree.selectionMode).toBe('single');
    expect(tree.disabled).toBe(false);
    expect(tree.lazyLoading).toBe(false);
    expect(tree.expandOnClick).toBe(false);
    expect(tree.emptyText).toBe('No data available');
  });

  test('should have correct ARIA attributes', () => {
    expect(tree.getAttribute('role')).toBe('tree');
    expect(tree.tabIndex).toBe(0);
  });

  test('should show empty state when no data', async () => {
    await tree.updateComplete;
    const emptySlot = tree.shadowRoot?.querySelector('.empty');
    expect(emptySlot).toBeInTheDocument();
  });

  test('should render tree from data', async () => {
    const testData: TreeNode[] = [
      {
        value: 'item1',
        label: 'Item 1',
        children: [
          { value: 'item1-1', label: 'Item 1.1' },
          { value: 'item1-2', label: 'Item 1.2' },
        ],
      },
      { value: 'item2', label: 'Item 2' },
    ];

    tree.data = testData;
    await tree.updateComplete;

    const treeItems = tree.querySelectorAll('lith-tree-item');
    expect(treeItems).toHaveLength(4); // 2 root + 2 children

    const rootItem = tree.getItem('item1');
    expect(rootItem).toBeTruthy();
    expect(rootItem!.label).toBe('Item 1');
    expect(rootItem!.hasChildren).toBe(true);
  });

  test('should handle manual HTML structure', async () => {
    tree = await fixture<LithTree>(html`
      <lith-tree>
        <lith-tree-item value="1" label="Item 1">
          <lith-tree-item value="1-1" label="Item 1.1"></lith-tree-item>
        </lith-tree-item>
        <lith-tree-item value="2" label="Item 2"></lith-tree-item>
      </lith-tree>
    `);

    await tree.updateComplete;

    const items = tree.getAllItems();
    expect(items).toHaveLength(3);

    const item1 = tree.getItem('1');
    expect(item1).toBeTruthy();
    expect(item1!.hasChildren).toBe(true);
  });

  describe('Selection', () => {
    let testData: TreeNode[];

    beforeEach(async () => {
      testData = [
        {
          value: 'item1',
          label: 'Item 1',
          children: [
            { value: 'item1-1', label: 'Item 1.1' },
            { value: 'item1-2', label: 'Item 1.2' },
          ],
        },
        { value: 'item2', label: 'Item 2' },
      ];
      tree.data = testData;
      await tree.updateComplete;
    });

    test('should handle single selection', async () => {
      tree.selectionMode = 'single';
      const selectionHandler = vi.fn();
      tree.addEventListener('lith-selection-change', selectionHandler);

      tree.selectItem('item1');
      await tree.updateComplete;

      expect(tree.selectedValues).toEqual(['item1']);
      expect(selectionHandler).toHaveBeenCalledTimes(1);

      // Select another item should deselect the first
      tree.selectItem('item2');
      await tree.updateComplete;

      expect(tree.selectedValues).toEqual(['item2']);
    });

    test('should handle multiple selection', async () => {
      tree.selectionMode = 'multiple';
      const selectionHandler = vi.fn();
      tree.addEventListener('lith-selection-change', selectionHandler);

      tree.selectItem('item1');
      tree.selectItem('item2');
      await tree.updateComplete;

      expect(tree.selectedValues).toContain('item1');
      expect(tree.selectedValues).toContain('item2');
      expect(selectionHandler).toHaveBeenCalledTimes(2);
    });

    test('should handle checkbox selection with cascading', async () => {
      tree.selectionMode = 'checkbox';

      tree.selectItem('item1');
      await tree.updateComplete;

      // Should also select children
      expect(tree.selectedValues).toContain('item1');
      expect(tree.selectedValues).toContain('item1-1');
      expect(tree.selectedValues).toContain('item1-2');
    });

    test('should clear selection', async () => {
      tree.selectItems(['item1', 'item2']);
      await tree.updateComplete;

      expect(tree.selectedValues).toHaveLength(2);

      tree.clearSelection();
      await tree.updateComplete;

      expect(tree.selectedValues).toHaveLength(0);
    });

    test('should deselect item', async () => {
      tree.selectItem('item1');
      await tree.updateComplete;
      expect(tree.selectedValues).toContain('item1');

      tree.deselectItem('item1');
      await tree.updateComplete;
      expect(tree.selectedValues).not.toContain('item1');
    });
  });

  describe('Expansion', () => {
    let testData: TreeNode[];

    beforeEach(async () => {
      testData = [
        {
          value: 'item1',
          label: 'Item 1',
          expanded: false,
          children: [{ value: 'item1-1', label: 'Item 1.1' }],
        },
      ];
      tree.data = testData;
      await tree.updateComplete;
    });

    test('should expand item', async () => {
      const toggleHandler = vi.fn();
      tree.addEventListener('lith-toggle', toggleHandler);

      const item = tree.getItem('item1');
      expect(item!.expanded).toBe(false);

      tree.expandItem('item1');
      await tree.updateComplete;

      expect(item!.expanded).toBe(true);
      expect(toggleHandler).toHaveBeenCalled();
    });

    test('should collapse item', async () => {
      const item = tree.getItem('item1');
      item!.expanded = true;
      await tree.updateComplete;

      tree.collapseItem('item1');
      await tree.updateComplete;

      expect(item!.expanded).toBe(false);
    });

    test('should expand all items', async () => {
      tree.expandAll();
      await tree.updateComplete;

      const items = tree.getAllItems();
      const expandableItems = items.filter((item) => item.hasChildren);
      expandableItems.forEach((item) => {
        expect(item.expanded).toBe(true);
      });
    });

    test('should collapse all items', async () => {
      // First expand all
      tree.expandAll();
      await tree.updateComplete;

      // Then collapse all
      tree.collapseAll();
      await tree.updateComplete;

      const items = tree.getAllItems();
      items.forEach((item) => {
        expect(item.expanded).toBe(false);
      });
    });
  });

  describe('Dynamic Operations', () => {
    beforeEach(async () => {
      const testData: TreeNode[] = [{ value: 'item1', label: 'Item 1' }];
      tree.data = testData;
      await tree.updateComplete;
    });

    test('should add item', async () => {
      const newItem: TreeNode = { value: 'item2', label: 'Item 2' };

      tree.addItem(newItem);
      await tree.updateComplete;

      const items = tree.getAllItems();
      expect(items).toHaveLength(2);

      const addedItem = tree.getItem('item2');
      expect(addedItem).toBeTruthy();
      expect(addedItem!.label).toBe('Item 2');
    });

    test('should add child item', async () => {
      const childItem: TreeNode = { value: 'item1-1', label: 'Item 1.1' };

      tree.addItem(childItem, 'item1');
      await tree.updateComplete;

      const parentItem = tree.getItem('item1');
      expect(parentItem!.hasChildren).toBe(true);

      const childElement = tree.getItem('item1-1');
      expect(childElement).toBeTruthy();
    });

    test('should remove item', async () => {
      tree.removeItem('item1');
      await tree.updateComplete;

      const items = tree.getAllItems();
      expect(items).toHaveLength(0);

      const removedItem = tree.getItem('item1');
      expect(removedItem).toBeUndefined();
    });

    test('should update data', async () => {
      const newData: TreeNode[] = [
        { value: 'new1', label: 'New Item 1' },
        { value: 'new2', label: 'New Item 2' },
      ];

      tree.updateData(newData);
      await tree.updateComplete;

      const items = tree.getAllItems();
      expect(items).toHaveLength(2);

      expect(tree.getItem('new1')).toBeTruthy();
      expect(tree.getItem('new2')).toBeTruthy();
      expect(tree.getItem('item1')).toBeUndefined();
    });
  });

  describe('Lazy Loading', () => {
    test('should handle lazy loading', async () => {
      tree.lazyLoading = true;

      tree = await fixture<LithTree>(html`
        <lith-tree lazy-loading>
          <lith-tree-item value="lazy1" label="Lazy Item" lazy-loading></lith-tree-item>
        </lith-tree>
      `);

      const lazyLoadHandler = vi.fn();
      tree.addEventListener('lith-lazy-load', lazyLoadHandler);

      const lazyItem = tree.getItem('lazy1');
      expect(lazyItem).toBeTruthy();

      // Trigger lazy loading
      lazyItem!.expand();
      await tree.updateComplete;

      expect(lazyLoadHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            value: 'lazy1',
            level: 0,
          }),
        })
      );
    });
  });

  describe('Disabled State', () => {
    test('should handle disabled state', async () => {
      tree.disabled = true;
      await tree.updateComplete;

      expect(tree.hasAttribute('disabled')).toBe(true);
    });

    test('should disable all items when tree is disabled', async () => {
      const testData: TreeNode[] = [
        { value: 'item1', label: 'Item 1' },
        { value: 'item2', label: 'Item 2' },
      ];
      tree.data = testData;
      await tree.updateComplete;

      tree.disabled = true;
      await tree.updateComplete;

      const items = tree.getAllItems();
      items.forEach((item) => {
        expect(item.disabled).toBe(true);
      });
    });
  });

  describe('Focus Management', () => {
    let testData: TreeNode[];

    beforeEach(async () => {
      testData = [
        { value: 'item1', label: 'Item 1' },
        { value: 'item2', label: 'Item 2' },
      ];
      tree.data = testData;
      await tree.updateComplete;
    });

    test('should focus first item when tree is focused', async () => {
      tree.focus();
      await tree.updateComplete;

      const firstItem = tree.getItem('item1');
      expect(document.activeElement).toBe(firstItem);
    });

    test('should handle keyboard navigation', async () => {
      tree.focus();
      await tree.updateComplete;

      // Test arrow down
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      tree.dispatchEvent(event);
      await tree.updateComplete;

      // Should focus first item
      const firstItem = tree.getItem('item1');
      expect(firstItem!.tabIndex).toBe(0);
    });
  });

  describe('API Methods', () => {
    let testData: TreeNode[];

    beforeEach(async () => {
      testData = [
        {
          value: 'item1',
          label: 'Item 1',
          selected: true,
          children: [{ value: 'item1-1', label: 'Item 1.1' }],
        },
        { value: 'item2', label: 'Item 2', selected: true },
      ];
      tree.data = testData;
      await tree.updateComplete;
    });

    test('should get selected items', () => {
      const selectedItems = tree.getSelectedItems();
      expect(selectedItems).toHaveLength(2);
      expect(selectedItems.map((item) => item.value)).toEqual(['item1', 'item2']);
    });

    test('should get selected values', () => {
      const selectedValues = tree.getSelectedValues();
      expect(selectedValues).toEqual(['item1', 'item2']);
    });

    test('should get all items', () => {
      const allItems = tree.getAllItems();
      expect(allItems).toHaveLength(3); // 2 root + 1 child
    });

    test('should get item by value', () => {
      const item = tree.getItem('item1-1');
      expect(item).toBeTruthy();
      expect(item!.label).toBe('Item 1.1');
    });
  });

  describe('Events', () => {
    test('should emit selection change event', async () => {
      const selectionHandler = vi.fn();
      tree.addEventListener('lith-selection-change', selectionHandler);

      tree.data = [{ value: 'item1', label: 'Item 1' }];
      await tree.updateComplete;

      const item = tree.getItem('item1');
      item!.select();
      await tree.updateComplete;

      expect(selectionHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            selectedValues: ['item1'],
            lastSelectedValue: 'item1',
            action: 'select',
          }),
        })
      );
    });

    test('should emit toggle event', async () => {
      const toggleHandler = vi.fn();
      tree.addEventListener('lith-toggle', toggleHandler);

      tree.data = [
        {
          value: 'item1',
          label: 'Item 1',
          children: [{ value: 'item1-1', label: 'Item 1.1' }],
        },
      ];
      await tree.updateComplete;

      const item = tree.getItem('item1');
      item!.toggle();
      await tree.updateComplete;

      expect(toggleHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            expanded: true,
            value: 'item1',
            level: 0,
          }),
        })
      );
    });

    test('should emit focus and blur events', async () => {
      const focusHandler = vi.fn();
      const blurHandler = vi.fn();

      tree.addEventListener('lith-focus', focusHandler);
      tree.addEventListener('lith-blur', blurHandler);

      tree.focus();
      await tree.updateComplete;
      expect(focusHandler).toHaveBeenCalled();

      tree.blur();
      await tree.updateComplete;
      expect(blurHandler).toHaveBeenCalled();
    });
  });
});
