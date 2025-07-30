import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Accordion item component that represents a collapsible content section
 *
 * @fires lith-accordion-item-toggle - Internal event fired when item is toggled
 * @slot trigger - Custom trigger content (optional)
 * @slot - Default slot for accordion item content
 */
@customElement('lith-accordion-item')
export class LithAccordionItem extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--lith-accordion-header-padding, 1rem);
      background: var(--lith-accordion-header-bg, transparent);
      border: none;
      text-align: left;
      cursor: pointer;
      font-size: var(--lith-accordion-header-font-size, 1rem);
      font-weight: var(--lith-accordion-header-font-weight, 500);
      color: var(--lith-accordion-header-color, inherit);
      transition: background-color 0.15s ease;
    }

    .header:hover {
      background: var(--lith-accordion-header-hover-bg, #f9fafb);
    }

    .header:focus {
      outline: 2px solid var(--lith-accordion-focus-color, #3b82f6);
      outline-offset: -2px;
    }

    .header[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .trigger-content {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .chevron {
      width: var(--lith-accordion-chevron-size, 1rem);
      height: var(--lith-accordion-chevron-size, 1rem);
      margin-left: var(--lith-accordion-chevron-margin, 0.5rem);
      transition: transform 0.2s ease;
      fill: var(--lith-accordion-chevron-color, currentColor);
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    .content {
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .content.closed {
      height: 0;
    }

    .content.open {
      height: auto;
    }

    .content-inner {
      padding: var(--lith-accordion-content-padding, 0 1rem 1rem 1rem);
      color: var(--lith-accordion-content-color, inherit);
    }

    @media (prefers-reduced-motion: reduce) {
      .header,
      .chevron,
      .content {
        transition: none;
      }
    }
  `;

  @property({ type: String })
  value!: string;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @query('.content')
  private _contentElement!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    if (!this.value) {
      console.warn('lith-accordion-item: value property is required');
    }
  }

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('open')) {
      this._updateContentHeight();
    }
  }

  private _updateContentHeight() {
    if (!this._contentElement) return;

    if (this.open) {
      // 获取内容的实际高度
      this._contentElement.style.height = 'auto';
      const height = this._contentElement.scrollHeight;
      this._contentElement.style.height = '0';
      // 强制重绘后设置实际高度
      requestAnimationFrame(() => {
        this._contentElement.style.height = `${height}px`;
      });
    } else {
      this._contentElement.style.height = '0';
    }
  }

  private _handleToggle = () => {
    if (this.disabled) return;

    const newOpen = !this.open;

    // 派发内部事件给父级 accordion
    this.dispatchEvent(
      new CustomEvent('lith-accordion-item-toggle', {
        detail: { value: this.value, open: newOpen },
        bubbles: true,
      })
    );
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleToggle();
    }
  };

  render() {
    const headerClasses = {
      header: true,
    };

    const chevronClasses = {
      chevron: true,
      open: this.open,
    };

    const contentClasses = {
      content: true,
      open: this.open,
      closed: !this.open,
    };

    return html`
      <button
        class=${classMap(headerClasses)}
        type="button"
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @click=${this._handleToggle}
        @keydown=${this._handleKeyDown}
      >
        <div class="trigger-content">
          <slot name="trigger">
            <span>Accordion Item</span>
          </slot>
        </div>
        <svg class=${classMap(chevronClasses)} viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      <div
        class=${classMap(contentClasses)}
        role="region"
        aria-hidden=${this.open ? 'false' : 'true'}
      >
        <div class="content-inner">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-accordion-item': LithAccordionItem;
  }
}
