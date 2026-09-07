# DeepSeek Harness 技术栈摘要

## 概述
DeepSeek Harness (`dsh`) 是一个开源的智能体框架，采用 **"一切皆插件"** 的架构设计，基于 [Cordis](https://github.com/cordiverse/cordis) 构建。

## 核心技术栈

### 编程语言
- **TypeScript** (ESM 模式，`"type": "module"`)
- **Node.js** 运行时：`^22.19.0 || >=24.0.0`

### 包管理器
- **pnpm** `11.7.0` (workspaces 支持)

### 构建工具
| 工具 | 用途 |
|------|------|
| **TypeScript (tsc)** | 类型检查和编译 |
| **tsx** | 直接运行 TypeScript 脚本 |
| **tsdown** | 打包输出 `lib/` 目录 |
| **Vite** | Web 前端构建 |

### 测试框架
- **Vitest** `^4.1.8` (单元测试、快照测试、覆盖率)
- **@vitest/coverage-v8** (代码覆盖率)
- **jsdom** (DOM 模拟)
- **fast-check** (属性测试)

### 代码质量
| 工具 | 用途 |
|------|------|
| **oxlint** | 代码 lint 检查 |
| **publint** | 包发布质量检查 |
| **jscpd** | 代码重复检测 |
| **lefthook** | Git hooks 管理 |

### 框架架构
- **Cordis** - 插件化框架，支持服务贡献、类型化事件和可逆效果
- **Profile + Bundle** 机制 - 分层组合和配置管理

### 关键依赖
- **execa** - 子进程执行
- **js-yaml** - YAML 解析
- **lightningcss** - CSS 处理
- **mermaid** - 图表生成

## 项目结构
```
deepseek-harness/
├── packages/          # 核心包 (54个模块)
│   ├── core/         # 会话、系统提示、工具、智能体
│   ├── llm/          # LLM 适配器
│   ├── web/          # Web 能力
│   ├── session/      # 会话持久化
│   └── ...           # 其他功能模块
├── vendor/           # 第三方依赖源码
├── apps/             # 应用入口
├── docs/             # 文档
└── scripts/          # 构建和验证脚本
```

## 开发命令
```bash
pnpm install          # 安装依赖
pnpm run build        # 构建项目
pnpm run test         # 运行测试
pnpm run test:coverage # 覆盖率检查
pnpm run typecheck    # 类型检查
pnpm run lint         # 代码 lint
pnpm dsh web          # 启动 Web UI
```

## 技术特点
1. **纯 ESM** - 所有模块使用 ES Module
2. **严格类型** - `strict: true` + `noImplicitAny`
3. **插件化架构** - 所有功能通过插件提供
4. **事件驱动** - 使用声明合并的类型化事件
5. **多平台支持** - Linux、macOS、Windows

---
*文档版本: 1.0*
*创建时间: $(date)*
*作者: tester (badge-test team)*
