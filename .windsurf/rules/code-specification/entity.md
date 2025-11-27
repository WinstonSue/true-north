---
trigger: model_decision
description: 编写server Entity代码时
globs:
---

# Entity 规范

## 📋 概述

本规范定义了 True North 项目中 TypeORM Entity 的标准结构、装饰器使用、验证约束等规范，确保数据模型的一致性、类型安全和数据完整性。

## 🏗️ 基础架构

### 继承结构

```typescript
// 所有业务 Entity 必须继承 BaseEntity
import { BaseEntity } from '@/base/base.entity';

@Entity('table_name')
export class BusinessEntity extends BaseEntity {
  // 业务字段定义
}
```

### 模型分离模式 (推荐)

```typescript
// 对于复杂 Entity，建议使用模型分离模式
export class BusinessModel extends BaseEntity {
  // 基础业务字段定义
}

@Entity('business_table')
export class Business extends BusinessModel {
  // 关联关系和特殊字段定义
}
```

### BaseEntity 提供的基础字段

```typescript
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // 主键 (UUID)

  @CreateDateColumn()
  createdAt: Date; // 创建时间

  @UpdateDateColumn()
  updatedAt: Date; // 更新时间

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date; // 软删除时间
}
```

## 🎯 Entity 定义规范

### 1. 文件命名约定

- **Entity 文件**: `{module}.entity.ts`
- **枚举文件**: `{module}.enum.ts` 或在 entity 文件中定义
- **索引文件**: `index.ts`

### 2. 导入顺序

```typescript
// 1. 基础类
import { BaseEntity } from '../../base/base.entity';

// 2. 枚举和类型
import { ModuleStatus, ModuleType } from '@true-north/enum';

// 3. 关联实体
import { RelatedEntity } from '../related';

// 4. TypeORM 装饰器
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

// 5. 验证装饰器
import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsISO8601 } from 'class-validator';

// 6. 转换装饰器
import { Type } from 'class-transformer';
```

### 3. Entity 装饰器规范

```typescript
// 标准格式：表名使用下划线命名
@Entity('module_name')
export class ModuleName extends BaseEntity {
  // 字段定义
}

// 树形结构实体
@Entity('tree_module')
@Tree('closure-table')
export class TreeModule extends BaseEntity {
  // 字段定义
}

// 复合索引定义
@Entity('indexed_module')
@Index(['field1', 'field2'], { unique: true })
export class IndexedModule extends BaseEntity {
  // 字段定义
}
```

## 📝 字段定义规范

### 1. 字段定义模板

```typescript
/** 字段描述 */
@Column(columnOptions)
@ValidationDecorator()
@TransformDecorator()
fieldName: FieldType;
```

### 2. 字段类型映射表

```typescript
const FIELD_TYPE_MAPPING = {
  // 基础类型
  string: {
    column: "@Column('varchar')",
    validator: '@IsString()',
    transform: null,
    tsType: 'string',
  },
  text: {
    column: "@Column('text', { nullable: true })",
    validator: '@IsString() @IsOptional()',
    transform: null,
    tsType: 'string',
  },
  number: {
    column: "@Column('int', { nullable: true })",
    validator: '@IsNumber() @IsOptional()',
    transform: '@Type(() => Number)',
    tsType: 'number',
  },
  decimal: {
    column: "@Column('decimal', { precision: 10, scale: 2, nullable: true })",
    validator: '@IsNumber() @IsOptional()',
    transform: '@Type(() => Number)',
    tsType: 'number',
  },
  boolean: {
    column: "@Column('boolean', { nullable: true })",
    validator: '@IsBoolean() @IsOptional()',
    transform: '@Type(() => Boolean)',
    tsType: 'boolean',
  },
  date: {
    column: "@Column('date')",
    validator: '@IsISO8601()',
    transform: null,
    tsType: 'Date',
  },
  datetime: {
    column: "@Column('datetime', { nullable: true })",
    validator: '@IsOptional()',
    transform: null,
    tsType: 'Date',
  },
  time: {
    column: "@Column('time', { nullable: true })",
    validator: null,
    transform: null,
    tsType: 'string',
  },
  enum: {
    column: "@Column({ type: 'varchar', length: 20, nullable: true })",
    validator: '@IsEnum(EnumType) @IsOptional()',
    transform: null,
    tsType: 'EnumType',
  },
  array: {
    column: "@Column('simple-array')",
    validator: '@IsArray() @IsString({ each: true })',
    transform: null,
    tsType: 'string[]',
  },
  json: {
    column: "@Column('json', { nullable: true })",
    validator: '@IsOptional()',
    transform: null,
    tsType: 'any',
  },
};
```

