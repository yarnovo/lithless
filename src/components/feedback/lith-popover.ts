import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * 弹出框位置枚举
 */
export type PopoverPlacement =
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
 * 弹出框触发模式
 */
export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual';

/**
 * 弹出框位置信息
 */
export interface PopoverPosition {
  top: number;
  left: number;
  placement: PopoverPlacement;
}

/**
 * A headless popover component that provides floating content positioning
 * with complete interaction logic without any predefined styles.
 *
 * @element lith-popover
 *
 * @fires {CustomEvent} lith-popover-open - Fired when the popover opens
 * @fires {CustomEvent} lith-popover-close - Fired when the popover closes
 * @fires {CustomEvent} lith-popover-position - Fired when the popover position changes
 *
 * @slot trigger - The trigger element that opens the popover
 * @slot - The popover content
 *
 * @csspart base - The component's root element
 * @csspart trigger - The trigger container
 * @csspart popover - The popover container
 * @csspart content - The popover content container
 * @csspart arrow - The popover arrow (if enabled)
 *
 * @cssprop [--lith-popover-z-index=1000] - Z-index for the popover
 * @cssprop [--lith-popover-offset=8] - Distance between trigger and popover
 * @cssprop [--lith-popover-arrow-size=8px] - Size of the popover arrow
 * @cssprop [--lith-popover-transition-duration=200ms] - Transition duration
 * @cssprop [--lith-popover-max-width=300px] - Maximum width of the popover
 * @cssprop [--lith-popover-max-height=400px] - Maximum height of the popover
 */
