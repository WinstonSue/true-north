# Parser 模块重构总结

## 🎯 重构目标

解决原有 parser 目录结构不清晰的问题，让各个模块的职责一目了然。

## 📁 重构前后对比

### 重构前
```
parser/
├── index.ts              # 混乱的导出
├── parser.ts             # 混合了解析和扫描功能
├── parser-ast.ts         # AST 适配层
└── core/
    └── ast.ts            # AST 核心实现
```

### 重构后
```
parser/
├── README.md             # 模块说明文档
├── index.ts              # 清晰的统一导出入口
├── types.ts              # 公共类型定义
├── legacy/               # 传统正则表达式解析器
│   ├── regex-parser.ts   # 正则表达式解析实现
│   └── text-scanner.ts   # 文本扫描工具
└── ast/                  # AST 解析器
    ├── types.ts          # AST 相关类型定义
    ├── ast-parser.ts     # AST 解析核心实现
    └── ast-adapter.ts    # AST 到传统接口的适配层
```

## 🔧 重构内容

### 1. 目录结构重组
- **legacy/** - 传统正则表达式解析器
  - `regex-parser.ts`: 基于正则表达式的解析实现
  - `text-scanner.ts`: 文本扫描和定位工具
- **ast/** - AST 解析器
  - `ast-parser.ts`: 基于 ts-morph 的 AST 解析实现
  - `ast-adapter.ts`: AST 到传统接口的适配层
  - `types.ts`: AST 相关的类型定义

### 2. 职责分离
- **文本扫描** (`text-scanner.ts`): 括号匹配、字符串识别、代码块边界检测
- **正则解析** (`regex-parser.ts`): 基于正则表达式的传统解析逻辑
- **AST 解析** (`ast-parser.ts`): 更准确的 TypeScript 代码解析
- **适配层** (`ast-adapter.ts`): 提供向后兼容的接口

### 3. 类型定义优化
- **公共类型** (`types.ts`): 两种解析器共享的类型定义
- **AST 类型** (`ast/types.ts`): AST 解析器专用的类型定义

### 4. 导出接口清晰化
```typescript
// 传统正则表达式解析器
export { parseClassName as parseClassNameRegex } from './legacy/regex-parser';

// AST 解析器 (推荐)
export { parseClassName } from './ast/ast-adapter';

// 文本扫描工具
export { findMethodBodyOpenBraceIndex } from './legacy/text-scanner';
```

## 🚀 使用指南

### 推荐使用方式
```typescript
import { parseClassName, parseMethodDecorators } from './parser'

// 优先使用 AST 解析器（更准确）
const className = parseClassName(sourceCode)
const methods = parseMethodDecorators(sourceCode)
```

### 回退机制
AST 解析器内置了回退机制，当 AST 解析失败时会自动使用正则表达式解析。

### 直接使用特定解析器
```typescript
// 明确使用正则表达式解析器
import { parseClassNameRegex } from './parser'

// 明确使用 AST 解析器
import { TypeScriptASTParser } from './parser'
const parser = new TypeScriptASTParser()
```

## ✅ 重构收益

1. **结构清晰**: 一眼就能看出各个模块的职责
2. **职责分离**: 解析、扫描、适配各司其职
3. **易于维护**: 模块化设计便于独立维护和测试
4. **向后兼容**: 保持现有 API 不变
5. **扩展性强**: 便于添加新的解析策略

## 🔄 迁移指南

现有代码无需修改，所有导入路径保持不变：
```typescript
// 这些导入方式依然有效
import { parseClassName, parseMethodDecorators } from './parser'
```

如需使用特定的解析器，可以使用新的命名导出：
```typescript
// 明确使用正则表达式解析器
import { parseClassNameRegex } from './parser'

// 明确使用 AST 解析器
import { TypeScriptASTParser } from './parser'
```

## 📝 注意事项

1. AST 解析器是推荐的解析方式，提供更高的准确性
2. 正则表达式解析器作为备选方案，用于兼容性和性能考虑
3. 所有解析器都通过统一的 `index.ts` 导出，便于使用和管理
