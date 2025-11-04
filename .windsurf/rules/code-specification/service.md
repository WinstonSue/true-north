---
trigger: model_decision
description: 编写server Service代码时
globs:
---

# Service 规范

## 📋 概述

本规范定义了 Life Toolkit 项目中业务服务层的标准结构、方法命名、依赖注入、数据处理等规范，确保业务逻辑的一致性、可维护性和可测试性。

## 🏗️ 基础架构

### 1. 服务类结构

```typescript
import { ModuleRepository, RelatedService } from './module.repository';
import { CreateModuleDto, UpdateModuleDto, ModulePageFilterDto, ModuleListFilterDto, ModuleDto } from './dto';
import { ModuleStatus } from '@life-toolkit/enum';

export class ModuleService {
  protected relatedService: RelatedService;
  protected moduleRepository: ModuleRepository;

  constructor(relatedService: RelatedService, moduleRepository: ModuleRepository) {
    this.relatedService = relatedService;
    this.moduleRepository = moduleRepository;
  }
}
```

### 2. 依赖注入规范

- **构造函数注入**: 所有依赖通过构造函数参数注入
- **属性声明**: 使用 `protected` 修饰符声明依赖属性
- **立即赋值**: 在构造函数中立即将参数赋值给属性

## 🎯 方法规范

### 1. 基础 CRUD 方法

#### 创建方法 (create)

```typescript
async create(createDto: CreateModuleDto): Promise<ModuleDto> {
  const module = await this.moduleRepository.create(createDto);

  // 处理关联数据
  if ((createDto as any).relatedConfig) {
    const related = await this.relatedService.create({
      ...(createDto as any).relatedConfig,
      // 同步相关业务字段
      name: (createDto as any).name,
      description: (createDto as any).description,
    });
    await this.moduleRepository.updateRelatedId(
      (module as any).id,
      (related as any).id
    );
  }

  return await this.moduleRepository.findWithRelations((module as any).id);
}
```

#### 查询方法族

```typescript
// 查找所有记录
async findByFilter(filter: ModuleListFilterDto): Promise<ModuleDto[]> {
  return await this.moduleRepository.findByFilter(filter);
}

// 列表查询（可能包含额外处理）
async list(filter: ModuleListFilterDto): Promise<ModuleDto[]> {
  const list = await this.moduleRepository.findByFilter(filter);
  return list;
}

// 分页查询
async page(
  filter: ModulePageFilterDto
): Promise<{ list: ModuleDto[]; total: number; pageNum: number; pageSize: number }> {
  const { list, total, pageNum, pageSize } =
    await this.moduleRepository.page(filter);
  return { list, total, pageNum, pageSize };
}

// 根据ID查找单个记录
async findWithRelations(id: string): Promise<ModuleDto> {
  return await this.moduleRepository.findWithRelations(id);
}
```

#### 更新方法 (update)

```typescript
async update(id: string, updateDto: UpdateModuleDto): Promise<ModuleDto> {
  const module = await this.moduleRepository.update(id, updateDto);

  // 处理关联数据更新
  if ((updateDto as any).relatedConfig) {
    await this.relatedService.update((module as any).id, {
      ...(updateDto as any).relatedConfig,
      // 同步相关业务字段
      name: (updateDto as any).name,
      description: (updateDto as any).description,
    });
  }

  return await this.moduleRepository.findWithRelations(id);
}
```

#### 删除方法 (delete)

```typescript
async delete(id: string): Promise<boolean> {
  return await this.moduleRepository.delete(id);
}
```

### 2. 状态管理方法

#### 状态变更方法

