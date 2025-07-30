import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './lith-progress.ts';
import type { LithProgress } from './lith-progress.ts';

describe('LithProgress', () => {
  let element: LithProgress;

  beforeEach(async () => {
    element = await fixture(html`<lith-progress></lith-progress>`);
  });

  describe('rendering', () => {
    it('should render with default properties', async () => {
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('lith-progress');
    });

    it('should have correct default values', () => {
      expect(element.max).toBe(100);
      expect(element.value).toBeUndefined();
      expect(element.getValueLabel).toBeUndefined();
    });

    it('should render progress bar with correct role', async () => {
      await element.updateComplete;
      const progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar).toBeTruthy();
      expect(progressBar?.getAttribute('role')).toBe('progressbar');
    });
  });

  describe('value handling', () => {
    it('should handle numeric value correctly', async () => {
      element.value = 50;
      await element.updateComplete;

      expect(element.getAttribute('data-value')).toBe('50');
      expect(element.getAttribute('data-state')).toBe('loading');

      const progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('should handle undefined value as indeterminate', async () => {
      element.value = undefined;
      await element.updateComplete;

      expect(element.getAttribute('data-state')).toBe('indeterminate');

      const progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.hasAttribute('aria-valuenow')).toBe(false);
      expect(progressBar?.getAttribute('aria-valuetext')).toBe('Loading...');
    });

    it('should handle complete state', async () => {
      element.value = 100;
      await element.updateComplete;

      expect(element.getAttribute('data-state')).toBe('complete');
      expect(element.getAttribute('data-value')).toBe('100');
    });

    it('should clamp values to valid range', async () => {
      // Test negative value
      element.value = -10;
      await element.updateComplete;
      expect(element.getAttribute('data-value')).toBe('0');

      // Test value exceeding max
      element.value = 150;
      element.max = 100;
      await element.updateComplete;
      expect(element.getAttribute('data-value')).toBe('100');
    });
  });

  describe('max property', () => {
    it('should handle custom max value', async () => {
      element.max = 200;
      element.value = 100;
      await element.updateComplete;

      expect(element.getAttribute('data-max')).toBe('200');

      const progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuemax')).toBe('200');
      expect(progressBar?.getAttribute('aria-valuenow')).toBe('100');
    });

    it('should calculate percentage correctly with custom max', async () => {
      element.max = 200;
      element.value = 100;
      await element.updateComplete;

      // 100/200 = 50%, so indicator should be at 50% (translateX(-50%))
      const indicator = element.shadowRoot?.querySelector('.progress-indicator');
      const style = indicator?.getAttribute('style');
      expect(style).toContain('translateX(-50%)');
    });
  });

  describe('accessibility', () => {
    it('should have correct ARIA attributes for determinate state', async () => {
      element.value = 75;
      element.max = 100;
      await element.updateComplete;

      const progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuemin')).toBe('0');
      expect(progressBar?.getAttribute('aria-valuemax')).toBe('100');
      expect(progressBar?.getAttribute('aria-valuenow')).toBe('75');
      expect(progressBar?.getAttribute('aria-valuetext')).toBe('75%');
      expect(progressBar?.getAttribute('aria-label')).toBe('75%');
    });

    it('should have correct ARIA attributes for indeterminate state', async () => {
      element.value = undefined;
      await element.updateComplete;

      const progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.hasAttribute('aria-valuenow')).toBe(false);
      expect(progressBar?.getAttribute('aria-valuetext')).toBe('Loading...');
      expect(progressBar?.getAttribute('aria-label')).toBe('Loading...');
    });

    it('should use custom label function when provided', async () => {
      element.value = 30;
      element.max = 100;
      element.getValueLabel = (value, max) => `已完成 ${value} / ${max} 项任务`;
      await element.updateComplete;

      const progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuetext')).toBe('已完成 30 / 100 项任务');
      expect(progressBar?.getAttribute('aria-label')).toBe('已完成 30 / 100 项任务');
    });
  });

  describe('data attributes', () => {
    it('should update data attributes correctly', async () => {
      element.value = 40;
      element.max = 80;
      await element.updateComplete;

      expect(element.getAttribute('data-state')).toBe('loading');
      expect(element.getAttribute('data-value')).toBe('40');
      expect(element.getAttribute('data-max')).toBe('80');
    });

    it('should handle state transitions', async () => {
      // Start with indeterminate
      element.value = undefined;
      await element.updateComplete;
      expect(element.getAttribute('data-state')).toBe('indeterminate');

      // Change to loading
      element.value = 50;
      await element.updateComplete;
      expect(element.getAttribute('data-state')).toBe('loading');

      // Change to complete
      element.value = 100;
      await element.updateComplete;
      expect(element.getAttribute('data-state')).toBe('complete');
    });
  });

  describe('styling', () => {
    it('should apply correct transform for indicator', async () => {
      element.value = 25;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.progress-indicator');
      const style = indicator?.getAttribute('style');
      // 25% progress means translateX(-75%)
      expect(style).toContain('translateX(-75%)');
    });

    it('should not apply transform for indeterminate state', async () => {
      element.value = undefined;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.progress-indicator');
      const style = indicator?.getAttribute('style');
      expect(style).toBe('');
    });

    it('should have indeterminate data attribute for CSS animation', async () => {
      element.value = undefined;
      await element.updateComplete;

      expect(element.getAttribute('data-state')).toBe('indeterminate');
    });
  });

  describe('edge cases', () => {
    it('should handle zero value', async () => {
      element.value = 0;
      await element.updateComplete;

      expect(element.getAttribute('data-value')).toBe('0');
      expect(element.getAttribute('data-state')).toBe('loading');

      const indicator = element.shadowRoot?.querySelector('.progress-indicator');
      const style = indicator?.getAttribute('style');
      expect(style).toContain('translateX(-100%)');
    });

    it('should handle null value as indeterminate', async () => {
      element.value = null as unknown as undefined;
      await element.updateComplete;

      expect(element.getAttribute('data-state')).toBe('indeterminate');
    });

    it('should handle decimal values', async () => {
      element.value = 33.33;
      await element.updateComplete;

      expect(element.getAttribute('data-value')).toBe('33.33');

      const progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuetext')).toBe('33%'); // rounded
    });
  });

  describe('updates', () => {
    it('should update when value changes', async () => {
      element.value = 25;
      await element.updateComplete;

      let progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuenow')).toBe('25');

      element.value = 75;
      await element.updateComplete;

      progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuenow')).toBe('75');
    });

    it('should update when max changes', async () => {
      element.value = 50;
      element.max = 100;
      await element.updateComplete;

      let progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuetext')).toBe('50%');

      element.max = 200;
      await element.updateComplete;

      progressBar = element.shadowRoot?.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute('aria-valuetext')).toBe('25%'); // 50/200 = 25%
    });
  });
});
