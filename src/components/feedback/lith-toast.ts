import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { animate } from '@lit-labs/motion';
import type { Toast, ToastType } from '../../core/toast-manager.js';

/**
 * A toast notification component
 *
 * @element lith-toast
 *
 * @fires {CustomEvent} lith-toast-close - Fired when the toast is closed
 * @fires {CustomEvent} lith-toast-action - Fired when the action button is clicked
 *
 * @slot icon - Custom icon content
 * @slot - Main content (overrides title and description)
 * @slot action - Custom action content
 *
 * @csspart container - The container element
 * @csspart icon - The icon wrapper
 * @csspart content - The content wrapper
 * @csspart title - The title element
 * @csspart description - The description element
 * @csspart close - The close button
 * @csspart action - The action button
 *
 * @cssprop [--lith-toast-min-width=300px] - Minimum width
 * @cssprop [--lith-toast-max-width=500px] - Maximum width
 * @cssprop [--lith-toast-padding=16px] - Padding
 * @cssprop [--lith-toast-border-radius=8px] - Border radius
 * @cssprop [--lith-toast-background=#ffffff] - Background color
 * @cssprop [--lith-toast-color=#000000] - Text color
 * @cssprop [--lith-toast-shadow=0 4px 12px rgba(0,0,0,0.15)] - Box shadow
 * @cssprop [--lith-toast-success-color=#10b981] - Success type color
 * @cssprop [--lith-toast-error-color=#ef4444] - Error type color
 * @cssprop [--lith-toast-warning-color=#f59e0b] - Warning type color
 * @cssprop [--lith-toast-info-color=#3b82f6] - Info type color
 */
@customElement('lith-toast')
export class LithToast extends LitElement {
  static override styles = css`
    :host {
      display: block;
      pointer-events: auto;
    }

    .toast-container {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      min-width: var(--lith-toast-min-width, 300px);
      max-width: var(--lith-toast-max-width, 500px);
      padding: var(--lith-toast-padding, 16px);
      background: var(--lith-toast-background, #ffffff);
      color: var(--lith-toast-color, #000000);
      border-radius: var(--lith-toast-border-radius, 8px);
      box-shadow: var(--lith-toast-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
      box-sizing: border-box;
    }

    /* Type-specific styles */
    :host([data-type='success']) .toast-container {
      border-left: 4px solid var(--lith-toast-success-color, #10b981);
    }

    :host([data-type='error']) .toast-container {
      border-left: 4px solid var(--lith-toast-error-color, #ef4444);
    }

    :host([data-type='warning']) .toast-container {
      border-left: 4px solid var(--lith-toast-warning-color, #f59e0b);
    }

    :host([data-type='info']) .toast-container {
      border-left: 4px solid var(--lith-toast-info-color, #3b82f6);
    }

    /* Icon styles */
    .toast-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([data-type='success']) .toast-icon {
      color: var(--lith-toast-success-color, #10b981);
    }

    :host([data-type='error']) .toast-icon {
      color: var(--lith-toast-error-color, #ef4444);
    }

    :host([data-type='warning']) .toast-icon {
      color: var(--lith-toast-warning-color, #f59e0b);
    }

    :host([data-type='info']) .toast-icon {
      color: var(--lith-toast-info-color, #3b82f6);
    }

    /* Content styles */
    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-weight: 600;
      margin: 0 0 4px 0;
      word-wrap: break-word;
    }

    .toast-description {
      margin: 0;
      opacity: 0.9;
      font-size: 0.875em;
      word-wrap: break-word;
    }

    /* Close button */
    .toast-close {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 150ms ease;
      padding: 0;
      color: inherit;
    }

    .toast-close:hover {
      opacity: 1;
    }

    .toast-close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      opacity: 1;
    }

    /* Action button */
    .toast-action {
      margin-top: 12px;
    }

    .toast-action button {
      background: transparent;
      border: 1px solid currentColor;
      color: inherit;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875em;
      transition: all 150ms ease;
    }

    .toast-action button:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .toast-action button:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    /* Animation */
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slide-out {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    :host {
      animation: slide-in 300ms ease-out;
    }

    :host([data-closing]) {
      animation: slide-out 200ms ease-in;
    }
  `;

  /**
   * The toast data object
   */
  @property({ type: Object })
  toast?: Toast;

  /**
   * Toast type (when used standalone)
   */
  @property({ type: String, reflect: true, attribute: 'data-type' })
  type: ToastType = 'default';

  /**
   * Toast title (when used standalone)
   */
  @property({ type: String })
  title = '';

  /**
   * Toast description (when used standalone)
   */
  @property({ type: String })
  description = '';

  /**
   * Whether the toast can be closed
   */
  @property({ type: Boolean, reflect: true })
  closable = true;

  /**
   * Custom icon
   */
  @property({ type: String })
  icon?: string;

  protected override firstUpdated(): void {
    if (this.toast) {
      this.type = this.toast.type;
      this.title = this.toast.title;
      this.description = this.toast.description;
      this.closable = this.toast.closable;
      this.icon = typeof this.toast.icon === 'string' ? this.toast.icon : undefined;
    }
  }

  override render() {
    return html`
      <div
        part="container"
        class="toast-container"
        role="alert"
        aria-live="${this.type === 'error' ? 'assertive' : 'polite'}"
        ${animate()}
      >
        ${this.renderIcon()}
        <div part="content" class="toast-content">
          <slot>
            ${this.title
              ? html` <div part="title" class="toast-title">${this.title}</div> `
              : nothing}
            ${this.description
              ? html` <div part="description" class="toast-description">${this.description}</div> `
              : nothing}
          </slot>
          ${this.renderAction()}
        </div>
        ${this.closable
          ? html`
              <button
                part="close"
                class="toast-close"
                @click="${this.handleClose}"
                aria-label="Close notification"
                title="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 1L13 13M1 13L13 1" />
                </svg>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private renderIcon() {
    const defaultIcons: Record<ToastType, string> = {
      success: '✓',
      error: '✕',
      warning: '!',
      info: 'i',
      default: '',
    };

    const iconContent = this.icon || (this.type !== 'default' ? defaultIcons[this.type] : '');

    if (!iconContent && !this.querySelector('[slot="icon"]')) {
      return nothing;
    }

    return html`
      <div part="icon" class="toast-icon">
        <slot name="icon">${iconContent}</slot>
      </div>
    `;
  }

  private renderAction() {
    const action = this.toast?.action;

    if (!action && !this.querySelector('[slot="action"]')) {
      return nothing;
    }

    return html`
      <div part="action" class="toast-action">
        <slot name="action">
          ${action
            ? html` <button @click="${this.handleAction}">${action.label}</button> `
            : nothing}
        </slot>
      </div>
    `;
  }

  private handleClose(): void {
    this.setAttribute('data-closing', '');

    // Wait for animation to complete
    setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent('lith-toast-close', {
          detail: { id: this.toast?.id },
          bubbles: true,
          composed: true,
        })
      );
    }, 200);
  }

  private handleAction(): void {
    if (this.toast?.action) {
      this.toast.action.onClick();
      this.dispatchEvent(
        new CustomEvent('lith-toast-action', {
          detail: { id: this.toast.id, action: this.toast.action },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('toast') && this.toast) {
      this.type = this.toast.type;
      this.title = this.toast.title;
      this.description = this.toast.description;
      this.closable = this.toast.closable;
      this.icon = typeof this.toast.icon === 'string' ? this.toast.icon : undefined;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-toast': LithToast;
  }
}
