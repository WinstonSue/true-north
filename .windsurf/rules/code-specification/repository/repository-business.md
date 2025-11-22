---
trigger: model_decision
description: 编写business Repository代码时
globs:
---

# Business Repository Interface 规范

## 📋 概述

Business Repository Interface 是数据访问层的契约定义层，位于 `packages/business/server/src/{module}/` 目录中，负责定义跨平台的数据访问接口规范，确保 Server 和 Desktop 层的实现一致性。

## 🏗️ 基础架构

### 文件结构

```
packages/business/server/src/{module}/
└── {module}.repository.ts     # Repository Interface 定义
```

### 导入规范

```typescript
// 1. 导入相关的 DTO/VO 类型
import { CreateModuleDto, UpdateModuleDto, ModulePageFilterDto, ModuleListFilterDto, ModuleDto } from './dto';

// 2. 导入相关实体（可选，用于类型定义）
import { Module } from './entities';
```

## 📋 Interface 定义规范

### 基础 Repository Interface

```typescript
export interface ModuleRepository {
  // 创建操作
  create(createDto: CreateModuleDto): Promise<ModuleDto>;
  createWithExtras(createDto: CreateModuleDto, extras: Partial<Module>): Promise<ModuleDto>;

  // 查询操作
  findByFilter(filter: ModuleListFilterDto): Promise<ModuleDto[]>;
  page(filter: ModulePageFilterDto): Promise<{
    list: ModuleDto[];
    total: number;
    pageNum: number;
    pageSize: number;
  }>;
  findWithRelations(id: string, relations?: string[]): Promise<ModuleDto>;
  findOneByRelatedAndDate(relatedId: string, date: Date): Promise<ModuleDto | null>;

  // 更新操作
  update(id: string, updateDto: UpdateModuleDto): Promise<ModuleDto>;
  batchUpdate(includeIds: string[], updateDto: UpdateModuleDto): Promise<ModuleDto[]>;

  // 删除操作
  delete(id: string): Promise<boolean>;
  deleteByFilter(filter: ModulePageFilterDto): Promise<void>;
  softDeleteByRelatedIds(relatedIds: string[]): Promise<void>;

  // 特殊业务操作
  complete(id: string): Promise<ModuleDto>;
  abandon(id: string, reason?: string): Promise<ModuleDto>;
}
```

### 扩展 Repository Interface

```typescript
// 对于有特殊业务需求的模块，可以扩展基础接口
export interface ExtendedModuleRepository extends ModuleRepository {
  // 自定义业务方法
  findByCustomCondition(condition: CustomCondition): Promise<ModuleDto[]>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
  getStatistics(filter: StatisticsFilter): Promise<StatisticsResult>;
}
```

## 🎯 设计原则

### 1. 接口单一职责

- 每个 Repository Interface 对应一个业务域
- 方法命名清晰表达具体功能
- 避免接口定义过于复杂

### 2. 类型安全优先

- 使用严格的 TypeScript 类型定义
- 明确区分输入和输出类型
- 充分利用泛型提升代码复用性

### 3. 业务语义明确

- 方法名体现业务意图而非技术实现
- 参数和返回值语义清晰
- 异常情况明确定义

## 📝 方法规范

### 创建方法

```typescript
// 标准创建方法
create(createDto: CreateModuleDto): Promise<ModuleDto>;

// 带额外参数的创建方法（用于处理关联数据、状态等）
createWithExtras(
  createDto: CreateModuleDto,
  extras: Partial<Module>
): Promise<ModuleDto>;
```

### 查询方法

```typescript
// 查询全部（支持过滤条件）
findByFilter(filter: ModuleListFilterDto): Promise<ModuleDto[]>;

// 分页查询
page(filter: ModulePageFilterDto): Promise<{
  list: ModuleDto[];
  total: number;
  pageNum: number;
  pageSize: number;
}>;

// 根据ID查询（支持关联查询）
findWithRelations(id: string, relations?: string[]): Promise<ModuleDto>;

// 特殊条件查询
findOneByRelatedAndDate(relatedId: string, date: Date): Promise<ModuleDto | null>;
```

### 更新方法

```typescript
// 单条更新
update(id: string, updateDto: UpdateModuleDto): Promise<ModuleDto>;

// 批量更新
batchUpdate(
  includeIds: string[],
  updateDto: UpdateModuleDto
): Promise<ModuleDto[]>;
```

### 删除方法

```typescript
// 物理删除
delete(id: string): Promise<boolean>;

// 条件删除
deleteByFilter(filter: ModulePageFilterDto): Promise<void>;

// 软删除（业务删除）
softDeleteByRelatedIds(relatedIds: string[]): Promise<void>;
```

## 🔧 辅助接口定义

### 分页查询相关

```typescript
// 分页过滤器接口
export interface ModulePageFilterDto extends ModuleListFilterDto {
  pageNum?: number;
  pageSize?: number;
  orderBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// 列表过滤器接口
export interface ModuleListFilterDto {
  // 状态过滤
  status?: ModuleStatus;

  // 重要程度过滤
  importance?: number;

  // 关联对象过滤
  relatedId?: string;
  relatedIds?: string[];

  // 关键词搜索
  keyword?: string;

  // 日期范围过滤
  planDateStart?: string;
  planDateEnd?: string;
  doneDateStart?: string;
  doneDateEnd?: string;
  createdDateStart?: string;
  createdDateEnd?: string;
}
```

