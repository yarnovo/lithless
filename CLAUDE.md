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

### 分阶段实现计划（2025年7月31日更新版 - 基于 shadcn/ui 50+ 组件对标）

#### ✅ 第一阶段 (MVP) - 基础表单组件【已完成】
- [x] Button - 基础按钮组件
- [x] Checkbox - 复选框组件（支持中间状态）
- [x] RadioGroup - 单选框组组件
- [x] Switch - 开关组件

#### ✅ 第二阶段 - 选择器组件【已完成】
- [x] Select - 下拉选择器
- [x] Combobox - 组合框（可搜索下拉）

#### ✅ 第三阶段 - 基础架构组件【已完成】
- [x] VirtualScroll - 虚拟滚容器（2025-07-30 完成）
- [x] Popover - 弹出框组件（其他浮层组件的基础）✅
- [x] Portal - 传送门组件（处理 z-index 和定位）✅ (2025-07-30 完成)

#### ✅ 第四阶段 - 交互反馈组件【部分完成】
- [x] Modal/Dialog - 模态框组件 ✅ (2025-07-30 完成)
- [x] Tooltip - 工具提示组件 ✅ (2025-07-30 完成)
- [x] Toast/Notification - 通知提示组件 ✅
- [ ] **Progress** - 进度条组件 (对标 shadcn/ui Progress)
- [ ] **Alert** - 警告提示组件 (对标 shadcn/ui Alert)
- [ ] **Alert Dialog** - 警告对话框 (基于 Modal 扩展)
- [ ] **Skeleton** - 骨架屏组件 (对标 shadcn/ui Skeleton)

#### ✅ 第五阶段 - 菜单导航组件【已完成】
- [x] ContextMenu - 右键菜单组件（基于 Popover）✅
- [x] DropdownMenu - 下拉菜单组件（基于 Popover）✅
- [x] NavigationMenu - 导航菜单组件（基于 Popover）✅
- [x] MenuBar - 菜单栏组件 ✅
- [x] Menu/MenuItem - 基础菜单组件（已重构）✅

#### 📋 第六阶段 - 导航辅助组件【shadcn/ui 对标优先级】
- [ ] **Tabs** - 标签页组件 (对标 shadcn/ui Tabs，高优先级)
- [ ] **Breadcrumb** - 面包屑导航 (对标 shadcn/ui Breadcrumb)
- [ ] **Pagination** - 分页组件 (对标 shadcn/ui Pagination)
- [ ] **Command** - 命令面板组件 (对标 shadcn/ui Command)
- [ ] **Sidebar** - 侧边栏组件 (对标 shadcn/ui Sidebar)

#### 📋 第七阶段 - 数据展示组件【重点对标 shadcn/ui】
- [ ] **Table** - 表格组件 (对标 shadcn/ui Table/Data Table，基于 VirtualScroll2DCore)
- [ ] **Card** - 卡片组件 (对标 shadcn/ui Card，高优先级)
- [ ] **Accordion** - 折叠面板 (对标 shadcn/ui Accordion，高优先级)
- [ ] **Collapsible** - 可折叠组件 (对标 shadcn/ui Collapsible)
- [ ] **Separator** - 分割线 (对标 shadcn/ui Separator)
- [ ] **ScrollArea** - 滚动区域 (对标 shadcn/ui Scroll-area)
- [ ] **Resizable** - 可调整大小面板 (对标 shadcn/ui Resizable)
- [ ] **Avatar** - 头像组件 (对标 shadcn/ui Avatar)
- [ ] **Badge** - 徽标组件 (对标 shadcn/ui Badge)
- [ ] **AspectRatio** - 宽高比容器 (对标 shadcn/ui Aspect Ratio)

