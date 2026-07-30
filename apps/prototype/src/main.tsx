import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import zhCN from '@sue/design-web-react/locale/zh_CN';
import '@sue/design-web-react/dist/sue.css';
import { AlarmClock, Goal as GoalIcon } from 'lucide-react';
import { Button, ConfigProvider, Flex, Menu, Space, Tag, message } from '@sue/design-web-react';
import { EntityDrawer, FocusTimer } from './shared/components';
import { productRef } from './product-wiki';
import { bootstrapPrototypeInspectorBridge } from '../prototype-inspector/bridge';
import { AiDecompositionDrawer } from './pages/goal/AiDecompositionDrawer';
import { GoalsPage } from './pages/goal';
import { MindMapPage } from './pages/goal/MindMapPage';
import { Workbench } from './pages/workbench';
import { TasksPage } from './pages/task';
import { TodosPage } from './pages/todo';
import { HabitsPage } from './pages/habit';
import { initialGoals, initialHabits, initialTasks, initialTodos, nav, TODAY } from './shared/mock-data';
import type {
  DrawerKind,
  DrawerState,
  FocusSession,
  Goal,
  Habit,
  SaveEntity,
  Task,
  Todo,
} from './shared/types';
import { nextHabitOccurrence, nextHabitOccurrenceOnOrAfter } from './shared/utils';
import './App.css';
import styles from './App.module.css';

const isPendingTodo = (todo: Todo) => todo.status !== 'done' && todo.status !== 'abandoned';

function createHabitTodo(habit: Habit, planned: string): Todo {
  return {
    id: `habit-${habit.id}-${planned}`,
    title: habit.title,
    description: `由习惯“${habit.title}”的周期执行自动生成。`,
    habitId: habit.id,
    status: 'todo',
    importance: habit.importance,
    urgency: habit.importance,
    planned,
    plannedStartTime: '09:00',
    plannedEndTime: '10:00',
    history: [`${planned} 由习惯周期生成`],
  };
}

