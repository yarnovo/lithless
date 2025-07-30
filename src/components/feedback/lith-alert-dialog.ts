import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('lith-alert-dialog')
export class LithAlertDialog extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }

    [part='backdrop'] {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      transition: opacity 200ms ease-in-out;
    }

    [part='backdrop'][data-open] {
      opacity: 1;
    }

    [part='backdrop'][data-closing] {
      opacity: 0;
    }

    [part='container'] {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      pointer-events: none;
    }

    [part='dialog'] {
      position: relative;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 32rem;
      width: 100%;
      max-height: 90vh;
      overflow: auto;
      pointer-events: auto;
      opacity: 0;
      transform: scale(0.95) translateY(10px);
      transition:
        opacity 200ms ease-in-out,
        transform 200ms ease-in-out;
    }

    [part='dialog'][data-open] {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    [part='dialog'][data-closing] {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }

    [part='header'] {
      padding: 1.5rem 1.5rem 1rem 1.5rem;
    }

    [part='title'] {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #111827;
    }

    [part='description'] {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

    [part='content'] {
      padding: 0 1.5rem;
    }

    [part='footer'] {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
      display: flex;
      flex-direction: column-reverse;
      gap: 0.5rem;
    }

    @media (min-width: 640px) {
      [part='footer'] {
        flex-direction: row;
        justify-content: flex-end;
      }
    }

    [part='cancel-button'],
    [part='action-button'] {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid;
      transition: all 150ms ease-in-out;
      outline: none;
      flex: 1;
    }

    @media (min-width: 640px) {
      [part='cancel-button'],
      [part='action-button'] {
        flex: none;
      }
    }

    [part='cancel-button'] {
      background: white;
      color: #374151;
      border-color: #d1d5db;
    }

    [part='cancel-button']:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    [part='cancel-button']:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    [part='action-button'] {
      background: #dc2626;
      color: white;
      border-color: #dc2626;
    }

    [part='action-button']:hover {
      background: #b91c1c;
      border-color: #b91c1c;
    }

    [part='action-button']:focus-visible {
      outline: 2px solid #dc2626;
      outline-offset: 2px;
    }

    [part='action-button'][data-variant='default'] {
      background: #3b82f6;
      border-color: #3b82f6;
    }

    [part='action-button'][data-variant='default']:hover {
      background: #2563eb;
      border-color: #2563eb;
    }

    [part='action-button'][data-variant='default']:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  title = '';

  @property({ type: String })
  description = '';

  @property({ type: String })
  cancelText = 'Cancel';

  @property({ type: String })
  actionText = 'Continue';

  @property({ type: String })
  actionVariant: 'destructive' | 'default' = 'destructive';

  @property({ type: Boolean })
  closeOnBackdrop = false;

  @property({ type: Boolean })
  closeOnEsc = true;

  @property({ attribute: 'aria-label' })
  ariaLabel = '';

  @property({ attribute: 'aria-labelledby' })
  ariaLabelledby = '';

  @property({ attribute: 'aria-describedby' })
  ariaDescribedby = '';

  @state()
  private _isClosing = false;

  @query('[part="dialog"]')
  private _dialogElement!: HTMLElement;

  @query('[part="action-button"]')
  private _actionButton!: HTMLButtonElement;

  private _previousFocus: HTMLElement | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('open')) {
      if (this.open) {
        this._handleOpen();
      } else {
        this._handleClose();
      }
    }
  }

  override render() {
    const titleId = this.ariaLabelledby || 'alert-dialog-title';
    const descriptionId = this.ariaDescribedby || 'alert-dialog-description';

    return html`
      ${this.open || this._isClosing
        ? html`
            <div
              part="backdrop"
              ?data-open=${this.open && !this._isClosing}
              ?data-closing=${this._isClosing}
              @click=${this._handleBackdropClick}
            ></div>
            <div part="container">
              <div
                part="dialog"
                role="alertdialog"
                aria-modal="true"
                aria-label=${this.ariaLabel || nothing}
                aria-labelledby=${this.ariaLabelledby || titleId}
                aria-describedby=${this.ariaDescribedby || descriptionId}
                ?data-open=${this.open && !this._isClosing}
                ?data-closing=${this._isClosing}
                @click=${this._handleDialogClick}
              >
                <div part="header">
                  ${this.title
                    ? html`<h2 part="title" id=${titleId}>${this.title}</h2>`
                    : html`<slot name="title"></slot>`}
                  ${this.description
                    ? html`<p part="description" id=${descriptionId}>${this.description}</p>`
                    : html`<slot name="description"></slot>`}
                </div>

                <div part="content">
                  <slot></slot>
                </div>

                <div part="footer">
                  <button part="cancel-button" type="button" @click=${this._handleCancel}>
                    ${this.cancelText}
                  </button>
                  <button
                    part="action-button"
                    type="button"
                    data-variant=${this.actionVariant}
                    @click=${this._handleAction}
                  >
                    ${this.actionText}
                  </button>
                </div>
              </div>
            </div>
          `
        : ''}
    `;
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  private _handleOpen() {
    this._previousFocus = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    this.dispatchEvent(
      new CustomEvent('lith-open', {
        bubbles: true,
        composed: true,
      })
    );

    // 等待渲染完成后聚焦到 action 按钮
    requestAnimationFrame(() => {
      if (this._actionButton) {
        this._actionButton.focus();
      }
    });
  }

  private async _handleClose() {
    if (!this.open && !this._isClosing) return;

    this._isClosing = true;
    this.requestUpdate();

    // 等待关闭动画
    await new Promise((resolve) => setTimeout(resolve, 200));

    this._isClosing = false;
    document.body.style.overflow = '';

    if (this._previousFocus && this._previousFocus.focus) {
      this._previousFocus.focus();
    }

    this.dispatchEvent(
      new CustomEvent('lith-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleBackdropClick(e: MouseEvent) {
    if (this.closeOnBackdrop && e.target === e.currentTarget) {
      this._handleCancel();
    }
  }

  private _handleDialogClick(e: MouseEvent) {
    e.stopPropagation();
  }

  private _handleCancel() {
    const cancelEvent = new CustomEvent('lith-cancel', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    this.dispatchEvent(cancelEvent);

    if (!cancelEvent.defaultPrevented) {
      this.open = false;
    }
  }

  private _handleAction() {
    const actionEvent = new CustomEvent('lith-action', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    this.dispatchEvent(actionEvent);

    if (!actionEvent.defaultPrevented) {
      this.open = false;
    }
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.closeOnEsc && this.open) {
      e.preventDefault();
      this._handleCancel();
    }

    // Tab trap
    if (e.key === 'Tab' && this.open) {
      this._handleTabKey(e);
    }
  };

  private _handleTabKey(e: KeyboardEvent) {
    if (!this._dialogElement) return;

    const focusableElements = this._getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  private _getFocusableElements(): HTMLElement[] {
    if (!this._dialogElement) return [];

    const selector =
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], area[href], iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
    return Array.from(this._dialogElement.querySelectorAll<HTMLElement>(selector));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-alert-dialog': LithAlertDialog;
  }
}
