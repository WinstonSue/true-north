import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import {
  Alert,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Slider,
  Tag,
  TimePicker,
} from '@sue/design-web-react';
import { goalTypes, NEXT_DAY, TODAY } from '../mock-data';
import { productRef } from '../../product-wiki';
import type {
  DrawerKind,
  DrawerState,
  Goal,
  GoalStatus,
  Habit,
  HabitFrequency,
  SaveEntity,
  Task,
  TaskStatus,
  Todo,
  TodoStatus,
} from '../types';
import { frequencyLabel, goalName, statusLabel } from '../utils';
import styles from './EntityDrawer.module.css';

type Props = {
  drawer: NonNullable<DrawerState>;
  goals: Goal[];
  tasks: Task[];
  todos: Todo[];
  habits: Habit[];
  onClose: () => void;
  onSave: SaveEntity;
  onFocusTask: (task: Task) => void;
};

export function EntityDrawer({ drawer, goals, tasks, todos, habits, onClose, onSave, onFocusTask }: Props) {
  const existing =
    drawer.kind === 'goal'
      ? goals.find((item) => item.id === drawer.id)
      : drawer.kind === 'task'
        ? tasks.find((item) => item.id === drawer.id)
        : drawer.kind === 'todo'
          ? todos.find((item) => item.id === drawer.id)
          : habits.find((item) => item.id === drawer.id);
  const [draft, setDraft] = useState<Goal | Task | Todo | Habit>(() => existing || createDraft(drawer.kind, goals));
  const [error, setError] = useState('');
  const patch = (value: Partial<typeof draft>) => setDraft((current) => ({ ...current, ...value }) as typeof draft);
  const submit = () => {
    const entity = !existing && drawer.kind === 'task' ? ({ ...draft, status: 'todo' } as Task) : draft;
    const validation = validateDraft(drawer.kind, entity, goals, tasks);
    if (validation) return setError(validation);
    onSave(drawer.kind, entity);
  };
  const name = ({ goal: '目标', task: '任务', todo: '待办', habit: '习惯' } as Record<DrawerKind, string>)[drawer.kind];
  const productReference = {
    goal: productRef('growth.goal.interaction'),
    task: productRef('growth.task.rule.single-parent'),
    todo: productRef('growth.todo.interaction'),
    habit: productRef('growth.habit.rules'),
  }[drawer.kind];
  return (
    <Drawer
      open
      title={<span data-product-ref={productReference}>{`${existing ? '编辑' : '新建'}${name}`}</span>}
      onClose={onClose}
      size="large"
      destroyOnHidden
      extra={
        <div data-product-ref={productReference}>
          <Button type="primary" onClick={submit}>
            保存
          </Button>
        </div>
      }
    >
      <div data-product-ref={productReference}>
        <Form layout="vertical" className={styles.entityForm}>
          <Form.Item label={`${name}名称`} required>
            <Input
              value={draft.title}
              onChange={(event) => patch({ title: event.target.value })}
              placeholder={`输入${name}名称`}
            />
          </Form.Item>
          {drawer.kind === 'goal' && <GoalFields draft={draft as Goal} patch={patch} goals={goals} />}
          {drawer.kind === 'task' && (
            <TaskFields
              draft={draft as Task}
              patch={patch}
              goals={goals}
              tasks={tasks}
              isNew={!existing}
              onFocusTask={onFocusTask}
            />
          )}
          {drawer.kind === 'todo' && (
            <TodoFields
              draft={draft as Todo}
              patch={patch}
              goals={goals}
              tasks={tasks}
              habits={habits}
              isNew={!existing}
            />
          )}
          {drawer.kind === 'habit' && <HabitFields draft={draft as Habit} patch={patch} goals={goals} />}
          {error && <Alert type="error" showIcon title={error} />}
        </Form>
      </div>
    </Drawer>
  );
}

