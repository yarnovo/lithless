import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lith-badge')
export class LithBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      border-radius: var(--lith-badge-border-radius, 6px);
      padding: var(--lith-badge-padding-x, 10px) var(--lith-badge-padding-y, 2.5px);
      font-size: var(--lith-badge-font-size, 12px);
      font-weight: var(--lith-badge-font-weight, 600);
      line-height: var(--lith-badge-line-height, 1);
      white-space: nowrap;
      transition: var(
        --lith-badge-transition,
        color 0.15s ease-in-out,
        background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out
      );
      cursor: default;
      user-select: none;
      border: var(--lith-badge-border-width, 1px) solid var(--lith-badge-border-color, transparent);
    }

    :host(:focus-visible) {
      outline: var(--lith-badge-focus-outline, 2px solid var(--lith-badge-focus-color, #3b82f6));
      outline-offset: var(--lith-badge-focus-outline-offset, 2px);
    }

    /* Default variant */
    :host([variant='default']),
    :host(:not([variant])) {
      background-color: var(--lith-badge-default-bg, #18181b);
      color: var(--lith-badge-default-color, #fafafa);
      border-color: var(--lith-badge-default-border, transparent);
    }

    :host([variant='default']:hover),
    :host(:not([variant]):hover) {
      background-color: var(--lith-badge-default-hover-bg, #27272a);
    }

    /* Secondary variant */
    :host([variant='secondary']) {
      background-color: var(--lith-badge-secondary-bg, #f4f4f5);
      color: var(--lith-badge-secondary-color, #18181b);
      border-color: var(--lith-badge-secondary-border, transparent);
    }

    :host([variant='secondary']:hover) {
      background-color: var(--lith-badge-secondary-hover-bg, #e4e4e7);
    }

    /* Destructive variant */
    :host([variant='destructive']) {
      background-color: var(--lith-badge-destructive-bg, #dc2626);
      color: var(--lith-badge-destructive-color, #fafafa);
      border-color: var(--lith-badge-destructive-border, transparent);
    }

    :host([variant='destructive']:hover) {
      background-color: var(--lith-badge-destructive-hover-bg, #b91c1c);
    }

    /* Outline variant */
    :host([variant='outline']) {
      background-color: var(--lith-badge-outline-bg, transparent);
      color: var(--lith-badge-outline-color, #18181b);
      border-color: var(--lith-badge-outline-border, #e4e4e7);
    }

    :host([variant='outline']:hover) {
      background-color: var(--lith-badge-outline-hover-bg, #f4f4f5);
    }

    /* Size variants */
    :host([size='sm']) {
      font-size: var(--lith-badge-sm-font-size, 10px);
      padding: var(--lith-badge-sm-padding-x, 8px) var(--lith-badge-sm-padding-y, 1px);
      border-radius: var(--lith-badge-sm-border-radius, 4px);
    }

    :host([size='lg']) {
      font-size: var(--lith-badge-lg-font-size, 14px);
      padding: var(--lith-badge-lg-padding-x, 12px) var(--lith-badge-lg-padding-y, 4px);
      border-radius: var(--lith-badge-lg-border-radius, 8px);
    }

    /* Dot variant - for numeric or minimal badges */
    :host([dot]) {
      min-width: var(--lith-badge-dot-size, 20px);
      height: var(--lith-badge-dot-size, 20px);
      padding: var(--lith-badge-dot-padding, 0);
      border-radius: var(--lith-badge-dot-border-radius, 50%);
      justify-content: center;
      font-family: var(
        --lith-badge-dot-font-family,
        ui-monospace,
        'Cascadia Code',
        'Source Code Pro',
        Menlo,
        Consolas,
        'DejaVu Sans Mono',
        monospace
      );
      font-variant-numeric: tabular-nums;
    }

    /* Interactive state */
    :host([interactive]) {
      cursor: pointer;
    }

    :host([interactive]:hover) {
      opacity: var(--lith-badge-interactive-hover-opacity, 0.8);
    }

    :host([interactive]:active) {
      transform: var(--lith-badge-interactive-active-transform, scale(0.95));
    }

    /* Disabled state */
    :host([disabled]) {
      opacity: var(--lith-badge-disabled-opacity, 0.5);
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      :host([variant='default']),
      :host(:not([variant])) {
        background-color: var(--lith-badge-default-bg-dark, #fafafa);
        color: var(--lith-badge-default-color-dark, #18181b);
      }

      :host([variant='default']:hover),
      :host(:not([variant]):hover) {
        background-color: var(--lith-badge-default-hover-bg-dark, #f4f4f5);
      }

      :host([variant='secondary']) {
        background-color: var(--lith-badge-secondary-bg-dark, #27272a);
        color: var(--lith-badge-secondary-color-dark, #fafafa);
      }

      :host([variant='secondary']:hover) {
        background-color: var(--lith-badge-secondary-hover-bg-dark, #3f3f46);
      }

      :host([variant='outline']) {
        color: var(--lith-badge-outline-color-dark, #fafafa);
        border-color: var(--lith-badge-outline-border-dark, #3f3f46);
      }

      :host([variant='outline']:hover) {
        background-color: var(--lith-badge-outline-hover-bg-dark, #27272a);
      }
    }
  `;

  @property({ reflect: true }) variant: 'default' | 'secondary' | 'destructive' | 'outline' =
    'default';
  @property({ reflect: true }) size: 'sm' | 'default' | 'lg' = 'default';
  @property({ type: Boolean, reflect: true }) dot = false;
  @property({ type: Boolean, reflect: true }) interactive = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _handleClick = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.interactive) {
      this.dispatchEvent(
        new CustomEvent('lith-badge-click', {
          bubbles: true,
          composed: true,
          detail: { variant: this.variant, size: this.size },
        })
      );
    }
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (this.interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this._handleClick(event);
    }
  };

  connectedCallback() {
    super.connectedCallback();
    if (this.interactive) {
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
      this.setAttribute('role', 'button');
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('interactive') || changedProperties.has('disabled')) {
      if (this.interactive) {
        this.setAttribute('tabindex', this.disabled ? '-1' : '0');
        this.setAttribute('role', 'button');
      } else {
        this.removeAttribute('tabindex');
        this.removeAttribute('role');
      }
    }
  }

  render() {
    return html` <slot @click=${this._handleClick} @keydown=${this._handleKeyDown}></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-badge': LithBadge;
  }
}
