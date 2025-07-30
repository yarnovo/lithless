import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('lith-avatar')
export class LithAvatar extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex-shrink: 0;
      overflow: hidden;
      user-select: none;
      background-color: var(--lith-avatar-background, #f3f4f6);
      color: var(--lith-avatar-color, #374151);
      width: var(--lith-avatar-size, 40px);
      height: var(--lith-avatar-size, 40px);
      border-radius: var(--lith-avatar-radius, 50%);
      font-family: var(--lith-avatar-font-family, inherit);
      font-size: var(--lith-avatar-font-size, calc(var(--lith-avatar-size, 40px) * 0.4));
      font-weight: var(--lith-avatar-font-weight, 500);
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
      display: block;
    }

    .avatar-image.hidden {
      display: none;
    }

    .avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: inherit;
      background-color: inherit;
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
      text-transform: uppercase;
      user-select: none;
    }

    .avatar-fallback.hidden {
      display: none;
    }

    /* Size variants */
    :host([size='sm']) {
      --lith-avatar-size: 32px;
    }

    :host([size='md']) {
      --lith-avatar-size: 40px;
    }

    :host([size='lg']) {
      --lith-avatar-size: 48px;
    }

    :host([size='xl']) {
      --lith-avatar-size: 64px;
    }

    /* Shape variants */
    :host([shape='square']) {
      --lith-avatar-radius: 8px;
    }

    :host([shape='rounded']) {
      --lith-avatar-radius: 12px;
    }

    :host([shape='circle']) {
      --lith-avatar-radius: 50%;
    }
  `;

  @property() src = '';
  @property() alt = '';
  @property() fallback = '';
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @property({ reflect: true }) shape: 'circle' | 'square' | 'rounded' = 'circle';
  @property({ type: Number, attribute: 'fallback-delay' }) fallbackDelay = 0;

  @state() private _imageLoaded = false;
  @state() private _imageError = false;
  @state() private _showFallback = false;

  @query('.avatar-image') private _imageElement?: HTMLImageElement;

  private _fallbackTimer?: number;

  connectedCallback() {
    super.connectedCallback();
    this._resetImageState();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearFallbackTimer();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('src')) {
      this._resetImageState();
    }
  }

  private _resetImageState() {
    this._imageLoaded = false;
    this._imageError = false;
    this._showFallback = !this.src || this.fallbackDelay === 0;
    this._clearFallbackTimer();

    if (this.src && this.fallbackDelay > 0) {
      this._showFallback = false; // 有延迟时，先不显示回退内容
      this._fallbackTimer = window.setTimeout(() => {
        if (!this._imageLoaded) {
          this._showFallback = true;
          this.requestUpdate(); // 触发重新渲染
        }
      }, this.fallbackDelay);
    }
  }

  private _clearFallbackTimer() {
    if (this._fallbackTimer) {
      clearTimeout(this._fallbackTimer);
      this._fallbackTimer = undefined;
    }
  }

  private _handleImageLoad = () => {
    this._imageLoaded = true;
    this._imageError = false;
    this._showFallback = false;
    this._clearFallbackTimer();

    this.dispatchEvent(
      new CustomEvent('lith-avatar-load', {
        bubbles: true,
        composed: true,
        detail: { src: this.src },
      })
    );
  };

  private _handleImageError = () => {
    this._imageLoaded = false;
    this._imageError = true;
    this._showFallback = true;
    this._clearFallbackTimer();

    this.dispatchEvent(
      new CustomEvent('lith-avatar-error', {
        bubbles: true,
        composed: true,
        detail: { src: this.src },
      })
    );
  };

  private _getInitials(name: string): string {
    if (!name) return '';

    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  render() {
    const showImage =
      this.src && !this._imageError && (this._imageLoaded || this.fallbackDelay === 0);
    const showFallback = (!this.src && !this._imageError) || this._imageError || this._showFallback;

    const imageClasses = {
      'avatar-image': true,
      hidden: !showImage,
    };

    const fallbackClasses = {
      'avatar-fallback': true,
      hidden: !showFallback,
    };

    const fallbackContent = this.fallback || this._getInitials(this.alt);

    return html`
      ${this.src
        ? html`
            <img
              class=${classMap(imageClasses)}
              src=${this.src}
              alt=${this.alt}
              @load=${this._handleImageLoad}
              @error=${this._handleImageError}
              draggable="false"
            />
          `
        : ''}

      <div class=${classMap(fallbackClasses)}>
        <slot name="fallback">${fallbackContent}</slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-avatar': LithAvatar;
  }
}
