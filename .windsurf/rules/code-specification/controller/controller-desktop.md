---
trigger: model_decision
description: 编写desktop Controller代码时
globs:
---

# Desktop Adapter Controller 开发规范

## 📋 概述

Desktop Adapter Controller 是Desktop端的适配层，负责将Electron的IPC调用适配到核心业务控制器，是连接桌面应用和业务逻辑的桥梁。

## 🏗️ 职责定位

### 核心职责

- **IPC接口适配**: 处理Electron IPC调用
- **数据格式转换**: 处理Desktop平台的数据格式差异
- **异常转换**: 将业务异常转换为Desktop可处理的格式
- **异步处理**: 处理异步IPC调用的生命周期
- **资源管理**: 管理控制器实例和资源清理

### 设计原则

- **轻量适配**: 只做数据适配，不包含业务逻辑
- **异步友好**: 充分利用Electron IPC的异步特性
- **错误处理**: 完善的错误处理和用户提示
- **性能优化**: 避免阻塞主进程，合理使用Worker线程

## 📁 文件位置

```
apps/desktop/src/database/growth/
├── {module}.controller.ts       # Desktop适配控制器
└── index.ts                     # 模块导出和IPC注册
```

## 🎯 标准模板

### 基础Controller模板

```typescript
import { {Module}Controller } from "@true-north/business-server";
import type { {Module} as {Module}VO } from "@true-north/vo";
import {
  {Module}PageFilterDto,
  {Module}ListFilterDto
} from "@true-north/business-server";

/**
 * {资源名称}Desktop适配控制器
 * 位置: apps/desktop/src/database/growth/{module}.controller.ts
 */
export class {Module}DesktopController {
  constructor(private readonly {module}Controller: {Module}Controller) {}

  /**
   * 创建{资源名称}
   */
  async create(createVo: {Module}VO.Create{Module}Vo): Promise<{Module}VO.{Module}ModelVo> {
    return await this.{module}Controller.create(createVo);
  }

  /**
   * 分页查询{资源名称}列表
   */
  async page(filter: {Module}PageFilterDto): Promise<{Module}VO.{Module}ResponsePageVo> {
    return await this.{module}Controller.page(filter);
  }

  /**
   * 列表查询{资源名称}
   */
  async list(filter: {Module}ListFilterDto): Promise<{Module}VO.{Module}ListVo> {
    return await this.{module}Controller.list(filter);
  }

  /**
   * 查询{资源名称}详情
   */
  async findDetail(id: string): Promise<{Module}VO.{Module}Vo> {
    return await this.{module}Controller.findDetail(id);
  }

  /**
   * 更新{资源名称}
   */
  async update(id: string, updateVo: {Module}VO.Update{Module}Vo): Promise<{Module}VO.{Module}ModelVo> {
    return await this.{module}Controller.update(id, updateVo);
  }

  /**
   * 删除{资源名称}
   */
  async delete(id: string): Promise<void> {
    await this.{module}Controller.delete(id);
  }

  // 状态管理方法
  async abandon(id: string): Promise<{ result: boolean }> {
    return await this.{module}Controller.abandon(id);
  }

  async restore(id: string): Promise<{ result: boolean }> {
    return await this.{module}Controller.restore(id);
  }

  async done(id: string): Promise<{ result: boolean }> {
    return await this.{module}Controller.done(id);
  }

  // 批量操作方法
  async doneBatch(includeIds: string[]): Promise<void> {
    await this.{module}Controller.doneBatch(includeIds);
  }

  async batchDelete(includeIds: string[]): Promise<void> {
    await this.{module}Controller.batchDelete(includeIds);
  }
}

// IPC处理器映射
export const {module}IpcHandlers = {
  'create': (createVo: {Module}VO.Create{Module}Vo) => new {Module}DesktopController().create(createVo),
  'page': (filter: {Module}PageFilterDto) => new {Module}DesktopController().page(filter),
  'list': (filter: {Module}ListFilterDto) => new {Module}DesktopController().list(filter),
  'findDetail': (id: string) => new {Module}DesktopController().findDetail(id),
  'update': (id: string, updateVo: {Module}VO.Update{Module}Vo) => new {Module}DesktopController().update(id, updateVo),
  'delete': (id: string) => new {Module}DesktopController().delete(id),
  'abandon': (id: string) => new {Module}DesktopController().abandon(id),
  'restore': (id: string) => new {Module}DesktopController().restore(id),
  'done': (id: string) => new {Module}DesktopController().done(id),
  'doneBatch': (includeIds: string[]) => new {Module}DesktopController().doneBatch(includeIds),
  'batchDelete': (includeIds: string[]) => new {Module}DesktopController().batchDelete(includeIds),
};
```

### IPC注册模板

