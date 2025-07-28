# Checkbox 组件设计文档

## 组件概述

`lith-checkbox` 是一个基于 Web Components 的 Headless UI 复选框组件，提供完整的交互逻辑和可访问性支持，但不包含任何预设样式。

### 设计原则
- **无样式 (Headless)**: 只提供逻辑和行为，样式完全由使用者控制
- **可访问性优先**: 完整支持 ARIA 属性和键盘导航
- **原生表单集成**: 像原生 checkbox 一样参与表单提交
- **灵活可扩展**: 通过插槽和自定义属性支持各种定制需求

## 组件 API

### 属性 (Properties/Attributes)

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `checked` | `boolean` | `false` | 复选框是否选中 |
| `indeterminate` | `boolean` | `false` | 复选框是否处于不确定状态 |
| `disabled` | `boolean` | `false` | 复选框是否禁用 |
| `readonly` | `boolean` | `false` | 复选框是否只读 |
| `required` | `boolean` | `false` | 复选框是否必选（表单验证） |
| `name` | `string` | `''` | 表单字段名称 |
| `value` | `string` | `'on'` | 复选框的值（提交到表单的值） |
| `label` | `string` | `''` | 内置标签文本 |
| `labelPosition` | `'before' \| 'after'` | `'after'` | 标签相对于复选框的位置 |
| `validationMessage` | `string` | `''` | 自定义验证失败消息 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸提示（仅作为 CSS 钩子） |

### 事件

| 事件名 | 类型 | 描述 | 详情 |
|--------|------|------|------|
| `lith-change` | `CustomEvent` | 状态改变时触发 | `detail: { checked: boolean, indeterminate: boolean }` |
| `lith-input` | `CustomEvent` | 用户交互导致状态改变时触发 | `detail: { checked: boolean }` |
| `lith-focus` | `FocusEvent` | 获得焦点时触发 | 标准焦点事件 |
| `lith-blur` | `FocusEvent` | 失去焦点时触发 | 标准焦点事件 |

### 方法

| 方法名 | 签名 | 描述 |
|--------|------|------|
| `toggle()` | `(): void` | 切换选中状态 |
| `check()` | `(): void` | 设置为选中状态 |
| `uncheck()` | `(): void` | 设置为未选中状态 |
| `setIndeterminate()` | `(value: boolean): void` | 设置不确定状态 |
| `focus()` | `(): void` | 聚焦组件 |
| `blur()` | `(): void` | 移除焦点 |
| `checkValidity()` | `(): boolean` | 检查表单验证状态 |
| `reportValidity()` | `(): boolean` | 检查并报告验证状态 |
| `setCustomValidity()` | `(message: string): void` | 设置自定义验证消息 |

### 插槽 (Slots)

| 插槽名 | 描述 | 默认内容 |
|--------|------|----------|
| default | 自定义标签内容 | `label` 属性的值 |
| `icon` | 选中状态的图标 | 无（由使用者提供样式） |
| `indeterminate-icon` | 不确定状态的图标 | 无（由使用者提供样式） |

### CSS 自定义属性

| 属性名 | 默认值 | 描述 |
|--------|--------|------|
| `--lith-checkbox-size` | `20px` | 复选框尺寸 |
| `--lith-checkbox-label-gap` | `8px` | 复选框与标签的间距 |
| `--lith-checkbox-hover-scale` | `1.1` | 悬停时的缩放比例 |
| `--lith-checkbox-active-scale` | `0.95` | 激活时的缩放比例 |
| `--lith-checkbox-focus-ring-width` | `2px` | 焦点环宽度 |
| `--lith-checkbox-focus-ring-offset` | `2px` | 焦点环偏移量 |
| `--lith-checkbox-transition-duration` | `200ms` | 过渡动画时长 |

### CSS 部件 (Parts)

| 部件名 | 描述 |
|--------|------|
| `base` | 组件根元素 |
| `input` | 隐藏的原生 input 元素 |
| `control` | 可视化的复选框容器 |
| `label` | 标签容器 |

## 行为规范

### 状态转换
1. **用户点击行为**:
   - 未选中 → 选中
   - 选中 → 未选中
   - 不确定 → 选中

2. **程序化设置**:
   - 可以设置任意状态组合
   - `indeterminate` 和 `checked` 可以同时为 true

3. **表单重置行为**:
   - 恢复到初始 `checked` 状态
   - `indeterminate` 状态不受表单重置影响

### 键盘交互
- `Space`: 切换选中状态
- `Tab`: 焦点导航
- `Shift+Tab`: 反向焦点导航

