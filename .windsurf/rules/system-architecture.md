---
trigger: always_on
description:
globs:
---

# Life Toolkit 系统架构规则

## 🏗️ 项目概述

Life Toolkit 是一个基于 **Monorepo** 架构的全栈生活管理工具套件，采用现代化技术栈构建，旨在提供个人成长、任务管理、习惯追踪、财务管理等功能的一站式解决方案。

## 📁 项目结构

### 根目录架构

```
life-toolkit/
├── apps/                    # 应用层
│   ├── server/             # NestJS 后端服务
│   ├── web/                # React Web 应用
│   └── desktop/                 # Electron 桌面应用
├── packages/               # 共享包
│   ├── business/           # 业务域包（前后端共享的业务定义与实现）
│   │   ├── api/            # API 接口/DTO/类型定义
│   │   ├── server/         # 业务核心（实体/仓储/服务/映射）
│   │   ├── web/            # Web 业务 UI（页面/组件/路由）
│   │   ├── vo/             # 值对象
│   │   └── enum/           # 枚举
│   ├── common/             # 通用工具
│   ├── common-web/         # Web 通用组件
│   └── components/         # 可复用组件
├── .cursor/                # Cursor IDE 配置
│   └── rules/              # 代码生成规则
└── 配置文件...
```

## 🎯 技术栈

### 后端技术栈 (apps/server)

- **框架**: NestJS (Node.js)
- **数据库**: TypeORM + MySQL/SQLite
- **认证**: JWT + bcrypt
- **调度**: @nestjs/schedule
- **AI集成**: OpenAI API
- **文件处理**: xlsx, ical-generator
- **开发工具**: TypeScript, Jest

### 前端技术栈 (apps/web)

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI库**: Arco Design + Ant Design
- **状态管理**: Redux + Nanostores
- **路由**: React Router v6
- **图表**: BizCharts + ECharts
- **样式**: Less + TailwindCSS
- **工具库**: lodash-es, dayjs, date-fns

### 桌面应用 (apps/desktop)

- **框架**: Electron
- **构建工具**: electron-vite
- **打包**: electron-builder
- **开发语言**: TypeScript

## 🏛️ 系统架构

### 分层架构

```
┌─────────────────────────────────────┐
│           前端应用层                 │
│  ┌─────────────┐  ┌─────────────┐   │
│  │  Web App    │  │  PC App     │   │
│  │  (React)    │  │ (Electron)  │   │
│  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           共享包层                   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ VO  │ │ API │ │组件 │ │工具 │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           后端服务层                 │
│  ┌─────────────────────────────────┐ │
│  │        NestJS Server           │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐      │ │
│  │  │业务 │ │认证 │ │AI   │      │ │
│  │  │模块 │ │模块 │ │模块 │      │ │
│  │  └─────┘ └─────┘ └─────┘      │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           数据存储层                 │
│  ┌─────────────┐  ┌─────────────┐   │
│  │   MySQL     │  │   SQLite    │   │
│  │  (生产环境)  │  │  (开发环境)  │   │
│  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────┘
```

## 🔧 业务模块架构

### 后端核心域实现 (packages/business/server/src)

```
business/
├── growth/                 # 个人成长模块
│   ├── todo/
│   ├── task/
│   ├── goal/
│   ├── habit/
│   └── track-time/
├── expenses/              # 财务管理模块
├── users/                 # 用户管理模块
├── auth/                  # 认证授权模块
├── ai/                    # AI 服务模块
├── calendar/              # 日历模块
└── excel/                 # Excel 处理模块
```

### 后端适配层（控制器/模块）(apps/server/src/business)

- 作为 Nest 控制器与模块适配层，导入 `@true-north/business-server` 的实体/服务/仓储。
- 负责路由、鉴权、参数校验与请求/响应包装，业务逻辑在 `packages/business/server` 中实现。

### 前端页面模块 (packages/business/web/src/pages)

```
pages/
├── growth/                # 个人成长页面
├── expense/               # 财务管理页面
├── ai/                    # AI 助手页面
├── timer/                 # 计时器页面
├── dashboard/             # 仪表板页面
├── user/                  # 用户中心页面
├── login/                 # 登录页面
└── ...                    # 其他功能页面
```

apps/web 仅作为宿主入口，通过 `apps/web/src/main.tsx` 引入 `@true-north/business-web` 的 `LifeToolkitApp`。

