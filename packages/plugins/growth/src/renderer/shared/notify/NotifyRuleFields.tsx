import { Button, Card, Flex, Form, Switch, TimePicker } from '@sue/design-web-react';
import dayjs, { type Dayjs } from 'dayjs';
import type { ReactNode } from 'react';
import {
  DEFAULT_GROWTH_NOTIFY_SETTINGS,
  PLAN_START_TOKEN,
  type HabitNotifyRule,
  type TaskNotifyRule,
  type TodoNotifyRule,
} from '@true-north/vo';

function toDayjs(hm: string): Dayjs | undefined {
  const parsed = dayjs(`2000-01-01 ${hm}`);
  return parsed.isValid() ? parsed : undefined;
}

function ClockTimes({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const clocks = value.filter((item) => item !== PLAN_START_TOKEN);
  return (
    <Flex vertical gap={8}>
      {clocks.map((hm, index) => (
        <Flex key={`${hm}-${index}`} gap={8} align="center">
          <TimePicker
            allowClear={false}
            format="HH:mm"
            minuteStep={5}
            value={toDayjs(hm)}
            onChange={(time) => {
              if (!time) return;
              const next = [...clocks];
              next[index] = time.format('HH:mm');
              const tokens = value.includes(PLAN_START_TOKEN) ? [PLAN_START_TOKEN, ...next] : next;
              onChange(tokens);
            }}
          />
          <Button
            type="link"
            onClick={() => {
              const next = clocks.filter((_, i) => i !== index);
              onChange(value.includes(PLAN_START_TOKEN) ? [PLAN_START_TOKEN, ...next] : next);
            }}
          >
            删除
          </Button>
        </Flex>
      ))}
      <Button
        type="dashed"
        style={{ alignSelf: 'flex-start' }}
        onClick={() => {
          const next = [...clocks, '21:00'];
          onChange(value.includes(PLAN_START_TOKEN) ? [PLAN_START_TOKEN, ...next] : next);
        }}
      >
        添加时刻
      </Button>
    </Flex>
  );
}

function PlanStartSwitch({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const checked = value.includes(PLAN_START_TOKEN);
  return (
    <Switch
      checked={checked}
      onChange={(enabled) => {
        const clocks = value.filter((item) => item !== PLAN_START_TOKEN);
        onChange(enabled ? [PLAN_START_TOKEN, ...clocks] : clocks);
      }}
    />
  );
}

function wrapNotifyFields(
  hideInherit: boolean | undefined,
  inherit: boolean,
  onInheritChange: (enabled: boolean) => void,
  children: ReactNode,
) {
  if (hideInherit) return children;
  return (
    <Form.Item
      label={
        <Flex justify="space-between" align="center" gap={8} className="w-full">
          通知
          <Flex align="center" gap={8}>
            默认
            <Switch size="small" checked={inherit} onChange={onInheritChange} />
          </Flex>
        </Flex>
      }
    >
      {children}
    </Form.Item>
  );
}

export function TodoNotifyFields({
  inherit,
  value,
  onChange,
  hideInherit,
}: {
  inherit: boolean;
  value?: TodoNotifyRule | null;
  onChange: (next: TodoNotifyRule | null) => void;
  hideInherit?: boolean;
}) {
  const rule = value || DEFAULT_GROWTH_NOTIFY_SETTINGS.todo;
  return wrapNotifyFields(
    hideInherit,
    inherit,
    (enabled) => onChange(enabled ? null : { ...rule }),
    inherit && !hideInherit ? null : (
      <Flex vertical gap={12}>
        <Form.Item label="过期待办" style={{ marginBottom: 0 }}>
          <ClockTimes value={rule.overdueTimes} onChange={(overdueTimes) => onChange({ ...rule, overdueTimes })} />
        </Form.Item>
        <Form.Item label="当天含计划开始时间" style={{ marginBottom: 0 }}>
          <PlanStartSwitch value={rule.todayTimes} onChange={(todayTimes) => onChange({ ...rule, todayTimes })} />
        </Form.Item>
        <ClockTimes value={rule.todayTimes} onChange={(todayTimes) => onChange({ ...rule, todayTimes })} />
      </Flex>
    ),
  );
}

export function TaskNotifyFields({
  inherit,
  value,
  onChange,
  hideInherit,
}: {
  inherit: boolean;
  value?: TaskNotifyRule | null;
  onChange: (next: TaskNotifyRule | null) => void;
  hideInherit?: boolean;
}) {
  const rule = value || DEFAULT_GROWTH_NOTIFY_SETTINGS.task;
  return wrapNotifyFields(
    hideInherit,
    inherit,
    (enabled) => onChange(enabled ? null : { ...rule }),
    inherit && !hideInherit ? null : (
      <Flex vertical gap={12}>
        <Form.Item label="过期任务" style={{ marginBottom: 0 }}>
          <ClockTimes value={rule.overdueTimes} onChange={(overdueTimes) => onChange({ ...rule, overdueTimes })} />
        </Form.Item>
        <Form.Item label="当前任务在计划开始时间推送" style={{ marginBottom: 0 }}>
          <PlanStartSwitch value={rule.currentTimes} onChange={(currentTimes) => onChange({ ...rule, currentTimes })} />
        </Form.Item>
        <ClockTimes value={rule.currentTimes} onChange={(currentTimes) => onChange({ ...rule, currentTimes })} />
      </Flex>
    ),
  );
}

export function HabitNotifyFields({
  inherit,
  value,
  onChange,
  hideInherit,
}: {
  inherit: boolean;
  value?: HabitNotifyRule | null;
  onChange: (next: HabitNotifyRule | null) => void;
  hideInherit?: boolean;
}) {
  const rule = value || DEFAULT_GROWTH_NOTIFY_SETTINGS.habit;
  return wrapNotifyFields(
    hideInherit,
    inherit,
    (enabled) => onChange(enabled ? null : { ...rule }),
    inherit && !hideInherit ? null : (
      <Form.Item label="提醒时刻" style={{ marginBottom: 0 }}>
        <ClockTimes value={rule.times} onChange={(times) => onChange({ ...rule, times })} />
      </Form.Item>
    ),
  );
}

export function GlobalNotifyFields({
  value,
  onChange,
}: {
  value: {
    todo: TodoNotifyRule;
    task: TaskNotifyRule;
    habit: HabitNotifyRule;
  };
  onChange: (next: {
    todo: TodoNotifyRule;
    task: TaskNotifyRule;
    habit: HabitNotifyRule;
  }) => void;
}) {
  return (
    <Flex vertical gap={16}>
      <Card size="small" title="待办">
        <TodoNotifyFields
          inherit={false}
          hideInherit
          value={value.todo}
          onChange={(todo) => todo && onChange({ ...value, todo })}
        />
      </Card>
      <Card size="small" title="任务">
        <TaskNotifyFields
          inherit={false}
          hideInherit
          value={value.task}
          onChange={(task) => task && onChange({ ...value, task })}
        />
      </Card>
      <Card size="small" title="习惯">
        <HabitNotifyFields
          inherit={false}
          hideInherit
          value={value.habit}
          onChange={(habit) => habit && onChange({ ...value, habit })}
        />
      </Card>
    </Flex>
  );
}
