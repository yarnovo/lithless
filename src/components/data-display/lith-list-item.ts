import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * 列表项组件
 * 用于自定义列表项的内容和样式
 */
@customElement('lith-list-item')
export class LithListItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .item-container {
      display: flex;
      align-items: center;
      padding: var(--lith-list-item-padding, 12px 16px);
      background: var(--lith-list-item-background, transparent);
      border-radius: var(--lith-list-item-border-radius, 0);
      transition: all 0.15s ease;
      cursor: pointer;
      user-select: none;
      min-height: var(--lith-list-item-min-height, 48px);
    }

    :host([disabled]) .item-container {
      opacity: 0.6;
      cursor: not-allowed;
      color: var(--lith-list-item-disabled-color, #999999);
    }

    :host([selected]) .item-container {
      background: var(--lith-list-item-selected-background, #e3f2fd);
      color: var(--lith-list-item-selected-color, #1976d2);
    }

    :host(:hover:not([disabled])) .item-container {
      background: var(--lith-list-item-hover-background, #f5f5f5);
    }

    :host([focused]) .item-container {
      outline: 2px solid var(--lith-list-focus-color, #1976d2);
      outline-offset: -2px;
    }

    .item-prefix {
      margin-right: var(--lith-list-item-prefix-margin, 8px);
    }

    .item-content {
      flex: 1;
      overflow: hidden;
    }

    .item-suffix {
      margin-left: var(--lith-list-item-suffix-margin, 8px);
    }

    .selection-indicator {
      width: var(--lith-list-selection-indicator-size, 16px);
      height: var(--lith-list-selection-indicator-size, 16px);
      margin-right: var(--lith-list-selection-indicator-margin, 8px);
      border: 2px solid var(--lith-list-selection-indicator-border, #d0d0d0);
      border-radius: 2px;
      background: var(--lith-list-selection-indicator-background, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
    }

    .selection-indicator.selected {
      background: var(--lith-list-selection-indicator-selected-background, #1976d2);
      border-color: var(--lith-list-selection-indicator-selected-border, #1976d2);
      color: white;
    }

    .checkbox-indicator {
      border-radius: 2px;
    }

    .radio-indicator {
      border-radius: 50%;
    }

    .item-title {
      font-weight: var(--lith-list-item-title-weight, 500);
      color: var(--lith-list-item-title-color, inherit);
      margin-bottom: var(--lith-list-item-title-margin, 2px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-description {
      font-size: var(--lith-list-item-description-size, 0.875em);
      color: var(--lith-list-item-description-color, #666666);
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  `;

  @property({ type: String }) value: string = '';
  @property({ type: String }) title: string = '';
  @property({ type: String }) description: string = '';
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) focused = false;
  @property({ type: String, attribute: 'selection-mode' }) selectionMode:
    | 'none'
    | 'single'
    | 'multiple' = 'none';
  @property({ type: Boolean, attribute: 'show-selection-indicator' }) showSelectionIndicator =
    false;

  handleClick = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('lith-item-click', {
        detail: {
          value: this.value,
          title: this.title,
          description: this.description,
          selected: this.selected,
        },
        bubbles: true,
      })
    );
  };

  private renderSelectionIndicator(): unknown {
    if (!this.showSelectionIndicator || this.selectionMode === 'none') {
      return '';
    }

    const indicatorClass =
      this.selectionMode === 'single' ? 'radio-indicator' : 'checkbox-indicator';

    return html`
      <div class="selection-indicator ${indicatorClass} ${this.selected ? 'selected' : ''}">
        ${this.selected ? '✓' : ''}
      </div>
    `;
  }

  private renderContent(): unknown {
    if (this.title || this.description) {
      return html`
        <div class="item-meta">
          ${this.title ? html`<div class="item-title">${this.title}</div>` : ''}
          ${this.description ? html`<div class="item-description">${this.description}</div>` : ''}
        </div>
      `;
    }

    return html`<slot></slot>`;
  }

  protected render(): unknown {
    return html`
      <div
        class="item-container"
        @click=${this.handleClick}
        role="option"
        aria-selected="${this.selected}"
        aria-disabled="${this.disabled}"
      >
        ${this.renderSelectionIndicator()}

        <div class="item-prefix">
          <slot name="prefix"></slot>
        </div>

        <div class="item-content">${this.renderContent()}</div>

        <div class="item-suffix">
          <slot name="suffix"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-list-item': LithListItem;
  }
}
