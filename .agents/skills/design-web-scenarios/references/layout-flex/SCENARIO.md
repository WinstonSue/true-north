# Flex 固定区 + 填充区布局

## 业务目标

让 agent 在遇到“固定区域 + 剩余区域”的需求时，稳定选择 Sue `Flex` 的 `full -> fixed + fill` 组合，而不是手写高度计算或只用普通纵向堆叠。

## 场景结构

- 父级容器必须有明确高度，才能让填充语义成立。
- 外层使用 `Flex vertical container="full"`，承载整个纵向工作区。
- 上方 filter、search、toolbar 或 summary 区使用 `Flex container="fixed"`，保持内容自身高度。
- 下方 table、list、canvas、detail body 或其他主内容区使用 `Flex container="fill"`，占据剩余高度。
- 主内容区内部再按实际组件决定是否滚动、分页或虚拟列表。

## 核心交互

- 筛选条件变化时，固定区高度不应挤压或重算主内容区高度。
- 主内容区刷新、加载、空态和分页时，应保持在剩余区域内完成状态切换。
- 内容超出时，滚动应发生在主内容区或内容组件内部，而不是把整个业务工作区撑高。
- 父容器高度不明确时，先补齐宿主布局高度约束，再使用该场景。

## 状态与数据流

- `filters`：筛选区表单或工具条状态。
- `loading` / `empty` / `error`：主内容区异步状态。
- `contentState`：表格、列表、画布、详情体或编辑区的业务状态。
- 布局状态不应依赖 magic number；高度关系交给 `Flex container` 语义表达。

## Sue 组件组合

- `Flex vertical container="full"`：外层纵向工作区。
- `Flex container="fixed"`：固定区，承载筛选、工具条、摘要、页脚操作或其他自适应高度内容。
- `Flex container="fill"`：填充区，承载表格、列表、画布、详情体、编辑区或其他主内容。

## 复用建议

- 企业列表区、弹窗/抽屉里的上下分区、设置页局部工作区、带工具栏的编辑器都可以复用该结构。
- 如果只有普通文档流内容，不需要剩余高度计算，可以不用该场景。
- `PATTERNS.md` 中的 TSX 片段可作为最小 recipe，实际内容、请求逻辑和滚动策略由业务实现决定。

## 反模式

- 用 `calc(100vh - xxxpx)` 或硬编码高度拼出剩余区域。
- 外层没有明确高度，却使用 `container="full"`。
- 只写纵向 `Flex`，不区分固定区和填充区。
- 让主内容把整个工作区撑高，导致固定区或页脚位置漂移。
- 在填充区外层缺少最小高度处理，导致嵌套内容或滚动容器溢出。

## 本场景相关 `PATTERNS.md` / `code/` 链接

- `PATTERNS.md`：固定区 + 填充区的 Flex 协议，以及 Vue / React recipe。
- `code/toolbar-fill.react.tsx`：React 工具栏 + fill 列表骨架。
