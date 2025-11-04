# Target-API 控制器同步架构

## 📋 概述

本模块实现了将 `watch-controllers` 中的 API 同步功能重构到 `target-api` 目录中，采用与 `target-proxy` 相同的架构模式，提供了更加模块化和可维护的 API 控制器同步解决方案。

## 🏗️ 架构设计

### 核心组件

```
target-api/
├── sync-engine.ts      # API 控制器同步引擎
├── diff-engine.ts      # API 控制器差异比对引擎  
├── code-generator.ts   # API 控制器代码生成器
├── cli.ts              # 命令行工具
├── test.ts             # 架构测试脚本
└── README.md           # 文档
```

### 架构特点

1. **职责分离**: 每个组件都有明确的职责
   - `sync-engine`: 统一的同步流程控制
   - `diff-engine`: 专门的差异比对逻辑
   - `code-generator`: 专门的代码生成逻辑

2. **类型安全**: 完整的 TypeScript 类型定义和检查

3. **可扩展性**: 模块化设计，易于扩展和维护

4. **统一接口**: 与 `target-proxy` 保持一致的 API 接口

## 🔧 核心功能

### API 控制器同步引擎 (ControllerApiSyncEngine)

- **同步单个控制器**: `syncController(sourcePath, targetPath, options)`
- **批量同步**: `syncControllers(pairs, options)`
- **差异检查**: `checkController(sourcePath, targetPath, options)`
- **状态检查**: `checkAllControllers()`
- **中间态获取**: `getIntermediateState(filePath, sourceType)`

### API 控制器差异比对 (ControllerApiDiffEngine)

- **方法比对**: 检查方法的存在性和基本属性
- **参数比对**: 比较方法参数的类型和装饰器
- **HTTP 动词比对**: 检查 HTTP 方法的变更
- **路径比对**: 检查 API 路径的变更

### API 控制器代码生成 (ControllerApiCodeGenerator)

- **方法添加**: 生成标准化的 API 方法代码
- **方法移除**: 安全地移除过时的方法
- **方法更新**: 更新已变更的方法
- **参数样式检测**: 自动检测和生成正确的参数类型

## 🚀 使用方法

### 命令行工具

```bash
# 同步所有 API 控制器
node cli.ts sync

# 同步特定控制器
node cli.ts sync todo

# 检查差异（不执行同步）
node cli.ts check

# 干运行模式
node cli.ts sync --dry-run

# 显示详细信息
node cli.ts sync --verbose

# 生成详细报告
node cli.ts sync --report

# 调试中间态
node cli.ts debug /path/to/controller.ts
```

### 编程接口

```typescript
import { createApiSyncEngine } from './sync-engine';

const engine = createApiSyncEngine();

// 同步单个控制器
const result = await engine.syncController(sourcePath, targetPath, {
  dryRun: false,
  verbose: true,
  force: false,
});

// 检查差异
const checkResult = await engine.checkController(sourcePath, targetPath);

// 清理资源
engine.dispose();
```

## 🔄 同步流程

1. **解析源码**: 使用 `SourceAdapter` 解析 Server Controller
2. **解析目标**: 解析现有的 API Controller 结构
3. **差异比对**: 使用 `ControllerApiDiffEngine` 比较差异
4. **生成操作**: 根据差异生成同步操作
5. **应用变更**: 使用 `ControllerApiCodeGenerator` 应用变更

## 📊 API 方法生成规则

### 参数样式检测

- **none**: 无参数方法
- **id**: 只有 ID 参数的方法
- **id+body**: 有 ID 和 Body 参数的方法
- **query**: 查询参数方法
- **body**: 只有 Body 参数的方法

### 类型映射

- **Create 方法**: `${Entity}VO.Create${Entity}Vo`
- **Update 方法**: `${Entity}VO.Update${Entity}Vo`
- **Page 方法**: `${Entity}VO.${Entity}PageFilterVo`
- **List 方法**: `${Entity}VO.${Entity}ListFiltersVo`

### HTTP 方法映射

- `Get` → `get`
- `Post` → `post`
- `Put` → `put`
- `Delete` → `remove`
- `Patch` → `patch`

## 🧪 测试

运行测试脚本验证架构功能：

```bash
node test.ts
```

测试内容包括：
- 控制器对查找
- 中间态解析
- 差异检查
- 干运行同步

## 🔧 配置

### 控制器路径配置

在 `constants.ts` 中配置：
- `SOURCE_BASE`: Server Controller 基础路径
- `API_TARGET_BASE`: API Controller 基础路径

### 支持的控制器

目前硬编码支持以下控制器：
- `todo` (growth/todo)
- `goal` (growth/goal)
- `habit` (growth/habit)
- `task` (growth/task)

## 🚧 已知限制

1. **控制器发现**: 目前使用硬编码的控制器列表，未来可改为自动发现
2. **复杂参数**: 对于复杂的参数类型，可能需要手动调整
3. **装饰器选项**: 暂不支持复杂的装饰器选项同步

## 🔮 未来改进

1. **自动控制器发现**: 基于文件系统自动发现控制器对
2. **更智能的类型推断**: 改进参数类型的自动推断
3. **增量同步**: 支持更细粒度的增量同步
4. **配置文件**: 支持外部配置文件
5. **插件系统**: 支持自定义同步规则

## 📝 与 watch-controllers 的差异

| 特性 | watch-controllers | target-api |
|------|-------------------|------------|
| 架构 | 单一文件混合逻辑 | 模块化分层架构 |
| 类型安全 | 部分类型检查 | 完整 TypeScript 支持 |
| 可测试性 | 难以单元测试 | 易于测试和调试 |
| 可扩展性 | 难以扩展 | 高度可扩展 |
| 错误处理 | 基础错误处理 | 完善的错误处理 |
| 报告功能 | 无 | 详细的同步报告 |

## 🎯 迁移指南

从 `watch-controllers` 迁移到 `target-api`:

1. **停止使用旧的同步命令**
2. **使用新的 CLI 工具**: `node target-api/cli.ts`
3. **验证同步结果**: 使用 `check` 命令验证
4. **更新构建脚本**: 更新 package.json 中的脚本

新架构完全兼容现有的 API 控制器结构，无需修改现有代码。