```typescript
import { ipcMain } from "electron";
import { {Module}Controller } from "@true-north/business-server";
import { {Module}DesktopController, {module}IpcHandlers } from "./{module}.controller";

/**
 * {资源名称}IPC处理器注册
 * 位置: apps/desktop/src/database/growth/index.ts
 */

// 创建核心控制器实例
const {module}Controller = new {Module}Controller(/* dependencies */);

// 创建Desktop适配器实例
const {module}DesktopController = new {Module}DesktopController({module}Controller);

// 注册IPC处理器
export function register{Module}IpcHandlers() {
  Object.entries({module}IpcHandlers).forEach(([channel, handler]) => {
    ipcMain.handle(`{module}:${channel}`, async (event, ...args) => {
      try {
        return await handler(...args);
      } catch (error) {
        console.error(`{Module} IPC error:`, error);
        throw error; // 让渲染进程处理错误
      }
    });
  });
}

// 导出处理器用于清理
export const {module}Handlers = {module}IpcHandlers;
```

## 📝 使用指南

### 占位符替换规则

- `{Module}` → 模块名，如：`Todo`, `Goal`, `Habit`
- `{module}` → 模块名小写，如：`todo`, `goal`, `habit`
- `{资源名称}` → 中文资源名，如：`待办事项`, `目标`, `习惯`

### 导入路径说明

```typescript
// Desktop适配层使用包路径导入核心业务控制器
import { {Module}Controller } from "@true-north/business-server";
import type { {Module} as {Module}VO } from "@true-north/vo";

// Electron IPC
import { ipcMain } from "electron";
```

### IPC通道命名规范

```typescript
// 推荐的IPC通道命名格式
ipcMain.handle('{module}:{action}', handler);

// 示例
ipcMain.handle('todo:create', createHandler);
ipcMain.handle('todo:page', pageHandler);
ipcMain.handle('todo:delete', deleteHandler);
```

## 🔍 最佳实践

### 1. 异步处理优化

```typescript
// ✅ 推荐做法 - 充分利用异步特性
export class TodoDesktopController {
  async create(createVo: TodoVO.CreateTodoVo): Promise<TodoVO.TodoWithoutRelationsVo> {
    // 直接返回Promise，让Electron处理异步
    return await this.todoController.create(createVo);
  }
}

// ❌ 避免的做法 - 阻塞主进程
export class TodoDesktopController {
  create(createVo: TodoVO.CreateTodoVo): TodoVO.TodoWithoutRelationsVo {
    // ❌ 同步处理会阻塞主进程
    return this.todoController.createSync(createVo);
  }
}
```

### 2. 错误处理和用户反馈

```typescript
// IPC处理器中的错误处理
export function registerTodoIpcHandlers() {
  ipcMain.handle('todo:create', async (event, createVo) => {
    try {
      const result = await new TodoDesktopController().create(createVo);
      return { success: true, data: result };
    } catch (error) {
      // 返回结构化的错误信息
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
        },
      };
    }
  });
}
```

### 3. 资源管理和清理

```typescript
// 主进程中的资源管理
class DatabaseManager {
  private controllers: Map<string, any> = new Map();

  constructor() {
    this.initializeControllers();
    this.registerIpcHandlers();
  }

  private initializeControllers() {
    // 创建核心控制器实例
    this.controllers.set('todo', new TodoController());
    this.controllers.set('goal', new GoalController());
  }

  private registerIpcHandlers() {
    // 注册所有IPC处理器
    registerTodoIpcHandlers();
    registerGoalIpcHandlers();
  }

  // 清理资源
  destroy() {
    this.controllers.clear();
    // 清理其他资源
  }
}
```

### 4. 性能优化建议

```typescript
// 使用Worker线程处理密集计算
export class HeavyTaskDesktopController {
  async processHeavyTask(data: any): Promise<any> {
    // 对于计算密集型任务，使用Worker
    return await this.processInWorker(data);
  }

  private async processInWorker(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./workers/heavy-task.worker.js');

      worker.postMessage(data);
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };
    });
  }
}
```

## 📋 检查清单

### 文件结构检查

- [ ] 文件位置正确：`apps/desktop/src/database/growth/{module}.controller.ts`
- [ ] 导出文件存在：`index.ts`
- [ ] IPC处理器正确导出：`{module}IpcHandlers`

### 代码质量检查

- [ ] 类名符合规范：`{Module}DesktopController`
- [ ] 没有框架相关装饰器
- [ ] 方法返回Promise类型
- [ ] 添加完整的JSDoc注释

### IPC规范检查

- [ ] 通道命名规范：`{module}:{action}`
- [ ] 错误处理机制完善
- [ ] 异步处理正确实现
- [ ] 资源清理机制

### 性能优化检查

- [ ] 避免阻塞主进程
- [ ] 合理使用Worker线程
- [ ] 内存使用优化
- [ ] 错误恢复机制

---

_此文档为Desktop Adapter Controller开发规范，Electron IPC适配指南。_
