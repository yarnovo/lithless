import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LithAccordionItem } from './lith-accordion-item.js';

export interface AccordionChangeDetail {
  openItems: string[];
  changedItem: string;
  action: 'open' | 'close';
}

/**
 * Accordion component that manages collapsible content sections
 *
 * @fires lith-change - Fired when accordion items are opened or closed
 * @slot - Default slot for accordion items
 */
@customElement('lith-accordion')
export class LithAccordion extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 1px solid var(--lith-accordion-border-color, #e5e7eb);
      border-radius: var(--lith-accordion-border-radius, 0.375rem);
      overflow: hidden;
    }

    ::slotted(lith-accordion-item:not(:last-child)) {
      border-bottom: 1px solid var(--lith-accordion-border-color, #e5e7eb);
    }
  `;

  @property({ type: String })
  type: 'single' | 'multiple' = 'single';

  @property({ type: String })
  collapsible = 'false';

  @property({ type: String, attribute: 'default-value' })
  defaultValue?: string;

  @property({ type: String })
  value?: string;

  @state()
  private _openItems = new Set<string>();

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('lith-accordion-item-toggle', this._handleItemToggle as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('lith-accordion-item-toggle', this._handleItemToggle as EventListener);
  }

  protected firstUpdated() {
    if (this.defaultValue) {
      this._openItems.add(this.defaultValue);
      this._updateItemsState();
    }
  }

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('value') && this.value !== undefined) {
      this._openItems.clear();
      if (this.value) {
        this._openItems.add(this.value);
      }
      this._updateItemsState();
    }
  }

  private _handleItemToggle = (event: CustomEvent<{ value: string; open: boolean }>) => {
    event.stopPropagation();
    const { value, open } = event.detail;

    if (open) {
      if (this.type === 'single') {
        // 单选模式：关闭其他项目
        this._openItems.clear();
        this._openItems.add(value);
      } else {
        // 多选模式：添加到打开列表
        this._openItems.add(value);
      }
    } else {
      // 检查是否可以折叠
      if (this.type === 'single' && this.collapsible === 'false' && this._openItems.has(value)) {
        // 单选且不可折叠模式下，阻止关闭最后一个打开的项目
        event.preventDefault();
        return;
      }
      this._openItems.delete(value);
    }

    this._updateItemsState();
    this._dispatchChangeEvent(value, open ? 'open' : 'close');
  };

  private _updateItemsState() {
    // 重新查询以确保获取最新的元素列表
    const items = this.querySelectorAll('lith-accordion-item') as NodeListOf<LithAccordionItem>;
    items.forEach((item) => {
      const isOpen = this._openItems.has(item.value);
      if (item.open !== isOpen) {
        item.open = isOpen;
      }
    });
  }

  private _dispatchChangeEvent(changedItem: string, action: 'open' | 'close') {
    const detail: AccordionChangeDetail = {
      openItems: Array.from(this._openItems),
      changedItem,
      action,
    };

    this.dispatchEvent(
      new CustomEvent('lith-change', {
        detail,
        bubbles: true,
      })
    );
  }

  /**
   * 打开指定的项目
   */
  openItem(value: string) {
    if (this.type === 'single') {
      this._openItems.clear();
    }
    this._openItems.add(value);
    this._updateItemsState();
    this._dispatchChangeEvent(value, 'open');
  }

  /**
   * 关闭指定的项目
   */
  closeItem(value: string) {
    if (this.type === 'single' && this.collapsible === 'false' && this._openItems.size === 1) {
      return; // 不可折叠的单选模式下不能关闭最后一个项目
    }
    this._openItems.delete(value);
    this._updateItemsState();
    this._dispatchChangeEvent(value, 'close');
  }

  /**
   * 切换指定项目的开关状态
   */
  toggleItem(value: string) {
    if (this._openItems.has(value)) {
      this.closeItem(value);
    } else {
      this.openItem(value);
    }
  }

  /**
   * 获取当前打开的项目列表
   */
  getOpenItems(): string[] {
    return Array.from(this._openItems);
  }

  render() {
    return html` <slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-accordion': LithAccordion;
  }
}