### 3. 标准字段示例

#### 字符串字段

```typescript
/** 标题 - 必填字符串 */
@Column("varchar")
@IsString()
title!: string;

/** 描述 - 可选字符串 */
@Column("text", { nullable: true })
@IsString()
@IsOptional()
description?: string;

/** 唯一标识符 */
@Column({ unique: true })
@IsString()
code: string;
```

#### 数字字段

```typescript
/** 重要程度 */
@Column("int", { nullable: true })
@IsNumber()
@IsOptional()
@Type(() => Number)
importance?: number;

/** 紧急程度 */
@Column("int", { nullable: true })
@IsNumber()
@IsOptional()
@Type(() => Number)
urgency?: number;
```

#### 布尔字段

```typescript
/** 激活状态 */
@Column({ default: false })
@IsBoolean()
@Type(() => Boolean)
isActive: boolean = false;

/** 是否完成 */
@Column({ default: false })
@IsBoolean()
@Type(() => Boolean)
isCompleted: boolean = false;
```

#### 枚举字段

```typescript
/** 状态 - 必填 */
@Column({
  type: "varchar",
  length: 20,
  nullable: true,
})
@IsEnum(ModuleStatus)
status!: ModuleStatus;

/** 来源 - 可选 */
@Column({
  type: "varchar",
  length: 20,
  nullable: true,
})
@IsOptional()
source?: ModuleType;
```

#### 日期时间字段

```typescript
/** 计划日期 */
@Column("date")
@IsISO8601()
planDate: Date = new Date();

/** 完成时间 - 可选 */
@Column("datetime", {
  nullable: true,
})
doneAt?: Date;

/** 放弃时间 - 可选 */
@Column("datetime", {
  nullable: true,
})
abandonedAt?: Date;

/** 计划开始时间 - 可选 */
@Column("time", { nullable: true })
planStartTime?: string;

/** 计划结束时间 - 可选 */
@Column("time", { nullable: true })
planEndTime?: string;
```

#### 数组字段

```typescript
/** 标签数组 */
@Column("simple-array", { nullable: true })
@IsArray()
@IsString({ each: true })
@IsOptional()
tags?: string[] = [];

/** JSON 数组 */
@Column("json", { nullable: true })
@IsArray()
@IsOptional()
metadata?: any[];
```

#### 特殊字段

```typescript
/** 邮箱字段 */
@Column({ unique: true })
@IsEmail()
@IsString()
email: string;

/** URL 字段 */
@Column({ nullable: true })
@IsUrl()
@IsString()
@IsOptional()
website?: string;

/** JSON 对象 */
@Column("json", { nullable: true })
@IsOptional()
settings?: Record<string, any>;
```

## 🔗 关联关系规范

### 1. 一对多关系 (OneToMany/ManyToOne)

```typescript
// 子实体 (多对一) - 关联对象
@ManyToOne(() => ParentEntity, (parent) => parent.children, { nullable: true })
@JoinColumn({ name: "parent_id" })
parent?: ParentEntity;

// 子实体 (多对一) - 关联ID
@Column("varchar", { nullable: true })
@IsString()
@IsOptional()
parentId?: string;

// 父实体 (一对多)
@OneToMany(() => ChildEntity, (child) => child.parent, {
  cascade: true,
  eager: false
})
children: ChildEntity[];
```

### 2. 多对多关系 (ManyToMany)