### 业务相关接口

```typescript
// 关联对象服务相关
export interface ModuleRelatedService {
  create(dto: any): Promise<any>;
  update(id: string, dto: any): Promise<any>;
}

// 统计相关接口
export interface StatisticsFilter {
  startDate?: string;
  endDate?: string;
  groupBy?: string;
}

export interface StatisticsResult {
  total: number;
  completed: number;
  pending: number;
  [key: string]: any;
}
```

## 📊 类型定义规范

### DTO 类型引用

```typescript
// 确保使用正确的 DTO 类型
import {
  CreateModuleDto, // 创建数据传输对象
  UpdateModuleDto, // 更新数据传输对象
  ModuleDto, // 响应数据传输对象
} from './dto';
```

### 实体类型引用

```typescript
// 谨慎使用实体类型，通常只在 extras 参数中使用
import { Module } from './entities';
```

## 🚀 最佳实践

### 1. 接口设计原则

- **单一职责**: 每个接口方法只负责一个明确的业务功能
- **命名规范**: 使用业务术语而非技术术语命名方法
- **参数优化**: 避免过多的方法参数，考虑使用参数对象
- **返回值明确**: 明确定义方法的返回值类型和异常情况

### 2. 类型安全保障

```typescript
// ✅ 推荐：使用具体的类型定义
export interface ModuleRepository {
  findWithRelations(id: string): Promise<ModuleDto>;
  update(id: string, dto: UpdateModuleDto): Promise<ModuleDto>;
}

// ❌ 避免：使用 any 类型
export interface BadRepository {
  findWithRelations(id: any): Promise<any>;
  update(id: any, data: any): Promise<any>;
}
```

### 3. 业务语义表达

```typescript
// ✅ 推荐：体现业务语义
export interface ModuleRepository {
  complete(id: string): Promise<ModuleDto>;
  abandon(id: string, reason?: string): Promise<ModuleDto>;
  postpone(id: string, newDate: Date): Promise<ModuleDto>;
}

// ❌ 避免：技术化命名
export interface BadModuleRepository {
  updateStatus(id: string, status: ModuleStatus): Promise<ModuleDto>;
  setAbandonReason(id: string, reason?: string): Promise<ModuleDto>;
}
```

## ✅ 检查清单

在定义 Repository Interface 时，请确认：

### 基础结构

- [ ] 文件命名符合规范 (`{module}.repository.ts`)
- [ ] 导入了必要的 DTO/VO 类型
- [ ] 接口命名语义清晰 (如: `TaskRepository`, `UserRepository`)

### 方法定义

- [ ] 包含完整的 CRUD 操作方法
- [ ] 每个方法有明确的输入输出类型
- [ ] 异步方法使用 `Promise<T>` 返回类型
- [ ] 批量操作方法参数设计合理

### 类型安全

- [ ] 避免使用 `any` 类型
- [ ] 使用具体的 DTO 类型而非泛型对象
- [ ] 可选参数正确使用 `?` 标记
- [ ] 数组类型使用 `Type[]` 语法

### 业务规范

- [ ] 方法命名体现业务意图
- [ ] 过滤条件定义完整
- [ ] 分页查询接口规范
- [ ] 错误处理考虑周全

## 📝 完整示例

```typescript
// packages/business/server/src/module/module.repository.ts

import { CreateModuleDto, UpdateModuleDto, ModulePageFilterDto, ModuleListFilterDto, ModuleDto } from './dto';
import { Module } from './entities';

export interface ModuleRepository {
  // 创建操作
  create(createDto: CreateModuleDto): Promise<ModuleDto>;
  createWithExtras(createDto: CreateModuleDto, extras: Partial<Module>): Promise<ModuleDto>;

  // 查询操作
  findByFilter(filter: ModuleListFilterDto): Promise<ModuleDto[]>;
  page(filter: ModulePageFilterDto): Promise<{
    list: ModuleDto[];
    total: number;
    pageNum: number;
    pageSize: number;
  }>;
  findWithRelations(id: string, relations?: string[]): Promise<ModuleDto>;
  findOneByRelatedAndDate(relatedId: string, date: Date): Promise<ModuleDto | null>;

  // 更新操作
  update(id: string, updateDto: UpdateModuleDto): Promise<ModuleDto>;
  batchUpdate(includeIds: string[], updateDto: UpdateModuleDto): Promise<ModuleDto[]>;

  // 删除操作
  delete(id: string): Promise<boolean>;
  deleteByFilter(filter: ModulePageFilterDto): Promise<void>;
  softDeleteByRelatedIds(relatedIds: string[]): Promise<void>;

  // 业务特殊操作
  complete(id: string): Promise<ModuleDto>;
  abandon(id: string, reason?: string): Promise<ModuleDto>;
}

export interface ModuleStatisticsService {
  getStatistics(filter: StatisticsFilter): Promise<StatisticsResult>;
}
```

## 📋 相关规范

- [DTO 规范](./dto.mdc) - 数据传输对象定义规范
- [Entity 规范](./entity.mdc) - 数据实体定义规范
- [Server Repository 规范](./repository-server.mdc) - Server 层实现规范
- [Desktop Repository 规范](./repository-desktop.mdc) - Desktop 层实现规范
