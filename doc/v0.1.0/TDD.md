# True North v0.1.0 技术开发文档 (TDD)

## 一、文档元信息

```yaml
document_meta:
  title: 'True North v0.1.0 TDD'
  version: 'v0.1.0'
  status: 'draft'
  created_date: '2025-12-23'
  last_updated: '2025-12-23'
  owner: 'Growth Squad'
  target_audience: ['frontend_developer', 'backend_developer']

tech_stack:
  frontend:
    framework: 'React 18'
    language: 'TypeScript'
    ui_library: ['Arco Design']
    state_management: 'React Context + createInjectState'
    router: 'React Router v6'
    build_tool: 'Vite'
  backend:
    framework: 'NestJS'
    language: 'TypeScript'
    orm: 'TypeORM'
    auth: 'JWT + bcrypt'
  shared:
    package_manager: 'pnpm'
    monorepo_tool: 'Turbo'
```

## 二、系统架构概览

- Monorepo：apps/desktop（Electron 桌面端，含业务域与 IPC）+ packages/\*（共享 vo/enum/api/web 等）。
- 前端路由：`/growth/goal`、`/growth/task/...`，新增 `/growth/task/detail/:id`。
- 数据流：前端 Context（GoalProvider/TaskProvider）调 packages/api → server Controller → Service → Repository(TypeORM) → DB。

## 三、功能范围与差异

- 对齐 PRD v0.1.0：仅涵盖 Goal 页（状态 Tag + 右上操作区）与 Task 详情页（树 + 详情双栏）。Todo/Habit 按现有实现即可，无新增开发。
- 交互约束：
  1. Goal 状态仅展示 Tag，禁止状态切换。
  2. “已完成”按钮置于右上操作区，与 `...`（编辑/删除/放弃）同区域。
  3. Goal 关联任务点击后跳转 Task 详情页，并在 Task 树高亮。

## 四、前端设计

### 4.1 目标页（/growth/goal）

- 组件：`apps/desktop/src/render/pages/growth/goal`
  - GoalAside：保持树加载与搜索占位，无需改。
  - GoalMainHeader：右上区域改为「状态 Tag（只读） + Dropdown(...: 编辑/删除/放弃) + 主要按钮“已完成”」。
    - 状态 Tag：仅展示，不提供下拉。
    - 主要按钮：调用 `PATCH /goal/:id` 将状态置为已完成，成功后刷新树和详情；提供 toast 反馈。
    - Dropdown：编辑 → 打开抽屉；删除/放弃 → 二次确认后调用 API。
  - 关联任务列表：点击某任务时 `navigate('/growth/task/detail/' + task.id, { state: { fromGoal: goalId } })`。

### 4.2 Task 详情页（新增路由）

- 路由：`/growth/task/detail/:id`（在 growth routes 注册）。
- 页面结构：左侧 Task 树 + 右侧详情（同 Goal 双栏布局）。
- 左侧 Task 树：
  - 数据：`GET /task/tree`（若无接口则复用按 parentId 懒加载的列表）；展开父链定位当前任务。
  - 交互：点击节点 → 刷新右侧详情；搜索/过滤占位。
- 右侧详情：
  - Header：状态 Tag（只读） + Dropdown(...: 编辑/删除/放弃) + 主要按钮（标记完成/恢复，取决于状态）。
  - Tabs：概览 / 子任务 / 关联 Todo / TrackTime
  - 概览：展示基础信息、时间范围、关联目标；编辑走抽屉。
  - 子任务：列表 + 内联创建；校验时间/重要度不超父级。
  - 关联 Todo：列表（调用 /todo?relatedType=task&relatedId=:id）。
  - TrackTime：按钮跳转计时器（占位，不自动计时）。
- 从 Goal 跳转：接受 location.state.fromGoal，用于回退时恢复 Goal 页面；在 Task 树高亮当前节点。
- 返回行为：保留 Task 上一视图的筛选/滚动（存放在 TaskProvider 中的缓存）。

### 4.3 UI 规范（复用）

- 右上操作区顺序：状态 Tag（只读） | Dropdown(...) | 主要按钮。
- Dropdown 使用 Arco `Dropdown`，删除项危险色，二次确认。
- 按钮：主要按钮用于完成/恢复，次要按钮用文字/次级样式。

## 五、后端设计（若需配合）

- Goal 完成/放弃 API：`PATCH /goal/:id { status }`，校验关联约束。
- Task 树/详情：
  - `GET /task/tree?rootId=` 或 `GET /task/:id/children` 懒加载。
  - `GET /task/:id` 返回任务详情（含 parent/children/goalId）。
  - `PATCH /task/:id { status }` 支持标记完成/放弃。
- 关联 Todo：`GET /todo?relatedType=task&relatedId=:id`。
- 返回字段需包含：id、name、status、parentId、goalId、timeFrame、importance、childrenExists。

## 六、数据模型要点

- TaskVo / GoalVo：需包含 status (只读展示)、parentId、goalId、timeFrame、importance。
- TaskTree 节点：`{ id, name, status, parentId, childrenExists }`。
- 状态枚举：Goal/Task 保持与 ProductWiki 定义一致，前端只读展示。

## 七、接口契约摘要

| API                                  | Method | 说明                                                         |
| ------------------------------------ | ------ | ------------------------------------------------------------ |
| `/goal/:id`                          | PATCH  | 更新字段，含 status=completed/abandoned，校验子目标/关联约束 |
| `/task/:id`                          | GET    | 获取任务详情（含 parent/children/goalId）                    |
| `/task/:id`                          | PATCH  | 更新任务字段，含 status=completed/abandoned                  |
| `/task/tree` or `/task/:id/children` | GET    | 获取任务树/子节点                                            |
| `/todo`                              | GET    | 通过 relatedType=task&relatedId 过滤关联待办                 |

> 若现有 API 不满足，按上述契约补充；前端需容错接口未实现时的占位。

## 八、开发与联调

- 前端：
  - 新增 TaskDetail 页面与路由注册；
  - 调整 GoalMainHeader 操作区与跳转逻辑；
  - TaskProvider 增加视图状态缓存（上次列表筛选/滚动）。
- 后端：
  - 确认任务树/子节点接口；缺失则补 `GET /task/tree`。
  - 确认 Goal/Task 状态更新接口支持 completed/abandoned。
- 验收要点：
  - Goal 页状态不可下拉，Tag 展示一致。
  - Goal 任务列表点击跳转 Task 详情，Task 树高亮当前节点。
  - Task 详情页左树右详情可正常切换节点，右上操作区按钮与 Dropdown 生效。

## 九、非功能

- 性能：树懒加载；详情接口响应 < 500ms；首屏 < 5s。
- 兼容：桌面端 Chrome/Edge ≥100。
- 安全：危险操作必须二次确认；接口鉴权基于 JWT。

## 十、里程碑

| 里程碑 | 内容                                          |
| ------ | --------------------------------------------- |
| Alpha  | Goal 操作区调整 + Task 详情页骨架（树+详情）  |
| Beta   | 子任务/关联 Todo/TrackTime 占位打通，跳转联动 |
| GA     | 体验打磨、错误处理、性能优化                  |
