import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Custom event detail for tab change events
 */
export interface TabChangeDetail {
  activeTab: string;
  previousTab?: string;
}

/**
 * A headless tab navigation component that provides tabbed interface functionality
 * with complete interaction logic without any predefined styles.
 *
 * @element lith-tabs
 *
 * @fires {CustomEvent<TabChangeDetail>} lith-change - Fired when the active tab changes
 * @fires {CustomEvent} lith-tab-add - Fired when a new tab is added
 * @fires {CustomEvent} lith-tab-remove - Fired when a tab is removed
 *
 * @slot - The lith-tab elements
 * @slot panels - The lith-tab-panel elements
 *
 * @csspart base - The component's root element
 * @csspart tablist - The tab list container
 * @csspart panels - The tab panels container
 *
 * @cssprop [--lith-tabs-gap=0] - Gap between tab items
 * @cssprop [--lith-tabs-tablist-padding=0] - Padding for the tab list
 * @cssprop [--lith-tabs-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-tabs-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-tabs-transition-duration=200ms] - Transition duration
 */
@customElement('lith-tabs')
export class LithTabs extends LitElement {
  static override styles = css`
    :host {
      display: block;
      -webkit-tap-highlight-color: transparent;
    }

    .base {
      display: flex;
      flex-direction: column;
    }

    .tablist {
      display: flex;
      gap: var(--lith-tabs-gap, 0);
      padding: var(--lith-tabs-tablist-padding, 0);
      overflow-x: auto;
      scrollbar-width: thin;
    }

    :host([orientation='vertical']) .base {
      flex-direction: row;
    }

    :host([orientation='vertical']) .tablist {
      flex-direction: column;
      overflow-x: visible;
      overflow-y: auto;
    }

    .panels {
      flex: 1;
      position: relative;
    }

    ::slotted(lith-tab) {
      flex-shrink: 0;
    }

    ::slotted(lith-tab:focus) {
      outline: var(--lith-tabs-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-tabs-focus-ring-offset, 2px);
    }

    ::slotted(lith-tab-panel) {
      display: none;
    }

    ::slotted(lith-tab-panel[active]) {
      display: block;
    }
  `;

  @property({ type: String, attribute: 'active-tab' })
  activeTab?: string;

  @property({ type: String })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  @property({ type: String })
  role: string = 'tablist';

  @property({ type: Boolean, attribute: 'activation-mode' })
  manualActivation: boolean = false;

  @query('slot:not([name])')
  private _tabSlot!: HTMLSlotElement;

