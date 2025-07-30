# Lithless 项目记忆文档

## 项目概述与定位

### 项目基本信息
- **项目名称**: Lithless
- **项目类型**: 库/框架类项目 - Web Components 组件库
- **项目描述**: 基于 Web Components 规范的 Headless UI 组件库
- **当前版本**: 0.0.0 (初始开发阶段)
- **许可证**: MIT

### 项目愿景与目标
- **核心目标**: 填补 Web Components 生态系统中 Headless UI 组件的空白
- **设计理念**: Headless 设计，提供无样式但具有完整交互逻辑的组件集合
- **目标用户**: 需要在不同前端框架中使用一致交互逻辑的开发者

## 技术栈与架构

### 核心技术栈
- **主框架**: Lit 3.0 - 现代化的 Web Components 框架
- **语言**: TypeScript 5.0+ - 完整的类型定义和类型安全
- **构建工具**: Vite - 现代化构建工具
- **测试框架**: Vitest + Playwright - 单元测试和端到端测试
- **文档工具**: Storybook - 组件展示和文档生成
- **代码质量**: ESLint + Prettier - 代码规范和格式化

### 项目结构
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
├── stories/             # Storybook 故事
├── REQUIREMENTS.md      # 需求文档
├── ARCHITECTURE.md      # 架构设计文档
└── README.md           # 项目说明
```

## 核心特性与设计原则

### 核心特性
1. **基于 Lit 3.0** - 现代化的 Web Components 框架
2. **TypeScript 支持** - 完整的类型定义和类型安全
3. **Headless 设计** - 无样式，纯逻辑，高度可定制
4. **可访问性优先** - 遵循 WCAG 2.1 AA 标准
5. **框架无关** - 可在任何前端框架中使用
6. **标准合规** - 严格遵循 Web Components 规范

### 设计原则
- **标准化实现** - 基于 Web Components 标准，确保跨框架兼容性
- **专业级质量** - 完整的可访问性支持和测试覆盖
- **开发者友好** - 简洁的 API 和完善的文档

## 开发配置与规范

### 构建配置
- **TypeScript 配置**: 严格模式，支持装饰器和 ES2020
- **Vite 配置**: 库模式构建，外部化 Lit 依赖
- **Storybook 配置**: 支持 Web Components，包含可访问性测试

### 代码规范
- **ESLint 配置**: 基于 TypeScript 推荐规则，集成 Prettier
- **Prettier 配置**: 
  - 使用单引号
  - 行宽 100 字符
  - 2 空格缩进
  - 尾随逗号 (ES5)
  - 使用分号

### 脚本命令
- `npm run dev` - 启动 Storybook 开发模式 (端口 6006)
- `npm run demo` - 构建并启动 demo 预览服务器，会自动选择可用端口
- `npm run build` - 构建生产版本
- `npm run check` - 完整检查 (lint + typecheck + test)
- `npm run test` - 运行测试 (包括 Storybook 测试)
- `npm run storybook` - 启动 Storybook 文档

## 组件命名规范

### 组件前缀
- **前缀**: `lith-` (取自项目名 "lithless" 的前四个字母)
- **格式**: 全小写，使用中划线分隔
- **示例**: `lith-button`, `lith-checkbox`, `lith-radio-group`

### 文件命名规范
- **组件文件**: 使用小写中划线格式，如 `lith-button.ts`
- **故事书文件**: 使用小写中划线格式，如 `button.stories.ts`
- **测试文件**: 使用小写中划线格式，如 `button.test.ts`

### 事件命名规范
- **自定义事件**: 使用 `lith-` 前缀，如 `lith-change`, `lith-input`
- **CSS 自定义属性**: 使用 `--lith-` 前缀，如 `--lith-checkbox-size`

## 组件实现路线图

### 当前实现状态
- **已完成**: 
  - Button 组件 (`lith-button`)
  - Checkbox 组件 (`lith-checkbox`)
  - RadioGroup 组件 (`lith-radio-group` 和 `lith-radio`)
  - Switch 组件 (`lith-switch`)
  - Select 组件 (`lith-select` 和 `lith-option`)
  - Combobox 组件 (`lith-combobox`)
  - VirtualScroll 组件 (`lith-virtual-scroll`) - 虚拟滚动容器
  - Portal 组件 (`lith-portal`) - 传送门组件
  - Popover 组件 (`lith-popover`) - 弹出框组件
  - Modal 组件 (`lith-modal`) - 模态框组件
  - Tooltip 组件 (`lith-tooltip`) - 工具提示组件 🆕
  - Menu 组件 (`lith-menu` 和 `lith-menu-item`) - 基础菜单组件
  - ContextMenu 组件 (`lith-context-menu`) - 右键菜单组件
  - DropdownMenu 组件 (`lith-dropdown-menu`) - 下拉菜单组件
  - NavigationMenu 组件 (`lith-navigation-menu`) - 导航菜单组件
  - MenuBar 组件 (`lith-menu-bar`) - 菜单栏组件
  - Toast 组件 (`lith-toast` 和 `lith-toast-container`) - 轻量级消息提示
  - Notification 组件 (`lith-notification`) - 通知提示组件

### 分阶段实现计划（2025年更新版）

#### ✅ 第一阶段 (MVP) - 基础表单组件【已完成】
- [x] Button - 基础按钮组件
- [x] Checkbox - 复选框组件（支持中间状态）
- [x] RadioGroup - 单选框组组件
- [x] Switch - 开关组件

#### ✅ 第二阶段 - 选择器组件【已完成】
- [x] Select - 下拉选择器
- [x] Combobox - 组合框（可搜索下拉）

#### ✅ 第三阶段 - 基础架构组件【已完成】
- [x] VirtualScroll - 虚拟滚动容器（2025-07-30 完成）
- [x] Popover - 弹出框组件（其他浮层组件的基础）✅
- [x] Portal - 传送门组件（处理 z-index 和定位）✅ (2025-07-30 完成)

#### ✅ 第四阶段 - 交互反馈组件【已完成】
- [x] Modal/Dialog - 模态框组件 ✅ (2025-07-30 完成)
- [x] Tooltip - 工具提示组件 ✅ (2025-07-30 完成)
- [x] Toast/Notification - 通知提示组件 ✅
- [ ] Progress - 进度条组件

#### ✅ 第五阶段 - 菜单导航组件【已完成】
- [x] ContextMenu - 右键菜单组件（基于 Popover）✅
- [x] DropdownMenu - 下拉菜单组件（基于 Popover）✅
- [x] NavigationMenu - 导航菜单组件（基于 Popover）✅
- [x] MenuBar - 菜单栏组件 ✅
- [x] Menu/MenuItem - 基础菜单组件（已重构）✅

#### 📋 第六阶段 - 导航辅助组件
- [ ] Tabs - 标签页组件
- [ ] Breadcrumb - 面包屑导航

#### 📋 第七阶段 - 数据展示组件
- [ ] Table - 表格组件（基于 VirtualScroll2DCore）
- [ ] Tree - 树形组件
- [ ] List - 列表组件（支持虚拟滚动）
- [ ] Accordion - 折叠面板

#### 📋 第八阶段 - 高级输入组件
- [ ] Slider - 滑块组件
- [ ] DatePicker - 日期选择器
- [ ] TimePicker - 时间选择器
- [ ] ColorPicker - 颜色选择器
- [ ] Upload - 文件上传组件

#### 📋 第九阶段 - 布局和实用组件
- [ ] Layout - 布局组件
- [ ] Grid - 网格系统
- [ ] Divider - 分割线
- [ ] Avatar - 头像组件
- [ ] Badge - 徽标组件
- [ ] Tag - 标签组件

### 技术债务和重构计划
- **表单验证** - 为所有表单组件添加统一的验证机制
- **主题系统** - 实现 CSS 变量主题系统
- **文档完善** - 为每个组件编写详细的 API 文档和使用指南
- **性能优化** - 优化大数据量场景下的渲染性能

### 优先级说明
1. **常用组件优先** - Table、Tooltip、Toast 等高频使用的组件将在靠前的阶段实现
2. **渐进式增强** - 先实现基础功能，后续版本再添加高级特性
3. **用户反馈驱动** - 根据用户需求调整组件开发优先级

## 质量保证与测试

### 测试策略
- **单元测试**: 使用 Vitest 进行组件逻辑测试
- **浏览器测试**: 使用 Playwright 进行端到端测试
- **可访问性测试**: 集成在 Storybook 中进行可访问性验证
- **Storybook 测试**: 使用 @storybook/addon-vitest 进行故事测试

### 代码质量检查
- **检查命令**: `npm run check` - 包含 lint + typecheck + test
- **预提交检查**: 使用 husky 和 lint-staged 进行提交前检查
- **持续集成**: 确保所有提交都通过完整的质量检查

### Storybook 9 交互测试 (重要)
- **版本**: 使用 Storybook 9.0.16，`play` 函数是内置功能，不需要单独安装包
- **导入方式**: 
  ```typescript
  import { expect, within, userEvent, fn } from '@storybook/test';
  ```
- **play 函数结构**:
  ```typescript
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // 测试代码
  }
  ```
- **常用 API**:
  - `within(canvasElement)` - 创建查询上下文
  - `canvas.getByRole()`, `canvas.getByText()`, `canvas.getByTestId()` - 查询元素
  - `userEvent.click()`, `userEvent.type()` - 模拟用户交互
  - `expect()` - 断言
  - `fn()` - 创建 mock 函数
- **最佳实践**:
  - 优先使用语义化查询（role, label）而不是 test-id
  - 所有交互和断言都要使用 `await`
  - 使用 `setTimeout` 等待组件渲染完成
  - 对于 Shadow DOM 组件，需要先获取 shadowRoot 再查询内部元素

## 开发环境与依赖管理

### 关键依赖
- **生产依赖**: 
  - lit: ^3.0.0 - 核心 Web Components 框架
  
- **开发依赖**:
  - TypeScript: ^5.0.0 - 类型支持
  - Vite: ^5.0.0 - 构建工具
  - Vitest: ^3.2.4 - 测试框架
  - Storybook: ^9.0.16 - 文档工具
  - ESLint: ^9.31.0 - 代码检查
  - Prettier: ^3.6.2 - 代码格式化

### 开发工作流
1. 本地开发使用 `npm run dev`
2. 代码提交前自动运行 lint 和格式化
3. 使用 Storybook 进行组件文档和测试
4. 通过 `npm run check` 确保代码质量

## 调研与决策记录

### 技术调研文档
- **component-libraries-analysis.md** - 主流组件库组件分析
- **html5-semantic-tags.md** - HTML5 语义标签规范调研
- **implementation-roadmap.md** - 实现路线图

### 架构决策
- 选择 Lit 3.0 作为基础框架，平衡现代化和稳定性
- 采用 Headless 设计理念，专注于逻辑而非样式
- 使用 TypeScript 确保类型安全和开发体验
- 集成 Storybook 提供优秀的文档和测试体验

## 用户偏好与习惯

### 语言偏好
- 回复使用中文
- 文档和注释支持中英文混合

### 工作流程偏好
- 遵循渐进式开发，分阶段实现组件
- 重视代码质量和可访问性
- 优先考虑开发者体验和 API 设计

## 注意事项与最佳实践

### 开发注意事项
1. **可访问性**: 所有组件必须遵循 WCAG 2.1 AA 标准
2. **类型安全**: 充分利用 TypeScript 的类型系统
3. **测试覆盖**: 确保新组件有完整的测试覆盖
4. **文档完整**: 每个组件都需要对应的 Storybook 故事
5. **代码质量检查**: 每次代码修改后必须运行 `npm run check` 确保通过所有检查

### 调试和命令执行最佳实践

**⚠️ 严重警告：阻塞命令处理**

1. **永远不要使用会阻塞的日志命令**:
   - ❌ 错误: `pm2 logs xxx` (会一直阻塞等待新日志)
   - ✅ 正确: `pm2 logs xxx --lines N --no-stream` (获取指定行数后立即退出)
   - ✅ 正确: `timeout 5s pm2 logs xxx --lines N` (设置超时时间)

2. **所有可能阻塞的 Bash 命令必须设置超时**:
   ```bash
   # 使用 timeout 命令设置超时
   timeout 10s some-long-running-command
   ```

3. **日志查看的正确方式**:
   ```bash
   # 查看最近的日志（不阻塞）
   pm2 logs process-name --lines 10 --no-stream
   
   # 或者直接查看日志文件
   tail -n 10 logs/process-error.log
   ```

4. **其他容易阻塞的命令**:
   - `tail -f` → 使用 `tail -n N`
   - `watch` → 使用一次性命令
   - 任何实时监控命令都要谨慎使用

### 代码提交规范
- 使用 husky 和 lint-staged 进行提交前检查
- 确保所有提交都通过 `npm run check` 验证
- 保持提交信息清晰明确

### 项目维护
- 定期更新依赖版本
- 持续改进组件 API 设计
- 收集用户反馈并优化使用体验

### 测试环境最佳实践

1. **使用社区解决方案**:
   - **element-internals-polyfill**: 提供完整的 ElementInternals API polyfill
   - **happy-dom**: 比 JSDOM 更好的 Web Components 支持，替代 JSDOM
   - 这两个工具结合使用，让测试环境更接近真实浏览器

2. **测试配置更新**:
   ```typescript
   // test-setup.ts
   import '@testing-library/jest-dom/vitest';
   import 'element-internals-polyfill';  // 添加 polyfill
   
   // vite.config.ts
   test: {
     environment: 'happy-dom',  // 使用 happy-dom 替代 jsdom
   }
   ```

3. **错误处理最佳实践**:
   - 使用 `} catch {` 而不是 `} catch (e) {` 避免未使用的变量警告
   - TypeScript 类型转换时使用 `as unknown as Type` 处理类型不兼容问题

4. **Web Components 测试注意事项**:
   - slot change 事件可能需要手动触发
   - 键盘事件测试需要确保元素已聚焦
   - 等待所有子组件的 updateComplete

5. **测试策略**:
   - 单元测试（happy-dom）：测试组件行为、事件、表单集成
   - 集成测试（Storybook + Playwright）：测试复杂交互、视觉效果

---

*本文档将随着项目发展持续更新，记录重要的决策和经验教训。*