import { LitElement, html, css, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * Tooltip 位置类型
 */
export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Tooltip 管理器 - 处理全局延迟
 */
class TooltipManager {
  private static instance: TooltipManager;
  private activeTooltip: LithTooltip | null = null;
  private showTimer: number | null = null;
  private hideTimer: number | null = null;
  private hasShownTooltip = false;

  static getInstance(): TooltipManager {
    if (!TooltipManager.instance) {
      TooltipManager.instance = new TooltipManager();
    }
    return TooltipManager.instance;
  }

  requestShow(tooltip: LithTooltip): void {
    // 清除任何现有的计时器
    this.clearTimers();

    // 如果有其他 tooltip 正在显示，立即隐藏它
    if (this.activeTooltip && this.activeTooltip !== tooltip) {
      this.activeTooltip._hide();
    }

    // 计算延迟时间
    const delay = this.hasShownTooltip ? 0 : tooltip.showDelay;

    if (delay === 0) {
      this.show(tooltip);
    } else {
      this.showTimer = window.setTimeout(() => {
        this.show(tooltip);
      }, delay);
    }
  }

  requestHide(tooltip: LithTooltip): void {
    if (this.showTimer) {
      window.clearTimeout(this.showTimer);
      this.showTimer = null;
    }

    const delay = tooltip.hideDelay;
    if (delay === 0) {
      this.hide(tooltip);
    } else {
      this.hideTimer = window.setTimeout(() => {
        this.hide(tooltip);
      }, delay);
    }
  }

  private show(tooltip: LithTooltip): void {
    this.activeTooltip = tooltip;
    this.hasShownTooltip = true;
    tooltip._show();

    // 重置标志的计时器
    window.setTimeout(() => {
      if (!this.activeTooltip) {
        this.hasShownTooltip = false;
      }
    }, 1000);
  }

  private hide(tooltip: LithTooltip): void {
    if (this.activeTooltip === tooltip) {
      this.activeTooltip = null;
      tooltip._hide();
    }
  }

  private clearTimers(): void {
    if (this.showTimer) {
      window.clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  cancelAll(): void {
    this.clearTimers();
    if (this.activeTooltip) {
      this.activeTooltip._hide();
      this.activeTooltip = null;
    }
  }
}

@customElement('lith-tooltip')
export class LithTooltip extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }

    [part='trigger'] {
      display: contents;
    }

    [part='content'] {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity 200ms ease-in-out,
        transform 200ms ease-in-out;
    }

    [part='content'][data-show] {
      opacity: 1;
      transform: scale(1);
    }

    /* 默认样式 - 可通过 CSS 变量自定义 */
    [part='content'] {
      background: var(--lith-tooltip-bg, rgba(0, 0, 0, 0.9));
      color: var(--lith-tooltip-color, white);
      padding: var(--lith-tooltip-padding, 0.5rem 0.75rem);
      border-radius: var(--lith-tooltip-radius, 0.25rem);
      font-size: var(--lith-tooltip-font-size, 0.875rem);
      line-height: var(--lith-tooltip-line-height, 1.4);
      max-width: var(--lith-tooltip-max-width, 250px);
      word-wrap: break-word;
      box-shadow: var(--lith-tooltip-shadow, 0 2px 8px rgba(0, 0, 0, 0.15));
    }

    /* 箭头样式 */
    [part='arrow'] {
      position: absolute;
      width: 8px;
      height: 8px;
      background: inherit;
      transform: rotate(45deg);
      pointer-events: none;
    }

    /* 根据位置调整箭头 */
    :host([data-placement^='top']) [part='arrow'] {
      bottom: -4px;
    }

    :host([data-placement^='bottom']) [part='arrow'] {
      top: -4px;
    }

    :host([data-placement^='left']) [part='arrow'] {
      right: -4px;
    }

    :host([data-placement^='right']) [part='arrow'] {
      left: -4px;
    }
  `;

  @property()
  content = '';

  @property()
  placement: TooltipPlacement = 'top';

  @property({ type: Number })
  offset = 8;

  @property({ type: Number })
  showDelay = 600;

  @property({ type: Number })
  hideDelay = 0;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  arrow = true;

  @state()
  private _isShowing = false;

  @state()
  private _position = { top: 0, left: 0 };

  @state()
  private _actualPlacement: TooltipPlacement = 'top';

  @query('[part="trigger"]')
  private _triggerElement!: HTMLElement;

  @query('[part="content"]')
  private _contentElement!: HTMLElement;

  private _tooltipManager = TooltipManager.getInstance();
  private _triggerRect: DOMRect | null = null;
  private _cleanup: (() => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this._cleanup?.();
    this._tooltipManager.cancelAll();
  }

  override firstUpdated(): void {
    this._setupTriggerListeners();
  }

  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('placement')) {
      this.setAttribute('data-placement', this._actualPlacement);
    }
  }

  override render() {
    return html`
      <div
        part="trigger"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
        @touchstart=${this._handleTouchStart}
        aria-describedby=${this._isShowing ? 'tooltip-content' : nothing}
      >
        <slot></slot>
      </div>

      ${this._isShowing
        ? html`
            <div
              part="content"
              id="tooltip-content"
              role="tooltip"
              ?data-show=${this._isShowing}
              style=${styleMap({
                top: `${this._position.top}px`,
                left: `${this._position.left}px`,
              })}
            >
              ${this.content}
              ${this.arrow
                ? html`<div part="arrow" style=${styleMap(this._getArrowStyle())}></div>`
                : nothing}
            </div>
          `
        : nothing}
    `;
  }

  private _setupTriggerListeners(): void {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return;

    // 获取 slot 中的元素
    const assignedElements = slot.assignedElements();
    if (assignedElements.length > 0) {
      const element = assignedElements[0] as HTMLElement;

      // 确保元素可以获取焦点
      if (!element.hasAttribute('tabindex') && !this._isFocusable(element)) {
        element.setAttribute('tabindex', '0');
      }
    }
  }

  private _isFocusable(element: HTMLElement): boolean {
    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    return focusableTags.includes(element.tagName);
  }

  private _handleMouseEnter = (): void => {
    if (this.disabled || this._isTouchDevice()) return;
    this._tooltipManager.requestShow(this);
  };

  private _handleMouseLeave = (): void => {
    if (this.disabled) return;
    this._tooltipManager.requestHide(this);
  };

  private _handleFocus = (): void => {
    if (this.disabled) return;
    this._tooltipManager.requestShow(this);
  };

  private _handleBlur = (): void => {
    if (this.disabled) return;
    this._tooltipManager.requestHide(this);
  };

  private _handleTouchStart = (e: TouchEvent): void => {
    // 阻止在触摸设备上显示 tooltip
    e.preventDefault();
  };

  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this._isShowing) {
      this._tooltipManager.cancelAll();
    }
  };

  _show(): void {
    if (this._isShowing || this.disabled) return;

    this._isShowing = true;
    this.requestUpdate();

    // 等待渲染完成后计算位置
    this.updateComplete.then(() => {
      this._updatePosition();
      this._startPositionUpdates();

      this.dispatchEvent(
        new CustomEvent('lith-tooltip-show', {
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  _hide(): void {
    if (!this._isShowing) return;

    this._isShowing = false;
    this._stopPositionUpdates();

    this.dispatchEvent(
      new CustomEvent('lith-tooltip-hide', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _updatePosition(): void {
    if (!this._triggerElement || !this._contentElement) return;

    const triggerRect = this._triggerElement.getBoundingClientRect();
    const contentRect = this._contentElement.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this._triggerRect = triggerRect;

    // 计算位置
    const position = this._calculatePosition(triggerRect, contentRect, viewport, this.placement);

    this._position = position.position;
    this._actualPlacement = position.placement;
    this.setAttribute('data-placement', this._actualPlacement);
  }

  private _calculatePosition(
    triggerRect: DOMRect,
    contentRect: DOMRect,
    viewport: { width: number; height: number },
    preferredPlacement: TooltipPlacement
  ): { position: { top: number; left: number }; placement: TooltipPlacement } {
    const placements = this._getPlacementOrder(preferredPlacement);

    for (const placement of placements) {
      const pos = this._getPositionForPlacement(triggerRect, contentRect, placement);

      // 检查是否在视口内
      if (
        pos.left >= 0 &&
        pos.top >= 0 &&
        pos.left + contentRect.width <= viewport.width &&
        pos.top + contentRect.height <= viewport.height
      ) {
        return { position: pos, placement };
      }
    }

    // 如果所有位置都不合适，返回首选位置
    return {
      position: this._getPositionForPlacement(triggerRect, contentRect, preferredPlacement),
      placement: preferredPlacement,
    };
  }

  private _getPlacementOrder(placement: TooltipPlacement): TooltipPlacement[] {
    const opposite: Record<string, string> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };

    const [main, sub] = placement.split('-');
    const oppositeMain = opposite[main];

    // 尝试顺序：原始位置 -> 对面位置 -> 其他位置
    const order: TooltipPlacement[] = [placement];

    if (sub) {
      order.push(
        main as TooltipPlacement,
        `${oppositeMain}-${sub}` as TooltipPlacement,
        oppositeMain as TooltipPlacement
      );
    } else {
      order.push(
        `${main}-start` as TooltipPlacement,
        `${main}-end` as TooltipPlacement,
        oppositeMain as TooltipPlacement,
        `${oppositeMain}-start` as TooltipPlacement,
        `${oppositeMain}-end` as TooltipPlacement
      );
    }

    return order;
  }

  private _getPositionForPlacement(
    triggerRect: DOMRect,
    contentRect: DOMRect,
    placement: TooltipPlacement
  ): { top: number; left: number } {
    const [main, sub] = placement.split('-');
    let top = 0;
    let left = 0;

    // 主轴定位
    switch (main) {
      case 'top':
        top = triggerRect.top - contentRect.height - this.offset;
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + this.offset;
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        left = triggerRect.left - contentRect.width - this.offset;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        left = triggerRect.right + this.offset;
        break;
    }

    // 副轴调整
    if (sub === 'start') {
      if (main === 'top' || main === 'bottom') {
        left = triggerRect.left;
      } else {
        top = triggerRect.top;
      }
    } else if (sub === 'end') {
      if (main === 'top' || main === 'bottom') {
        left = triggerRect.right - contentRect.width;
      } else {
        top = triggerRect.bottom - contentRect.height;
      }
    }

    return { top: Math.round(top), left: Math.round(left) };
  }

  private _getArrowStyle(): { [key: string]: string } {
    if (!this._triggerRect || !this._contentElement) return {};

    const contentRect = this._contentElement.getBoundingClientRect();
    const [main, sub] = this._actualPlacement.split('-');
    const style: { [key: string]: string } = {};

    // 根据主轴设置箭头位置
    switch (main) {
      case 'top':
      case 'bottom':
        if (sub === 'start') {
          style.left = `${Math.min(this._triggerRect.width / 2, contentRect.width - 16)}px`;
        } else if (sub === 'end') {
          style.right = `${Math.min(this._triggerRect.width / 2, contentRect.width - 16)}px`;
        } else {
          style.left = '50%';
          style.transform = 'translateX(-50%) rotate(45deg)';
        }
        break;
      case 'left':
      case 'right':
        if (sub === 'start') {
          style.top = `${Math.min(this._triggerRect.height / 2, contentRect.height - 16)}px`;
        } else if (sub === 'end') {
          style.bottom = `${Math.min(this._triggerRect.height / 2, contentRect.height - 16)}px`;
        } else {
          style.top = '50%';
          style.transform = 'translateY(-50%) rotate(45deg)';
        }
        break;
    }

    return style;
  }

  private _startPositionUpdates(): void {
    // 使用 requestAnimationFrame 监听位置变化
    const updatePosition = () => {
      if (!this._isShowing) return;
      this._updatePosition();
      requestAnimationFrame(updatePosition);
    };
    requestAnimationFrame(updatePosition);
  }

  private _stopPositionUpdates(): void {
    // 位置更新会在 _isShowing 变为 false 时自动停止
  }

  private _isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-tooltip': LithTooltip;
  }
}