  @query('slot[name="panels"]')
  private _panelSlot!: HTMLSlotElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._handleKeyDown);
    this.addEventListener('lith-tab-click', this._handleTabClick as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('lith-tab-click', this._handleTabClick as EventListener);
  }

  override firstUpdated(): void {
    this._initializeTabs();
  }

  override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('activeTab')) {
      this._updateActiveTab();
    }

    if (changedProperties.has('orientation')) {
      this._updateOrientation();
    }
  }

  override render() {
    const classes = {
      base: true,
    };

    return html`
      <div part="base" class=${classMap(classes)}>
        <div
          part="tablist"
          class="tablist"
          role="${this.role}"
          aria-orientation="${this.orientation}"
        >
          <slot @slotchange=${this._handleTabSlotChange}></slot>
        </div>
        <div part="panels" class="panels">
          <slot name="panels" @slotchange=${this._handlePanelSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private _handleTabSlotChange(): void {
    this._initializeTabs();
  }

  private _handlePanelSlotChange(): void {
    this._initializePanels();
  }

  private _initializeTabs(): void {
    const tabs = this._getTabs();
    const activeTabId = this.activeTab || tabs[0]?.getAttribute('panel') || '';

    tabs.forEach((tab, index) => {
      const panelId = tab.getAttribute('panel') || `panel-${index}`;
      const isActive = panelId === activeTabId;

      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      tab.toggleAttribute('active', isActive);

      if (!tab.hasAttribute('aria-controls')) {
        tab.setAttribute('aria-controls', panelId);
      }

      if (isActive) {
        // Active tab found
      }
    });

    this._initializePanels();
  }

  private _initializePanels(): void {
    const panels = this._getPanels();
    const activeTabId = this.activeTab || this._getTabs()[0]?.getAttribute('panel') || '';

    panels.forEach((panel) => {
      const panelId = panel.getAttribute('tab-id') || panel.id;
      const isActive = panelId === activeTabId;

      panel.setAttribute('role', 'tabpanel');
      panel.toggleAttribute('active', isActive);
      panel.setAttribute('tabindex', '0');

      if (!panel.hasAttribute('aria-labelledby')) {
        const tab = this._getTabByPanel(panelId);
        if (tab) {
          panel.setAttribute('aria-labelledby', tab.id || '');
        }
      }
    });
  }

  private _getTabs(): HTMLElement[] {
    if (!this._tabSlot) return [];
    const nodes = this._tabSlot.assignedNodes({ flatten: true });
    return nodes.filter(
      (node): node is HTMLElement =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName.toLowerCase() === 'lith-tab'
    );
  }

  private _getPanels(): HTMLElement[] {
    if (!this._panelSlot) return [];
    const nodes = this._panelSlot.assignedNodes({ flatten: true });
    return nodes.filter(
      (node): node is HTMLElement =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName.toLowerCase() === 'lith-tab-panel'
    );
  }

  private _getTabByPanel(panelId: string): HTMLElement | null {
    const tabs = this._getTabs();
    return tabs.find((tab) => tab.getAttribute('panel') === panelId) || null;
  }

  private _handleTabClick = (event: CustomEvent): void => {
    const tab = event.target as HTMLElement;
    if (!tab || tab.tagName.toLowerCase() !== 'lith-tab') return;

    const panelId = tab.getAttribute('panel');
    if (panelId && !this.manualActivation) {
      this._selectTab(panelId);
    }
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    if (!target || target.tagName.toLowerCase() !== 'lith-tab') return;

    const tabs = this._getTabs();
    const currentIndex = tabs.indexOf(target);

    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        if (this.orientation === 'horizontal' && event.key === 'ArrowDown') return;
        if (this.orientation === 'vertical' && event.key === 'ArrowRight') return;
        nextIndex = (currentIndex + 1) % tabs.length;
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        if (this.orientation === 'horizontal' && event.key === 'ArrowUp') return;
        if (this.orientation === 'vertical' && event.key === 'ArrowLeft') return;
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = tabs.length - 1;
        break;

      case 'Enter':
      case ' ':
        if (this.manualActivation) {
          event.preventDefault();
          const panelId = target.getAttribute('panel');
          if (panelId) {
            this._selectTab(panelId);
          }
        }
        break;

      default:
        return;
    }

    if (nextIndex !== null) {
      const nextTab = tabs[nextIndex];
      nextTab.focus();

      if (!this.manualActivation) {
        const panelId = nextTab.getAttribute('panel');
        if (panelId) {
          this._selectTab(panelId);
        }
      }
    }
  };

  private _selectTab(panelId: string): void {
    const previousTab = this.activeTab;
    this.activeTab = panelId;

    this.dispatchEvent(
      new CustomEvent<TabChangeDetail>('lith-change', {
        detail: {
          activeTab: panelId,
          previousTab,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _updateActiveTab(): void {
    this._initializeTabs();
  }

  private _updateOrientation(): void {
    const tablist = this.shadowRoot?.querySelector('[role="tablist"]');
    if (tablist) {
      tablist.setAttribute('aria-orientation', this.orientation);
    }
  }

  /**
   * Selects a tab by its panel ID
   */
  selectTab(panelId: string): void {
    this._selectTab(panelId);
  }

  /**
   * Gets the currently active tab's panel ID
   */
  getActiveTab(): string | undefined {
    return this.activeTab;
  }

  /**
   * Gets all tab elements
   */
  getTabs(): HTMLElement[] {
    return this._getTabs();
  }

  /**
   * Gets all panel elements
   */
  getPanels(): HTMLElement[] {
    return this._getPanels();
  }
}