## 📦 包管理架构

### Monorepo 管理

- **包管理器**: pnpm (workspace)
- **构建工具**: Turbo
- **版本管理**: workspace:\* 内部依赖

### 共享包设计

```
packages/
├── business/              # 业务域包
│   ├── api/               # API 接口/DTO/类型定义
│   ├── server/            # 业务核心（实体/仓储/服务/映射）
│   ├── web/               # Web 业务 UI（页面/组件/路由）
│   ├── vo/                # 值对象 (Value Objects)
│   └── enum/              # 业务枚举
├── common/                 # 通用工具
├── common-web/             # Web 通用组件
└── components/             # 可复用组件
```

## 🔄 数据流架构

### 标准业务模块结构

后端核心域结构 (packages/business/server/src/{module})

```
{module}/
├── entities/              # 数据实体 (TypeORM)
├── dto/                   # DTO 类包含内置映射方法
├── {module}.repository.ts # 仓储
└── {module}.service.ts    # 业务服务
```

后端适配层结构 (apps/server/src/business/{module})

```
{module}/
├── {module}.controller.ts # 控制器
└── {module}.module.ts     # 模块定义
```

### 数据流向

```
Client Request
    ↓
Controller (验证 + 路由)
    ↓
Service (业务逻辑)
    ↓
Repository (数据访问)
    ↓
Database (数据存储)
    ↓
Entity → DTO → VO
    ↓
Client Response
```

## 🛠️ 开发工具链

### 构建和部署

- **开发服务**: `pnpm dev` (Turbo 并行启动)
- **构建**: `pnpm build` (Turbo 优化构建)
- **部署**: 独立的部署脚本
- **代码质量**: ESLint + Prettier + Husky

### 开发环境

- **IDE**: Cursor (AI 辅助开发)
- **调试**: NestJS Debug + React DevTools
- **测试**: Jest (单元测试 + 集成测试)
- **API文档**: 自动生成 (计划中)

## 🔐 安全架构

### 认证授权

- **JWT Token**: 无状态认证
- **密码加密**: bcrypt 哈希
- **权限控制**: 基于角色的访问控制 (计划中)

### 数据安全

- **输入验证**: class-validator
- **SQL注入防护**: TypeORM 参数化查询
- **XSS防护**: 前端输入过滤

## 📊 数据架构

### 数据库设计原则

- **实体关系**: TypeORM 装饰器定义
- **字段类型**: 标准化字段类型映射
- **索引策略**: 基于查询模式优化
- **数据迁移**: TypeORM Migration

### 数据模型规范

```typescript
// 实体定义示例
@Entity()
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  @IsString()
  title: string;

  @Column('boolean', { default: false })
  @IsBoolean()
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
```

## 🚀 性能优化

### 前端优化

- **代码分割**: Vite 动态导入
- **组件懒加载**: React.lazy + Suspense
- **状态管理**: 精细化状态更新
- **缓存策略**: 浏览器缓存 + 内存缓存

### 后端优化

- **数据库优化**: 索引 + 查询优化
- **缓存策略**: 内存缓存 (计划中)
- **异步处理**: 队列 + 调度任务
- **API优化**: 分页 + 字段筛选

## 📱 跨平台支持

### 多端适配

- **Web**: 响应式设计 + PWA (计划中)
- **Desktop**: Electron 跨平台
- **Mobile**: Web 移动端适配

### 数据同步

- **实时同步**: WebSocket (计划中)
- **离线支持**: Service Worker (计划中)
- **冲突解决**: 时间戳 + 版本控制 (计划中)

## 🔮 扩展性设计

### 模块化架构

- **插件系统**: 动态模块加载 (计划中)
- **主题系统**: 可配置 UI 主题
- **国际化**: i18n 多语言支持 (计划中)

### API 设计

- **RESTful**: 标准 REST API
- **GraphQL**: 灵活查询 (计划中)
- **版本控制**: API 版本管理

## 📋 开发规范

### 代码规范

- **命名约定**: camelCase + PascalCase
- **文件组织**: 功能模块化组织
- **注释规范**: JSDoc + 业务注释
- **类型安全**: 严格 TypeScript 模式

### Git 工作流

- **分支策略**: Feature Branch + Main
- **提交规范**: Conventional Commits
- **代码审查**: Pull Request 流程
- **自动化**: Husky 预提交检查
