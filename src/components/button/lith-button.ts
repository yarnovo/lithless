import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lith-button')
export class LithButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    button:hover {
      background: #0056b3;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .secondary {
      background: #6c757d;
    }

    .secondary:hover {
      background: #5a6268;
    }
  `;

  @property({ type: String })
  variant: 'primary' | 'secondary' = 'primary';

  @property({ type: Boolean })
  disabled = false;

  render() {
    return html`
      <button class=${this.variant} ?disabled=${this.disabled} @click=${this._handleClick}>
        <slot></slot>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('lith-click', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }
}