```typescript
async changeStatus(id: string, newStatus: ModuleStatus): Promise<any> {
  const updateDto = new UpdateModuleDto();
  updateDto.status = newStatus;
  updateDto.statusChangedAt = new Date();
  await this.moduleRepository.update(id, updateDto);
}

async markDone(id: string): Promise<any> {
  const updateDto = new UpdateModuleDto();
  updateDto.status = ModuleStatus.DONE;
  updateDto.doneAt = new Date();
  await this.moduleRepository.update(id, updateDto);
}

async markAbandoned(id: string): Promise<any> {
  const updateDto = new UpdateModuleDto();
  updateDto.status = ModuleStatus.ABANDONED;
  updateDto.abandonedAt = new Date();
  await this.moduleRepository.update(id, updateDto);
}

async restore(id: string): Promise<any> {
  const updateDto = new UpdateModuleDto();
  updateDto.status = ModuleStatus.ACTIVE;
  updateDto.doneAt = null as any;
  updateDto.abandonedAt = null as any;
  await this.moduleRepository.update(id, updateDto);
}
```

### 3. 批量操作方法

#### 批量状态变更

```typescript
async batchChangeStatus(params: { includeIds: string[]; status: ModuleStatus }): Promise<any> {
  if (!params?.includeIds?.length) return;

  const updateDto = new UpdateModuleDto();
  updateDto.status = params.status;
  updateDto.statusChangedAt = new Date();
  await this.moduleRepository.batchUpdate(params.includeIds, updateDto);
}
```

#### 按关联ID删除

```typescript
async deleteByRelatedIds(relatedIds: string[]): Promise<void> {
  if (!relatedIds || relatedIds.length === 0) return;
  await this.moduleRepository.softDeleteByRelatedIds(relatedIds);
}
```

## 📊 数据处理规范

### 1. 类型断言使用

```typescript
// 在处理动态字段或关联数据时使用类型断言
if ((createDto as any).relatedConfig) {
  // 处理关联配置
}

// 处理状态变更时间戳
updateDto.doneAt = null as any; // 清除时间戳
```

### 2. DTO 实例化

```typescript
// 创建 DTO 实例进行状态变更
const updateDto = new UpdateModuleDto();
updateDto.status = ModuleStatus.DONE;
updateDto.doneAt = new Date();
```

### 3. 关联数据同步

```typescript
// 同步业务字段到关联对象
const relatedConfig = {
  ...(createDto as any).relatedConfig,
  name: (createDto as any).name,
  description: (createDto as any).description,
  tags: (createDto as any).tags,
};
```

## 🔧 最佳实践

### 1. 方法命名约定

- **基础操作**: `create`, `findByFilter`, `update`, `delete`, `findWithRelations`
- **查询变体**: `list` (简单查询), `page` (分页查询)
- **状态变更**: `markDone`, `markAbandoned`, `restore`
- **批量操作**: `batchChangeStatus`, `deleteByRelatedIds`

### 2. 错误处理原则

- **参数校验**: 在方法开始处校验必要参数
- **空值检查**: 检查数组参数是否为空
- **异常抛出**: 让底层 Repository 处理具体异常

### 3. 性能优化

- **批量操作**: 优先使用批量更新方法
- **关联查询**: 让 Repository 处理关联数据的延迟加载
- **分页查询**: 统一返回分页结果格式

### 4. 数据一致性

- **关联数据**: 创建时同步关联数据
- **状态管理**: 状态变更时清理相关时间戳
- **软删除**: 使用软删除保持数据完整性

## 🚫 禁止事项

1. **不要在 Service 中直接操作 Entity** - 通过 Repository 层访问数据
2. **不要在 Service 中处理 HTTP 请求/响应** - 这是 Controller 的职责
3. **不要在 Service 中进行复杂的业务计算** - 复杂逻辑应拆分到单独的服务
4. **不要忽略关联数据的同步** - 确保关联数据的一致性
5. **不要直接使用 `any` 类型** - 除非处理动态配置或特殊情况

## ✅ 检查清单

在创建或修改 Service 时，请确认以下事项：

### 基础结构

- [ ] 类名符合规范 (PascalCase)
- [ ] 使用了依赖注入模式
- [ ] 导入了必要的 DTO 和枚举
- [ ] 构造函数正确赋值依赖