### 可访问性
1. **ARIA 属性**:
   - `role="checkbox"`（在不支持的环境中）
   - `aria-checked`: `"true"` | `"false"` | `"mixed"`
   - `aria-disabled`: 当 `disabled` 为 true
   - `aria-required`: 当 `required` 为 true
   - `aria-invalid`: 当验证失败时

2. **焦点管理**:
   - 可通过键盘访问
   - 具有可见的焦点指示器（通过 CSS 自定义）

## 使用示例

### 基础用法
```html
<!-- 简单复选框 -->
<lith-checkbox>同意条款</lith-checkbox>

<!-- 预设选中 -->
<lith-checkbox checked>记住登录状态</lith-checkbox>

<!-- 禁用状态 -->
<lith-checkbox disabled>不可选择的选项</lith-checkbox>
```

### 表单集成
```html
<form id="myForm">
  <lith-checkbox name="terms" required>
    我已阅读并同意服务条款
  </lith-checkbox>
  
  <lith-checkbox name="newsletter" value="yes">
    订阅新闻资讯
  </lith-checkbox>
  
  <button type="submit">提交</button>
</form>
```

### 不确定状态
```html
<!-- 全选复选框 -->
<lith-checkbox 
  id="selectAll"
  indeterminate
>
  全选
</lith-checkbox>

<script>
  const selectAll = document.getElementById('selectAll');
  selectAll.addEventListener('lith-change', (e) => {
    if (e.detail.checked) {
      // 选中所有子项
    } else {
      // 取消选中所有子项
    }
  });
</script>
```

### 自定义样式示例
```css
/* 基础样式 */
lith-checkbox {
  --lith-checkbox-size: 18px;
  --lith-checkbox-label-gap: 12px;
}

/* 自定义复选框外观 */
lith-checkbox::part(control) {
  border: 2px solid #ccc;
  border-radius: 4px;
  background: white;
  width: var(--lith-checkbox-size);
  height: var(--lith-checkbox-size);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 选中状态 */
lith-checkbox[checked]::part(control) {
  background: #007bff;
  border-color: #007bff;
}

/* 选中图标 */
lith-checkbox[checked]::part(control)::after {
  content: '✓';
  color: white;
  font-size: 14px;
}

/* 不确定状态 */
lith-checkbox[indeterminate]::part(control)::after {
  content: '−';
  color: #666;
  font-size: 16px;
}

/* 禁用状态 */
lith-checkbox[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 焦点状态 */
lith-checkbox:focus-within::part(control) {
  outline: var(--lith-checkbox-focus-ring-width) solid #007bff;
  outline-offset: var(--lith-checkbox-focus-ring-offset);
}
```

### 高级用法
```javascript
// 获取组件引用
const checkbox = document.querySelector('lith-checkbox');

// 程序化控制
checkbox.toggle(); // 切换状态
checkbox.check(); // 选中
checkbox.uncheck(); // 取消选中
checkbox.setIndeterminate(true); // 设置不确定状态

// 表单验证
checkbox.setCustomValidity('请勾选此项以继续');
checkbox.reportValidity(); // 显示验证消息

// 监听事件
checkbox.addEventListener('lith-change', (e) => {
  console.log('状态变化:', e.detail);
});

checkbox.addEventListener('lith-input', (e) => {
  console.log('用户操作:', e.detail.checked);
});
```

## 实现要点

### 技术架构
1. **基类**: 继承自 `LitElement` 和 `FormAssociatedMixin`
2. **Shadow DOM**: 使用 Shadow DOM 封装内部结构
3. **响应式**: 利用 Lit 的响应式属性系统

### 关键实现
1. **表单集成**:
   - 实现 `ElementInternals` API
   - 处理表单提交和重置

2. **状态同步**:
   - 属性和特性的双向绑定
   - 内部状态与表单值同步

3. **事件系统**:
   - 区分用户操作和程序化改变
   - 正确的事件冒泡和阻止

4. **可访问性**:
   - 自动 ID 生成和关联
   - ARIA 属性的动态更新

## 测试要求

### 单元测试
- 所有公开方法的功能测试
- 属性变化的响应测试
- 事件触发的正确性测试

### 集成测试
- 表单提交行为
- 键盘导航功能
- 焦点管理

### 可访问性测试
- ARIA 属性正确性
- 键盘操作完整性
- 屏幕阅读器兼容性

### 浏览器兼容性
- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- 移动端浏览器

## 版本计划

### v0.1.0 - 基础功能
- ✅ 基本的选中/未选中状态
- ✅ 点击交互
- ✅ 基础可访问性

### v0.2.0 - 完整功能
- ✅ 不确定状态支持
- ✅ 完整的表单集成
- ✅ 高级可访问性功能

### v0.3.0 - 增强功能
- ⏳ 动画过渡支持
- ⏳ 更多自定义选项
- ⏳ 性能优化