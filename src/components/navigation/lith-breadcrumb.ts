import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Custom event detail for breadcrumb item click events
 */
export interface BreadcrumbItemClickDetail {
  item: HTMLElement;
  href?: string;
  target?: string;
  index: number;
}

/**
 * A headless breadcrumb navigation component that shows the current page's
 * location within a navigational hierarchy.
 *
 * @element lith-breadcrumb
 *
 * @fires {CustomEvent<BreadcrumbItemClickDetail>} lith-breadcrumb-click - Fired when a breadcrumb item is clicked
 *
 * @slot - The lith-breadcrumb-item elements
 * @slot separator - Custom separator content
 *
 * @csspart base - The component's root element
 * @csspart items - The breadcrumb items container
 *
 * @cssprop [--lith-breadcrumb-gap=8px] - Gap between breadcrumb items and separators
 * @cssprop [--lith-breadcrumb-padding=0] - Padding for the breadcrumb container
 * @cssprop [--lith-breadcrumb-separator-color=currentColor] - Color of the separator
 * @cssprop [--lith-breadcrumb-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-breadcrumb-focus-ring-offset=2px] - Focus ring offset
 */
@customElement('lith-breadcrumb')
export class LithBreadcrumb extends LitElement {
  static override styles = css`
    :host {
      display: block;
      -webkit-tap-highlight-color: transparent;
    }

    .base {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--lith-breadcrumb-gap, 8px);
      padding: var(--lith-breadcrumb-padding, 0);
      list-style: none;
      margin: 0;
    }

    .items {
      display: contents;
    }

    .separator {
      display: flex;
      align-items: center;
      color: var(--lith-breadcrumb-separator-color, currentColor);
      opacity: 0.6;
      user-select: none;
      flex-shrink: 0;
    }

    ::slotted(lith-breadcrumb-item) {
      display: flex;
      align-items: center;
    }

    ::slotted(lith-breadcrumb-item:focus) {
      outline: var(--lith-breadcrumb-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-breadcrumb-focus-ring-offset, 2px);
    }

    ::slotted(lith-breadcrumb-item[current]) {
      pointer-events: none;
      cursor: default;
    }
  `;

  @property({ type: String })
  separator: string = '/';

  @query('slot:not([name])')
  private _slot!: HTMLSlotElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('lith-breadcrumb-item-click', this._handleItemClick as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('lith-breadcrumb-item-click', this._handleItemClick as EventListener);
  }

  override render() {
    const classes = {
      base: true,
    };

    return html`
      <nav part="base" class=${classMap(classes)} aria-label="Breadcrumb">
        <ol part="items" class="items">
          ${this._renderItemsWithSeparators()}
        </ol>
      </nav>
    `;
  }

  private _renderItemsWithSeparators() {
    const items = this._getItems();
    const renderedItems: unknown[] = [];

    items.forEach((item, index) => {
      // Wrap each item in a list item
      renderedItems.push(html` <li>${item}</li> `);

      // Add separator if not the last item
      if (index < items.length - 1) {
        renderedItems.push(html`
          <li class="separator" aria-hidden="true">
            <slot name="separator">${this.separator}</slot>
          </li>
        `);
      }
    });

    return html`
      <slot @slotchange=${this._handleSlotChange} style="display: none;"></slot>
      ${renderedItems}
    `;
  }

  private _handleSlotChange(): void {
    this._updateItemsAttributes();
  }

  private _getItems(): HTMLElement[] {
    if (!this._slot) return [];
    const nodes = this._slot.assignedNodes({ flatten: true });
    return nodes.filter(
      (node): node is HTMLElement =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName.toLowerCase() === 'lith-breadcrumb-item'
    );
  }

  private _handleItemClick = (event: CustomEvent): void => {
    const item = event.target as HTMLElement;
    if (!item || item.tagName.toLowerCase() !== 'lith-breadcrumb-item') return;

    const items = this._getItems();
    const index = items.indexOf(item);

    // Re-dispatch the event with additional information
    this.dispatchEvent(
      new CustomEvent<BreadcrumbItemClickDetail>('lith-breadcrumb-click', {
        detail: {
          ...event.detail,
          index,
        },
        bubbles: true,
        composed: true,
      })
    );
  };

  override firstUpdated(): void {
    this._updateItemsAttributes();
  }

  private _updateItemsAttributes(): void {
    const items = this._getItems();

    items.forEach((item, index) => {
      // Set ARIA attributes
      item.setAttribute('role', 'none');

      // Mark the last item as current if not explicitly set
      if (index === items.length - 1 && !item.hasAttribute('current')) {
        item.setAttribute('aria-current', 'page');
      }
    });
  }

  override updated(): void {
    this._updateItemsAttributes();
  }

  /**
   * Gets all breadcrumb item elements
   */
  getItems(): HTMLElement[] {
    return this._getItems();
  }

  /**
   * Gets the current (last) breadcrumb item
   */
  getCurrentItem(): HTMLElement | null {
    const items = this._getItems();
    return items[items.length - 1] || null;
  }
}
