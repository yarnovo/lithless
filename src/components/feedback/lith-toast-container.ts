import { LitElement, html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { toastManager, type Toast, type ToastPosition } from '../../core/toast-manager.js';
import './lith-portal.js';
import './lith-toast.js';

/**
 * A container component that manages and displays toast notifications
 *
 * @element lith-toast-container
 *
 * @fires {CustomEvent} lith-toast-open - Fired when a toast is opened
 * @fires {CustomEvent} lith-toast-close - Fired when a toast is closed
 *
 * @csspart container - The container element
 * @csspart group - The toast group for each position
 *
 * @cssprop [--lith-toast-container-padding=16px] - Padding from viewport edges
 * @cssprop [--lith-toast-container-gap=8px] - Gap between toasts
 * @cssprop [--lith-toast-container-z-index=9999] - Z-index of the container
 */
@customElement('lith-toast-container')
export class LithToastContainer extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }

    .toast-container {
      pointer-events: none;
    }

    .toast-group {
      position: fixed;
      display: flex;
      flex-direction: column;
      gap: var(--lith-toast-container-gap, 8px);
      padding: var(--lith-toast-container-padding, 16px);
      z-index: var(--lith-toast-container-z-index, 9999);
      pointer-events: none;
    }

    /* Position styles */
    .toast-group[data-position='top-left'] {
      top: 0;
      left: 0;
      align-items: flex-start;
    }

    .toast-group[data-position='top-center'] {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }

    .toast-group[data-position='top-right'] {
      top: 0;
      right: 0;
      align-items: flex-end;
    }

    .toast-group[data-position='bottom-left'] {
      bottom: 0;
      left: 0;
      align-items: flex-start;
    }

    .toast-group[data-position='bottom-center'] {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }

    .toast-group[data-position='bottom-right'] {
      bottom: 0;
      right: 0;
      align-items: flex-end;
    }

    /* Reverse order for bottom positions */
    .toast-group[data-position^='bottom'] {
      flex-direction: column-reverse;
    }

    /* Ensure toasts can be interacted with */
    .toast-group ::slotted(*) {
      pointer-events: auto;
    }
  `;

  /**
   * Maximum number of toasts to display at once
   */
  @property({ type: Number, attribute: 'max-count' })
  maxCount = 5;

  /**
   * Default position for toasts if not specified
   */
  @property({ type: String, attribute: 'default-position' })
  defaultPosition: ToastPosition = 'top-right';

  /**
   * Whether to use portal for rendering
   */
  @property({ type: Boolean, attribute: 'use-portal' })
  usePortal = true;

  @state()
  private toasts: Toast[] = [];

  private unsubscribe?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    // Subscribe to toast manager
    this.unsubscribe = toastManager.subscribe((toasts) => {
      // Force update for array changes
      const oldToasts = this.toasts;
      this.toasts = [...toasts];
      this.requestUpdate('toasts', oldToasts);
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  protected override firstUpdated(): void {
    // Set default position for toast manager if needed
    if (this.defaultPosition) {
      // This will be used by child toast components
      this.setAttribute('data-default-position', this.defaultPosition);
    }
  }

  override render() {
    const positions: ToastPosition[] = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ];

    const content = html`
      <div part="container" class="toast-container">
        ${positions.map((position) => {
          const positionToasts = this.getToastsForPosition(position);
          if (positionToasts.length === 0) return nothing;

          return html`
            <div
              part="group"
              class="toast-group"
              data-position="${position}"
              role="region"
              aria-label="${this.getPositionLabel(position)} notifications"
              aria-live="polite"
              aria-relevant="additions removals"
            >
              <slot name="${position}">
                ${positionToasts.map(
                  (toast) => html`
                    <lith-toast
                      .toast="${toast}"
                      @lith-toast-close="${() => this.handleToastClose(toast.id)}"
                    ></lith-toast>
                  `
                )}
              </slot>
            </div>
          `;
        })}
      </div>
    `;

    return this.usePortal ? html`<lith-portal>${content}</lith-portal>` : content;
  }

  private getToastsForPosition(position: ToastPosition): Toast[] {
    const positionToasts = this.toasts.filter(
      (toast) => (toast.position || this.defaultPosition) === position
    );

    // Limit number of toasts per position
    return this.maxCount > 0 ? positionToasts.slice(-this.maxCount) : positionToasts;
  }

  private getPositionLabel(position: ToastPosition): string {
    const labels: Record<ToastPosition, string> = {
      'top-left': 'Top left',
      'top-center': 'Top center',
      'top-right': 'Top right',
      'bottom-left': 'Bottom left',
      'bottom-center': 'Bottom center',
      'bottom-right': 'Bottom right',
    };
    return labels[position];
  }

  private handleToastClose(id: string): void {
    toastManager.remove(id);
    this.dispatchEvent(
      new CustomEvent('lith-toast-close', {
        detail: { id },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('toasts') && this.toasts.length > 0) {
      // Dispatch open event for new toasts
      const oldToasts = (changedProperties.get('toasts') as Toast[]) || [];
      const newToasts = this.toasts.filter(
        (toast) => !oldToasts.some((old) => old.id === toast.id)
      );

      newToasts.forEach((toast) => {
        this.dispatchEvent(
          new CustomEvent('lith-toast-open', {
            detail: { toast },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-toast-container': LithToastContainer;
  }
}
