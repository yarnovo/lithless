# Checkbox 组件设计调研报告

## 1. 组件概述

Checkbox（复选框）是表单中最基础的输入组件之一，允许用户从一组选项中选择一个或多个选项。作为 Headless UI 组件，我们需要专注于交互逻辑和可访问性，而不涉及具体样式。

## 2. 原生 HTML Checkbox 的局限性

### 2.1 基础功能
原生 `<input type="checkbox">` 提供了基本功能：
- 选中/未选中状态
- disabled 属性
- required 属性
- form 集成

### 2.2 主要局限
1. **不支持中间状态（indeterminate）的声明式设置** - 只能通过 JavaScript 设置
2. **样式定制困难** - 浏览器默认样式难以覆盖
3. **缺少状态变化的钩子** - 需要手动添加事件监听
4. **可访问性支持不完整** - 需要额外的 ARIA 属性
5. **缺少高级交互** - 如键盘导航优化、焦点管理等

## 3. 主流组件库 Checkbox 实现分析

### 3.1 Headless UI (React/Vue)
**特点**：
- 完全无样式
- 支持受控和非受控模式
- 内置键盘导航
- 完整的 ARIA 支持

**API 设计**：
```jsx
<Switch
  checked={enabled}
  onChange={setEnabled}
  className="..."
>
  <span className="sr-only">Enable notifications</span>
</Switch>
```

### 3.2 Radix UI
**特点**：
- 支持 indeterminate 状态
- 自动 ID 管理
- 支持表单集成
- 异步状态支持

**API 设计**：
```jsx
<Checkbox.Root
  checked={checked}
  onCheckedChange={setChecked}
  disabled
  required
>
  <Checkbox.Indicator>
    <CheckIcon />
  </Checkbox.Indicator>
</Checkbox.Root>
```

### 3.3 Ant Design
**特点**：
- 支持 indeterminate 状态
- 内置 label 关联
- 支持 Checkbox.Group
- 完整的事件系统

**API 设计**：
```jsx
<Checkbox
  checked={checked}
  indeterminate={indeterminate}
  onChange={onChange}
  disabled={disabled}
>
  Checkbox Label
</Checkbox>
```

### 3.4 Material-UI
**特点**：
- 支持多种尺寸
- 颜色主题集成
- 图标自定义
- FormControl 集成

**API 设计**：
```jsx
<Checkbox
  checked={checked}
  onChange={handleChange}
  inputProps={{ 'aria-label': 'controlled' }}
  indeterminate={indeterminate}
/>
```

## 4. Web Components 特有考虑

### 4.1 Shadow DOM 影响
- 样式隔离带来的优势和挑战
- 表单参与需要特殊处理（FormAssociated）
- 事件冒泡需要处理

### 4.2 属性 vs 特性
- 布尔属性的反射（checked, disabled, required）
- 自定义属性的处理（indeterminate）

### 4.3 生命周期管理
- connectedCallback 中的初始化
- attributeChangedCallback 中的状态同步
- disconnectedCallback 中的清理

## 5. 核心功能需求

### 5.1 状态管理
1. **三态支持**
   - unchecked（未选中）
   - checked（选中）
   - indeterminate（不确定）

2. **状态持久化**
   - 支持受控模式（由外部管理状态）
   - 支持非受控模式（内部管理状态）

### 5.2 交互功能
1. **鼠标交互**
   - 点击切换状态
   - 禁用状态下无响应

2. **键盘交互**
   - Space 键切换状态
   - Tab 键焦点导航

3. **触摸支持**
   - 移动端友好的点击区域

### 5.3 表单集成
1. **原生表单支持**
   - name 属性
   - value 属性
   - 表单提交参与
   - 表单重置响应

2. **验证支持**
   - required 验证
   - 自定义验证消息

### 5.4 可访问性
1. **ARIA 属性**
   - role="checkbox"
   - aria-checked（true/false/mixed）
   - aria-disabled
   - aria-required
   - aria-invalid
   - aria-describedby

2. **键盘导航**
   - 可聚焦
   - Space 键操作

3. **屏幕阅读器**
   - 状态变化通知
   - 标签关联

## 6. API 设计方案

### 6.1 属性（Attributes/Properties）

```typescript
interface LitCheckboxAttributes {
  // 状态相关
  checked?: boolean;          // 是否选中
  indeterminate?: boolean;    // 不确定状态
  disabled?: boolean;         // 是否禁用
  readonly?: boolean;         // 只读状态
  
  // 表单相关
  name?: string;             // 表单字段名
  value?: string;            // 提交的值（默认 "on"）
  required?: boolean;        // 是否必填
  
  // 标签相关
  label?: string;            // 内置标签文本
  labelPosition?: 'before' | 'after';  // 标签位置
  
  // 验证相关
  validationMessage?: string; // 自定义验证消息
  
  // 样式钩子
  size?: 'small' | 'medium' | 'large';  // 尺寸提示
}
```

