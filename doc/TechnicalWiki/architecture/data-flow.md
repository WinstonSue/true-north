# 数据流与模块结构

## 标准 Growth 模块文件

路径：`apps/desktop/src/service/growth/{module}/`

```
{module}/
├── {module}.entity.ts          # TypeORM 实体
├── dto/
│   ├── index.ts
│   ├── {module}-form.dto.ts    # 创建/更新
│   ├── {module}-model.dto.ts   # 完整模型 + exportVo
│   └── {module}-filter.dto.ts  # 查询/分页
├── {module}.repository.ts
├── {module}.service.ts
├── {module}.route-controller.ts  # VO 边界 + IPC REST 路由（唯一 Controller）
└── index.ts
```

不再维护 `*.controller.ts` IPC 透传层。

## 请求链路

```
render（web-service → api → share-request）
    ↓  VO 入参 / REST path
preload（invoke REST）
    ↓
electron-ipc-restful → RouteController
    ↓  参数 → DTO.import*Vo
Service（业务规则、事务编排）
    ↓
Repository（TypeORM QueryBuilder / save）
    ↓
SQLite
    ↓
Entity → DTO.exportVo() → VO
    ↓
标准响应 { code, message, data } → render
```

## 类型边界

| 类型 | 位置 | 用途 |
| --- | --- | --- |
| **VO** | `packages/business/vo` | 渲染层与 IPC 边界，稳定对外形状 |
| **DTO** | `service/.../dto` | 服务层模型，含 `importVo` / `exportVo` |
| **Entity** | `service/.../*.entity.ts` | 数据库映射 |

数据流方向：

- 入站：`Vo` → `Dto.import*Vo()` → `Entity`（Service 内组装）
- 出站：`Entity` → `Dto` → `Dto.exportVo()` → `Vo`

## RouteController 职责摘要

- 使用 `@business/decorators` 声明 HTTP 风格路径（运行时写入 `electron-ipc-restful` 元数据）
- 接收 VO 查询/Body
- 实例化 DTO 并调用 `importPageVo` / `importCreateVo` 等
- 调用 Service，将结果 `map(exportVo)`
- 返回 `ResponsePageVo` / 单条 VO 等标准响应类型
- 构造器默认注入模块 service 单例，供主进程无参实例化注册

参考实现：`apps/desktop/src/service/growth/todo/todo.route-controller.ts`。

## 安全与校验

- Entity/DTO 字段：`class-validator` 装饰器
- 持久化：TypeORM 参数化查询
- 渲染层：对用户输入做展示层过滤，避免 XSS

## 相关文档

- [development/workflow.md](../development/workflow.md)
- [development/dto/README.md](../development/dto/README.md)
