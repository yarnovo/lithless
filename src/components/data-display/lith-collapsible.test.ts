import { expect, describe, it, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-collapsible.js';
import type { LithCollapsible, CollapsibleChangeDetail } from './lith-collapsible.js';

describe('LithCollapsible', () => {
  let element: LithCollapsible;

  beforeEach(async () => {
    element = await fixture(html`
      <lith-collapsible>
        <button slot="trigger">Toggle</button>
        <div>Content to collapse</div>
      </lith-collapsible>
    `);
  });

  it('should render with default properties', () => {
    expect(element).toBeDefined();
    expect(element.open).toBe(false);
    expect(element.disabled).toBe(false);
  });

  it('should reflect open state in attributes', async () => {
    element.open = true;
    await element.updateComplete;
    expect(element.hasAttribute('open')).toBe(true);

    element.open = false;
    await element.updateComplete;
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('should reflect disabled state in attributes', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  it('should handle default-open attribute', async () => {
    const elementWithDefault = await fixture(html`
      <lith-collapsible default-open="true">
        <button slot="trigger">Toggle</button>
        <div>Content</div>
      </lith-collapsible>
    `);
    expect((elementWithDefault as LithCollapsible).open).toBe(true);
  });

  it('should toggle when calling toggle method', async () => {
    expect(element.open).toBe(false);

    element.toggle();
    await element.updateComplete;
    expect(element.open).toBe(true);

    element.toggle();
    await element.updateComplete;
    expect(element.open).toBe(false);
  });

  it('should expand when calling expand method', async () => {
    expect(element.open).toBe(false);

    element.expand();
    await element.updateComplete;
    expect(element.open).toBe(true);
  });

  it('should collapse when calling collapse method', async () => {
    element.open = true;
    await element.updateComplete;

    element.collapse();
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

  it('should dispatch lith-change event when state changes', async () => {
    let changeDetail: CollapsibleChangeDetail | null = null;
    element.addEventListener('lith-change', ((e: CustomEvent<CollapsibleChangeDetail>) => {
      changeDetail = e.detail;
    }) as EventListener);

    element.open = true;
    await element.updateComplete;

    expect(changeDetail).toEqual({ open: true });
  });

  it('should handle trigger click events', async () => {
    const trigger = element.querySelector('[slot="trigger"]') as HTMLElement;

    // Simulate click
    trigger.click();
    await element.updateComplete;

    expect(element.open).toBe(true);
  });

  it('should handle keyboard events on trigger', async () => {
    const trigger = element.querySelector('[slot="trigger"]') as HTMLElement;

    // Simulate Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    trigger.dispatchEvent(enterEvent);
    await element.updateComplete;

    expect(element.open).toBe(true);

    // Simulate Space key
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    trigger.dispatchEvent(spaceEvent);
    await element.updateComplete;

    expect(element.open).toBe(false);
  });

  it('should set proper ARIA attributes', async () => {
    await element.updateComplete;

    const trigger = element.querySelector('[slot="trigger"]') as HTMLElement;
    expect(trigger.getAttribute('role')).toBe('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-disabled')).toBe('false');

    element.open = true;
    await element.updateComplete;
    // Note: ARIA attributes are updated via attributeChangedCallback
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should handle disabled state properly', async () => {
    element.disabled = true;
    await element.updateComplete;

    const trigger = element.querySelector('[slot="trigger"]') as HTMLElement;
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(trigger.getAttribute('tabindex')).toBe('-1');
  });

  it('should update content visibility based on open state', async () => {
    const contentRegion = element.shadowRoot?.querySelector('[role="region"]') as HTMLElement;

    expect(contentRegion.getAttribute('aria-hidden')).toBe('true');

    element.open = true;
    await element.updateComplete;

    expect(contentRegion.getAttribute('aria-hidden')).toBe('false');
  });

  it('should respect reduced motion preference', async () => {
    await element.updateComplete;
    // Note: Testing CSS media queries in unit tests is limited
    // This mainly ensures the component has styles defined
    const styles = element.constructor as typeof LithCollapsible;
    expect(styles.styles).toBeDefined();
    // Check if the styles string contains reduced motion media query
    const styleString = styles.styles.toString();
    expect(styleString).toContain('prefers-reduced-motion');
  });

  it('should handle missing trigger gracefully', async () => {
    const elementWithoutTrigger = await fixture(html`
      <lith-collapsible>
        <div>Content only</div>
      </lith-collapsible>
    `);

    // Should not throw error
    expect(() => (elementWithoutTrigger as LithCollapsible).toggle()).not.toThrow();
  });

  it('should support custom CSS properties', async () => {
    element.style.setProperty('--lith-collapsible-focus-color', '#ff0000');
    element.style.setProperty('--lith-collapsible-transition-duration', '0.5s');
    element.style.setProperty('--lith-collapsible-content-padding', '1rem');

    await element.updateComplete;

    // Basic check that custom properties can be set
    expect(element.style.getPropertyValue('--lith-collapsible-focus-color')).toBe('#ff0000');
  });
});
