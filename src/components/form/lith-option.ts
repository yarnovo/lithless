import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * A headless option component for use with lith-select.
 *
 * @element lith-option
 *
 * @slot - The option content
 * @slot icon - An optional icon to display
 *
 * @csspart base - The component's root element
 * @csspart icon - The icon container
 * @csspart content - The content container
 *
 * @cssprop [--lith-option-padding=8px 12px] - Padding for the option
 * @cssprop [--lith-option-gap=8px] - Gap between icon and content
 * @cssprop [--lith-option-hover-scale=1.01] - Scale factor on hover
 * @cssprop [--lith-option-active-scale=0.99] - Scale factor when active
 * @cssprop [--lith-option-transition-duration=150ms] - Transition duration
 */
@customElement('lith-option')
export class LithOption extends LitElement {
  static override styles = css`
    :host {
      display: block;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: transform var(--lith-option-transition-duration, 150ms) ease;
    }

    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    :host(:hover:not([disabled])) {
      transform: scale(var(--lith-option-hover-scale, 1.01));
    }

    :host(:active:not([disabled])) {
      transform: scale(var(--lith-option-active-scale, 0.99));
    }

    :host([selected]) {
      font-weight: 600;
    }

    :host(.highlighted) {
      outline: 2px solid currentColor;
      outline-offset: -2px;
    }

    .base {
      display: flex;
      align-items: center;
      gap: var(--lith-option-gap, 8px);
      padding: var(--lith-option-padding, 8px 12px);
      width: 100%;
      box-sizing: border-box;
    }

    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ::slotted(*) {
      margin: 0;
    }
  `;

  @property({ type: String })
  value: string = '';

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean, reflect: true })
  selected: boolean = false;

  @property({ type: String })
  label: string = '';

  override render() {
    const classes = {
      base: true,
    };

    return html`
      <div
        part="base"
        class=${classMap(classes)}
        role="option"
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
      >
        <slot name="icon" part="icon" class="icon"></slot>
        <span part="content" class="content">
          <slot>${this.label}</slot>
        </span>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Set role for accessibility
    this.setAttribute('role', 'option');

    // Make focusable if not disabled
    if (!this.disabled && !this.hasAttribute('tabindex')) {
      this.tabIndex = -1;
    }

    // Add click event listener
    this.addEventListener('click', this._handleClick);
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('disabled')) {
      if (this.disabled) {
        this.removeAttribute('tabindex');
      } else {
        this.tabIndex = -1;
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
  }

  private _handleClick = (_event: MouseEvent): void => {
    if (!this.disabled) {
      // 向上冒泡，让 select 组件处理
      const customEvent = new CustomEvent('lith-option-click', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(customEvent);
    }
  };
}
