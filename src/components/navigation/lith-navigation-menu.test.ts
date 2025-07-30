import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-navigation-menu.js';
import type { LithNavigationMenu, NavigationMenuItem } from './lith-navigation-menu.js';

describe('LithNavigationMenu', () => {
  let element: LithNavigationMenu;
  let mockItems: NavigationMenuItem[];

  beforeEach(async () => {
    mockItems = [
      {
        id: 'products',
        label: 'Products',
        icon: '📦',
        children: [
          { id: 'web', label: 'Web Apps', icon: '🌐' },
          { id: 'mobile', label: 'Mobile Apps', icon: '📱' },
          {
            id: 'desktop',
            label: 'Desktop Apps',
            icon: '💻',
            children: [
              { id: 'windows', label: 'Windows' },
              { id: 'macos', label: 'macOS' },
              { id: 'linux', label: 'Linux' },
            ],
          },
        ],
      },
      {
        id: 'services',
        label: 'Services',
        icon: '🛠️',
        badge: 'New',
        children: [
          { id: 'consulting', label: 'Consulting', icon: '💼' },
          { id: 'support', label: 'Support', icon: '🆘', disabled: true },
        ],
      },
      { id: 'about', label: 'About', href: '/about', icon: 'ℹ️' },
      { id: 'contact', label: 'Contact', href: '/contact', target: '_blank', icon: '📧' },
    ];

    element = await fixture(html`
      <lith-navigation-menu .items=${mockItems}>
        <button slot="trigger">Navigation</button>
      </lith-navigation-menu>
    `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.open).toBe(false);
      expect(element.placement).toBe('bottom-start');
      expect(element.closeOnSelect).toBe(true);
      expect(element.disabled).toBe(false);
      expect(element.hoverDelay).toBe(300);
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

      // Count only top-level menu items (direct children of .menu)
      const topLevelMenuItems = element.shadowRoot?.querySelectorAll(
        '.menu > .submenu-container > .menu-item, .menu > .menu-item'
      );
      expect(topLevelMenuItems?.length).toBe(4);

      // Check if items with children have submenu indicator
      const productsItem = element.shadowRoot?.querySelector('[data-item-id="products"]');
      expect(productsItem?.classList.contains('has-submenu')).toBe(true);

      const aboutItem = element.shadowRoot?.querySelector('[data-item-id="about"]');
      expect(aboutItem?.classList.contains('has-submenu')).toBe(false);
    });

    it('should render menu item content correctly', async () => {
      element.open = true;
      await element.updateComplete;

      const servicesItem = element.shadowRoot?.querySelector('[data-item-id="services"]');
      const label = servicesItem?.querySelector('.item-label');
      const icon = servicesItem?.querySelector('.item-icon');
      const badge = servicesItem?.querySelector('.item-badge');
      const arrow = servicesItem?.querySelector('.item-arrow');

      expect(label?.textContent?.trim()).toBe('Services');
      expect(icon?.textContent?.trim()).toBe('🛠️');
      expect(badge?.textContent?.trim()).toBe('New');
      expect(arrow?.textContent?.trim()).toBe('▶');
    });

    it('should render as link when href is provided and no children', async () => {
      element.open = true;
      await element.updateComplete;

      const aboutItem = element.shadowRoot?.querySelector('[data-item-id="about"]');
      expect(aboutItem?.tagName.toLowerCase()).toBe('a');
      expect(aboutItem?.getAttribute('href')).toBe('/about');

      const contactItem = element.shadowRoot?.querySelector('[data-item-id="contact"]');
      expect(contactItem?.getAttribute('target')).toBe('_blank');
    });

    it('should render submenu containers for items with children', async () => {
      element.open = true;
      await element.updateComplete;

      // Count top-level submenu containers (products and services)
      const topLevelSubmenuContainers = element.shadowRoot?.querySelectorAll(
        '.menu > .submenu-container'
      );
      expect(topLevelSubmenuContainers?.length).toBe(2); // products and services have children
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

    it('should update hoverDelay property', async () => {
      element.hoverDelay = 500;
      await element.updateComplete;

      expect(element.hoverDelay).toBe(500);
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

    it('should emit select event when leaf menu item is clicked', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-select', selectSpy);

      const aboutItem = element.shadowRoot?.querySelector('[data-item-id="about"]') as HTMLElement;
      aboutItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('about');
      expect(selectSpy.mock.calls[0][0].detail.originalEvent).toBeDefined();
    });

    it('should close menu after leaf item selection when closeOnSelect is true', async () => {
      element.closeOnSelect = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-close', closeSpy);

      const aboutItem = element.shadowRoot?.querySelector('[data-item-id="about"]') as HTMLElement;
      aboutItem.click();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should not close menu after leaf item selection when closeOnSelect is false', async () => {
      element.closeOnSelect = false;
      await element.updateComplete;

      const aboutItem = element.shadowRoot?.querySelector('[data-item-id="about"]') as HTMLElement;
      aboutItem.click();
      await element.updateComplete;

      expect(element.open).toBe(true);
    });

    it('should not emit select event for disabled items', async () => {
      // First we need to have a submenu open to access nested disabled items
      const servicesItem = element.shadowRoot?.querySelector(
        '[data-item-id="services"]'
      ) as HTMLElement;
      servicesItem.click(); // Open submenu
      await element.updateComplete;

      const selectSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-select', selectSpy);

      // Now try to click the disabled support item
      const supportItem = element.shadowRoot?.querySelector(
        '[data-item-id="support"]'
      ) as HTMLElement;
      supportItem?.click();
      await element.updateComplete;

      expect(selectSpy).not.toHaveBeenCalled();
    });

    it('should toggle submenu when parent item is clicked', async () => {
      const productsItem = element.shadowRoot?.querySelector(
        '[data-item-id="products"]'
      ) as HTMLElement;

      // Click to open submenu
      productsItem.click();
      await element.updateComplete;

      const submenu = element.shadowRoot?.querySelector('.submenu');
      expect(submenu?.classList.contains('open')).toBe(true);

      // Click again to close submenu
      productsItem.click();
      await element.updateComplete;

      expect(submenu?.classList.contains('open')).toBe(false);
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

    it('should open submenu with ArrowRight key', async () => {
      // Navigate to first item (products)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      // Open submenu with right arrow
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      await element.updateComplete;

      const submenu = element.shadowRoot?.querySelector('.submenu');
      expect(submenu?.classList.contains('open')).toBe(true);
    });

    it('should close submenus with ArrowLeft key', async () => {
      // First open a submenu
      const productsItem = element.shadowRoot?.querySelector(
        '[data-item-id="products"]'
      ) as HTMLElement;
      productsItem.click();
      await element.updateComplete;

      // Close with left arrow
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      await element.updateComplete;

      const submenu = element.shadowRoot?.querySelector('.submenu');
      expect(submenu?.classList.contains('open')).toBe(false);
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

      // Should be at the last enabled item (contact - index 3)
      expect(element['_highlightedIndex']).toBe(3);
    });

    it('should select highlighted item with Enter key', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-select', selectSpy);

      // Navigate to a leaf item (about - index 2)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      // Select it
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('about');
    });

    it('should select highlighted item with Space key', async () => {
      const selectSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-select', selectSpy);

      // Navigate to a leaf item (about - index 2)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await element.updateComplete;

      // Select it
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      expect(selectSpy.mock.calls[0][0].detail.item.id).toBe('about');
    });

    it('should close menu with Escape key', async () => {
      const closeSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-close', closeSpy);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
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

  describe('Mouse Interaction', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should highlight item on mouseenter', async () => {
      const productsItem = element.shadowRoot?.querySelector(
        '[data-item-id="products"]'
      ) as HTMLElement;

      productsItem.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(element['_highlightedIndex']).toBe(0);
    });

    it('should open submenu on hover after delay', async () => {
      // Reduce hover delay for faster testing
      element.hoverDelay = 50;
      await element.updateComplete;

      const productsItem = element.shadowRoot?.querySelector(
        '[data-item-id="products"]'
      ) as HTMLElement;
      productsItem.dispatchEvent(new MouseEvent('mouseenter'));

      // Wait for the hover delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      await element.updateComplete;

      const submenu = element.shadowRoot?.querySelector('.submenu');
      expect(submenu?.classList.contains('open')).toBe(true);
    });
  });

  describe('Public Methods', () => {
    it('should open menu with show() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-open', openSpy);

      element.show();
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should close menu with close() method', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-close', closeSpy);

      element.close();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should toggle menu with toggle() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-open', openSpy);

      // Toggle open
      element.toggle();
      await element.updateComplete;
      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();

      const closeSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-close', closeSpy);

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

  describe('Submenu Management', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should manage multiple open submenus', async () => {
      const productsItem = element.shadowRoot?.querySelector(
        '[data-item-id="products"]'
      ) as HTMLElement;
      const servicesItem = element.shadowRoot?.querySelector(
        '[data-item-id="services"]'
      ) as HTMLElement;

      // Open first submenu
      productsItem.click();
      await element.updateComplete;

      let submenus = element.shadowRoot?.querySelectorAll('.submenu.open');
      expect(submenus?.length).toBe(1);

      // Open second submenu
      servicesItem.click();
      await element.updateComplete;

      submenus = element.shadowRoot?.querySelectorAll('.submenu.open');
      expect(submenus?.length).toBe(2);
    });

    it('should close all submenus when menu closes', async () => {
      // Open a submenu
      const productsItem = element.shadowRoot?.querySelector(
        '[data-item-id="products"]'
      ) as HTMLElement;
      productsItem.click();
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.submenu.open')).toBeDefined();

      // Close menu
      element.close();
      await element.updateComplete;

      // Wait a bit more for the popover to fully close and state to update
      await new Promise((resolve) => setTimeout(resolve, 10));
      await element.updateComplete;

      // Check that no submenus have the 'open' class
      const openSubmenus = element.shadowRoot?.querySelectorAll('.submenu.open');
      expect(openSubmenus?.length).toBe(0);
    });
  });

  describe('Fallback Content', () => {
    it('should render default slot when no items provided', async () => {
      const emptyElement = (await fixture(html`
        <lith-navigation-menu .items=${[]}>
          <button slot="trigger">Empty Menu</button>
          <div>No items available</div>
        </lith-navigation-menu>
      `)) as LithNavigationMenu;

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
      const submenu = element.shadowRoot?.querySelector('[part="submenu"]');

      expect(base).toBeDefined();
      expect(trigger).toBeDefined();
      expect(popover).toBeDefined();
      expect(menu).toBeDefined();
      expect(item).toBeDefined();
      expect(submenu).toBeDefined();
    });

    it('should expose item-specific CSS parts', () => {
      const itemContent = element.shadowRoot?.querySelector('[part="item-content"]');
      const itemIcon = element.shadowRoot?.querySelector('[part="item-icon"]');
      const itemLabel = element.shadowRoot?.querySelector('[part="item-label"]');
      const itemBadge = element.shadowRoot?.querySelector('[part="item-badge"]');
      const itemArrow = element.shadowRoot?.querySelector('[part="item-arrow"]');

      expect(itemContent).toBeDefined();
      expect(itemIcon).toBeDefined();
      expect(itemLabel).toBeDefined();
      expect(itemBadge).toBeDefined();
      expect(itemArrow).toBeDefined();
    });
  });

  describe('Events', () => {
    it('should emit lith-navigation-menu-open event when opening', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-open', openSpy);

      element.open = true;
      await element.updateComplete;

      expect(openSpy).toHaveBeenCalledOnce();
      const event = openSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit lith-navigation-menu-close event when closing', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-close', closeSpy);

      element.open = false;
      await element.updateComplete;

      expect(closeSpy).toHaveBeenCalledOnce();
      const event = closeSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit lith-navigation-menu-select event with correct details', async () => {
      element.open = true;
      await element.updateComplete;

      const selectSpy = vi.fn();
      element.addEventListener('lith-navigation-menu-select', selectSpy);

      const aboutItem = element.shadowRoot?.querySelector('[data-item-id="about"]') as HTMLElement;
      aboutItem.click();
      await element.updateComplete;

      expect(selectSpy).toHaveBeenCalledOnce();
      const event = selectSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.detail.item.id).toBe('about');
      expect(event.detail.originalEvent).toBeDefined();
    });
  });
});
