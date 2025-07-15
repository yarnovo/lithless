# 主流组件库组件分析

## 调研目的

分析主流 UI 组件库的组件构成，为 Lithless 确定核心组件清单提供参考。

## 调研对象

### React 生态
- **Headless UI (React)** - Tailwind 官方 Headless UI 库
- **React Aria** - Adobe 的可访问性组件库
- **Ant Design** - 企业级 UI 组件库
- **Material-UI** - Google Material Design 组件库
- **Chakra UI** - 简单、模块化的组件库

### Vue 生态
- **Headless UI (Vue)** - Tailwind 官方 Vue 版本
- **Element Plus** - 基于 Vue 3 的桌面端组件库
- **Ant Design Vue** - Ant Design 的 Vue 实现
- **Vuetify** - Vue 的 Material Design 组件库

### Web Components 生态
- **Lit** - Google 的 Web Components 库
- **Stencil** - 编译型 Web Components 库
- **Fast** - Microsoft 的 Web Components 库
- **Shoelace** - 高质量的 Web Components 库

## 组件分类统计

### 基础组件 (Foundation Components)

| 组件名称 | Headless UI | React Aria | Ant Design | Material-UI | 说明 |
|---------|-------------|------------|------------|-------------|------|
| Button | ✓ | ✓ | ✓ | ✓ | 基础按钮组件 |
| Input | - | ✓ | ✓ | ✓ | 文本输入框 |
| Link | - | ✓ | ✓ | ✓ | 链接组件 |
| Image | - | ✓ | ✓ | ✓ | 图片组件 |
| Icon | - | ✓ | ✓ | ✓ | 图标组件 |

### 表单组件 (Form Components)

| 组件名称 | Headless UI | React Aria | Ant Design | Material-UI | 优先级 | 说明 |
|---------|-------------|------------|------------|-------------|--------|------|
| Checkbox | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 复选框，支持中间状态 |
| Radio Group | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 单选框组 |
| Select | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 下拉选择器 |
| Combobox | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 可搜索下拉框 |
| Switch/Toggle | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 开关组件 |
| Slider | - | ✓ | ✓ | ✓ | 🔥 高 | 滑块组件 |
| DatePicker | - | ✓ | ✓ | ✓ | 🔶 中 | 日期选择器 |
| TimePicker | - | ✓ | ✓ | ✓ | 🔶 中 | 时间选择器 |
| Upload | - | - | ✓ | ✓ | 🔶 中 | 文件上传 |
| Form | - | ✓ | ✓ | ✓ | 🔶 中 | 表单容器 |
| Field | - | ✓ | ✓ | ✓ | 🔶 中 | 表单字段 |
| Textarea | - | ✓ | ✓ | ✓ | 🔶 中 | 多行文本输入 |

### 导航组件 (Navigation Components)

| 组件名称 | Headless UI | React Aria | Ant Design | Material-UI | 优先级 | 说明 |
|---------|-------------|------------|------------|-------------|--------|------|
| Menu | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 下拉菜单 |
| Tabs | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 标签页 |
| Breadcrumb | - | ✓ | ✓ | ✓ | 🔶 中 | 面包屑导航 |
| Pagination | - | ✓ | ✓ | ✓ | 🔶 中 | 分页器 |
| Steps | - | - | ✓ | ✓ | 🔶 中 | 步骤条 |
| Anchor | - | - | ✓ | - | 🔵 低 | 锚点导航 |

### 反馈组件 (Feedback Components)

| 组件名称 | Headless UI | React Aria | Ant Design | Material-UI | 优先级 | 说明 |
|---------|-------------|------------|------------|-------------|--------|------|
| Dialog/Modal | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 对话框/模态框 |
| Popover | ✓ | ✓ | ✓ | ✓ | 🔥 高 | 弹出框 |
| Tooltip | - | ✓ | ✓ | ✓ | 🔥 高 | 工具提示 |
| Toast | - | ✓ | ✓ | ✓ | 🔥 高 | 消息提示 |
| Alert | - | ✓ | ✓ | ✓ | 🔶 中 | 警告提示 |
| Notification | - | ✓ | ✓ | ✓ | 🔶 中 | 通知提醒 |
| Progress | - | ✓ | ✓ | ✓ | 🔶 中 | 进度条 |
| Spin/Loading | - | - | ✓ | ✓ | 🔶 中 | 加载指示器 |

