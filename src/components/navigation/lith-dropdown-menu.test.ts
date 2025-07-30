import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-dropdown-menu.js';
import type { LithDropdownMenu, DropdownMenuItem } from './lith-dropdown-menu.js';

describe('LithDropdownMenu', () => {
  let element: LithDropdownMenu;
  let mockItems: DropdownMenuItem[];

  beforeEach(async () => {
    mockItems = [
      { id: 'new', label: 'New', shortcut: 'Ctrl+N', icon: '📄' },
      { id: 'open', label: 'Open', shortcut: 'Ctrl+O', icon: '📂' },
      { id: 'save', label: 'Save', shortcut: 'Ctrl+S', icon: '💾', disabled: true },
      { id: 'separator1', label: '', separator: true },
      { id: 'exit', label: 'Exit', shortcut: 'Ctrl+Q', icon: '🚪' },
    ];

    element = await fixture(html`
      <lith-dropdown-menu .items=${mockItems}>
        <button slot="trigger">Actions</button>
      </lith-dropdown-menu>
    `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.open).toBe(false);
      expect(element.placement).toBe('bottom-start');
      expect(element.closeOnSelect).toBe(true);
      expect(element.disabled).toBe(false);
      expect(element.items).toEqual(mockItems);
    });

    it('should render trigger slot', () => {
      const trigger = element.shadowRoot?.querySelector('.trigger');
      expect(trigger).toBeDefined();

      const triggerSlot = element.shadowRoot?.querySelector('slot[name="trigger"]');
      expect(triggerSlot).toBeDefined();
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
      const icon = firstItem?.querySelector('.item-icon');
      const shortcut = firstItem?.querySelector('.item-shortcut');

      expect(label?.textContent?.trim()).toBe('New');
      expect(icon?.textContent?.trim()).toBe('📄');
      expect(shortcut?.textContent?.trim()).toBe('Ctrl+N');
    });

    it('should mark disabled items correctly', async () => {
      element.open = true;
      await element.updateComplete;

      const menuItems = element.shadowRoot?.querySelectorAll('.menu-item');
      const saveItem = Array.from(menuItems || []).find(
        (item) => item.getAttribute('data-item-id') === 'save'
      );

      expect(saveItem?.classList.contains('disabled')).toBe(true);
    });

    it('should render as link when href is provided', async () => {
      const itemsWithLink = [
        { id: 'docs', label: 'Documentation', href: '/docs', target: '_blank', icon: '📖' },
      ];

      element.items = itemsWithLink;
      element.open = true;
      await element.updateComplete;

      const linkItem = element.shadowRoot?.querySelector('a.menu-item');
      expect(linkItem).toBeDefined();
      expect(linkItem?.getAttribute('href')).toBe('/docs');
      expect(linkItem?.getAttribute('target')).toBe('_blank');
    });
  });

  describe('Properties', () => {
    it('should reflect open property', async () => {
      element.open = true;
      await element.updateComplete;

      expect(element.hasAttribute('open')).toBe(true);
    });

    it('should reflect disabled property', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should update placement property', async () => {
      element.placement = 'top-end';
      await element.updateComplete;

      expect(element.placement).toBe('top-end');
    });

    it('should update closeOnSelect property', async () => {
      element.closeOnSelect = false;
      await element.updateComplete;

      expect(element.closeOnSelect).toBe(false);
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
      element.open = true;
      await element.updateComplete;
    });

    it('should emit select event when menu item is clicked', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-select', selectSpy);

      const newItem = element.shadowRoot?.querySelector('[data-item-id="new"]') as HTMLElement;
      newItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('new');
      expect(selectSpy.mock.calls[0][0].detail.originalEvent).toBeDefined();
    });

    it('should close menu after item selection when closeOnSelect is true', async () => {
      element.closeOnSelect = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-close', closeSpy);

      const newItem = element.shadowRoot?.querySelector('[data-item-id="new"]') as HTMLElement;
      newItem.click();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should not close menu after item selection when closeOnSelect is false', async () => {
      element.closeOnSelect = false;
      await element.updateComplete;

      const newItem = element.shadowRoot?.querySelector('[data-item-id="new"]') as HTMLElement;
      newItem.click();
      await element.updateComplete;

      expect(element.open).toBe(true);
    });

    it('should not emit select event for disabled items', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-select', selectSpy);

      const saveItem = element.shadowRoot?.querySelector('[data-item-id="save"]') as HTMLElement;
      saveItem.click();
      await element.updateComplete;

      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('should have disabled attribute for disabled items', async () => {
      const saveItem = element.shadowRoot?.querySelector(
        '[data-item-id="save"]'
      ) as HTMLButtonElement;

      expect(saveItem.disabled).toBe(true);
      expect(saveItem.classList.contains('disabled')).toBe(true);
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

      // Should be at the last enabled item (Exit - index 2 in enabled items)
      expect(element['_highlightedIndex']).toBe(2);
    });

    it('should select highlighted item with Enter key', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-select', selectSpy);

      // Navigate to first item
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      // Select it
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('new');
    });

    it('should select highlighted item with Space key', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-select', selectSpy);

      // Navigate to first item
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      // Select it
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('new');
    });

    it('should close menu with Escape key', async () => {
      const closeSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-close', closeSpy);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should skip disabled items in navigation', async () => {
      // Navigate through items - should skip the disabled 'save' item
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // New (index 0)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // Open (index 1)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // Should skip save and go to Exit (index 2)
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(2);
    });

    it('should not handle keyboard events when closed', async () => {
      element.open = false;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(-1);
    });

    it('should not handle keyboard events when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(-1);
    });
  });

  describe('Public Methods', () => {
    it('should open menu with show() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-open', openSpy);

      element.show();
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should close menu with close() method', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-close', closeSpy);

      element.close();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should toggle menu with toggle() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-open', openSpy);

      // Toggle open
      element.toggle();
      await element.updateComplete;
      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();

      const closeSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-close', closeSpy);

      // Toggle close
      element.toggle();
      await element.updateComplete;
      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should not show when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.show();
      await element.updateComplete;

      expect(element.open).toBe(false);
    });

    it('should not toggle when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.toggle();
      await element.updateComplete;

      expect(element.open).toBe(false);
    });

    it('should focus trigger with focus() method', async () => {
      const triggerButton = element.querySelector('button') as HTMLButtonElement;
      const focusSpy = vi.spyOn(triggerButton, 'focus');

      element.focus();

      expect(focusSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Mouse Interaction', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should highlight item on mouseenter', async () => {
      const newItem = element.shadowRoot?.querySelector('[data-item-id="new"]') as HTMLElement;

      newItem.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(newItem.classList.contains('highlighted')).toBe(true);
    });

    it('should update highlighted index on mouseenter', async () => {
      const openItem = element.shadowRoot?.querySelector('[data-item-id="open"]') as HTMLElement;

      openItem.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(1);
    });
  });

  describe('Fallback Content', () => {
    it('should render default slot when no items provided', async () => {
      const emptyElement = (await fixture(html`
        <lith-dropdown-menu .items=${[]}>
          <button slot="trigger">Empty Menu</button>
          <div>No items available</div>
        </lith-dropdown-menu>
      `)) as LithDropdownMenu;

      emptyElement.open = true;
      await emptyElement.updateComplete;

      const menu = emptyElement.shadowRoot?.querySelector('.menu');
      const slot = menu?.querySelector('slot:not([name])');

      expect(slot).toBeDefined();
    });
  });

  describe('CSS Parts', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should expose CSS parts', () => {
      const base = element.shadowRoot?.querySelector('[part="base"]');
      const trigger = element.shadowRoot?.querySelector('[part="trigger"]');
      const popover = element.shadowRoot?.querySelector('[part="popover"]');
      const menu = element.shadowRoot?.querySelector('[part="menu"]');
      const item = element.shadowRoot?.querySelector('[part="item"]');
      const separator = element.shadowRoot?.querySelector('[part="separator"]');

      expect(base).toBeDefined();
      expect(trigger).toBeDefined();
      expect(popover).toBeDefined();
      expect(menu).toBeDefined();
      expect(item).toBeDefined();
      expect(separator).toBeDefined();
    });

    it('should expose item-specific CSS parts', () => {
      const itemContent = element.shadowRoot?.querySelector('[part="item-content"]');
      const itemIcon = element.shadowRoot?.querySelector('[part="item-icon"]');
      const itemLabel = element.shadowRoot?.querySelector('[part="item-label"]');
      const itemShortcut = element.shadowRoot?.querySelector('[part="item-shortcut"]');

      expect(itemContent).toBeDefined();
      expect(itemIcon).toBeDefined();
      expect(itemLabel).toBeDefined();
      expect(itemShortcut).toBeDefined();
    });
  });

  describe('Events', () => {
    it('should emit lith-dropdown-menu-open event when opening', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-open', openSpy);

      element.open = true;
      await element.updateComplete;

      expect(openSpy).toHaveBeenCalledOnce();
      const event = openSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit lith-dropdown-menu-close event when closing', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-close', closeSpy);

      element.open = false;
      await element.updateComplete;

      expect(closeSpy).toHaveBeenCalledOnce();
      const event = closeSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit lith-dropdown-menu-select event with correct details', async () => {
      element.open = true;
      await element.updateComplete;

      const selectSpy = vi.fn();
      element.addEventListener('lith-dropdown-menu-select', selectSpy);

      const newItem = element.shadowRoot?.querySelector('[data-item-id="new"]') as HTMLElement;
      newItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      const event = selectSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.detail.item.id).toBe('new');
      expect(event.detail.originalEvent).toBeDefined();
    });
  });
});
