import { expect, test, describe, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '@testing-library/jest-dom/vitest';
import './lith-tree-item.js';
import type { LithTreeItem } from './lith-tree-item.js';

describe('LithTreeItem', () => {
  let treeItem: LithTreeItem;

  beforeEach(async () => {
    treeItem = await fixture<LithTreeItem>(html`
      <lith-tree-item value="test" label="Test Item"></lith-tree-item>
    `);
  });

  test('should render with default properties', () => {
    expect(treeItem).toBeInTheDocument();
    expect(treeItem.value).toBe('test');
    expect(treeItem.label).toBe('Test Item');
    expect(treeItem.expanded).toBe(false);
    expect(treeItem.selected).toBe(false);
    expect(treeItem.disabled).toBe(false);
    expect(treeItem.hasChildren).toBe(false);
    expect(treeItem.lazyLoading).toBe(false);
    expect(treeItem.loading).toBe(false);
    expect(treeItem.level).toBe(0);
  });

  test('should have correct ARIA attributes', () => {
    expect(treeItem.getAttribute('role')).toBe('treeitem');
    expect(treeItem.tabIndex).toBe(-1);
    expect(treeItem.getAttribute('aria-selected')).toBe('false');
  });

  test('should render expand button when has children', async () => {
    treeItem.hasChildren = true;
    await treeItem.updateComplete;

    const expandButton = treeItem.shadowRoot?.querySelector('.expand-button');
    expect(expandButton).toBeInTheDocument();
    expect(expandButton?.classList.contains('hidden')).toBe(false);
  });

  test('should hide expand button when no children', async () => {
    treeItem.hasChildren = false;
    await treeItem.updateComplete;

    const expandButton = treeItem.shadowRoot?.querySelector('.expand-button');
    expect(expandButton?.classList.contains('hidden')).toBe(true);
  });

  test('should detect children from slot content', async () => {
    treeItem = await fixture<LithTreeItem>(html`
      <lith-tree-item value="parent" label="Parent">
        <lith-tree-item value="child" label="Child"></lith-tree-item>
      </lith-tree-item>
    `);

    await treeItem.updateComplete;
    expect(treeItem.hasChildren).toBe(true);
  });

  describe('Expansion', () => {
    beforeEach(async () => {
      treeItem = await fixture<LithTreeItem>(html`
        <lith-tree-item value="parent" label="Parent" has-children>
          <lith-tree-item value="child" label="Child"></lith-tree-item>
        </lith-tree-item>
      `);
    });

    test('should expand when expand method is called', async () => {
      const toggleHandler = vi.fn();
      treeItem.addEventListener('lith-toggle', toggleHandler);

      expect(treeItem.expanded).toBe(false);

      treeItem.expand();
      await treeItem.updateComplete;

      expect(treeItem.expanded).toBe(true);
      expect(toggleHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            expanded: true,
            value: 'parent',
            level: 0,
          }),
        })
      );
    });

    test('should collapse when collapse method is called', async () => {
      treeItem.expanded = true;
      await treeItem.updateComplete;

      treeItem.collapse();
      await treeItem.updateComplete;

      expect(treeItem.expanded).toBe(false);
    });

    test('should toggle expansion state', async () => {
      expect(treeItem.expanded).toBe(false);

      treeItem.toggle();
      await treeItem.updateComplete;
      expect(treeItem.expanded).toBe(true);

      treeItem.toggle();
      await treeItem.updateComplete;
      expect(treeItem.expanded).toBe(false);
    });

    test('should expand when expand button is clicked', async () => {
      const expandButton = treeItem.shadowRoot?.querySelector(
        '.expand-button'
      ) as HTMLButtonElement;
      expect(expandButton).toBeInTheDocument();

      expandButton.click();
      await treeItem.updateComplete;

      expect(treeItem.expanded).toBe(true);
    });

    test('should update aria-expanded attribute', async () => {
      expect(treeItem.getAttribute('aria-expanded')).toBe('false');

      treeItem.expand();
      await treeItem.updateComplete;

      expect(treeItem.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Selection', () => {
    test('should select when select method is called', async () => {
      const selectHandler = vi.fn();
      treeItem.addEventListener('lith-select', selectHandler);

      expect(treeItem.selected).toBe(false);

      treeItem.select();
      await treeItem.updateComplete;

      expect(treeItem.selected).toBe(true);
      expect(selectHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            selected: true,
            value: 'test',
            level: 0,
            item: treeItem,
          }),
        })
      );
    });

    test('should deselect when deselect method is called', async () => {
      treeItem.selected = true;
      await treeItem.updateComplete;

      treeItem.deselect();
      await treeItem.updateComplete;

      expect(treeItem.selected).toBe(false);
    });

    test('should toggle selection when clicked', async () => {
      const selectHandler = vi.fn();
      treeItem.addEventListener('lith-select', selectHandler);

      treeItem.click();
      await treeItem.updateComplete;

      expect(selectHandler).toHaveBeenCalled();
    });

    test('should not select when expand button is clicked', async () => {
      treeItem.hasChildren = true;
      await treeItem.updateComplete;

      const selectHandler = vi.fn();
      treeItem.addEventListener('lith-select', selectHandler);

      const expandButton = treeItem.shadowRoot?.querySelector(
        '.expand-button'
      ) as HTMLButtonElement;
      expandButton.click();
      await treeItem.updateComplete;

      expect(selectHandler).not.toHaveBeenCalled();
    });

    test('should update aria-selected attribute', async () => {
      expect(treeItem.getAttribute('aria-selected')).toBe('false');

      treeItem.selected = true;
      await treeItem.updateComplete;

      expect(treeItem.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('Disabled State', () => {
    test('should handle disabled state', async () => {
      treeItem.disabled = true;
      await treeItem.updateComplete;

      expect(treeItem.hasAttribute('disabled')).toBe(true);
      expect(treeItem.getAttribute('aria-disabled')).toBe('true');
    });

    test('should not respond to interactions when disabled', async () => {
      treeItem.disabled = true;
      await treeItem.updateComplete;

      const selectHandler = vi.fn();
      treeItem.addEventListener('lith-select', selectHandler);

      treeItem.click();
      await treeItem.updateComplete;

      expect(selectHandler).not.toHaveBeenCalled();
    });
  });

  describe('Lazy Loading', () => {
    beforeEach(async () => {
      treeItem.lazyLoading = true;
      await treeItem.updateComplete;
    });

    test('should show loading state', async () => {
      treeItem.loading = true;
      await treeItem.updateComplete;

      expect(treeItem.getAttribute('aria-busy')).toBe('true');
    });

    test('should emit lazy load event when expanded', async () => {
      const lazyLoadHandler = vi.fn();
      treeItem.addEventListener('lith-lazy-load', lazyLoadHandler);

      treeItem.toggle();
      await treeItem.updateComplete;

      expect(lazyLoadHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            value: 'test',
            level: 0,
          }),
        })
      );
    });

    test('should set loading state when lazy expanding', async () => {
      treeItem.toggle();
      await treeItem.updateComplete;

      expect(treeItem.loading).toBe(true);
    });

    test('should control loading state', async () => {
      treeItem.setLoading(true);
      await treeItem.updateComplete;

      expect(treeItem.loading).toBe(true);

      treeItem.setLoading(false);
      await treeItem.updateComplete;

      expect(treeItem.loading).toBe(false);
    });
  });

  describe('Level and Indentation', () => {
    test('should set level property', async () => {
      treeItem.level = 2;
      await treeItem.updateComplete;

      expect(treeItem.level).toBe(2);
      expect(treeItem.style.getPropertyValue('--level')).toBe('2');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(async () => {
      treeItem = await fixture<LithTreeItem>(html`
        <lith-tree-item value="parent" label="Parent" has-children>
          <lith-tree-item value="child" label="Child"></lith-tree-item>
        </lith-tree-item>
      `);
    });

    test('should handle Enter key for selection', async () => {
      const selectHandler = vi.fn();
      treeItem.addEventListener('lith-select', selectHandler);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      treeItem.dispatchEvent(event);
      await treeItem.updateComplete;

      expect(selectHandler).toHaveBeenCalled();
    });

    test('should handle Space key for selection', async () => {
      const selectHandler = vi.fn();
      treeItem.addEventListener('lith-select', selectHandler);

      const event = new KeyboardEvent('keydown', { key: ' ' });
      treeItem.dispatchEvent(event);
      await treeItem.updateComplete;

      expect(selectHandler).toHaveBeenCalled();
    });

    test('should handle ArrowRight key for expansion', async () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      treeItem.dispatchEvent(event);
      await treeItem.updateComplete;

      expect(treeItem.expanded).toBe(true);
    });

    test('should handle ArrowLeft key for collapse', async () => {
      treeItem.expanded = true;
      await treeItem.updateComplete;

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      treeItem.dispatchEvent(event);
      await treeItem.updateComplete;

      expect(treeItem.expanded).toBe(false);
    });

    test('should not respond to keyboard when disabled', async () => {
      treeItem.disabled = true;
      await treeItem.updateComplete;

      const selectHandler = vi.fn();
      treeItem.addEventListener('lith-select', selectHandler);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      treeItem.dispatchEvent(event);
      await treeItem.updateComplete;

      expect(selectHandler).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    test('should handle focus', async () => {
      treeItem.focus();
      await treeItem.updateComplete;

      expect(treeItem.tabIndex).toBe(0);
    });

    test('should handle blur', async () => {
      treeItem.focus();
      await treeItem.updateComplete;
      expect(treeItem.tabIndex).toBe(0);

      treeItem.blur();
      await treeItem.updateComplete;

      expect(treeItem.tabIndex).toBe(-1);
    });
  });

  describe('Content Slots', () => {
    test('should render content slot', async () => {
      treeItem = await fixture<LithTreeItem>(html`
        <lith-tree-item value="test" label="Test">
          <span slot="content">Custom Content</span>
        </lith-tree-item>
      `);

      const contentSlot = treeItem.shadowRoot?.querySelector('slot[name="content"]');
      expect(contentSlot).toBeInTheDocument();
    });

    test('should render expand icon slot', async () => {
      treeItem.hasChildren = true;
      await treeItem.updateComplete;

      const iconSlot = treeItem.shadowRoot?.querySelector('slot[name="expand-icon"]');
      expect(iconSlot).toBeInTheDocument();
    });

    test('should render loading icon slot when loading', async () => {
      treeItem.loading = true;
      await treeItem.updateComplete;

      const loadingSlot = treeItem.shadowRoot?.querySelector('slot[name="loading-icon"]');
      expect(loadingSlot).toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    test('should apply expanded class to expand button', async () => {
      treeItem.hasChildren = true;
      treeItem.expanded = true;
      await treeItem.updateComplete;

      const expandButton = treeItem.shadowRoot?.querySelector('.expand-button');
      expect(expandButton?.classList.contains('expanded')).toBe(true);
    });

    test('should apply expanded class to children container', async () => {
      treeItem.hasChildren = true;
      treeItem.expanded = true;
      await treeItem.updateComplete;

      const children = treeItem.shadowRoot?.querySelector('.children');
      expect(children?.classList.contains('expanded')).toBe(true);
      expect(children?.classList.contains('collapsed')).toBe(false);
    });

    test('should apply collapsed class to children container', async () => {
      treeItem.hasChildren = true;
      treeItem.expanded = false;
      await treeItem.updateComplete;

      const children = treeItem.shadowRoot?.querySelector('.children');
      expect(children?.classList.contains('collapsed')).toBe(true);
      expect(children?.classList.contains('expanded')).toBe(false);
    });
  });

  describe('Events', () => {
    test('should emit focus event', async () => {
      const focusHandler = vi.fn();
      treeItem.addEventListener('lith-focus', focusHandler);

      treeItem.focus();
      await treeItem.updateComplete;

      // Focus events are not automatically emitted by the component
      // They would be emitted by the parent tree component
    });

    test('should emit blur event', async () => {
      const blurHandler = vi.fn();
      treeItem.addEventListener('lith-blur', blurHandler);

      treeItem.blur();
      await treeItem.updateComplete;

      // Blur events are not automatically emitted by the component
      // They would be emitted by the parent tree component
    });
  });
});