@customElement('lith-popover')
export class LithPopover extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .base {
      display: contents;
    }

    .trigger {
      display: inline-block;
    }

    .popover {
      position: fixed;
      z-index: var(--lith-popover-z-index, 1000);
      max-width: var(--lith-popover-max-width, 300px);
      max-height: var(--lith-popover-max-height, 400px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition:
        opacity var(--lith-popover-transition-duration, 200ms) ease,
        visibility var(--lith-popover-transition-duration, 200ms) ease,
        transform var(--lith-popover-transition-duration, 200ms) ease;
      transform: scale(0.95);
      transform-origin: var(--transform-origin, center);
    }

    :host([open]) .popover {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: scale(1);
    }

    .content {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .arrow {
      position: absolute;
      width: var(--lith-popover-arrow-size, 8px);
      height: var(--lith-popover-arrow-size, 8px);
      background: inherit;
      transform: rotate(45deg);
      pointer-events: none;
    }

    /* Arrow positioning */
    :host([placement^='top']) .arrow {
      bottom: calc(var(--lith-popover-arrow-size, 8px) / -2);
    }

    :host([placement^='bottom']) .arrow {
      top: calc(var(--lith-popover-arrow-size, 8px) / -2);
    }

    :host([placement^='left']) .arrow {
      right: calc(var(--lith-popover-arrow-size, 8px) / -2);
    }

    :host([placement^='right']) .arrow {
      left: calc(var(--lith-popover-arrow-size, 8px) / -2);
    }

    /* Arrow alignment */
    :host([placement='top']) .arrow,
    :host([placement='bottom']) .arrow {
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }

    :host([placement$='-start']) .arrow {
      left: calc(var(--lith-popover-arrow-size, 8px) * 2);
    }

    :host([placement$='-end']) .arrow {
      right: calc(var(--lith-popover-arrow-size, 8px) * 2);
    }

    :host([placement='left']) .arrow,
    :host([placement='right']) .arrow {
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }

    :host([placement='left-start']) .arrow,
    :host([placement='right-start']) .arrow {
      top: calc(var(--lith-popover-arrow-size, 8px) * 2);
      transform: rotate(45deg);
    }

    :host([placement='left-end']) .arrow,
    :host([placement='right-end']) .arrow {
      bottom: calc(var(--lith-popover-arrow-size, 8px) * 2);
      transform: rotate(45deg);
    }

    /* Transform origin based on placement */
    :host([placement^='top']) .popover {
      --transform-origin: bottom;
    }

    :host([placement^='bottom']) .popover {
      --transform-origin: top;
    }

    :host([placement^='left']) .popover {
      --transform-origin: right;
    }

    :host([placement^='right']) .popover {
      --transform-origin: left;
    }
  `;

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: String, reflect: true })
  placement: PopoverPlacement = 'bottom';

  @property({ type: String })
  trigger: PopoverTrigger = 'click';

  @property({ type: Boolean, attribute: 'show-arrow' })
  showArrow: boolean = false;

  @property({ type: Number })
  offset: number = 8;

  @property({ type: Boolean, attribute: 'flip' })
  flip: boolean = true;

  @property({ type: Boolean, attribute: 'shift' })
  shift: boolean = true;

  @property({ type: Number, attribute: 'hover-delay' })
  hoverDelay: number = 100;

  @property({ type: Boolean, attribute: 'focus-trap' })
  focusTrap: boolean = false;

  @property({ type: Boolean, attribute: 'close-on-escape' })
  closeOnEscape: boolean = true;

  @property({ type: Boolean, attribute: 'close-on-outside-click' })
  closeOnOutsideClick: boolean = true;

  @state()
  private _position: PopoverPosition = {
    top: 0,
    left: 0,
    placement: this.placement,
  };

  @query('.trigger')
  private _triggerContainer!: HTMLElement;

  @query('.popover')
  private _popoverElement!: HTMLElement;

  @query('slot[name="trigger"]')
  private _triggerSlot!: HTMLSlotElement;

  private _hoverTimeout?: number;
  private _resizeObserver?: ResizeObserver;
  private _mutationObserver?: MutationObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this._setupEventListeners();
    this._setupObservers();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanupEventListeners();
    this._cleanupObservers();
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._onOpen();
      } else {
        this._onClose();
      }
    }

    if (changedProperties.has('placement') && this.open) {
      this._updatePosition();
    }
  }

  override render() {
    const classes = {
      base: true,
    };

    const popoverClasses = {
      popover: true,
    };

    return html`
      <div part="base" class=${classMap(classes)}>
        <div
          part="trigger"
          class="trigger"
          @click=${this._handleTriggerClick}
          @mouseenter=${this._handleTriggerMouseEnter}
          @mouseleave=${this._handleTriggerMouseLeave}
          @focus=${this._handleTriggerFocus}
          @blur=${this._handleTriggerBlur}
        >
          <slot name="trigger"></slot>
        </div>

        <div
          part="popover"
          class=${classMap(popoverClasses)}
          style=${this._getPopoverStyles()}
          @mouseenter=${this._handlePopoverMouseEnter}
          @mouseleave=${this._handlePopoverMouseLeave}
        >
          <div part="content" class="content">
            <slot></slot>
          </div>
          ${this.showArrow ? html`<div part="arrow" class="arrow"></div>` : ''}
        </div>
      </div>
    `;
  }

  private _setupEventListeners(): void {
    if (this.closeOnEscape) {
      document.addEventListener('keydown', this._handleDocumentKeyDown);
    }

    if (this.closeOnOutsideClick) {
      document.addEventListener('click', this._handleDocumentClick);
    }
  }

  private _cleanupEventListeners(): void {
    document.removeEventListener('keydown', this._handleDocumentKeyDown);
    document.removeEventListener('click', this._handleDocumentClick);

    if (this._hoverTimeout) {
      clearTimeout(this._hoverTimeout);
    }
  }

  private _setupObservers(): void {
    // 监听窗口大小变化
    this._resizeObserver = new ResizeObserver(() => {
      if (this.open) {
        this._updatePosition();
      }
    });
    this._resizeObserver.observe(document.body);

    // 监听DOM变化
    this._mutationObserver = new MutationObserver(() => {
      if (this.open) {
        this._updatePosition();
      }
    });
  }

  private _cleanupObservers(): void {
    this._resizeObserver?.disconnect();
    this._mutationObserver?.disconnect();
  }

  private _handleTriggerClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (this.trigger === 'click' || this.trigger === 'manual') {
      this.toggle();
    }
  };

  private _handleTriggerMouseEnter = (): void => {
    if (this.trigger === 'hover') {
      this._clearHoverTimeout();
      this._hoverTimeout = window.setTimeout(() => {
        this.show();
      }, this.hoverDelay);
    }
  };

  private _handleTriggerMouseLeave = (): void => {
    if (this.trigger === 'hover') {
      this._clearHoverTimeout();
      this._hoverTimeout = window.setTimeout(() => {
        this.hide();
      }, this.hoverDelay);
    }
  };

  private _handlePopoverMouseEnter = (): void => {
    if (this.trigger === 'hover') {
      this._clearHoverTimeout();
    }
  };

  private _handlePopoverMouseLeave = (): void => {
    if (this.trigger === 'hover') {
      this._clearHoverTimeout();
      this._hoverTimeout = window.setTimeout(() => {
        this.hide();
      }, this.hoverDelay);
    }
  };

  private _handleTriggerFocus = (): void => {
    if (this.trigger === 'focus') {
      this.show();
    }
  };

  private _handleTriggerBlur = (): void => {
    if (this.trigger === 'focus') {
      // 延迟关闭，允许焦点移动到弹出框内容
      setTimeout(() => {
        if (!this._isPopoverOrChildFocused()) {
          this.hide();
        }
      }, 0);
    }
  };

  private _handleDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open && this.closeOnEscape) {
      this.hide();
      this._focusTrigger();
    }
  };

  private _handleDocumentClick = (event: MouseEvent): void => {
    if (this.open && this.closeOnOutsideClick) {
      const target = event.target as Node;
      if (!this.contains(target) && !this._popoverElement?.contains(target)) {
        this.hide();
      }
    }
  };

  private _clearHoverTimeout(): void {
    if (this._hoverTimeout) {
      clearTimeout(this._hoverTimeout);
      this._hoverTimeout = undefined;
    }
  }

  private _isPopoverOrChildFocused(): boolean {
    const activeElement = document.activeElement;
    return this._popoverElement?.contains(activeElement) || activeElement === this._popoverElement;
  }

  private _focusTrigger(): void {
    const triggerElements = this._triggerSlot?.assignedElements();
    const focusableElement = triggerElements?.[0] as HTMLElement;
    focusableElement?.focus();
  }

  private _onOpen(): void {
    this._updatePosition();

    if (this.focusTrap) {
      this._trapFocus();
    }

    this.dispatchEvent(
      new CustomEvent('lith-popover-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onClose(): void {
    this.dispatchEvent(
      new CustomEvent('lith-popover-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _trapFocus(): void {
    // 简单的焦点陷阱实现
    const focusableElements = this._popoverElement?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }

  private _updatePosition(): void {
    if (!this._triggerContainer || !this._popoverElement) {
      return;
    }

    const triggerRect = this._triggerContainer.getBoundingClientRect();
    const popoverRect = this._popoverElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let position = this._calculatePosition(triggerRect, popoverRect, this.placement);

    // 应用 flip 逻辑
    if (this.flip) {
      position = this._applyFlip(position, triggerRect, popoverRect, viewportWidth, viewportHeight);
    }

    // 应用 shift 逻辑
    if (this.shift) {
      position = this._applyShift(position, popoverRect, viewportWidth, viewportHeight);
    }

    this._position = position;

    this.dispatchEvent(
      new CustomEvent('lith-popover-position', {
        detail: position,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _calculatePosition(
    triggerRect: DOMRect,
    popoverRect: DOMRect,
    placement: PopoverPlacement
  ): PopoverPosition {
    const offset = this.offset;
    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'top-start':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.left;
        break;
      case 'top-end':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.right - popoverRect.width;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        left = triggerRect.right - popoverRect.width;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case 'left-start':
        top = triggerRect.top;
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case 'left-end':
        top = triggerRect.bottom - popoverRect.height;
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + offset;
        break;
      case 'right-start':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        break;
      case 'right-end':
        top = triggerRect.bottom - popoverRect.height;
        left = triggerRect.right + offset;
        break;
    }

    return { top, left, placement };
  }

  private _applyFlip(
    position: PopoverPosition,
    triggerRect: DOMRect,
    popoverRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number
  ): PopoverPosition {
    const { top, left, placement } = position;

    // 检查是否超出视窗边界，如果是则翻转
    if (placement.startsWith('top') && top < 0) {
      const flippedPlacement = placement.replace('top', 'bottom') as PopoverPlacement;
      return this._calculatePosition(triggerRect, popoverRect, flippedPlacement);
    }

    if (placement.startsWith('bottom') && top + popoverRect.height > viewportHeight) {
      const flippedPlacement = placement.replace('bottom', 'top') as PopoverPlacement;
      return this._calculatePosition(triggerRect, popoverRect, flippedPlacement);
    }

    if (placement.startsWith('left') && left < 0) {
      const flippedPlacement = placement.replace('left', 'right') as PopoverPlacement;
      return this._calculatePosition(triggerRect, popoverRect, flippedPlacement);
    }

    if (placement.startsWith('right') && left + popoverRect.width > viewportWidth) {
      const flippedPlacement = placement.replace('right', 'left') as PopoverPlacement;
      return this._calculatePosition(triggerRect, popoverRect, flippedPlacement);
    }

    return position;
  }

  private _applyShift(
    position: PopoverPosition,
    popoverRect: DOMRect,
    viewportWidth: number,
    viewportHeight: number
  ): PopoverPosition {
    let { top, left } = position;

    // 水平方向调整
    if (left < 0) {
      left = 0;
    } else if (left + popoverRect.width > viewportWidth) {
      left = viewportWidth - popoverRect.width;
    }

    // 垂直方向调整
    if (top < 0) {
      top = 0;
    } else if (top + popoverRect.height > viewportHeight) {
      top = viewportHeight - popoverRect.height;
    }

    return { ...position, top, left };
  }

  private _getPopoverStyles(): string {
    return `
      top: ${this._position.top}px;
      left: ${this._position.left}px;
    `;
  }

  /**
   * Shows the popover
   */
  show(): void {
    this.open = true;
  }

  /**
   * Hides the popover
   */
  hide(): void {
    this.open = false;
  }

  /**
   * Toggles the popover
   */
  toggle(): void {
    this.open = !this.open;
  }

  /**
   * Updates the popover position
   */
  updatePosition(): void {
    this._updatePosition();
  }
}
