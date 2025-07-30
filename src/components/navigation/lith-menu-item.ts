import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * A headless menu item component that provides menu item functionality
 * without any predefined styles.
 *
 * @element lith-menu-item
 *
 * @fires {CustomEvent} lith-menu-item-click - Fired when the menu item is clicked
 *
 * @slot - The menu item content
 * @slot icon - The menu item icon
 * @slot suffix - Content to display at the end of the menu item
 *
 * @csspart base - The component's root element
 * @csspart content - The main content container
 * @csspart icon - The icon container
 * @csspart label - The label text container
 * @csspart suffix - The suffix content container
 *
 * @cssprop [--lith-menu-item-padding=8px 12px] - Padding for the menu item
 * @cssprop [--lith-menu-item-gap=8px] - Gap between icon, label, and suffix
 * @cssprop [--lith-menu-item-border-radius=4px] - Border radius for the menu item
 * @cssprop [--lith-menu-item-transition-duration=150ms] - Transition duration
 */
@customElement('lith-menu-item')
export class LithMenuItem extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    :host([hidden]) {
      display: none;
    }

    .base {
      display: flex;
      align-items: center;
      gap: var(--lith-menu-item-gap, 8px);
      padding: var(--lith-menu-item-padding, 8px 12px);
      width: 100%;
      cursor: pointer;
      user-select: none;
      text-decoration: none;
      color: inherit;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      border-radius: var(--lith-menu-item-border-radius, 4px);
      transition: all var(--lith-menu-item-transition-duration, 150ms) ease;
      position: relative;
      outline: none;
    }

    .base:focus {
      outline: 2px solid currentColor;
      outline-offset: -2px;
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
      gap: var(--lith-menu-item-gap, 8px);
      min-width: 0;
    }

    .label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .suffix {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Hide empty slots */
    .icon:not([has-content]),
    .suffix:not([has-content]) {
      display: none;
    }
  `;

  @property({ type: String })
  value: string = '';

  @property({ type: String })
  href: string = '';

  @property({ type: String })
  target: string = '';

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: String })
  type: 'button' | 'link' = 'button';

  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA attributes
    this.setAttribute('role', 'menuitem');
    this.setAttribute('tabindex', '-1');
  }

  override render() {
    const classes = {
      base: true,
    };

    // If href is provided, render as a link
    if (this.href && !this.disabled) {
      return html`
        <a
          part="base"
          class=${classMap(classes)}
          href=${this.href}
          target=${this.target || ''}
          ?disabled=${this.disabled}
          @click=${this._handleClick}
          @keydown=${this._handleKeyDown}
        >
          <span part="icon" class="icon">
            <slot name="icon"></slot>
          </span>
          <div part="content" class="content">
            <span part="label" class="label">
              <slot></slot>
            </span>
          </div>
          <span part="suffix" class="suffix">
            <slot name="suffix"></slot>
          </span>
        </a>
      `;
    }

    // Otherwise render as a button
    return html`
      <button
        type="button"
        part="base"
        class=${classMap(classes)}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        <span part="icon" class="icon">
          <slot name="icon"></slot>
        </span>
        <div part="content" class="content">
          <span part="label" class="label">
            <slot></slot>
          </span>
        </div>
        <span part="suffix" class="suffix">
          <slot name="suffix"></slot>
        </span>
      </button>
    `;
  }

  private _handleClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent('lith-menu-item-click', {
        detail: {
          value: this.value,
          href: this.href,
          target: this.target,
          item: this,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    // Handle Enter and Space as click
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleClick(event as unknown as MouseEvent);
    }
  }

  /**
   * Focuses the menu item
   */
  override focus(): void {
    const button = this.shadowRoot?.querySelector('button, a') as HTMLElement;
    button?.focus();
    super.focus();
  }

  /**
   * Removes focus from the menu item
   */
  override blur(): void {
    const button = this.shadowRoot?.querySelector('button, a') as HTMLElement;
    button?.blur();
    super.blur();
  }

  /**
   * Clicks the menu item programmatically
   */
  click(): void {
    if (!this.disabled) {
      const button = this.shadowRoot?.querySelector('button, a') as HTMLElement;
      button?.click();
    }
  }
}
