# Monorepo 布局

## 根目录

```
true-north/
├── apps/
│   └── desktop/              # Electron 宿主
├── packages/
│   ├── business/             # vo、enum、web-service
│   ├── common-web/           # Web 通用能力
│   ├── components/           # mind / repeat
│   ├── plugin-contract/      # 插件契约
│   ├── plugin-sdk/           # 插件运行时
│   ├── plugin-ui/            # 共享 UI
│   ├── plugins/              # growth / expense / inventory / library
│   ├── dev-lab/              # DEV Lab
│   └── product-wiki/         # 宿主 ProductWiki
├── doc/
│   ├── TechnicalWiki/        # 技术 Wiki
│   └── {version}/            # 版本 TDD
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## apps/desktop

```
apps/desktop/src/
├── main/           # Electron 主进程
├── preload/        # preload 脚本
├── plugin/         # 插件宿主、一等插件清单与加载器
├── render/         # React 渲染进程（AI、Workbench、设置、插件壳）
├── dev/            # DEV 宿主
├── service/        # 宿主域（AI、Workflow、browser、users）
└── config/
```

Growth / Expense / Purchase / Library 实现在 `packages/plugins/{id}`。

## packages/business

| 子包 | 职责 |
| --- | --- |
| `vo` | 前后端/IPC 边界类型（`@true-north/vo`） |
| `enum` | 业务枚举（`@true-north/enum`） |
| `web-service` | 渲染层 AI / Workflow / Browser 调用封装 |

主进程装饰器在 `packages/plugin-sdk/src/host/decorators.ts`（`@true-north/plugin-sdk/main`），桥接 `electron-ipc-restful`。

## 包管理

- 包管理器：pnpm，`workspace:*` 引用内部包
- 构建编排：Turbo

## 相关文档

- [overview.md](./overview.md)
- [development/workflow.md](../development/workflow.md)
