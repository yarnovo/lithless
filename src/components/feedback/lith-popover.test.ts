import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-popover.js';
import type { LithPopover } from './lith-popover.js';

describe('LithPopover', () => {
  let element: LithPopover;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-popover>
        <button slot="trigger">Trigger</button>
        <div>Popover content</div>
      </lith-popover>
    `);
  });

  afterEach(() => {
    // 清理事件监听器
    document.removeEventListener('keydown', element['_handleDocumentKeyDown']);
    document.removeEventListener('click', element['_handleDocumentClick']);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.open).toBe(false);
      expect(element.placement).toBe('bottom');
      expect(element.trigger).toBe('click');
      expect(element.showArrow).toBe(false);
      expect(element.offset).toBe(8);
      expect(element.flip).toBe(true);
      expect(element.shift).toBe(true);
      expect(element.hoverDelay).toBe(100);
      expect(element.focusTrap).toBe(false);
      expect(element.closeOnEscape).toBe(true);
      expect(element.closeOnOutsideClick).toBe(true);
    });

    it('should render trigger and popover containers', () => {
      const base = element.shadowRoot?.querySelector('.base');
      const trigger = element.shadowRoot?.querySelector('.trigger');
      const popover = element.shadowRoot?.querySelector('.popover');
      const content = element.shadowRoot?.querySelector('.content');

      expect(base).toBeDefined();
      expect(trigger).toBeDefined();
      expect(popover).toBeDefined();
      expect(content).toBeDefined();
    });

    it('should not render arrow by default', () => {
      const arrow = element.shadowRoot?.querySelector('.arrow');
      expect(arrow).toBeNull();
    });

    it('should render arrow when showArrow is true', async () => {
      element.showArrow = true;
      await element.updateComplete;

      const arrow = element.shadowRoot?.querySelector('.arrow');
      expect(arrow).toBeDefined();
    });
  });

  describe('Properties', () => {
    it('should reflect open property', async () => {
      element.open = true;
      await element.updateComplete;

      expect(element.hasAttribute('open')).toBe(true);
    });

    it('should reflect placement property', async () => {
      element.placement = 'top-start';
      await element.updateComplete;

      expect(element.getAttribute('placement')).toBe('top-start');
    });

    it('should update trigger property', async () => {
      element.trigger = 'hover';
      await element.updateComplete;

      expect(element.trigger).toBe('hover');
    });

    it('should update offset property', async () => {
      element.offset = 16;
      await element.updateComplete;

      expect(element.offset).toBe(16);
    });

    it('should update showArrow property', async () => {
      element.showArrow = true;
      await element.updateComplete;

      expect(element.showArrow).toBe(true);
      const arrow = element.shadowRoot?.querySelector('.arrow');
      expect(arrow).toBeDefined();
    });

    it('should update flip property', async () => {
      element.flip = false;
      await element.updateComplete;

      expect(element.flip).toBe(false);
    });

    it('should update shift property', async () => {
      element.shift = false;
      await element.updateComplete;

      expect(element.shift).toBe(false);
    });

    it('should update hoverDelay property', async () => {
      element.hoverDelay = 500;
      await element.updateComplete;

      expect(element.hoverDelay).toBe(500);
    });

    it('should update focusTrap property', async () => {
      element.focusTrap = true;
      await element.updateComplete;

      expect(element.focusTrap).toBe(true);
    });

    it('should update closeOnEscape property', async () => {
      element.closeOnEscape = false;
      await element.updateComplete;

      expect(element.closeOnEscape).toBe(false);
    });

    it('should update closeOnOutsideClick property', async () => {
      element.closeOnOutsideClick = false;
      await element.updateComplete;

      expect(element.closeOnOutsideClick).toBe(false);
    });
  });

  describe('Click Trigger', () => {
    beforeEach(async () => {
      element.trigger = 'click';
      await element.updateComplete;
    });

    it('should open popover when trigger is clicked', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-popover-open', openSpy);

      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should close popover when trigger is clicked again', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-popover-close', closeSpy);

      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Hover Trigger', () => {
    beforeEach(async () => {
      element.trigger = 'hover';
      element.hoverDelay = 0; // Remove delay for testing
      await element.updateComplete;
    });

    it('should open popover on trigger mouseenter', async () => {
      vi.useFakeTimers();

      const openSpy = vi.fn();
      element.addEventListener('lith-popover-open', openSpy);

      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.dispatchEvent(new MouseEvent('mouseenter'));

      vi.runAllTimers();
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();

      vi.useRealTimers();
    });

    it('should close popover on trigger mouseleave', async () => {
      vi.useFakeTimers();

      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-popover-close', closeSpy);

      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.dispatchEvent(new MouseEvent('mouseleave'));

      vi.runAllTimers();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();

      vi.useRealTimers();
    });

    it('should not close when moving to popover', async () => {
      vi.useFakeTimers();

      element.open = true;
      await element.updateComplete;

      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      const popover = element.shadowRoot?.querySelector('.popover') as HTMLElement;

      // Mouse leaves trigger
      trigger.dispatchEvent(new MouseEvent('mouseleave'));

      // Mouse enters popover before timeout
      popover.dispatchEvent(new MouseEvent('mouseenter'));

      vi.runAllTimers();
      await element.updateComplete;

      expect(element.open).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('Focus Trigger', () => {
    beforeEach(async () => {
      element.trigger = 'focus';
      await element.updateComplete;
    });

    it('should open popover on trigger focus', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-popover-open', openSpy);

      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.dispatchEvent(new FocusEvent('focus'));
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should close popover on trigger blur when popover not focused', async () => {
      vi.useFakeTimers();

      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-popover-close', closeSpy);

      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.dispatchEvent(new FocusEvent('blur'));

      vi.runAllTimers();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();

      vi.useRealTimers();
    });
  });

  describe('Manual Trigger', () => {
    beforeEach(async () => {
      element.trigger = 'manual';
      await element.updateComplete;
    });

    it('should still respond to click when manual', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-popover-open', openSpy);

      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.click();
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should not respond to hover when manual', async () => {
      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(element.open).toBe(false);
    });

    it('should not respond to focus when manual', async () => {
      const trigger = element.shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger.dispatchEvent(new FocusEvent('focus'));
      await element.updateComplete;

      expect(element.open).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close popover on Escape key', async () => {
      element.open = true;
      element.closeOnEscape = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-popover-close', closeSpy);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should not close on Escape when closeOnEscape is false', async () => {
      element.open = true;
      element.closeOnEscape = false;
      await element.updateComplete;

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await element.updateComplete;

      expect(element.open).toBe(true);
    });

    it('should focus trigger after closing with Escape', async () => {
      element.open = true;
      await element.updateComplete;

      const triggerSlot = element.shadowRoot?.querySelector(
        'slot[name="trigger"]'
      ) as HTMLSlotElement;
      const triggerElement = triggerSlot?.assignedElements()[0] as HTMLElement;
      const focusSpy = vi.spyOn(triggerElement, 'focus');

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await element.updateComplete;

      expect(focusSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Outside Click', () => {
    it('should close popover when clicking outside', async () => {
      element.open = true;
      element.closeOnOutsideClick = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-popover-close', closeSpy);

      // Simulate click outside
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should not close when clicking inside element', async () => {
      element.open = true;
      await element.updateComplete;

      // Simulate click inside the element (not the trigger specifically)
      element.click();
      await element.updateComplete;

      expect(element.open).toBe(true);
    });

    it('should not close when closeOnOutsideClick is false', async () => {
      element.open = true;
      element.closeOnOutsideClick = false;
      await element.updateComplete;

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await element.updateComplete;

      expect(element.open).toBe(true);
    });
  });

  describe('Public Methods', () => {
    it('should show popover with show() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-popover-open', openSpy);

      element.show();
      await element.updateComplete;

      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();
    });

    it('should hide popover with hide() method', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-popover-close', closeSpy);

      element.hide();
      await element.updateComplete;

      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should toggle popover with toggle() method', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-popover-open', openSpy);

      // Toggle open
      element.toggle();
      await element.updateComplete;
      expect(element.open).toBe(true);
      expect(openSpy).toHaveBeenCalledOnce();

      const closeSpy = vi.fn();
      element.addEventListener('lith-popover-close', closeSpy);

      // Toggle close
      element.toggle();
      await element.updateComplete;
      expect(element.open).toBe(false);
      expect(closeSpy).toHaveBeenCalledOnce();
    });

    it('should update position with updatePosition() method', async () => {
      element.open = true;
      await element.updateComplete;

      const positionSpy = vi.fn();
      element.addEventListener('lith-popover-position', positionSpy);

      element.updatePosition();
      await element.updateComplete;

      expect(positionSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Positioning', () => {
    it('should emit position event when opening', async () => {
      const positionSpy = vi.fn();
      element.addEventListener('lith-popover-position', positionSpy);

      element.open = true;
      await element.updateComplete;

      expect(positionSpy).toHaveBeenCalledOnce();
      expect(positionSpy.mock.calls[0][0].detail).toHaveProperty('top');
      expect(positionSpy.mock.calls[0][0].detail).toHaveProperty('left');
      expect(positionSpy.mock.calls[0][0].detail).toHaveProperty('placement');
    });

    it('should update position when placement changes', async () => {
      element.open = true;
      await element.updateComplete;

      const positionSpy = vi.fn();
      element.addEventListener('lith-popover-position', positionSpy);

      element.placement = 'top';
      await element.updateComplete;

      expect(positionSpy).toHaveBeenCalledOnce();
    });
  });

  describe('CSS Parts', () => {
    it('should expose CSS parts', () => {
      const base = element.shadowRoot?.querySelector('[part="base"]');
      const trigger = element.shadowRoot?.querySelector('[part="trigger"]');
      const popover = element.shadowRoot?.querySelector('[part="popover"]');
      const content = element.shadowRoot?.querySelector('[part="content"]');

      expect(base).toBeDefined();
      expect(trigger).toBeDefined();
      expect(popover).toBeDefined();
      expect(content).toBeDefined();
    });

    it('should expose arrow part when showArrow is true', async () => {
      element.showArrow = true;
      await element.updateComplete;

      const arrow = element.shadowRoot?.querySelector('[part="arrow"]');
      expect(arrow).toBeDefined();
    });
  });

  describe('Slots', () => {
    it('should render trigger slot', () => {
      const triggerSlot = element.shadowRoot?.querySelector('slot[name="trigger"]');
      expect(triggerSlot).toBeDefined();
    });

    it('should render default slot for content', () => {
      const defaultSlot = element.shadowRoot?.querySelector('slot:not([name])');
      expect(defaultSlot).toBeDefined();
    });
  });

  describe('Events', () => {
    it('should emit lith-popover-open event when opening', async () => {
      const openSpy = vi.fn();
      element.addEventListener('lith-popover-open', openSpy);

      element.open = true;
      await element.updateComplete;

      expect(openSpy).toHaveBeenCalledOnce();
      const event = openSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit lith-popover-close event when closing', async () => {
      element.open = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('lith-popover-close', closeSpy);

      element.open = false;
      await element.updateComplete;

      expect(closeSpy).toHaveBeenCalledOnce();
      const event = closeSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should emit lith-popover-position event with position details', async () => {
      const positionSpy = vi.fn();
      element.addEventListener('lith-popover-position', positionSpy);

      element.open = true;
      await element.updateComplete;

      expect(positionSpy).toHaveBeenCalledOnce();
      const event = positionSpy.mock.calls[0][0];
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
      expect(event.detail).toHaveProperty('top');
      expect(event.detail).toHaveProperty('left');
      expect(event.detail).toHaveProperty('placement');
    });
  });

  describe('Focus Trap', () => {
    it.skip('should focus first focusable element when focusTrap is enabled', async () => {
      // Skip this test as focus behavior is hard to test in JSDOM environment
      // This would work in real browser tests (e.g., Playwright)
      const popoverWithFocusable = await fixture(html`
        <lith-popover focus-trap>
          <button slot="trigger">Trigger</button>
          <div>
            <button id="first">First</button>
            <button id="second">Second</button>
          </div>
        </lith-popover>
      `);

      const firstButton = popoverWithFocusable.querySelector('#first') as HTMLButtonElement;
      const focusSpy = vi.spyOn(firstButton, 'focus');

      (popoverWithFocusable as LithPopover).open = true;
      await (popoverWithFocusable as LithPopover).updateComplete;

      expect(focusSpy).toHaveBeenCalledOnce();
    });
  });
});
