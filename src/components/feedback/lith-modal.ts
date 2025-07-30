import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('lith-modal')
export class LithModal extends LitElement {
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

    [part='modal'] {
      position: relative;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      pointer-events: auto;
      opacity: 0;
      transform: scale(0.95) translateY(10px);
      transition:
        opacity 200ms ease-in-out,
        transform 200ms ease-in-out;
    }

    [part='modal'][data-open] {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    [part='modal'][data-closing] {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }

    [part='content'] {
      display: block;
    }
  `;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean })
  closeOnBackdrop = true;

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

  @query('[part="modal"]')
  private _modalElement!: HTMLElement;

  private _previousFocus: HTMLElement | null = null;
  private _focusTrap: FocusTrap | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this._cleanupFocusTrap();
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
                part="modal"
                role="dialog"
                aria-modal="true"
                aria-label=${this.ariaLabel || nothing}
                aria-labelledby=${this.ariaLabelledby || nothing}
                aria-describedby=${this.ariaDescribedby || nothing}
                ?data-open=${this.open && !this._isClosing}
                ?data-closing=${this._isClosing}
                @click=${this._handleModalClick}
              >
                <div part="content">
                  <slot></slot>
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
    this._setupFocusTrap();
    document.body.style.overflow = 'hidden';

    this.dispatchEvent(
      new CustomEvent('lith-open', {
        bubbles: true,
        composed: true,
      })
    );

    // 等待动画开始
    requestAnimationFrame(() => {
      if (this._modalElement) {
        const focusTarget = this._modalElement.querySelector<HTMLElement>(
          '[autofocus], [tabindex]:not([tabindex="-1"]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], area[href], iframe, object, embed, [contenteditable]'
        );
        if (focusTarget) {
          focusTarget.focus();
        } else {
          this._modalElement.setAttribute('tabindex', '-1');
          this._modalElement.focus();
        }
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
    this._cleanupFocusTrap();
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
      this.open = false;
    }
  }

  private _handleModalClick(e: MouseEvent) {
    e.stopPropagation();
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.closeOnEsc && this.open) {
      e.preventDefault();
      this.open = false;
    }

    // Tab trap
    if (e.key === 'Tab' && this.open) {
      this._handleTabKey(e);
    }
  };

  private _handleTabKey(e: KeyboardEvent) {
    if (!this._modalElement) return;

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
    if (!this._modalElement) return [];

    const selector =
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], area[href], iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
    return Array.from(this._modalElement.querySelectorAll<HTMLElement>(selector));
  }

  private _setupFocusTrap() {
    // 简单的焦点陷阱实现
    this._focusTrap = {
      active: true,
    };
  }

  private _cleanupFocusTrap() {
    if (this._focusTrap) {
      this._focusTrap.active = false;
      this._focusTrap = null;
    }
  }
}

interface FocusTrap {
  active: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-modal': LithModal;
  }
}
