import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { expect, within, userEvent } from '@storybook/test';
import '../src/components/navigation/lith-tabs.js';
import '../src/components/navigation/lith-tab.js';
import '../src/components/navigation/lith-tab-panel.js';

const meta: Meta = {
  title: 'Navigation/Tabs',
  component: 'lith-tabs',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A headless tab navigation component that provides tabbed interface functionality with complete interaction logic without any predefined styles.

## Features

- **Keyboard Navigation**: Full arrow key navigation with Home/End support
- **Accessibility**: WAI-ARIA compliant with proper focus management
- **Orientation**: Supports both horizontal and vertical orientations
- **Manual Activation**: Optional manual activation mode for enhanced accessibility
- **Lazy Loading**: Tab panels support lazy content loading
- **Closable Tabs**: Optional close buttons for dynamic tab management

## Usage

\`\`\`html
<lith-tabs>
  <lith-tab panel="panel1">Tab 1</lith-tab>
  <lith-tab panel="panel2">Tab 2</lith-tab>
  <lith-tab panel="panel3">Tab 3</lith-tab>
  
  <lith-tab-panel slot="panels" tab-id="panel1">Content for tab 1</lith-tab-panel>
  <lith-tab-panel slot="panels" tab-id="panel2">Content for tab 2</lith-tab-panel>
  <lith-tab-panel slot="panels" tab-id="panel3">Content for tab 3</lith-tab-panel>
</lith-tabs>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    'active-tab': {
      control: { type: 'text' },
      description: 'ID of the currently active tab panel',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tab list',
    },
    'activation-mode': {
      control: { type: 'boolean' },
      description: 'Enable manual activation mode (requires Enter/Space to activate)',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    'active-tab': 'home',
    orientation: 'horizontal',
    'activation-mode': false,
  },
  render: (args) => html`
    <lith-tabs
      active-tab=${args['active-tab']}
      orientation=${args.orientation}
      ?activation-mode=${args['activation-mode']}
      style="
        --lith-tabs-gap: 2px;
        --lith-tabs-tablist-padding: 8px;
      "
    >
      <lith-tab
        panel="home"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        🏠 Home
      </lith-tab>
      <lith-tab
        panel="profile"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        👤 Profile
      </lith-tab>
      <lith-tab
        panel="settings"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        ⚙️ Settings
      </lith-tab>

      <lith-tab-panel
        slot="panels"
        tab-id="home"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">Welcome Home!</h3>
        <p>
          This is the home tab content. You can navigate between tabs using mouse clicks or keyboard
          navigation (Arrow keys, Home, End).
        </p>
        <button>Sample Action</button>
      </lith-tab-panel>

      <lith-tab-panel
        slot="panels"
        tab-id="profile"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">User Profile</h3>
        <p>Here you can manage your profile settings and personal information.</p>
        <form>
          <div style="margin-bottom: 16px;">
            <label>Name: <input type="text" value="John Doe" style="margin-left: 8px;" /></label>
          </div>
          <div style="margin-bottom: 16px;">
            <label
              >Email: <input type="email" value="john@example.com" style="margin-left: 8px;"
            /></label>
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </lith-tab-panel>

      <lith-tab-panel
        slot="panels"
        tab-id="settings"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">Application Settings</h3>
        <p>Configure your application preferences and behavior.</p>
        <div style="margin-bottom: 16px;">
          <label><input type="checkbox" checked /> Enable notifications</label>
        </div>
        <div style="margin-bottom: 16px;">
          <label><input type="checkbox" /> Dark mode</label>
        </div>
        <div style="margin-bottom: 16px;">
          <label
            >Theme:
            <select style="margin-left: 8px;">
              <option>Default</option>
              <option>Blue</option>
              <option>Green</option>
            </select>
          </label>
        </div>
      </lith-tab-panel>
    </lith-tabs>
  `,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for component to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test initial state
    const homeTab = canvas.getByText('🏠 Home');
    expect(homeTab.closest('lith-tab')?.getAttribute('aria-selected')).toBe('true');

    // Test tab switching
    const profileTab = canvas.getByText('👤 Profile');
    await userEvent.click(profileTab);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(profileTab.closest('lith-tab')?.getAttribute('aria-selected')).toBe('true');
  },
};

export const VerticalTabs: Story = {
  args: {
    orientation: 'vertical',
    'active-tab': 'dashboard',
  },
  render: (args) => html`
    <div style="display: flex; gap: 24px; height: 400px;">
      <lith-tabs
        active-tab=${args['active-tab']}
        orientation=${args.orientation}
        style="
          display: flex;
          --lith-tabs-gap: 4px;
          width: 100%;
        "
      >
        <lith-tab
          panel="dashboard"
          style="
            --lith-tab-padding: 16px 20px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px 0 0 8px;
            cursor: pointer;
            min-width: 150px;
            text-align: left;
          "
        >
          📊 Dashboard
        </lith-tab>
        <lith-tab
          panel="analytics"
          style="
            --lith-tab-padding: 16px 20px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px 0 0 8px;
            cursor: pointer;
            min-width: 150px;
            text-align: left;
          "
        >
          📈 Analytics
        </lith-tab>
        <lith-tab
          panel="reports"
          style="
            --lith-tab-padding: 16px 20px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px 0 0 8px;
            cursor: pointer;
            min-width: 150px;
            text-align: left;
          "
        >
          📄 Reports
        </lith-tab>

        <lith-tab-panel
          slot="panels"
          tab-id="dashboard"
          style="
            --lith-tab-panel-padding: 24px;
            background: white;
            border: 1px solid #dee2e6;
            border-left: none;
            border-radius: 0 8px 8px 0;
            flex: 1;
          "
        >
          <h3 style="margin-top: 0;">Dashboard Overview</h3>
          <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-top: 20px;"
          >
            <div
              style="padding: 16px; background: #e3f2fd; border-radius: 8px; text-align: center;"
            >
              <div style="font-size: 24px; font-weight: bold; color: #1976d2;">1,234</div>
              <div style="color: #666;">Total Users</div>
            </div>
            <div
              style="padding: 16px; background: #e8f5e8; border-radius: 8px; text-align: center;"
            >
              <div style="font-size: 24px; font-weight: bold; color: #388e3c;">5,678</div>
              <div style="color: #666;">Sales</div>
            </div>
            <div
              style="padding: 16px; background: #fff3e0; border-radius: 8px; text-align: center;"
            >
              <div style="font-size: 24px; font-weight: bold; color: #f57c00;">89%</div>
              <div style="color: #666;">Growth</div>
            </div>
          </div>
        </lith-tab-panel>

        <lith-tab-panel
          slot="panels"
          tab-id="analytics"
          style="
            --lith-tab-panel-padding: 24px;
            background: white;
            border: 1px solid #dee2e6;
            border-left: none;
            border-radius: 0 8px 8px 0;
            flex: 1;
          "
        >
          <h3 style="margin-top: 0;">Analytics Data</h3>
          <p>Detailed analytics and insights about your application performance.</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 4px; margin-top: 16px;">
            <h4>Key Metrics</h4>
            <ul>
              <li>Page Views: 45,320 (+12%)</li>
              <li>Unique Visitors: 12,890 (+8%)</li>
              <li>Bounce Rate: 34.2% (-5%)</li>
              <li>Average Session: 3m 45s (+15%)</li>
            </ul>
          </div>
        </lith-tab-panel>

        <lith-tab-panel
          slot="panels"
          tab-id="reports"
          style="
            --lith-tab-panel-padding: 24px;
            background: white;
            border: 1px solid #dee2e6;
            border-left: none;
            border-radius: 0 8px 8px 0;
            flex: 1;
          "
        >
          <h3 style="margin-top: 0;">Generated Reports</h3>
          <p>Download and view your generated reports.</p>
          <div style="margin-top: 20px;">
            <div
              style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px;"
            >
              <span>Monthly Sales Report</span>
              <button
                style="padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
              >
                Download
              </button>
            </div>
            <div
              style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px;"
            >
              <span>User Activity Report</span>
              <button
                style="padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
              >
                Download
              </button>
            </div>
            <div
              style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #ddd; border-radius: 4px;"
            >
              <span>Performance Analysis</span>
              <button
                style="padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
              >
                Download
              </button>
            </div>
          </div>
        </lith-tab-panel>
      </lith-tabs>
    </div>
  `,
};

export const ClosableTabs: Story = {
  args: {
    'active-tab': 'tab1',
  },
  render: (args) => html`
    <lith-tabs
      active-tab=${args['active-tab']}
      style="
        --lith-tabs-gap: 2px;
        --lith-tabs-tablist-padding: 8px;
      "
    >
      <lith-tab
        panel="tab1"
        closable
        style="
          --lith-tab-padding: 12px 16px;
          --lith-tab-gap: 8px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Document 1
      </lith-tab>
      <lith-tab
        panel="tab2"
        closable
        style="
          --lith-tab-padding: 12px 16px;
          --lith-tab-gap: 8px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Document 2
      </lith-tab>
      <lith-tab
        panel="tab3"
        closable
        style="
          --lith-tab-padding: 12px 16px;
          --lith-tab-gap: 8px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Document 3
      </lith-tab>

      <lith-tab-panel
        slot="panels"
        tab-id="tab1"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 150px;
        "
      >
        <h4 style="margin-top: 0;">Document 1 Content</h4>
        <p>This tab can be closed using the × button. Click it to see the close event.</p>
      </lith-tab-panel>

      <lith-tab-panel
        slot="panels"
        tab-id="tab2"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 150px;
        "
      >
        <h4 style="margin-top: 0;">Document 2 Content</h4>
        <p>Another closable tab with its own content.</p>
      </lith-tab-panel>

      <lith-tab-panel
        slot="panels"
        tab-id="tab3"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 150px;
        "
      >
        <h4 style="margin-top: 0;">Document 3 Content</h4>
        <p>The third closable tab in this example.</p>
      </lith-tab-panel>
    </lith-tabs>
  `,
  play: async ({ canvasElement }) => {
    // Wait for component to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find a close button and verify it exists
    const closeButtons = canvasElement.querySelectorAll('.close-button');
    expect(closeButtons.length).toBeGreaterThan(0);
  },
};

export const ManualActivation: Story = {
  args: {
    'activation-mode': true,
    'active-tab': 'intro',
  },
  render: (args) => html`
    <div style="margin-bottom: 16px; padding: 12px; background: #e3f2fd; border-radius: 4px;">
      <strong>Manual Activation Mode:</strong> Use Arrow keys to navigate between tabs, then press
      Enter or Space to activate.
    </div>
    <lith-tabs
      active-tab=${args['active-tab']}
      ?activation-mode=${args['activation-mode']}
      style="
        --lith-tabs-gap: 2px;
        --lith-tabs-tablist-padding: 8px;
      "
    >
      <lith-tab
        panel="intro"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Introduction
      </lith-tab>
      <lith-tab
        panel="tutorial"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Tutorial
      </lith-tab>
      <lith-tab
        panel="advanced"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Advanced
      </lith-tab>

      <lith-tab-panel
        slot="panels"
        tab-id="intro"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">Introduction</h3>
        <p>
          Welcome to the manual activation demo. In this mode, focus moves with arrow keys but tabs
          are not automatically activated.
        </p>
        <p>
          Try pressing the right arrow key to move focus, then press Enter or Space to activate the
          focused tab.
        </p>
      </lith-tab-panel>

      <lith-tab-panel
        slot="panels"
        tab-id="tutorial"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">Tutorial</h3>
        <p>
          This is the tutorial section. Manual activation provides better accessibility for users
          who navigate with assistive technologies.
        </p>
        <p>It prevents accidental activation of tabs while browsing through the options.</p>
      </lith-tab-panel>

      <lith-tab-panel
        slot="panels"
        tab-id="advanced"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">Advanced</h3>
        <p>Advanced topics and configurations are covered here.</p>
        <p>
          Manual activation is particularly useful in complex interfaces where accidental tab
          switching could be disruptive.
        </p>
      </lith-tab-panel>
    </lith-tabs>
  `,
};

export const LazyLoading: Story = {
  args: {
    'active-tab': 'overview',
  },
  render: (args) => html`
    <div style="margin-bottom: 16px; padding: 12px; background: #fff3cd; border-radius: 4px;">
      <strong>Lazy Loading:</strong> Tab panels marked as lazy will only render their content when
      first activated.
    </div>
    <lith-tabs
      active-tab=${args['active-tab']}
      style="
        --lith-tabs-gap: 2px;
        --lith-tabs-tablist-padding: 8px;
      "
    >
      <lith-tab
        panel="overview"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Overview
      </lith-tab>
      <lith-tab
        panel="lazy1"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Lazy Tab 1
      </lith-tab>
      <lith-tab
        panel="lazy2"
        style="
          --lith-tab-padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
        "
      >
        Lazy Tab 2
      </lith-tab>

      <lith-tab-panel
        slot="panels"
        tab-id="overview"
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">Overview (Always Loaded)</h3>
        <p>This panel is always loaded since it's the default active tab.</p>
        <p>Switch to the lazy tabs to see how they load their content only when first accessed.</p>
      </lith-tab-panel>

      <lith-tab-panel
        slot="panels"
        tab-id="lazy1"
        lazy
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">Lazy Content 1</h3>
        <p>This content was only rendered when you first clicked this tab!</p>
        <p>Lazy loading is useful for tabs with heavy content that shouldn't load until needed.</p>
        <div style="margin-top: 16px; padding: 16px; background: #f8f9fa; border-radius: 4px;">
          <strong>Expensive Component:</strong> This could be a heavy chart, large data table, or
          complex form that only loads when needed.
        </div>
      </lith-tab-panel>

      <lith-tab-panel
        slot="panels"
        tab-id="lazy2"
        lazy
        style="
          --lith-tab-panel-padding: 24px;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
        "
      >
        <h3 style="margin-top: 0;">Lazy Content 2</h3>
        <p>
          Another lazy-loaded panel! The content here was also only rendered when first accessed.
        </p>
        <p>Once loaded, the content persists even when switching between tabs.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
          <li>Item 5</li>
        </ul>
      </lith-tab-panel>
    </lith-tabs>
  `,
};
