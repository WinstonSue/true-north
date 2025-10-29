# Controller 状态检查功能

## 功能概述

从 watch-controllers 中拆分出了检查功能，提供了以下两个核心方法：

1. **checkControllerStatus** - 检查单个 controller 的状态
2. **checkPendingSyncFiles** - 检查所有待同步的 controller 文件

## API 接口

### GET /api/check/controllers
检查所有 Controllers 的同步状态

**响应格式：**
```json
{
  "success": true,
  "data": {
    "totalControllers": 5,
    "needsSyncCount": 2,
    "lastChecked": "2025-10-29T02:11:00.000Z",
    "controllers": [
      {
        "serverPath": "/path/to/server/controller.ts",
        "relativePath": "growth/todo/todo.controller.ts",
        "className": "TodoController",
        "serviceTypes": ["TodoService", "UserService"],
        "desktop": {
          "exists": true,
          "path": "/path/to/desktop/controller.ts",
          "needsSync": true,
          "issues": ["需要同步构造函数参数或方法"]
        },
        "api": {
          "exists": true,
          "path": "/path/to/api/controller.ts",
          "needsSync": false,
          "issues": []
        }
      }
    ]
  }
}
```

### GET /api/check/controller?path=xxx
检查单个 Controller 的状态

**参数：**
- `path`: Controller 文件的绝对路径

### GET /api/check/pending-files
获取所有待同步的文件列表

**响应格式：**
```json
{
  "success": true,
  "data": [
    "/path/to/desktop/controller1.ts",
    "/path/to/api/controller2.ts"
  ]
}
```

## Web 界面功能

### 状态表格
- **Controller 列**: 显示类名和相对路径
- **Desktop 列**: 显示桌面端控制器的存在状态、同步状态和问题
- **API 列**: 显示 API 控制器的存在状态、同步状态和问题  
- **服务类型列**: 显示控制器依赖的服务类型

### 状态指示器
- 🟢 **存在** - 文件存在且无需同步
- 🔴 **不存在** - 文件不存在
- 🟠 **需要同步** - 文件存在但需要同步

### 实时功能
- **自动检查**: 页面加载时自动检查一次状态
- **手动刷新**: 点击刷新按钮重新检查状态
- **状态统计**: 显示总控制器数量和需要同步的数量
- **警告提示**: 当有控制器需要同步时显示警告

## 检查逻辑

### Desktop Controller 检查
1. 检查文件是否存在
2. 模拟执行 `ensureConstructorArgs` 检查构造函数参数
3. 模拟执行 `syncMissingMethods` 检查缺失的方法
4. 比较处理前后的内容判断是否需要同步

### API Controller 检查  
1. 检查文件是否存在
2. 模拟执行 `syncApiMethods` 检查 API 方法
3. 比较处理前后的内容判断是否需要同步

## 使用场景

1. **开发前检查**: 在开始开发前查看哪些控制器需要同步
2. **状态比对**: 对比当前状态与期望状态的差异
3. **批量同步**: 了解需要同步的文件范围，决定是否执行批量同步
4. **问题诊断**: 查看具体的同步问题和错误信息

## 技术实现

### 核心文件
- `src/watch-controllers/checker.ts` - 检查逻辑实现
- `src/server/index.ts` - API 接口实现  
- `web/src/components/DevToolsPage.tsx` - Web 界面实现

### 依赖关系
- 复用现有的同步逻辑（`sync-database.ts`, `sync-api.ts`）
- 使用现有的解析器（`parser/index.ts`）
- 集成到现有的 Express 服务器中
