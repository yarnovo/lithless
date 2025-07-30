# Lithless

基于 Web Components 规范的 Headless UI 组件库

## 项目概述

Lithless 是一个专注于 Web Components 生态系统的 Headless UI 组件库，旨在填补原生 HTML 不支持或支持不完善的交互组件空白。我们的目标是为开发者提供无样式但具有完整交互逻辑的组件集合。

## 核心特性

- 🚀 **基于 Lit 3.0** - 现代化的 Web Components 框架
- 📦 **TypeScript 支持** - 完整的类型定义和类型安全
- 🎨 **Headless 设计** - 无样式，纯逻辑，高度可定制
- ♿ **可访问性优先** - 遵循 WCAG 2.1 AA 标准
- 🔧 **框架无关** - 可在任何前端框架中使用
- 🌐 **标准合规** - 严格遵循 Web Components 规范

## 设计理念

### 为什么选择 Headless UI？

目前市场上存在优秀的 Headless UI 组件库（如 Tailwind UI 的 Headless UI），但主要集中在 React 和 Vue 生态系统中。Lithless 专注于为 Web Components 提供同等质量的 Headless UI 解决方案。

### 核心价值

1. **填补生态空白** - 为 Web Components 提供完整的 Headless UI 解决方案
2. **标准化实现** - 基于 Web Components 标准，确保跨框架兼容性
3. **专业级质量** - 完整的可访问性支持和测试覆盖
4. **开发者友好** - 简洁的 API 和完善的文档

## 快速开始

### 安装

```bash
npm install lithless
```

### 使用

```javascript
import 'lithless/dist/index.js';
```

```html
<!-- 基础按钮 -->
<lith-button>点击我</lith-button>
<lith-button variant="secondary">次要按钮</lith-button>
<lith-button disabled>禁用按钮</lith-button>

<!-- 复选框 -->
<lith-checkbox checked></lith-checkbox>

<!-- 单选框组 -->
<lith-radio-group value="option1">
  <lith-radio value="option1">选项 1</lith-radio>
  <lith-radio value="option2">选项 2</lith-radio>
</lith-radio-group>

<!-- 开关 -->
<lith-switch checked></lith-switch>
```

## 组件路线图

### ✅ 第一阶段 (MVP) - 基础组件
- [x] **Button** - 基础按钮组件
- [x] **Checkbox** - 复选框组件（支持中间状态）
- [x] **RadioGroup** - 单选框组组件
- [x] **Switch** - 开关组件

### ✅ 第二阶段 - 选择器组件
- [x] **Select** - 下拉选择器
- [x] **Combobox** - 组合框（可搜索下拉）

### 🔄 第三阶段 - 基础交互组件 (重新规划)
- [ ] **Popover** - 弹出框组件 (其他组件的基础)
- [ ] **Modal** - 模态框组件
- [ ] **Tooltip** - 工具提示组件

### 🔄 第四阶段 - 菜单组件系列 (全新设计)
- [ ] **ContextMenu** - 右键菜单组件 (基于 Popover)
- [ ] **DropdownMenu** - 操作菜单组件 (基于 Popover)  
- [ ] **NavigationMenu** - 导航菜单组件 (基于 Popover)
- [ ] **MenuBar** - 菜单栏组件 (桌面应用风格)

### 第五阶段 - 导航组件
- [ ] **Tabs** - 标签页组件
- [ ] **Breadcrumb** - 面包屑导航

### 第六阶段 - 高级组件
- [ ] **Table** - 表格组件
- [ ] **Accordion** - 折叠面板
- [ ] **Slider** - 滑块组件
- [ ] **DatePicker** - 日期选择器

### 🔄 需要重构的组件
- [x] **Menu** - 当前实现更像 Select，将重构为专业的菜单组件系列

## 项目结构

```
lithless/
├── src/
│   ├── components/       # 组件实现
│   │   ├── form/        # 表单组件
│   │   ├── navigation/  # 导航组件
│   │   ├── feedback/    # 反馈组件
│   │   └── data-display/ # 数据展示组件
│   ├── core/            # 核心功能
│   ├── utils/           # 工具函数
│   └── types/           # TypeScript 类型定义
├── demo/                # 演示页面
├── docs/                # 文档
├── research/            # 调研文档
│   ├── component-libraries-analysis.md
│   ├── html5-semantic-tags.md
│   └── implementation-roadmap.md
├── REQUIREMENTS.md      # 需求文档
├── ARCHITECTURE.md      # 架构设计文档
└── README.md           # 项目说明
```

## 开发指南

### 环境准备

```bash
# 克隆项目
git clone https://github.com/your-username/lithless.git
cd lithless

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run check

# 测试
npm test

# 文档
npm run storybook
```

### 技术栈

- **核心框架**: Lit 3.0
- **语言**: TypeScript 5.0+
- **构建工具**: Vite
- **测试框架**: Vitest + Playwright
- **文档工具**: Storybook
- **代码质量**: ESLint + Prettier

## 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

1. **功能开发** - 实现新的组件或功能
2. **Bug 修复** - 修复已知问题
3. **文档改进** - 完善文档和示例
4. **测试补充** - 增加测试覆盖率
5. **性能优化** - 提升组件性能

### 开发流程

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 社区

- **GitHub Issues** - 问题反馈和功能请求
- **GitHub Discussions** - 技术讨论和问答
- **Discord** - 实时交流（敬请期待）

## 致谢

感谢以下项目和社区的启发：

- [Lit](https://lit.dev/) - 现代化的 Web Components 框架
- [Headless UI](https://headlessui.com/) - React/Vue 的 Headless UI 组件库
- [React Aria](https://react-spectrum.adobe.com/react-aria/) - Adobe 的可访问性组件库
- [Web Components 标准](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - W3C Web Components 规范

---

**Lithless** - 让 Web Components 更简单，让 Headless UI 更标准。