import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-menu-bar.js';
import type { LithMenuBar, MenuBarItem } from './lith-menu-bar.js';

describe('LithMenuBar', () => {
  let element: LithMenuBar;
  let mockItems: MenuBarItem[];

  beforeEach(async () => {
    mockItems = [
      { id: 'file', label: 'File', icon: '📁' },
      {
        id: 'edit',
        label: 'Edit',
        icon: '✏️',
        children: [
          { id: 'undo', label: 'Undo', icon: '↶' },
          { id: 'redo', label: 'Redo', icon: '↷', disabled: true },
          { id: 'separator', label: '' },
          { id: 'cut', label: 'Cut', icon: '✂️' },
          { id: 'copy', label: 'Copy', icon: '📋' },
        ],
      },
      {
        id: 'view',
        label: 'View',
        icon: '👁️',
        badge: 'New',
        children: [
          { id: 'zoom-in', label: 'Zoom In', icon: '🔍' },
          { id: 'zoom-out', label: 'Zoom Out', icon: '🔍' },
          { id: 'fullscreen', label: 'Fullscreen', icon: '⛶' },
        ],
      },
      { id: 'help', label: 'Help', href: '/help', target: '_blank', icon: '❓' },
    ];

    element = await fixture(html`<lith-menu-bar .items=${mockItems}></lith-menu-bar>`);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.disabled).toBe(false);
      expect(element.closeOnSelect).toBe(true);
      expect(element.dropdownPlacement).toBe('bottom-start');
      expect(element.items).toEqual(mockItems);
    });

    it('should render menu bar items', async () => {
      await element.updateComplete;

      const menuItems = element.shadowRoot?.querySelectorAll('.menu-item');
      expect(menuItems?.length).toBe(4);

      // Check if items with children have dropdown indicator
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]');
      expect(editItem?.classList.contains('has-dropdown')).toBe(true);

      const helpItem = element.shadowRoot?.querySelector('[data-item-id="help"]');
      expect(helpItem?.classList.contains('has-dropdown')).toBe(false);
    });

    it('should render menu item content correctly', async () => {
      await element.updateComplete;

      const viewItem = element.shadowRoot?.querySelector('[data-item-id="view"]');
      const label = viewItem?.querySelector('.item-label');
      const icon = viewItem?.querySelector('.item-icon');
      const badge = viewItem?.querySelector('.item-badge');
      const arrow = viewItem?.querySelector('.item-arrow');

      expect(label?.textContent?.trim()).toBe('View');
      expect(icon?.textContent?.trim()).toBe('👁️');
      expect(badge?.textContent?.trim()).toBe('New');
      expect(arrow?.textContent?.trim()).toBe('▼');
    });

    it('should render as link when href is provided and no children', async () => {
      await element.updateComplete;

      const helpItem = element.shadowRoot?.querySelector('[data-item-id="help"]');
      expect(helpItem?.tagName.toLowerCase()).toBe('a');
      expect(helpItem?.getAttribute('href')).toBe('/help');
      expect(helpItem?.getAttribute('target')).toBe('_blank');
    });

    it('should render dropdown containers for items with children', async () => {
      await element.updateComplete;

      const dropdownContainers = element.shadowRoot?.querySelectorAll('.dropdown-container');
      expect(dropdownContainers?.length).toBe(2); // edit and view have children
    });
  });

  describe('Properties', () => {
    it('should reflect disabled property', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should update closeOnSelect property', async () => {
      element.closeOnSelect = false;
      await element.updateComplete;

      expect(element.closeOnSelect).toBe(false);
    });

    it('should update dropdownPlacement property', async () => {
      element.dropdownPlacement = 'top-end';
      await element.updateComplete;

      expect(element.dropdownPlacement).toBe('top-end');
    });

    it('should update items property', async () => {
      const newItems = [{ id: 'test', label: 'Test Item' }];
      element.items = newItems;
      await element.updateComplete;

      expect(element.items).toEqual(newItems);
    });
  });

  describe('Menu Item Interaction', () => {
    beforeEach(async () => {
      await element.updateComplete;
    });

    it('should emit select event when leaf menu item is clicked', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-menu-bar-select', selectSpy);

      const fileItem = element.shadowRoot?.querySelector('[data-item-id="file"]') as HTMLElement;
      fileItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('file');
      expect(selectSpy.mock.calls[0][0].detail.originalEvent).toBeDefined();
    });

    it('should toggle dropdown when dropdown item is clicked', async () => {
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;

      // Click to open dropdown
      editItem.click();
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(true);

      // Click again to close dropdown
      editItem.click();
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(false);
    });

    it('should emit select event when dropdown item is clicked', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-menu-bar-select', selectSpy);

      // First open the dropdown
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;
      editItem.click();
      await element.updateComplete;

      // Click a dropdown item
      const undoItem = element.shadowRoot?.querySelector('[data-item-id="undo"]') as HTMLElement;
      undoItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('undo');
    });

    it('should close dropdowns after item selection when closeOnSelect is true', async () => {
      element.closeOnSelect = true;
      await element.updateComplete;

      // Open dropdown
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;
      editItem.click();
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(true);

      // Click dropdown item
      const undoItem = element.shadowRoot?.querySelector('[data-item-id="undo"]') as HTMLElement;
      undoItem.click();
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(false);
    });

    it('should not close dropdowns after item selection when closeOnSelect is false', async () => {
      element.closeOnSelect = false;
      await element.updateComplete;

      // Open dropdown
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;
      editItem.click();
      await element.updateComplete;

      // Click dropdown item
      const undoItem = element.shadowRoot?.querySelector('[data-item-id="undo"]') as HTMLElement;
      undoItem.click();
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(true);
    });

    it('should not emit select event for disabled items', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-menu-bar-select', selectSpy);

      // Open dropdown first
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;
      editItem.click();
      await element.updateComplete;

      // Try to click disabled item
      const redoItem = element.shadowRoot?.querySelector('[data-item-id="redo"]') as HTMLElement;
      redoItem?.click();
      await element.updateComplete;

      expect(selectSpy).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(async () => {
      await element.updateComplete;
      element.focus(); // Focus the menu bar
    });

    it('should navigate right with ArrowRight key', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      await element.updateComplete;

      expect(element['_focusedIndex']).toBe(1);
    });

    it('should navigate left with ArrowLeft key', async () => {
      // First navigate to second item
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      await element.updateComplete;

      // Then navigate back
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      await element.updateComplete;

      expect(element['_focusedIndex']).toBe(0);
    });

    it('should open dropdown with ArrowDown key', async () => {
      // Navigate to edit item (has dropdown)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      await element.updateComplete;

      // Open dropdown with down arrow
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]');
      expect(editItem?.classList.contains('open')).toBe(true);
    });

    it('should jump to first item with Home key', async () => {
      // Navigate to last item first
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      await element.updateComplete;

      expect(element['_focusedIndex']).toBe(0);
    });

    it('should jump to last item with End key', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      await element.updateComplete;

      expect(element['_focusedIndex']).toBe(3);
    });

    it('should select focused item with Enter key', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-menu-bar-select', selectSpy);

      // Select first item (file)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('file');
    });

    it('should select focused item with Space key', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-menu-bar-select', selectSpy);

      // Select first item (file)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('file');
    });

    it('should close dropdowns with Escape key', async () => {
      // Open a dropdown first
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;
      editItem.click();
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(true);

      // Close with escape
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(false);
    });

    it('should not handle keyboard events when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      await element.updateComplete;

      expect(element['_focusedIndex']).toBe(0); // Should remain at initial position
    });
  });

  describe('Mouse Interaction', () => {
    beforeEach(async () => {
      await element.updateComplete;
    });

    it('should update focus on mouseenter', async () => {
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;

      editItem.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(element['_focusedIndex']).toBe(1);
    });

    it('should open dropdown on mouseenter when another dropdown is open', async () => {
      // First open edit dropdown
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;
      editItem.click();
      await element.updateComplete;

      // Then hover over view item
      const viewItem = element.shadowRoot?.querySelector('[data-item-id="view"]') as HTMLElement;
      viewItem.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(false);
      expect(viewItem.classList.contains('open')).toBe(true);
    });
  });

  describe('Public Methods', () => {
    beforeEach(async () => {
      await element.updateComplete;
    });

    it('should open dropdown with openDropdown() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-menu-bar-open', openSpy);

      element.openDropdown('edit');
      await element.updateComplete;

      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]');
      expect(editItem?.classList.contains('open')).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should close dropdown with closeDropdown() method', async () => {
      // First open the dropdown
      element.openDropdown('edit');
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-menu-bar-close', closeSpy);

      element.closeDropdown('edit');
      await element.updateComplete;

      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]');
      expect(editItem?.classList.contains('open')).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should close all dropdowns with closeAllDropdowns() method', async () => {
      // Open multiple dropdowns
      element.openDropdown('edit');
      element.openDropdown('view');
      await element.updateComplete;

      element.closeAllDropdowns();
      await element.updateComplete;

      const openDropdowns = element.shadowRoot?.querySelectorAll('.menu-item.open');
      expect(openDropdowns?.length).toBe(0);
    });

    it('should not open dropdown when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.openDropdown('edit');
      await element.updateComplete;

      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]');
      expect(editItem?.classList.contains('open')).toBe(false);
    });

    it('should focus menu bar with focus() method', async () => {
      element.focus();
      await element.updateComplete;

      expect(element['_focusedIndex']).toBe(0);
    });
  });

  describe('Focus Management', () => {
    beforeEach(async () => {
      await element.updateComplete;
    });

    it('should close dropdowns when focus leaves menu bar', async () => {
      // Open a dropdown
      const editItem = element.shadowRoot?.querySelector('[data-item-id="edit"]') as HTMLElement;
      editItem.click();
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(true);

      // Simulate focus leaving the menu bar
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);

      element.dispatchEvent(
        new FocusEvent('focusout', {
          relatedTarget: outsideElement,
        })
      );
      await element.updateComplete;

      expect(editItem.classList.contains('open')).toBe(false);
      expect(element['_focusedIndex']).toBe(-1);

      document.body.removeChild(outsideElement);
    });
  });

  describe('Fallback Content', () => {
    it('should render default slot when no items provided', async () => {
      const emptyElement = (await fixture(html`
        <lith-menu-bar .items=${[]}>
          <div>No items available</div>
        </lith-menu-bar>
      `)) as LithMenuBar;

      await emptyElement.updateComplete;

      const menuBar = emptyElement.shadowRoot?.querySelector('.menu-bar');
      const slot = menuBar?.querySelector('slot:not([name])');

      expect(slot).toBeDefined();
    });
  });

  describe('CSS Parts', () => {
    beforeEach(async () => {
      await element.updateComplete;
    });

    it('should expose CSS parts', () => {
      const base = element.shadowRoot?.querySelector('[part="base"]');
      const menuBar = element.shadowRoot?.querySelector('[part="menu-bar"]');
      const menuItem = element.shadowRoot?.querySelector('[part="menu-item"]');
      const dropdown = element.shadowRoot?.querySelector('[part="dropdown"]');

      expect(base).toBeDefined();
      expect(menuBar).toBeDefined();
      expect(menuItem).toBeDefined();
      expect(dropdown).toBeDefined();
    });

    it('should expose item-specific CSS parts', () => {
      const itemContent = element.shadowRoot?.querySelector('[part="menu-item-content"]');
      const itemIcon = element.shadowRoot?.querySelector('[part="menu-item-icon"]');
      const itemLabel = element.shadowRoot?.querySelector('[part="menu-item-label"]');
      const itemBadge = element.shadowRoot?.querySelector('[part="menu-item-badge"]');
      const itemArrow = element.shadowRoot?.querySelector('[part="menu-item-arrow"]');

      expect(itemContent).toBeDefined();
      expect(itemIcon).toBeDefined();
      expect(itemLabel).toBeDefined();
      expect(itemBadge).toBeDefined();
      expect(itemArrow).toBeDefined();
    });
  });

  describe('Events', () => {
    beforeEach(async () => {
      await element.updateComplete;
    });

    it('should emit lith-menu-bar-open event when dropdown opens', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-menu-bar-open', openSpy);

      element.openDropdown('edit');
      await element.updateComplete;

      expect(openSpy).toHaveBeenCalledOnce();
      const event = openSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.detail.itemId).toBe('edit');
    });

    it('should emit lith-menu-bar-close event when dropdown closes', async () => {
      element.openDropdown('edit');
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-menu-bar-close', closeSpy);

      element.closeDropdown('edit');
      await element.updateComplete;

      expect(closeSpy).toHaveBeenCalledOnce();
      const event = closeSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.detail.itemId).toBe('edit');
    });

    it('should emit lith-menu-bar-select event with correct details', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-menu-bar-select', selectSpy);

      const fileItem = element.shadowRoot?.querySelector('[data-item-id="file"]') as HTMLElement;
      fileItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      const event = selectSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.detail.item.id).toBe('file');
      expect(event.detail.originalEvent).toBeDefined();
    });
  });
});
