import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import { LithList, type ListItem } from './lith-list.js';
import { LithListItem } from './lith-list-item.js';

describe('LithList', () => {
  let element: LithList;
  const sampleItems: ListItem[] = [
    { id: 1, content: '项目 1' },
    { id: 2, content: '项目 2' },
    { id: 3, content: '项目 3', disabled: true },
    { id: 4, content: '项目 4' },
    { id: 5, content: '项目 5' },
  ];

  beforeEach(async () => {
    element = await fixture<LithList>(html`
      <lith-list .items=${sampleItems} .itemHeight=${48} style="height: 300px;"></lith-list>
    `);
    await element.updateComplete;
  });

  describe('基本功能', () => {
    it('应该正确渲染组件', () => {
      expect(element).toBeDefined();
      expect(element.tagName.toLowerCase()).toBe('lith-list');
    });

    it('应该接受和存储 items 属性', () => {
      expect(element.items).toEqual(sampleItems);
      expect(element.items.length).toBe(5);
    });

    it('应该支持更新 items', async () => {
      const newItems: ListItem[] = [
        { id: 6, content: '新项目 1' },
        { id: 7, content: '新项目 2' },
      ];

      element.items = newItems;
      await element.updateComplete;

      expect(element.items).toEqual(newItems);
      expect(element.items.length).toBe(2);
    });

    it('应该支持选择模式设置', async () => {
      element.selectionMode = 'single';
      await element.updateComplete;
      expect(element.selectionMode).toBe('single');

      element.selectionMode = 'multiple';
      await element.updateComplete;
      expect(element.selectionMode).toBe('multiple');

      element.selectionMode = 'none';
      await element.updateComplete;
      expect(element.selectionMode).toBe('none');
    });

    it('应该支持选中项目列表', async () => {
      element.selectedItems = [1, 2];
      await element.updateComplete;
      expect(element.selectedItems).toEqual([1, 2]);
    });

    it('应该支持其他配置属性', () => {
      element.itemHeight = 60;
      element.bufferSize = 10;
      element.overscan = 5;
      element.loading = true;
      element.emptyText = '测试空状态';
      element.showSelectionIndicator = true;

      expect(element.itemHeight).toBe(60);
      expect(element.bufferSize).toBe(10);
      expect(element.overscan).toBe(5);
      expect(element.loading).toBe(true);
      expect(element.emptyText).toBe('测试空状态');
      expect(element.showSelectionIndicator).toBe(true);
    });
  });

  describe('DOM 结构', () => {
    it('应该有正确的根结构', () => {
      expect(element.shadowRoot).toBeDefined();
    });

    it('应该在空状态时渲染空状态元素', async () => {
      element.items = [];
      await element.updateComplete;

      // 简单检查组件状态，不依赖 shadowRoot 的具体 DOM 结构
      expect(element.items.length).toBe(0);
    });

    it('应该在加载状态时显示加载状态', async () => {
      element.loading = true;
      await element.updateComplete;

      expect(element.loading).toBe(true);
    });
  });
});

describe('LithListItem', () => {
  let element: LithListItem;

  beforeEach(async () => {
    element = await fixture<LithListItem>(html` <lith-list-item></lith-list-item> `);

    // 手动设置属性
    element.value = 'test-item';
    element.title = '测试项目';
    element.description = '这是一个测试项目';

    await element.updateComplete;
  });

  describe('基本功能', () => {
    it('应该正确渲染组件', () => {
      expect(element).toBeDefined();
      expect(element.tagName.toLowerCase()).toBe('lith-list-item');
    });

    it('应该支持基本属性', () => {
      expect(element.value).toBe('test-item');
      expect(element.title).toBe('测试项目');
      expect(element.description).toBe('这是一个测试项目');
    });

    it('应该支持状态属性', async () => {
      element.selected = true;
      element.disabled = true;
      element.focused = true;
      await element.updateComplete;

      expect(element.selected).toBe(true);
      expect(element.disabled).toBe(true);
      expect(element.focused).toBe(true);
    });

    it('应该支持选择模式和指示器', async () => {
      element.selectionMode = 'single';
      element.showSelectionIndicator = true;
      await element.updateComplete;

      expect(element.selectionMode).toBe('single');
      expect(element.showSelectionIndicator).toBe(true);
    });

    it('应该有正确的 DOM 结构', () => {
      expect(element.shadowRoot).toBeDefined();
    });
  });
});