```typescript
// 主控方
@ManyToMany(() => RelatedEntity, { cascade: true })
@JoinTable({
  name: "module_related",
  joinColumn: { name: "module_id", referencedColumnName: "id" },
  inverseJoinColumn: { name: "related_id", referencedColumnName: "id" },
})
relatedEntities: RelatedEntity[];

// 被控方
@ManyToMany(() => ModuleEntity, (module) => module.relatedEntities)
modules: ModuleEntity[];
```

### 3. 一对一关系 (OneToOne)

```typescript
// 主控方
@OneToOne(() => ProfileEntity, { cascade: true })
@JoinColumn({ name: "profile_id" })
profile?: ProfileEntity;

// 被控方
@OneToOne(() => UserEntity, (user) => user.profile)
user?: UserEntity;
```

### 4. 树形结构关系

```typescript
@Entity('tree_node')
@Tree('closure-table')
export class TreeNode extends BaseEntity {
  /** 父节点 */
  @TreeParent({ onDelete: 'CASCADE' })
  parent?: TreeNode;

  /** 子节点 */
  @TreeChildren({ cascade: true })
  children: TreeNode[];

  /** 父节点ID - 冗余字段便于查询 */
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  parentId?: string;
}
```

## 🗄️ 数据库约束规范

### 1. 索引约束

```typescript
// 单列索引
@Index()
@Column()
indexedField: string;

// 复合索引
@Index(["field1", "field2"])
@Entity("table_name")
export class EntityName extends BaseEntity {
  @Column()
  field1: string;

  @Column()
  field2: string;
}

// 唯一索引
@Index({ unique: true })
@Column()
uniqueField: string;

// 复合唯一索引
@Index(["userId", "type"], { unique: true })
@Entity("user_setting")
export class UserSetting extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  type: string;
}
```

### 2. 外键约束

```typescript
// 级联删除
@ManyToOne(() => ParentEntity, { onDelete: "CASCADE" })
parent: ParentEntity;

// 设置为空
@ManyToOne(() => ParentEntity, { onDelete: "SET NULL" })
parent?: ParentEntity;

// 限制删除
@ManyToOne(() => ParentEntity, { onDelete: "RESTRICT" })
parent: ParentEntity;
```

## 📊 枚举定义规范

### 1. 枚举命名约定

```typescript
// 文件: module.enum.ts
export enum ModuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DELETED = 'deleted',
}

export enum ModuleType {
  PERSONAL = 'personal',
  WORK = 'work',
  STUDY = 'study',
  HEALTH = 'health',
}

export enum ModulePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}
```

### 2. 枚举使用规范

```typescript
// 在 Entity 中使用
@Column({
  type: "enum",
  enum: ModuleStatus,
  default: ModuleStatus.ACTIVE,
})
@IsEnum(ModuleStatus)
status: ModuleStatus = ModuleStatus.ACTIVE;
```

## 🔧 最佳实践

### 1. 命名约定

- **Entity 类名**: PascalCase (如: `UserProfile`)
- **表名**: snake_case (如: `user_profile`)
- **字段名**: camelCase (如: `userName`)
- **枚举名**: PascalCase (如: `UserStatus`)
- **枚举值**: snake_case (如: `active`, `inactive`)

### 2. 字段设计原则

- **必填字段**: 使用非空断言操作符 `!` 明确标识
- **可选字段**: 使用 `?` 可选标记，结合 `nullable: true` 和 `@IsOptional()`
- **关联字段**: 同时提供关联对象和关联 ID 字段便于查询
- **枚举字段**: 使用 `varchar` 类型存储，便于扩展和查询
- **时间字段**: 日期使用 `date` 类型，日期时间使用 `datetime` 类型
- **数字字段**: 可选数字字段使用 `nullable: true` 和 `@Type(() => Number)`

### 3. 性能优化

```typescript
// 避免 eager loading，按需加载
@OneToMany(() => ChildEntity, (child) => child.parent, {
  eager: false  // 默认值，显式声明
})
children: ChildEntity[];

// 合理使用索引
@Index(["status", "createdAt"])  // 常用查询条件
@Entity("task")
export class Task extends BaseEntity {
  @Column()
  status: string;
}
```

