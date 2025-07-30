import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-context-menu.js';
import type { LithContextMenu, ContextMenuItem } from './lith-context-menu.js';

describe('LithContextMenu', () => {
  let element: LithContextMenu;
  let mockItems: ContextMenuItem[];

  beforeEach(async () => {
    mockItems = [
      { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
      { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
      { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', disabled: true },
      { id: 'separator1', label: '', separator: true },
      { id: 'select-all', label: 'Select All', shortcut: 'Ctrl+A' },
    ];

    element = await fixture(html`
      <lith-context-menu .items=${mockItems}>
        <div style="width: 200px; height: 100px; background: #f0f0f0;">Right-click me!</div>
      </lith-context-menu>
    `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.open).toBe(false);
      expect(element.preventDefault).toBe(true);
      expect(element.items).toEqual(mockItems);
    });

    it('should render trigger content', () => {
      const trigger = element.shadowRoot?.querySelector('.trigger');
      expect(trigger).toBeDefined();

      const slot = element.shadowRoot?.querySelector('slot:not([name])');
      expect(slot).toBeDefined();
    });

    it('should render menu items when open', async () => {
      element.open = true;
      await element.updateComplete;

      const menuItems = element.shadowRoot?.querySelectorAll('.menu-item');
      const separators = element.shadowRoot?.querySelectorAll('.separator');

      // Should render 4 menu items (not counting separator)
      expect(menuItems?.length).toBe(4);
      expect(separators?.length).toBe(1);
    });

    it('should render menu item content correctly', async () => {
      element.open = true;
      await element.updateComplete;

      const firstItem = element.shadowRoot?.querySelector('.menu-item');
      const label = firstItem?.querySelector('.item-label');
      const shortcut = firstItem?.querySelector('.item-shortcut');

      expect(label?.textContent?.trim()).toBe('Cut');
      expect(shortcut?.textContent?.trim()).toBe('Ctrl+X');
    });

    it('should mark disabled items correctly', async () => {
      element.open = true;
      await element.updateComplete;

      const menuItems = element.shadowRoot?.querySelectorAll('.menu-item');
      const pasteItem = Array.from(menuItems || []).find(
        (item) => item.getAttribute('data-item-id') === 'paste'
      );

      expect(pasteItem?.classList.contains('disabled')).toBe(true);
    });
  });

  describe('Properties', () => {
    it('should reflect open property', async () => {
      element.open = true;
      await element.updateComplete;

      expect(element.hasAttribute('open')).toBe(true);
    });

    it('should update items property', async () => {
      const newItems = [{ id: 'new', label: 'New Item' }];
      element.items = newItems;
      await element.updateComplete;

      expect(element.items).toEqual(newItems);
    });

    it('should update preventDefault property', async () => {
      element.preventDefault = false;
      await element.updateComplete;

      expect(element.preventDefault).toBe(false);
    });
  });

  describe('Context Menu Trigger', () => {
    it('should open menu on right-click', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-context-menu-open', openSpy);

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      });

      element.dispatchEvent(contextMenuEvent);
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should prevent default context menu when preventDefault is true', async () => {
      element.preventDefault = true;
      await element.updateComplete;

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100,
      });

      const preventDefaultSpy = vi.spyOn(contextMenuEvent, 'preventDefault');

      element.dispatchEvent(contextMenuEvent);
      await element.updateComplete;

      expect(preventDefaultSpy).toHaveBeenCalledOnce();
    });

    it('should not prevent default context menu when preventDefault is false', async () => {
      element.preventDefault = false;
      await element.updateComplete;

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100,
      });

      const preventDefaultSpy = vi.spyOn(contextMenuEvent, 'preventDefault');

      element.dispatchEvent(contextMenuEvent);
      await element.updateComplete;

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Menu Item Interaction', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should emit select event when menu item is clicked', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-context-menu-select', selectSpy);

      const cutItem = element.shadowRoot?.querySelector('[data-item-id="cut"]') as HTMLElement;
      cutItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('cut');
    });

    it('should close menu after item selection', async () => {
      const closeSpy = vi.fn();
      element.addEventListener('lith-context-menu-close', closeSpy);

      const cutItem = element.shadowRoot?.querySelector('[data-item-id="cut"]') as HTMLElement;
      cutItem.click();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should not emit select event for disabled items', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-context-menu-select', selectSpy);

      const pasteItem = element.shadowRoot?.querySelector('[data-item-id="paste"]') as HTMLElement;
      pasteItem.click();
      await element.updateComplete;

      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('should not close menu when disabled item is clicked', async () => {
      const pasteItem = element.shadowRoot?.querySelector('[data-item-id="paste"]') as HTMLElement;
      pasteItem.click();
      await element.updateComplete;

      expect(element.open).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should navigate down with ArrowDown key', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(0);
    });

    it('should navigate up with ArrowUp key', async () => {
      // First navigate down to have something to navigate up from
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(0);
    });

    it('should jump to first item with Home key', async () => {
      // Navigate to last item first
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(0);
    });

    it('should jump to last item with End key', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      await element.updateComplete;

      // Should be at the last enabled item (Select All) - index 2 in the enabled items array
      expect(element['_highlightedIndex']).toBe(2);
    });

    it('should select highlighted item with Enter key', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-context-menu-select', selectSpy);

      // Navigate to first item
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      // Select it
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('cut');
    });

    it('should select highlighted item with Space key', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-context-menu-select', selectSpy);

      // Navigate to first item
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      // Select it
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('cut');
    });

    it('should close menu with Escape key', async () => {
      const closeSpy = vi.fn();
      element.addEventListener('lith-context-menu-close', closeSpy);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should skip disabled items in navigation', async () => {
      // Navigate through items - should skip the disabled 'paste' item
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // Cut (index 0)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // Copy (index 1)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // Should skip paste and go to Select All (index 2)
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(2);
    });
  });

  describe('Public Methods', () => {
    it('should open menu with show() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-context-menu-open', openSpy);

      element.show();
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should close menu with close() method', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-context-menu-close', closeSpy);

      element.close();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should open menu at specific position with showAt() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-context-menu-open', openSpy);

      element.showAt(150, 200);
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(element['_currentMousePosition']).toEqual({ x: 150, y: 200 });
      expect(openSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Mouse Interaction', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should highlight item on mouseenter', async () => {
      const cutItem = element.shadowRoot?.querySelector('[data-item-id="cut"]') as HTMLElement;

      cutItem.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(cutItem.classList.contains('highlighted')).toBe(true);
    });
  });

  describe('CSS Parts', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should expose CSS parts', () => {
      const base = element.shadowRoot?.querySelector('[part="base"]');
      const popover = element.shadowRoot?.querySelector('[part="popover"]');
      const menu = element.shadowRoot?.querySelector('[part="menu"]');
      const item = element.shadowRoot?.querySelector('[part="item"]');
      const separator = element.shadowRoot?.querySelector('[part="separator"]');

      expect(base).toBeDefined();
      expect(popover).toBeDefined();
      expect(menu).toBeDefined();
      expect(item).toBeDefined();
      expect(separator).toBeDefined();
    });

    it('should expose item-specific CSS parts', () => {
      const itemContent = element.shadowRoot?.querySelector('[part="item-content"]');
      const itemLabel = element.shadowRoot?.querySelector('[part="item-label"]');
      const itemShortcut = element.shadowRoot?.querySelector('[part="item-shortcut"]');

      expect(itemContent).toBeDefined();
      expect(itemLabel).toBeDefined();
      expect(itemShortcut).toBeDefined();
    });
  });

  describe('Events', () => {
    it('should emit lith-context-menu-open event when opening', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-context-menu-open', openSpy);

      element.open = true;
      await element.updateComplete;

      expect(openSpy).toHaveBeenCalledOnce();
      const event = openSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit lith-context-menu-close event when closing', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-context-menu-close', closeSpy);

      element.open = false;
      await element.updateComplete;

      expect(closeSpy).toHaveBeenCalledOnce();
      const event = closeSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit lith-context-menu-select event with correct details', async () => {
      element.open = true;
      await element.updateComplete;

      const selectSpy = vi.fn();
      element.addEventListener('lith-context-menu-select', selectSpy);

      const cutItem = element.shadowRoot?.querySelector('[data-item-id="cut"]') as HTMLElement;
      cutItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      const event = selectSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.detail.item.id).toBe('cut');
      expect(event.detail.target).toBeDefined();
    });
  });
});
