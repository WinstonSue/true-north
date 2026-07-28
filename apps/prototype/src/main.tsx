import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import zhCN from '@sue/design-web-react/locale/zh_CN';
import '@sue/design-web-react/dist/sue.css';
import { AlarmClock, Goal as GoalIcon } from 'lucide-react';
import { Button, ConfigProvider, Flex, Menu, Space, Tag, message } from '@sue/design-web-react';
import { EntityDrawer } from './shared/components';
import { bootstrapPrototypeInspector } from './prototype-inspector';
import { AiDecompositionDrawer } from './pages/goal/AiDecompositionDrawer';
import { GoalsPage } from './pages/goal';
import { MindMapPage } from './pages/goal/MindMapPage';
import { Workbench } from './pages/workbench';
import { TasksPage } from './pages/task';
import { TodosPage } from './pages/todo';
import { HabitsPage } from './pages/habit';
import { FocusPage } from './pages/focus';
import { initialGoals, initialHabits, initialTasks, initialTodos, nav, TODAY } from './shared/mock-data';
import type {
  DrawerKind,
  DrawerState,
  FocusSession,
  Goal,
  Habit,
  RecurrenceRule,
  RecurringTodoTemplate,
  SaveEntity,
  Score,
  Task,
  Todo,
  View,
} from './shared/types';
import { addDays, daysBetween, nextOccurrence, repeatLabel } from './shared/utils';
import styles from './App.module.css';