### 6.2 事件

```typescript
interface LitCheckboxEvents {
  // 状态变化事件
  'lit-change': CustomEvent<{
    checked: boolean;
    indeterminate: boolean;
  }>;
  
  // 用户交互事件（仅用户操作触发）
  'lit-input': CustomEvent<{
    checked: boolean;
  }>;
  
  // 焦点事件
  'lit-focus': FocusEvent;
  'lit-blur': FocusEvent;
}
```

### 6.3 方法

```typescript
interface LitCheckboxMethods {
  // 程序化控制
  toggle(): void;                    // 切换状态
  check(): void;                     // 设为选中
  uncheck(): void;                   // 设为未选中
  setIndeterminate(value: boolean): void;  // 设置不确定状态
  
  // 表单相关
  reportValidity(): boolean;         // 触发验证
  checkValidity(): boolean;          // 检查有效性
  setCustomValidity(message: string): void;  // 设置自定义验证消息
  
  // 焦点管理
  focus(): void;                     // 聚焦
  blur(): void;                      // 失焦
}
```

### 6.4 插槽（Slots）

```html
<lit-checkbox>
  <!-- 默认插槽：自定义标签内容 -->
  <span>自定义标签内容</span>
  
  <!-- 具名插槽：图标 -->
  <svg slot="icon">...</svg>
  
  <!-- 具名插槽：不确定状态图标 -->
  <svg slot="indeterminate-icon">...</svg>
</lit-checkbox>
```

### 6.5 CSS 自定义属性

```css
lit-checkbox {
  /* 尺寸相关 */
  --lit-checkbox-size: 20px;
  --lit-checkbox-label-gap: 8px;
  
  /* 交互状态 */
  --lit-checkbox-hover-scale: 1.1;
  --lit-checkbox-active-scale: 0.95;
  
  /* 焦点样式 */
  --lit-checkbox-focus-ring-width: 2px;
  --lit-checkbox-focus-ring-offset: 2px;
  
  /* 过渡动画 */
  --lit-checkbox-transition-duration: 200ms;
}
```

## 7. 实现要点

### 7.1 状态管理策略
1. 使用 Lit 的响应式属性系统
2. 区分用户交互和程序化改变
3. 正确处理 indeterminate 状态转换

### 7.2 表单集成实现
1. 继承 FormAssociatedElement
2. 实现 formAssociatedCallback 等生命周期
3. 处理表单提交和重置

### 7.3 可访问性实现
1. 自动生成必要的 ID
2. 正确设置 ARIA 属性
3. 实现键盘事件处理

### 7.4 性能优化
1. 使用 Lit 的优化渲染
2. 避免不必要的重渲染
3. 事件委托优化

## 8. 使用示例

### 8.1 基础用法
```html
<!-- 简单复选框 -->
<lit-checkbox>同意服务条款</lit-checkbox>

<!-- 带名称和值 -->
<lit-checkbox name="agreement" value="terms">
  同意服务条款
</lit-checkbox>
```

### 8.2 受控组件
```html
<lit-checkbox 
  .checked=${this.isChecked}
  @lit-change=${(e) => this.isChecked = e.detail.checked}
>
  记住我
</lit-checkbox>
```

### 8.3 表单集成
```html
<form>
  <lit-checkbox name="subscribe" required>
    订阅新闻通讯
  </lit-checkbox>
  <button type="submit">提交</button>
</form>
```

### 8.4 不确定状态
```html
<lit-checkbox 
  .indeterminate=${this.isPartiallySelected}
  @lit-change=${this.handleSelectAll}
>
  全选
</lit-checkbox>
```

## 9. 测试策略

### 9.1 单元测试
- 状态管理逻辑
- 属性同步
- 事件触发

### 9.2 集成测试
- 表单提交
- 键盘导航
- 焦点管理

### 9.3 可访问性测试
- ARIA 属性正确性
- 键盘操作
- 屏幕阅读器兼容性

### 9.4 浏览器兼容性测试
- 不同浏览器的表现
- Shadow DOM 支持
- 表单集成兼容性

## 10. 总结

通过对主流组件库的分析和 Web Components 特性的考虑，我们设计的 lit-checkbox 组件将：

1. **填补原生 HTML 的不足**：提供 indeterminate 状态、更好的可访问性支持
2. **保持 Headless 理念**：专注于逻辑和交互，不包含具体样式
3. **充分利用 Web Components 优势**：封装性、可重用性、标准化
4. **提供优秀的开发体验**：完整的 TypeScript 支持、直观的 API

下一步将基于此设计方案实现具体的组件代码。