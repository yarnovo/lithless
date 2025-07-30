import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * A headless tab panel component that displays content for a selected tab.
 * Must be used within a lith-tabs component.
 *
 * @element lith-tab-panel
 *
 * @slot - The panel content
 *
 * @csspart base - The component's root element
 * @csspart content - The panel content container
 *
 * @cssprop [--lith-tab-panel-padding=16px] - Padding for the panel
 * @cssprop [--lith-tab-panel-transition-duration=200ms] - Transition duration
 */
@customElement('lith-tab-panel')
export class LithTabPanel extends LitElement {
  static override styles = css`
    :host {
      display: none;
      padding: var(--lith-tab-panel-padding, 16px);
      -webkit-tap-highlight-color: transparent;
    }

    :host([active]) {
      display: block;
    }

    .base {
      width: 100%;
      height: 100%;
    }

    .content {
      width: 100%;
      height: 100%;
    }

    /* Support for fade transition */
    :host([transition]) {
      opacity: 0;
      transition: opacity var(--lith-tab-panel-transition-duration, 200ms) ease;
    }

    :host([transition][active]) {
      opacity: 1;
    }
  `;

  @property({ type: String, attribute: 'tab-id' })
  tabId?: string;

  @property({ type: Boolean, reflect: true })
  active: boolean = false;

  @property({ type: Boolean })
  lazy: boolean = false;

  @property({ type: Boolean })
  transition: boolean = false;

  override render() {
    const classes = {
      base: true,
    };

    // For lazy loading, only render content when active or has been active before
    const shouldRenderContent = !this.lazy || this.active || this._hasBeenActive;

    return html`
      <div part="base" class=${classMap(classes)}>
        <div part="content" class="content">${shouldRenderContent ? html`<slot></slot>` : ''}</div>
      </div>
    `;
  }

  private _hasBeenActive: boolean = false;

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('active') && this.active) {
      this._hasBeenActive = true;
    }
  }

  override firstUpdated(): void {
    // Set initial ARIA attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tabpanel');
    }

    // Make panel focusable
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }

    // Set ID if not present
    if (!this.id) {
      this.id = this.tabId || `panel-${Math.random().toString(36).substring(2, 9)}`;
    }

    // Mark as active if this is the active panel
    if (this.active) {
      this._hasBeenActive = true;
    }
  }

  /**
   * Activates the panel
   */
  activate(): void {
    this.active = true;
    this._hasBeenActive = true;
  }

  /**
   * Deactivates the panel
   */
  deactivate(): void {
    this.active = false;
  }

  /**
   * Shows the panel content (for lazy loading)
   */
  show(): void {
    this._hasBeenActive = true;
    this.requestUpdate();
  }
}