#### 📋 第八阶段 - 高级输入组件【shadcn/ui 完整对标】
- [ ] **Input** - 输入框组件 (对标 shadcn/ui Input，基础组件)
- [ ] **Textarea** - 文本域组件 (对标 shadcn/ui Textarea)
- [ ] **Label** - 标签组件 (对标 shadcn/ui Label)
- [ ] **Slider** - 滑块组件 (对标 shadcn/ui Slider)
- [ ] **Toggle** - 切换按钮 (对标 shadcn/ui Toggle)
- [ ] **ToggleGroup** - 切换按钮组 (对标 shadcn/ui Toggle Group)
- [ ] **Calendar** - 日历组件 (对标 shadcn/ui Calendar)
- [ ] **DatePicker** - 日期选择器 (对标 shadcn/ui Date Picker)
- [ ] **InputOTP** - OTP 输入组件 (对标 shadcn/ui Input OTP)
- [ ] **Form** - 表单组件 (对标 shadcn/ui React Hook Form)

#### 📋 第九阶段 - 高级组件与特效【shadcn/ui 高级特性】
- [ ] **Chart** - 图表组件 (对标 shadcn/ui Chart)
- [ ] **Carousel** - 轮播图组件 (对标 shadcn/ui Carousel)
- [ ] **HoverCard** - 悬停卡片 (对标 shadcn/ui Hover Card，基于 Popover)
- [ ] **Sheet** - 抽屉组件 (对标 shadcn/ui Sheet)
- [ ] **Drawer** - 抽屉组件 (对标 shadcn/ui Drawer，与 Sheet 类似)
- [ ] **Typography** - 排版组件 (对标 shadcn/ui Typography)
- [ ] **Sonner** - 高级通知组件 (对标 shadcn/ui Sonner)

### 组件库对标进度总览

#### 🎯 双重对标策略说明
我们的组件库采用双重对标策略：
1. **shadcn/ui 对标** - 确保完整的用户界面组件生态
2. **Radix UI 对标** - 保证底层无头组件的专业级实现

#### 📊 shadcn/ui 对标统计 (截至 2025-07-31)
- **已完成**: 24 个组件 ✅
- **shadcn/ui 总数**: 50+ 个组件  
- **完成率**: 约 48%
- **缺少核心组件**: 26+ 个

#### 📊 Radix UI Primitives 对标统计 (截至 2025-07-31)
- **已完成**: 11 个组件 ✅
- **Radix UI 总数**: 25 个核心组件
- **完成率**: 44%
- **缺少核心组件**: 14 个

#### ✅ 已对标完成的 Radix UI Primitives (11个)
1. **@radix-ui/react-checkbox** ✅ (`lith-checkbox`)
2. **@radix-ui/react-context-menu** ✅ (`lith-context-menu`)
3. **@radix-ui/react-dialog** ✅ (`lith-modal`)
4. **@radix-ui/react-dropdown-menu** ✅ (`lith-dropdown-menu`)
5. **@radix-ui/react-menubar** ✅ (`lith-menu-bar`)
6. **@radix-ui/react-navigation-menu** ✅ (`lith-navigation-menu`)
7. **@radix-ui/react-popover** ✅ (`lith-popover`)
8. **@radix-ui/react-radio-group** ✅ (`lith-radio-group`)
9. **@radix-ui/react-select** ✅ (`lith-select`)
10. **@radix-ui/react-switch** ✅ (`lith-switch`)
11. **@radix-ui/react-toast** ✅ (`lith-toast`)
12. **@radix-ui/react-tooltip** ✅ (`lith-tooltip`)

#### ⚡ 缺失的高优先级 Radix UI Primitives (14个)
1. **@radix-ui/react-accordion** - 折叠面板 (shadcn/ui Accordion)
2. **@radix-ui/react-alert-dialog** - 警告对话框 (shadcn/ui Alert Dialog)
3. **@radix-ui/react-avatar** - 头像组件 (shadcn/ui Avatar)
4. **@radix-ui/react-collapsible** - 可折叠组件 (shadcn/ui Collapsible)
5. **@radix-ui/react-form** - 表单组件 (shadcn/ui Form)
6. **@radix-ui/react-hover-card** - 悬停卡片 (shadcn/ui Hover Card)
7. **@radix-ui/react-label** - 标签组件 (shadcn/ui Label) 🔥
8. **@radix-ui/react-progress** - 进度条 (shadcn/ui Progress) 🔥
9. **@radix-ui/react-scroll-area** - 滚动区域 (shadcn/ui Scroll Area)
10. **@radix-ui/react-separator** - 分割线 (shadcn/ui Separator) 🔥
11. **@radix-ui/react-slider** - 滑块组件 (shadcn/ui Slider)
12. **@radix-ui/react-tabs** - 标签页 (shadcn/ui Tabs) 🔥
13. **@radix-ui/react-toggle** - 切换按钮 (shadcn/ui Toggle)