### 方法实现

- [ ] 实现了标准的 CRUD 方法
- [ ] 查询方法返回正确的 DTO 类型
- [ ] 更新方法处理了关联数据同步
- [ ] 状态变更方法正确更新时间戳

### 数据处理

- [ ] 使用了适当的类型断言
- [ ] DTO 实例化正确
- [ ] 关联数据同步逻辑完整
- [ ] 批量操作有参数校验

### 业务逻辑

- [ ] 状态管理逻辑正确
- [ ] 关联数据创建/更新处理完整
- [ ] 错误情况处理合理

## 📝 完整示例

```typescript
import { ModuleRepository, RelatedService } from './module.repository';
import { CreateModuleDto, UpdateModuleDto, ModulePageFilterDto, ModuleListFilterDto, ModuleDto } from './dto';
import { ModuleStatus } from '@life-toolkit/enum';

export class ModuleService {
  protected relatedService: RelatedService;
  protected moduleRepository: ModuleRepository;

  constructor(relatedService: RelatedService, moduleRepository: ModuleRepository) {
    this.relatedService = relatedService;
    this.moduleRepository = moduleRepository;
  }

  async create(createDto: CreateModuleDto): Promise<ModuleDto> {
    const module = await this.moduleRepository.create(createDto);

    if ((createDto as any).relatedConfig) {
      const related = await this.relatedService.create({
        ...(createDto as any).relatedConfig,
        name: (createDto as any).name,
        description: (createDto as any).description,
        tags: (createDto as any).tags,
      });
      await this.moduleRepository.updateRelatedId((module as any).id, (related as any).id);
    }

    return await this.moduleRepository.findWithRelations((module as any).id);
  }

  async findByFilter(filter: ModuleListFilterDto): Promise<ModuleDto[]> {
    return await this.moduleRepository.findByFilter(filter);
  }

  async page(
    filter: ModulePageFilterDto
  ): Promise<{ list: ModuleDto[]; total: number; pageNum: number; pageSize: number }> {
    const { list, total, pageNum, pageSize } = await this.moduleRepository.page(filter);
    return { list, total, pageNum, pageSize };
  }

  async update(id: string, updateDto: UpdateModuleDto): Promise<ModuleDto> {
    const module = await this.moduleRepository.update(id, updateDto);

    if ((updateDto as any).relatedConfig) {
      await this.relatedService.update((module as any).id, {
        ...(updateDto as any).relatedConfig,
        name: (updateDto as any).name,
        description: (updateDto as any).description,
      });
    }

    return await this.moduleRepository.findWithRelations(id);
  }

  async delete(id: string): Promise<boolean> {
    return await this.moduleRepository.delete(id);
  }

  async findWithRelations(id: string): Promise<ModuleDto> {
    return await this.moduleRepository.findWithRelations(id);
  }

  async deleteByRelatedIds(relatedIds: string[]): Promise<void> {
    if (!relatedIds || relatedIds.length === 0) return;
    await this.moduleRepository.softDeleteByRelatedIds(relatedIds);
  }

  async batchMarkDone(params: { includeIds: string[] }): Promise<any> {
    if (!params?.includeIds?.length) return;
    const updateDto = new UpdateModuleDto();
    updateDto.status = ModuleStatus.DONE;
    updateDto.doneAt = new Date();
    await this.moduleRepository.batchUpdate(params.includeIds, updateDto);
  }

  async markDone(id: string): Promise<any> {
    const updateDto = new UpdateModuleDto();
    updateDto.status = ModuleStatus.DONE;
    updateDto.doneAt = new Date();
    await this.moduleRepository.update(id, updateDto);
  }

  async restore(id: string): Promise<any> {
    const updateDto = new UpdateModuleDto();
    updateDto.status = ModuleStatus.ACTIVE;
    updateDto.doneAt = null as any;
    updateDto.abandonedAt = null as any;
    await this.moduleRepository.update(id, updateDto);
  }
}
```