function createDraft(kind: DrawerKind, goals: Goal[]): Goal | Task | Todo | Habit {
  const id = `${kind[0]}${Date.now()}`;
  if (kind === 'goal')
    return {
      id,
      title: '',
      description: '',
      type: 'vision',
      status: 'todo',
      importance: 3,
      difficulty: 2,
      start: TODAY,
      end: '2026-12-31',
      history: ['刚刚创建'],
    };
  if (kind === 'task')
    return {
      id,
      title: '',
      description: '',
      goalId: goals[0]?.id,
      status: 'todo',
      importance: 3,
      difficulty: 2,
      start: TODAY,
      end: NEXT_DAY,
      plannedStart: TODAY,
      plannedEnd: TODAY,
      estimated: 1,
      actual: 0,
    };
  if (kind === 'todo')
    return {
      id,
      title: '',
      description: '',
      status: 'todo',
      importance: 3,
      urgency: 3,
      planned: TODAY,
      plannedStartTime: '09:00',
      plannedEndTime: '10:00',
      history: ['刚刚创建'],
    };
  return {
    id,
    title: '',
    goalIds: goals.length ? [goals[0].id] : [],
    status: 'active',
    importance: 3,
    difficulty: 2,
    weights: goals.length ? { [goals[0].id]: 3 } : {},
    frequency: { mode: 'daily', weekdays: [], monthlyDay: 1 },
    tags: [],
    streak: 0,
    longest: 0,
    logs: [],
  };
}
function validateDraft(kind: DrawerKind, draft: Goal | Task | Todo | Habit, goals: Goal[], tasks: Task[]) {
  if (!draft.title.trim()) return '请输入名称';
  if (kind === 'goal') {
    const item = draft as Goal;
    const parent = goals.find((goal) => goal.id === item.parentId);
    const children = goals.filter((goal) => goal.parentId === item.id);
    if (item.start > item.end) return '结束日期不能早于开始日期';
    if (!parent && item.type !== 'vision') return '无父目标的目标只能选择规划类型';
    if (parent && (item.start < parent.start || item.end > parent.end)) return '子目标时间范围必须落入父目标';
    if (parent && item.importance > parent.importance) return '子目标重要度不能高于父目标';
    if (parent?.type === 'result' && item.type !== 'result') return '指标父目标下只能创建指标子目标';
    if (item.type === 'result' && children.some((child) => child.type !== 'result'))
      return '指标目标下不能包含规划子目标，请先调整子目标类型';
  }
  if (kind === 'task') {
    const item = draft as Task;
    if (Boolean(item.goalId) === Boolean(item.parentId)) return '任务必须关联一个目标或一个父任务';
    const parent = item.parentId
      ? tasks.find((task) => task.id === item.parentId)
      : goals.find((goal) => goal.id === item.goalId);
    if (
      parent &&
      (item.start < parent.start ||
        item.end > parent.end ||
        item.importance > parent.importance ||
        item.difficulty > parent.difficulty)
    )
      return '任务的时间、重要度和难度不能超出关联上游';
    if (item.plannedStart > item.plannedEnd) return '计划结束时间不能早于计划开始时间';
  }
  if (kind === 'todo') {
    const item = draft as Todo;
    if (!item.plannedStartTime || !item.plannedEndTime || item.plannedStartTime >= item.plannedEndTime)
      return '计划结束时间必须晚于开始时间';
    const sourceCount = [item.taskId, item.goalId, item.habitId].filter(Boolean).length;
    if (sourceCount > 1) return '系统待办只能关联一个来源';
    const parent = item.taskId
      ? tasks.find((task) => task.id === item.taskId)
      : goals.find((goal) => goal.id === item.goalId);
    if (parent && (item.planned < parent.start || item.planned > parent.end || item.importance > parent.importance))
      return '待办的时间和重要度必须继承关联上游';
  }
  if (kind === 'habit') {
    const item = draft as Habit;
    if (!item.goalIds.length) return '习惯至少需要关联一个目标';
    const related = goals.filter((goal) => item.goalIds.includes(goal.id));
    if (related.some((goal) => item.difficulty > goal.difficulty)) return '习惯难度不能高于任一关联目标';
    if (Object.values(item.weights).reduce((sum, value) => sum + value, 0) > item.goalIds.length * 10)
      return '贡献权重总和超出目标数量上限';
    if (item.frequency.mode === 'weekly' && !item.frequency.weekdays.length) return '每周执行至少选择一天';
  }
  return undefined;
}
function ImportanceControl({
  value,
  onChange,
  label = '重要程度',
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}) {
  return (
    <Form.Item label={label}>
      <Slider
        min={1}
        max={5}
        value={value}
        marks={{ 1: '1', 3: '3', 5: '5' }}
        onChange={(value) => onChange(Number(value))}
      />
      <small className={styles.formHint}>当前值：{value}</small>
    </Form.Item>
  );
}
function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Form.Item label={label}>
      <DatePicker
        value={dayjs(value)}
        style={{ width: '100%' }}
        onChange={(date) => date && onChange(date.format('YYYY-MM-DD'))}
      />
    </Form.Item>
  );
}
function timeOf(value: string): Dayjs {
  const [hour, minute] = value.split(':').map(Number);
  return dayjs().hour(hour).minute(minute).second(0);
}
function TimeRangeField({ start, end, onChange }: { start: string; end: string; onChange: (start: string, end: string) => void }) {
  return (
    <Form.Item label="计划时间" required>
      <TimePicker.RangePicker
        allowClear={false}
        format="HH:mm"
        minuteStep={5}
        value={[timeOf(start), timeOf(end)]}
        style={{ width: '100%' }}
        onChange={(range) => {
          if (!range?.[0] || !range[1]) return;
          onChange(range[0].format('HH:mm'), range[1].format('HH:mm'));
        }}
      />
    </Form.Item>
  );
}
function GoalFields({ draft, patch, goals }: { draft: Goal; patch: (value: Partial<Goal>) => void; goals: Goal[] }) {
  const parent = goals.find((goal) => goal.id === draft.parentId);
  const availableTypes = parent
    ? parent.type === 'result'
      ? goalTypes.filter((type) => type.value === 'result')
      : goalTypes
    : goalTypes.filter((type) => type.value === 'vision');
  const updateParent = (parentId?: string) => {
    const nextParent = goals.find((goal) => goal.id === parentId);
    if (!nextParent) return patch({ parentId: undefined, type: 'vision' });
    patch(nextParent.type === 'result' ? { parentId, type: 'result' } : { parentId });
  };
  const typeRuleReference = productRef('growth.goal.rule.type');
  const timeFrameReference = productRef('growth.goal.rule.time-frame');
  return (
    <>
      <div data-product-ref={typeRuleReference}>
        <Form.Item label="父级目标">
          <Select
            allowClear
            value={draft.parentId}
            options={goals.filter((goal) => goal.id !== draft.id).map((goal) => ({ value: goal.id, label: goal.title }))}
            onChange={(value) => updateParent(value as string | undefined)}
          />
        </Form.Item>
        <Form.Item label="目标类型" required>
          <Radio.Group value={draft.type} onChange={(event) => patch({ type: event.target.value })}>
            {availableTypes.map((type) => (
              <Radio key={type.value} value={type.value}>
                {type.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </div>
      <Row gutter={12}>
        <Col span={12}>
          <ImportanceControl value={draft.importance} onChange={(importance) => patch({ importance })} />
        </Col>
        <Col span={12}>
          <ImportanceControl
            label="完成难度"
            value={draft.difficulty}
            onChange={(difficulty) => patch({ difficulty })}
          />
        </Col>
        <Col span={12}>
          <div data-product-ref={timeFrameReference}>
            <DateField label="开始日期" value={draft.start} onChange={(start) => patch({ start })} />
          </div>
        </Col>
        <Col span={12}>
          <div data-product-ref={timeFrameReference}>
            <DateField label="结束日期" value={draft.end} onChange={(end) => patch({ end })} />
          </div>
        </Col>
      </Row>
      <Form.Item label="状态">
        <Select
          value={draft.status}
          options={['todo', 'doing', 'done', 'paused', 'archived'].map((value) => ({
            value,
            label: statusLabel(value),
          }))}
          onChange={(value) => patch({ status: value as GoalStatus })}
        />
      </Form.Item>
      <Form.Item label="描述">
        <Input.TextArea value={draft.description} onChange={(event) => patch({ description: event.target.value })} />
      </Form.Item>
    </>
  );
}
function TaskFields({
  draft,
  patch,
  goals,
  tasks,
  isNew,
  onFocusTask,
}: {
  draft: Task;
  patch: (value: Partial<Task>) => void;
  goals: Goal[];
  tasks: Task[];
  isNew: boolean;
  onFocusTask: (task: Task) => void;
}) {
  const subTask = Boolean(draft.parentId);
  return (
    <>
      <Form.Item label="关联方式" required>
        <Radio.Group
          value={subTask ? 'parent' : 'goal'}
          onChange={(event) =>
            patch(
              event.target.value === 'parent'
                ? { parentId: tasks.find((task) => task.id !== draft.id)?.id, goalId: undefined }
                : { parentId: undefined, goalId: goals[0]?.id }
            )
          }
        >
          <Radio value="goal">关联目标</Radio>
          <Radio value="parent">关联父任务</Radio>
        </Radio.Group>
      </Form.Item>
      {subTask ? (
        <Form.Item label="父任务">
          <Select
            value={draft.parentId}
            options={tasks
              .filter((task) => task.id !== draft.id)
              .map((task) => ({ value: task.id, label: task.title }))}
            onChange={(value) => patch({ parentId: value as string, goalId: undefined })}
          />
        </Form.Item>
      ) : (
        <Form.Item label="关联目标">
          <Select
            value={draft.goalId}
            options={goals.map((goal) => ({ value: goal.id, label: goal.title }))}
            onChange={(value) => patch({ goalId: value as string, parentId: undefined })}
          />
        </Form.Item>
      )}
      <Row gutter={12}>
        <Col span={12}>
          <ImportanceControl value={draft.importance} onChange={(importance) => patch({ importance })} />
        </Col>
        <Col span={12}>
          <ImportanceControl
            label="完成难度"
            value={draft.difficulty}
            onChange={(difficulty) => patch({ difficulty })}
          />
        </Col>
        <Col span={12}>
          <DateField label="计划开始时间" value={draft.plannedStart} onChange={(plannedStart) => patch({ plannedStart })} />
        </Col>
        <Col span={12}>
          <DateField label="计划结束时间" value={draft.plannedEnd} onChange={(plannedEnd) => patch({ plannedEnd })} />
        </Col>
        {!isNew && (
          <Col span={12}>
            <DateField label="开始时间" value={draft.start} onChange={(start) => patch({ start })} />
          </Col>
        )}
        {!isNew && (
          <Col span={12}>
            <DateField label="结束时间" value={draft.end} onChange={(end) => patch({ end })} />
          </Col>
        )}
        <Col span={12}>
          <Form.Item label="预计耗时">
            <InputNumber
              min={0.5}
              step={0.5}
              value={draft.estimated}
              style={{ width: '100%' }}
              onChange={(estimated) => patch({ estimated: Number(estimated) || 0 })}
            />
          </Form.Item>
        </Col>
      </Row>
      {!isNew && (
        <Form.Item label="状态">
          <Select
            value={draft.status}
            options={['todo', 'doing', 'done', 'abandoned'].map((value) => ({
              value,
              label: statusLabel(value),
            }))}
            onChange={(value) => patch({ status: value as TaskStatus })}
          />
        </Form.Item>
      )}
      {!isNew && (
        <Form.Item label="实际耗时">
          <Flex align="center" justify="space-between" gap={12}>
            <span>{draft.actual} 小时</span>
            <Button onClick={() => onFocusTask(draft)}>开始专注计时</Button>
          </Flex>
        </Form.Item>
      )}
      <Form.Item label="描述">
        <Input.TextArea value={draft.description} onChange={(event) => patch({ description: event.target.value })} />
      </Form.Item>
    </>
  );
}
function TodoFields({
  draft,
  patch,
  goals,
  tasks,
  habits,
  isNew,
}: {
  draft: Todo;
  patch: (value: Partial<Todo>) => void;
  goals: Goal[];
  tasks: Task[];
  habits: Habit[];
  isNew: boolean;
}) {
  const sourceName = draft.taskId
    ? `任务 · ${tasks.find((task) => task.id === draft.taskId)?.title || '已删除任务'}`
    : draft.goalId
      ? `目标 · ${goals.find((goal) => goal.id === draft.goalId)?.title || '已删除目标'}`
      : draft.habitId
        ? `习惯 · ${habits.find((habit) => habit.id === draft.habitId)?.title || '已删除习惯'}`
        : undefined;
  return (
    <>
      {sourceName && (
        <Form.Item label="系统来源">
          <Input disabled value={sourceName} />
        </Form.Item>
      )}
      <Row gutter={12}>
        <Col span={12}>
          <ImportanceControl value={draft.importance} onChange={(importance) => patch({ importance })} />
        </Col>
        <Col span={12}>
          <ImportanceControl label="紧急程度" value={draft.urgency} onChange={(urgency) => patch({ urgency })} />
        </Col>
        <Col span={12}>
          <DateField label="计划日期" value={draft.planned} onChange={(planned) => patch({ planned })} />
        </Col>
        <Col span={12}>
          <TimeRangeField
            start={draft.plannedStartTime}
            end={draft.plannedEndTime}
            onChange={(plannedStartTime, plannedEndTime) => patch({ plannedStartTime, plannedEndTime })}
          />
        </Col>
      </Row>
      {!isNew && (
        <Form.Item label="状态">
          <Select
            value={draft.status}
            options={['todo', 'in_progress', 'done', 'abandoned'].map((value) => ({ value, label: statusLabel(value) }))}
            onChange={(value) => patch({ status: value as TodoStatus })}
          />
        </Form.Item>
      )}
      <Form.Item label="描述">
        <Input.TextArea value={draft.description} onChange={(event) => patch({ description: event.target.value })} />
      </Form.Item>
    </>
  );
}
function HabitFields({ draft, patch, goals }: { draft: Habit; patch: (value: Partial<Habit>) => void; goals: Goal[] }) {
  return (
    <>
      <Form.Item label="关联目标" required>
        <Select
          mode="multiple"
          value={draft.goalIds}
          options={goals
            .filter((goal) => goal.status !== 'archived')
            .map((goal) => ({ value: goal.id, label: goal.title }))}
          onChange={(goalIds) => {
            const ids = goalIds as string[];
            patch({ goalIds: ids, weights: Object.fromEntries(ids.map((id) => [id, draft.weights[id] || 3])) });
          }}
        />
      </Form.Item>
      <Row gutter={12}>
        <Col span={12}>
          <ImportanceControl value={draft.importance} onChange={(importance) => patch({ importance })} />
        </Col>
        <Col span={12}>
          <ImportanceControl
            label="完成难度"
            value={draft.difficulty}
            onChange={(difficulty) => patch({ difficulty })}
          />
        </Col>
      </Row>
      <HabitFrequencyFields
        value={draft.frequency}
        onChange={(frequency) => patch({ frequency })}
      />
      <Form.Item label="贡献权重">
        <div className={styles.weightList}>
          {draft.goalIds.map((id) => (
            <Flex key={id} align="center" gap={10}>
              <span>{goalName(goals, id)}</span>
              <Slider
                min={1}
                max={10}
                value={draft.weights[id] || 1}
                onChange={(value) => patch({ weights: { ...draft.weights, [id]: Number(value) } })}
              />
            </Flex>
          ))}
        </div>
      </Form.Item>
      <Form.Item label="状态">
        <Select
          value={draft.status}
          options={['active', 'paused', 'completed', 'abandoned'].map((value) => ({
            value,
            label: statusLabel(value),
          }))}
          onChange={(status) => patch({ status: status as Habit['status'] })}
        />
      </Form.Item>
      <Form.Item label="标签">
        <Select
          mode="tags"
          value={draft.tags}
          onChange={(tags) => patch({ tags: tags as string[] })}
          placeholder="输入后回车创建标签"
        />
      </Form.Item>
      <Alert
        type="info"
        showIcon
        title={`当前连续 ${draft.streak} 天、最长 ${draft.longest} 天与日志为计算字段，仅通过打卡更新。`}
      />
    </>
  );
}

function HabitFrequencyFields({
  value,
  onChange,
}: {
  value: HabitFrequency;
  onChange: (frequency: HabitFrequency) => void;
}) {
  return (
    <>
      <Form.Item label="执行频率">
        <Select
          value={value.mode}
          options={[
            ['daily', '每天'],
            ['weekly', '每周'],
            ['monthly', '每月'],
            ['weekdays', '工作日'],
            ['weekend', '周末'],
            ['workdays', '法定工作日'],
          ].map(([mode, label]) => ({ value: mode, label }))}
          onChange={(mode) => onChange({ ...value, mode: mode as HabitFrequency['mode'] })}
        />
      </Form.Item>
      {value.mode === 'weekly' && (
        <Form.Item label="执行星期" required>
          <Checkbox.Group
            value={value.weekdays}
            options={['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((label, index) => ({
              label,
              value: index + 1,
            }))}
            onChange={(weekdays) => onChange({ ...value, weekdays: weekdays as number[] })}
          />
        </Form.Item>
      )}
      {value.mode === 'monthly' && (
        <Form.Item label="每月日期">
          <InputNumber
            min={1}
            max={31}
            value={value.monthlyDay}
            onChange={(monthlyDay) => onChange({ ...value, monthlyDay: Number(monthlyDay) || 1 })}
          />
        </Form.Item>
      )}
      <Alert type="info" showIcon title={`频率预览：${frequencyLabel(value)}`} />
    </>
  );
}
