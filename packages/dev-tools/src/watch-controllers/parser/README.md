# Controller Parser 模块结构说明

## 📁 目录结构

```
parser/
├── README.md                    # 本说明文档
├── index.ts                     # 统一导出入口
├── legacy/                      # 传统正则表达式解析器
│   ├── regex-parser.ts         # 正则表达式解析实现
│   └── text-scanner.ts         # 文本扫描工具
├── ast/                        # AST 解析器
│   ├── ast-parser.ts           # AST 解析核心实现
│   ├── ast-adapter.ts          # AST 到传统接口的适配层
│   └── types.ts                # AST 相关类型定义
└── types.ts                    # 公共类型定义
```

## 🎯 各模块职责

### 1. legacy/ - 传统正则表达式解析器
- **regex-parser.ts**: 基于正则表达式的解析实现
  - 解析类名、方法名、装饰器等
  - 提供向后兼容的解析功能
- **text-scanner.ts**: 文本扫描和定位工具
  - 括号匹配、字符串识别
  - 代码块边界检测

### 2. ast/ - AST 解析器
- **ast-parser.ts**: 基于 ts-morph 的 AST 解析实现
  - 更准确的 TypeScript 代码解析
  - 支持复杂语法结构
- **ast-adapter.ts**: AST 到传统接口的适配层
  - 将 AST 解析结果转换为现有接口格式
  - 提供回退机制
- **types.ts**: AST 相关的类型定义

### 3. 根目录文件
- **index.ts**: 统一导出入口，提供清晰的 API
- **types.ts**: 公共类型定义，两种解析器共享

## 🔄 解析策略

1. **优先使用 AST 解析器**: 更准确、更可靠
2. **回退到正则表达式**: 当 AST 解析失败时的备选方案
3. **接口统一**: 两种解析器提供相同的接口，便于切换

## 📝 使用示例

```typescript
import { parseClassName, parseMethodDecorators } from './parser'

// 解析类名（优先 AST，失败时回退到正则）
const className = parseClassName(sourceCode)

// 解析方法装饰器
const methods = parseMethodDecorators(sourceCode)
```
