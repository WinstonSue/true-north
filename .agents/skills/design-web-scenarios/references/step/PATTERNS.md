# Step 步骤流程实现协议

## 业务模式

- 分步表单：`items` 描述录入、确认、完成等阶段，`next` 必须先校验当前表单。
- 审批流：节点保留处理人、时间、意见、状态和当前待办动作，历史节点只读。
- 物流 / 任务：节点按业务顺序或时间顺序展示，异常节点需要原因和恢复动作。
- 行内进度：用紧凑 `Tag`、`Badge`、`Progress` 和短标题表达，不使用大面积轨道。
- 类导航步骤：只有业务允许跳转并且校验通过时才调用 `onStepClick`。

## 状态协议

- `items` 是唯一步骤来源，至少包含 `key`、`title`、`status`。
- `current` 只表示当前阶段，不负责推断历史数据是否完成。
- `status` 使用 `wait`、`process`、`finish`、`error`、`skipped`、`disabled` 作为基础集合。
- `optional` / `subTitle` 表达可选信息，不要替代 `description`。
- `description` / `content` 放原因、摘要、处理意见和下一步提示。
- `percent` 只表达单个节点内部进度，不能代替节点状态。
- `disabled` 和 `canJump` 分开计算：禁用是不可交互，能跳转是业务校验后的许可。

## 跳转与校验

- `next`：先运行当前步骤同步校验，再运行必要异步校验，全部通过后推进。
- `prev`：通常允许回到历史步骤，但要保护已经提交或锁定的数据。
- `goTo`：先检查目标项 `disabled` 和 `canJump`，再执行校验；失败时用 `Alert`、`Tooltip` 或表单错误反馈原因。
- `onStepClick` 不直接写 `current`，只请求业务层跳转。
- `loading` / `submitting` 期间禁用推进、跳转和重复提交动作。

## 视觉组合

- 页面级步骤：`ol` / `li` + `Flex` 或 `Space` + 本地 CSS 画连接线。
- 节点状态：`Badge` 表达当前或未读，`Tag` 表达完成、错误、跳过、禁用、审批结论。
- 长说明：用 `Tooltip` 收纳禁用原因或错误摘要；关键错误仍应在内容区用 `Alert` 展示。
- 当前内容：表单步骤使用 `Form`，确认步骤使用 `Descriptions`，完成和异常状态参考 `result` 场景。
- 分隔：`Divider` 用于分开轨道、内容、历史记录或确认摘要，不要套多层卡片。

## 反导入规则

- 不从 `@sue/design-web-vue` 或 `@sue/design-web-react` 导入 `Step`、`Steps`、`StepItem`、`StepsProps`。
- 不从 `@sue/design-web-scenarios` 导入 `Step`、`Steps`、`StepItem`、`StepsProps`。
- 不假设存在 `theme.components.Steps`、`ConfigProvider.steps` 或 `SueSteps`。
- 若业务需要复用，只在宿主项目内抽本地组件、composable 或 hook。

## React recipe

React 组合与 Vue 相同，只是导入 `@sue/design-web-react`，用 `useState` 维护 `current`。节点点击走 `onStepClick`，不要直接 `setCurrent`。进度轨道示例：

```tsx
<ol>
  {items.map((item, index) => (
    <li key={item.key} aria-current={index === current ? "step" : undefined}>
      <Tag color={item.status === "error" ? "error" : index === current ? "processing" : "default"}>
        {item.title}
      </Tag>
    </li>
  ))}
</ol>
```