function recordHabitResult(habit: Habit, date: string, completed: boolean): Habit {
  const logs = [...habit.logs.filter((log) => log.date !== date), { date, completed }];
  const streak = completed ? habit.streak + 1 : 0;
  return { ...habit, streak, longest: Math.max(habit.longest, streak), logs };
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [goals, setGoals] = useState(initialGoals);
  const [tasks, setTasks] = useState(initialTasks);
  const [todos, setTodos] = useState(initialTodos);
  const [habits, setHabits] = useState(initialHabits);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [focusTimerOpen, setFocusTimerOpen] = useState(false);
  const [focusTimerTaskId, setFocusTimerTaskId] = useState<string>();
  const [selectedGoal, setSelectedGoal] = useState('g3');
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [aiDecompositionOpen, setAiDecompositionOpen] = useState(false);
  const currentNav = nav.find((item) => item.path === location.pathname)
    || nav.find((item) => location.pathname.startsWith(`${item.path}/`))
    || nav[0];

  const notify = (text: string) => message.success(text);
  const updateTodo = (id: string, patch: Partial<Todo>, event?: string) =>
    setTodos((items) =>
      items.map((todo) =>
        todo.id === id ? { ...todo, ...patch, history: event ? [...todo.history, event] : todo.history } : todo
      )
    );
  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((items) => items.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  const openFocusTimer = useCallback((taskId?: string) => {
    setFocusTimerTaskId(taskId);
    setFocusTimerOpen(true);
  }, []);
  const resolveHabitTodo = (todo: Todo, completed: boolean) => {
    const habit = habits.find((item) => item.id === todo.habitId);
    if (!habit || !isPendingTodo(todo)) return;
    const next = createHabitTodo(habit, nextHabitOccurrence(todo.planned, habit.frequency));
    setTodos((items) => {
      if (!items.some((item) => item.id === todo.id && isPendingTodo(item))) return items;
      const settled = items.map((item): Todo =>
        item.id === todo.id
          ? { ...item, status: completed ? 'done' : 'abandoned', history: [...item.history, completed ? '完成习惯待办' : '标记习惯未完成'] }
          : item,
      );
      return settled.some((item) => item.id === next.id) ? settled : [...settled, next];
    });
    setHabits((items) => items.map((item) => (item.id === habit.id ? recordHabitResult(item, todo.planned, completed) : item)));
    notify(completed ? '习惯已完成，已安排下一次待办' : '已记录未完成，已安排下一次待办');
  };
  const completeTodo = (todo: Todo) => {
    if (todo.habitId) return resolveHabitTodo(todo, true);
    updateTodo(todo.id, { status: 'done' }, '完成待办');
    notify('待办已完成');
  };
  const markTodoIncomplete = (todo: Todo) => {
    if (todo.habitId) return resolveHabitTodo(todo, false);
    updateTodo(todo.id, { status: 'abandoned' }, '标记未完成');
    notify('待办已标记为未完成');
  };
  const saveEntity: SaveEntity = (kind: DrawerKind, draft: Goal | Task | Todo | Habit) => {
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
          : [...items, { ...(draft as Task), status: 'todo' }];
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
      setTodos((items) =>
        exists
          ? items.map((item) =>
              item.id === todo.id ? { ...todo, history: [...item.history, '更新待办信息'] } : item
            )
          : [...items, { ...todo, status: 'todo' }]
      );
    }
    setDrawer(null);
    notify('已保存并同步相关视图');
  };
  useEffect(() => {
    const missing = habits
      .filter((habit) => habit.status === 'active')
      .filter((habit) => !todos.some((todo) => todo.habitId === habit.id && isPendingTodo(todo)))
      .map((habit) => createHabitTodo(habit, nextHabitOccurrenceOnOrAfter(TODAY, habit.frequency)));
    if (!missing.length) return;
    setTodos((items) => [...items, ...missing.filter((todo) => !items.some((item) => item.id === todo.id))]);
  }, [habits, todos]);

  useEffect(() => {
    const overdue = todos.filter((todo) => todo.habitId && isPendingTodo(todo) && todo.planned < TODAY);
    if (!overdue.length) return;
    const habitById = new Map(habits.map((habit) => [habit.id, habit]));
    setTodos((items) =>
      items.flatMap((todo) => {
        const habit = todo.habitId ? habitById.get(todo.habitId) : undefined;
        if (!habit || !overdue.some((item) => item.id === todo.id)) return [todo];
        const nextDate = nextHabitOccurrenceOnOrAfter(TODAY, habit.frequency);
        return [
          { ...todo, status: 'abandoned', history: [...todo.history, '逾期未确认，自动记为未完成'] },
          createHabitTodo(habit, nextDate),
        ];
      }),
    );
    setHabits((items) =>
      items.map((habit) =>
        overdue
          .filter((todo) => todo.habitId === habit.id)
          .reduce((nextHabit, todo) => recordHabitResult(nextHabit, todo.planned, false), habit),
      ),
    );
  }, [habits, todos]);

  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1677ff', controlHeight: 32, borderRadius: 6 } }}>
      <Flex className={styles.appShell} container="full">
        <Flex vertical className={styles.sidebar} container="fixed" data-product-ref={productRef('global.overview')}>
          <Flex className={styles.brand} align="center" gap={10}>
            <span>
              <GoalIcon size={17} />
            </span>
            知止
          </Flex>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[currentNav.path]}
            items={nav.map((item) => {
              const Icon = item.icon;
              return { key: item.path, icon: <Icon size={16} />, label: item.label };
            })}
            onClick={({ key }) => navigate(key)}
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
                个人成长 / <b>{currentNav.label}</b>
              </span>
            </div>
            <Space>
              <Button type="text" icon={<AlarmClock size={16} />} aria-label="打开专注计时" onClick={() => openFocusTimer()} />
            </Space>
          </Flex>
          <main className={styles.content}>
            <Routes>
              <Route
                path="/workbench"
                element={
                  <Workbench
                    goals={goals}
                    tasks={tasks}
                    todos={todos}
                    habits={habits}
                    onNavigate={navigate}
                    completeTodo={completeTodo}
                    markTodoIncomplete={markTodoIncomplete}
                  />
                }
              />
              <Route
                path="/goals"
                element={
                  <GoalsPage
                    goals={goals}
                    tasks={tasks}
                    habits={habits}
                    selectedGoal={selectedGoal}
                    setSelectedGoal={setSelectedGoal}
                    setDrawer={setDrawer}
                    onOpenAiDecomposition={() => setAiDecompositionOpen(true)}
                  />
                }
              />
              <Route
                path="/goals/mindmap"
                element={<MindMapPage goals={goals} tasks={tasks} />}
              />
              <Route
                path="/tasks"
                element={
                  <TasksPage
                    tasks={tasks}
                    goals={goals}
                    todos={todos}
                    setDrawer={setDrawer}
                    updateTask={updateTask}
                    onFocusTask={(task) => openFocusTimer(task.id)}
                  />
                }
              />
              <Route
                path="/todos"
                element={
                  <TodosPage
                    todos={todos}
                    goals={goals}
                    tasks={tasks}
                    habits={habits}
                    setDrawer={setDrawer}
                    completeTodo={completeTodo}
                    markTodoIncomplete={markTodoIncomplete}
                  />
                }
              />
              <Route
                path="/habits"
                element={<HabitsPage habits={habits} goals={goals} todos={todos} setDrawer={setDrawer} completeTodo={completeTodo} markTodoIncomplete={markTodoIncomplete} />}
              />
              <Route path="*" element={<Navigate to={nav[0].path} replace />} />
            </Routes>
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
          onClose={() => setDrawer(null)}
          onSave={saveEntity}
          onFocusTask={(task) => openFocusTimer(task.id)}
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
      <FocusTimer
        open={focusTimerOpen}
        initialTaskId={focusTimerTaskId}
        tasks={tasks}
        sessions={sessions}
        onClose={() => setFocusTimerOpen(false)}
        onTaskSelected={() => setFocusTimerTaskId(undefined)}
        setSessions={setSessions}
        updateTask={updateTask}
      />
    </ConfigProvider>
  );
}

const inspectorBridge = bootstrapPrototypeInspectorBridge();
if (import.meta.hot) import.meta.hot.dispose(inspectorBridge.destroy);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
