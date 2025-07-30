import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Alert variant type
 */
export type AlertVariant = 'default' | 'destructive';

/**
 * A callout alert component for user attention
 *
 * @element lith-alert
 *
 * @fires {CustomEvent} lith-alert-close - Fired when the alert is closed (if closable)
 *
 * @slot icon - Custom icon content
 * @slot title - Alert title content
 * @slot - Main alert content/description
 *
 * @csspart container - The container element
 * @csspart icon - The icon wrapper
 * @csspart content - The content wrapper
 * @csspart title - The title element
 * @csspart description - The description/content area
 * @csspart close - The close button (if closable)
 *
 * @cssprop [--lith-alert-padding=16px] - Padding
 * @cssprop [--lith-alert-border-radius=8px] - Border radius
 * @cssprop [--lith-alert-border-width=1px] - Border width
 * @cssprop [--lith-alert-gap=12px] - Gap between icon and content
 * @cssprop [--lith-alert-title-gap=8px] - Gap between title and description
 * @cssprop [--lith-alert-background=rgba(0, 0, 0, 0.02)] - Background color
 * @cssprop [--lith-alert-color=inherit] - Text color
 * @cssprop [--lith-alert-border-color=rgba(0, 0, 0, 0.1)] - Border color
 * @cssprop [--lith-alert-destructive-background=rgba(239, 68, 68, 0.1)] - Destructive background
 * @cssprop [--lith-alert-destructive-color=#dc2626] - Destructive text color
 * @cssprop [--lith-alert-destructive-border-color=rgba(239, 68, 68, 0.2)] - Destructive border color
 */
@customElement('lith-alert')
export class LithAlert extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .alert-container {
      position: relative;
      display: flex;
      gap: var(--lith-alert-gap, 12px);
      padding: var(--lith-alert-padding, 16px);
      border-radius: var(--lith-alert-border-radius, 8px);
      border: var(--lith-alert-border-width, 1px) solid
        var(--lith-alert-border-color, rgba(0, 0, 0, 0.1));
      background: var(--lith-alert-background, rgba(0, 0, 0, 0.02));
      color: var(--lith-alert-color, inherit);
      line-height: 1.5;
    }

    /* Destructive variant */
    :host([variant='destructive']) .alert-container {
      background: var(--lith-alert-destructive-background, rgba(239, 68, 68, 0.1));
      color: var(--lith-alert-destructive-color, #dc2626);
      border-color: var(--lith-alert-destructive-border-color, rgba(239, 68, 68, 0.2));
    }

    /* Icon styles */
    .alert-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      margin-top: 2px;
    }

    .alert-icon svg {
      width: 20px;
      height: 20px;
    }

    /* Content styles */
    .alert-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--lith-alert-title-gap, 8px);
    }

    .alert-title {
      font-weight: 600;
      margin: 0;
      font-size: 1em;
      line-height: 1.4;
    }

    .alert-description {
      opacity: 0.9;
      margin: 0;
    }

    /* Close button */
    .alert-close {
      position: absolute;
      top: 12px;
      right: 12px;
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
      border-radius: 4px;
    }

    .alert-close:hover {
      opacity: 1;
    }

    .alert-close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      opacity: 1;
    }

    .alert-close svg {
      width: 16px;
      height: 16px;
    }

    /* Adjustments when closable */
    :host([closable]) .alert-container {
      padding-right: 48px;
    }

    /* Hidden slots */
    .hidden {
      display: none;
    }
  `;

  /**
   * Alert variant
   */
  @property({ type: String, reflect: true })
  variant: AlertVariant = 'default';

  /**
   * Alert title
   */
  @property({ type: String })
  title = '';

  /**
   * Whether the alert can be closed
   */
  @property({ type: Boolean, reflect: true })
  closable = false;

  override render() {
    const hasIcon = this.hasSlotContent('icon');
    const hasTitle = this.title || this.hasSlotContent('title');
    const hasDescription = this.hasSlotContent('');

    return html`
      <div part="container" class="alert-container" role="alert" aria-live="polite">
        ${hasIcon ? this.renderIcon() : nothing}
        <div part="content" class="alert-content">
          ${hasTitle ? this.renderTitle() : nothing}
          ${hasDescription ? this.renderDescription() : nothing}
        </div>
        ${this.closable ? this.renderCloseButton() : nothing}
      </div>
    `;
  }

  private renderIcon() {
    return html`
      <div part="icon" class="alert-icon">
        <slot name="icon">${this.getDefaultIcon()}</slot>
      </div>
    `;
  }

  private renderTitle() {
    return html`
      <div part="title" class="alert-title">
        <slot name="title">${this.title}</slot>
      </div>
    `;
  }

  private renderDescription() {
    return html`
      <div part="description" class="alert-description">
        <slot></slot>
      </div>
    `;
  }

  private renderCloseButton() {
    return html`
      <button
        part="close"
        class="alert-close"
        @click="${this.handleClose}"
        aria-label="Close alert"
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
    `;
  }

  private getDefaultIcon() {
    if (this.variant === 'destructive') {
      return html`
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    }

    // Default variant - Terminal icon (as per shadcn/ui example)
    return html`
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="4,17 10,11 4,5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
    `;
  }

  private hasSlotContent(slotName: string): boolean {
    const slotSelector = slotName ? `[slot="${slotName}"]` : ':not([slot])';
    const slotContent = this.querySelector(slotSelector);
    return slotContent !== null && slotContent.textContent?.trim() !== '';
  }

  private handleClose(): void {
    this.dispatchEvent(
      new CustomEvent('lith-alert-close', {
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-alert': LithAlert;
  }
}
