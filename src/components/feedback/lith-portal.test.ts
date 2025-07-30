import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html, waitUntil } from '@open-wc/testing';
import './lith-portal.js';
import type { LithPortal } from './lith-portal.js';

describe('LithPortal', () => {
  let element: LithPortal;
  let testTarget: HTMLDivElement;

  beforeEach(async () => {
    // Create a test target element
    testTarget = document.createElement('div');
    testTarget.id = 'test-portal-target';
    document.body.appendChild(testTarget);
  });

  afterEach(() => {
    // Clean up
    testTarget?.remove();
    // Clean up any default portal containers
    const containers = document.querySelectorAll('[id^="lith-portal-container"]');
    containers.forEach((container) => container.remove());
  });

  describe('Rendering', () => {
    it('should render with default properties', async () => {
      element = await fixture(html`
        <lith-portal>
          <div>Portal content</div>
        </lith-portal>
      `);

      expect(element).toBeDefined();
      expect(element.renderInPlace).toBe(false);
      expect(element.active).toBe(true);
      expect(element.containerId).toBe('lith-portal-container');
    });

    it('should render content in default portal container', async () => {
      element = await fixture(html`
        <lith-portal>
          <div id="portal-content">Portal content</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      // Content should be in the default container
      const defaultContainer = document.getElementById('lith-portal-container');
      expect(defaultContainer).toBeDefined();

      const content = defaultContainer?.querySelector('#portal-content');
      expect(content).toBeDefined();
      expect(content?.textContent).toBe('Portal content');
    });

    it('should render content to custom target', async () => {
      element = await fixture(html`
        <lith-portal target="#test-portal-target">
          <div id="custom-content">Custom portal content</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      // Content should be in the custom target
      const content = testTarget.querySelector('#custom-content');
      expect(content).toBeDefined();
      expect(content?.textContent).toBe('Custom portal content');
    });

    it('should render in place when renderInPlace is true', async () => {
      element = await fixture(html`
        <lith-portal render-in-place>
          <div id="in-place-content">In-place content</div>
        </lith-portal>
      `);

      await element.updateComplete;

      // Content should remain in the original position
      const content = element.querySelector('#in-place-content');
      expect(content).toBeDefined();
      expect(content?.textContent).toBe('In-place content');
      expect(element.isMounted()).toBe(false);
    });
  });

  describe('Properties', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <lith-portal>
          <div id="test-content">Test content</div>
        </lith-portal>
      `);
    });

    it('should handle active property changes', async () => {
      await waitUntil(() => element.isMounted());
      expect(element.isMounted()).toBe(true);

      // Deactivate portal
      element.active = false;
      await element.updateComplete;

      expect(element.isMounted()).toBe(false);

      // Content should be back in original position
      const content = element.querySelector('#test-content');
      expect(content).toBeDefined();
    });

    it('should handle target property changes', async () => {
      // Change target to custom element
      element.target = '#test-portal-target';
      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      const content = testTarget.querySelector('#test-content');
      expect(content).toBeDefined();
    });

    it('should handle renderInPlace property changes', async () => {
      await waitUntil(() => element.isMounted());

      // Switch to render in place
      element.renderInPlace = true;
      await element.updateComplete;

      expect(element.isMounted()).toBe(false);
      const content = element.querySelector('#test-content');
      expect(content).toBeDefined();
    });

    it('should handle custom container ID', async () => {
      const customElement = (await fixture(html`
        <lith-portal container-id="custom-portal-container">
          <div>Custom container content</div>
        </lith-portal>
      `)) as LithPortal;

      await customElement.updateComplete;
      await waitUntil(() => customElement.isMounted());

      const customContainer = document.getElementById('custom-portal-container');
      expect(customContainer).toBeDefined();
    });
  });

  describe('Content Movement', () => {
    it('should move multiple nodes to portal', async () => {
      element = await fixture(html`
        <lith-portal target="#test-portal-target">
          <div id="node1">Node 1</div>
          <div id="node2">Node 2</div>
          <span id="node3">Node 3</span>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      // All nodes should be in the target
      expect(testTarget.querySelector('#node1')).toBeDefined();
      expect(testTarget.querySelector('#node2')).toBeDefined();
      expect(testTarget.querySelector('#node3')).toBeDefined();
    });

    it('should preserve node order when moving', async () => {
      element = await fixture(html`
        <lith-portal target="#test-portal-target">
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      const children = Array.from(testTarget.children);
      expect(children[0].textContent).toBe('First');
      expect(children[1].textContent).toBe('Second');
      expect(children[2].textContent).toBe('Third');
    });

    it('should handle dynamic content changes', async () => {
      element = await fixture(html`
        <lith-portal target="#test-portal-target">
          <div id="initial">Initial content</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      // Add new content
      const newDiv = document.createElement('div');
      newDiv.id = 'dynamic';
      newDiv.textContent = 'Dynamic content';
      element.appendChild(newDiv);

      // Wait for slot change
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(testTarget.querySelector('#initial')).toBeDefined();
      expect(testTarget.querySelector('#dynamic')).toBeDefined();
    });
  });

  describe('Events', () => {
    it('should emit mount event when content is mounted', async () => {
      const mountSpy = vi.fn();

      element = await fixture(html`
        <lith-portal target="#test-portal-target" @lith-portal-mount=${mountSpy}>
          <div>Content</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      expect(mountSpy).toHaveBeenCalledOnce();
      const event = mountSpy.mock.calls[0][0];
      expect(event.detail.target).toBe(testTarget);
    });

    it('should emit unmount event when content is unmounted', async () => {
      const unmountSpy = vi.fn();

      element = await fixture(html`
        <lith-portal target="#test-portal-target" @lith-portal-unmount=${unmountSpy}>
          <div>Content</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      // Deactivate to trigger unmount
      element.active = false;
      await element.updateComplete;

      expect(unmountSpy).toHaveBeenCalledOnce();
    });
  });

  describe('Methods', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <lith-portal target="#test-portal-target">
          <div id="method-test">Method test content</div>
        </lith-portal>
      `);
      await element.updateComplete;
      await waitUntil(() => element.isMounted());
    });

    it('should return portal target with getPortalTarget()', () => {
      const target = element.getPortalTarget();
      expect(target).toBe(testTarget);
    });

    it('should return mounted state with isMounted()', async () => {
      expect(element.isMounted()).toBe(true);

      element.active = false;
      await element.updateComplete;

      expect(element.isMounted()).toBe(false);
    });

    it('should remount content with remount()', async () => {
      // Move content back
      element.active = false;
      await element.updateComplete;

      expect(testTarget.querySelector('#method-test')).toBeNull();

      // Remount
      element.active = true;
      element.remount();
      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      expect(testTarget.querySelector('#method-test')).toBeDefined();
    });
  });

  describe('Cleanup', () => {
    it('should clean up default container when empty', async () => {
      element = await fixture(html`
        <lith-portal>
          <div>Content</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      const container = document.getElementById('lith-portal-container');
      expect(container).toBeDefined();

      // Remove element
      element.remove();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Container should be cleaned up
      expect(document.getElementById('lith-portal-container')).toBeNull();
    });

    it('should not clean up container with other content', async () => {
      // Create first portal
      const portal1 = (await fixture(html`
        <lith-portal>
          <div>Portal 1</div>
        </lith-portal>
      `)) as LithPortal;

      // Create second portal using same container
      const portal2 = (await fixture(html`
        <lith-portal>
          <div>Portal 2</div>
        </lith-portal>
      `)) as LithPortal;

      await portal1.updateComplete;
      await portal2.updateComplete;
      await waitUntil(() => portal1.isMounted() && portal2.isMounted());

      // Remove first portal
      portal1.remove();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Container should still exist
      const container = document.getElementById('lith-portal-container');
      expect(container).toBeDefined();
      expect(container?.children.length).toBeGreaterThan(0);

      // Clean up
      portal2.remove();
    });
  });

  describe('Pointer Events', () => {
    it('should set pointer-events auto on moved content', async () => {
      element = await fixture(html`
        <lith-portal target="#test-portal-target">
          <div id="pointer-test">Clickable content</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      const content = testTarget.querySelector('#pointer-test') as HTMLElement;
      expect(content.style.pointerEvents).toBe('auto');
    });

    it('should reset pointer-events when moving back', async () => {
      element = await fixture(html`
        <lith-portal target="#test-portal-target">
          <div id="pointer-reset" style="pointer-events: none;">Content</div>
        </lith-portal>
      `);

      await element.updateComplete;
      await waitUntil(() => element.isMounted());

      // Deactivate to move back
      element.active = false;
      await element.updateComplete;

      const content = element.querySelector('#pointer-reset') as HTMLElement;
      expect(content.style.pointerEvents).toBe('');
    });
  });
});
