import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type SkeletonVariant = 'default' | 'text' | 'circular' | 'rounded';

@customElement('lith-skeleton')
export class LithSkeleton extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
      overflow: hidden;
    }

    [part='skeleton'] {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }

    :host([variant='default']) {
      width: 100%;
      height: 1rem;
      border-radius: 0.25rem;
    }

    :host([variant='text']) {
      width: 100%;
      height: 0.875rem;
      border-radius: 0.125rem;
    }

    :host([variant='circular']) {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }

    :host([variant='rounded']) {
      width: 100%;
      height: 1rem;
      border-radius: 0.5rem;
    }

    /* 自定义尺寸支持 */
    :host([width]) {
      width: var(--lith-skeleton-width);
    }

    :host([height]) {
      height: var(--lith-skeleton-height);
    }

    /* 动画效果 */
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    /* 禁用动画 */
    :host([no-animation]) [part='skeleton'] {
      animation: none;
      background: #f0f0f0;
    }

    /* 主题适配 */
    @media (prefers-color-scheme: dark) {
      [part='skeleton'] {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
        background-size: 200% 100%;
      }

      :host([no-animation]) [part='skeleton'] {
        background: #374151;
      }
    }

    /* 高对比度模式支持 */
    @media (prefers-contrast: high) {
      [part='skeleton'] {
        background: linear-gradient(90deg, #d1d5db 25%, #9ca3af 50%, #d1d5db 75%);
        background-size: 200% 100%;
      }

      :host([no-animation]) [part='skeleton'] {
        background: #d1d5db;
      }
    }

    /* 减少动画偏好 */
    @media (prefers-reduced-motion: reduce) {
      [part='skeleton'] {
        animation-duration: 3s;
      }
    }

    /* 完全禁用动画的用户偏好 */
    @media (prefers-reduced-motion: reduce) and (prefers-reduced-motion: no-preference) {
      :host([respect-motion-preference]) [part='skeleton'] {
        animation: none;
        background: #f0f0f0;
      }

      @media (prefers-color-scheme: dark) {
        :host([respect-motion-preference]) [part='skeleton'] {
          background: #374151;
        }
      }
    }
  `;

  @property({ type: String, reflect: true })
  variant: SkeletonVariant = 'default';

  @property({ type: String })
  width = '';

  @property({ type: String })
  height = '';

  @property({ type: Boolean, attribute: 'no-animation', reflect: true })
  noAnimation = false;

  @property({ type: Boolean, attribute: 'respect-motion-preference', reflect: true })
  respectMotionPreference = true;

  @property({ attribute: 'aria-label' })
  ariaLabel = 'Loading...';

  override connectedCallback() {
    super.connectedCallback();
    this._updateCustomProperties();
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('width') || changedProperties.has('height')) {
      this._updateCustomProperties();
    }
  }

  override render() {
    return html`
      <div part="skeleton" role="status" aria-label=${this.ariaLabel} aria-live="polite"></div>
    `;
  }

  private _updateCustomProperties() {
    if (this.width) {
      this.style.setProperty('--lith-skeleton-width', this.width);
    }
    if (this.height) {
      this.style.setProperty('--lith-skeleton-height', this.height);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-skeleton': LithSkeleton;
  }
}
