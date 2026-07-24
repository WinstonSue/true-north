# True North Dev Tools

True North 开发辅助工具，提供了命令行和 Web 界面两种方式来执行代码同步操作。

## 功能特性

- **同步 Controllers**: 同步业务控制器代码，生成 API 接口和目标代码控制器
- **监听 Controllers**: 监听业务控制器变化，自动同步生成代码
- **同步 DTO**: 同步 DTO 定义，生成 VO 类型和表单类型
- **监听 DTO**: 监听 DTO 变化，自动同步生成类型定义

## 使用方式

### 1. 命令行方式（原有方式）

```bash
# 同步操作
pnpm sync:controllers
pnpm sync:dto

# 监听操作
pnpm watch:controllers
pnpm watch:dto
```

### 2. Web 界面方式（新增）

#### 开发模式

```bash
# 启动开发服务器（前端 + 后端）
pnpm dev:full
```

然后访问 http://localhost:3001 即可使用 Web 界面进行同步操作。

#### 生产模式

```bash
# 构建并启动生产服务器
pnpm start
```

然后访问 http://localhost:3002 使用 Web 界面。

## Web 界面功能

### 同步操作

- **同步 Controllers**: 一键执行控制器同步
- **同步 DTO**: 一键执行 DTO 同步

### 监听任务

- **监听 Controllers**: 启动/停止控制器监听任务
- **监听 DTO**: 启动/停止 DTO 监听任务

### 特性

- 实时显示任务执行状态
- 支持启动和停止长期运行的监听任务
- 友好的操作界面和状态反馈
- 支持多个监听任务同时运行

## 技术架构

### 前端

- React 18 + TypeScript
- Ant Design UI 组件库
- Vite 构建工具

### 后端

- Express.js API 服务器
- 子进程管理执行同步命令
- RESTful API 接口

### 开发工具

- TypeScript 严格模式
- ESLint + Prettier 代码规范
- 热重载开发体验

## API 接口

### POST /api/execute

执行同步命令或启动监听任务

```json
{
  "command": "sync:controllers",
  "type": "sync",
  "taskId": "sync-controllers"
}
```

### POST /api/stop

停止监听任务

```json
{
  "taskId": "watch-controllers"
}
```

### GET /api/tasks

获取运行中的任务列表

## 项目结构

```
dev-tools/
├── src/
│   ├── server/           # Express 后端服务
│   ├── watch-controllers/ # 控制器监听逻辑
│   ├── watch-dto/        # DTO 监听逻辑
│   └── utils/            # 工具函数
├── web/
│   └── src/
│       ├── components/   # React 组件
│       ├── App.tsx       # 主应用组件
│       └── main.tsx      # 应用入口
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```
