# 文档目录约定

## 命名规范

> [!IMPORTANT]
> 所有交付文档必须遵循以下命名。

- **PRD.md** — Product Requirements Document（产品需求）
- **TDD.md** — Technical Design Document（技术设计）
- **README.md** — 功能说明 / 导航

## 层次结构

### 系统级

```
doc/{system}/
├── README.md       # 文档导航
├── PRD.md          # 系统级产品需求
└── TDD.md          # 系统级技术设计
```

### 模块级

```
doc/{system}/{module}/
├── README.md       # 模块概览（引用 PRD/TDD）
├── PRD.md          # 模块产品需求
└── TDD.md          # 模块技术设计
```

## 内容分工

| 文档类型 | 主要内容 | 目标读者 |
| --- | --- | --- |
| **PRD.md** | 功能需求、业务规则、UI、交互流程 | 产品、设计、测试 |
| **TDD.md** | 数据模型、API/IPC、枚举、实现细节 | 开发、架构 |
| **README.md** | 快速概览、导航 | 所有角色 |

## Wiki 与交付文档

| 层级 | 路径 | 作用 |
| --- | --- | --- |
| 产品 SSOT | [ProductWiki/ProductWiki.md](../../ProductWiki/ProductWiki.md) | 产品架构、业务规范 |
| 技术 SSOT | [TechnicalWiki/TechnicalWiki.md](../TechnicalWiki.md) | 工程架构、代码规范 |
| 版本/系统 | `doc/v0.1.0/`、`doc/{system}/` | 可交付范围的 PRD/TDD |

### Growth 示例（目标结构）

```
doc/growth/
├── README.md
├── PRD.md
├── TDD.md
├── goal/
│   ├── README.md
│   ├── PRD.md
│   └── TDD.md
├── task/
├── todo/
└── habit/
```

当前 Growth 产品蓝图见 [ProductWiki/growth](../../ProductWiki/growth/ProductWiki.md)；版本示例见 [doc/v0.1.0](../../v0.1.0/PRD.md)。

## 写作规范

- [PRD-guide.md](./PRD-guide.md)
- [TDD-guide.md](./TDD-guide.md)
- [ProductWiki-guide.md](./ProductWiki-guide.md)

## 维护原则

- PRD 引用 ProductWiki，不复制全局业务段落
- TDD 引用 TechnicalWiki，不复制全局分层/代码模板全文
- 版本迭代：PRD/TDD → 代码 → 功能入库后回写 Wiki