### 数据展示组件 (Data Display Components)

| 组件名称 | Headless UI | React Aria | Ant Design | Material-UI | 优先级 | 说明 |
|---------|-------------|------------|------------|-------------|--------|------|
| Table | - | ✓ | ✓ | ✓ | 🔥 高 | 表格 |
| List | - | ✓ | ✓ | ✓ | 🔥 高 | 列表 |
| Tree | - | ✓ | ✓ | ✓ | 🔶 中 | 树形控件 |
| Accordion | - | ✓ | ✓ | ✓ | 🔶 中 | 折叠面板 |
| Carousel | - | ✓ | ✓ | ✓ | 🔶 中 | 走马灯/轮播 |
| Card | - | - | ✓ | ✓ | 🔵 低 | 卡片 |
| Avatar | - | - | ✓ | ✓ | 🔵 低 | 头像 |
| Badge | - | - | ✓ | ✓ | 🔵 低 | 徽标数 |
| Tag | - | - | ✓ | ✓ | 🔵 低 | 标签 |
| Timeline | - | - | ✓ | ✓ | 🔵 低 | 时间轴 |

### 布局组件 (Layout Components)

| 组件名称 | Headless UI | React Aria | Ant Design | Material-UI | 优先级 | 说明 |
|---------|-------------|------------|------------|-------------|--------|------|
| Grid | - | ✓ | ✓ | ✓ | 🔶 中 | 网格布局 |
| Layout | - | - | ✓ | ✓ | 🔶 中 | 布局容器 |
| Space | - | - | ✓ | - | 🔵 低 | 间距组件 |
| Divider | - | ✓ | ✓ | ✓ | 🔵 低 | 分割线 |

## 核心发现

### 1. Headless UI 的核心组件

Headless UI 作为我们的主要参考，重点关注以下核心组件：

**必须实现的组件 (🔥 高优先级)**
- Checkbox
- Radio Group  
- Select
- Combobox
- Switch/Toggle
- Menu
- Tabs
- Dialog/Modal
- Popover

**第二优先级组件 (🔶 中优先级)**
- Slider
- Table
- List
- Accordion
- Tooltip
- Alert

### 2. 组件复杂度分析

**简单组件** (状态简单，交互基础)
- Checkbox
- Radio Group
- Switch/Toggle
- Tooltip
- Alert

**中等复杂度** (涉及多状态管理)
- Select
- Menu
- Tabs
- Popover
- Slider

**复杂组件** (复杂状态管理和交互)
- Combobox
- Dialog/Modal
- Table
- DatePicker
- Tree

### 3. Web Components 特殊考虑

**事件处理**
- 需要定义标准的自定义事件
- 支持原生事件冒泡机制
- 提供丰富的事件钩子

**状态管理**
- 内部状态封装
- 外部状态同步
- 支持双向绑定

**样式隔离**
- 使用 Shadow DOM
- 提供 CSS 自定义属性
- 支持主题定制

## 建议的实现路线图

### 第一阶段 (MVP)
1. Checkbox
2. Radio Group
3. Switch/Toggle
4. Select
5. Button (基础实现)

### 第二阶段
1. Menu
2. Tabs
3. Popover
4. Tooltip
5. Combobox

### 第三阶段
1. Dialog/Modal
2. Slider
3. Table
4. List
5. Accordion

### 第四阶段
1. DatePicker
2. Tree
3. Upload
4. Form
5. 其他辅助组件

## 总结

基于主流组件库的分析，Lithless 应该重点关注那些：
1. **有复杂交互逻辑**的组件
2. **原生 HTML 不支持**的功能
3. **可访问性要求高**的组件
4. **在各大组件库中都存在**的核心组件

这些组件构成了现代 Web 应用的基础交互元素，是 Headless UI 组件库的核心价值所在。