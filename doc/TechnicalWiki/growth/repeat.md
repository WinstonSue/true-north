# 重复规则技术实现

产品说明见 [重复规则 ProductWiki](../../../apps/prototype/product-wiki/growth/repeat/README.md)。重复规则是共享领域能力，不单独注册 RouteController 或数据库主模块。

## 代码边界

- 共享包：[packages/components/repeat](../../../packages/components/repeat)，包名 `@true-north/components-repeat`。
- 规则类型位于 `src/types/` 和 `src/core/types.ts`；`RepeatRule` 由开始日期、模式、配置和结束条件组成。
- `src/core/parser.ts` 负责结构化解析与字段校验；调用侧通过 `assertRepeat` 拒绝无效配置。
- `src/helpers/recurrence/calculateNextDate.ts` 计算下一次有效日期；TodoRepeatService 用它推进模板，HabitService 用共享断言保护配置。

## 调用关系

```text
RepeatSelector / renderer form
  -> RepeatRule VO
  -> TodoRepeatService 或 HabitService
  -> assertRepeat / calculateNextDate
  -> TodoRepeat 或 Habit 持久化字段
```

| 使用方 | 当前职责 | 持久化边界 |
| --- | --- | --- |
| Todo | 独立重复待办只维护模板当前实例；结算后计算并推进下一次 | `todo_repeat` 保存模式、配置、开始日、结束条件和当前日期。 |
| Habit | 创建、更新、读取时校验重复规则 | Habit 保存重复字段；周期待办编排属于 Habit/Todo 协作，不属于共享包。 |
| render | 选择器收集合法规则并以本地日历日展示 | 不自行计算下一日期或复制后端规则。 |

## 约束

- 所有规则以本地 `YYYY-MM-DD` 日历日计算；`forTimes` 将首次实例计入次数。
- 周、月、年和自定义模式必须满足各自配置完整性；自定义间隔必须为正整数。
- 共享包只处理重复语义，不决定 Todo/Habit 状态迁移、批量上限或持久化事务。
