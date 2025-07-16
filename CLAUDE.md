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
- `npm run dev` - 开发模式
- `npm run build` - 构建生产版本
- `npm run check` - 完整检查 (lint + typecheck + test)
- `npm run test` - 运行测试
- `npm run storybook` - 启动 Storybook 文档

## 组件实现路线图

### 当前实现状态
- **已完成**: Button 组件的基础实现
- **进行中**: 项目基础架构和文档完善

### 分阶段实现计划
1. **第一阶段 (MVP)** - 基础组件
   - [x] Button - 基础按钮组件
   - [ ] Checkbox - 复选框组件（支持中间状态）
   - [ ] RadioGroup - 单选框组组件
   - [ ] Switch - 开关组件

2. **第二阶段** - 选择器组件
   - [ ] Select - 下拉选择器
   - [ ] Combobox - 组合框（可搜索下拉）

3. **第三阶段** - 导航组件
   - [ ] Menu - 下拉菜单
   - [ ] Tabs - 标签页组件

4. **第四阶段** - 反馈组件
   - [ ] Modal - 模态框组件
   - [ ] Popover - 弹出框组件
   - [ ] Tooltip - 工具提示组件

5. **第五阶段** - 高级组件
   - [ ] Table - 表格组件
   - [ ] Accordion - 折叠面板
   - [ ] Slider - 滑块组件
   - [ ] DatePicker - 日期选择器

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

### 代码提交规范
- 使用 husky 和 lint-staged 进行提交前检查
- 确保所有提交都通过 `npm run check` 验证
- 保持提交信息清晰明确

### 项目维护
- 定期更新依赖版本
- 持续改进组件 API 设计
- 收集用户反馈并优化使用体验

---

*本文档将随着项目发展持续更新，记录重要的决策和经验教训。*