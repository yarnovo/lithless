import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lith-progress')
export class LithProgress extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .progress-root {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: var(--lith-progress-border-radius, 9999px);
      background-color: var(--lith-progress-track-color, #e2e8f0);
      height: var(--lith-progress-height, 8px);
    }

    .progress-indicator {
      height: 100%;
      width: 100%;
      background-color: var(--lith-progress-indicator-color, #3b82f6);
      transition: transform 0.3s ease-in-out;
      border-radius: inherit;
    }

    :host([data-state='indeterminate']) .progress-indicator {
      animation: indeterminate 2s infinite linear;
      transform-origin: 0% 50%;
    }

    @keyframes indeterminate {
      0% {
        transform: translateX(-100%) scaleX(0.3);
      }
      40% {
        transform: translateX(-100%) scaleX(0.4);
      }
      100% {
        transform: translateX(100%) scaleX(0.5);
      }
    }
  `;

  /**
   * 当前进度值 (0-100)
   */
  @property({ type: Number })
  value?: number;

  /**
   * 最大值，默认为 100
   */
  @property({ type: Number })
  max = 100;

  /**
   * 自定义可访问性标签函数
   */
  @property({ attribute: false })
  getValueLabel?: (value: number, max: number) => string;

  private get normalizedValue(): number {
    if (this.value === undefined || this.value === null) {
      return 0;
    }
    return Math.min(Math.max(this.value, 0), this.max);
  }

  private get percentageValue(): number {
    return (this.normalizedValue / this.max) * 100;
  }

  private get isIndeterminate(): boolean {
    return this.value === undefined || this.value === null;
  }

  private get progressState(): 'complete' | 'indeterminate' | 'loading' {
    if (this.isIndeterminate) {
      return 'indeterminate';
    }
    if (this.normalizedValue === this.max) {
      return 'complete';
    }
    return 'loading';
  }

  private get accessibleLabel(): string {
    if (this.getValueLabel) {
      return this.getValueLabel(this.normalizedValue, this.max);
    }

    if (this.isIndeterminate) {
      return 'Loading...';
    }

    return `${this.percentageValue.toFixed(0)}%`;
  }

  private getIndicatorStyle(): string {
    if (this.isIndeterminate) {
      return '';
    }

    const translateX = 100 - this.percentageValue;
    return `transform: translateX(-${translateX}%)`;
  }

  render() {
    return html`
      <div
        class="progress-root"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="${this.max}"
        aria-valuenow="${this.isIndeterminate ? null : this.normalizedValue}"
        aria-valuetext="${this.accessibleLabel}"
        aria-label="${this.accessibleLabel}"
      >
        <div class="progress-indicator" style="${this.getIndicatorStyle()}"></div>
      </div>
    `;
  }

  protected firstUpdated(): void {
    this.updateAriaAttributes();
  }

  protected updated(): void {
    // 更新 data attributes 用于样式和测试
    this.setAttribute('data-state', this.progressState);
    this.setAttribute('data-value', this.normalizedValue.toString());
    this.setAttribute('data-max', this.max.toString());

    this.updateAriaAttributes();
  }

  private updateAriaAttributes(): void {
    const progressBar = this.shadowRoot?.querySelector('[role="progressbar"]');
    if (progressBar) {
      if (this.isIndeterminate) {
        progressBar.removeAttribute('aria-valuenow');
      } else {
        progressBar.setAttribute('aria-valuenow', this.normalizedValue.toString());
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-progress': LithProgress;
  }
}
