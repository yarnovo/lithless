import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * A headless breadcrumb item component that represents a single item in a breadcrumb trail.
 * Must be used within a lith-breadcrumb component.
 *
 * @element lith-breadcrumb-item
 *
 * @fires {CustomEvent} lith-breadcrumb-item-click - Fired when the item is clicked
 * @fires {FocusEvent} lith-focus - Fired when the item gains focus
 * @fires {FocusEvent} lith-blur - Fired when the item loses focus
 *
 * @slot - The item content
 * @slot icon - Optional icon to display
 *
 * @csspart base - The component's root element
 * @csspart link - The link element (when href is provided)
 * @csspart button - The button element (when href is not provided)
 * @csspart content - The content container
 * @csspart icon - The icon container
 *
 * @cssprop [--lith-breadcrumb-item-padding=4px 8px] - Padding for the item
 * @cssprop [--lith-breadcrumb-item-gap=4px] - Gap between icon and content
 * @cssprop [--lith-breadcrumb-item-cursor=pointer] - Cursor style for interactive items
 * @cssprop [--lith-breadcrumb-item-transition-duration=200ms] - Transition duration
 */
@customElement('lith-breadcrumb-item')
export class LithBreadcrumbItem extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      -webkit-tap-highlight-color: transparent;
    }

    :host([current]) {
      pointer-events: none;
      cursor: default;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: 0.5;
      cursor: not-allowed;
    }

    .base {
      display: flex;
      align-items: center;
      gap: var(--lith-breadcrumb-item-gap, 4px);
      padding: var(--lith-breadcrumb-item-padding, 4px 8px);
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      text-decoration: none;
      cursor: var(--lith-breadcrumb-item-cursor, pointer);
      transition: all var(--lith-breadcrumb-item-transition-duration, 200ms) ease;
      border-radius: 4px;
      user-select: none;
    }

    :host([current]) .base {
      cursor: default;
      font-weight: 600;
    }

    :host(:not([current])) .base:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    :host(:not([current])) .base:active {
      background: rgba(0, 0, 0, 0.1);
    }

    .base:focus {
      outline: none;
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
      min-width: 0;
    }

    /* Hide icon container when empty */
    .icon:not(:has(*)) {
      display: none;
    }
  `;

  @property({ type: String })
  href?: string;

  @property({ type: String })
  target?: string;

  @property({ type: String })
  rel?: string;

  @property({ type: Boolean, reflect: true })
  current: boolean = false;

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: String })
  download?: string;

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

    const commonContent = html`
      <span part="icon" class="icon">
        <slot name="icon"></slot>
      </span>
      <span part="content" class="content">
        <slot></slot>
      </span>
    `;

    // Render as link if href is provided
    if (this.href && !this.current && !this.disabled) {
      return html`
        <a
          part="link"
          class=${classMap(classes)}
          href=${this.href}
          target=${this.target || ''}
          rel=${this.rel || ''}
          download=${this.download || ''}
          tabindex="0"
        >
          ${commonContent}
        </a>
      `;
    }

    // Render as button for interactive items without href
    if (!this.current && !this.disabled) {
      return html`
        <button part="button" class=${classMap(classes)} type="button" tabindex="0">
          ${commonContent}
        </button>
      `;
    }

    // Render as span for current/disabled items
    return html` <span part="base" class=${classMap(classes)}> ${commonContent} </span> `;
  }

  private _handleClick = (event: MouseEvent): void => {
    if (this.current || this.disabled) {
      event.preventDefault();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('lith-breadcrumb-item-click', {
        detail: {
          href: this.href,
          target: this.target,
          item: this,
        },
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

  override firstUpdated(): void {
    // Set initial ARIA attributes
    if (this.current) {
      this.setAttribute('aria-current', 'page');
    } else {
      this.removeAttribute('aria-current');
    }

    // Set ID if not present
    if (!this.id) {
      this.id = `breadcrumb-item-${Math.random().toString(36).substring(2, 9)}`;
    }
  }

  override updated(): void {
    // Update ARIA attributes when current changes
    if (this.current) {
      this.setAttribute('aria-current', 'page');
    } else {
      this.removeAttribute('aria-current');
    }
  }

  /**
   * Sets the item as current
   */
  setCurrent(): void {
    this.current = true;
  }

  /**
   * Removes current status from the item
   */
  removeCurrent(): void {
    this.current = false;
  }

  /**
   * Programmatically click the item
   */
  click(): void {
    if (!this.current && !this.disabled) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      this.dispatchEvent(event);
    }
  }
}