#### ✅ shadcn/ui 独有组件 (我们已实现，但 Radix UI 无对应组件)
1. **Button** ✅ (`lith-button`) - 基础按钮
2. **Combobox** ✅ (`lith-combobox`) - 组合框

#### ⏳ 综合优先级最高的缺失组件 (基于 Radix UI + shadcn/ui 双重对标)

**🔥 超高优先级 (立即实现)**
1. **Label** - @radix-ui/react-label (表单可访问性基础) 
2. **Tabs** - @radix-ui/react-tabs (导航核心组件)
3. **Progress** - @radix-ui/react-progress (反馈基础组件)  
4. **Separator** - @radix-ui/react-separator (布局基础组件)

**⚡ 高优先级 (2025年8月)**
5. **Input** - shadcn/ui 独有 (表单基础，无 Radix UI 对应)
6. **Textarea** - shadcn/ui 独有 (表单基础，无 Radix UI 对应)
7. **Accordion** - @radix-ui/react-accordion (数据展示核心)
8. **Alert** - shadcn/ui 独有 (反馈基础，无 Radix UI 对应)

**📋 中等优先级 (2025年9月)**
9. **Card** - shadcn/ui 独有 (布局基础，无 Radix UI 对应)
10. **Avatar** - @radix-ui/react-avatar (用户界面常用)
11. **Toggle** - @radix-ui/react-toggle (表单扩展)
12. **Slider** - @radix-ui/react-slider (输入控件)

#### 🎯 下一阶段重点目标 (2025年8月)
- **目标**: 完成 Radix UI 核心缺失组件 (Label, Tabs, Progress, Separator)
- **Radix UI 完成率提升**: 44% → 60%
- **shadcn/ui 完成率提升**: 48% → 56%
- **优势**: 优先实现有 Radix UI 标准的组件，确保专业级无头实现

### 技术债务和重构计划
- **表单验证** - 为所有表单组件添加统一的验证机制 (结合 Form 组件)
- **主题系统** - 实现 CSS 变量主题系统 (参考 shadcn/ui 的主题机制)
- **文档完善** - 为每个组件编写详细的 API 文档和使用指南
- **性能优化** - 优化大数据量场景下的渲染性能
- **可访问性提升** - 对标 shadcn/ui 的 ARIA 实现标准

### 双重对标策略优势与挑战

#### ✅ 战略优势
1. **专业级标准** - Radix UI 提供经过验证的无头组件交互模式
2. **生态兼容性** - shadcn/ui 对标确保与主流生态的 API 一致性
3. **可访问性保证** - Radix UI 的 WAI-ARIA 实现标准确保高质量的可访问性
4. **Web Components 创新** - 用 Lit 3.0 实现 Radix UI 模式，填补市场空白

#### ⚠️ 实现挑战
1. **API 适配** - 需要将 React 特定的 Radix UI API 适配到 Web Components
2. **状态管理** - Radix UI 的复合组件模式需要在 Web Components 中重新设计
3. **事件处理** - React 的合成事件需要转换为原生 DOM 事件
4. **类型定义** - 需要为 Web Components 重新定义 TypeScript 类型

#### 🎯 优先级调整说明 (基于双重对标)
1. **Radix UI 优先** - 有 Radix UI 对应的组件优先实现，确保专业级质量
2. **shadcn/ui 补充** - shadcn/ui 独有组件作为生态补充
3. **核心组件优先** - Label、Tabs 等基础组件优先于装饰性组件
4. **开发者体验** - 提供与两个生态系统都兼容的 API 设计

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