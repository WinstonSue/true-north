# Growth 技术实现

本目录记录 Growth 域已存在的桌面端实现。产品语义、规则和路线图以 [Growth ProductWiki](../../../apps/prototype/product-wiki/growth/README.md) 为准；本文只描述已核对的代码入口、服务边界和接口路由。

- [目标管理](./goal.md)
- [任务管理](./task.md)
- [待办管理](./todo.md)
- [习惯管理](./habit.md)
- [专注与时间追踪](./track-time.md)

所有以下路由由 desktop 的 `electron-ipc-restful` 控制器承载。路径以控制器前缀和方法路径组合表示。
