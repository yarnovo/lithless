# Lithless 架构设计文档

## 总体架构

Lithless 是一个基于 Web Components 规范的 Headless UI 组件库，采用 Lit 框架构建。设计遵循模块化、可扩展、高性能的原则。

## 设计原则

### 1. Headless 设计原则
- **分离关注点**：将交互逻辑与视觉表现分离
- **最小化样式**：仅提供必要的功能性样式
- **可定制性**：通过 CSS 自定义属性提供样式钩子
- **语义化**：保持 HTML 语义和可访问性

### 2. Web Components 原则
- **标准合规**：严格遵循 Web Components 规范
- **框架无关**：可在任何前端框架中使用
- **向后兼容**：提供 polyfill 支持
- **渐进增强**：基于原生 HTML 元素增强

### 3. 可访问性原则
- **WCAG 2.1 AA 标准**：满足可访问性要求
- **ARIA 支持**：提供完整的 ARIA 属性
- **键盘导航**：支持完整的键盘操作
- **屏幕阅读器**：优化屏幕阅读器体验

## 技术架构

### 核心技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                        Lithless                             │
├─────────────────────────────────────────────────────────────┤
│  Components (Web Components)                                │
│  ├── Form Components (Checkbox, Select, etc.)              │
│  ├── Navigation Components (Menu, Tabs, etc.)              │
│  ├── Feedback Components (Modal, Popover, etc.)            │
│  └── Data Display Components (Table, Tree, etc.)           │
├─────────────────────────────────────────────────────────────┤
│  Core Layer                                                 │
│  ├── Base Component Class                                   │
│  ├── State Management                                       │
│  ├── Event System                                          │
│  ├── Accessibility Utils                                   │
│  └── Theme System                                          │
├─────────────────────────────────────────────────────────────┤
│  Foundation                                                 │
│  ├── Lit 3.0 (Web Components Framework)                    │
│  ├── TypeScript (Type System)                              │
│  └── Web Components Standards                              │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
src/
├── components/           # 组件实现
│   ├── base/            # 基础组件类
│   ├── form/            # 表单组件
│   │   ├── checkbox/
│   │   ├── radio-group/
│   │   ├── select/
│   │   └── ...
│   ├── navigation/      # 导航组件
│   │   ├── menu/
│   │   ├── tabs/
│   │   └── ...
│   ├── feedback/        # 反馈组件
│   │   ├── modal/
│   │   ├── popover/
│   │   └── ...
│   └── data-display/    # 数据展示组件
│       ├── table/
│       ├── tree/
│       └── ...
├── core/                # 核心功能
│   ├── base.ts          # 基础组件类
│   ├── state.ts         # 状态管理
│   ├── events.ts        # 事件系统
│   ├── a11y.ts          # 可访问性工具
│   └── theme.ts         # 主题系统
├── utils/               # 工具函数
│   ├── dom.ts           # DOM 操作
│   ├── keyboard.ts      # 键盘事件处理
│   ├── focus.ts         # 焦点管理
│   └── id.ts            # ID 生成
├── types/               # TypeScript 类型定义
└── styles/              # 基础样式
    ├── reset.css        # 样式重置
    └── tokens.css       # 设计令牌
```

## 组件架构

### 基础组件类

```typescript
// src/core/base.ts
export abstract class LithlessBase extends LitElement {
  // 通用属性
  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: String })
  variant: string = 'default';

  // 状态管理
  protected state = new StateManager();

  // 可访问性
  protected a11y = new A11yManager();

  // 主题
  protected theme = new ThemeManager();

  // 生命周期
  connectedCallback() {
    super.connectedCallback();
    this.setupA11y();
    this.setupTheme();
    this.setupKeyboard();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  // 抽象方法
  protected abstract setupA11y(): void;
  protected abstract setupKeyboard(): void;
  protected abstract cleanup(): void;
}
```

### 状态管理

```typescript
// src/core/state.ts
export class StateManager {
  private state: Record<string, any> = {};
  private listeners: Record<string, Function[]> = {};

  setState(key: string, value: any) {
    const oldValue = this.state[key];
    this.state[key] = value;
    
    if (oldValue !== value) {
      this.notifyListeners(key, value, oldValue);
    }
  }

  getState(key: string) {
    return this.state[key];
  }

  subscribe(key: string, listener: Function) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(listener);
  }

  private notifyListeners(key: string, value: any, oldValue: any) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(listener => {
        listener(value, oldValue);
      });
    }
  }
}
```

### 事件系统

```typescript
// src/core/events.ts
export class EventSystem {
  static emit(element: HTMLElement, eventName: string, detail?: any) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true
    });
    
    return element.dispatchEvent(event);
  }

  static listen(element: HTMLElement, eventName: string, handler: Function) {
    element.addEventListener(eventName, handler as EventListener);
    
    return () => {
      element.removeEventListener(eventName, handler as EventListener);
    };
  }
}
```

### 可访问性管理

```typescript
// src/core/a11y.ts
export class A11yManager {
  setRole(element: HTMLElement, role: string) {
    element.setAttribute('role', role);
  }

  setAriaLabel(element: HTMLElement, label: string) {
    element.setAttribute('aria-label', label);
  }

  setAriaExpanded(element: HTMLElement, expanded: boolean) {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  manageFocus(element: HTMLElement) {
    // 焦点管理逻辑
  }

  announceToScreenReader(message: string) {
    // 屏幕阅读器通知
  }
}
```

## 组件设计模式

### 1. 组合模式

```typescript
// 复合组件示例
@customElement('lit-select')
export class LitSelect extends LithlessBase {
  @property({ type: Boolean })
  multiple = false;

