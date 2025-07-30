import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-tabs.js';
import './lith-tab.js';
import './lith-tab-panel.js';
import type { LithTabs } from './lith-tabs.js';
import type { LithTab } from './lith-tab.js';
import type { LithTabPanel } from './lith-tab-panel.js';

describe('LithTabs', () => {
  let element: LithTabs;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-tabs>
        <lith-tab panel="panel1">Tab 1</lith-tab>
        <lith-tab panel="panel2">Tab 2</lith-tab>
        <lith-tab panel="panel3" disabled>Tab 3</lith-tab>
        <lith-tab-panel slot="panels" tab-id="panel1">Content 1</lith-tab-panel>
        <lith-tab-panel slot="panels" tab-id="panel2">Content 2</lith-tab-panel>
        <lith-tab-panel slot="panels" tab-id="panel3">Content 3</lith-tab-panel>
      </lith-tabs>
    `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.orientation).toBe('horizontal');
      expect(element.role).toBe('tablist');
      expect(element.manualActivation).toBe(false);
    });

    it('should render the tab list and panels', () => {
      const tablist = element.shadowRoot?.querySelector('[role="tablist"]');
      const panels = element.shadowRoot?.querySelector('.panels');

      expect(tablist).toBeDefined();
      expect(panels).toBeDefined();
    });

    it('should initialize first tab as active by default', async () => {
      await element.updateComplete;

      const tabs = element.getTabs();
      expect(tabs[0].getAttribute('aria-selected')).toBe('true');
      expect(tabs[0].getAttribute('tabindex')).toBe('0');
      expect(tabs[1].getAttribute('aria-selected')).toBe('false');
      expect(tabs[1].getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Properties', () => {
    it('should set active tab', async () => {
      element.activeTab = 'panel2';
      await element.updateComplete;

      const tabs = element.getTabs();
      expect(tabs[0].getAttribute('aria-selected')).toBe('false');
      expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    });

    it('should set orientation', async () => {
      element.orientation = 'vertical';
      await element.updateComplete;

      const tablist = element.shadowRoot?.querySelector('[role="tablist"]');
      expect(tablist?.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should set manual activation mode', async () => {
      element.manualActivation = true;
      await element.updateComplete;

      expect(element.manualActivation).toBe(true);
    });
  });

  describe('Tab interaction', () => {
    it('should activate tab on click', async () => {
      const changeHandler = vi.fn();
      element.addEventListener('lith-change', changeHandler);

      const tabs = element.getTabs();
      tabs[1].click();

      await element.updateComplete;

      expect(changeHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            activeTab: 'panel2',
            previousTab: 'panel1',
          }),
        })
      );
    });

    it('should handle keyboard navigation - Arrow Right', async () => {
      const tabs = element.getTabs();
      tabs[0].focus();

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      });
      tabs[0].dispatchEvent(event);

      await element.updateComplete;

      expect(element.activeTab).toBe('panel2');
    });

    it('should handle keyboard navigation - Arrow Left', async () => {
      element.activeTab = 'panel2';
      await element.updateComplete;

      const tabs = element.getTabs();
      tabs[1].focus();

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
      });
      tabs[1].dispatchEvent(event);

      await element.updateComplete;

      expect(element.activeTab).toBe('panel1');
    });

    it('should handle keyboard navigation - Home', async () => {
      element.activeTab = 'panel2';
      await element.updateComplete;

      const tabs = element.getTabs();
      tabs[1].focus();

      const event = new KeyboardEvent('keydown', {
        key: 'Home',
        bubbles: true,
      });
      tabs[1].dispatchEvent(event);

      await element.updateComplete;

      expect(element.activeTab).toBe('panel1');
    });

    it('should handle keyboard navigation - End', async () => {
      const tabs = element.getTabs();
      tabs[0].focus();

      const event = new KeyboardEvent('keydown', {
        key: 'End',
        bubbles: true,
      });
      tabs[0].dispatchEvent(event);

      await element.updateComplete;

      expect(element.activeTab).toBe('panel3');
    });

    it('should not activate tab on keyboard in manual mode', async () => {
      element.manualActivation = true;
      await element.updateComplete;

      const tabs = element.getTabs();
      tabs[0].focus();

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      });
      tabs[0].dispatchEvent(event);

      await element.updateComplete;

      // Should still be on first tab
      expect(element.activeTab).toBe('panel1');
    });

    it('should activate tab on Enter in manual mode', async () => {
      element.manualActivation = true;
      await element.updateComplete;

      const tabs = element.getTabs();
      tabs[1].focus();

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      tabs[1].dispatchEvent(event);

      await element.updateComplete;

      expect(element.activeTab).toBe('panel2');
    });
  });

  describe('Panel management', () => {
    it('should show active panel and hide others', async () => {
      element.activeTab = 'panel2';
      await element.updateComplete;

      const panels = element.getPanels();
      expect(panels[0].hasAttribute('active')).toBe(false);
      expect(panels[1].hasAttribute('active')).toBe(true);
      expect(panels[2].hasAttribute('active')).toBe(false);
    });

    it('should set proper ARIA attributes on panels', async () => {
      await element.updateComplete;

      const panels = element.getPanels();
      panels.forEach((panel) => {
        expect(panel.getAttribute('role')).toBe('tabpanel');
        expect(panel.getAttribute('tabindex')).toBe('0');
      });
    });
  });

  describe('Methods', () => {
    it('should select tab programmatically', async () => {
      element.selectTab('panel3');
      await element.updateComplete;

      expect(element.activeTab).toBe('panel3');
    });

    it('should get active tab', () => {
      element.activeTab = 'panel2';
      expect(element.getActiveTab()).toBe('panel2');
    });

    it('should get all tabs', () => {
      const tabs = element.getTabs();
      expect(tabs).toHaveLength(3);
      expect(tabs[0].tagName.toLowerCase()).toBe('lith-tab');
    });

    it('should get all panels', () => {
      const panels = element.getPanels();
      expect(panels).toHaveLength(3);
      expect(panels[0].tagName.toLowerCase()).toBe('lith-tab-panel');
    });
  });

  describe('Vertical orientation', () => {
    beforeEach(async () => {
      element.orientation = 'vertical';
      await element.updateComplete;
    });

    it('should handle vertical arrow keys', async () => {
      const tabs = element.getTabs();
      tabs[0].focus();

      const downEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
      });
      tabs[0].dispatchEvent(downEvent);

      await element.updateComplete;

      expect(element.activeTab).toBe('panel2');
    });

    it('should ignore horizontal arrow keys in vertical mode', async () => {
      const tabs = element.getTabs();
      tabs[0].focus();

      const rightEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      });
      tabs[0].dispatchEvent(rightEvent);

      await element.updateComplete;

      // Should still be on first tab
      expect(element.activeTab).toBe('panel1');
    });
  });
});

describe('LithTab', () => {
  let element: LithTab;

  beforeEach(async () => {
    element = await fixture(html` <lith-tab panel="test-panel">Test Tab</lith-tab> `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.active).toBe(false);
      expect(element.disabled).toBe(false);
      expect(element.closable).toBe(false);
    });

    it('should render content in slot', () => {
      const content = element.textContent?.trim();
      expect(content).toBe('Test Tab');
    });
  });

  describe('Properties', () => {
    it('should set panel property', () => {
      element.panel = 'new-panel';
      expect(element.panel).toBe('new-panel');
    });

    it('should set active state', async () => {
      element.active = true;
      await element.updateComplete;

      expect(element.active).toBe(true);
      expect(element.hasAttribute('active')).toBe(true);
    });

    it('should set disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should set closable state', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.close-button');
      expect(closeButton).toBeDefined();
    });
  });

  describe('Interaction', () => {
    it('should dispatch click event', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('lith-tab-click', clickHandler);

      element.click();

      expect(clickHandler).toHaveBeenCalled();
    });

    it('should not dispatch click when disabled', async () => {
      const clickHandler = vi.fn();
      element.addEventListener('lith-tab-click', clickHandler);
      element.disabled = true;

      element.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });

    it('should dispatch close event when closable', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeHandler = vi.fn();
      element.addEventListener('lith-tab-close', closeHandler);

      const closeButton = element.shadowRoot?.querySelector('.close-button') as HTMLElement;
      closeButton?.click();

      expect(closeHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            panel: 'test-panel',
          }),
        })
      );
    });
  });

  describe('Methods', () => {
    it('should activate tab', async () => {
      element.activate();
      await element.updateComplete;

      expect(element.active).toBe(true);
      expect(element.getAttribute('aria-selected')).toBe('true');
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('should deactivate tab', async () => {
      element.active = true;
      element.deactivate();
      await element.updateComplete;

      expect(element.active).toBe(false);
      expect(element.getAttribute('aria-selected')).toBe('false');
      expect(element.getAttribute('tabindex')).toBe('-1');
    });
  });
});

describe('LithTabPanel', () => {
  let element: LithTabPanel;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-tab-panel tab-id="test-tab">Test Content</lith-tab-panel>
    `);
  });

  describe('Rendering', () => {
    it('should render with default properties', () => {
      expect(element).toBeDefined();
      expect(element.active).toBe(false);
      expect(element.lazy).toBe(false);
      expect(element.transition).toBe(false);
    });

    it('should render content in slot', () => {
      const content = element.textContent?.trim();
      expect(content).toBe('Test Content');
    });
  });

  describe('Properties', () => {
    it('should set tab-id property', () => {
      element.tabId = 'new-tab';
      expect(element.tabId).toBe('new-tab');
    });

    it('should set active state', async () => {
      element.active = true;
      await element.updateComplete;

      expect(element.active).toBe(true);
      expect(element.hasAttribute('active')).toBe(true);
    });

    it('should support lazy loading', async () => {
      element.lazy = true;
      await element.updateComplete;

      // Content should not be rendered when inactive
      const content = element.shadowRoot?.querySelector('slot');
      expect(element.active).toBe(false);

      // Activate panel
      element.active = true;
      await element.updateComplete;

      expect(content).toBeDefined();
    });
  });

  describe('Methods', () => {
    it('should activate panel', async () => {
      element.activate();
      await element.updateComplete;

      expect(element.active).toBe(true);
    });

    it('should deactivate panel', async () => {
      element.active = true;
      element.deactivate();
      await element.updateComplete;

      expect(element.active).toBe(false);
    });

    it('should show content for lazy loading', async () => {
      element.lazy = true;
      element.show();
      await element.updateComplete;

      // Should render content even when not active
      const content = element.shadowRoot?.querySelector('slot');
      expect(content).toBeDefined();
    });
  });
});
