import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

/**
 * A headless portal component that renders content to a different part of the DOM tree.
 * Useful for handling z-index stacking contexts and positioning issues.
 *
 * @element lith-portal
 *
 * @fires {CustomEvent} lith-portal-mount - Fired when content is mounted to target
 * @fires {CustomEvent} lith-portal-unmount - Fired when content is unmounted from target
 *
 * @slot - Content to be rendered in the portal
 *
 * @csspart container - The container element (only visible when renderInPlace is true)
 *
 * @cssprop [--lith-portal-z-index=9999] - Z-index for the portal container when using default target
 */
@customElement('lith-portal')
export class LithPortal extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }

    .portal-container {
      display: contents;
    }

    /* Styles for default portal target */
    .portal-default-target {
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      z-index: var(--lith-portal-z-index, 9999);
      pointer-events: none;
    }

    .portal-default-target > * {
      pointer-events: auto;
    }
  `;

  /**
   * Target element selector or element reference where content should be rendered
   * If not specified, renders to a default portal container
   */
  @property({ type: String })
  target?: string;

  /**
   * Whether to render content in place instead of portal
   * Useful for SSR or when portal behavior should be disabled
   */
  @property({ type: Boolean, attribute: 'render-in-place' })
  renderInPlace = false;

  /**
   * Whether the portal is active (content is mounted)
   */
  @property({ type: Boolean, reflect: true })
  active = true;

  /**
   * ID for the default portal target container
   * Allows multiple portals to share the same container
   */
  @property({ type: String, attribute: 'container-id' })
  containerId = 'lith-portal-container';

  @state()
  private _mounted = false;

  @query('slot')
  private _slot!: HTMLSlotElement;

  private _portalTarget: Element | null = null;
  private _defaultContainer: HTMLElement | null = null;
  private _slottedNodes: Node[] = [];
  private _placeholderComment: Comment | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.renderInPlace && this.active) {
      this._setupPortal();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanupPortal();
  }

  protected override updated(changedProperties: PropertyValues): void {
    if (
      changedProperties.has('active') ||
      changedProperties.has('renderInPlace') ||
      changedProperties.has('target')
    ) {
      if (!this.renderInPlace && this.active) {
        this._setupPortal();
      } else {
        this._cleanupPortal();
      }
    }
  }

  protected override firstUpdated(): void {
    // Handle initial slotted content
    this._handleSlotChange();
  }

  override render() {
    return html`
      <div part="container" class="portal-container">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  private _handleSlotChange = (): void => {
    if (!this._slot) return;

    const nodes = this._slot.assignedNodes({ flatten: true });
    this._slottedNodes = Array.from(nodes);

    if (!this.renderInPlace && this.active && this._portalTarget) {
      this._moveNodesToPortal();
    }
  };

  private _setupPortal(): void {
    // Find or create portal target
    this._portalTarget = this._findPortalTarget();

    if (this._portalTarget && this._slottedNodes.length > 0) {
      this._moveNodesToPortal();
      this._mounted = true;

      // Emit mount event
      this.dispatchEvent(
        new CustomEvent('lith-portal-mount', {
          detail: { target: this._portalTarget },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _cleanupPortal(): void {
    if (this._mounted && this._slottedNodes.length > 0) {
      this._moveNodesBack();
      this._mounted = false;

      // Emit unmount event
      this.dispatchEvent(
        new CustomEvent('lith-portal-unmount', {
          bubbles: true,
          composed: true,
        })
      );
    }

    // Clean up default container if it's empty
    if (this._defaultContainer && this._defaultContainer.childNodes.length === 0) {
      this._defaultContainer.remove();
      this._defaultContainer = null;
    }
  }

  private _findPortalTarget(): Element | null {
    if (this.target) {
      // If target is a selector, find the element
      if (typeof this.target === 'string') {
        return document.querySelector(this.target);
      }
    } else {
      // Use default portal container
      return this._getOrCreateDefaultContainer();
    }

    return null;
  }

  private _getOrCreateDefaultContainer(): HTMLElement {
    // Check if container already exists
    let container = document.getElementById(this.containerId);

    if (!container) {
      // Create default container
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'portal-default-target';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        z-index: var(--lith-portal-z-index, 9999);
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    this._defaultContainer = container;
    return container;
  }

  private _moveNodesToPortal(): void {
    if (!this._portalTarget || this._slottedNodes.length === 0) return;

    // Create placeholder comment to maintain position
    if (!this._placeholderComment) {
      this._placeholderComment = document.createComment('lith-portal-placeholder');
    }

    // Insert placeholder at the original position
    const firstNode = this._slottedNodes[0];
    if (firstNode.parentNode) {
      firstNode.parentNode.insertBefore(this._placeholderComment, firstNode);
    }

    // Move nodes to portal target
    for (const node of this._slottedNodes) {
      // Set pointer-events to auto for moved nodes
      if (node instanceof HTMLElement) {
        node.style.pointerEvents = 'auto';
      }
      this._portalTarget.appendChild(node);
    }
  }

  private _moveNodesBack(): void {
    if (!this._placeholderComment || this._slottedNodes.length === 0) return;

    // Move nodes back to original position
    for (const node of this._slottedNodes) {
      // Reset pointer-events
      if (node instanceof HTMLElement) {
        node.style.pointerEvents = '';
      }

      if (this._placeholderComment.parentNode) {
        this._placeholderComment.parentNode.insertBefore(node, this._placeholderComment);
      }
    }

    // Remove placeholder
    this._placeholderComment.remove();
    this._placeholderComment = null;
  }

  /**
   * Get the current portal target element
   */
  getPortalTarget(): Element | null {
    return this._portalTarget;
  }

  /**
   * Check if content is currently mounted in portal
   */
  isMounted(): boolean {
    return this._mounted;
  }

  /**
   * Manually remount content to portal
   */
  remount(): void {
    if (!this.renderInPlace && this.active) {
      this._cleanupPortal();
      this._setupPortal();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-portal': LithPortal;
  }
}