  @property({ type: Array })
  options: Option[] = [];

  render() {
    return html`
      <lit-select-trigger>
        <lit-select-value></lit-select-value>
        <lit-select-icon></lit-select-icon>
      </lit-select-trigger>
      
      <lit-select-content>
        <lit-select-viewport>
          ${this.options.map(option => html`
            <lit-select-item value=${option.value}>
              ${option.label}
            </lit-select-item>
          `)}
        </lit-select-viewport>
      </lit-select-content>
    `;
  }
}
```

### 2. 控制器模式

```typescript
// 控制器模式示例
export class SelectController {
  private host: LitSelect;
  private isOpen = false;
  private selectedValue: string | null = null;

  constructor(host: LitSelect) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected() {
    this.setupEventListeners();
  }

  hostDisconnected() {
    this.cleanup();
  }

  open() {
    this.isOpen = true;
    this.host.requestUpdate();
  }

  close() {
    this.isOpen = false;
    this.host.requestUpdate();
  }

  select(value: string) {
    this.selectedValue = value;
    this.close();
    this.host.requestUpdate();
  }
}
```

## 样式系统

### CSS 自定义属性

```css
/* 设计令牌 */
:root {
  /* 颜色 */
  --lithless-color-primary: #007bff;
  --lithless-color-secondary: #6c757d;
  --lithless-color-success: #28a745;
  --lithless-color-warning: #ffc107;
  --lithless-color-danger: #dc3545;
  
  /* 尺寸 */
  --lithless-size-sm: 0.875rem;
  --lithless-size-md: 1rem;
  --lithless-size-lg: 1.125rem;
  
  /* 间距 */
  --lithless-spacing-xs: 0.25rem;
  --lithless-spacing-sm: 0.5rem;
  --lithless-spacing-md: 1rem;
  --lithless-spacing-lg: 1.5rem;
  
  /* 圆角 */
  --lithless-radius-sm: 0.125rem;
  --lithless-radius-md: 0.25rem;
  --lithless-radius-lg: 0.5rem;
  
  /* 阴影 */
  --lithless-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --lithless-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --lithless-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
}
```

### 组件样式结构

```css
/* 组件样式示例 */
:host {
  /* 默认样式 */
  display: inline-block;
  position: relative;
  
  /* 可定制属性 */
  --button-bg: var(--lithless-color-primary);
  --button-color: white;
  --button-padding: var(--lithless-spacing-sm) var(--lithless-spacing-md);
  --button-radius: var(--lithless-radius-md);
}

:host([size="small"]) {
  --button-padding: var(--lithless-spacing-xs) var(--lithless-spacing-sm);
}

:host([size="large"]) {
  --button-padding: var(--lithless-spacing-md) var(--lithless-spacing-lg);
}

:host([disabled]) {
  --button-bg: var(--lithless-color-secondary);
  pointer-events: none;
}

button {
  background: var(--button-bg);
  color: var(--button-color);
  padding: var(--button-padding);
  border-radius: var(--button-radius);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
```

## 构建和发布

### 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Lithless',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'Lit'
        }
      }
    }
  }
});
```

### 发布策略

1. **ESM 优先**：主要输出 ES 模块
2. **Tree-shaking**：支持按需导入
3. **类型定义**：完整的 TypeScript 类型
4. **向后兼容**：保持 API 稳定性

## 测试策略

### 单元测试

```typescript
// 组件测试示例
describe('LitButton', () => {
  it('should render with correct text', async () => {
    const element = await fixture(html`<lit-button>Click me</lit-button>`);
    expect(element.textContent).to.equal('Click me');
  });

  it('should emit click event', async () => {
    const element = await fixture(html`<lit-button>Click me</lit-button>`);
    const spy = sinon.spy();
    element.addEventListener('lit-click', spy);
    
    element.click();
    expect(spy).to.have.been.called;
  });
});
```

### 集成测试

```typescript
// 可访问性测试
describe('Accessibility', () => {
  it('should have proper ARIA attributes', async () => {
    const element = await fixture(html`<lit-select></lit-select>`);
    expect(element.getAttribute('role')).to.equal('combobox');
    expect(element.getAttribute('aria-haspopup')).to.equal('listbox');
  });

  it('should support keyboard navigation', async () => {
    const element = await fixture(html`<lit-select></lit-select>`);
    
    // 测试键盘事件
    await sendKeys({ press: 'ArrowDown' });
    expect(element.isOpen).to.be.true;
  });
});
```

## 性能优化

### 1. 懒加载
- 组件按需加载
- 动态导入支持

### 2. 虚拟滚动
- 大数据列表优化
- 内存使用优化

### 3. 事件委托
- 减少事件监听器数量
- 提升性能

### 4. 样式优化
- CSS 变量复用
- 最小化样式计算

## 未来扩展

### 1. 插件系统
- 支持第三方插件
- 扩展组件功能

### 2. 主题系统
- 多主题支持
- 动态主题切换

### 3. 国际化
- 多语言支持
- 本地化配置

### 4. DevTools
- 开发者工具
- 调试支持

## 总结

Lithless 的架构设计注重模块化、可扩展性和性能，通过标准化的 Web Components 实现，为开发者提供了一个强大且灵活的 Headless UI 组件库。设计遵循现代前端开发的最佳实践，确保了组件的质量和可维护性。