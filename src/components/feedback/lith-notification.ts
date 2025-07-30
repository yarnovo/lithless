import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { animate } from '@lit-labs/motion';
import type { ToastType } from '../../core/toast-manager.js';

/**
 * A notification component for more persistent and detailed messages
 *
 * @element lith-notification
 *
 * @fires {CustomEvent} lith-notification-close - Fired when the notification is closed
 * @fires {CustomEvent} lith-notification-action - Fired when an action button is clicked
 *
 * @slot icon - Custom icon content
 * @slot - Main content
 * @slot actions - Action buttons area
 *
 * @csspart container - The container element
 * @csspart icon - The icon wrapper
 * @csspart content - The content wrapper
 * @csspart header - The header area (title and close button)
 * @csspart title - The title element
 * @csspart body - The body content
 * @csspart close - The close button
 * @csspart actions - The actions container
 *
 * @cssprop [--lith-notification-width=380px] - Width
 * @cssprop [--lith-notification-padding=20px] - Padding
 * @cssprop [--lith-notification-border-radius=12px] - Border radius
 * @cssprop [--lith-notification-background=#ffffff] - Background color
 * @cssprop [--lith-notification-color=#000000] - Text color
 * @cssprop [--lith-notification-shadow=0 10px 40px rgba(0,0,0,0.2)] - Box shadow
 * @cssprop [--lith-notification-success-color=#10b981] - Success type color
 * @cssprop [--lith-notification-error-color=#ef4444] - Error type color
 * @cssprop [--lith-notification-warning-color=#f59e0b] - Warning type color
 * @cssprop [--lith-notification-info-color=#3b82f6] - Info type color
 */
@customElement('lith-notification')
export class LithNotification extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .notification-container {
      position: relative;
      width: var(--lith-notification-width, 380px);
      padding: var(--lith-notification-padding, 20px);
      background: var(--lith-notification-background, #ffffff);
      color: var(--lith-notification-color, #000000);
      border-radius: var(--lith-notification-border-radius, 12px);
      box-shadow: var(--lith-notification-shadow, 0 10px 40px rgba(0, 0, 0, 0.2));
      box-sizing: border-box;
      overflow: hidden;
    }

    /* Type indicator bar */
    .notification-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--type-color, transparent);
    }

    :host([type='success']) .notification-container::before {
      background: var(--lith-notification-success-color, #10b981);
    }

    :host([type='error']) .notification-container::before {
      background: var(--lith-notification-error-color, #ef4444);
    }

    :host([type='warning']) .notification-container::before {
      background: var(--lith-notification-warning-color, #f59e0b);
    }

    :host([type='info']) .notification-container::before {
      background: var(--lith-notification-info-color, #3b82f6);
    }

    /* Layout */
    .notification-layout {
      display: flex;
      gap: 16px;
    }

    /* Icon styles */
    .notification-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }

    :host([type='success']) .notification-icon {
      color: var(--lith-notification-success-color, #10b981);
    }

    :host([type='error']) .notification-icon {
      color: var(--lith-notification-error-color, #ef4444);
    }

    :host([type='warning']) .notification-icon {
      color: var(--lith-notification-warning-color, #f59e0b);
    }

    :host([type='info']) .notification-icon {
      color: var(--lith-notification-info-color, #3b82f6);
    }

    /* Content styles */
    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 8px;
    }

    .notification-title {
      flex: 1;
      font-size: 1.125em;
      font-weight: 600;
      margin: 0;
      word-wrap: break-word;
    }

    .notification-body {
      color: inherit;
      opacity: 0.9;
      line-height: 1.5;
    }

    /* Close button */
    .notification-close {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      cursor: pointer;
      opacity: 0.6;
      transition: all 150ms ease;
      padding: 0;
      margin: -4px -4px 0 0;
      color: inherit;
      border-radius: 4px;
    }

    .notification-close:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.05);
    }

    .notification-close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      opacity: 1;
    }

    /* Actions */
    .notification-actions {
      margin-top: 16px;
      display: flex;
      gap: 8px;
    }

    ::slotted(button) {
      flex-shrink: 0;
    }

    /* Animation */
    @keyframes slide-down {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes slide-up {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100%);
        opacity: 0;
      }
    }

    :host([animated]) .notification-container {
      animation: slide-down 300ms ease-out;
    }

    :host([data-closing]) .notification-container {
      animation: slide-up 200ms ease-in;
    }
  `;

  /**
   * Notification type
   */
  @property({ type: String, reflect: true })
  type: ToastType = 'default';

  /**
   * Notification title
   */
  @property({ type: String })
  title = '';

  /**
   * Whether the notification can be closed
   */
  @property({ type: Boolean, reflect: true })
  closable = true;

  /**
   * Custom icon
   */
  @property({ type: String })
  icon?: string;

  /**
   * Whether to animate the notification
   */
  @property({ type: Boolean, reflect: true, attribute: 'animated' })
  animated = true;

  override render() {
    return html`
      <div
        part="container"
        class="notification-container"
        role="alert"
        aria-live="${this.type === 'error' ? 'assertive' : 'polite'}"
        ${animate()}
      >
        <div class="notification-layout">
          ${this.renderIcon()}
          <div part="content" class="notification-content">
            <div part="header" class="notification-header">
              ${this.title
                ? html` <h3 part="title" class="notification-title">${this.title}</h3> `
                : nothing}
              ${this.closable
                ? html`
                    <button
                      part="close"
                      class="notification-close"
                      @click="${this.handleClose}"
                      aria-label="Close notification"
                      title="Close"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M2 2L14 14M2 14L14 2" />
                      </svg>
                    </button>
                  `
                : nothing}
            </div>
            <div part="body" class="notification-body">
              <slot></slot>
            </div>
            ${this.renderActions()}
          </div>
        </div>
      </div>
    `;
  }

  private renderIcon() {
    const defaultIcons: Record<ToastType, string> = {
      success: html`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        />
      </svg>` as unknown as string,
      error: html`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
        />
      </svg>` as unknown as string,
      warning: html`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>` as unknown as string,
      info: html`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
        />
      </svg>` as unknown as string,
      default: '',
    };

    const iconContent = this.icon || (this.type !== 'default' ? defaultIcons[this.type] : '');

    if (!iconContent && !this.querySelector('[slot="icon"]')) {
      return nothing;
    }

    return html`
      <div part="icon" class="notification-icon">
        <slot name="icon">${iconContent}</slot>
      </div>
    `;
  }

  private renderActions() {
    if (!this.querySelector('[slot="actions"]')) {
      return nothing;
    }

    return html`
      <div part="actions" class="notification-actions">
        <slot name="actions"></slot>
      </div>
    `;
  }

  private handleClose(): void {
    this.setAttribute('data-closing', '');

    // Wait for animation to complete
    setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent('lith-notification-close', {
          bubbles: true,
          composed: true,
        })
      );
    }, 200);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-notification': LithNotification;
  }
}