function App() {
  const [view, setView] = useState<View>('workbench');
  const [goals, setGoals] = useState(initialGoals);
  const [tasks, setTasks] = useState(initialTasks);
  const [todos, setTodos] = useState(initialTodos);
  const [habits, setHabits] = useState(initialHabits);
  const [templates, setTemplates] = useState<RecurringTodoTemplate[]>([]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [selectedGoal, setSelectedGoal] = useState('g3');
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [aiDecompositionOpen, setAiDecompositionOpen] = useState(false);

  const notify = (text: string) => message.success(text);
  const updateTodo = (id: string, patch: Partial<Todo>, event?: string) =>
    setTodos((items) =>
      items.map((todo) =>
        todo.id === id ? { ...todo, ...patch, history: event ? [...todo.history, event] : todo.history } : todo
      )
    );
  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((items) => items.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  const completeTodo = (todo: Todo) => {
    updateTodo(todo.id, { status: 'done' }, '完成待办');
    if (!todo.recurrenceId) return notify('待办已完成');
    const template = templates.find((item) => item.id === todo.recurrenceId);
    if (!template || !template.active) return notify('待办已完成，周期模板已暂停');
    const index = todo.occurrence || 1;
    if (template.rule.endMode === 'times' && index >= (template.rule.times || 1))
      return notify('待办已完成，已达到周期次数');
    const planned = nextOccurrence(todo.planned, template.rule);
    if (!planned || (template.rule.endMode === 'date' && template.rule.endDate && planned > template.rule.endDate))
      return notify('待办已完成，周期已结束');
    const due = addDays(planned, Math.max(0, daysBetween(todo.planned, todo.due)));
    setTodos((items) => [
      ...items,
      {
        ...template.base,
        id: `d${Date.now()}`,
        status: 'todo',
        planned,
        due,
        recurrenceId: template.id,
        occurrence: index + 1,
        history: [`周期模板自动生成第 ${index + 1} 次`],
      },
    ]);
    notify(`待办已完成，已生成 ${planned} 的下一次执行`);
  };
  const saveEntity: SaveEntity = (kind: DrawerKind, draft: Goal | Task | Todo | Habit, repeat?: RecurrenceRule) => {
    if (kind === 'goal')
      setGoals((items) => {
        const exists = items.some((item) => item.id === draft.id);
        return exists
          ? items.map((item) => (item.id === draft.id ? (draft as Goal) : item))
          : [...items, draft as Goal];
      });
    if (kind === 'task')
      setTasks((items) => {
        const exists = items.some((item) => item.id === draft.id);
        return exists
          ? items.map((item) => (item.id === draft.id ? (draft as Task) : item))
          : [...items, draft as Task];
      });
    if (kind === 'habit')
      setHabits((items) => {
        const exists = items.some((item) => item.id === draft.id);
        return exists
          ? items.map((item) => (item.id === draft.id ? (draft as Habit) : item))
          : [...items, draft as Habit];
      });
    if (kind === 'todo') {
      const todo = draft as Todo;
      const exists = todos.some((item) => item.id === todo.id);
      if (repeat && !exists) {
        const recurrenceId = `r${Date.now()}`;
        const template: RecurringTodoTemplate = {
          id: recurrenceId,
          active: true,
          rule: repeat,
          createdAt: TODAY,
          base: {
            title: todo.title,
            description: todo.description,
            taskId: todo.taskId,
            goalId: todo.goalId,
            importance: todo.importance,
            urgency: todo.urgency,
            planned: todo.planned,
            due: todo.due,
            reminder: todo.reminder,
          },
        };
        setTemplates((items) => [...items, template]);
        setTodos((items) => [
          ...items,
          { ...todo, recurrenceId, occurrence: 1, history: [`创建周期待办：${repeatLabel(repeat)}`] },
        ]);
      } else
        setTodos((items) =>
          exists
            ? items.map((item) =>
                item.id === todo.id ? { ...todo, history: [...item.history, '更新待办信息'] } : item
              )
            : [...items, todo]
        );
    }
    setDrawer(null);
    notify('已保存并同步相关视图');
  };
  const scoreHabit = (habit: Habit, score: Score) => {
    const hadToday = habit.logs.some((log) => log.date === TODAY);
    const nextStreak = score === 'miss' ? 0 : hadToday ? habit.streak : habit.streak + 1;
    setHabits((items) =>
      items.map((item) =>
        item.id === habit.id
          ? {
              ...item,
              streak: nextStreak,
              longest: Math.max(item.longest, nextStreak),
              logs: [...item.logs.filter((log) => log.date !== TODAY), { date: TODAY, score, mood: '平静', note: '' }],
            }
          : item
      )
    );
    notify(hadToday ? '已覆盖今天的打卡日志' : '打卡成功，贡献已回写目标');
  };

  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1677ff', controlHeight: 32, borderRadius: 6 } }}>
      <Flex className={styles.appShell} container="full">
        <Flex vertical className={styles.sidebar} container="fixed" data-product-wiki="global-overview">
          <Flex className={styles.brand} align="center" gap={10}>
            <span>
              <GoalIcon size={17} />
            </span>
            知止
          </Flex>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[view]}
            items={nav.map((item) => {
              const Icon = item.icon;
              return { key: item.id, icon: <Icon size={16} />, label: item.label };
            })}
            onClick={({ key }) => setView(key as View)}
          />
          <div className={styles.sidebarFoot}>
            <Tag color="blue">Growth Prototype</Tag>
            <p>仅保存在当前会话</p>
          </div>
        </Flex>
        <Flex vertical className={styles.workspace} container="fill">
          <Flex className={styles.topbar} container="fixed" align="center" justify="space-between">
            <div>
              <span className={styles.crumb}>
                个人成长 / <b>{nav.find((item) => item.id === view)?.label}</b>
              </span>
            </div>
            <Space>
              <Button type="text" icon={<AlarmClock size={16} />} aria-label="提醒" />
            </Space>
          </Flex>
          <main className={styles.content}>
            {view === 'workbench' && (
              <Workbench
                goals={goals}
                tasks={tasks}
                todos={todos}
                habits={habits}
                setView={setView}
                completeTodo={completeTodo}
                scoreHabit={scoreHabit}
              />
            )}
            {view === 'goal' && (
              <GoalsPage
                goals={goals}
                tasks={tasks}
                habits={habits}
                selectedGoal={selectedGoal}
                setSelectedGoal={setSelectedGoal}
                setDrawer={setDrawer}
                onOpenAiDecomposition={() => setAiDecompositionOpen(true)}
              />
            )}
            {view === 'task' && (
              <TasksPage tasks={tasks} goals={goals} todos={todos} setDrawer={setDrawer} updateTask={updateTask} />
            )}
            {view === 'todo' && (
              <TodosPage
                todos={todos}
                goals={goals}
                tasks={tasks}
                templates={templates}
                setDrawer={setDrawer}
                updateTodo={updateTodo}
                completeTodo={completeTodo}
                setTemplates={setTemplates}
              />
            )}
            {view === 'habit' && (
              <HabitsPage habits={habits} goals={goals} setDrawer={setDrawer} scoreHabit={scoreHabit} />
            )}
            {view === 'focus' && (
              <FocusPage tasks={tasks} sessions={sessions} setSessions={setSessions} updateTask={updateTask} />
            )}
            {view === 'mindmap' && <MindMapPage goals={goals} tasks={tasks} />}
          </main>
        </Flex>
      </Flex>
      {drawer && (
        <EntityDrawer
          drawer={drawer}
          goals={goals}
          tasks={tasks}
          todos={todos}
          habits={habits}
          templates={templates}
          onClose={() => setDrawer(null)}
          onSave={saveEntity}
        />
      )}
      <AiDecompositionDrawer
        open={aiDecompositionOpen}
        goalId={selectedGoal}
        goals={goals}
        tasks={tasks}
        todos={todos}
        habits={habits}
        setDrawer={setDrawer}
        saveEntity={saveEntity}
        onClose={() => setAiDecompositionOpen(false)}
      />
    </ConfigProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
const inspector = bootstrapPrototypeInspector();
if (import.meta.hot) import.meta.hot.dispose(inspector.destroy);
