import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export interface CollapsibleChangeDetail {
  open: boolean;
}

/**
 * Collapsible component that provides collapsible content functionality
 *
 * @fires lith-change - Fired when the collapsible state changes
 * @slot trigger - Trigger element that toggles the collapsible
 * @slot - Default slot for collapsible content
 */
@customElement('lith-collapsible')
export class LithCollapsible extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .trigger {
      cursor: pointer;
      outline: none;
    }

    .trigger:focus {
      outline: 2px solid var(--lith-collapsible-focus-color, #3b82f6);
      outline-offset: 2px;
    }

    .trigger[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .content {
      overflow: hidden;
      transition: all var(--lith-collapsible-transition-duration, 0.2s)
        var(--lith-collapsible-transition-timing, ease);
    }

    .content.closed {
      height: 0;
    }

    .content.open {
      height: auto;
    }

    .content-inner {
      padding: var(--lith-collapsible-content-padding, 0);
    }

    @media (prefers-reduced-motion: reduce) {
      .content {
        transition: none;
      }
    }
  `;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, attribute: 'default-open' })
  defaultOpen = 'false';

  @query('.content')
  private _contentElement!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();

    // Handle default open state
    if (this.defaultOpen === 'true' && !this.hasAttribute('open')) {
      this.open = true;
    }
  }

  protected firstUpdated() {
    this._setupTriggerEvents();
    this._updateContentHeight();
  }

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has('open')) {
      this._updateContentHeight();
      this._dispatchChangeEvent();
    }
  }

  private _setupTriggerEvents() {
    // Find trigger element in slot or use the trigger slot itself
    const triggerSlot = this.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement;
    if (triggerSlot) {
      const triggerElements = triggerSlot.assignedElements();
      triggerElements.forEach((element) => {
        element.addEventListener('click', this._handleToggle);
        element.addEventListener('keydown', this._handleKeyDown as EventListener);
        element.setAttribute('tabindex', this.disabled ? '-1' : '0');
        element.setAttribute('role', 'button');
        element.setAttribute('aria-expanded', String(this.open));
        element.setAttribute('aria-disabled', String(this.disabled));
      });
    }
  }

  private _updateContentHeight() {
    if (!this._contentElement) return;

    if (this.open) {
      // Get actual content height
      this._contentElement.style.height = 'auto';
      const height = this._contentElement.scrollHeight;
      this._contentElement.style.height = '0';
      // Force reflow then set actual height
      requestAnimationFrame(() => {
        this._contentElement.style.height = `${height}px`;
      });
    } else {
      this._contentElement.style.height = '0';
    }
  }

  private _handleToggle = (event?: Event) => {
    if (this.disabled) return;
    event?.preventDefault();
    this.toggle();
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleToggle();
    }
  };

  private _dispatchChangeEvent() {
    const detail: CollapsibleChangeDetail = {
      open: this.open,
    };

    this.dispatchEvent(
      new CustomEvent('lith-change', {
        detail,
        bubbles: true,
      })
    );
  }

  private _updateTriggerAttributes() {
    const triggerSlot = this.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement;
    if (triggerSlot) {
      const triggerElements = triggerSlot.assignedElements();
      triggerElements.forEach((element) => {
        element.setAttribute('aria-expanded', String(this.open));
        element.setAttribute('aria-disabled', String(this.disabled));
        element.setAttribute('tabindex', this.disabled ? '-1' : '0');
      });
    }
  }

  /**
   * Toggle the collapsible state
   */
  toggle() {
    if (this.disabled) return;
    this.open = !this.open;
  }

  /**
   * Open the collapsible
   */
  expand() {
    if (this.disabled) return;
    this.open = true;
  }

  /**
   * Close the collapsible
   */
  collapse() {
    if (this.disabled) return;
    this.open = false;
  }

  render() {
    const contentClasses = {
      content: true,
      open: this.open,
      closed: !this.open,
    };

    return html`
      <div class="trigger" @slotchange=${this._setupTriggerEvents}>
        <slot name="trigger"></slot>
      </div>

      <div
        class=${classMap(contentClasses)}
        role="region"
        aria-hidden=${this.open ? 'false' : 'true'}
      >
        <div class="content-inner">
          <slot></slot>
        </div>
      </div>
    `;
  }

  // Watch for attribute changes to update trigger elements
  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if ((name === 'disabled' || name === 'open') && this.shadowRoot) {
      this._updateTriggerAttributes();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-collapsible': LithCollapsible;
  }
}
