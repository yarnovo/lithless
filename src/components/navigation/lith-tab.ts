import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * A headless tab component that represents a single tab in a tab list.
 * Must be used within a lith-tabs component.
 *
 * @element lith-tab
 *
 * @fires {CustomEvent} lith-tab-click - Fired when the tab is clicked
 * @fires {FocusEvent} lith-focus - Fired when the tab gains focus
 * @fires {FocusEvent} lith-blur - Fired when the tab loses focus
 *
 * @slot - The tab content
 * @slot icon - Optional icon to display in the tab
 *
 * @csspart base - The component's root element
 * @csspart content - The tab content container
 * @csspart icon - The icon container
 *
 * @cssprop [--lith-tab-padding=8px 16px] - Padding for the tab
 * @cssprop [--lith-tab-gap=8px] - Gap between icon and content
 * @cssprop [--lith-tab-cursor=pointer] - Cursor style
 * @cssprop [--lith-tab-transition-duration=200ms] - Transition duration
 */
@customElement('lith-tab')
export class LithTab extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--lith-tab-padding, 8px 16px);
      cursor: var(--lith-tab-cursor, pointer);
      user-select: none;
      transition: all var(--lith-tab-transition-duration, 200ms) ease;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    :host(:focus) {
      outline: none;
    }

    .base {
      display: flex;
      align-items: center;
      gap: var(--lith-tab-gap, 8px);
      width: 100%;
      height: 100%;
    }

    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content {
      flex: 1;
      display: flex;
      align-items: center;
    }

    /* Hide icon container when empty */
    .icon:not(:has(*)) {
      display: none;
    }

    .close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 2px;
      margin-left: 4px;
      border-radius: 2px;
      font-size: 14px;
      line-height: 1;
      color: inherit;
    }

    .close-button:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .close-button:focus {
      outline: 1px solid currentColor;
      outline-offset: 1px;
    }
  `;

  @property({ type: String })
  panel?: string;

  @property({ type: Boolean, reflect: true })
  active: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean })
  closable: boolean = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('focus', this._handleFocus);
    this.addEventListener('blur', this._handleBlur);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('focus', this._handleFocus);
    this.removeEventListener('blur', this._handleBlur);
  }

  override render() {
    const classes = {
      base: true,
    };

    return html`
      <div part="base" class=${classMap(classes)}>
        <span part="icon" class="icon">
          <slot name="icon"></slot>
        </span>
        <span part="content" class="content">
          <slot></slot>
        </span>
        ${this.closable
          ? html`
              <button
                part="close-button"
                class="close-button"
                @click=${this._handleClose}
                aria-label="Close tab"
                tabindex="-1"
              >
                <slot name="close-icon">×</slot>
              </button>
            `
          : ''}
      </div>
    `;
  }

  private _handleClick = (): void => {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('lith-tab-click', {
        bubbles: true,
        composed: true,
      })
    );
  };

  private _handleClose = (event: MouseEvent): void => {
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent('lith-tab-close', {
        detail: { panel: this.panel },
        bubbles: true,
        composed: true,
      })
    );
  };

  private _handleFocus = (): void => {
    this.dispatchEvent(
      new FocusEvent('lith-focus', {
        bubbles: true,
        composed: true,
      })
    );
  };

  private _handleBlur = (): void => {
    this.dispatchEvent(
      new FocusEvent('lith-blur', {
        bubbles: true,
        composed: true,
      })
    );
  };

  /**
   * Sets the tab as active
   */
  activate(): void {
    this.active = true;
    this.setAttribute('aria-selected', 'true');
    this.setAttribute('tabindex', '0');
  }

  /**
   * Sets the tab as inactive
   */
  deactivate(): void {
    this.active = false;
    this.setAttribute('aria-selected', 'false');
    this.setAttribute('tabindex', '-1');
  }

  override firstUpdated(): void {
    // Set initial ARIA attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tab');
    }

    // Ensure tab is focusable
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = this.active ? 0 : -1;
    }

    // Set ID if not present
    if (!this.id) {
      this.id = `tab-${Math.random().toString(36).substring(2, 9)}`;
    }
  }
}