### 4. 数据完整性

```typescript
// 使用数据库约束保证数据完整性
@Column({ unique: true })  // 唯一约束
@IsEmail()                 // 应用层验证
email: string;

// 外键约束
@ManyToOne(() => User, { onDelete: "CASCADE" })
user: User;
```

## 🚫 禁止事项

1. **不要在 Entity 中包含业务逻辑** - Entity 仅用于数据模型定义
2. **不要使用 `any` 类型** - 应明确定义具体类型
3. **不要忽略验证装饰器** - 所有字段都应有适当的验证
4. **不要使用复杂的计算字段** - 计算逻辑应在 Service 层
5. **不要在 Entity 中直接使用 Date 对象进行格式化** - 格式化在 DTO 中处理

## ✅ 检查清单

在创建或修改 Entity 时，请确认以下事项：

### 基础结构

- [ ] 文件命名符合规范 (`{module}.entity.ts`)
- [ ] 类命名符合规范 (PascalCase)
- [ ] 继承了 BaseEntity
- [ ] 表名使用 snake_case
- [ ] 导入顺序正确

### 字段定义

- [ ] 所有必填字段使用非空断言操作符 `!`
- [ ] 所有可选字段使用 `?` 标记和 `@IsOptional()`
- [ ] 字符串字段使用 `@Column("varchar")`
- [ ] 可选数字字段使用 `nullable: true` 和 `@Type(() => Number)`
- [ ] 可选布尔字段使用 `nullable: true` 和 `@Type(() => Boolean)`
- [ ] 枚举字段使用 `varchar` 类型和 `@IsEnum()`
- [ ] 数组字段使用 `@Column("simple-array")` 和 `@IsArray() @IsString({ each: true })`

### 关联关系

- [ ] 关联关系定义正确
- [ ] 外键约束设置合理
- [ ] 级联操作配置正确
- [ ] 提供了对应的 ID 字段

### 数据库约束

- [ ] 唯一字段添加了 `unique: true`
- [ ] 必要的字段添加了索引
- [ ] 外键约束配置正确
- [ ] 默认值设置合理

### 枚举定义

- [ ] 枚举值使用小写字符串
- [ ] 枚举名称语义清晰
- [ ] 在 Entity 中正确使用枚举

### 性能考虑

- [ ] 避免了不必要的 eager loading
- [ ] 添加了必要的索引
- [ ] 关联关系配置合理

## 📝 完整示例

```typescript
// module.enum.ts
export enum ModuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

export enum ModuleType {
  PERSONAL = 'personal',
  WORK = 'work',
  STUDY = 'study',
}

// module.entity.ts
import { BaseEntity } from '../../base/base.entity';
import { ModuleStatus, ModuleType } from '@true-north/enum';
import { RelatedEntity } from '../related';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class ModuleModel extends BaseEntity {
  /** 标题 - 字符串类型 */
  @Column('varchar')
  @IsString()
  title!: string;

  /** 描述 - 可选字符串 */
  @Column('text', { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  /** 重要程度 - 数字类型 */
  @Column('int', { nullable: true })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  importance?: number;

  /** 状态 - 枚举类型 */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  @IsEnum(ModuleStatus)
  status!: ModuleStatus;

  /** 标签 - 数组类型 */
  @Column('simple-array')
  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  /** 计划日期 - 日期类型 */
  @Column('date')
  @IsISO8601()
  planDate: Date = new Date();

  /** 完成时间 - 可选日期时间 */
  @Column('datetime', {
    nullable: true,
  })
  doneAt?: Date;
}

@Entity('module')
export class Module extends ModuleModel {
  /** 关联对象 - 关联关系 */
  @ManyToOne(() => RelatedEntity, (related) => related.modules, { nullable: true })
  @JoinColumn({ name: 'related_id' })
  related?: RelatedEntity;

  /** 关联ID - 关联字段 */
  @Column('varchar', { nullable: true })
  @IsString()
  @IsOptional()
  relatedId?: string;
}
```
