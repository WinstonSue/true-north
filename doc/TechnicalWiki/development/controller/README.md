# RouteController 层开发规范总览

## 概述

Desktop 应用中，**RouteController** 是 render 与 service 之间的 IPC/路由边界：接收 VO，转换为 DTO，调用 Service，再导出 VO 返回。

```
render（web-service / IPC）
    ↓ VO
RouteController（DTO import / export）
    ↓
Service → Repository → SQLite
    ↓ VO
render
```

## 位置与命名

- 路径：`apps/desktop/src/service/growth/{module}/{module}.route-controller.ts`
- 装饰器：`@Controller`、`@Get`、`@Post` 等（`packages/business/web-service/controller`）
- 参考：`apps/desktop/src/service/growth/todo/todo.route-controller.ts`

## 职责

| 层级 | 职责 |
| --- | --- |
| **RouteController** | 路由定义、VO↔DTO 转换、调用 Service、组装分页响应 |
| **Service** | 业务规则、事务、调用 Repository |
| **Repository** | TypeORM 查询与持久化 |

RouteController **不**承载复杂业务规则；校验与领域逻辑放在 Service。

## 文件结构

```
apps/desktop/src/service/growth/{module}/
├── {module}.route-controller.ts
├── {module}.service.ts
├── {module}.repository.ts
├── {module}.entity.ts
├── dto/
└── index.ts
```

## 开发步骤

1. 在 `packages/business/vo` 定义或扩展 VO 类型
2. 编写 Entity 与 DTO（含 `import*Vo` / `exportVo`）
3. 实现 Repository、Service
4. 实现 RouteController 并注册路由
5. 在 render 通过 web-service 调用

## 详细规范

- [controller-desktop.md](./controller-desktop.md)

## 相关文档

- [../workflow.md](../workflow.md)
- [../../architecture/data-flow.md](../../architecture/data-flow.md)
